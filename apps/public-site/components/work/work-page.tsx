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
import { ArrowRight } from "lucide-react";

interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  route: string;
  tags: string[];
}

const caseStudies: CaseStudy[] = [
  {
    id: "ted-zhar",
    title: "Ted Zhar",
    subtitle: "Meet Your Heroes",
    description: "Strategic celebrity collaborations that revolutionized creator networking through calculated positioning and viral content strategies.",
    image: "https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/ted-zhar-work.png",
    route: "/work/ted-zhar",
    tags: ["Strategy", "Viral Content", "Brand Building"]
  },
  {
    id: "adobe-nonprofits",
    title: "Adobe for Nonprofits",
    subtitle: "Strategic partnership",
    description: "We orchestrated a strategic partnership between Adobe for Nonprofits and MurphsLife that demonstrated the power of finding win-win narratives.",
    image: "https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/adobe-christmas-murphs.jpg",
    route: "/work/adobe-nonprofits",
    tags: ["Partnership", "Strategy", "Content", "Nonprofit"]
  },
  {
    id: "dr-pickle",
    title: "Dr. Pickle",
    subtitle: "Edutainment App",
    description: "Creating an educational entertainment platform that makes learning engaging and accessible for all audiences.",
    image: "https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/dr-pickle-phd.png",
    route: "/work/dr-pickle",
    tags: ["Education", "Entertainment", "Web App"]
  },
  {
    id: "lilyisthatyou",
    title: "Lilyisthatyou",
    subtitle: "Artist Development",
    description: "Led the production vision and music team that created the hit record FMRN, which became a viral sensation and secured a major record deal with Warner Music.",
    image: "https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/LILYISTHATYOU-cr-Brian-Ziff-press-2021-billboard-1548.webp",
    route: "/work/lilyisthatyou",
    tags: ["Music", "Production", "Record Deal"]
  },
  {
    id: "luke-davidson",
    title: "Luke Davidson",
    subtitle: "Music Virality",
    description: "Capitalizing on YouTube's revenue sharing for Shorts music through strategic sound ownership and creative portfolio building.",
    image: "https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/luke-davidsonn-work.png",
    route: "/work/luke-davidson",
    tags: ["Music", "Licensing", "Content ID", "Distribution"]
  },
  {
    id: "cherry-street-music",
    title: "Cherry Street",
    subtitle: "Creator music platform",
    description: "With a sophisticated Spotify-like algorithm and Content ID system, creators can earn composition royalties just by using Cherry Street sounds.",
    image: "https://oehqusxpbwtbeenzixjh.supabase.co/storage/v1/object/public/web-ui-elements/cherry-street.png",
    route: "/work/cherry-street-music",
    tags: ["Music", "Platform", "Content ID", "Royalties"]
  }
];

