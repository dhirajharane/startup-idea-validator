import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
 // imp
export const runtime = "nodejs";

export async function middleware(req) {
  const session = await auth();
  const { pathname } = req.nextUrl;

  const isPublicPath = pathname === '/login';

  if (session && isPublicPath) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!session && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};