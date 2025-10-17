import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/dashboard/:path*"], // protect /dashboard routes
};

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  const url = req.nextUrl.clone();

  if (!token) {
    // If user is not authenticated, redirect to login
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (token && req.nextUrl.pathname === "/login") {
    // If logged in and trying to access login page, redirect to dashboard
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
