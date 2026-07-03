"use client";

import React, { useRef, useEffect, useState } from 'react';
import { useDuoStore } from '@/store/useDuoStore';
import { ClayCard } from '@/components/ui/clay-card';
import { ClayButton } from '@/components/ui/clay-button';
import { Download, ArrowLeft, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FRAMES } from '@/lib/frames';
import { DEFAULT_LAYOUTS } from '@/lib/layouts';

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
};

export function DuoExportView({ isHost, onFrameSelect, onRetakeAll, onCursorMove }) {
  const store = useDuoStore();
  const { photos, selectedFrameId, remoteCursor, remoteCursorTimestamp } = store;
  const canvasRef = useRef(null);
  const [rendering, setRendering] = useState(false);
  const containerRef = useRef(null);
  const lastSentRef = useRef(0);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    if (!remoteCursor || !remoteCursorTimestamp) {
      setShowCursor(false);
      return;
    }
    setShowCursor(Date.now() - remoteCursorTimestamp < 2000);
    const interval = setInterval(() => {
      const active = Date.now() - remoteCursorTimestamp < 2000;
      setShowCursor(active);
      if (!active) clearInterval(interval);
    }, 500);
    return () => clearInterval(interval);
  }, [remoteCursor, remoteCursorTimestamp]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const now = Date.now();
    if (now - lastSentRef.current < 50) return;
    lastSentRef.current = now;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onCursorMove({ x, y });
  };

  const drawStrip = async (canvas, scale) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const layout = DEFAULT_LAYOUTS.find((l) => l.id === '4x2-duo');
    if (!layout) return;

    // Draw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, layout.canvasWidth * scale, layout.canvasHeight * scale);

    // Draw slots
    for (let i = 0; i < layout.slots.length; i++) {
      const slot = layout.slots[i];
      const round = Math.floor(i / 2) + 1;
      const owner = slot.owner;
      const photoUrl = photos[round]?.[owner];

      if (photoUrl) {
        try {
          const img = await loadImage(photoUrl);
          const sx = slot.x * scale;
          const sy = slot.y * scale;
          const sw = slot.width * scale;
          const sh = slot.height * scale;

          const imgRatio = img.width / img.height;
          const slotRatio = sw / sh;
          let dx, dy, dw, dh;

          if (imgRatio > slotRatio) {
            dh = sh;
            dw = sh * imgRatio;
            dx = sx + (sw - dw) / 2;
            dy = sy;
          } else {
            dw = sw;
            dh = sw / imgRatio;
            dx = sx;
            dy = sy + (sh - dh) / 2;
          }

          ctx.save();
          ctx.beginPath();
          ctx.rect(sx, sy, sw, sh);
          ctx.clip();
          ctx.drawImage(img, dx, dy, dw, dh);
          ctx.restore();
        } catch (err) {
          console.error("Error loading image for slot", i, err);
        }
      } else {
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(slot.x * scale, slot.y * scale, slot.width * scale, slot.height * scale);
      }
    }

    // Draw Frame overlay
    if (selectedFrameId && selectedFrameId !== 'none') {
      const frameObj = FRAMES.find(f => f.id === selectedFrameId);
      if (frameObj && frameObj.overlayPath) {
        try {
          const frameImg = await loadImage(frameObj.overlayPath);
          ctx.drawImage(frameImg, 0, 0, layout.canvasWidth * scale, layout.canvasHeight * scale);
        } catch (err) {
          console.error("Error loading frame overlay:", err);
        }
      }
    }

  };

  // Render preview canvas on state changes
  useEffect(() => {
    let active = true;
    const render = async () => {
      if (!canvasRef.current) return;
      setRendering(true);
      await drawStrip(canvasRef.current, 0.3); // 360x570 viewport scale
      if (active) setRendering(false);
    };

    render();
    return () => {
      active = false;
    };
  }, [photos, selectedFrameId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDownload = async () => {
    const hiddenCanvas = document.createElement('canvas');
    hiddenCanvas.width = 1200;
    hiddenCanvas.height = 1900;
    
    await drawStrip(hiddenCanvas, 1.0); // full scale high-res
    
    const dataUrl = hiddenCanvas.toDataURL('image/jpeg', 0.92);
    if (dataUrl) {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'prismo-duo.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-sans text-[#2D3748]">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">Your Duo Strip</h1>
        <p className="text-slate-500 font-bold text-lg">Pick a frame overlay and download your photo strip!</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive scaled canvas preview */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center bg-slate-100/50 rounded-3xl border-3 border-dashed border-slate-300 p-8 relative group min-h-[600px]">
          <ClayCard className="p-3 bg-slate-100 flex items-center justify-center shadow-inner w-fit border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748]">
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              className="relative cursor-crosshair"
            >
              <canvas
                ref={canvasRef}
                width={360}
                height={570}
                className="rounded-sm max-w-full h-auto bg-white border-2 border-slate-300"
              />
              {rendering && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#2D3748]" />
                </div>
              )}
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
          </ClayCard>

          <div className="flex flex-col gap-3 w-full max-w-[360px] mt-6">
            <ClayButton
              onClick={handleDownload}
              size="lg"
              variant="success"
              className="w-full h-14 text-sm font-black uppercase tracking-wider rounded-xl border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#2D3748] transition-all bg-[#86EFAC] text-[#2D3748]"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Photo
            </ClayButton>

            <ClayButton
              variant="secondary"
              onClick={onRetakeAll}
              className="hover:bg-slate-100 w-full h-12 text-sm font-black uppercase tracking-wider rounded-xl border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#2D3748] transition-all bg-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retake All
            </ClayButton>
          </div>
        </div>

        {/* Right Column: Frame Selection list */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <ClayCard className="p-6 bg-white border-3 border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748]">
            <h2 className="text-2xl font-black mb-4 flex-shrink-0 uppercase">Choose a Frame</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-2">
              {FRAMES.map((frame) => (
                <div
                  key={frame.id}
                  onClick={() => onFrameSelect(frame.id)}
                  className={cn(
                    "aspect-[1/3] rounded-2xl border-[3px] border-[#2D3748] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group p-2",
                    (selectedFrameId === frame.id || (!selectedFrameId && frame.id === 'none'))
                      ? "bg-[#BDE7FF] shadow-none translate-y-1"
                      : "bg-white shadow-[4px_4px_0px_0px_#2D3748] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#2D3748]"
                  )}
                >
                  <div className="w-full flex-grow rounded-xl overflow-hidden border-2 border-[#2D3748] bg-slate-50 relative aspect-[1/3]">
                    {frame.thumbnailPath ? (
                      <img src={frame.thumbnailPath} alt={frame.name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-extrabold text-xs uppercase">None</div>
                    )}
                  </div>
                  <div className="mt-3 text-xs font-black uppercase text-[#2D3748] tracking-wider text-center">{frame.name}</div>
                </div>
              ))}
            </div>
          </ClayCard>
        </div>
      </div>
    </div>
  );
}
