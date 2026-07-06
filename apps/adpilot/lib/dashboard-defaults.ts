export const ZERO_DASHBOARD_STATS = [
  { label: "Ad spend", value: "$0", change: "—", positive: true },
  { label: "Impressions", value: "0", change: "—", positive: true },
  { label: "CTR", value: "0.00%", change: "—", positive: true },
  { label: "ROAS", value: "—", change: "—", positive: true },
] as const;

function buildPreviewSpendCurve(): Array<{
  date: string;
  label: string;
  spend: number;
  spendMicros: number;
}> {
  const points: Array<{
    date: string;
    label: string;
    spend: number;
    spendMicros: number;
  }> = [];

  for (let index = 0; index < 30; index += 1) {
    const date = new Date();
    date.setDate(date.getDate() - (29 - index));
    const isoDate = date.toISOString().slice(0, 10);
    const wave =
      180 +
      Math.sin(index / 3.2) * 95 +
      Math.cos(index / 6.5) * 55 +
      index * 4.5;

    points.push({
      date: isoDate,
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      spend: Math.max(40, Math.round(wave)),
      spendMicros: 0,
    });
  }

  return points;
}

export const PREVIEW_SPEND_BY_DAY = buildPreviewSpendCurve();
