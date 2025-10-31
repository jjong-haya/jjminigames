import {getAnalytics, isSupported as analyticsSupported} from 'firebase/analytics';
import {initializeApp} from 'firebase/app';
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analyticsPromise = typeof window !== 'undefined' &&
        window.isSecureContext && firebaseConfig.measurementId ?
    analyticsSupported().then(
        (ok: boolean) => (ok ? getAnalytics(app) : null))  // ← 타입만 명시
    :
    Promise.resolve(null);

export {app};  // (옵션) 필요하면 노출
