import Link from "next/link";
import { ClayButton } from "@/components/ui/clay-button";
import { Home, Camera, AlertTriangle } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="max-w-md w-full bg-white rounded-2xl border-[3px] border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] p-8 md:p-12 relative overflow-hidden">

                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#FFCFE3] rounded-full border-[3px] border-[#2D3748]" />
                <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-[#BDE7FF] rounded-full border-[3px] border-[#2D3748]" />

                <div className="relative z-10 flex flex-col items-center">
                    {/* Icon */}
                    <div className="w-24 h-24 rounded-2xl bg-[#FDE047] border-[3px] border-[#2D3748] flex items-center justify-center shadow-[4px_4px_0px_0px_#2D3748] mb-8 rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Camera className="w-12 h-12 text-[#2D3748]" />
                    </div>

                    {/* Text */}
                    <h1 className="text-4xl md:text-5xl font-black text-[#2D3748] mb-4">
                        404
                    </h1>
                    <h2 className="text-xl font-black text-[#2D3748] mb-4 uppercase tracking-wider">
                        Page Not Found
                    </h2>
                    <p className="text-lg text-slate-600 font-bold mb-8 leading-relaxed">
                        Oops! It looks like this photo didn't develop correctly. The page you're looking for is missing.
                    </p>

                    {/* Button */}
                    <ClayButton size="lg" className="h-14 px-8 text-lg rounded-2xl border-[3px] shadow-[4px_4px_0px_0px_#2D3748] w-full" asChild>
                        <Link href="/">
                            <Home className="mr-2 w-5 h-5" />
                            Back to Home
                        </Link>
                    </ClayButton>
                </div>
            </div>
        </div>
    );
}
