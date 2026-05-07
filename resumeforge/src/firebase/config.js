import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCX7Qu__LfHErSphncIP2VQAEddhjLz0TI",
  authDomain: "theresumeforge.firebaseapp.com",
  projectId: "theresumeforge",
  storageBucket: "theresumeforge.firebasestorage.app",
  messagingSenderId: "126765042393",
  appId: "1:126765042393:web:d7e2b5d9278b425b670cc8",
  measurementId: "G-PXG2DQWCSR"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);