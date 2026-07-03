"use client";

import React from 'react';
import Link from 'next/link';
import { ClayCard } from '@/components/ui/clay-card';
import { ClayButton } from '@/components/ui/clay-button';
import { AlertCircle, Home } from 'lucide-react';

const MESSAGES = {
  room_full: {
    title: 'Room Is Full',
    body: "This duo room already has two people in it. Ask your partner for a new invite link."
  },
  not_found: {
    title: 'Room Not Found',
    body: "This invite link doesn't lead anywhere. It may have expired, or the host hasn't opened it yet."
  }
};

export function RoomErrorView({ type }) {
  const copy = MESSAGES[type] || MESSAGES.not_found;

  return (
    <div className="min-h-screen bg-[#fff9f5] flex items-center justify-center p-4">
      <ClayCard className="max-w-md w-full p-8 bg-white border-3 border-[#2D3748] shadow-[8px_8px_0px_0px_#2D3748] text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#FFCFE3] border-3 border-[#2D3748] flex items-center justify-center shadow-[4px_4px_0px_0px_#2D3748]">
          <AlertCircle className="w-8 h-8 text-[#2D3748]" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight text-[#2D3748]">{copy.title}</h2>
        <p className="text-slate-600 font-bold text-sm leading-relaxed">{copy.body}</p>
        <ClayButton
          asChild
          variant="secondary"
          className="w-full h-12 text-sm font-black uppercase tracking-wider rounded-xl border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#2D3748] transition-all mt-4"
        >
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </ClayButton>
      </ClayCard>
    </div>
  );
}
