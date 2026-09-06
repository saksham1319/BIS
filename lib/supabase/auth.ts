import type { SupabaseClient } from "@supabase/supabase-js";

export function signInWithEmail(email: string, supabase: SupabaseClient) {
  return supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });
}

export function verifyEmailOtp(email: string, token: string, supabase: SupabaseClient) {
  return supabase.auth.verifyOtp({ email, token, type: "email" });
}

export function signInWithGoogle(supabase: SupabaseClient, locale: string) {
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/${locale}/auth/callback`,
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });
}
