import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

console.log('[Firebase] Module loading...');

// Firebase configuration - these will be set via environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('[Firebase] Config check - apiKey exists:', !!firebaseConfig.apiKey);
console.log('[Firebase] Config check - projectId exists:', !!firebaseConfig.projectId);

// Check if Firebase is configured
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId
);

console.log('[Firebase] isFirebaseConfigured:', isFirebaseConfigured);

// Initialize Firebase only if configured (prevent build errors when env vars missing)
let app: FirebaseApp | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  console.log('[Firebase] Initializing Firebase app...');
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  db = getFirestore(app);
  console.log('[Firebase] Firebase initialized successfully');
} else {
  console.log('[Firebase] Skipping initialization - credentials not configured');
}

export { db };
export default app;
