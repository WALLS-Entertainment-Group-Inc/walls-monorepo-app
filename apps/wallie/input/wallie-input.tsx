"use client";

import { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeepQueryMentions, getActiveMentionBeforeCursor } from "../mentions/wallie-mentions";
import { WallieComposerTrailingButton } from "./wallie-composer-trailing-button";
import type { Mention, TalentRateMention } from "../empty-state/wallie-empty-state";

interface DeepQueryInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  placeholder?: string;
  className?: string;
  /** Current mentions for the draft (used when in chat view so parent can send them) */
  mentions?: Mention[];
  /** Notify parent when user adds/removes mentions */
  onMentionsChange?: (mentions: Mention[]) => void;
  voiceEnabled?: boolean;
  voiceDisabled?: boolean;
}

export function DeepQueryInput({
  value,
  onChange,
  onSend,
  isLoading,
  placeholder = "Ask anything",
  className = "",
  mentions = [],
  onMentionsChange,
  voiceEnabled = false,
  voiceDisabled = false,
}: DeepQueryInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasContent, setHasContent] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isMentionOpen, setIsMentionOpen] = useState(false);

  // Clear mentions when input is cleared (e.g. after send)
  useEffect(() => {
    if (!value.trim() && mentions.length > 0) {
      onMentionsChange?.([]);
    }
  }, [value, mentions.length, onMentionsChange]);

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
      setHasContent(value.trim().length > 0);
    }
  }, [value]);

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
    onChange(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const handleSelect = (mention: { type: 'talent' | 'sequence'; id: string; name: string; first_name?: string | null; last_name?: string | null; country?: string | null; bio_short?: string | null; category?: string | null; rates?: TalentRateMention[] }) => {
    const textBeforeCursor = value.substring(0, cursorPosition);
    const activeMention = getActiveMentionBeforeCursor(textBeforeCursor);
    if (!activeMention) return;

    const lastAtIndex = activeMention.start;
    
    const mentionText = `@${mention.name}`;
    const textAfterCursor = value.substring(cursorPosition);
    const newValue =
      value.substring(0, lastAtIndex) +
      mentionText +
      ' ' +
      textAfterCursor;

    // Track the mention for the backend (same shape as empty state)
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
            start: m.start + mentionText.length + 1,
            end: m.end + mentionText.length + 1,
          };
        }
        return m;
      });
    const updatedMentions = [...adjustedMentions, newMention].sort((a, b) => a.start - b.start);
    onMentionsChange?.(updatedMentions);

    onChange(newValue);
    
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
    
    const textBeforeCursor = value.substring(0, cursorPosition);
    const textAfterCursor = value.substring(cursorPosition);
    const newValue = textBeforeCursor + '@' + textAfterCursor;
    
    onChange(newValue);
    
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

  return (
    <div className={cn("w-full", className)}>
      {/* Indented Container */}
      <div className="w-full bg-gray-50 backdrop-blur-md border border-neutral-200/70 rounded-[25px] p-2">
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
            <textarea
              ref={textareaRef}
              className="w-full resize-none bg-transparent border-0 focus:outline-none text-sm placeholder:text-neutral-300 disabled:cursor-not-allowed disabled:opacity-50 pl-1 pr-3 py-1 leading-normal"
              placeholder={placeholder}
              value={value}
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
              value={value}
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
      </div>
    </div>
  );
}
