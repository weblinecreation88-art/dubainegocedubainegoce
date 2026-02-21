
import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// This function ensures that we initialize the app only once.
function getAdminApp(): App {
  // If the app is already initialized, return the existing instance.
  if (getApps().length > 0) {
    return getApp();
  }
  
  // In Google Cloud environments (like Firebase App Hosting), 
  // initializeApp() with no arguments automatically discovers the project's credentials.
  return initializeApp();
}

const app = getAdminApp();

export const firestore = getFirestore(app);
