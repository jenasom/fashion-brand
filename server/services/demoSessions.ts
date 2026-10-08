import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

/** Demo-only stateless sessions. A configured secret isolates deployment tokens.
 * The fallback is derived from the public demo credential and never grants access
 * beyond the explicitly allowlisted demo users in authRoutes.
 * Business data and token revocations still require shared persistence in production.
 */
export function createDemoSessions(secret: string, now = () => Date.now()) {
  const revoked = new Map<string, number>();
  const sign = (payload: string) => createHmac('sha256', secret).update(payload).digest('base64url');
  return {
    issue(userId: string) {
      const payload = Buffer.from(JSON.stringify({ userId, expires: now() + 8 * 60 * 60 * 1000, nonce: randomBytes(16).toString('hex') })).toString('base64url');
      return payload + '.' + sign(payload);
    },
    read(token: string): { userId: string; expires: number } | undefined {
      if (!token || token.length > 2048 || revoked.has(token)) return;
      try {
        const parts = token.split('.');
        if (parts.length !== 2) return;
        const actual = Buffer.from(parts[1]);
        const expected = Buffer.from(sign(parts[0]));
        if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return;
        const data = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
        if (typeof data.userId !== 'string' || !Number.isFinite(data.expires) || data.expires <= now()) return;
        return { userId: data.userId, expires: data.expires };
      } catch { return; }
    },
    revoke(token: string) {
      const session = this.read(token);
      if (session) revoked.set(token, session.expires);
      for (const [key, expires] of revoked) if (expires <= now()) revoked.delete(key);
    }
  };
}
