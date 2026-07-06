"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { useRouter } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";
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

export function MediaPRStrategyPage() {
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
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, "users", user.id));
          const userData = userDoc.data();

          if (userData) {
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
          src="https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/media-n-pr.jpg"
          alt="Media & PR Strategy Background"
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
              <span className="block sm:hidden">MEDIA & PR STRATEGY</span>
              <span className="hidden sm:block">
                MEDIA &<br />
                PR STRATEGY
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
                Building powerful narratives that connect and inspire
              </h2>
            </div>

            {/* Right Column - Description */}
            <div className="lg:pt-2">
              <p className="text-md sm:text-md font-light text-gray-600 leading-relaxed">
                We develop comprehensive media and public relations strategies that build brand awareness, manage reputation, and create meaningful connections with target audiences. Our strategic approach ensures consistent messaging across all channels while maximizing media impact and audience engagement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expandable Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-0">
            {/* Strategic Media Planning */}
            <ExpandableRow
              title="Strategic Media Planning"
              description="We develop comprehensive media strategies that identify the most effective channels, timing, and messaging for reaching target audiences. Our planning process includes audience analysis, channel selection, and content optimization to maximize media impact and engagement."
            />

            {/* Public Relations Campaigns */}
            <ExpandableRow
              title="Public Relations Campaigns"
              description="We design and execute PR campaigns that build talent awareness, manage reputation, and create positive media coverage. Our campaigns include press releases, media outreach, event management, and crisis communications to ensure consistent brand messaging."
            />

            {/* Media Relations & Outreach */}
            <ExpandableRow
              title="Media Relations & Outreach"
              description="We build and maintain relationships with key media outlets, journalists, and influencers across entertainment and business sectors. Our media relations team ensures positive coverage and manages media inquiries to protect and enhance brand reputation."
            />

            {/* Content Strategy & Distribution */}
            <ExpandableRow
              title="Content Strategy & Distribution"
              description="We develop content strategies that align with media and PR objectives, creating compelling narratives that resonate with target audiences. Our distribution approach ensures content reaches the right people through the most effective channels at optimal times."
            />

            {/* Crisis Communications */}
            <ExpandableRow
              title="Crisis Communications"
              description="We provide rapid response crisis communications to protect brand reputation during challenging situations. Our team develops crisis management plans, handles media inquiries, and ensures consistent messaging that maintains brand integrity and public trust."
            />

            {/* Reputation Management */}
            <ExpandableRow
              title="Reputation Management"
              description="We can monitor and manage brand reputation across all media channels, implementing strategies to build positive perception and address potential issues proactively. Our approach includes sentiment analysis, media monitoring, and strategic response planning."
            />
          </div>
        </div>
      </section>

      <FooterContainer />
    </div>
  );
}
