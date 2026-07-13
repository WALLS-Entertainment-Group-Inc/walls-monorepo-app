import {
  deleteObjectsWithPrefix,
  organizationIconPrefix,
} from "@walls/storage/server";
import { createAdminClient } from "@walls/supabase/admin";
import { createClient } from "@walls/supabase/server";

import {
  normalizeOrganizationSlug,
  type OrganizationRecord,
  type OrganizationRole,
  type OrganizationUpdateInput,
} from "./organizations-shared";

export type {
  OrganizationMembership,
  OrganizationRecord,
  OrganizationRole,
  OrganizationUpdateInput,
} from "./organizations-shared";

export {
  canDeleteOrganization,
  canEditOrganization,
  normalizeOrganizationSlug,
  slugifyOrganizationName,
} from "./organizations-shared";

// Organizations are now `accounts` rows with account_type = 'organization'.
// The account id IS the organization id everywhere in the settings app.

type AccountRow = {
  id: string;
  name: string;
  slug: string | null;
  icon_url: string | null;
  website: string | null;
  description: string | null;
  email: string | null;
  phone: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state_province: string | null;
  postal_code: string | null;
  country_code: string | null;
};

type MembershipRow = {
  role: OrganizationRole;
  is_default: boolean;
  accounts: AccountRow | AccountRow[] | null;
};

const ACCOUNT_FIELDS =
  "id, name, slug, icon_url, website, description, email, phone, address_line_1, address_line_2, city, state_province, postal_code, country_code";

function mapOrganization(
  row: AccountRow,
  membership: { role: OrganizationRole; is_default: boolean },
): OrganizationRecord {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug ?? "",
    iconUrl: row.icon_url,
    website: row.website,
    description: row.description,
    email: row.email,
    phone: row.phone,
    addressLine1: row.address_line_1,
    addressLine2: row.address_line_2,
    city: row.city,
    stateProvince: row.state_province,
    postalCode: row.postal_code,
    countryCode: row.country_code,
    role: membership.role,
    isDefault: membership.is_default,
  };
}

function extractAccount(membership: MembershipRow): AccountRow | null {
  const account = Array.isArray(membership.accounts)
    ? membership.accounts[0]
    : membership.accounts;
  if (!account) return null;
  return account;
}

export async function listOrganizationsForUser(
  userId: string,
): Promise<OrganizationRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("account_users")
    .select(
      `role, is_default, accounts!inner (
        ${ACCOUNT_FIELDS}, account_type
      )`,
    )
    .eq("user_id", userId)
    .eq("accounts.account_type", "organization")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[settings] list organizations:", error);
    return [];
  }

  return (data ?? [])
    .map((row) => {
      const membership = row as MembershipRow;
      const account = extractAccount(membership);
      if (!account) return null;
      return mapOrganization(account, {
        role: membership.role,
        is_default: membership.is_default,
      });
    })
    .filter((row): row is OrganizationRecord => row !== null);
}

export async function getOrganizationForUser(
  userId: string,
  organizationId: string,
): Promise<OrganizationRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("account_users")
    .select(
      `role, is_default, accounts!inner (
        ${ACCOUNT_FIELDS}, account_type
      )`,
    )
    .eq("user_id", userId)
    .eq("account_id", organizationId)
    .eq("accounts.account_type", "organization")
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[settings] get organization:", error);
    return null;
  }

  const membership = data as MembershipRow;
  const account = extractAccount(membership);
  if (!account) return null;

  return mapOrganization(account, {
    role: membership.role,
    is_default: membership.is_default,
  });
}

