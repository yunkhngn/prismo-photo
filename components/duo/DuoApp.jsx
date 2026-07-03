"use client";

import React, { useEffect, useRef } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { usePeer } from '@/hooks/usePeer';
import { useDuoStore, loadPersistedSession } from '@/store/useDuoStore';
import { LobbyView } from './LobbyView';
import { CaptureView } from './CaptureView';
import { DuoExportView } from './DuoExportView';
import { Loader2 } from 'lucide-react';
import { FILTERS } from '@/components/photobooth/FilterSelector';

function captureLocalFrame(video, filterCss = 'none') {
  if (!video) return null;
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
  const ctx = canvas.getContext('2d');
  
  if (filterCss && filterCss !== 'none') {
    ctx.filter = filterCss;
  }
  
  // Mirror
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0);
  return canvas.toDataURL('image/png');
}

export function DuoApp({ roomId }) {
  const store = useDuoStore();
  const { videoRef, startCamera, permissionStatus, stream } = useCamera();

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
  // Host is source of truth and pushes state updates to Guest
  useEffect(() => {
    if (!isHost || store.connectionState !== 'connected') return;
    const unsubscribe = useDuoStore.subscribe((state) => {
      const snapshot = useDuoStore.getState().getSnapshot();
      send({ type: 'state_sync', snapshot });
    });
    // Send immediate snapshot on start
    const snapshot = useDuoStore.getState().getSnapshot();
    send({ type: 'state_sync', snapshot });
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
      resetSession
    } = useDuoStore.getState();

    switch (msg.type) {
      case 'hello':
        setPeerPresent(true);
        if (isHost) {
          send({ type: 'state_sync', snapshot: useDuoStore.getState().getSnapshot() });
        }
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
            setCountdown(3);
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

      default:
        console.warn("Unhandled message type:", msg.type);
    }
  };

  const onRemoteStream = (remoteStream) => {
    console.log("onRemoteStream called with stream:", remoteStream);
  };

  const onPeerConnected = () => {
    console.log("Peer connected!");
    useDuoStore.getState().setPeerPresent(true);
    useDuoStore.getState().setConnectionState('connected');
  };

  const onPeerDisconnected = () => {
    console.log("Peer disconnected!");
    useDuoStore.getState().setPeerPresent(false);
    useDuoStore.getState().setConnectionState('reconnecting');
  };

  const { connectionState, send, callWithStream, remoteStream, reconnect } = usePeer({
    roomId,
    isHost,
    onData,
    onRemoteStream,
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
      useDuoStore.getState().setCountdown(3);
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
        />
      )}
      {store.phase === 'EXPORT' && (
        <DuoExportView
          isHost={isHost}
          onFrameSelect={onFrameSelect}
          onRetakeAll={onRetakeAll}
        />
      )}
    </div>
  );
}
