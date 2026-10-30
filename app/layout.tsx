import type { Metadata, Viewport } from "next";
import { Archivo_Black, Space_Mono } from "next/font/google";
import "./globals.css";

const display = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  fallback: ["Arial Black", "Impact", "sans-serif"],
});

const mono = Space_Mono({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
});

export const metadata: Metadata = {
  title: "RogueHack 1.0 — HTB SRMIST",
  description:
    "Roll the dice. Land a theme. Ship a solution. RogueHack 1.0 is HTB SRMIST's intra-club hackathon — one hour, one random theme, one random problem.",
  applicationName: "RogueHack 1.0",
  openGraph: {
    title: "RogueHack 1.0 — HTB SRMIST",
    description: "Random theme × random problem. Roll the dice and ship in one hour.",
    siteName: "RogueHack 1.0",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body className="min-h-[100dvh] bg-bone font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
