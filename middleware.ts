import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * Middleware léger compatible Edge Runtime
 * Utilise auth.config.ts qui n'inclut PAS Prisma ni bcrypt
 * La logique d'autorisation est dans authConfig.callbacks.authorized
 */
const { auth } = NextAuth(authConfig);

export default auth;

// Désactiver la protection /admin en DEV
const isProd = process.env.NODE_ENV === "production";

export const config = {
  matcher: isProd ? ["/admin/:path*", "/auth-admin"] : ["/auth-admin"],
};