export function WorkPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoadingPath, setIsLoadingPath] = useState(true);
  const [dashboardPath, setDashboardPath] = useState("/dashboard");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { ref: topSectionRef, inView } = useInView({
    threshold: 0,
    initialInView: true,
  });

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

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 1, 
      y: 0,
      scale: 1
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div ref={topSectionRef} className="absolute top-0 h-1 w-full" />
      <PublicHeader inView={inView} dashboardPath={dashboardPath} isLoadingPath={isLoadingPath} />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div
            className="text-left flex flex-col md:flex-row md:justify-between md:items-start gap-6 md:gap-0"
          >
            <p className="text-xl sm:text-2xl lg:text-3xl text-black font-light max-w-4xl leading-relaxed">
              Working with creators to grow their brand identity, win hearts, drive revenue, and claim bragging rights.
            </p>
            
            {/* View options */}
            <div className="flex gap-4 md:gap-6 self-start">
              <button 
                onClick={() => setViewMode('grid')}
                className={`text-base md:text-lg pb-2 transition-colors duration-300 ${
                  viewMode === 'grid' 
                    ? 'font-bold text-black border-b-2 border-black' 
                    : 'font-light text-gray-500 hover:text-black'
                }`}
              >
                Grid
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`text-base md:text-lg pb-2 transition-colors duration-300 ${
                  viewMode === 'list' 
                    ? 'font-bold text-black border-b-2 border-black' 
                    : 'font-light text-gray-500 hover:text-black'
                }`}
              >
                List
              </button>
            </div>
          </div>
          
          {/* Remove the separate navigation/filter bar section */}
        </div>
      </section>

      {/* Case Studies - Grid or List View */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {viewMode === 'grid' ? (
            /* Grid View */
            <motion.div 
              className="grid gap-8 md:grid-cols-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {caseStudies.map((caseStudy, index) => (
                <motion.div
                  key={caseStudy.id}
                  variants={itemVariants}
                  className="group cursor-pointer"
                  onClick={() => router.push(caseStudy.route)}
                >
                  <div className="bg-white rounded-3xl overflow-hidden transition-all duration-500">
                    {/* Image Container - 1:1 aspect ratio */}
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={caseStudy.image}
                        alt={caseStudy.title}
                        fill
                        className="object-cover"
                      />
                      
                      {/* Desktop Hover Overlay with Project Details */}
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out backdrop-blur-sm hidden md:block">
                        <div className="relative h-full flex flex-col justify-between p-8">
                          {/* Top Section - Divider */}
                          <div className="h-px bg-white -mb-[350px]"></div>
                          
                          {/* Content Section - Tags and Description Side by Side */}
                          <div className="flex gap-6 items-start pt-6">
                            {/* Tags - Left Side (1/4 width) */}
                            <div className="w-1/4 space-y-2">
                              {caseStudy.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="bg-gradient-to-br from-white/20 via-white/5 to-white/10 backdrop-blur-lg text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/30 shadow-xl inline-block"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            {/* Vertical Divider */}
                            <div className="w-px bg-white self-stretch"></div>
                            
                            {/* Description - Right Side (3/4 width) */}
                            <div className="w-3/4">
                              <p className="text-white text-lg leading-relaxed font-light">
                                {caseStudy.description}
                              </p>
                            </div>
                          </div>
                          
                          {/* Bottom Section - Button and Image */}
                          <div className="flex items-end justify-between">
                            <button className="bg-walls-yellow text-black px-6 py-3 rounded-full font-medium hover:bg-neutral-800 hover:text-walls-yellow transition-all duration-500 ease-in-out flex items-center gap-2">
                              <span>View Case Study</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                              </svg>
                            </button>
                            
                            {/* Image in bottom right */}
                            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white/20">
                              <Image
                                src={caseStudy.image}
                                alt={caseStudy.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Project Title and Description */}
                  <div className="mt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h3 className="text-5xl font-bold text-black mb-2">
                          {caseStudy.title}
                        </h3>
                        <p className="text-2xl text-black font-light">
                          {caseStudy.subtitle}
                        </p>
                      </div>
                      
                      {/* Mobile View Case Study Button */}
                      <button 
                        onClick={() => router.push(caseStudy.route)}
                        className="sm:hidden bg-walls-yellow text-black px-6 py-3 rounded-full font-medium hover:bg-neutral-800 hover:text-walls-yellow transition-all duration-500 ease-in-out flex items-center gap-2 self-start"
                      >
                        <span>View Case Study</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* List View */
            <motion.div 
              className="space-y-0"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {caseStudies.map((caseStudy, index) => (
                <div key={caseStudy.id}>
                  <motion.div
                    variants={itemVariants}
                    className="group cursor-pointer p-6 transition-all duration-300"
                    onClick={() => router.push(caseStudy.route)}
                  >
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                      {/* Image - Larger on mobile, smaller on desktop */}
                      <div className="relative w-32 h-32 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={caseStudy.image}
                          alt={caseStudy.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      {/* Vertical Divider after image - only on desktop */}
                      <div className="hidden md:block w-px h-20 bg-gray-200 self-center"></div>
                      
                      {/* Content - Mobile: single column, Desktop: 12-column grid */}
                      <div className="flex-1 min-w-0">
                        {/* Mobile Layout - Single column with larger text */}
                        <div className="md:hidden space-y-4">
                          {/* Title and Subtitle */}
                          <div>
                            <h3 className="text-2xl font-bold text-black mb-2">
                              {caseStudy.title}
                            </h3>
                            <p className="text-lg text-gray-600 font-light">
                              {caseStudy.subtitle}
                            </p>
                          </div>
                          
                          {/* Description */}
                          <p className="text-base text-gray-700 leading-relaxed">
                            {caseStudy.description}
                          </p>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2">
                            {caseStudy.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex rounded-full bg-gradient-to-r from-pink-300/60 via-teal-300/60 to-blue-300/60 p-[1px]"
                              >
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-900">
                                  {tag}
                                </span>
                              </span>
                            ))}
                          </div>
                          
                          {/* Button */}
                          <button 
                            onClick={() => router.push(caseStudy.route)}
                            className="bg-walls-yellow text-black px-6 py-3 rounded-full font-medium hover:bg-neutral-800 hover:text-walls-yellow transition-all duration-500 ease-in-out flex items-center gap-2 self-start"
                          >
                            <span>View Case Study</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Desktop Layout - 12-column grid (unchanged) */}
                        <div className="hidden md:grid grid-cols-12 gap-6 items-center">
                          {/* Left Column - Header and Subtitle */}
                          <div className="md:col-span-3 md:text-left">
                            <h3 className="text-2xl md:text-3xl font-bold text-black mb-2">
                              {caseStudy.title}
                            </h3>
                            <p className="text-lg md:text-xl text-gray-600 font-light">
                              {caseStudy.subtitle}
                            </p>
                          </div>
                          
                          {/* Middle Column - Description and Tags */}
                          <div className="md:col-span-6 md:text-left">
                            <p className="text-base text-gray-700 leading-relaxed mb-4">
                              {caseStudy.description}
                            </p>
                            
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                              {caseStudy.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex rounded-full bg-gradient-to-r from-pink-300/60 via-teal-300/60 to-blue-300/60 p-[1px]"
                                >
                                  <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-900">
                                    {tag}
                                  </span>
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Right Column - Button */}
                          <div className="md:col-span-3 flex justify-center md:justify-end">
                            <button 
                              onClick={() => router.push(caseStudy.route)}
                              className="bg-walls-yellow text-black px-6 py-3 rounded-full font-medium hover:bg-neutral-800 hover:text-walls-yellow transition-all duration-500 ease-in-out flex items-center gap-2"
                            >
                              <span>View Case Study</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      

                    </div>
                  </motion.div>
                  
                  {/* Divider between case studies */}
                  {index < caseStudies.length - 1 && (
                    <div className="h-px bg-gray-200 mx-6"></div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </section>



      <FooterContainer />
    </div>
  );
}
