"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  emailDraftBodyPreview,
  splitRecipientEmails,
  type WallieEmailDraft,
} from "@/lib/wallie/email-draft";

interface WallieEmailDraftCardProps {
  draft: WallieEmailDraft;
  onEditSend?: (draft: WallieEmailDraft) => void;
  className?: string;
}

const AVATAR_COLORS = [
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
  { bg: "bg-cyan-100", text: "text-cyan-700" },
];

function getAvatarColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function getInitials(email: string): string {
  const atIdx = email.indexOf("@");
  const base = atIdx > 0 ? email.slice(0, atIdx) : email;
  const parts = base.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return base.slice(0, 2).toUpperCase();
}

function ReadOnlyRecipientChip({ email }: { email: string }) {
  const color = getAvatarColor(email);
  const initials = getInitials(email);

  return (
    <div
      className="inline-flex h-[26px] max-w-[240px] flex-shrink-0 items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-100 pl-[3px] pr-2"
      title={email}
    >
      <div
        className={cn(
          "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full",
          color.bg,
          color.text
        )}
      >
        <span className="select-none text-[9px] font-bold leading-none">{initials}</span>
      </div>
      <span className="truncate text-[12px] font-medium leading-none text-zinc-700">
        {email}
      </span>
    </div>
  );
}

function ReadOnlyRecipientRow({
  label,
  emails,
}: {
  label: string;
  emails: string[];
}) {
  if (emails.length === 0) return null;

  return (
    <div className="flex min-h-[42px] items-start">
      <span className="w-8 flex-shrink-0 select-none pl-4 pt-[13px] text-[11px] font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </span>
      <div className="flex min-h-[42px] flex-1 flex-wrap items-center gap-1.5 py-2 pl-1 pr-4">
        {emails.map((email) => (
          <ReadOnlyRecipientChip key={`${label}-${email}`} email={email} />
        ))}
      </div>
    </div>
  );
}

export function WallieEmailDraftCard({
  draft,
  onEditSend,
  className,
}: WallieEmailDraftCardProps) {
  const { to, cc, bcc } = splitRecipientEmails(draft.recipients);
  const preview = emailDraftBodyPreview(draft, 1200);
  const isReply = draft.displayVariant === "reply";
  const subject = draft.subject?.trim() || "";

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 font-[Arial]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
        <span className="text-sm font-medium text-gray-700">
          {isReply ? "Reply" : "New Message"}
        </span>
        {draft.isDraft && (
          <span className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Draft
          </span>
        )}
      </div>

      <div className="divide-y divide-gray-100 border-b border-gray-200">
        <ReadOnlyRecipientRow label="To" emails={to} />
        <ReadOnlyRecipientRow label="Cc" emails={cc} />
        <ReadOnlyRecipientRow label="Bcc" emails={bcc} />
      </div>

      <div className="border-b border-gray-200 px-4 py-1.5">
        <p
          className={cn(
            "w-full text-sm font-normal",
            subject ? "text-[#202124]" : "text-gray-400"
          )}
        >
          {subject || "No subject"}
        </p>
      </div>

      <div className="max-h-72 min-h-[180px] overflow-y-auto bg-gray-50 px-4 py-3">
        {preview ? (
          <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-gray-700">
            {preview}
          </p>
        ) : (
          <p className="text-[13px] text-gray-400">No message body</p>
        )}
      </div>

      {onEditSend && (
        <div className="rounded-b-2xl border-t border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex justify-start">
            <Button
              type="button"
              onClick={() => onEditSend(draft)}
              className="border border-transparent bg-transparent px-6 font-normal font-[Arial] text-neutral-500 shadow-none transition-all duration-300 ease-in-out hover:border-neutral-200 hover:bg-gray-100 hover:text-neutral-500 hover:shadow-[inset_0_4px_8px_rgba(0,0,0,0.15)]"
              size="lg"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit &amp; send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
