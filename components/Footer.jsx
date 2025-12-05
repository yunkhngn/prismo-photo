import Link from "next/link";
import { Play, Facebook, Instagram, Github, PanelsTopLeft } from "lucide-react";

export function Footer() {
    const socialLink = [
        { icon: <Facebook className="w-5 h-5" />, href: "https://facebook.com/yun.khngn" },
        { icon: <Instagram className="w-5 h-5" />, href: "https://instagram.com/yun.khngn" },
        { icon: <Github className="w-5 h-5" />, href: "https://github.com/yunkhngn/prismo-photo" },
        { icon: <PanelsTopLeft className="w-5 h-5" />, href: "https://yunkhngn.dev" },
    ]
    return (
        <footer className="w-full py-20 bg-[#fff9f5] border-t-2 border-[#2D3748]/10">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <div className="flex flex-col gap-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-[#FFCFE3] rounded-xl border-[3px] border-[#2D3748] flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_0px_#2D3748] group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0px_0px_#2D3748] transition-all">
                                <Play className="w-6 h-6 text-[#2D3748]" />
                            </div>
                            <span className="font-black text-xl tracking-tight text-[#2D3748]">Prismo Photobooth</span>
                        </Link>
                        <p className="text-slate-500 font-bold leading-relaxed">
                            Empowering everyone to capture and share their best moments with style and ease.
                        </p>
                        <div className="flex items-center gap-4">
                            {socialLink.map((link, index) => (
                                <SocialLink key={index} icon={link.icon} href={link.href} />
                            ))}
                        </div>
                    </div>

                    {/* Product */}
                    <div className="flex flex-col gap-6">
                        <h4 className="font-black text-[#2D3748] text-lg">Product</h4>
                        <div className="flex flex-col gap-4">
                            <FooterLink href="/photobooth">Photobooth</FooterLink>
                            <FooterLink href="/frames">Frames</FooterLink>
                            <FooterLink href="/about">About Contributor</FooterLink>
                        </div>
                    </div>


                    {/* Support */}
                    <div className="flex flex-col gap-6">
                        <h4 className="font-black text-[#2D3748] text-lg">Support Me</h4>
                        <div className="flex flex-col gap-4">
                            <FooterLink href="https://buymeacoffee.com/yunkhngn" target="_blank">Buy Me A Coffee</FooterLink>
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t-2 border-[#2D3748]/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-400 font-bold text-sm">© 2025 Prismo Photobooth. All rights reserved.</p>
                    <div className="flex items-center gap-8">
                        <Link href="#" className="text-slate-400 font-bold text-sm hover:text-[#2D3748]">Privacy Policy</Link>
                        <Link href="#" className="text-slate-400 font-bold text-sm hover:text-[#2D3748]">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ icon, href }) {
    return (
        <Link
            href={href}
            target="_blank"
            className="w-10 h-10 rounded-full bg-white border-2 border-[#2D3748] flex items-center justify-center text-[#2D3748] shadow-[2px_2px_0px_0px_#2D3748] hover:translate-y-0.5 hover:shadow-none transition-all"
        >
            {icon}
        </Link>
    )
}

function FooterLink({ href, children }) {
    return (
        <Link href={href} className="text-slate-500 font-bold hover:text-[#2D3748] transition-colors">
            {children}
        </Link>
    )
}
