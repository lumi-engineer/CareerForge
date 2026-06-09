import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/analyze/:path*",
    "/history/:path*",
    "/results/:path*",
    "/api/:path*",
    "/login",
    "/auth/:path*",
  ],
};
