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
    </div>
  );
}

export function DrPicklePage() {
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
                Dr. Pickle PHD
              </h1>
              <p className="mt-2 sm:mt-4 text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-black font-light">
                Interactive learning platform
              </p>
            </div>
            
            {/* Right side navigation (pills + horizontal divider + link) */}
            <div className="hidden lg:flex flex-col items-end mb-2 w-64">
              {/* Pills */}
              <div className="flex flex-col gap-2 self-end items-end">
                {["Education", "AI", "Web App", "Video Generation"].map((label) => (
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
                  href="https://picklephd.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 inline-flex items-center text-sm text-gray-900 hover:bg-walls-yellow hover:text-black transition-all duration-300 whitespace-nowrap px-2 py-1 rounded"
                >
                  picklephd.com
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
                {["Education", "AI", "Web App", "Video Generation"].map((label) => (
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
                href="https://picklephd.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-black bg-walls-yellow px-3 py-2 rounded-lg"
              >
                picklephd.com
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
              src="https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/dr-pickle-phd.png"
              alt="Dr. Pickle PHD App Interface"
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
              About Dr. Pickle PHD
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-black leading-relaxed text-center sm:text-left">
              Dr. Pickle PHD is an innovative educational platform that combines entertainment with learning through an edgy, unconventional approach. Dr. Pickle's shocking, humorous, and sometimes outrageous presentation style creates stronger neural connections in the brain, making complex concepts more memorable and easier to recall. The app leverages advanced AI technology and interactive video generation to create engaging learning experiences for students who struggle with traditional study methods.
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
                  7K+
                </div>
                <div className="text-base sm:text-lg md:text-xl text-black">
                  Active users
                </div>
              </div>
              
              <div className="text-center px-4 sm:px-6 lg:px-8 py-8 md:py-0">
                <div className="text-5xl sm:text-6xl lg:text-8xl font-bold text-black mb-4">
                  200%
                </div>
                <div className="text-base sm:text-lg md:text-xl text-black">
                  MRR monthly growth
                </div>
              </div>
              
              <div className="text-center px-4 sm:px-6 lg:px-8 py-8 md:py-0">
                <div className="text-5xl sm:text-6xl lg:text-8xl font-bold text-black mb-4">
                  92%
                </div>
                <div className="text-base sm:text-lg md:text-xl text-black">
                  User satisfaction
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
                How do you turn a creator's unique, unfiltered voice into a profitable empire when traditional brand partnerships don't align with their authentic style? Dr. Pickle had built a massive following through his unconventional, edgy educational approach, but the standard monetization playbook didn't fit his brand. Instead of changing who he was, he needed a way to monetize his audience directly.
              </p>
            </div>

            {/* Approach Section */}
            <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-6 sm:gap-8 md:gap-16 items-start border-t border-gray-200 pt-12 sm:pt-20">
              <h3 className="text-2xl sm:text-3xl font-serif text-center md:text-left">Approach</h3>
              <p className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed">
                Dr. Pickle chose to build his own empire rather than fit into someone else's box. We collaborated with his animation team to create a comprehensive web platform that would turn his loyal audience into a direct revenue stream. The project integrated custom video generation capabilities, an AI-powered chat system, and exclusive content management—essentially building a complete ecosystem where Dr. Pickle could monetize his unique brand without compromise.
              </p>
            </div>

            {/* Impact Section */}
            <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-6 sm:gap-8 md:gap-16 items-start border-t border-gray-200 pt-12 sm:pt-20">
              <h3 className="text-2xl sm:text-3xl font-serif text-center md:text-left">Impact</h3>
              <p className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed">
                The platform has achieved significant early success with over 7,000 active users during its initial launch phase. College students have particularly embraced the platform, using it to enhance their learning experience. The combination of interactive features and AI assistance has proven especially valuable for students who have difficulty focusing with traditional study methods. The project received national press coverage from The Globe and Mail, along with extensive write-ups across various media outlets, further establishing Dr. Pickle PHD as a recognized leader in educational technology innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FooterContainer />
    </div>
  );
}
