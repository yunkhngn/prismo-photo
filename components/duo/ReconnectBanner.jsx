"use client";

import React from 'react';
import { ClayCard } from '@/components/ui/clay-card';
import { ClayButton } from '@/components/ui/clay-button';
import { Loader2 } from 'lucide-react';

export function ReconnectBanner({ autoRetryExhausted, onReconnect }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-[4px] z-50 flex items-center justify-center p-4">
      <ClayCard className="max-w-md w-full p-8 bg-white border-3 border-[#2D3748] shadow-[8px_8px_0px_0px_#2D3748] text-center flex flex-col items-center gap-4 animate-in zoom-in duration-200">
        <div className="w-16 h-16 rounded-full bg-[#FFECA1] border-3 border-[#2D3748] flex items-center justify-center shadow-[4px_4px_0px_0px_#2D3748] animate-bounce">
          <Loader2 className="w-8 h-8 animate-spin text-[#2D3748]" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-[#2D3748]">Connection Lost</h2>
        <p className="text-slate-600 font-bold text-sm leading-relaxed">
          {autoRetryExhausted
            ? "We couldn't reconnect automatically. Tap below to try again."
            : "We lost connection to your partner. Attempting to reconnect automatically..."}
        </p>
        <div className="flex gap-3 w-full mt-4">
          <ClayButton
            variant="primary"
            onClick={onReconnect}
            className="flex-1 h-12 text-sm font-black uppercase tracking-wider rounded-xl border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#2D3748] transition-all bg-[#BDE7FF] text-[#2D3748]"
          >
            Reconnect Now
          </ClayButton>
        </div>
      </ClayCard>
    </div>
  );
}
