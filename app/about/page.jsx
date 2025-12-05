"use client"

import { ClayCard } from "@/components/ui/clay-card"
import { ClayButton } from "@/components/ui/clay-button"
import { Github, Facebook, Coffee, Heart } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#fff9f5] font-sans text-[#2D3748]">
            <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-12">

                {/* Header */}
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-6xl font-black text-[#2D3748]">About Prismo</h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Prismo is a modern, fun, and easy-to-use photobooth application designed to bring joy to your digital memories.
                    </p>
                </div>

                {/* Mission */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ClayCard className="p-8 bg-[#FFCFE3]">
                        <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
                            <Heart className="w-6 h-6 fill-[#2D3748]" />
                            Our Mission
                        </h2>
                        <p className="font-medium leading-relaxed">
                            To provide a delightful and creative way for people to capture moments, express themselves through unique frames, and share their stories with the world.
                        </p>
                    </ClayCard>
                    <ClayCard className="p-8 bg-[#BDE7FF]">
                        <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
                            <Coffee className="w-6 h-6" />
                            Open Source
                        </h2>
                        <p className="font-medium leading-relaxed">
                            Prismo is built with open-source technologies and we believe in giving back to the community. The code is available for learning and contribution.
                        </p>
                    </ClayCard>
                </div>

                {/* Contributor Section */}
                <div className="pt-12">
                    <h2 className="text-3xl font-black text-center mb-8">Meet the Creator</h2>
                    <ClayCard className="max-w-2xl mx-auto p-8 flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-[4px] border-[#2D3748] overflow-hidden shadow-[4px_4px_0px_0px_#2D3748]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src="https://github.com/yunkhngn.png"
                                    alt="yunkhngn"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-[#FFCFE3] border-[3px] border-[#2D3748] p-2 rounded-xl shadow-[2px_2px_0px_0px_#2D3748]">
                                <span className="text-2xl"><Coffee className="w-6 h-6" /></span>
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div>
                                <h3 className="text-2xl font-black text-[#2D3748]">yunkhngn</h3>
                                <p className="text-slate-500 font-bold">Developer & Designer</p>
                            </div>

                            <p className="text-slate-600">
                                Passionate about building beautiful, interactive web experiences.
                                Prismo is a playground for experimenting with claymorphism and modern web capabilities.
                            </p>

                            <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
                                <Link href="https://github.com/yunkhngn" target="_blank">
                                    <ClayButton size="sm" variant="secondary" className="px-4">
                                        <Github className="w-4 h-4 mr-2" />
                                        GitHub
                                    </ClayButton>
                                </Link>
                                <Link href="https://facebook.com/yun.khngn" target="_blank">
                                    <ClayButton size="sm" variant="secondary" className="px-4 bg-[#BDE7FF]">
                                        <Facebook className="w-4 h-4 mr-2" />
                                        Facebook
                                    </ClayButton>
                                </Link>
                            </div>
                        </div>
                    </ClayCard>
                </div>

            </div>
        </div>
    )
}
