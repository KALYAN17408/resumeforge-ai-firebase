// Firebase SDK imports
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpbHZHredhlznGZRgB4dddFZAy58-9KFo",
  authDomain: "theresumeforge-c1fd2.firebaseapp.com",
  projectId: "theresumeforge-c1fd2",
  storageBucket: "theresumeforge-c1fd2.firebasestorage.app",
  messagingSenderId: "1088079478865",
  appId: "1:1088079478865:web:cde2f2c8df0245a427f870",
  measurementId: "G-6JGNQYNS3Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Analytics only if supported
let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

// Export everything
export { app, auth, db, storage, analytics };