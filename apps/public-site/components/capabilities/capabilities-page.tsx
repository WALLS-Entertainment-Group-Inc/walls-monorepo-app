"use client";

import { PublicHeader } from "@/components/public-header";
import FooterContainer from "@/components/footer-container";
import { ArrowRight } from "lucide-react";
import { usePublicPageHeader } from "@/hooks/use-public-page-header";
import Link from "next/link";
import Image from "next/image";

export function CapabilitiesPage() {
  const { ref: topSectionRef, inView } = usePublicPageHeader();

  return (
    <div className="min-h-screen bg-white">
      <div ref={topSectionRef} className="absolute top-0 h-1 w-full" />
      <PublicHeader inView={inView} />
      {/* Hero Section */}
      <section className="relative pt-40 pb-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            {/* Left Column - Heading */}
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                  Elevating creators and companies in entertainment
              </h2>
            </div>

            {/* Right Column - Description */}
            <div className="lg:pt-2">
              <p className="text-lg sm:text-lg font-light text-black leading-relaxed text-right">
                  WALLS partners with talent and brands across the entertainment space to grow, innovate, and expand their businesses. From creator-led ventures to established companies, we help forge partnerships, shape strategy, and build deeper connections with audiences. We position our clients at the center of culture and long-term success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Services Grid - First Row */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            {/* Brand Partnerships */}
            <Link href="/capabilities/brand-partnerships" className="relative block group">
              <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden group relative cursor-pointer mb-6">
                <Image 
                  src="https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/brand-partnerships.jpg"
                  alt="Brand Partnerships"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold tracking-tight text-black group-hover:text-gray-700 transition-colors">
                    Brand Partnerships
                  </h3>
                  <ArrowRight className="w-6 h-6 text-black group-hover:text-gray-700 transition-colors" />
                </div>
                <div className="w-full h-px bg-black"></div>
              </div>
            </Link>

            {/* Venture Labs */}
            <Link href="/capabilities/brand-lab" className="relative block group">
              <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden group relative cursor-pointer mb-6">
                <Image 
                  src="https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/brand-lab.jpg"
                  alt="Venture Labs"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold tracking-tight text-black group-hover:text-gray-700 transition-colors">
                    Venture Labs
                  </h3>
                  <ArrowRight className="w-6 h-6 text-black group-hover:text-gray-700 transition-colors" />
                </div>
                <div className="w-full h-px bg-black"></div>
              </div>
            </Link>

            {/* Data & Artificial Recognition */}
            <Link href="/capabilities/data-artificial-recognition" className="relative block group">
              <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden group relative cursor-pointer mb-6">
                <Image 
                  src="https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/data.jpg"
                  alt="Data & Artificial Recognition"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold tracking-tight text-black group-hover:text-gray-700 transition-colors">
                    Data & Artificial Recognition
                  </h3>
                  <ArrowRight className="w-6 h-6 text-black group-hover:text-gray-700 transition-colors" />
                </div>
                <div className="w-full h-px bg-black"></div>
              </div>
            </Link>
          </div>

          {/* Services Grid - Second Row */}
          <div className="grid gap-6 md:grid-cols-3 mb-12">
            {/* Creator Services */}
            <Link href="/capabilities/creator-services" className="relative block group">
              <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden group relative cursor-pointer mb-6">
                <Image 
                  src="https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/creator-services.jpg"
                  alt="Creator Services"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold tracking-tight text-black group-hover:text-gray-700 transition-colors">
                    Creator Services
                  </h3>
                  <ArrowRight className="w-6 h-6 text-black group-hover:text-gray-700 transition-colors" />
                </div>
                <div className="w-full h-px bg-black"></div>
              </div>
            </Link>

            {/* Sound & Sync */}
            <Link href="/capabilities/sound-sync" className="relative block group">
              <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden group relative cursor-pointer mb-6">
                <Image 
                  src="https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/sound-n-sync.jpg"
                  alt="Sound & Sync"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold tracking-tight text-black group-hover:text-gray-700 transition-colors">
                    Sound & Sync
                  </h3>
                  <ArrowRight className="w-6 h-6 text-black group-hover:text-gray-700 transition-colors" />
                </div>
                <div className="w-full h-px bg-black"></div>
              </div>
            </Link>

            {/* Media & PR Strategy */}
            <Link href="/capabilities/media-pr-strategy" className="relative block group">
              <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden group relative cursor-pointer mb-6">
                <Image 
                  src="https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/media-n-pr.jpg"
                  alt="Media & PR Strategy"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold tracking-tight text-black group-hover:text-gray-700 transition-colors">
                    Media & PR Strategy
                  </h3>
                  <ArrowRight className="w-6 h-6 text-black group-hover:text-gray-700 transition-colors" />
                </div>
                <div className="w-full h-px bg-black"></div>
              </div>
            </Link>
          </div>


        </div>
      </section>

      <FooterContainer />
    </div>
  );
}
