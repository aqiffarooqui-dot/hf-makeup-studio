import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDrf7qAcl7lnvVNI3yQUXsdRRnNEqfsxt8",
  authDomain: "hf-makeup-backend.firebaseapp.com",
  projectId: "hf-makeup-backend",
  storageBucket: "hf-makeup-backend.firebasestorage.app",
  messagingSenderId: "1034643523470",
  appId: "1:1034643523470:web:26c99d9d59f2d679f586df"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);

export function subscribeToLiveConfig(defaultConfig, callback) {
  const docRef = doc(db, "app_settings", "live_config");
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ ...defaultConfig, ...docSnap.data() });
    } else {
      callback(defaultConfig);
    }
  }, (err) => {
    console.warn("Realtime sync warning:", err);
    callback(defaultConfig);
  });
}
