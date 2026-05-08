import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { auth, db } from '../firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  /* ── Signup ── */
  const signup = useCallback(async (email, password, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    // Store extra user data in Firestore
    await setDoc(doc(db, 'users', cred.user.uid), {
      name,
      email,
      plan:      'free',
      createdAt: new Date().toISOString(),
    });
    return cred;
  }, []);

  /* ── Login ── */
  const login = useCallback((email, password) =>
    signInWithEmailAndPassword(auth, email, password), []);

  /* ── Logout ── */
  const logout = useCallback(() => signOut(auth), []);

  /* ── Listen to auth state ── */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Shim: expose uid same as Supabase shape so Dashboard/Builder are identical
        setUser({
          ...firebaseUser,
          uid:         firebaseUser.uid,
          displayName: firebaseUser.displayName || firebaseUser.email || 'User',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signup,
      login,
      logout,
      userPlan: 'free', // all features free — no plan checks needed
    }}>
      {loading ? (
        <div style={{
          minHeight: '100vh', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: '#080810', color: '#7c6aff',
          fontSize: '1.5rem', fontFamily: 'Syne, sans-serif',
        }}>
          ◈ ResumeForge
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}
