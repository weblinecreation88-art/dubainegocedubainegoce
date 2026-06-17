import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/firebase/server';

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'weblinecreation88@gmail.com';

/**
 * Verifies that a request comes from the admin: either a Firebase ID token
 * (Authorization: Bearer <idToken>) belonging to ADMIN_EMAIL, or a server-to-server
 * key (Authorization: Bearer <ADMIN_API_KEY> / x-admin-api-key header) for cron/scripts.
 * Returns a 401 NextResponse if unauthorized, or null if the request may proceed.
 */
export async function requireAdmin(request: NextRequest): Promise<NextResponse | null> {
  const authHeader = request.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (bearerToken) {
    if (process.env.ADMIN_API_KEY && bearerToken === process.env.ADMIN_API_KEY) {
      return null;
    }

    try {
      const decoded = await adminAuth.verifyIdToken(bearerToken);
      if (decoded.email === ADMIN_EMAIL) {
        return null;
      }
    } catch {
      // Invalid/expired token, fall through to unauthorized.
    }
  }

  const apiKeyHeader = request.headers.get('x-admin-api-key');
  if (apiKeyHeader && process.env.ADMIN_API_KEY && apiKeyHeader === process.env.ADMIN_API_KEY) {
    return null;
  }

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
