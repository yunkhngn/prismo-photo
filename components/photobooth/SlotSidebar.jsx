"use client"

import React, { useRef } from 'react'
import { usePhotoboothStore } from '@/store/usePhotoboothStore'
import { ClayCard } from '@/components/ui/clay-card'
import { ClayButton } from '@/components/ui/clay-button'
import { Upload, Trash2, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SlotSidebar() {
    const { slots, updateSlot, resetSlots } = usePhotoboothStore()
    const fileInputRef = useRef(null)
    const activeSlotIndexRef = useRef(null)

    const handleUploadClick = (index) => {
        activeSlotIndexRef.current = index
        fileInputRef.current?.click()
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file && activeSlotIndexRef.current !== null) {
            const url = URL.createObjectURL(file)
            updateSlot(activeSlotIndexRef.current, url)
        }
        // Reset input
        e.target.value = ''
    }

    return (
        <ClayCard className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Your Photos</h2>
                <ClayButton
                    variant="ghost"
                    size="sm"
                    onClick={resetSlots}
                    className="text-slate-500 hover:text-red-500"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                </ClayButton>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {slots.map((slot, index) => (
                    <div
                        key={slot.id}
                        className={cn(
                            "relative aspect-[4/3] rounded-xl border-2 transition-all group",
                            slot.imageUrl
                                ? "border-slate-200 bg-slate-100"
                                : "border-dashed border-slate-300 bg-slate-50 hover:border-[#FFCFE3]"
                        )}
                    >
                        {slot.imageUrl ? (
                            <>
                                <img
                                    src={slot.imageUrl}
                                    alt={`Slot ${index + 1}`}
                                    className="w-full h-full object-cover rounded-[10px]"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                                    <button
                                        onClick={() => updateSlot(index, null)}
                                        className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-red-500 transition-transform hover:scale-110"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={() => handleUploadClick(index)}
                                className="w-full h-full flex flex-col items-center justify-center text-slate-400 hover:text-[#FFCFE3] transition-colors"
                            >
                                <span className="text-2xl font-bold mb-1">{index + 1}</span>
                                <Upload className="w-5 h-5 opacity-50" />
                            </button>
                        )}

                        {/* Slot Number Badge */}
                        {!slot.imageUrl && (
                            <div className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-slate-400 shadow-sm border border-slate-100">
                                {index + 1}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
        </ClayCard>
    )
}
