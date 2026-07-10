import type { SupabaseClient, User } from "@supabase/supabase-js";

export type AppUserRecord = {
  id: string;
  email: string | null;
};

/**
 * Resolve the public.users row for an authenticated Supabase Auth user.
 * Tries auth user id first, then email.
 */
export async function resolveAppUserRecord(
  supabase: SupabaseClient,
  authUser: User,
): Promise<AppUserRecord> {
  const { data: dataById, error: errorById } = await supabase
    .from("users")
    .select("id, email")
    .eq("id", authUser.id)
    .maybeSingle();

  if (!errorById && dataById) {
    return dataById;
  }

  if (authUser.email) {
    const { data: dataByEmail, error: errorByEmail } = await supabase
      .from("users")
      .select("id, email")
      .eq("email", authUser.email)
      .maybeSingle();

    if (!errorByEmail && dataByEmail) {
      return dataByEmail;
    }

    throw new Error(
      `User not found in database. Auth ID: ${authUser.id}, Email: ${authUser.email}`,
    );
  }

  throw new Error(
    `User not found in database. Auth ID: ${authUser.id}, Email: N/A`,
  );
}
