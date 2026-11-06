import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_ADMINS = [
  'weblinecreation88@gmail.com',
  'abderelmalki@gmail.com',
  'maghzaz.nourddine@hotmail.fr',
  'maghzaz.noureddine@outlook.fr',
];

export const ADMIN_EMAILS = Array.from(
  new Set([
    ...DEFAULT_ADMINS,
    ...(process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  ])
);

export type AdminCheck =
  | { ok: true; email: string; uid: string }
  | { ok: false; status: number; error: string };

export async function requireAdmin(req: NextRequest): Promise<AdminCheck> {
  const header = req.headers.get('authorization') || '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7).trim() : null;
  const apiKeyHeader = req.headers.get('x-admin-key');
  const adminApiKey = process.env.ADMIN_API_KEY;

  if (adminApiKey && (apiKeyHeader === adminApiKey || bearer === adminApiKey)) {
    return { ok: true, email: 'api-key', uid: 'api-key' };
  }

  if (!bearer) {
    return { ok: false, status: 401, error: 'Authentification requise.' };
  }

  try {
    const { auth } = await import('@/firebase/server');
    const decoded = await auth.verifyIdToken(bearer);
    const email = (decoded.email || '').toLowerCase();

    if (!email || !ADMIN_EMAILS.includes(email)) {
      console.warn(`[admin-auth] Acces refuse pour ${email || 'inconnu'}.`);
      return { ok: false, status: 403, error: "Accès réservé à l'administrateur." };
    }

    return { ok: true, email, uid: decoded.uid };
  } catch (error: any) {
    console.error('[admin-auth] Jeton invalide :', error?.message);
    return { ok: false, status: 401, error: 'Session expirée, reconnectez-vous.' };
  }
}

export async function adminGuard(req: NextRequest): Promise<NextResponse | null> {
  const check = await requireAdmin(req);
  if (check.ok) return null;
  return NextResponse.json({ error: check.error }, { status: check.status });
}
