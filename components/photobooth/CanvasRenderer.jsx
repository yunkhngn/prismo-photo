"use client"

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import * as fabric from 'fabric' // v6 syntax
import { usePhotoboothStore } from '@/store/usePhotoboothStore'
import { FILTERS } from './FilterSelector'

const CanvasRenderer = forwardRef(({
    width = 300,
    height = 900,
    className
}, ref) => {
    const canvasEl = useRef(null)
    const fabricCanvas = useRef(null)
    const { activeLayoutId, layouts, slots, activeFilterId, selectedFrameId, frames, customFrameUrl } = usePhotoboothStore()

    // Initialize Canvas
    useEffect(() => {
        if (!canvasEl.current) return

        // Fabric v6 initialization
        const canvas = new fabric.Canvas(canvasEl.current, {
            width: width,
            height: height,
            backgroundColor: '#ffffff',
            selection: false,
            renderOnAddRemove: false, // Performance optimization
        })

        fabricCanvas.current = canvas

        return () => {
            canvas.dispose()
        }
    }, [width, height])

    // Render Content
    const renderCanvas = async () => {
        const canvas = fabricCanvas.current
        if (!canvas) return

        canvas.clear()
        canvas.backgroundColor = '#ffffff'

        const layout = layouts.find(l => l.id === activeLayoutId) || layouts[0]

        // Calculate scale factor to fit the layout into the display canvas
        // layout.canvasWidth/Height are the high-res dimensions (e.g. 600x1800)
        // width/height are the display dimensions (e.g. 300x900)
        const scaleX = width / layout.canvasWidth
        const scaleY = height / layout.canvasHeight
        const scale = Math.min(scaleX, scaleY)

        // 1. Draw Slots (Images)
        for (const slot of slots) {
            if (!slot.imageUrl) continue

            const slotRegion = layout.slots[slot.index]
            if (!slotRegion) continue

            try {
                const img = await fabric.FabricImage.fromURL(slot.imageUrl, {
                    crossOrigin: 'anonymous'
                })

                // Apply Filter (if any)
                // Note: Fabric filters are complex. For MVP we might skip complex filters 
                // or use simple ones if available in Fabric v6.
                // CSS filters don't directly translate.
                // We can use fabric.Image.filters...
                // For now, let's just place the image.

                // Scale image to cover the slot
                const slotWidth = slotRegion.width * scale
                const slotHeight = slotRegion.height * scale

                const imgRatio = img.width / img.height
                const slotRatio = slotWidth / slotHeight

                let finalScale = 1
                if (imgRatio > slotRatio) {
                    finalScale = slotHeight / img.height
                } else {
                    finalScale = slotWidth / img.width
                }

                img.scale(finalScale)

                // Center in slot
                img.set({
                    left: (slotRegion.x * scale) + (slotWidth - img.width * finalScale) / 2,
                    top: (slotRegion.y * scale) + (slotHeight - img.height * finalScale) / 2,
                    selectable: false,
                    evented: false
                })

                // Clip to slot
                img.clipPath = new fabric.Rect({
                    left: slotRegion.x * scale,
                    top: slotRegion.y * scale,
                    width: slotWidth,
                    height: slotHeight,
                    absolutePositioned: true
                })

                canvas.add(img)
            } catch (err) {
                console.error("Failed to load image for slot", slot.index, err)
            }
        }

        // 2. Draw Frame Overlay
        const selectedFrame = frames.find(f => f.id === selectedFrameId)
        const overlayPath = customFrameUrl || (selectedFrame && selectedFrame.overlayPath)

        if (overlayPath) {
            try {
                const frameImg = await fabric.FabricImage.fromURL(overlayPath, {
                    crossOrigin: 'anonymous'
                })

                // Scale frame to fit canvas
                frameImg.scaleX = width / frameImg.width
                frameImg.scaleY = height / frameImg.height

                frameImg.set({
                    left: 0,
                    top: 0,
                    selectable: false,
                    evented: false
                })

                canvas.add(frameImg)
            } catch (err) {
                console.error("Failed to load frame", err)
            }
        }

        // 3. Draw Timestamp
        const date = new Date().toLocaleString()
        const text = new fabric.Text(date, {
            left: width / 2,
            top: height - 20,
            fontSize: 12 * scale,
            fontFamily: 'Arial',
            fill: '#333',
            originX: 'center',
            selectable: false
        })
        canvas.add(text)

        canvas.renderAll()
    }

    // Trigger render when dependencies change
    useEffect(() => {
        renderCanvas()
    }, [activeLayoutId, slots, activeFilterId, selectedFrameId, customFrameUrl, width, height])

    // Expose export method
    useImperativeHandle(ref, () => ({
        exportDataURL: (multiplier = 1) => {
            if (!fabricCanvas.current) return null
            return fabricCanvas.current.toDataURL({
                format: 'png',
                multiplier: multiplier // Use this to get high-res output
            })
        }
    }))

    return (
        <canvas ref={canvasEl} className={className} />
    )
})

CanvasRenderer.displayName = "CanvasRenderer"

export { CanvasRenderer }
