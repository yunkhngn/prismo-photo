"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { usePeer } from '@/hooks/usePeer';
import { useDuoStore, loadPersistedSession } from '@/store/useDuoStore';
import { LobbyView } from './LobbyView';
import { CaptureView } from './CaptureView';
import { DuoExportView } from './DuoExportView';
import { Loader2 } from 'lucide-react';
import { FILTERS } from '@/components/photobooth/FilterSelector';
import { ReconnectBanner } from './ReconnectBanner';
import { RoomErrorView } from './RoomErrorView';
import { ClayCard } from '@/components/ui/clay-card';
import { ClayButton } from '@/components/ui/clay-button';

const DUO_PHOTO_MAX_EDGE = 1280;
const DUO_PHOTO_JPEG_QUALITY = 0.85;

const RECONNECT_INTERVAL_MS = 5000;
const RECONNECT_INTERVAL_UNAVAILABLE_ID_MS = 3000;
const MAX_RECONNECT_ATTEMPTS = 6;
const MAX_UNAVAILABLE_ID_ATTEMPTS = 5;

function captureLocalFrame(video, filterCss = 'none') {
  if (!video) return null;

  const sourceWidth = video.videoWidth || 640;
  const sourceHeight = video.videoHeight || 480;
  const longestEdge = Math.max(sourceWidth, sourceHeight);
  const scale = longestEdge > DUO_PHOTO_MAX_EDGE ? DUO_PHOTO_MAX_EDGE / longestEdge : 1;
  const width = Math.round(sourceWidth * scale);
  const height = Math.round(sourceHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  
  if (filterCss && filterCss !== 'none') {
    ctx.filter = filterCss;
  }
  
  // Mirror
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', DUO_PHOTO_JPEG_QUALITY);
}

export function DuoApp({ roomId }) {
  const store = useDuoStore();
  const { videoRef, startCamera, permissionStatus, stream } = useCamera();
  const [fatalRoomError, setFatalRoomError] = useState(null); // 'room_full' | 'not_found' | null

  // Decide role
  const isInitialized = useRef(false);
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const persisted = loadPersistedSession();
    let role = 'guest';

    if (persisted && persisted.roomId === roomId) {
      role = persisted.role;
      useDuoStore.getState().initSession({ roomId, role });
      if (persisted.snapshot) {
        useDuoStore.getState().applySnapshot(persisted.snapshot);
      }
    } else {
      const searchParams = new URLSearchParams(window.location.search);
      role = searchParams.get('host') === '1' ? 'host' : 'guest';
      useDuoStore.getState().initSession({ roomId, role });
    }
  }, [roomId]);

  const role = store.role;
  const isHost = role === 'host';

  // State Sync handler
  // Host is source of truth and pushes state updates to Guest.
  // Only re-sends when the syncable fields actually changed (e.g. NOT on cursor moves).
  useEffect(() => {
    if (!isHost || store.connectionState !== 'connected') return;

    let lastSentSnapshot = null;
    const sendIfChanged = () => {
      const snapshot = useDuoStore.getState().getSnapshot();
      const serialized = JSON.stringify(snapshot);
      if (serialized === lastSentSnapshot) return;
      lastSentSnapshot = serialized;
      send({ type: 'state_sync', snapshot });
    };

    const unsubscribe = useDuoStore.subscribe(sendIfChanged);
    sendIfChanged(); // send immediate snapshot on start
    return () => unsubscribe();
  }, [isHost, store.connectionState]);

  // Real-time peerJS wiring
  const onData = (msg) => {
    const {
      setPeerPresent,
      applySnapshot,
      setCaptureLock,
      setCountdown,
      setPhoto,
      advanceRoundIfComplete,
      retakeRound,
      setFilter,
      setFrame,
      setRemoteCursor,
      resetSession,
      setCountdownDuration
    } = useDuoStore.getState();

    switch (msg.type) {
      case 'hello':
        setPeerPresent(true);
        if (isHost) {
          send({ type: 'state_sync', snapshot: useDuoStore.getState().getSnapshot() });
        }
        break;

      case 'room_full':
        setFatalRoomError('room_full');
        break;

      case 'state_sync':
        if (!isHost) {
          applySnapshot(msg.snapshot);
        }
        break;

      case 'take_photo_intent':
        if (isHost) {
          const state = useDuoStore.getState();
          if (!state.captureLock) {
            setCaptureLock({ round: state.currentRound, lockedBy: 'guest' });
            setCountdown(state.countdownDuration);
          }
        }
        break;

      case 'trigger_capture':
        if (!isHost) {
          const activeFilterId = useDuoStore.getState().activeFilterId;
          const filterObj = FILTERS.find(f => f.id === activeFilterId) || FILTERS[0];
          const guestFrame = captureLocalFrame(videoRef.current, filterObj.css);
          if (guestFrame) {
            send({
              type: 'photo_captured',
              round: useDuoStore.getState().currentRound,
              dataUrl: guestFrame
            });
          }
        }
        break;

      case 'photo_captured':
        if (isHost) {
          setPhoto(msg.round, 'guest', msg.dataUrl);
          advanceRoundIfComplete();
        }
        break;

      case 'retake_round_intent':
        if (isHost) {
          retakeRound(msg.round);
        }
        break;

      case 'retake_all_intent':
        if (isHost) {
          resetSession();
        }
        break;

      case 'cursor_move':
        setRemoteCursor({ x: msg.x, y: msg.y });
        break;

      case 'update_filter':
        if (isHost) {
          setFilter(msg.filterId);
        }
        break;

      case 'update_frame':
        if (isHost) {
          setFrame(msg.frameId);
        }
        break;

      case 'update_countdown_duration':
        if (isHost) {
          setCountdownDuration(msg.duration);
        }
        break;

      default:
        console.warn("Unhandled message type:", msg.type);
    }
  };

  const onPeerConnected = () => {
    useDuoStore.getState().setPeerPresent(true);
    useDuoStore.getState().setConnectionState('connected');
  };

  const onPeerDisconnected = () => {
    useDuoStore.getState().setPeerPresent(false);
    useDuoStore.getState().setConnectionState('reconnecting');
  };

  const { connectionState, send, callWithStream, remoteStream, reconnect, lastErrorType } = usePeer({
    roomId,
    isHost,
    onData,
    onPeerConnected,
    onPeerDisconnected
  });

  // Share local stream with peer as soon as it becomes available
  useEffect(() => {
    if (stream) {
      callWithStream(stream);
    }
  }, [stream, callWithStream]);

  // Sync connection state to store
  useEffect(() => {
    useDuoStore.getState().setConnectionState(connectionState);
  }, [connectionState]);

  // Countdown timer on Host
  const countdown = store.countdown;
  useEffect(() => {
    if (!isHost) return;
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        useDuoStore.getState().setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Send trigger to guest
      send({ type: 'trigger_capture' });

      // Capture host photo
      const activeFilterId = useDuoStore.getState().activeFilterId;
      const filterObj = FILTERS.find(f => f.id === activeFilterId) || FILTERS[0];
      const hostFrame = captureLocalFrame(videoRef.current, filterObj.css);
      if (hostFrame) {
        useDuoStore.getState().setPhoto(store.currentRound, 'host', hostFrame);
      }

      // Reset countdown & advance
      useDuoStore.getState().setCountdown(null);
      useDuoStore.getState().advanceRoundIfComplete();
    }
  }, [countdown, isHost, send, store.currentRound, videoRef]);

  // Trigger Capture Intent
  const triggerCaptureIntent = () => {
    const state = useDuoStore.getState();
    if (state.captureLock) return; // already locked
    if (isHost) {
      useDuoStore.getState().setCaptureLock({ round: state.currentRound, lockedBy: 'host' });
      useDuoStore.getState().setCountdown(state.countdownDuration);
    } else {
      send({ type: 'take_photo_intent', from: 'guest' });
    }
  };

  // Retake Round Intent
  const retakeRoundIntent = (round) => {
    if (isHost) {
      useDuoStore.getState().retakeRound(round);
    } else {
      send({ type: 'retake_round_intent', round });
    }
  };

  // Cursor Move message
  const onCursorMove = (coords) => {
    send({ type: 'cursor_move', ...coords });
  };

  // Filter Selection message
  const onFilterSelect = (filterId) => {
    if (isHost) {
      useDuoStore.getState().setFilter(filterId);
    } else {
      send({ type: 'update_filter', filterId });
    }
  };

  // Frame Selection message
  const onFrameSelect = (frameId) => {
    if (isHost) {
      useDuoStore.getState().setFrame(frameId);
    } else {
      send({ type: 'update_frame', frameId });
    }
  };

  // Retake All action
  const onRetakeAll = () => {
    if (isHost) {
      useDuoStore.getState().resetSession();
    } else {
      send({ type: 'retake_all_intent' });
    }
  };

  // Countdown Duration Selection action
  const onCountdownDurationSelect = (duration) => {
    if (isHost) {
      useDuoStore.getState().setCountdownDuration(duration);
    } else {
      send({ type: 'update_countdown_duration', duration });
    }
  };

  // Disconnect & Reconnect triggers
  const showDisconnectOverlay = (store.phase !== 'LOBBY') && 
    (store.connectionState === 'reconnecting' || store.connectionState === 'error' || !store.peerPresent);

  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const isUnavailableId = lastErrorType === 'unavailable-id';
  const maxReconnectAttempts = isUnavailableId ? MAX_UNAVAILABLE_ID_ATTEMPTS : MAX_RECONNECT_ATTEMPTS;
  const reconnectInterval = isUnavailableId ? RECONNECT_INTERVAL_UNAVAILABLE_ID_MS : RECONNECT_INTERVAL_MS;
  const autoRetryExhausted = !isHost && reconnectAttempts >= maxReconnectAttempts;

  useEffect(() => {
    if (!showDisconnectOverlay || isHost) {
      setReconnectAttempts(0);
      return;
    }
    if (reconnectAttempts >= maxReconnectAttempts) return; // manual-only from here

    const timer = setTimeout(() => {
      setReconnectAttempts((n) => n + 1);
      reconnect();
    }, reconnectInterval);

    return () => clearTimeout(timer);
  }, [showDisconnectOverlay, isHost, reconnect, reconnectAttempts, maxReconnectAttempts, reconnectInterval]);

  useEffect(() => {
    if (!isHost && lastErrorType === 'peer-unavailable' && store.phase === 'LOBBY') {
      setFatalRoomError('not_found');
    }
  }, [isHost, lastErrorType, store.phase]);

  if (fatalRoomError) {
    return <RoomErrorView type={fatalRoomError} />;
  }

  // Renders by phase
  if (!role) {
    return (
      <div className="min-h-screen bg-[#fff9f5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2D3748]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff9f5] py-8">
      {store.phase === 'LOBBY' && (
        <LobbyView
          roomId={roomId}
          isHost={isHost}
          connectionState={store.connectionState}
          localStream={stream}
          remoteStream={remoteStream}
          startCamera={startCamera}
          permissionStatus={permissionStatus}
          videoRef={videoRef}
        />
      )}
      {store.phase === 'CAPTURE' && (
        <CaptureView
          isHost={isHost}
          localStream={stream}
          remoteStream={remoteStream}
          localVideoRef={videoRef}
          triggerCaptureIntent={triggerCaptureIntent}
          retakeRoundIntent={retakeRoundIntent}
          onCursorMove={onCursorMove}
          onFilterSelect={onFilterSelect}
          onCountdownDurationSelect={onCountdownDurationSelect}
        />
      )}
      {store.phase === 'EXPORT' && (
        <DuoExportView
          isHost={isHost}
          onFrameSelect={onFrameSelect}
          onRetakeAll={onRetakeAll}
          onCursorMove={onCursorMove}
        />
      )}

      {showDisconnectOverlay && (
        <ReconnectBanner autoRetryExhausted={autoRetryExhausted} onReconnect={reconnect} />
      )}
    </div>
  );
}
