"use client";

import React from 'react';
import { ClayButton } from '@/components/ui/clay-button';
import { Camera, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SlotGrid({ photos, currentRound, phase, onTriggerCapture, onRetakeRound, isHost }) {
  const rounds = [1, 2, 3, 4];

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Strip Slots</h2>
        <span className="text-sm font-bold text-slate-500">
          Round {currentRound} of 4
        </span>
      </div>

      <div className="space-y-4">
        {rounds.map((round) => {
          const hostPhoto = photos[round]?.host;
          const guestPhoto = photos[round]?.guest;
          const isCurrent = round === currentRound && phase === 'CAPTURE';
          const isCompleted = !!(hostPhoto && guestPhoto);

          return (
            <div
              key={round}
              className={cn(
                "p-3 rounded-2xl border-3 border-[#2D3748] transition-all bg-white",
                isCurrent
                  ? "shadow-[4px_4px_0px_0px_#BDE7FF] ring-2 ring-[#BDE7FF]"
                  : "shadow-[2px_2px_0px_0px_#2D3748]"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-xs uppercase text-slate-400">
                  Round {round} {isCurrent && "• Active"}
                </span>
                {isCompleted && (
                  <ClayButton
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs font-bold text-slate-500 hover:text-red-500"
                    onClick={() => onRetakeRound(round)}
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    Retake
                  </ClayButton>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Host Slot */}
                <div
                  className={cn(
                    "relative aspect-[4/3] rounded-xl border-2 overflow-hidden flex items-center justify-center transition-all bg-slate-50",
                    hostPhoto
                      ? "border-[#2D3748]"
                      : "border-dashed border-slate-300",
                    isCurrent && !hostPhoto && "border-yellow-400 bg-yellow-50/20"
                  )}
                >
                  {hostPhoto ? (
                    <img src={hostPhoto} alt={`Host Rd ${round}`} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-slate-400">Host Photo</span>
                  )}
                </div>

                {/* Guest Slot */}
                <div
                  className={cn(
                    "relative aspect-[4/3] rounded-xl border-2 overflow-hidden flex items-center justify-center transition-all bg-slate-50",
                    guestPhoto
                      ? "border-[#2D3748]"
                      : "border-dashed border-slate-300",
                    isCurrent && !guestPhoto && "border-yellow-400 bg-yellow-50/20"
                  )}
                >
                  {guestPhoto ? (
                    <img src={guestPhoto} alt={`Guest Rd ${round}`} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-slate-400">Guest Photo</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {phase === 'CAPTURE' && (
        <ClayButton
          variant="success"
          size="lg"
          onClick={onTriggerCapture}
          className="w-full h-12 text-sm font-black uppercase tracking-wider rounded-xl border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#2D3748] transition-all bg-[#86EFAC] text-[#2D3748] mt-2"
        >
          <Camera className="w-4 h-4 mr-2" />
          Capture Round
        </ClayButton>
      )}
    </div>
  );
}
