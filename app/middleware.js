import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("admin-session");

  // Protect admin routes
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!sessionCookie) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      loginUrl.searchParams.set("redirected", "true");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
