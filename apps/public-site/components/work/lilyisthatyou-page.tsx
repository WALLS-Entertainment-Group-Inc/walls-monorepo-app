"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { PublicHeader } from "@/components/public-header";
import FooterContainer from "@/components/footer-container";
import { usePublicPageHeader } from "@/hooks/use-public-page-header";
import Image from "next/image";

export function LilyisthatyouPage() {
  const { ref: topSectionRef, inView } = usePublicPageHeader();

  return (
    <div className="min-h-screen bg-white">
      <div ref={topSectionRef} className="absolute top-0 h-1 w-full" />
      <PublicHeader inView={inView} />
      
      {/* Hero Section */}
      <section className="relative h-[55vh] overflow-hidden bg-gray-50">
        {/* Content */}
        <div className="relative flex items-end h-full px-4 sm:px-6 lg:px-8 pb-32 sm:pb-8">
          <div className="max-w-[90%] w-full mx-auto flex justify-between items-end">
            <div>
              <h1 className="text-6xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-black">
                Lilyisthatyou
              </h1>
              <p className="mt-2 sm:mt-4 text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-black font-light">
                Artist Development
              </p>
            </div>
            
            {/* Right side navigation (pills + horizontal divider + link) */}
            <div className="hidden lg:flex flex-col items-end mb-2 w-64">
              {/* Pills */}
              <div className="flex flex-col gap-2 self-end items-end">
                {["Music", "Production", "Record Deal"].map((label) => (
                  <span
                    key={label}
                    className="inline-flex rounded-full bg-gradient-to-r from-pink-300/60 via-teal-300/60 to-blue-300/60 p-[1px]"
                  >
                    <span className="rounded-full bg-white px-4 py-1 text-sm font-medium text-gray-900">
                      {label}
                    </span>
                  </span>
                ))}
              </div>

              {/* Divider + link */}
              <div className="flex items-center justify-end w-full mt-6">
                <div className="flex-grow h-px bg-gray-300" />
                <a
                  href="https://open.spotify.com/track/6k6egroLMoShmt63RwaK4S?si=384df31a8af4456f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 inline-flex items-center text-sm text-gray-900 hover:bg-walls-yellow hover:text-black transition-all duration-300 whitespace-nowrap px-2 py-1 rounded"
                >
                  Listen to FMRN
                  <svg
                    className="ml-1 h-3 w-3"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 11L11 1M11 1H1M11 1V11"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile pills and link - shown only on mobile/tablet */}
        <div className="lg:hidden absolute left-4 right-4 z-10" style={{ top: 'calc(100% - 120px)' }}>
          <div className="flex justify-start ml-4">
            <div className="flex flex-col items-start">
              <div className="flex flex-wrap gap-2 mb-4">
                {["Music", "Production", "Record Deal"].map((label) => (
                  <span
                    key={label}
                    className="inline-flex rounded-full bg-gradient-to-r from-pink-300/60 via-teal-300/60 to-blue-300/60 p-[1px]"
                  >
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-900">
                      {label}
                    </span>
                  </span>
                ))}
              </div>
              <a
                href="https://open.spotify.com/track/6k6egroLMoShmt63RwaK4S?si=384df31a8af4456f"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-black bg-walls-yellow px-3 py-2 rounded-lg"
              >
                Listen to FMRN
                <svg
                  className="ml-2 h-4 w-4"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 11L11 1M11 1H1M11 1V11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="relative w-full bg-gray-50 py-12">
        <div className="max-w-[90%] mx-auto">
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden">
            <Image
              src="https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/LILYISTHATYOU-cr-Brian-Ziff-press-2021-billboard-1548.webp"
              alt="Lilyisthatyou Billboard Press Photo"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="pt-16 sm:pt-28 pb-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-5xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight mb-6 sm:mb-8 text-center sm:text-left">
              About Lilyisthatyou
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-black leading-relaxed text-center sm:text-left">
              Lilyisthatyou is the breakthrough artist whose authentic voice and raw talent captivated audiences worldwide. Our team led the production vision and music team that created the hit record "FMRN" which became an overnight success, leading to a major record deal with Warner Music and accumulating over 100 million streams across all platforms.
            </p>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full">
          <div className="border-t border-gray-900 pt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-900">
              <div className="text-center px-4 sm:px-6 lg:px-8 py-8 md:py-0">
                <div className="text-5xl sm:text-6xl lg:text-8xl font-bold text-black mb-4">
                  100M+
                </div>
                <div className="text-base sm:text-lg md:text-xl text-black">
                  Streams
                </div>
              </div>
              
              <div className="text-center px-4 sm:px-6 lg:px-8 py-8 md:py-0">
                <div className="text-5xl sm:text-6xl lg:text-8xl font-bold text-black mb-4">
                  #2
                </div>
                <div className="text-base sm:text-lg md:text-xl text-black">
                  Spotify Global Chart
                </div>
              </div>
              
              <div className="text-center px-4 sm:px-6 lg:px-8 py-8 md:py-0">
                <div className="text-5xl sm:text-6xl lg:text-8xl font-bold text-black mb-4">
                  Gold
                </div>
                <div className="text-base sm:text-lg md:text-xl text-black">
                  Certified
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Details Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-12 sm:space-y-20">
            {/* Ask Section */}
            <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-6 sm:gap-8 md:gap-16 items-start border-t border-gray-200 pt-12 sm:pt-20">
              <h3 className="text-2xl sm:text-3xl font-serif text-center md:text-left">Ask</h3>
              <p className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed">
                Transform a talented artist with authentic vision into a viral sensation through strategic music production, viral marketing, and industry positioning to secure a major record deal.
              </p>
            </div>

            {/* Approach Section */}
            <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-6 sm:gap-8 md:gap-16 items-start border-t border-gray-200 pt-12 sm:pt-20">
              <h3 className="text-2xl sm:text-3xl font-serif text-center md:text-left">Approach</h3>
              <p className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed">
                We executed a comprehensive strategy by leading the production vision and music team that created the hit record "FMRN" designed for viral potential. The approach combined exceptional music production with strategic viral marketing tactics, leveraging social media platforms to create organic growth and buzz around the track. This calculated strategy positioned Lilyisthatyou perfectly for major label attention.
              </p>
            </div>

            {/* Impact Section */}
            <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-6 sm:gap-8 md:gap-16 items-start border-t border-gray-200 pt-12 sm:pt-20">
              <h3 className="text-2xl sm:text-3xl font-serif text-center md:text-left">Impact</h3>
              <p className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed">
                The "FMRN" record became a viral sensation, amassing over 100 million streams across all platforms and reaching #2 on the Spotify Global Chart. The track is certified Gold and won a SoCan "Viral Song" award, leading to a major record deal with Warner Music. Beyond the numbers, "FMRN" sparked a cultural moment when the viral video was removed for "explicit content" after 2 million views overnight—despite similar content from male artists thriving on platforms. This sparked a conversation about silencing women's voices in music, leading to major press coverage including Rolling Stone, and ultimately brought the video back through collective advocacy, demonstrating the power of fighting for creators' rights.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FooterContainer />
    </div>
  );
}
