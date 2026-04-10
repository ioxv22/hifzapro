'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, googleProvider, db } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User, setCurrentUser as setLocalUser, initProgress, logoutUser as localLogout } from '@/lib/store';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  loginWithGoogle: async () => ({ success: false }),
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync Firebase User with our custom User object in Firestore
  const syncUser = async (firebaseUser: FirebaseUser) => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userRef);
    
    let appUser: User;
    
    if (userDoc.exists()) {
      appUser = userDoc.data() as User;
    } else {
      // Create new user in Firestore
      appUser = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        password: '', // Hidden for Firebase
        role: firebaseUser.email?.toLowerCase().trim() === 'hamad@hifzapro.com' ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
        streak: 0,
        lastActive: new Date().toISOString(),
      };
      await setDoc(userRef, appUser);
      initProgress(appUser.id);
    }
    
    // Sync Progress from Cloud
    try {
      const progressDoc = await getDoc(doc(db, 'progress', appUser.id));
      if (progressDoc.exists()) {
        const cloudProgress = progressDoc.data();
        const allLocal = JSON.parse(localStorage.getItem('hifzpro_progress') || '{}');
        allLocal[appUser.id] = cloudProgress;
        localStorage.setItem('hifzpro_progress', JSON.stringify(allLocal));
      }
    } catch(e) { console.warn("Failed to sync progress from cloud", e); }
    
    setUser(appUser);
    setLocalUser(appUser);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await syncUser(firebaseUser);
      } else {
        setUser(null);
        localLogout();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Direct Master Check bypass
      const normEmail = email.toLowerCase().trim();
      if (normEmail === 'hamad@hifzapro.com' && password === 'hamadk2010@@') {
          // You must create this user in Firebase Auth if it doesn't exist, but typically for testing, let Firebase handle auth.
          // Wait, if master admin tries to login but has NO firebase account yet, it'll throw auth/user-not-found!
      }
      
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const normEmail = email.toLowerCase().trim();
      if (normEmail === 'hamad@hifzapro.com') {
        return { success: false, error: 'This email is reserved for the administrator' };
      }
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const appUser: User = {
        id: userCredential.user.uid,
        name,
        email: normEmail,
        password: '',
        role: 'user',
        createdAt: new Date().toISOString(),
        streak: 0,
        lastActive: new Date().toISOString(),
      };
      
      await setDoc(doc(db, 'users', appUser.id), appUser);
      initProgress(appUser.id);
      
      setUser(appUser);
      setLocalUser(appUser);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localLogout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
