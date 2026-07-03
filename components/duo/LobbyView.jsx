"use client";

import React, { useEffect, useState } from 'react';
import { ClayCard } from '@/components/ui/clay-card';
import { ClayButton } from '@/components/ui/clay-button';
import { Copy, Check, Users, VideoOff, Loader2 } from 'lucide-react';
import { useDuoStore } from '@/store/useDuoStore';

export function LobbyView({ roomId, isHost, connectionState, localStream, remoteStream, startCamera, permissionStatus, videoRef }) {
  const { peerPresent, setPhase } = useDuoStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    startCamera();
  }, [startCamera]);

  const roomUrl = typeof window !== 'undefined' ? `${window.location.origin}/room/${roomId}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(roomUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (peerPresent && localStream && remoteStream && isHost) {
      setPhase('CAPTURE');
    }
  }, [peerPresent, localStream, remoteStream, isHost, setPhase]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center gap-8 font-sans text-[#2D3748]">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-2 uppercase tracking-tight">Duo Lobby</h1>
        <p className="text-slate-600 font-bold text-lg">Set up your camera and invite your partner</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Left Card: Local Camera */}
        <ClayCard className="p-6 flex flex-col gap-4 bg-white border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] rounded-2xl">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-[#BDE7FF]" />
            Your Camera ({isHost ? 'Host' : 'Guest'})
          </h2>
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden flex items-center justify-center border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748]">
            {permissionStatus === 'denied' ? (
              <div className="text-center p-4 bg-white/90 rounded-xl m-4 border-2 border-[#2D3748]">
                <VideoOff className="w-12 h-12 text-red-500 mx-auto mb-2" />
                <p className="font-bold text-[#2D3748]">Camera Access Denied</p>
                <p className="text-xs text-slate-600">Please check your browser permissions.</p>
              </div>
            ) : localStream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100 animate-in fade-in duration-300"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-white">
                <Loader2 className="w-8 h-8 animate-spin text-[#BDE7FF]" />
                <p className="text-sm font-bold">Accessing camera...</p>
              </div>
            )}
          </div>
          <div className="text-center mt-2">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-black bg-[#FFCFE3] border-2 border-[#2D3748] shadow-[2px_2px_0px_0px_#2D3748] uppercase">
              {isHost ? 'Host' : 'Guest'}
            </span>
          </div>
        </ClayCard>

        {/* Right Card: Partner Status & Invite */}
        <ClayCard className="p-6 flex flex-col justify-between gap-6 bg-white border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] rounded-2xl">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-black uppercase tracking-tight">Invite Partner</h2>
            <p className="text-sm text-slate-600 font-bold leading-relaxed">
              Share this link with your partner. When they join and share their camera, you will start the photobooth!
            </p>
            
            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border-3 border-[#2D3748] shadow-inner">
              <input
                type="text"
                readOnly
                value={roomUrl}
                className="bg-transparent border-none text-xs font-black w-full select-all focus:outline-none text-slate-600"
              />
              <ClayButton
                size="sm"
                onClick={handleCopy}
                className="flex-shrink-0 bg-[#BDE7FF] hover:bg-[#BDE7FF]/80 shadow-[2px_2px_0px_0px_#2D3748] border-2 border-[#2D3748] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#2D3748] transition-all"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </ClayButton>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t-3 border-dashed border-[#2D3748]">
            <h3 className="font-black text-lg uppercase tracking-tight">Connection Info</h3>
            <div className="flex flex-col gap-2 text-sm font-bold text-slate-600">
              <div className="flex justify-between items-center">
                <span>Broker Connection:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border-2 border-[#2D3748] ${
                  connectionState === 'connected' ? 'bg-[#86EFAC]' :
                  connectionState === 'connecting' ? 'bg-[#FDE047]' :
                  'bg-[#FF8B8B]'
                }`}>
                  {connectionState}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Partner Joined:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border-2 border-[#2D3748] ${
                  peerPresent ? 'bg-[#86EFAC]' : 'bg-slate-100'
                }`}>
                  {peerPresent ? 'Yes' : 'Waiting...'}
                </span>
              </div>
            </div>
          </div>
        </ClayCard>
      </div>

      {!peerPresent && (
        <div className="flex items-center gap-3 bg-[#FFECA1] px-6 py-4 rounded-2xl border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] animate-pulse">
          <Loader2 className="w-5 h-5 animate-spin text-[#2D3748]" />
          <span className="font-extrabold text-sm uppercase tracking-wider">Waiting for your partner to join...</span>
        </div>
      )}
    </div>
  );
}
