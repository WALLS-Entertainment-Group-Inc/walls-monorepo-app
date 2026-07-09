"use client";

import { useState, useEffect, useRef } from 'react';
import { FALLBACK_ICON_URL } from "@/lib/asset-urls";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, getSupabaseClient } from "@walls/auth";
import { cn } from "@/lib/utils";

/** One row from talent_rates (channel, deliverable, currency, rate) */
export interface TalentRate {
  channel: string;
  deliverable: string;
  currency: string;
  rate: number;
}

interface Talent {
  id: string;
  name: string;
  avatar_url: string | null;
  first_name: string | null;
  last_name: string | null;
  country: string | null;
  bio_short: string | null;
  category: string | null;
  rates: TalentRate[];
}

interface Sequence {
  id: string;
  name: string;
  description: string | null;
}

interface MentionPosition {
  start: number;
  end: number;
  query: string;
}

export interface TalentMentionPayload {
  type: 'talent';
  id: string;
  name: string;
  first_name?: string | null;
  last_name?: string | null;
  country?: string | null;
  bio_short?: string | null;
  category?: string | null;
  rates?: TalentRate[];
}

export interface SequenceMentionPayload {
  type: 'sequence';
  id: string;
  name: string;
}

interface DeepQueryMentionsProps {
  value: string;
  cursorPosition: number;
  onSelect: (mention: TalentMentionPayload | SequenceMentionPayload) => void;
  onOpenChange?: (isOpen: boolean) => void;
}

/** True when `@` starts a mention (not inside an email address or mid-word). */
export function isValidMentionTrigger(text: string, atIndex: number): boolean {
  if (atIndex < 0 || text[atIndex] !== "@") return false;
  if (atIndex === 0) return true;
  return /\s/.test(text[atIndex - 1]);
}

export function getActiveMentionBeforeCursor(
  textBeforeCursor: string
): { start: number; query: string } | null {
  const lastAtIndex = textBeforeCursor.lastIndexOf("@");
  if (lastAtIndex === -1) return null;
  if (!isValidMentionTrigger(textBeforeCursor, lastAtIndex)) return null;

  const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
  if (textAfterAt.includes(" ") || textAfterAt.includes("\n")) return null;

  return {
    start: lastAtIndex,
    query: textAfterAt.toLowerCase(),
  };
}

