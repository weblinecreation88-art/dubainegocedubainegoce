'use client';

import type { Auth } from 'firebase/auth';

/**
 * Wraps fetch() to attach the current admin's Firebase ID token so that
 * server-side admin API routes can verify the caller via requireAdmin().
 */
export async function adminFetch(
  auth: Auth,
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await auth.currentUser?.getIdToken();

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
