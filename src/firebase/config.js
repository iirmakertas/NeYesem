import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD3OQCJP09seYJeq0G2M_KC3BmhL8MtUVg",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "neyesem-8e029.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "neyesem-8e029",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "neyesem-8e029.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "213656056192",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:213656056192:web:63aa28f3eadf2c8d0c9165"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export default app;
