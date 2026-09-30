const GCP_PROJECT = 'dubainegoce-227c3';
const secretsCache = new Map<string, string>();

/**
 * Récupère un secret depuis process.env ou Google Cloud Secret Manager (Cloud Run / App Hosting).
 */
export async function getServerSecret(secretName: string): Promise<string | null> {
  // 1. Variable d'environnement locale ou injectée
  if (process.env[secretName]) {
    return process.env[secretName]!.trim();
  }

  // 2. Cache mémoire
  if (secretsCache.has(secretName)) {
    return secretsCache.get(secretName)!;
  }

  // 3. Google Cloud Secret Manager via le metadata server
  try {
    const tokenRes = await fetch(
      'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
      { headers: { 'Metadata-Flavor': 'Google' } }
    );

    if (!tokenRes.ok) {
      return null;
    }

    const { access_token } = await tokenRes.json();

    const secretRes = await fetch(
      `https://secretmanager.googleapis.com/v1/projects/${GCP_PROJECT}/secrets/${secretName}/versions/latest:access`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!secretRes.ok) {
      console.warn(`[SecretManager] Secret ${secretName} inaccessible (${secretRes.status})`);
      return null;
    }

    const secretData = await secretRes.json();
    const value = Buffer.from(secretData.payload.data, 'base64').toString('utf8').trim();
    secretsCache.set(secretName, value);
    return value;
  } catch (err) {
    // Si on est en local hors GCP, l'appel metadata va échouer normalement
    return null;
  }
}