export function DeepQueryMentions({
  value,
  cursorPosition,
  onSelect,
  onOpenChange,
}: DeepQueryMentionsProps) {
  const { user } = useAuth();
  const [talent, setTalent] = useState<Talent[]>([]);
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [filteredTalent, setFilteredTalent] = useState<Talent[]>([]);
  const [filteredSequences, setFilteredSequences] = useState<Sequence[]>([]);
  const [searchTalent, setSearchTalent] = useState<Talent[]>([]);
  const [searchSequences, setSearchSequences] = useState<Sequence[]>([]);
  const [mentionPosition, setMentionPosition] = useState<MentionPosition | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTalent, setExpandedTalent] = useState(false);
  const [expandedSequences, setExpandedSequences] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch talent and sequences
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = getSupabaseClient();
        
        if (!user?.email) {
          setTalent([]);
          setSequences([]);
          return;
        }

        const { data: { user: supabaseUser } } = await supabase.auth.getUser();
        if (!supabaseUser?.email) {
          setTalent([]);
          setSequences([]);
          return;
        }

        // Fetch talent (without profiles join to avoid RLS/embed issues)
        const { data: talentData, error: talentError } = await supabase
          .from('talent')
          .select('id, first_name, last_name, avatar_url, country, bio_short, profile_id')
          .eq('status', 'Active')
          .order('first_name', { ascending: true });

        if (talentError) {
          console.error('Mentions: talent fetch error', talentError);
        }

        if (talentData && talentData.length > 0) {
          const talentIds = talentData.map((t: any) => t.id);
          const profileIds = talentData.map((t: any) => t.profile_id).filter(Boolean);
          let categoryByProfileId: Record<string, string | null> = {};
          if (profileIds.length > 0) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('id, category')
              .in('id', profileIds);
            if (profileData) {
              profileData.forEach((p: any) => {
                categoryByProfileId[p.id] = p.category ?? null;
              });
            }
          }

          // Fetch talent_rates for all talent (ensure RLS allows SELECT on talent_rates)
          const { data: ratesData } = await supabase
            .from('talent_rates')
            .select('talent_id, channel, deliverable, currency, rate')
            .in('talent_id', talentIds);

          const ratesByTalentId: Record<string, TalentRate[]> = {};
          if (ratesData && ratesData.length > 0) {
            ratesData.forEach((r: { talent_id: string; channel: string; deliverable: string; currency: string; rate: number }) => {
              if (!ratesByTalentId[r.talent_id]) ratesByTalentId[r.talent_id] = [];
              ratesByTalentId[r.talent_id].push({
                channel: r.channel,
                deliverable: r.deliverable,
                currency: r.currency,
                rate: Number(r.rate),
              });
            });
          }

          const talentList: Talent[] = talentData
            .map((t: any) => {
              const firstName = t.first_name || '';
              const lastName = t.last_name || '';
              const fullName = `${firstName} ${lastName}`.trim();
              const name = fullName || 'Unknown';
              return {
                id: t.id,
                name,
                avatar_url: t.avatar_url || null,
                first_name: t.first_name || null,
                last_name: t.last_name || null,
                country: t.country || null,
                bio_short: t.bio_short || null,
                category: t.profile_id ? (categoryByProfileId[t.profile_id] ?? null) : null,
                rates: ratesByTalentId[t.id] ?? [],
              };
            })
            .sort((a: Talent, b: Talent) => a.name.localeCompare(b.name));

          setTalent(talentList);
        } else {
          setTalent([]);
        }

        // Fetch sequences
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('email', supabaseUser.email)
          .single();

        if (userData?.id) {
          const { data: sequencesData, error: sequencesError } = await supabase
            .from('sequences')
            .select('id, name, description')
            .in('status', ['draft', 'active', 'paused'])
            .order('created_at', { ascending: false });
          
          if (!sequencesError && sequencesData) {
            setSequences(sequencesData.map(s => ({
              id: s.id,
              name: s.name,
              description: s.description
            })));
          }
        }
      } catch (error) {
        console.error("Error fetching mentions data:", error);
      }
    };

    fetchData();
  }, [user?.email]);

  // Detect @ mention
  useEffect(() => {
    const textBeforeCursor = value.substring(0, cursorPosition);
    const activeMention = getActiveMentionBeforeCursor(textBeforeCursor);

    if (!activeMention) {
      setMentionPosition(null);
      onOpenChange?.(false);
      return;
    }

    setMentionPosition({
      start: activeMention.start,
      end: cursorPosition,
      query: activeMention.query,
    });
    setSelectedIndex(0);
    setSearchTerm(""); // Reset search when new mention starts
    onOpenChange?.(true);
    // Focus search input when dropdown opens
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [value, cursorPosition, onOpenChange]);

  // Initialize filtered lists
  useEffect(() => {
    setFilteredTalent(talent);
    setFilteredSequences(sequences);
  }, [talent, sequences]);

  // Filter talent by search query
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchTalent(filteredTalent);
      return;
    }

    const query = searchTerm.toLowerCase();
    const filtered = filteredTalent.filter(t =>
      t.name.toLowerCase().includes(query)
    );
    setSearchTalent(filtered);
  }, [searchTerm, filteredTalent]);

  // Filter sequences by search query
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchSequences(filteredSequences);
      return;
    }

    const query = searchTerm.toLowerCase();
    const filtered = filteredSequences.filter(s =>
      s.name.toLowerCase().includes(query) ||
      (s.description && s.description.toLowerCase().includes(query))
    );
    setSearchSequences(filtered);
  }, [searchTerm, filteredSequences]);

  // Also filter by mention query if present
  useEffect(() => {
    if (!mentionPosition) {
      return;
    }

    const query = mentionPosition.query;
    
    const filteredT = talent.filter(t => 
      t.name.toLowerCase().includes(query)
    );
    
    const filteredS = sequences.filter(s => 
      s.name.toLowerCase().includes(query) ||
      (s.description && s.description.toLowerCase().includes(query))
    );
    
    setFilteredTalent(filteredT);
    setFilteredSequences(filteredS);
  }, [mentionPosition, talent, sequences]);

  const displayTalent = searchTerm.trim() ? searchTalent : filteredTalent;
  const displaySequences = searchTerm.trim() ? searchSequences : filteredSequences;

  const allItems = [
    ...displayTalent.map(t => ({ type: 'talent' as const, ...t })),
    ...displaySequences.map(s => ({ type: 'sequence' as const, ...s }))
  ];

  const handleSelect = (item: typeof allItems[0]) => {
    if (mentionPosition) {
      if (item.type === 'talent') {
        onSelect({
          type: 'talent',
          id: item.id,
          name: item.name,
          first_name: item.first_name ?? undefined,
          last_name: item.last_name ?? undefined,
          country: item.country ?? undefined,
          bio_short: item.bio_short ?? undefined,
          category: item.category ?? undefined,
          rates: item.rates ?? [],
        });
      } else {
        onSelect({ type: 'sequence', id: item.id, name: item.name });
      }
      setMentionPosition(null);
      onOpenChange?.(false);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!mentionPosition || allItems.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % allItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + allItems.length) % allItems.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        if (allItems[selectedIndex]) {
          handleSelect(allItems[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        setMentionPosition(null);
        onOpenChange?.(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mentionPosition, allItems, selectedIndex, onOpenChange]);

  if (!mentionPosition) {
    return null;
  }

  const hasTalent = displayTalent.length > 0;
  const hasSequences = displaySequences.length > 0;

  return (
    <div
      ref={dropdownRef}
      className="absolute z-[9999] w-[350px] min-w-[350px] max-h-[320px] p-0 bg-white/80 backdrop-blur-xl shadow-2xl rounded-lg overflow-hidden flex flex-col"
      style={{
        bottom: '100%',
        marginBottom: '8px',
      }}
    >
      {/* Search Input - Sticky (same as pitchTracker) */}
      <div className="p-2 border-b border-gray-900/10 flex-shrink-0 sticky top-0 bg-white/80 backdrop-blur-xl z-10">
        <div className="rounded-lg bg-neutral-100 backdrop-blur-md shadow-inner border border-neutral-200/50 pr-4 pl-2 py-2">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              e.stopPropagation();
              setSearchTerm(e.target.value);
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Escape") {
                setSearchTerm("");
              }
            }}
            placeholder="Search..."
            className="border-0 focus-visible:ring-0 focus:ring-0 bg-transparent flex-1 w-full text-sm focus:outline-none placeholder:text-neutral-400"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {/* Scrollable content (same as pitchTracker) */}
      <div className="overflow-y-auto flex-1 bg-neutral-300/20 backdrop-blur-xl">
        {/* Talent Section */}
        <div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setExpandedTalent(!expandedTalent);
            }}
            onMouseDown={(e) => e.preventDefault()}
            className="flex items-center w-full px-4 py-2 border-b border-gray-900/10 cursor-pointer bg-neutral-200/50 hover:bg-neutral-300/40 transition-colors"
          >
            <span className="text-sm font-normal text-gray-700">Talent</span>
            <div className="flex-1" />
            {expandedTalent ? (
              <Minus className="h-4 w-4 text-gray-500" />
            ) : (
              <Plus className="h-4 w-4 text-gray-500" />
            )}
          </button>
          <AnimatePresence>
            {expandedTalent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                {displayTalent.length === 0 ? (
                  <div className="py-2 px-4 text-sm text-gray-500">No talent found</div>
                ) : (
                  displayTalent.map((t, index) => {
                    const itemIndex = index;
                    const isSelected = itemIndex === selectedIndex;
                    return (
                      <div
                        key={t.id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSelect({ type: 'talent', ...t });
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className={cn(
                          "flex items-center px-4 py-2 cursor-pointer rounded-none hover:bg-neutral-300/30 focus:bg-neutral-500/10 transition-colors",
                          isSelected && "bg-neutral-100/90"
                        )}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <div className="relative w-6 h-6 flex-shrink-0 rounded-full overflow-hidden">
                            {t.avatar_url ? (
                              <Image
                                src={t.avatar_url}
                                alt={t.name}
                                fill
                                className="object-cover"
                                sizes="24px"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = FALLBACK_ICON_URL;
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-xs text-gray-600">
                                  {t.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-normal text-sm text-gray-700">{t.name}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sequences Section */}
        <div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setExpandedSequences(!expandedSequences);
            }}
            onMouseDown={(e) => e.preventDefault()}
            className="flex items-center w-full px-4 py-2 border-b border-gray-900/10 cursor-pointer bg-neutral-200/50 hover:bg-neutral-300/40 transition-colors"
          >
            <span className="text-sm font-normal text-gray-700">Sequences</span>
            <div className="flex-1" />
            {expandedSequences ? (
              <Minus className="h-4 w-4 text-gray-500" />
            ) : (
              <Plus className="h-4 w-4 text-gray-500" />
            )}
          </button>
          <AnimatePresence>
            {expandedSequences && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                {displaySequences.length === 0 ? (
                  <div className="py-2 px-4 text-sm text-gray-500">No sequences found</div>
                ) : (
                  displaySequences.map((s, index) => {
                    const itemIndex = displayTalent.length + index;
                    const isSelected = itemIndex === selectedIndex;
                    return (
                      <div
                        key={s.id}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSelect({ type: 'sequence', ...s });
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className={cn(
                          "flex items-center px-4 py-2 cursor-pointer rounded-none hover:bg-neutral-300/30 focus:bg-neutral-500/10 transition-colors",
                          isSelected && "bg-neutral-100/90"
                        )}
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <div className="w-6 h-6 flex-shrink-0 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-600">S</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="font-normal text-sm text-gray-700">{s.name}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
