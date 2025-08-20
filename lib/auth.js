import jwt from "jsonwebtoken";

const DEFAULT_JWT_SECRET = "dev-secret-change-me";

export const SESSION_COOKIE_NAME = "apsession";

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;
  return secret;
}

export function signSessionToken(payload, options = {}) {
  const secret = getJwtSecret();
  // Default 7 days
  const expiresIn = options.expiresIn || "7d";
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifySessionToken(token) {
  const secret = getJwtSecret();
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}

export function getSessionCookieOptions(maxAgeSeconds = 7 * 24 * 60 * 60) {
  return {
    name: SESSION_COOKIE_NAME,
    maxAge: maxAgeSeconds,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  };
}
