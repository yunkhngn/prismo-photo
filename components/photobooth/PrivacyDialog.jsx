"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { ClayButton } from "@/components/ui/clay-button"
import { usePhotoboothStore } from "@/store/usePhotoboothStore"

export function PrivacyDialog() {
    const { isPrivacyAccepted, acceptPrivacy } = usePhotoboothStore()
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        if (!isPrivacyAccepted) {
            setOpen(true)
        }
    }, [isPrivacyAccepted])

    const handleAccept = () => {
        acceptPrivacy()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent showCloseButton={false} className="sm:max-w-md rounded-[32px] border-2 border-slate-100 shadow-[0px_10px_0px_rgba(15,23,42,0.08)]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center mb-2">Welcome to Prismo Booth! 📸</DialogTitle>
                    <DialogDescription className="text-center text-base">
                        We respect your privacy. All photos are processed locally in your browser and are
                        <span className="font-bold text-[#2D3748]"> never uploaded to our servers</span>.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center py-6">
                    <div className="text-4xl">🔒✨</div>
                </div>
                <DialogFooter className="sm:justify-center">
                    <ClayButton onClick={handleAccept} variant="success" size="lg">
                        I Understand, Let's Go!
                    </ClayButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
