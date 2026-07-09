"use client";

import { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeepQueryMentions, getActiveMentionBeforeCursor } from "../mentions/wallie-mentions";
import { WallieComposerTrailingButton } from "../input/wallie-composer-trailing-button";
import { useAuth, getSupabaseClient } from "@walls/auth";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";

const PLACEHOLDER_SUGGESTIONS = [
  "What could be good brand partners for @Caleb Shaw",
  "Find me influencer marketing contacts at BMW Group USA",
  "Find me contacts at Sony...",
  "Draft an outreach email for @MurphsLife...",
  "Find brands to partner for our @Rosie Travels Australia sequence...",
  "Help me decide a rate for this campaign...",
  "Summarize my pending deals...",
  "Who should I follow up with today?",
  "Find brands in the beauty space...",
  "What's a fair rate for 100K followers...",
];

/** One row from talent_rates (included in talent mentions) */
export type TalentRateMention = {
  channel: string;
  deliverable: string;
  currency: string;
  rate: number;
};

export type Mention = {
  type: "talent" | "sequence";
  id: string;
  name: string;
  start: number;
  end: number;
  // Talent-specific fields (included when type is "talent")
  first_name?: string | null;
  last_name?: string | null;
  country?: string | null;
  bio_short?: string | null;
  category?: string | null;
  rates?: TalentRateMention[];
};

interface DeepQueryEmptyStateProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  onMentionsChange?: (mentions: Mention[]) => void;
  voiceEnabled?: boolean;
  voiceDisabled?: boolean;
}

