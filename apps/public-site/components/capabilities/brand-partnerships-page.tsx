"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/app/auth/supabaseClient";
import { PublicHeader } from "@/components/public-header";
import FooterContainer from "@/components/footer-container";
import { useInView } from 'react-intersection-observer';
import Image from "next/image";
import { Plus, Minus } from "lucide-react";

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

export function BrandPartnershipsPage() {
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
          src="https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/brand-partnerships.jpg"
          alt="Brand Partnerships Background"
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
              <span className="block sm:hidden">BRAND PARTNERSHIPS</span>
              <span className="hidden sm:block">
                BRAND<br />
                PARTNERSHIPS
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
                Building authentic connections between creators and brands
              </h2>
            </div>

            {/* Right Column - Description */}
            <div className="lg:pt-2">
              <p className="text-md sm:text-md font-light text-gray-600 leading-relaxed">
                WALLS connects forward-thinking brands with influential creators, crafting partnerships that drive authentic engagement and measurable results. We focus on long-term relationships that benefit both parties, creating campaigns that feel natural and deliver real marketplace impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expandable Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-0">
            {/* AI Matchmaking */}
            <ExpandableRow
              title="AI Matchmaking"
              description="Our advanced AI algorithms analyze brand objectives, creator content, and audience demographics to identify the perfect partnerships. We use machine learning to predict compatibility scores and engagement potential, ensuring optimal matches that drive results."
            />

            {/* Content Strategy */}
            <ExpandableRow
              title="Content Strategy"
              description="We develop comprehensive content strategies that align brand messaging with creator authenticity. From campaign concepts to execution guidelines, we ensure every piece of content feels natural while achieving brand objectives and driving audience engagement."
            />

            {/* Web App Submission */}
            <ExpandableRow
              title="Web App Submission"
              description="Streamlined digital submission process for brands and creators to connect through our platform. Our web application facilitates easy onboarding, portfolio sharing, and partnership discovery, making collaboration seamless and efficient."
            />

            {/* Calendar Tracking & Alerts */}
            <ExpandableRow
              title="Calendar Tracking & Alerts"
              description="Comprehensive campaign tracking with automated alerts and milestone notifications. We monitor key performance indicators, campaign deadlines, and engagement metrics, providing real-time updates to ensure campaigns stay on track and deliver optimal results."
            />

            {/* Partnership Analytics */}
            <ExpandableRow
              title="Partnership Analytics"
              description="Data-driven insights into partnership performance, audience engagement, and ROI metrics. Our analytics platform provides detailed reporting on campaign effectiveness, helping brands and creators optimize their collaborations for maximum impact."
            />

            {/* Contract Management */}
            <ExpandableRow
              title="Contract Management"
              description="Streamlined contract creation, negotiation, and management processes. We handle all legal aspects of brand partnerships, from initial agreements to renewal negotiations, ensuring clear terms and mutual understanding between all parties."
            />
          </div>
        </div>
      </section>



      <FooterContainer />
    </div>
  );
}
