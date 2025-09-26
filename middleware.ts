import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_PATHS = ["/dashboard"];
const AUTH_PATHS = ["/login", "/signup"];

function isPathMatch(pathname: string, routes: string[]) {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function ensureEnv(value: string | undefined, key: string): string {
  if (!value) {
    throw new Error(`Environment variable ${key} is not set.`);
  }

  return value;
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: { headers: req.headers } });

  const supabase = createServerClient(
    ensureEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    ensureEnv(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    ),
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set({ name, value, ...(options ?? {}) });
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  const isProtected = isPathMatch(pathname, PROTECTED_PATHS);
  const isAuthRoute = isPathMatch(pathname, AUTH_PATHS);

  if (!session && isProtected) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set(
      "redirectTo",
      `${req.nextUrl.pathname}${req.nextUrl.search}`
    );
    return NextResponse.redirect(redirectUrl);
  }

  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/login/:path*",
    "/signup",
    "/signup/:path*",
  ],
};
