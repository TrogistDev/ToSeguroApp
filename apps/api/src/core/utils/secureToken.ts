import crypto from 'crypto';

/**
 * Gera um token criptograficamente seguro (não Math.random!)
 */
export function generateSecureResetToken(length: number = 64): string {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

/**
 * Hash do token com SHA-256 (para não armazenar em claro no DB)
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('base64');
}
