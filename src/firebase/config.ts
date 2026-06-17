// Note: la clé Firebase ci-dessous est une clé client publique (par design Firebase) ;
// la sécurité réelle est assurée par firestore.rules / storage.rules, pas par son secret.
// Elle reste configurable via variables d'environnement pour permettre des projets Firebase distincts par environnement.
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAV88WVaPpsFXL_ttucwvJgyLvei1KVsK4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dubainegoce-227c3.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dubainegoce-227c3",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dubainegoce-227c3.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "169777208416",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:169777208416:web:3364bb1c57d9b4f26c7705",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-HM2MMVGBP7"
};
