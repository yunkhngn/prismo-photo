"use client"

import React from 'react'
import { usePhotoboothStore } from '@/store/usePhotoboothStore'
import { cn } from '@/lib/utils'

export const FILTERS = [
    { id: 'normal', name: 'Normal', css: 'none' },
    { id: 'grayscale', name: 'B&W', css: 'grayscale(100%)' },
    { id: 'sepia', name: 'Sepia', css: 'sepia(0.8)' },
    { id: 'warm', name: 'Warm', css: 'saturate(1.5) hue-rotate(-15deg)' },
    { id: 'cool', name: 'Cool', css: 'saturate(1.2) hue-rotate(15deg)' },
    { id: 'vintage', name: 'Vintage', css: 'sepia(0.4) contrast(1.2) brightness(0.9)' },
]

export function FilterSelector() {
    const { activeFilterId, setFilter } = usePhotoboothStore()

    return (
        <div className="flex gap-2 overflow-x-auto p-4 scrollbar-hide justify-center">
            {FILTERS.map((filter) => {
                const isActive = activeFilterId === filter.id || (!activeFilterId && filter.id === 'normal')

                return (
                    <button
                        key={filter.id}
                        onClick={() => setFilter(filter.id === 'normal' ? null : filter.id)}
                        className="group flex flex-col items-center gap-3 min-w-[80px] outline-none"
                    >
                        <div className={cn(
                            "relative w-16 h-16 rounded-full border-[3px] border-[#2D3748] bg-white transition-all duration-150 ease-out",
                            isActive
                                ? "translate-y-1 shadow-none ring-4 ring-[#FFCFE3] ring-offset-2"
                                : "shadow-[4px_4px_0px_0px_#2D3748] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_0px_#2D3748]"
                        )}>
                            {/* Inner content with padding to prevent clipping border */}
                            <div className="absolute inset-[3px] rounded-full overflow-hidden bg-slate-100">
                                <div
                                    className="w-full h-full bg-cover bg-center"
                                    style={{
                                        // Use a gradient or pattern as base
                                        background: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)',
                                        filter: filter.css
                                    }}
                                >
                                    {/* Decorative pattern */}
                                    <div className="absolute inset-0 opacity-50">
                                        <div className="absolute top-0 right-0 w-[150%] h-full bg-[#2D3748] transform -skew-x-12 translate-x-1/2" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <span className={cn(
                            "text-sm font-bold transition-colors",
                            isActive ? "text-[#2D3748]" : "text-slate-400 group-hover:text-[#2D3748]"
                        )}>
                            {filter.name}
                        </span>
                    </button>
                )
            })}
        </div>
    )
}
