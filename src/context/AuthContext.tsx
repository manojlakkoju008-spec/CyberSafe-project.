import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../services/firebase';
import { UserProfile, UserRole } from '../types';

const ADMIN_EMAIL = 'manojlakkoju008@gmail.com';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (
    email: string,
    pass: string,
    displayName: string,
    userType?: 'student' | 'individual' | 'senior' | 'educator'
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  sendResetEmail: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync or fetch profile from Firestore
  const fetchOrCreateProfile = async (fbUser: User, overrideDisplayName?: string, overrideUserType?: any): Promise<UserProfile> => {
    const userDocRef = doc(db, 'users', fbUser.uid);
    const isAppAdmin = fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const assignedRole: UserRole = isAppAdmin ? 'admin' : 'member';

    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data();
        const profile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: data.displayName || fbUser.displayName || 'CyberSafe Member',
          role: isAppAdmin ? 'admin' : (data.role || 'member'),
          createdAt: data.createdAt || new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          userType: data.userType || 'individual',
          completedChecklistIds: data.completedChecklistIds || [],
          quizHistory: data.quizHistory || [],
          savedThreatIds: data.savedThreatIds || [],
          savedBasicIds: data.savedBasicIds || [],
        };

        // Update last login
        await updateDoc(userDocRef, {
          lastLoginAt: new Date().toISOString(),
        }).catch(() => {});

        return profile;
      } else {
        // Create new profile
        const newProfile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName: overrideDisplayName || fbUser.displayName || 'CyberSafe Member',
          role: assignedRole,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          userType: overrideUserType || 'individual',
          completedChecklistIds: [],
          quizHistory: [],
          savedThreatIds: [],
          savedBasicIds: [],
        };

        await setDoc(userDocRef, {
          uid: newProfile.uid,
          email: newProfile.email,
          displayName: newProfile.displayName,
          role: newProfile.role,
          createdAt: newProfile.createdAt,
          lastLoginAt: newProfile.lastLoginAt,
          userType: newProfile.userType,
          completedChecklistIds: [],
          savedThreatIds: [],
        });

        return newProfile;
      }
    } catch (err) {
      console.warn('Unable to reach Firestore user collection, using fallback local profile:', err);
      return {
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: overrideDisplayName || fbUser.displayName || 'CyberSafe Member',
        role: isAppAdmin ? 'admin' : 'member',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        userType: overrideUserType || 'individual',
        completedChecklistIds: [],
        quizHistory: [],
        savedThreatIds: [],
        savedBasicIds: [],
      };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser) {
        try {
          const profile = await fetchOrCreateProfile(currentUser);
          setUser(profile);
        } catch (e) {
          console.error('Error hydrating profile:', e);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const profile = await fetchOrCreateProfile(cred.user);
    setUser(profile);
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    displayName: string,
    userType: 'student' | 'individual' | 'senior' | 'educator' = 'individual'
  ) => {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (displayName.trim()) {
      await updateProfile(cred.user, { displayName: displayName.trim() }).catch(() => {});
    }
    const profile = await fetchOrCreateProfile(cred.user, displayName.trim(), userType);
    setUser(profile);
  };

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const profile = await fetchOrCreateProfile(result.user);
    setUser(profile);
  };

  const sendResetEmail = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setFirebaseUser(null);
  };

  const refreshProfile = async () => {
    if (auth.currentUser) {
      const p = await fetchOrCreateProfile(auth.currentUser);
      setUser(p);
    }
  };

  const isAdmin = user?.role === 'admin' || firebaseUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated: !!firebaseUser,
        isAdmin,
        isLoading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        sendResetEmail,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
