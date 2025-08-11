// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig ={
  apiKey: "AIzaSyAyi3iX_738mhY_VW_xFTznH3YlVPIUr5Q",
  authDomain: "people-registration-e3125.firebaseapp.com",
  projectId: "people-registration-e3125",
  storageBucket: "people-registration-e3125.firebasestorage.app",
  messagingSenderId: "914961093741",
  appId: "1:914961093741:web:fef78cc8b0bef009855b64"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use long-polling fallback to avoid hanging requests on some networks/firewalls
export const db = initializeFirestore(app, {
  // Force long-polling to avoid hanging on some proxies/firewalls
  experimentalForceLongPolling: true,
});





















