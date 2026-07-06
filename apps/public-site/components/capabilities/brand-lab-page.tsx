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

export function BrandLabPage() {
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
          src="https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/brand-lab.jpg"
          alt="Venture Labs Background"
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
              <span className="block sm:hidden">VENTURE LABS</span>
              <span className="hidden sm:block">
                VENTURE<br />
                LABS
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
                Innovating the future of entertainment marketing
              </h2>
            </div>

            {/* Right Column - Description */}
            <div className="lg:pt-2">
              <p className="text-md sm:text-md font-light text-gray-600 leading-relaxed">
                Venture Labs is our creative incubator where we experiment with cutting-edge strategies, emerging technologies, and bold concepts. We push boundaries to discover new ways brands and creators can connect, innovate, and captivate audiences in the ever-evolving entertainment landscape.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expandable Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-0">
            {/* Creative Concept Development */}
            <ExpandableRow
              title="Creative Concept Development"
              description="We develop breakthrough creative concepts that challenge conventional thinking and push creative boundaries. Our team explores unconventional approaches, experimental formats, and innovative storytelling techniques to create products that stand out in the crowded entertainment space."
            />

            {/* Emerging Technology Integration */}
            <ExpandableRow
              title="Emerging Technology Integration"
              description="We experiment with cutting-edge technologies like AR, VR, AI, and blockchain to create immersive brand experiences. Our lab explores how these technologies can enhance storytelling, engagement, and brand-consumer interactions in entertainment marketing."
            />

            {/* Experimental Campaign Formats */}
            <ExpandableRow
              title="Experimental Campaign Formats"
              description="We test and iterate on new campaign formats, from interactive content to gamified experiences. Our experimental approach allows us to discover what resonates with audiences and create innovative ways for brands to connect with consumers."
            />

            {/* Creative Strategy Innovation */}
            <ExpandableRow
              title="Creative Strategy Innovation"
              description="We develop innovative creative strategies that break from traditional marketing approaches. Our lab explores new methodologies, creative frameworks, and strategic thinking that can revolutionize how brands approach entertainment marketing."
            />

            {/* Audience Behavior Research */}
            <ExpandableRow
              title="Audience Behavior Research"
              description="We conduct deep research into audience behavior, preferences, and engagement patterns. Our findings inform creative decisions and help us develop strategies that truly resonate with target demographics in the entertainment space."
            />

            {/* Creative Partnership Models */}
            <ExpandableRow
              title="Creative Partnership Models"
              description="We experiment with new partnership structures and collaboration models between brands, creators, and platforms. Our lab explores innovative ways to structure deals, share value, and create mutually beneficial relationships in entertainment."
            />
          </div>
        </div>
      </section>

      <FooterContainer />
    </div>
  );
}
