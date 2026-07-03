"use client";

import React, { useRef, useState, useEffect } from 'react';
import { DuoCameraView } from './DuoCameraView';
import { SlotGrid } from './SlotGrid';
import { useDuoStore } from '@/store/useDuoStore';
import { DuoFilterSelector } from './DuoFilterSelector';
import { ClayButton } from '@/components/ui/clay-button';
import { Camera, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CaptureView({
  isHost,
  localStream,
  remoteStream,
  localVideoRef,
  triggerCaptureIntent,
  retakeRoundIntent,
  onCursorMove,
  onFilterSelect,
  onCountdownDurationSelect
}) {
  const store = useDuoStore();
  const {
    photos,
    currentRound,
    phase,
    countdown,
    captureLock,
    activeFilterId,
    remoteCursor,
    remoteCursorTimestamp,
    countdownDuration
  } = store;

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
        {/* Left Side: Side-by-side cameras, control panel & filter selector */}
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

            {/* Non-intrusive Floating Countdown Badge */}
            {isCountdownActive && (
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-[#FFECA1] border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] rounded-full px-8 py-3 z-30 flex items-center justify-center animate-bounce">
                <span className="text-2xl font-black uppercase text-[#2D3748] tracking-wider whitespace-nowrap">
                  {countdown === 0 ? '📸 CHEESE!' : `SMILE IN ${countdown}s`}
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

          {/* Capture Control Panel */}
          <div className="bg-white p-6 rounded-2xl border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <select
                value={countdownDuration}
                disabled={!!captureLock || isCountdownActive}
                onChange={(e) => onCountdownDurationSelect(Number(e.target.value))}
                className="appearance-none w-full bg-white text-[#2D3748] text-sm font-black px-5 py-3.5 pr-12 rounded-xl border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#2D3748] active:translate-y-1 active:shadow-[1px_1px_0px_0px_#2D3748] focus:outline-none cursor-pointer transition-all"
              >
                <option value={3}>3s Timer</option>
                <option value={5}>5s Timer</option>
                <option value={10}>10s Timer</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-[#2D3748]">
                <ChevronDown className="w-4 h-4 stroke-[3px]" />
              </div>
            </div>

            {isCountdownActive ? (
              <div className="w-full sm:flex-1 h-14 flex items-center justify-center bg-[#FFECA1] border-3 border-[#2D3748] rounded-xl shadow-[4px_4px_0px_0px_#2D3748] text-lg font-black uppercase tracking-wider animate-pulse">
                {countdown === 0 ? '📸 CHEESE!' : `Taking photo in ${countdown}...`}
              </div>
            ) : (
              <ClayButton
                variant="success"
                size="lg"
                disabled={!!captureLock}
                onClick={triggerCaptureIntent}
                className="w-full sm:flex-1 h-14 text-base font-black uppercase tracking-wider rounded-xl border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#2D3748] active:translate-y-1 active:shadow-[1px_1px_0px_0px_#2D3748] transition-all bg-[#86EFAC] text-[#2D3748]"
              >
                <Camera className="w-5 h-5 mr-2" />
                Capture Round {currentRound}
              </ClayButton>
            )}
          </div>

          {/* Status Banner */}
          {captureLock && (
            <div className="p-4 rounded-xl border-3 border-[#2D3748] bg-[#FFECA1] font-bold text-center shadow-[4px_4px_0px_0px_#2D3748] animate-pulse">
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

        {/* Right Side: Slot Grid */}
        <div className="bg-white p-6 rounded-2xl border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] h-fit">
          <SlotGrid
            photos={photos}
            currentRound={currentRound}
            phase={phase}
            onRetakeRound={retakeRoundIntent}
          />
        </div>
      </div>
    </div>
  );
}
