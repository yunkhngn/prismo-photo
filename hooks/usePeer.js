"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

export function generateRoomId() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(8);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    // fallback if called in SSR/non-browser environment
    for (let i = 0; i < 8; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  let result = 'prismo-';
  for (let i = 0; i < 8; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

export function usePeer({ roomId, isHost, onData, onRemoteStream, onPeerConnected, onPeerDisconnected }) {
  const [connectionState, setConnectionState] = useState('idle');
  const [remoteStream, setRemoteStream] = useState(null);
  const [lastErrorType, setLastErrorType] = useState(null);

  const peerRef = useRef(null);
  const connRef = useRef(null);
  const mediaCallRef = useRef(null);
  const localStreamRef = useRef(null);

  // Store callbacks in refs to avoid useEffect teardowns when callbacks change
  const callbacksRef = useRef({
    onData,
    onRemoteStream,
    onPeerConnected,
    onPeerDisconnected
  });

  useEffect(() => {
    callbacksRef.current = {
      onData,
      onRemoteStream,
      onPeerConnected,
      onPeerDisconnected
    };
  }, [onData, onRemoteStream, onPeerConnected, onPeerDisconnected]);

  const cleanup = useCallback(() => {
    if (mediaCallRef.current) {
      mediaCallRef.current.close();
      mediaCallRef.current = null;
    }
    if (connRef.current) {
      connRef.current.close();
      connRef.current = null;
    }
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    setConnectionState('idle');
    setRemoteStream(null);
  }, []);

  const setupDataConnection = useCallback((conn) => {
    connRef.current = conn;

    conn.on('open', () => {
      console.log("Data connection established");
      setConnectionState('connected');
      
      if (callbacksRef.current.onPeerConnected) {
        callbacksRef.current.onPeerConnected();
      }

      if (!isHost) {
        // Guest sends hello
        conn.send(JSON.stringify({ type: 'hello', role: 'guest' }));
        // Guest initiates media call once data connection is open
        if (peerRef.current && localStreamRef.current) {
          console.log("Guest calling host with stream...");
          const call = peerRef.current.call(roomId, localStreamRef.current);
          mediaCallRef.current = call;
          call.on('stream', (stream) => {
            console.log("Guest received remote media stream");
            setRemoteStream(stream);
            if (callbacksRef.current.onRemoteStream) {
              callbacksRef.current.onRemoteStream(stream);
            }
          });
          call.on('close', () => {
            setRemoteStream(null);
            if (callbacksRef.current.onRemoteStream) {
              callbacksRef.current.onRemoteStream(null);
            }
          });
          call.on('error', (err) => {
            console.error("Guest call error:", err);
          });
        }
      }
    });

    conn.on('data', (rawMsg) => {
      try {
        const msg = typeof rawMsg === 'string' ? JSON.parse(rawMsg) : rawMsg;
        if (callbacksRef.current.onData) {
          callbacksRef.current.onData(msg);
        }
      } catch (e) {
        console.error("Error parsing message from peer:", e, rawMsg);
      }
    });

    conn.on('close', () => {
      console.log("Data connection closed");
      setConnectionState('reconnecting');
      connRef.current = null;
      if (callbacksRef.current.onPeerDisconnected) {
        callbacksRef.current.onPeerDisconnected();
      }
    });

    conn.on('error', (err) => {
      console.error("Data connection error:", err);
    });
  }, [isHost, roomId]);

  const initPeer = useCallback(() => {
    if (typeof window === 'undefined') return;

    cleanup();
    setConnectionState('connecting');

    import('peerjs').then(({ Peer }) => {
      // Free PeerJS cloud broker config
      const peer = isHost ? new Peer(roomId) : new Peer();
      peerRef.current = peer;

      peer.on('open', (id) => {
        setLastErrorType(null);
        console.log(`Peer connection opened. My ID is: ${id}`);
        if (!isHost) {
          // Guest initiates connection to Host
          const conn = peer.connect(roomId, { reliable: true });
          setupDataConnection(conn);
        }
      });

      // Host handles incoming data connections
      peer.on('connection', (conn) => {
        if (isHost) {
          if (connRef.current) {
            // Already have a guest. Reject/close extra connections.
            console.log("Rejecting extra peer connection");
            conn.on('open', () => {
              conn.send(JSON.stringify({ type: 'room_full' }));
              setTimeout(() => conn.close(), 500);
            });
            return;
          }
          setupDataConnection(conn);
        }
      });

      // Handle incoming media calls (Host receives call from Guest)
      peer.on('call', (call) => {
        console.log("Received incoming call");
        mediaCallRef.current = call;
        call.answer(localStreamRef.current || undefined);
        call.on('stream', (stream) => {
          console.log("Received remote media stream");
          setRemoteStream(stream);
          if (callbacksRef.current.onRemoteStream) {
            callbacksRef.current.onRemoteStream(stream);
          }
        });
        call.on('close', () => {
          setRemoteStream(null);
          if (callbacksRef.current.onRemoteStream) {
            callbacksRef.current.onRemoteStream(null);
          }
        });
        call.on('error', (err) => {
          console.error("Media call error:", err);
        });
      });

      peer.on('error', (err) => {
        console.error("PeerJS error:", err.type, err);
        setLastErrorType(err.type || 'unknown');
        setConnectionState('error');
      });

      peer.on('disconnected', () => {
        console.log("Peer disconnected from broker, attempting reconnect...");
        peer.reconnect();
      });

      peer.on('close', () => {
        console.log("Peer destroyed");
        setConnectionState('idle');
      });
    }).catch(err => {
      console.error("Failed to load peerjs dynamically:", err);
      setConnectionState('error');
    });
  }, [roomId, isHost, cleanup, setupDataConnection]);

  const send = useCallback((msg) => {
    if (connRef.current && connRef.current.open && connRef.current.dataChannel?.readyState === 'open') {
      try {
        connRef.current.send(JSON.stringify(msg));
      } catch (e) {
        console.warn("Failed to send message over connection:", e);
      }
    } else {
      console.warn("Cannot send message: data connection not open", msg);
    }
  }, []);

  const callWithStream = useCallback((localStream) => {
    localStreamRef.current = localStream;
    // If connection is already open and we are guest, make sure to call
    if (!isHost && peerRef.current && connRef.current && connRef.current.open && !mediaCallRef.current) {
      console.log("calling host with stream asynchronously");
      const call = peerRef.current.call(roomId, localStream);
      mediaCallRef.current = call;
      call.on('stream', (stream) => {
        setRemoteStream(stream);
        if (callbacksRef.current.onRemoteStream) {
          callbacksRef.current.onRemoteStream(stream);
        }
      });
      call.on('close', () => {
        setRemoteStream(null);
        if (callbacksRef.current.onRemoteStream) {
          callbacksRef.current.onRemoteStream(null);
        }
      });
    }
  }, [isHost, roomId]);

  const reconnect = useCallback(() => {
    console.log("Manual reconnect triggered");
    
    if (peerRef.current && !peerRef.current.destroyed) {
      if (peerRef.current.disconnected) {
        console.log("Reconnecting peer to broker...");
        peerRef.current.reconnect();
      }
      
      if (!isHost) {
        console.log("Guest establishing a new datachannel...");
        if (connRef.current) {
          try {
            connRef.current.close();
          } catch (e) {}
        }
        const conn = peerRef.current.connect(roomId, { reliable: true });
        setupDataConnection(conn);
      } else {
        console.log("Host waiting for incoming connections...");
        setConnectionState('connecting');
      }
      return;
    }

    initPeer();
  }, [initPeer, isHost, roomId, setupDataConnection]);

  // Main lifecycle
  useEffect(() => {
    initPeer();
    return () => {
      cleanup();
    };
  }, [initPeer, cleanup]);

  return {
    connectionState,
    send,
    callWithStream,
    remoteStream,
    reconnect,
    lastErrorType
  };
}
