import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// We'll try to import the config, but fallback to empty if it doesn't exist yet
let firebaseConfig = {};
try {
  // @ts-ignore
  firebaseConfig = await import('../../firebase-applet-config.json').then(m => m.default);
} catch (e) {
  console.warn('Firebase config not found. Please complete Firebase setup in AI Studio.');
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
