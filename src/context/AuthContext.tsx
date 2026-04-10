'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, googleProvider, db } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
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
      }
      try {
        await setDoc(userRef, appUser);
      } catch(e) { console.warn("Firestore error saving user: ", e); }
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
      try {
        if (firebaseUser) {
          await syncUser(firebaseUser);
        } else {
          setUser(null);
          localLogout();
        }
      } catch (error) {
        console.error("Auth sync error:", error);
      } finally {
        setLoading(false);
      }
    });

    // Handle redirect results (e.g. after mobile Google login)
    getRedirectResult(auth).then(async (result) => {
      if (result?.user) {
        await syncUser(result.user);
      }
    }).catch((error) => {
      console.error("Redirect auth error:", error);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Direct Master Check bypass
      const normEmail = email.toLowerCase().trim();
      if (normEmail === 'hamad@hifzapro.com' && password === 'hamadk2010@@') {
          // Check if user exists in Firebase Auth, if not, create it!
          try {
            await signInWithEmailAndPassword(auth, email, password);
            return { success: true };
          } catch(err: any) {
             if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
                 await createUserWithEmailAndPassword(auth, email, password);
                 return { success: true };
             }
             throw err;
          }
      }
      
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      await syncUser(userCred.user);
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
      // Use redirect for mobile devices or if being opened in an in-app browser (WebView)
      // This solves the 'Bluetooth/Security Key' prompt issue which happens when popups are blocked or untrusted.
      const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
      const isInstagram = /Instagram/i.test(userAgent);
      const isFacebook = /FBAN|FBAV/i.test(userAgent);
      
      if (isMobile || isInstagram || isFacebook) {
        await signInWithRedirect(auth, googleProvider);
        return { success: true };
      } else {
        const userCred = await signInWithPopup(auth, googleProvider);
        await syncUser(userCred.user);
        return { success: true };
      }
    } catch (error: any) {
      console.error("Google Login Error:", error);
      // Fallback for popup blockers
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        await signInWithRedirect(auth, googleProvider);
        return { success: true };
      }
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
