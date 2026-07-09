"use client";

/**
 * Placeholder add-to-sequence popup.
 * Replace with the real agentCRM component from the main app.
 */
interface AddToSequencePopupProps {
  isOpen: boolean;
  onClose: () => void;
  personId: string;
  personData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    company?: string;
  };
  onAddToSequence: (
    sequenceId: string,
    personId: string,
    sequenceName?: string,
  ) => void | Promise<void>;
}

export default function AddToSequencePopup({
  isOpen,
  onClose,
}: AddToSequencePopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl">
        <h2 className="text-lg font-medium text-neutral-900">Add to sequence</h2>
        <p className="mt-2 text-sm text-neutral-600">
          The CRM sequence popup has not been migrated into the monorepo yet.
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
