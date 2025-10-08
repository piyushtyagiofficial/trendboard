import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase is properly configured
const isFirebaseConfigured = Object.values(firebaseConfig).every(value => 
  value && value !== 'undefined' && value !== 'placeholder'
);

let app = null;
let db = null;
let isFirebaseAvailable = false;
let authAttempted = false; // Prevent multiple auth attempts

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    isFirebaseAvailable = true;

    // Anonymous Auth - only attempt once
    if (!authAttempted) {
      authAttempted = true;
      const auth = getAuth(app);
      signInAnonymously(auth)
        .then(() => {
          console.log("Signed in anonymously to Firebase");
        })
        .catch((error) => {
          console.warn("Firebase anonymous sign-in failed:", error.message);
          // Don't set isFirebaseAvailable to false here, as Firestore might still work
        });
    }
  } catch (error) {
    console.warn("Firebase initialization failed:", error.message);
    isFirebaseAvailable = false;
  }
} else {
  console.warn("Firebase not configured - missing or invalid environment variables. Running in offline mode.");
}

export { db, isFirebaseAvailable };
export default app;
