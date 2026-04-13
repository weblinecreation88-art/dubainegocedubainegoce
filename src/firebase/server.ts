
import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// This function ensures that we initialize the app only once.
function getAdminApp(): App {
  // If the app is already initialized, return the existing instance.
  if (getApps().length > 0) {
    return getApp();
  }

  // Try to use service account key from environment
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountKey) {
    try {
      const serviceAccount = JSON.parse(serviceAccountKey);
      return initializeApp({
        credential: cert(serviceAccount)
      });
    } catch (error) {
      console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY, trying default credentials');
    }
  }

  // In Google Cloud environments (like Firebase App Hosting),
  // initializeApp() with no arguments automatically discovers the project's credentials.
  return initializeApp();
}

const app = getAdminApp();

export const firestore = getFirestore(app);
