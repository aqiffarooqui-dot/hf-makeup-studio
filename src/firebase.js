import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// ⚠️ Ensure your actual Firebase credentials are pasted here
const firebaseConfig = {
  apiKey: "AIzaSyDrf7qAcl7lnvVNI3yQUXsdRRnNEqfsxt8",
  authDomain: "hf-makeup-backend.firebaseapp.com",
  projectId: "hf-makeup-backend",
  storageBucket: "hf-makeup-backend.firebasestorage.app",
  messagingSenderId: "1034643523470",
  appId: "1:1034643523470:web:26c99d9d59f2d679f586df"
};

let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase initialization skipped, fallback active.");
}

// Timeout helper so it never gets stuck
const withTimeout = (promise, ms = 5000) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase request timed out")), ms))
  ]);
};

// Fetch live config
export async function getLiveConfig(defaultConfig) {
  try {
    const savedLocal = localStorage.getItem('hf_live_backup_config');
    const localParsed = savedLocal ? JSON.parse(savedLocal) : null;

    if (!db) return localParsed || defaultConfig;

    const docRef = doc(db, "app_settings", "live_config");
    const docSnap = await withTimeout(getDoc(docRef), 4000);

    if (docSnap.exists()) {
      const liveData = { ...defaultConfig, ...docSnap.data() };
      localStorage.setItem('hf_live_backup_config', JSON.stringify(liveData));
      return liveData;
    } else {
      await withTimeout(setDoc(docRef, defaultConfig), 4000);
      return localParsed || defaultConfig;
    }
  } catch (err) {
    console.warn("Using local cache / default config:", err.message);
    const savedLocal = localStorage.getItem('hf_live_backup_config');
    return savedLocal ? JSON.parse(savedLocal) : defaultConfig;
  }
}

// Save live config with persistent backup
export async function saveLiveConfig(updatedConfig) {
  localStorage.setItem('hf_live_backup_config', JSON.stringify(updatedConfig));
  if (!db) return;

  const docRef = doc(db, "app_settings", "live_config");
  await withTimeout(setDoc(docRef, updatedConfig), 6000);
}
