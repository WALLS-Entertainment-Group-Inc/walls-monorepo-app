/**
 * Placeholder Wallie email-draft helpers.
 * Replace with the real implementations from the main app when available.
 */

export interface WallieEmailDraftRecipients {
  to?: string[];
  cc?: string[];
  bcc?: string[];
}

export interface WallieEmailDraft {
  recipients?: string | string[] | WallieEmailDraftRecipients;
  subject?: string | null;
  body?: string | null;
  displayVariant?: "reply" | "new";
  isDraft?: boolean;
  threadId?: string | null;
  draftId?: string | null;
}

export interface WallieEmailComposerPrefill {
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  threadId?: string | null;
  draftId?: string | null;
}

function asStringArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[,;]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export function splitRecipientEmails(
  recipients: WallieEmailDraft["recipients"],
): { to: string[]; cc: string[]; bcc: string[] } {
  if (!recipients) {
    return { to: [], cc: [], bcc: [] };
  }

  if (typeof recipients === "object" && !Array.isArray(recipients)) {
    return {
      to: asStringArray(recipients.to),
      cc: asStringArray(recipients.cc),
      bcc: asStringArray(recipients.bcc),
    };
  }

  return {
    to: asStringArray(recipients),
    cc: [],
    bcc: [],
  };
}

export function parseWallieEmailDraft(
  value: unknown,
): WallieEmailDraft | undefined {
  if (!value || typeof value !== "object") return undefined;
  const draft = value as Record<string, unknown>;
  if (!draft.subject && !draft.body && !draft.recipients) return undefined;
  return {
    recipients: draft.recipients as WallieEmailDraft["recipients"],
    subject: draft.subject != null ? String(draft.subject) : undefined,
    body: draft.body != null ? String(draft.body) : undefined,
    displayVariant:
      draft.displayVariant === "reply" ? "reply" : ("new" as const),
    isDraft: draft.isDraft !== false,
    threadId: draft.threadId != null ? String(draft.threadId) : undefined,
    draftId: draft.draftId != null ? String(draft.draftId) : undefined,
  };
}

export function emailDraftBodyPreview(
  draft: WallieEmailDraft,
  maxLength = 1200,
): string {
  const body = draft.body?.trim() ?? "";
  if (body.length <= maxLength) return body;
  return `${body.slice(0, maxLength).trimEnd()}…`;
}

export function extractEmailDraftIntro(
  content: string,
  draft: WallieEmailDraft,
): string {
  const body = draft.body?.trim() ?? "";
  if (!body || !content.includes(body)) return content.trim();
  return content.replace(body, "").trim();
}

export function emailDraftToComposerPrefill(
  draft: WallieEmailDraft,
): WallieEmailComposerPrefill {
  const { to, cc, bcc } = splitRecipientEmails(draft.recipients);
  return {
    to,
    cc,
    bcc,
    subject: draft.subject?.trim() ?? "",
    body: draft.body?.trim() ?? "",
    threadId: draft.threadId ?? null,
    draftId: draft.draftId ?? null,
  };
}
