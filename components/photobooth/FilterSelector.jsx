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
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
            {FILTERS.map((filter) => (
                <button
                    key={filter.id}
                    onClick={() => setFilter(filter.id === 'normal' ? null : filter.id)}
                    className={cn(
                        "flex flex-col items-center gap-1 min-w-[60px] transition-transform hover:scale-105",
                        (activeFilterId === filter.id || (!activeFilterId && filter.id === 'normal'))
                            ? "opacity-100 scale-110"
                            : "opacity-60 hover:opacity-100"
                    )}
                >
                    <div
                        className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                        style={{
                            backgroundColor: '#eee',
                            backgroundImage: 'url(/next.svg)', // Placeholder or use a real thumb
                            backgroundSize: 'cover',
                            filter: filter.css
                        }}
                    />
                    <span className="text-xs font-bold text-slate-600">{filter.name}</span>
                </button>
            ))}
        </div>
    )
}
