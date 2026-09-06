import { NextResponse } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/i18n/locales";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale: requestedLocale } = await params;
  const locale = isLocale(requestedLocale) ? requestedLocale : DEFAULT_LOCALE;
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const supabase = await createClient();

  if (code && supabase) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}/${locale}?view=dashboard`);
  }

  return NextResponse.redirect(`${origin}/${locale}/auth/error`);
}
