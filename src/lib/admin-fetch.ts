'use client';

import { getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

/**
 * fetch() pour le tableau de bord admin : ajoute le jeton Firebase de
 * l'utilisateur connecte, verifie cote serveur par requireAdmin().
 */
export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);

  if (getApps().length) {
    const user = getAuth().currentUser;
    if (user) {
      headers.set('Authorization', `Bearer ${await user.getIdToken()}`);
    }
  }

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(input, { ...init, headers });
}

/** Lit le message d'erreur renvoye par une route API, sans jamais lever. */
export async function readApiError(response: Response, fallback: string): Promise<string> {
  try {
    const data = await response.json();
    return data?.error || data?.message || fallback;
  } catch {
    return fallback;
  }
}
