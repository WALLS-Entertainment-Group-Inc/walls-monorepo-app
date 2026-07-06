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

export function AdobeNonprofitsPage() {
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
                Adobe for Nonprofits
              </h1>
              <p className="mt-2 sm:mt-4 text-2xl sm:text-2xl md:text-3xl lg:text-4xl text-black font-light">
                Strategic partnership narrative
              </p>
            </div>
            
            {/* Right side navigation (pills + horizontal divider + link) */}
            <div className="hidden lg:flex flex-col items-end mb-2 w-64">
              {/* Pills */}
              <div className="flex flex-col gap-2 self-end items-end">
                {["Partnership", "Strategy", "Content", "Nonprofit"].map((label) => (
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
                  href="https://www.instagram.com/reel/DDLclClP5yg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 inline-flex items-center text-sm text-gray-900 hover:bg-walls-yellow hover:text-black transition-all duration-300 whitespace-nowrap px-2 py-1 rounded"
                >
                  MurphsLife x Adobe
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
                {["Partnership", "Strategy", "Content", "Nonprofit"].map((label) => (
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
                href="https://www.instagram.com/reel/DDLclClP5yg/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-black bg-walls-yellow px-3 py-2 rounded-lg"
              >
                MurphsLife x Adobe
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
              src="https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/adobe-christmas-murphs.jpg"
              alt="Adobe for Nonprofits Christmas Campaign with MurphsLife"
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
              About Adobe for Nonprofits Partnership
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-black leading-relaxed text-center sm:text-left">
              We orchestrated a strategic partnership between Adobe for Nonprofits and MurphsLife that demonstrated the power of finding win-win narratives. Our team crafted content that showcased how Adobe's technology empowered MurphsLife's annual Christmas campaign, creating authentic value for both organizations while serving their respective audiences.
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
                  1M+
                </div>
                <div className="text-base sm:text-lg md:text-xl text-black">
                  Follower showcase
                </div>
              </div>
              
              <div className="text-center px-4 sm:px-6 lg:px-8 py-8 md:py-0">
                <div className="text-5xl sm:text-6xl lg:text-8xl font-bold text-black mb-4">
                  20K+
                </div>
                <div className="text-base sm:text-lg md:text-xl text-black">
                  Toys for kids
                </div>
              </div>
              
              <div className="text-center px-4 sm:px-6 lg:px-8 py-8 md:py-0">
                <div className="text-5xl sm:text-6xl lg:text-8xl font-bold text-black mb-4">
                  1
                </div>
                <div className="text-base sm:text-lg md:text-xl text-black">
                  Shared belief
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
                Create a strategic partnership between Adobe for Nonprofits and MurphsLife that demonstrates mutual value while authentically serving both organizations' missions and audiences.
              </p>
            </div>

            {/* Approach Section */}
            <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-6 sm:gap-8 md:gap-16 items-start border-t border-gray-200 pt-12 sm:pt-20">
              <h3 className="text-2xl sm:text-3xl font-serif text-center md:text-left">Approach</h3>
              <p className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed">
                We identified the perfect intersection point: MurphsLife's annual Christmas campaign. By showcasing how Adobe's technology tools empowered the campaign's success, we created authentic content that demonstrated real value to MurphsLife's audience while highlighting Adobe's nonprofit impact. Our team handled content editing and strategic messaging to ensure the partnership narrative felt genuine and beneficial to both parties.
              </p>
            </div>

            {/* Impact Section */}
            <div className="grid grid-cols-1 md:grid-cols-[200px,1fr] gap-6 sm:gap-8 md:gap-16 items-start border-t border-gray-200 pt-12 sm:pt-20">
              <h3 className="text-2xl sm:text-3xl font-serif text-center md:text-left">Impact</h3>
              <p className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed">
                The partnership successfully demonstrated how strategic thinking can create authentic win-win scenarios in the nonprofit space. MurphsLife's audience gained valuable insights into how Adobe technology can enhance their campaigns, while Adobe showcased their commitment to supporting nonprofit organizations. The project established a model for how partnerships can serve multiple stakeholders authentically without feeling forced or promotional.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FooterContainer />
    </div>
  );
}