export async function isOrganizationSlugAvailable(
  slug: string,
  excludeOrganizationId?: string,
): Promise<boolean> {
  const normalized = normalizeOrganizationSlug(slug);
  if (!normalized) {
    return false;
  }

  const admin = createAdminClient();
  let query = admin
    .from("accounts")
    .select("id")
    .eq("account_type", "organization")
    .eq("slug", normalized);

  if (excludeOrganizationId) {
    query = query.neq("id", excludeOrganizationId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error("[settings] check organization slug:", error);
    return false;
  }

  return !data;
}

export async function updateOrganization(
  organizationId: string,
  input: OrganizationUpdateInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (input.slug !== undefined) {
    const normalized = normalizeOrganizationSlug(input.slug);
    if (!normalized) {
      return {
        ok: false,
        error: "Slug must be at least 2 characters and use letters or numbers",
      };
    }

    const available = await isOrganizationSlugAvailable(
      normalized,
      organizationId,
    );
    if (!available) {
      return { ok: false, error: "This slug is already taken" };
    }

    input = { ...input, slug: normalized };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("accounts")
    .update({
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.slug !== undefined ? { slug: input.slug.toLowerCase() } : {}),
      ...(input.iconUrl !== undefined ? { icon_url: input.iconUrl } : {}),
      ...(input.website !== undefined ? { website: input.website } : {}),
      ...(input.description !== undefined
        ? { description: input.description }
        : {}),
      ...(input.email !== undefined ? { email: input.email } : {}),
      ...(input.phone !== undefined ? { phone: input.phone } : {}),
      ...(input.addressLine1 !== undefined
        ? { address_line_1: input.addressLine1 }
        : {}),
      ...(input.addressLine2 !== undefined
        ? { address_line_2: input.addressLine2 }
        : {}),
      ...(input.city !== undefined ? { city: input.city } : {}),
      ...(input.stateProvince !== undefined
        ? { state_province: input.stateProvince }
        : {}),
      ...(input.postalCode !== undefined ? { postal_code: input.postalCode } : {}),
      ...(input.countryCode !== undefined
        ? { country_code: input.countryCode }
        : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", organizationId)
    .eq("account_type", "organization");

  if (error) {
    console.error("[settings] update organization:", error);
    if (error.code === "23505") {
      return { ok: false, error: "This slug is already taken" };
    }
    return { ok: false, error: "Failed to update organization" };
  }

  return { ok: true };
}

export async function deleteOrganization(
  organizationId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await deleteObjectsWithPrefix(organizationIconPrefix(organizationId));
  } catch (error) {
    console.warn("[settings] delete organization icons:", error);
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("accounts")
    .delete()
    .eq("id", organizationId)
    .eq("account_type", "organization");

  if (error) {
    console.error("[settings] delete organization:", error);
    return { ok: false, error: "Failed to delete organization" };
  }

  return { ok: true };
}

export async function createOrganizationForUser(input: {
  userId: string;
  name: string;
  slug: string;
  iconUrl?: string | null;
  website?: string | null;
}): Promise<
  | { organization: OrganizationRecord; error?: undefined }
  | { organization?: undefined; error: string }
> {
  const normalized = normalizeOrganizationSlug(input.slug);
  if (!normalized) {
    return {
      error: "Slug must be at least 2 characters and use letters or numbers",
    };
  }

  const available = await isOrganizationSlugAvailable(normalized);
  if (!available) {
    return { error: "This slug is already taken" };
  }

  const admin = createAdminClient();
  const now = new Date().toISOString();

  const { data: account, error: accountError } = await admin
    .from("accounts")
    .insert({
      account_type: "organization",
      name: input.name,
      slug: normalized,
      icon_url: input.iconUrl ?? null,
      website: input.website ?? null,
      updated_at: now,
    })
    .select(ACCOUNT_FIELDS)
    .single();

  if (accountError || !account) {
    console.error("[settings] create organization:", accountError);
    if (accountError?.code === "23505") {
      return { error: "This slug is already taken" };
    }
    return { error: "Failed to create organization" };
  }

  const { data: existingDefault } = await admin
    .from("account_users")
    .select("id")
    .eq("user_id", input.userId)
    .eq("is_default", true)
    .maybeSingle();

  const { error: membershipError } = await admin.from("account_users").insert({
    account_id: account.id,
    user_id: input.userId,
    role: "owner",
    is_default: !existingDefault,
    updated_at: now,
  });

  if (membershipError) {
    console.error("[settings] create organization membership:", membershipError);
    await admin.from("accounts").delete().eq("id", account.id);
    return { error: "Failed to create organization membership" };
  }

  return {
    organization: mapOrganization(account as AccountRow, {
      role: "owner",
      is_default: !existingDefault,
    }),
  };
}
