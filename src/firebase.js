import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// ⚠️ REPLACE THESE KEYS WITH YOUR ACTUAL COPIED KEYS FROM STEP 1
const firebaseConfig = {
  apiKey: "AIzaSyDrf7qAcl7lnvVNI3yQUXsdRRnNEqfsxt8",
  authDomain: "hf-makeup-backend.firebaseapp.com",
  projectId: "hf-makeup-backend",
  storageBucket: "hf-makeup-backend.firebasestorage.app",
  messagingSenderId: "1034643523470",
  appId: "1:1034643523470:web:26c99d9d59f2d679f586df"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Helper to fetch live config
export async function getLiveConfig(defaultConfig) {
  try {
    const docRef = doc(db, "app_settings", "live_config");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...defaultConfig, ...docSnap.data() };
    } else {
      // First time initialization: save default config to Firestore
      await setDoc(docRef, defaultConfig);
      return defaultConfig;
    }
  } catch (err) {
    console.error("Firestore sync fallback to local config:", err);
    return defaultConfig;
  }
}

// Helper to save live config from Admin Panel
export async function saveLiveConfig(updatedConfig) {
  const docRef = doc(db, "app_settings", "live_config");
  await setDoc(docRef, updatedConfig);
}
