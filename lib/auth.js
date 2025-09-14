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
    const decoded = jwt.verify(token, secret);
    
    // Normalize the decoded token to always have user object
    const normalized = {
      ...decoded,
      // If user data is at the root, move it to user object
      user: decoded.user || {
        id: decoded.userId,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role
      }
    };
    
    return normalized;
  } catch (err) {
    return null;
  }
}

export function getSessionCookieOptions(maxAgeSeconds = 7 * 24 * 60 * 60) {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    name: SESSION_COOKIE_NAME,
    maxAge: maxAgeSeconds,
    path: "/",
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? "lax" : "lax",
    // Add domain for production
    ...(isProduction ? { domain: process.env.NEXT_PUBLIC_APP_DOMAIN } : {}),
  };
}
