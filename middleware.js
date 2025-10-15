import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(req) {
  const session = await auth(req);
  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"], // Add your protected routes here
};