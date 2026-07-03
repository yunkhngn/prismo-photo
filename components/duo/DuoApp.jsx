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
import { ClayCard } from '@/components/ui/clay-card';
import { ClayButton } from '@/components/ui/clay-button';

const DUO_PHOTO_MAX_EDGE = 1280;
const DUO_PHOTO_JPEG_QUALITY = 0.85;

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

  useEffect(() => {
    if (!showDisconnectOverlay) return;

    const timer = setTimeout(() => {
      console.log("Auto reconnecting...");
      reconnect();
    }, 3000);

    return () => clearTimeout(timer);
  }, [showDisconnectOverlay, reconnect]);

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
        />
      )}

      {/* Neubrutalism Reconnect Dialog */}
      {showDisconnectOverlay && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-50 flex items-center justify-center p-4">
          <ClayCard className="max-w-md w-full p-8 bg-white border-3 border-[#2D3748] shadow-[8px_8px_0px_0px_#2D3748] text-center flex flex-col items-center gap-4 animate-in zoom-in duration-200">
            <div className="w-16 h-16 rounded-full bg-[#FFECA1] border-3 border-[#2D3748] flex items-center justify-center shadow-[4px_4px_0px_0px_#2D3748] animate-bounce">
              <Loader2 className="w-8 h-8 animate-spin text-[#2D3748]" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#2D3748]">Connection Lost</h2>
            <p className="text-slate-600 font-bold text-sm leading-relaxed">
              We lost connection to your partner. Attempting to reconnect automatically...
            </p>
            <div className="flex gap-3 w-full mt-4">
              <ClayButton
                variant="primary"
                onClick={reconnect}
                className="flex-1 h-12 text-sm font-black uppercase tracking-wider rounded-xl border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#2D3748] transition-all bg-[#BDE7FF] text-[#2D3748]"
              >
                Reconnect Now
              </ClayButton>
            </div>
          </ClayCard>
        </div>
      )}
    </div>
  );
}
