import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./config";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (browserClient) return browserClient;
  const config = getSupabaseConfig();
  if (!config) return null;

  browserClient = createBrowserClient(config.url, config.publishableKey);
  return browserClient;
}
