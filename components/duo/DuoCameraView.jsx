"use client";

import React, { useEffect, useRef } from 'react';
import { ClayCard } from '@/components/ui/clay-card';
import { Loader2, VideoOff } from 'lucide-react';
import { FILTERS } from '@/components/photobooth/FilterSelector';

export function DuoCameraView({ stream, activeFilterId, isLocal = false, videoRef }) {
  const internalVideoRef = useRef(null);
  const activeVideoRef = videoRef || internalVideoRef;

  useEffect(() => {
    if (activeVideoRef.current) {
      activeVideoRef.current.srcObject = stream;
    }
  }, [stream, activeVideoRef]);

  const activeFilter = FILTERS.find(f => f.id === activeFilterId) || FILTERS[0];

  return (
    <ClayCard className="p-4 flex flex-col gap-3 bg-white w-full border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748]">
      <h3 className="font-extrabold flex items-center gap-2 text-sm uppercase">
        <span className={`w-3.5 h-3.5 rounded-full ${isLocal ? 'bg-[#86EFAC]' : 'bg-[#BDE7FF]'} border-[3px] border-[#2D3748]`} />
        {isLocal ? 'Your Stream' : 'Partner\'s Stream'}
      </h3>
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border-[3px] border-[#2D3748]">
        {stream ? (
          <video
            ref={activeVideoRef}
            autoPlay
            playsInline
            muted={isLocal} // always mute local to avoid feedback/echo
            className="w-full h-full object-cover transform -scale-x-100 transition-[filter] duration-300"
            style={{ filter: activeFilter.css }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#BDE7FF]" />
            <p className="text-sm font-extrabold uppercase tracking-wider text-slate-300">Connecting video stream...</p>
          </div>
        )}
      </div>
    </ClayCard>
  );
}
