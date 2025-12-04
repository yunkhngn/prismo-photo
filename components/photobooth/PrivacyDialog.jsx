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
import { Camera, ShieldCheck } from "lucide-react"

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
            <DialogContent showCloseButton={false} className="sm:max-w-md rounded-[32px] border-[3px] border-[#2D3748] shadow-[8px_8px_0px_0px_#2D3748] bg-white p-8">
                <DialogHeader className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#FFCFE3] border-[3px] border-[#2D3748] flex items-center justify-center shadow-[4px_4px_0px_0px_#2D3748]">
                        <Camera className="w-8 h-8 text-[#2D3748]" />
                    </div>
                    <DialogTitle className="text-3xl font-black text-[#2D3748] text-center">Welcome to Prismo Booth!</DialogTitle>
                    <DialogDescription className="text-center text-lg font-bold text-slate-500">
                        We respect your privacy. All photos are processed locally in your browser and are
                        <span className="text-[#2D3748]"> never uploaded to our servers</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-center py-6">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#86EFAC] border-2 border-[#2D3748] shadow-[2px_2px_0px_0px_#2D3748]">
                        <ShieldCheck className="w-5 h-5 text-[#2D3748]" />
                        <span className="text-sm font-black text-[#2D3748] uppercase tracking-wider">100% Secure & Private</span>
                    </div>
                </div>

                <DialogFooter className="sm:justify-center w-full">
                    <ClayButton onClick={handleAccept} variant="success" size="lg" className="w-full h-14 text-lg shadow-[4px_4px_0px_0px_#2D3748]">
                        I Understand, Let's Go!
                    </ClayButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
