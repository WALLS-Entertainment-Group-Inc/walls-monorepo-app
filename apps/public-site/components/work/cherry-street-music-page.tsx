"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/app/auth/supabaseClient";
import { PublicHeader } from "@/components/public-header";
import FooterContainer from "@/components/footer-container";
import { useInView } from 'react-intersection-observer';
import Image from "next/image";

export function CherryStreetMusicPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoadingPath, setIsLoadingPath] = useState(true);
  const [dashboardPath, setDashboardPath] = useState("/dashboard");
  
  const { ref: topSectionRef, inView } = useInView({
    threshold: 0,
    initialInView: true,
  });

  useEffect(() => {
    const getDashboardPath = async () => {
      if (user) {
        try {
          const supabase = getSupabaseClient();
          const { data: userData, error } = await supabase
            .from('users')
            .select('userType')
            .eq('auth_id', user.id)
            .single();

          if (!error && userData) {
            if (["Super Admin", "Admin", "Agent"].includes(userData.userType)) {
              setDashboardPath("/agents");
            } else if (userData.userType === "Creator") {
              setDashboardPath("/creators");
            }
          }
        } catch (error) {
          // Silently handle error and ensure loading state is reset
        } finally {
          setIsLoadingPath(false);
        }
      } else {
        setDashboardPath("/login");
        setIsLoadingPath(false);
      }
    };

    getDashboardPath();
  }, [user]);

  return (
    <div className="min-h-screen bg-white">
      <div ref={topSectionRef} className="absolute top-0 h-1 w-full" />
      <PublicHeader inView={inView} dashboardPath={dashboardPath} isLoadingPath={isLoadingPath} />
      
      {/* Hero Section */}
      <section className="relative h-[55vh] overflow-hidden bg-gray-50">
        {/* Content */}
        <div className="relative flex items-end h-full px-4 sm:px-6 lg:px-8 pb-32 sm:pb-8">
          <div className="max-w-[90%] w-full mx-auto flex justify-between items-end">
            <div>
              <h1 className="text-6xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-black">
                Cherry Street
              </h1>
              <p className="mt-2 sm:mt-4 text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-black font-light">
                Creator music platform
              </p>
            </div>
            
            {/* Right side navigation (pills + horizontal divider + link) */}
            <div className="hidden lg:flex flex-col items-end mb-2 w-64">
              {/* Pills */}
              <div className="flex flex-col gap-2 self-end items-end">
                {["Music", "Platform", "Content ID", "Royalties"].map((label) => (
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
                  href="https://www.cherrystreetmusic.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 inline-flex items-center text-sm text-gray-900 hover:bg-walls-yellow hover:text-black transition-all duration-300 whitespace-nowrap px-2 py-1 rounded"
                >
                  cherrystreetmusic.com
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
                {["Music", "Platform", "Content ID", "Royalties"].map((label) => (
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
                href="https://www.cherrystreetmusic.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-black bg-walls-yellow px-3 py-2 rounded-lg"
              >
                cherrystreetmusic.com
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
              src="https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/cherry-street.png"
              alt="Cherry Street Music Platform Interface"
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
              About Cherry Street Music
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-black leading-relaxed text-center sm:text-left">
              Cherry Street Music is a revolutionary platform that provides royalty-free and SoundShare music for creators and YouTubers, helping them claim ownership over the sounds they use in their content. With a sophisticated algorithm and Content ID system, creators can earn composition royalties while tapping into an additional revenue pool, ultimately increasing their content earnings.
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
                  3.5B+
                </div>
                <div className="text-base sm:text-lg md:text-xl text-black">
                  Sound Views
                </div>
              </div>
              
              <div className="text-center px-4 sm:px-6 lg:px-8 py-8 md:py-0">
                <div className="text-5xl sm:text-6xl lg:text-8xl font-bold text-black mb-4">
                  70k+
                </div>
                <div className="text-base sm:text-lg md:text-xl text-black">
                  UGC videos created
                </div>
              </div>
              
              <div className="text-center px-4 sm:px-6 lg:px-8 py-8 md:py-0">
                <div className="text-5xl sm:text-6xl lg:text-8xl font-bold text-black mb-4">
                  ID
                </div>
                <div className="text-base sm:text-lg md:text-xl text-black">
                  System
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
                Create a platform that empowers creators and YouTubers to claim ownership over their sounds while providing them with an additional revenue stream through composition royalties and automated Content ID systems.
              </p>
            </div>

            {/* Approach Section */}
            <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-6 sm:gap-8 md:gap-16 items-start border-t border-gray-200 pt-12 sm:pt-20">
              <h3 className="text-2xl sm:text-3xl font-serif text-center md:text-left">Approach</h3>
              <p className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed">
                We built Cherry Street Music as a comprehensive platform with a sophisticated algorithm and Content ID system. The platform allows creators to easily browse, download, or "sync" sounds to their content, while automatically claiming royalties from videos that use those sounds. Everything is designed to be extremely easy to use and fully automated, ensuring creators always get paid on time.
              </p>
            </div>

            {/* Impact Section */}
            <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-6 sm:gap-8 md:gap-16 items-start border-t border-gray-200 pt-12 sm:pt-20">
              <h3 className="text-2xl sm:text-3xl font-serif text-center md:text-left">Impact</h3>
              <p className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed">
                Cherry Street Music has revolutionized how creators approach music in their content. With over 3.5 billion sound views to date, the platform has successfully created an additional revenue stream for creators through composition royalties. The automated Content ID system ensures creators never miss out on earnings, while the user-friendly interface makes it simple to discover and integrate high-quality music into their content.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FooterContainer />
    </div>
  );
}
