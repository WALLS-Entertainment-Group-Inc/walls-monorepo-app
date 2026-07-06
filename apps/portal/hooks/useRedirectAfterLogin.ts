import { useRouter } from "next/navigation";

import { getSupabaseClient } from "@walls/auth";

import { useRedirectParam } from "./useRedirectParam";

export function useRedirectAfterLogin() {
  const router = useRouter();
  const redirect = useRedirectParam();

  return async function redirectAfterLogin() {
    try {
      const supabase = getSupabaseClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        throw error ?? new Error("No user found");
      }

      if (redirect) {
        router.push(redirect);
        router.refresh();
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select(
          `
          user_platform_id,
          user_platform (
            url_redirect
          )
        `,
        )
        .eq("id", user.id)
        .single();

      let redirectPath = "/";

      if (userData) {
        const platform = userData.user_platform as
          | { url_redirect?: string | null }
          | null
          | undefined;
        if (platform?.url_redirect) {
          redirectPath = platform.url_redirect;
        }
      } else if (userError) {
        console.error("Error fetching user platform:", userError);
      }

      router.push(redirectPath);
      router.refresh();
    } catch (error) {
      console.error("Error during redirect:", error);
      router.push("/");
      router.refresh();
    }
  };
}
