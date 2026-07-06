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

export function SoundSyncPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoadingPath, setIsLoadingPath] = useState(true);
  const [dashboardPath, setDashboardPath] = useState("/dashboard");
  
  // Intersection observer for header visibility
  const { ref: topSectionRef, inView } = useInView({
    threshold: 0,
    initialInView: true,
  });

  // Add useEffect to handle dashboard path
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
      <section className="relative h-[60vh] overflow-hidden">
        {/* Background Image */}
        <Image 
          src="https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/sound-n-sync.jpg"
          alt="Sound & Sync Background"
          fill
          className="object-cover"
          priority
        />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Content */}
        <div className="relative z-10 flex items-end h-full px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl w-full">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-white/90 drop-shadow-lg">
              <span className="block sm:hidden">SOUND & SYNC</span>
              <span className="hidden sm:block">
                SOUND<br />
                & SYNC
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="pt-28 pb-10 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start">
            {/* Left Column - Heading */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                Bringing music and audio to life across all media
              </h2>
            </div>

            {/* Right Column - Description */}
            <div className="lg:pt-2">
              <p className="text-md sm:text-md font-light text-gray-600 leading-relaxed">
                We specialize in music licensing, synchronization, and audio production for brands, creators, and entertainment projects. Our comprehensive sound services ensure the perfect audio experience across all platforms, from digital content to traditional media.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expandable Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-0">
            {/* Music Licensing & Rights Management */}
            <ExpandableRow
              title="Music Licensing & Rights Management"
              description="We handle all aspects of music licensing, from securing rights for commercial use to managing complex copyright agreements. Our team ensures legal compliance while providing access to diverse music catalogs for brands and content creators."
            />

            {/* Audio Synchronization */}
            <ExpandableRow
              title="Audio Synchronization"
              description="We specialize in perfect audio synchronization for video content, ensuring music and sound effects are precisely timed with visual elements. Our expertise covers everything from social media content to feature-length productions."
            />

            {/* Custom Audio Production */}
            <ExpandableRow
              title="Custom Audio Production"
              description="We create original audio content tailored to brand identity and project requirements. From custom jingles to full soundtracks, our production team delivers high-quality audio that enhances brand recognition and audience engagement."
            />

            {/* Brand Music Strategy */}
            <ExpandableRow
              title="Brand Music Strategy"
              description="We develop comprehensive music strategies that align with brand values and target audience preferences. Our approach includes music selection, licensing strategy, and audio branding guidelines that create consistent brand experiences."
            />

            {/* Content Audio Optimization */}
            <ExpandableRow
              title="Content Audio Optimization"
              description="We optimize audio quality and levels for different platforms and devices, ensuring optimal listening experiences across all media. From podcast production to video content, we ensure audio meets platform-specific requirements."
            />

            {/* Audio Rights Clearance */}
            <ExpandableRow
              title="Audio Rights Clearance"
              description="We handle the complex process of clearing audio rights for commercial use, including music, sound effects, and voice recordings. Our team navigates licensing requirements to ensure projects can proceed without legal complications."
            />
          </div>
        </div>
      </section>

      <FooterContainer />
    </div>
  );
}
