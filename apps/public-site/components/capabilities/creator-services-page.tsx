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

export function CreatorServicesPage() {
  const { ref: topSectionRef, inView } = usePublicPageHeader();

  return (
    <div className="min-h-screen bg-white">
      <div ref={topSectionRef} className="absolute top-0 h-1 w-full" />
      <PublicHeader inView={inView} />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        {/* Background Image */}
        <Image 
          src="https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/creator-services.jpg"
          alt="Creator Services Background"
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
              <span className="block sm:hidden">CREATOR SERVICES</span>
              <span className="hidden sm:block">
                CREATOR<br />
                SERVICES
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
                Empowering creators to reach their full potential
              </h2>
            </div>

            {/* Right Column - Description */}
            <div className="lg:pt-2">
              <p className="text-md sm:text-md font-light text-gray-600 leading-relaxed">
                We provide comprehensive support for content creators at every stage of their journey. From emerging talent to established influencers, our services help creators develop their voice, grow their audience, and build sustainable careers in the entertainment industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expandable Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-0">
            {/* Content Strategy & Development */}
            <ExpandableRow
              title="Content Strategy & Development"
              description="We work with creators to develop unique content strategies that align with their personal brand and audience. Our team helps identify content themes, optimize posting schedules, and create engaging formats that drive growth and engagement."
            />

            {/* Audience Growth & Engagement */}
            <ExpandableRow
              title="Audience Growth & Engagement"
              description="We implement proven strategies to help creators expand their reach and build meaningful connections with their audience. From cross-platform promotion to community building, we focus on sustainable growth that creates lasting value."
            />

            {/* Monetization Strategy */}
            <ExpandableRow
              title="Monetization Strategy"
              description="We help creators develop diverse revenue streams beyond traditional advertising. Our strategies include brand partnerships, merchandise, digital products, and subscription models that align with creator values and audience expectations."
            />

            {/* Brand Partnership Management */}
            <ExpandableRow
              title="Brand Partnership Management"
              description="We handle all aspects of brand collaborations, from initial outreach to contract negotiation and campaign execution. Our team ensures partnerships are authentic, profitable, and aligned with creator values and audience interests."
            />

            {/* Creative Development & Production */}
            <ExpandableRow
              title="Creative Development & Production"
              description="We provide creative direction, production support, and technical expertise to help creators produce high-quality content. From concept development to post-production, we ensure every piece of content meets professional standards."
            />

            {/* Career Development & Mentorship */}
            <ExpandableRow
              title="Career Development & Mentorship"
              description="We offer personalized guidance and mentorship to help creators navigate the entertainment industry. Our experienced team provides career planning, industry insights, and strategic advice to support long-term success and growth."
            />
          </div>
        </div>
      </section>

      <FooterContainer />
    </div>
  );
}
