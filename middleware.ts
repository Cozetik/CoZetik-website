import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * Middleware léger compatible Edge Runtime
 * Utilise auth.config.ts qui n'inclut PAS Prisma ni bcrypt
 * La logique d'autorisation est dans authConfig.callbacks.authorized
 */
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  // Matcher optimisé - uniquement les routes protégées
  matcher: ["/admin/:path*", "/auth-admin"],
};
