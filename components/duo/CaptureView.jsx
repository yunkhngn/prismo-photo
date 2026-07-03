"use client";

import React, { useRef, useState, useEffect } from 'react';
import { DuoCameraView } from './DuoCameraView';
import { SlotGrid } from './SlotGrid';
import { useDuoStore } from '@/store/useDuoStore';
import { DuoFilterSelector } from './DuoFilterSelector';

export function CaptureView({
  isHost,
  localStream,
  remoteStream,
  localVideoRef,
  triggerCaptureIntent,
  retakeRoundIntent,
  onCursorMove,
  onFilterSelect
}) {
  const store = useDuoStore();
  const { photos, currentRound, phase, countdown, captureLock, activeFilterId, remoteCursor, remoteCursorTimestamp } = store;

  const containerRef = useRef(null);
  const lastSentRef = useRef(0);
  const [showCursor, setShowCursor] = useState(false);

  // Monitor remote cursor status for 2s expiration
  useEffect(() => {
    if (!remoteCursor || !remoteCursorTimestamp) {
      setShowCursor(false);
      return;
    }

    setShowCursor(Date.now() - remoteCursorTimestamp < 2000);

    const interval = setInterval(() => {
      const active = Date.now() - remoteCursorTimestamp < 2000;
      setShowCursor(active);
      if (!active) {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [remoteCursor, remoteCursorTimestamp]);

  // Track mouse coordinates on container and send throttled updates
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const now = Date.now();
    if (now - lastSentRef.current < 50) return; // throttle 50ms
    lastSentRef.current = now;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    onCursorMove({ x, y });
  };

  // Render countdown overlay over camera views
  const isCountdownActive = countdown !== null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-sans text-[#2D3748]">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Capture Duo Strip</h1>
        <p className="text-slate-500 font-bold text-lg">Synchronized countdown. Smile together!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Side-by-side cameras & filter selector */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative grid grid-cols-1 md:grid-cols-2 gap-4 w-full cursor-crosshair overflow-hidden p-2 rounded-2xl"
          >
            {/* Local Stream */}
            <div className="relative">
              <DuoCameraView
                stream={localStream}
                activeFilterId={activeFilterId}
                isLocal={true}
                videoRef={localVideoRef}
              />
            </div>

            {/* Remote Stream */}
            <div className="relative">
              <DuoCameraView
                stream={remoteStream}
                activeFilterId={activeFilterId}
                isLocal={false}
              />
            </div>

            {/* Countdown Overlay */}
            {isCountdownActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[3px] z-30 rounded-2xl border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] m-2">
                <span className="text-[100px] font-black text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] animate-in zoom-in duration-200">
                  {countdown === 0 ? 'CHEESE!' : countdown}
                </span>
              </div>
            )}

            {/* Sync Remote Cursor Overlay */}
            {showCursor && remoteCursor && (
              <div
                className="absolute pointer-events-none z-40 transition-all duration-75 ease-out"
                style={{
                  left: `${remoteCursor.x * 100}%`,
                  top: `${remoteCursor.y * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="relative">
                  <div className="w-5 h-5 rounded-full bg-[#FFCFE3] border-3 border-[#2D3748] shadow-[2px_2px_0px_0px_#2D3748] animate-ping absolute" />
                  <div className="w-5 h-5 rounded-full bg-[#FFCFE3] border-3 border-[#2D3748] shadow-[2px_2px_0px_0px_#2D3748] relative flex items-center justify-center">
                    <span className="text-[8px] font-black text-[#2D3748]">P</span>
                  </div>
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-[#2D3748] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md whitespace-nowrap shadow-[2px_2px_0px_0px_#FFCFE3] uppercase border border-white">
                    Partner
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status Banner */}
          {captureLock && (
            <div className="p-4 rounded-xl border-3 border-[#2D3748] bg-[#FFECA1] font-bold text-center shadow-[4px_4px_0px_0px_#2D3748]">
              {captureLock.lockedBy === (isHost ? 'host' : 'guest') ? 'You' : 'Your partner'} initiated capture! Get ready!
            </div>
          )}

          {/* Sync Filter Selector */}
          <div className="bg-white p-4 rounded-2xl border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748]">
            <h3 className="font-bold text-sm mb-2 px-4 uppercase text-slate-500">Choose Filter</h3>
            <DuoFilterSelector
              activeFilterId={activeFilterId}
              onSelect={onFilterSelect}
            />
          </div>
        </div>

        {/* Right Side: Slot Grid & controls */}
        <div className="bg-white p-6 rounded-2xl border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] h-fit">
          <SlotGrid
            photos={photos}
            currentRound={currentRound}
            phase={phase}
            onTriggerCapture={triggerCaptureIntent}
            onRetakeRound={retakeRoundIntent}
            isHost={isHost}
          />
        </div>
      </div>
    </div>
  );
}
