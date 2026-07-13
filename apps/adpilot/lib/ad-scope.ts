import {
  getCurrentUserId,
  resolveActiveAccountId,
} from "@/lib/account-context";

/**
 * AdPilot tenancy scope. All ad_* data is keyed by WALLS `accountId`; `userId`
 * is retained for audit fields (e.g. who manually triggered a budget change).
 */
export type AdDataScope = {
  accountId: string;
  userId: string;
};

type ScopedQuery = {
  eq: (column: string, value: unknown) => ScopedQuery;
};

export async function getAdDataScope(): Promise<AdDataScope | null> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const accountId = await resolveActiveAccountId(userId);
  if (!accountId) return null;

  return { accountId, userId };
}

export function withAdScope<T>(query: T, scope: AdDataScope): T {
  const scoped = query as ScopedQuery;
  return scoped.eq("account_id", scope.accountId) as T;
}

export function adScopeFields(scope: AdDataScope) {
  return {
    account_id: scope.accountId,
  };
}

export function entityBelongsToScope(
  row: { account_id: string },
  scope: AdDataScope,
): boolean {
  return row.account_id === scope.accountId;
}
