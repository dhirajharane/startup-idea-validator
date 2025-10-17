import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/dashboard/:path*"], // protect dashboard routes
};

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    // NextAuth stores JWT in cookies
  });

  const url = req.nextUrl.clone();

  // If user is not logged in, redirect to login
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If user is logged in and visits /login, redirect to dashboard
  if (token && req.nextUrl.pathname === "/login") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // All other requests pass
  return NextResponse.next();
}
