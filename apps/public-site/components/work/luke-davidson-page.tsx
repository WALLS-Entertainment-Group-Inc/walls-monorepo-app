"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { PublicHeader } from "@/components/public-header";
import FooterContainer from "@/components/footer-container";
import { usePublicPageHeader } from "@/hooks/use-public-page-header";
import Image from "next/image";
import { Plus } from "lucide-react";

interface ExpandableRowProps {
  title: string;
  description: string;
}

function ExpandableRow({ title, description }: ExpandableRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-6 px-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
      >
        <span className="text-lg font-medium text-gray-900 text-left">
          {title}
        </span>
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Plus className="w-5 h-5 text-gray-500" />
        </motion.div>
      </button>
      
      <motion.div
        layout
        initial={false}
        animate={{
          height: isExpanded ? "auto" : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="overflow-hidden px-4"
      >
        <div className="pl-4 pb-6">
          <motion.p
            layout
            className="text-gray-600 font-light leading-relaxed"
            animate={{ y: isExpanded ? 0 : -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {description}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

export function LukeDavidsonPage() {
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
                Luke Davidson
              </h1>
              <p className="mt-2 sm:mt-4 text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-black font-light">
                Music virality
              </p>
            </div>
            
            {/* Right side navigation (pills + horizontal divider + link) */}
            <div className="hidden lg:flex flex-col items-end mb-2 w-64">
              {/* Pills */}
              <div className="flex flex-col gap-2 self-end items-end">
                {["Music", "Licensing", "Content ID", "Distribution"].map((label) => (
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
                  href="https://www.youtube.com/watch?v=M6jyrMM8Iec&list=OLAK5uy_kw25keNjFzCdcUS1TWimSPB2kGtO4hb2M"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 inline-flex items-center text-sm text-gray-900 hover:bg-walls-yellow hover:text-black transition-all duration-300 whitespace-nowrap px-2 py-1 rounded"
                >
                  LD Soundscapes
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
                {["Music", "Licensing", "Content ID", "Distribution"].map((label) => (
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
                href="https://www.youtube.com/watch?v=M6jyrMM8Iec&list=OLAK5uy_kw25keNjFzCdcUS1TWimSPB2kGtO4hb2M"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-black bg-walls-yellow px-3 py-2 rounded-lg"
              >
                LD Soundscapes
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
              src="https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/luke-davidsonn-work.png"
              alt="Luke Davidson Work"
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
              About Luke Davidson
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-black leading-relaxed text-center sm:text-left">
            Luke Davidson has established himself as one of the most recognizable Canadian creators, building a global audience of more than 17 million YouTube subscribers and 15 million TikTok followers through his sharp, relatable comedy sketches. Since earning YouTube’s Gold Creator Award in 2020, he has consistently ranked among the platform’s top performers, with billions of views and a reputation for clean, clever content. Today, Luke stands as a leading figure in digital entertainment, shaping how creators connect with audiences worldwide.
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
                  17M+
                </div>
                <div className="text-base sm:text-lg md:text-xl text-black">
                  YouTube subscribers
                </div>
              </div>
              
              <div className="text-center px-4 sm:px-6 lg:px-8 py-8 md:py-0">
                <div className="text-5xl sm:text-6xl lg:text-8xl font-bold text-black mb-4">
                  580M+
                </div>
                <div className="text-base sm:text-lg md:text-xl text-black">
                  Monetized sound views
                </div>
              </div>
              
              <div className="text-center px-4 sm:px-6 lg:px-8 py-8 md:py-0">
                <div className="text-5xl sm:text-6xl lg:text-8xl font-bold text-black mb-4">
                  10K+
                </div>
                <div className="text-base sm:text-lg md:text-xl text-black">
                  UGC&apos;s made with Sound
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
                Capitalize on YouTube&apos;s revenue sharing announcement for Shorts music through strategic sound ownership. This opportunity would allow Luke Davidson to reclaim a portion of YouTube&apos;s cut while building his creative portfolio.
              </p>
            </div>

            {/* Approach Section */}
            <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-6 sm:gap-8 md:gap-16 items-start border-t border-gray-200 pt-12 sm:pt-20">
              <h3 className="text-2xl sm:text-3xl font-serif text-center md:text-left">Approach</h3>
              <p className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed">
                We collaborated with Luke to create LD Soundscapes, an album specifically crafted for his content style. Our team managed distribution and production, allowing Luke to focus on his core strength of content creation. The sounds were naturally integrated into his videos, which laid the groundwork for organic growth beyond his channel.
              </p>
            </div>

            {/* Impact Section */}
            <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-6 sm:gap-8 md:gap-16 items-start border-t border-gray-200 pt-12 sm:pt-20">
              <h3 className="text-2xl sm:text-3xl font-serif text-center md:text-left">Impact</h3>
              <p className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed">
                The strategy surpassed all expectations with remarkable results: over 10,000 user-generated content videos and 580M+ monetized sound views. The project found additional success on Spotify, with tracks like &quot;Space Age&quot; accumulating more than 60,000 streams. Luke enhanced his revenue through both increased earnings from his Shorts and compensation royalties from viral videos using his sounds, establishing a sustainable passive income stream beyond traditional content creation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FooterContainer />
    </div>
  );
}
