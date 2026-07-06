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

export function DataArtificialRecognitionPage() {
  const { ref: topSectionRef, inView } = usePublicPageHeader();

  return (
    <div className="min-h-screen bg-white">
      <div ref={topSectionRef} className="absolute top-0 h-1 w-full" />
      <PublicHeader inView={inView} />
      
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        {/* Background Image */}
        <Image 
          src="https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/data.jpg"
          alt="Data & Artificial Recognition Background"
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
              <span className="block sm:hidden">DATA & ARTIFICIAL RECOGNITION</span>
              <span className="hidden sm:block">
                DATA &<br />
                ARTIFICIAL<br />
                RECOGNITION
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
                Transforming insights into entertainment success
              </h2>
            </div>

            {/* Right Column - Description */}
            <div className="lg:pt-2">
              <p className="text-md sm:text-md font-light text-gray-600 leading-relaxed">
                We leverage advanced data analytics and artificial intelligence to uncover deep insights, predict trends, and optimize every aspect of entertainment marketing. Our data-driven approach ensures campaigns are built on solid foundations and deliver measurable, scalable results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expandable Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-0">
            {/* Predictive Analytics */}
            <ExpandableRow
              title="Predictive Analytics"
              description="We use machine learning algorithms to predict campaign performance, audience behavior, and market trends. Our predictive models analyze historical data to forecast outcomes, helping brands and creators make data-informed decisions that maximize success probability."
            />

            {/* Audience Intelligence */}
            <ExpandableRow
              title="Audience Intelligence"
              description="We analyze audience demographics, behaviors, and preferences to create detailed audience personas and targeting strategies. Our AI-powered insights reveal what content resonates, when audiences are most engaged, and how to optimize messaging for maximum impact."
            />

            {/* Campaign Performance Optimization */}
            <ExpandableRow
              title="Campaign Performance Optimization"
              description="We continuously monitor and optimize campaigns using real-time data and AI-driven insights. Our systems automatically adjust targeting, messaging, and delivery to improve performance, ensuring campaigns achieve optimal ROI and engagement rates."
            />

            {/* Content Recognition & Analysis */}
            <ExpandableRow
              title="Content Recognition & Analysis"
              description="Our AI systems analyze content performance, sentiment, and engagement patterns to identify what works best. We use computer vision and natural language processing to understand content effectiveness and guide creative decisions for future campaigns."
            />

            {/* Market Trend Analysis */}
            <ExpandableRow
              title="Market Trend Analysis"
              description="We track and analyze entertainment industry trends, competitor strategies, and market dynamics using advanced data mining techniques. Our insights help brands and creators stay ahead of the curve and capitalize on emerging opportunities."
            />


          </div>
        </div>
      </section>

      <FooterContainer />
    </div>
  );
}
