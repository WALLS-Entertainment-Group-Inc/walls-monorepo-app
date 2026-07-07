import type { OptimizationGoal } from "@/lib/spend-automation-settings";

export type AdPilotAction =
  | "increase"
  | "decrease"
  | "hold"
  | "deactivate"
  | "skip";

export type AdPilotDecisionSource = "agent" | "deterministic" | "guardrail";

export type AdPilotTrendDirection = "growing" | "falling" | "flat";

export interface AdPilotPreview {
  dryRun: true;
  wouldApply: boolean;
  entity: {
    id: string;
    name: string | null;
    type: string;
    providerEntityId: string;
    currency: string;
    automationStatus: string;
    profileName: string | null;
  };
  decision: {
    action: AdPilotAction;
    wouldSetStatus: string;
    reason: string;
    source: AdPilotDecisionSource;
    confidence: number;
    optimizationGoal: OptimizationGoal;
    budget: {
      previousMicros: number | null;
      proposedMicros: number | null;
      finalMicros: number | null;
      previousUnits: number | null;
      finalUnits: number | null;
      changePct: number | null;
      currency: string;
    };
    cooldown: { active: boolean; endsAt: string | null };
    learning: boolean;
  };
  allowedRange: {
    minMicros: number;
    maxMicros: number | null;
    canIncrease: boolean;
    canDecrease: boolean;
    maxIncreasePct: number;
    maxDecreasePct: number;
    notes: string[];
  };
  trend: {
    direction: AdPilotTrendDirection;
    currentRoas: number | null;
    baselineRoas: number | null;
    currentCtr: number | null;
    currentCpaMicros: number | null;
    frequency: number | null;
    fatigueDetected: boolean;
    roasSlope: number;
    relativeChange: number;
  };
  candles: Array<{
    date: string;
    spendMicros: number;
    roas: number | null;
    ctr: number | null;
    conversions: number;
    frequency: number | null;
    [key: string]: unknown;
  }>;
  metricSnapshot: Record<string, unknown>;
}

export type AdPilotPreviewError = {
  error: string;
};

export type AdPilotPreviewResponse =
  | { ok: true; status: number; preview: AdPilotPreview }
  | { ok: false; status: number; error: string };

/**
 * Client-side helper: requests a dry-run preview through our own Next.js proxy
 * route (never the backend directly, so the API key stays server-side).
 */
export async function fetchAdPilotPreview(
  entityId: string,
): Promise<AdPilotPreviewResponse> {
  let response: Response;
  try {
    response = await fetch("/api/adpilot/dry-run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityId }),
    });
  } catch {
    return {
      ok: false,
      status: 0,
      error: "Could not reach the preview service. Check your connection.",
    };
  }

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      (payload as AdPilotPreviewError | null)?.error ??
      previewErrorForStatus(response.status);
    return { ok: false, status: response.status, error: message };
  }

  return { ok: true, status: response.status, preview: payload as AdPilotPreview };
}

function previewErrorForStatus(status: number): string {
  switch (status) {
    case 400:
      return "Invalid request — missing entity.";
    case 401:
      return "Preview service rejected the request (auth). Contact an admin.";
    case 404:
      return "This entity isn't enrolled in AdPilot yet. Enable and save it first.";
    case 502:
    case 503:
      return "The preview service is unavailable right now. Try again shortly.";
    default:
      return "Failed to generate a preview.";
  }
}

export function adpilotActionLabel(action: AdPilotAction): string {
  const labels: Record<AdPilotAction, string> = {
    increase: "Increase budget",
    decrease: "Decrease budget",
    hold: "Hold",
    deactivate: "Deactivate",
    skip: "Skip",
  };
  return labels[action];
}

export function adpilotTrendLabel(direction: AdPilotTrendDirection): string {
  const labels: Record<AdPilotTrendDirection, string> = {
    growing: "Growing",
    falling: "Falling",
    flat: "Flat",
  };
  return labels[direction];
}
