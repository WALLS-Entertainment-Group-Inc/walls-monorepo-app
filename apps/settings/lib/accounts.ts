import { createAdminClient } from "@walls/supabase/admin";
import { createClient } from "@walls/supabase/server";

import {
  type AccountMemberRecord,
  type AccountRecord,
  type AccountRole,
} from "./accounts-shared";

export type {
  AccountMemberRecord,
  AccountRecord,
  AccountRole,
  AccountType,
} from "./accounts-shared";

export {
  canChangeAccountMemberRole,
  canManageAccountMembers,
  canRemoveAccountMember,
} from "./accounts-shared";

type AccountRow = {
  id: string;
  account_type: "personal" | "organization";
  name: string;
  personal_owner_id: string | null;
};

type AccountMemberRow = {
  id: string;
  user_id: string;
  role: AccountRole;
  is_default: boolean;
  users:
    | {
        first_name: string | null;
        last_name: string | null;
        email: string;
        avatar_url: string | null;
      }
    | {
        first_name: string | null;
        last_name: string | null;
        email: string;
        avatar_url: string | null;
      }[]
    | null;
};

function mapAccount(row: AccountRow): AccountRecord {
  return {
    id: row.id,
    accountType: row.account_type,
    name: row.name,
    personalOwnerId: row.personal_owner_id,
  };
}

function mapAccountMember(row: AccountMemberRow): AccountMemberRecord | null {
  const user = Array.isArray(row.users) ? row.users[0] : row.users;
  if (!user) return null;

  return {
    id: row.id,
    userId: row.user_id,
    role: row.role,
    isDefault: row.is_default,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    avatarUrl: user.avatar_url,
  };
}

export async function getOrganizationAccount(
  accountId: string,
): Promise<AccountRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("accounts")
    .select("id, account_type, name, personal_owner_id")
    .eq("id", accountId)
    .eq("account_type", "organization")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapAccount(data as AccountRow);
}

export async function getAccountMembershipForUser(
  userId: string,
  accountId: string,
): Promise<{ role: AccountRole; isDefault: boolean } | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("account_users")
    .select("role, is_default")
    .eq("user_id", userId)
    .eq("account_id", accountId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    role: data.role as AccountRole,
    isDefault: data.is_default,
  };
}

export async function listAccountMembers(
  accountId: string,
): Promise<AccountMemberRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("account_users")
    .select(
      `id, user_id, role, is_default, users (
        first_name, last_name, email, avatar_url
      )`,
    )
    .eq("account_id", accountId)
    .order("role", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[settings] list account members:", error);
    return [];
  }

  return (data ?? [])
    .map((row) => mapAccountMember(row as AccountMemberRow))
    .filter((row): row is AccountMemberRecord => row !== null);
}

export async function findUserByEmail(
  email: string,
): Promise<{ id: string; email: string } | null> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("users")
    .select("id, email")
    .ilike("email", email.trim())
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function addAccountMember(input: {
  accountId: string;
  userId: string;
  role?: AccountRole;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = createAdminClient();
  const now = new Date().toISOString();
  const role = input.role ?? "member";

  const { error } = await admin.from("account_users").insert({
    account_id: input.accountId,
    user_id: input.userId,
    role,
    is_default: false,
    updated_at: now,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "This user is already a member of the account" };
    }
    console.error("[settings] add account member:", error);
    return { ok: false, error: "Failed to add account member" };
  }

  return { ok: true };
}

export async function updateAccountMemberRole(input: {
  accountId: string;
  userId: string;
  role: AccountRole;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = createAdminClient();

  const { error } = await admin
    .from("account_users")
    .update({ role: input.role, updated_at: new Date().toISOString() })
    .eq("account_id", input.accountId)
    .eq("user_id", input.userId);

  if (error) {
    console.error("[settings] update account member role:", error);
    return { ok: false, error: "Failed to update member role" };
  }

  return { ok: true };
}

export async function removeAccountMember(input: {
  accountId: string;
  userId: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = createAdminClient();

  const { error } = await admin
    .from("account_users")
    .delete()
    .eq("account_id", input.accountId)
    .eq("user_id", input.userId);

  if (error) {
    console.error("[settings] remove account member:", error);
    return { ok: false, error: "Failed to remove account member" };
  }

  return { ok: true };
}
