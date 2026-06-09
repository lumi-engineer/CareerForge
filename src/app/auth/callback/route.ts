import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/env";
import { upsertUserFromSupabase } from "@/lib/auth";

function getSafeNextPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/analyze";
  }
  return next;
}

function getRedirectBase(request: NextRequest, origin: string): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return origin;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeNextPath(searchParams.get("next"));
  const redirectBase = getRedirectBase(request, origin);

  const env = getSupabaseEnv();
  if (!env) {
    console.error("Auth callback: Supabase env vars missing");
    return NextResponse.redirect(`${redirectBase}/login?error=config`);
  }

  if (!code) {
    return NextResponse.redirect(`${redirectBase}/login?error=auth`);
  }

  const response = NextResponse.redirect(`${redirectBase}${next}`);

  try {
    const supabase = createServerClient(env.url, env.key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback: exchangeCodeForSession failed:", error.message);
      return NextResponse.redirect(`${redirectBase}/login?error=auth`);
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      try {
        await upsertUserFromSupabase(user);
      } catch (dbError) {
        console.error("Auth callback: user upsert failed (non-fatal):", dbError);
      }
    }

    return response;
  } catch (error) {
    console.error("Auth callback: unexpected error:", error);
    return NextResponse.redirect(`${redirectBase}/login?error=auth`);
  }
}
