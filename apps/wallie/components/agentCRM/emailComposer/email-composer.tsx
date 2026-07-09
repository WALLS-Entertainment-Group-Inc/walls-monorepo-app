"use client";

/**
 * Placeholder email composer.
 * Replace with the real agentCRM email composer from the main app.
 */
interface EmailComposerProps {
  isOpen: boolean;
  onClose: () => void;
  personId?: string;
  prefill?: {
    to: string[];
    cc: string[];
    bcc: string[];
    subject: string;
    body: string;
    threadId?: string | null;
    draftId?: string | null;
  };
  replyTo?: {
    to: string;
    cc?: string;
    bcc?: string;
    subject?: string;
    threadId?: string;
    messageId?: string | null;
    draftId?: string | null;
  };
}

export default function EmailComposer({ isOpen, onClose }: EmailComposerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
        <h2 className="text-lg font-medium text-neutral-900">Email composer</h2>
        <p className="mt-2 text-sm text-neutral-600">
          The CRM email composer has not been migrated into the monorepo yet.
          Share the main app component and this placeholder will be replaced.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
        >
          Close
        </button>
      </div>
    </div>
  );
}
