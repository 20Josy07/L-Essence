import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDGrCX9EZJUOjFUK5WHGjfRHIAT0HMhFtE",
  authDomain: "l-essence-by-samu.firebaseapp.com",
  projectId: "l-essence-by-samu",
  storageBucket: "l-essence-by-samu.firebasestorage.app",
  messagingSenderId: "521506738463",
  appId: "1:521506738463:web:bda136b4258343eebe202a",
  measurementId: "G-JG67QVZ1J1",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
