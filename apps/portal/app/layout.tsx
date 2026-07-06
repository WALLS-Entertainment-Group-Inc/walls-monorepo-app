import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { createWallsMetadata } from "@walls/config/metadata";
import { Providers } from "@/components/providers";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = createWallsMetadata({
  title: {
    default: "WALLS Portal",
    template: "%s | WALLS Portal",
  },
  description: "Sign in to the WALLS Entertainment agency portal.",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
