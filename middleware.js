import { NextResponse } from "next/server";

export const config = {
  matcher: ["/dashboard/:path*"], // protect dashboard routes
};

export async function middleware(req) {
  const url = req.nextUrl.clone();

  // Check for NextAuth session cookie
  const sessionCookie =
    req.cookies.get("__Secure-next-auth.session-token") || 
    req.cookies.get("next-auth.session-token");

  // If no cookie, redirect to login
  if (!sessionCookie) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If user is logged in and visits login page, redirect to dashboard
  if (sessionCookie && req.nextUrl.pathname === "/login") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
