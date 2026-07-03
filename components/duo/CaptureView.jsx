"use client";

import React from 'react';
import { DuoCameraView } from './DuoCameraView';
import { SlotGrid } from './SlotGrid';
import { useDuoStore } from '@/store/useDuoStore';
import { FilterSelector } from '../photobooth/FilterSelector';

export function CaptureView({
  isHost,
  localStream,
  remoteStream,
  localVideoRef,
  triggerCaptureIntent,
  retakeRoundIntent
}) {
  const store = useDuoStore();
  const { photos, currentRound, phase, countdown, captureLock, activeFilterId } = store;

  // Render countdown overlay over camera views
  const isCountdownActive = countdown !== null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 font-sans text-[#2D3748]">
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Capture Duo Strip</h1>
        <p className="text-slate-500 font-bold">Synchronized countdown. Smile together!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Side-by-side cameras & filter selector */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
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
          </div>

          {/* Status Banner */}
          {captureLock && (
            <div className="p-4 rounded-xl border-3 border-[#2D3748] bg-[#FFECA1] font-bold text-center shadow-[4px_4px_0px_0px_#2D3748]">
              {captureLock.lockedBy === (isHost ? 'host' : 'guest') ? 'You' : 'Your partner'} initiated capture! Get ready!
            </div>
          )}

          {/* Filter Selector (only host can sync filter changes - Task 6 will do LWW sync, but we render it here) */}
          <div className="bg-white p-4 rounded-2xl border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748]">
            <h3 className="font-bold text-sm mb-2 px-4 uppercase text-slate-500">Choose Filter</h3>
            <FilterSelector />
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
