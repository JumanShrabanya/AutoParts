import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
  getSessionCookieOptions,
} from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false, user: null });
  }
  const payload = verifySessionToken(token);
  if (!payload) {
    return NextResponse.json({ authenticated: false, user: null });
  }
  return NextResponse.json({ authenticated: true, user: payload.user });
}

export async function DELETE() {
  const cookieStore = cookies();
  const opts = getSessionCookieOptions();
  cookieStore.set(opts.name, "", { ...opts, maxAge: 0 });
  return NextResponse.json({ success: true });
}
