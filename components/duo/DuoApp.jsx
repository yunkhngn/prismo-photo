"use client";

import React, { useEffect, useRef } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { usePeer } from '@/hooks/usePeer';
import { useDuoStore, loadPersistedSession } from '@/store/useDuoStore';
import { LobbyView } from './LobbyView';
import { Loader2 } from 'lucide-react';

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

  // Real-time peerJS wiring
  const onData = (msg) => {
    console.log("Received data channel message:", msg);
    if (msg.type === 'hello' && isHost) {
      useDuoStore.getState().setPeerPresent(true);
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
        <div className="max-w-4xl mx-auto text-center font-bold text-xl py-12">
          CAPTURE View Placeholder (Task 5)
        </div>
      )}
      {store.phase === 'EXPORT' && (
        <div className="max-w-4xl mx-auto text-center font-bold text-xl py-12">
          EXPORT View Placeholder (Task 7)
        </div>
      )}
    </div>
  );
}
