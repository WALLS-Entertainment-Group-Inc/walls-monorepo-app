/** Meta campaign objectives that optimize for purchases / sales. */
export function isSalesObjective(objective: string | null | undefined): boolean {
  if (!objective) return false;
  const normalized = objective.toUpperCase();
  return (
    normalized === "OUTCOME_SALES" ||
    normalized === "CONVERSIONS" ||
    normalized === "PRODUCT_CATALOG_SALES" ||
    normalized.includes("SALES")
  );
}