export function DeepQueryEmptyState({
  inputValue,
  onInputChange,
  onSend,
  isLoading,
  onMentionsChange,
  voiceEnabled = false,
  voiceDisabled = false,
}: DeepQueryEmptyStateProps) {
  const { user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasContent, setHasContent] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isMentionOpen, setIsMentionOpen] = useState(false);
  const [mentions, setMentions] = useState<Mention[]>([]);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [initials, setInitials] = useState<string>("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Fetch user's first name and avatar
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        try {
          const supabase = getSupabaseClient();
          const { data: userData, error } = await supabase
            .from('users')
            .select('first_name, last_name, avatar_url')
            .eq('id', user.id)
            .single();
          
          if (!error && userData) {
            if (userData.first_name) {
              setFirstName(userData.first_name);
            }
            if (userData.avatar_url) {
              setAvatarUrl(userData.avatar_url);
            }
            
            // Calculate initials
            const firstName = userData.first_name || '';
            const lastName = userData.last_name || '';
            const fullName = `${firstName} ${lastName}`.trim();
            
            if (fullName) {
              const nameParts = fullName.split(" ");
              const length = nameParts.length;
              if (length > 0) {
                const firstInitial = nameParts[0].charAt(0).toUpperCase();
                const secondInitial = length > 1 ? nameParts[length - 1].charAt(0).toUpperCase() : firstInitial;
                setInitials(firstInitial.concat(secondInitial));
              }
            } else if (user?.email) {
              // Fallback to email if no name available
              const emailParts = user.email.split("@")[0].split(".");
              if (emailParts.length > 0) {
                const firstInitial = emailParts[0].charAt(0).toUpperCase();
                const secondInitial = emailParts.length > 1 ? emailParts[1].charAt(0).toUpperCase() : firstInitial;
                setInitials(firstInitial.concat(secondInitial));
              }
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user?.id, user?.email]);

  // Focus input on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Rotate placeholder suggestions
  useEffect(() => {
    // Don't rotate if user has typed something
    if (inputValue.trim()) return;

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_SUGGESTIONS.length);
    }, 9000);

    return () => clearInterval(interval);
  }, [inputValue]);

  // Clear mentions when input is cleared externally
  useEffect(() => {
    if (!inputValue.trim()) {
      setMentions([]);
      onMentionsChange?.([]);
    }
  }, [inputValue, onMentionsChange]);

  // Auto-resize textarea - start as single line, expand as needed
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to calculate new height
      textareaRef.current.style.height = 'auto';
      
      // Get the scroll height
      const scrollHeight = textareaRef.current.scrollHeight;
      
      // Set minimum height to single line (approximately 24px for text-sm)
      const minHeight = 24;
      const maxHeight = 200;
      
      // Set height based on content
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      textareaRef.current.style.height = `${newHeight}px`;
      
      // Update hasContent state for styling
      setHasContent(inputValue.trim().length > 0);
    }
  }, [inputValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Don't submit if mentions dropdown is open
    if (isMentionOpen && (e.key === 'Enter' || e.key === 'Tab')) {
      return; // Let the mentions component handle it
    }
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const oldValue = inputValue;
    const cursorPos = e.target.selectionStart;
    
    // Validate and adjust mentions based on current text
    // Simple approach: validate mentions still exist in text, remove invalid ones
    const validatedMentions = mentions.filter(mention => {
      // Check if mention text still exists at the expected position
      if (mention.end > newValue.length) return false;
      
      const mentionText = newValue.substring(mention.start, mention.end);
      // Verify the mention text matches what we expect
      return mentionText === `@${mention.name}`;
    });
    
    // If mentions were removed, update state
    if (validatedMentions.length !== mentions.length) {
      setMentions(validatedMentions);
      onMentionsChange?.(validatedMentions);
    }
    
    onInputChange(newValue);
    setCursorPosition(cursorPos);
  };

  const handleSelect = (mention: { type: 'talent' | 'sequence'; id: string; name: string; first_name?: string | null; last_name?: string | null; country?: string | null; bio_short?: string | null; category?: string | null; rates?: TalentRateMention[] }) => {
    const textBeforeCursor = inputValue.substring(0, cursorPosition);
    const activeMention = getActiveMentionBeforeCursor(textBeforeCursor);
    if (!activeMention) return;

    const lastAtIndex = activeMention.start;
    
    const textAfterCursor = inputValue.substring(cursorPosition);
    // Insert human-readable mention text
    const mentionText = `@${mention.name}`;
    
    const newValue = 
      inputValue.substring(0, lastAtIndex) + 
      mentionText + 
      ' ' +
      textAfterCursor;
    
    // Track the mention in structured format
    const mentionStart = lastAtIndex;
    const mentionEnd = lastAtIndex + mentionText.length;
    
    const newMention: Mention = {
      type: mention.type,
      id: mention.id,
      name: mention.name,
      start: mentionStart,
      end: mentionEnd,
      ...(mention.type === 'talent' && {
        first_name: mention.first_name,
        last_name: mention.last_name,
        country: mention.country,
        bio_short: mention.bio_short,
        category: mention.category,
        rates: mention.rates ?? [],
      }),
    };
    
    // Adjust existing mentions that come after this insertion
    const adjustedMentions = mentions
      .filter(m => m.start < lastAtIndex || m.start >= cursorPosition)
      .map(m => {
        if (m.start >= cursorPosition) {
          return {
            ...m,
            start: m.start + mentionText.length + 1, // +1 for space
            end: m.end + mentionText.length + 1,
          };
        }
        return m;
      });
    
    const updatedMentions = [...adjustedMentions, newMention].sort((a, b) => a.start - b.start);
    setMentions(updatedMentions);
    onMentionsChange?.(updatedMentions);
    
    onInputChange(newValue);
    
    // Set cursor position after the inserted mention
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = lastAtIndex + mentionText.length + 1; // +1 for space
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        setCursorPosition(newCursorPos);
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.currentTarget.selectionStart);
  };

  const handleClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.currentTarget.selectionStart);
  };

  const handleInsertMention = () => {
    if (!textareaRef.current) return;
    
    const textBeforeCursor = inputValue.substring(0, cursorPosition);
    const textAfterCursor = inputValue.substring(cursorPosition);
    const newValue = textBeforeCursor + '@' + textAfterCursor;
    
    onInputChange(newValue);
    
    // Update cursor position after the inserted "@"
    const newCursorPos = cursorPosition + 1;
    setCursorPosition(newCursorPos);
    
    // Set cursor position in textarea and focus
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        textareaRef.current.focus();
      }
    }, 0);
  };

  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full flex flex-col items-center">
        {/* Greeting - Always reserve space */}
        <div className="mb-6 h-[48px] flex items-center justify-center">
          {firstName && (
            <motion.h2
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-4xl font-semibold text-gray-700 tracking-tight"
            >
              Hi {firstName}, how can I help?
            </motion.h2>
          )}
        </div>
        
        {/* Indented Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeInOut", delay: 0.2 }}
          className="w-full bg-gray-50 backdrop-blur-md border border-neutral-200/70 rounded-[25px] p-2"
        >
          <div className="flex items-center gap-0">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-10 w-10 flex-shrink-0 text-gray-400 ml-1 hover:bg-transparent"
              onClick={handleInsertMention}
              disabled={isLoading}
            >
              <Plus className="h-5 w-5" />
            </Button>
            <div className="flex-1 relative flex items-center">
              {/* Animated placeholder overlay */}
              {!inputValue && (
                <div className="absolute inset-0 flex items-center pl-1 pointer-events-none overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={placeholderIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="text-sm text-neutral-300 whitespace-nowrap"
                    >
                      {PLACEHOLDER_SUGGESTIONS[placeholderIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              )}
              <textarea
                ref={textareaRef}
                className="w-full resize-none bg-transparent border-0 focus:outline-none text-sm disabled:cursor-not-allowed disabled:opacity-50 pl-1 pr-3 py-1 leading-normal"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                onClick={handleClick}
                disabled={isLoading}
                rows={1}
                style={{
                  minHeight: '24px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              />
              <DeepQueryMentions
                value={inputValue}
                cursorPosition={cursorPosition}
                onSelect={handleSelect}
                onOpenChange={setIsMentionOpen}
              />
            </div>
            <WallieComposerTrailingButton
              hasContent={hasContent}
              isLoading={isLoading}
              onSend={onSend}
              voiceEnabled={voiceEnabled}
              voiceDisabled={voiceDisabled}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
