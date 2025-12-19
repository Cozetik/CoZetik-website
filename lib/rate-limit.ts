/**
 * Rate limiter simple basé sur Map en mémoire
 * Pour une vraie prod, utiliser Redis ou Vercel KV
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

// Nettoyer les anciennes entrées toutes les 10 minutes
setInterval(() => {
  const now = Date.now()
  const entries = Array.from(rateLimitMap.entries())
  for (const [key, entry] of entries) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}, 10 * 60 * 1000)

/**
 * Vérifie si une IP/identifiant a dépassé la limite
 * @param identifier - IP ou identifiant unique
 * @param limit - Nombre max de tentatives
 * @param windowMs - Fenêtre de temps en millisecondes
 * @returns true si limite dépassée
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes par défaut
): { limited: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(identifier)

  // Première tentative ou fenêtre expirée
  if (!entry || now > entry.resetTime) {
    const resetTime = now + windowMs
    rateLimitMap.set(identifier, { count: 1, resetTime })
    return { limited: false, remaining: limit - 1, resetTime }
  }

  // Incrémenter le compteur
  entry.count++

  // Vérifier la limite
  if (entry.count > limit) {
    return { limited: true, remaining: 0, resetTime: entry.resetTime }
  }

  return {
    limited: false,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  }
}

/**
 * Réinitialise le compteur pour un identifiant
 */
export function resetRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier)
}
