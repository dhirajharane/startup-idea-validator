import { NextResponse } from "next/server";

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const sessionCookie =
    req.cookies.get("__Secure-authjs.session-token") ||
    req.cookies.get("authjs.session-token");

  if (!sessionCookie) {
    if (req.nextUrl.pathname.startsWith("/dashboard")) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  } else {
    if (req.nextUrl.pathname === "/login") {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}