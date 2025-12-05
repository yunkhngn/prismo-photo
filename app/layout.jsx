import { Nunito, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Prismo Photobooth | Capture Your Moments",
    template: "%s | Prismo Photobooth"
  },
  description: "Prismo is a modern, fun, and easy-to-use photobooth application. Capture, customize, and share your digital memories with style.",
  keywords: ["photobooth", "camera", "filters", "frames", "photography", "web booth", "prismo"],
  authors: [{ name: "yunkhngn", url: "https://github.com/yunkhngn" }],
  creator: "yunkhngn",
  metadataBase: new URL('https://prismo.yunkhngn.dev'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://prismo.yunkhngn.dev",
    title: "Prismo Photobooth | Capture Your Moments",
    description: "Capture, customize, and share your digital memories with style using Prismo Photobooth.",
    siteName: "Prismo Photobooth",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "Prismo Photobooth",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prismo Photobooth",
    description: "Capture, customize, and share your digital memories with style.",
    images: ["/thumbnail.png"],
    creator: "@yunkhngn",
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png?v=2', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico?v=2', sizes: 'any' }
    ],
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${geistMono.variable} antialiased bg-[#fff9f5] min-h-screen`}
      >
        <Navbar />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
