import { cookies } from "next/headers";

import {
  ACTIVE_ACCOUNT_COOKIE,
  userHasAppAccessForActiveAccount,
} from "@walls/auth/active-account";
import { createClient } from "@walls/supabase/server";
import { createAdminClient } from "@walls/supabase/admin";

import {
  ADMIN_ACCOUNT_COOKIE,
  ADMIN_APP_SLUG,
} from "@/lib/account-context";

/**
 * Admin app APIs require an active user with Admin app access grants
 * (account_app_user_access / legacy user_app_access). Not users.is_admin.
 */
export async function requireAdminCaller() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Unauthenticated" as const, status: 401 as const };
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, status")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[admin] Failed to load caller profile:", profileError);
    return { error: "Failed to verify admin" as const, status: 500 as const };
  }

  if (!profile || profile.status !== "active") {
    return { error: "Forbidden" as const, status: 403 as const };
  }

  const cookieStore = await cookies();
  const preferredAccountId =
    cookieStore.get(ACTIVE_ACCOUNT_COOKIE)?.value ??
    cookieStore.get(ADMIN_ACCOUNT_COOKIE)?.value ??
    null;

  const hasAdminAppAccess = await userHasAppAccessForActiveAccount(
    supabase,
    user.id,
    ADMIN_APP_SLUG,
    preferredAccountId,
  );

  if (!hasAdminAppAccess) {
    return { error: "Forbidden" as const, status: 403 as const };
  }

  return {
    user,
    supabase,
    admin: createAdminClient(),
  };
}

export function generateTempPassword(length = 16): string {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}
