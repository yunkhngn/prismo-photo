import Link from "next/link";
import { ClayButton } from "@/components/ui/clay-button";
import { ArrowRight, Image, Book, Target, Star, Camera } from "lucide-react";

export default function Home() {
  return (
    <div>
      <main className="min-h-screen max-w-6xl mx-auto px-4 md:px-8 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full py-12">

          {/* Left Column: Content */}
          <div className="flex flex-col items-start gap-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#86EFAC] border-2 border-[#2D3748] shadow-[2px_2px_0px_0px_#2D3748]">
              <div className="w-2 h-2 rounded-full bg-[#2D3748] animate-pulse" />
              <span className="text-xs font-extrabold text-[#2D3748] uppercase tracking-wider">Developed by: @yunkhngn</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-black text-[#2D3748] leading-[1.1] tracking-tight">
              Prismo <br />
              <span className="text-[#22C55E]">Photobooth,</span> <br />
              Capture Your Perfect Moments!
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-slate-600 font-bold max-w-lg leading-relaxed">
              Prismo Photobooth is a platform that allows you to capture your perfect moments with your loved ones.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <ClayButton variant="success" size="lg" className="h-14 px-8 text-lg rounded-2xl border-[3px] shadow-[4px_4px_0px_0px_#2D3748]" asChild>
                <Link href="/photobooth">
                  Start Photobooth Free <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </ClayButton>

              <ClayButton variant="secondary" size="lg" className="h-14 px-8 text-lg rounded-2xl border-[3px] shadow-[4px_4px_0px_0px_#2D3748]">
                <Link href="/frames">
                  Browse Frames
                </Link>
              </ClayButton>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mt-8">
              <div>
                <p className="text-3xl font-black text-[#2D3748]">10K+</p>
                <p className="text-sm font-bold text-slate-500">Users</p>
              </div>
              <div>
                <p className="text-3xl font-black text-[#2D3748]">20</p>
                <p className="text-sm font-bold text-slate-500">Frames</p>
              </div>
              <div>
                <p className="text-3xl font-black text-[#2D3748]">10M+</p>
                <p className="text-sm font-bold text-slate-500">Aura Farming</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual */}
          <div className="relative hidden lg:block">
            {/* Main Card */}
            <div className="relative z-10 bg-white rounded-2xl border-[3px] border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] p-6 w-full max-w-md mx-auto rotate-1 hover:rotate-0 transition-transform duration-300">

              {/* Card Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#BDE7FF] border-[3px] border-[#2D3748] flex items-center justify-center shadow-[2px_2px_0px_0px_#2D3748]">
                  <Image className="w-8 h-8 text-[#2D3748] fill-[#2D3748]" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#2D3748]">Captured Moments</h3>
                  <p className="text-slate-500 font-bold">No cost needed • 100% free</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-bold text-slate-400">Progress</span>
                  <span className="text-sm font-bold text-[#22C55E]">65%</span>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full border-2 border-[#2D3748] overflow-hidden">
                  <div className="h-full bg-[#22C55E] w-[65%] border-r-2 border-[#2D3748]" />
                </div>
              </div>

              {/* Button */}
              <button className="flex items-center justify-center w-full py-4 bg-[#22C55E] rounded-xl border-[3px] border-[#2D3748] text-white font-black text-lg shadow-[4px_4px_0px_0px_#2D3748] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#2D3748] active:translate-y-2 active:shadow-none transition-all">
                Snapshots
                <Camera className="ml-2 w-5 h-5" />
              </button>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-4 z-20 animate-bounce duration-[3000ms]">
              <div className="w-16 h-16 bg-[#FFCFE3] rounded-2xl border-[3px] border-[#2D3748] flex items-center justify-center shadow-[4px_4px_0px_0px_#2D3748] rotate-12">
                <Target className="w-8 h-8 text-[#2D3748] " />
              </div>
            </div>

            <div className="absolute top-1/2 -right-12 z-20 animate-pulse duration-[4000ms]">
              <div className="w-14 h-14 bg-[#86EFAC] rounded-full border-[3px] border-[#2D3748] flex items-center justify-center shadow-[4px_4px_0px_0px_#2D3748] -rotate-6">
                <Star className="w-7 h-7 text-[#2D3748] fill-white" />
              </div>
            </div>

            <div className="absolute -bottom-8 -left-8 z-20 animate-bounce duration-[3500ms]">
              <div className="w-16 h-16 bg-[#E9D5FF] rounded-2xl border-[3px] border-[#2D3748] flex items-center justify-center shadow-[4px_4px_0px_0px_#2D3748] -rotate-12">
                <Book className="w-8 h-8 text-[#2D3748]" />
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Why Prismo Section */}
      <section className="w-full py-20 bg-[#FFF9F5]">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#BDE7FF] border-2 border-[#2D3748] shadow-[2px_2px_0px_0px_#2D3748] mb-6">
              <span className="text-xs font-extrabold text-[#2D3748] uppercase tracking-wider">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#2D3748] mb-4">Why Prismo Photobooth?</h2>
            <p className="text-xl text-slate-600 font-bold max-w-2xl">
              Capture moments with style and ease. We provide the best experience for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Privacy */}
            <div className="bg-white rounded-2xl border-[3px] border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] p-8 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#2D3748] transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#FFCFE3] border-[3px] border-[#2D3748] flex items-center justify-center shadow-[2px_2px_0px_0px_#2D3748]">
                  <Target className="w-8 h-8 text-[#2D3748]" />
                </div>
                <div className="px-3 py-1 rounded-full border-2 border-[#2D3748] bg-[#86EFAC] text-xs font-black text-[#2D3748] uppercase">
                  Safe
                </div>
              </div>
              <h3 className="text-2xl font-black text-[#2D3748] mb-2">Privacy Focused</h3>
              <p className="text-slate-500 font-bold mb-4">Processed locally in browser</p>
              <div className="flex gap-4 text-sm font-bold text-slate-400">
                <span>No uploads</span>
                <span>•</span>
                <span>Secure</span>
              </div>
            </div>

            {/* Card 2: Instant */}
            <div className="bg-white rounded-2xl border-[3px] border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] p-8 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#2D3748] transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#BDE7FF] border-[3px] border-[#2D3748] flex items-center justify-center shadow-[2px_2px_0px_0px_#2D3748]">
                  <Image className="w-8 h-8 text-[#2D3748]" />
                </div>
                <div className="px-3 py-1 rounded-full border-2 border-[#2D3748] bg-[#BDE7FF] text-xs font-black text-[#2D3748] uppercase">
                  Fast
                </div>
              </div>
              <h3 className="text-2xl font-black text-[#2D3748] mb-2">Instant Results</h3>
              <p className="text-slate-500 font-bold mb-4">No waiting time required</p>
              <div className="flex gap-4 text-sm font-bold text-slate-400">
                <span>HD Quality</span>
                <span>•</span>
                <span>Fast</span>
              </div>
            </div>

            {/* Card 3: Style */}
            <div className="bg-white rounded-2xl border-[3px] border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] p-8 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#2D3748] transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#E9D5FF] border-[3px] border-[#2D3748] flex items-center justify-center shadow-[2px_2px_0px_0px_#2D3748]">
                  <Star className="w-8 h-8 text-[#2D3748]" />
                </div>
                <div className="px-3 py-1 rounded-full border-2 border-[#2D3748] bg-[#FFCFE3] text-xs font-black text-[#2D3748] uppercase">
                  Cool
                </div>
              </div>
              <h3 className="text-2xl font-black text-[#2D3748] mb-2">Claymorphism Style</h3>
              <p className="text-slate-500 font-bold mb-4">Trendy & Cute designs</p>
              <div className="flex gap-4 text-sm font-bold text-slate-400">
                <span>Unique</span>
                <span>•</span>
                <span>Modern</span>
              </div>
            </div>

            {/* Card 4: Export */}
            <div className="bg-white rounded-2xl border-[3px] border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] p-8 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#2D3748] transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#FDE047] border-[3px] border-[#2D3748] flex items-center justify-center shadow-[2px_2px_0px_0px_#2D3748]">
                  <Camera className="w-8 h-8 text-[#2D3748]" />
                </div>
                <div className="px-3 py-1 rounded-full border-2 border-[#2D3748] bg-[#FDE047] text-xs font-black text-[#2D3748] uppercase">
                  Free
                </div>
              </div>
              <h3 className="text-2xl font-black text-[#2D3748] mb-2">Easy Export</h3>
              <p className="text-slate-500 font-bold mb-4">Save to device instantly</p>
              <div className="flex gap-4 text-sm font-bold text-slate-400">
                <span>PNG</span>
                <span>•</span>
                <span>JPG</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-16">
            <ClayButton size="lg" className="h-14 px-10 text-lg rounded-2xl border-[3px] shadow-[4px_4px_0px_0px_#2D3748]" asChild>
              <Link href="/photobooth">
                Start Creating Now <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </ClayButton>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-[#BDE7FF]">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_#2D3748] transition-all duration-300 bg-white rounded-2xl border-[3px] border-[#2D3748] shadow-[4px_4px_0px_0px_#2D3748] p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-[#2D3748] mb-4">
              Ready to Capture Moments?
            </h2>
            <p className="text-lg md:text-xl text-slate-600 font-bold mb-8 max-w-2xl mx-auto">
              Join thousands of users and start your creative journey today. First 100 photos are completely free!
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
              <ClayButton variant="success" size="lg" className="h-14 px-8 text-lg rounded-2xl border-[3px] shadow-[4px_4px_0px_0px_#2D3748] w-full md:w-auto" asChild>
                <Link href="/photobooth">
                  Start for Free <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </ClayButton>

              <ClayButton variant="secondary" size="lg" className="h-14 px-8 text-lg rounded-2xl border-[3px] shadow-[4px_4px_0px_0px_#2D3748] w-full md:w-auto" asChild>
                <Link href="/frames">
                  Browse Frames
                </Link>
              </ClayButton>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-bold text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#86EFAC] flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-[#2D3748]" />
                </div>
                No login required
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#86EFAC] flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-[#2D3748]" />
                </div>
                100% Free
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}