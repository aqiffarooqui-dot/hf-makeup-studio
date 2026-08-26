import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDrf7qAcl7lnvVNI3yQUXsdRRnNEqfsxt8",
  authDomain: "hf-makeup-backend.firebaseapp.com",
  projectId: "hf-makeup-backend",
  storageBucket: "hf-makeup-backend.firebasestorage.app",
  messagingSenderId: "1034643523470",
  appId: "1:1034643523470:web:26c99d9d59f2d679f586df"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 🔥 Auto-detect Long Polling to bypass adblockers & websocket blocking
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  useFetchStreams: false
});

// Realtime Listener
export function subscribeToLiveConfig(defaultConfig, callback) {
  const docRef = doc(db, "app_settings", "live_config");
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ ...defaultConfig, ...docSnap.data() });
    } else {
      callback(defaultConfig);
    }
  }, (err) => {
    console.warn("Firestore sync error:", err);
    callback(defaultConfig);
  });
}

// Fetch (Admin load)
export async function fetchLiveConfig(defaultConfig) {
  try {
    const docRef = doc(db, "app_settings", "live_config");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...defaultConfig, ...docSnap.data() };
    }
    return defaultConfig;
  } catch (err) {
    console.error("Fetch error:", err);
    return defaultConfig;
  }
}

// Save (Admin push)
export async function updateLiveConfig(newConfig) {
  const docRef = doc(db, "app_settings", "live_config");
  const cleanData = JSON.parse(JSON.stringify(newConfig));
  await setDoc(docRef, cleanData, { merge: true });
}
