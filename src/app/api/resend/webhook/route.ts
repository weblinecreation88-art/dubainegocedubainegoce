import { NextResponse } from 'next/server';

/**
 * Ancien webhook Resend.
 *
 * Les e-mails passent desormais par Brevo (src/lib/email.ts) : ce point
 * d'entree n'a plus d'usage. Il repond 410 pour que Resend cesse ses envois
 * s'il est encore configure. (L'ancienne version utilisait resend.webhooks,
 * absent du SDK installe, et cassait la compilation.)
 */
export async function POST() {
  return NextResponse.json({ error: 'Webhook Resend désactivé (migration vers Brevo).' }, { status: 410 });
}
