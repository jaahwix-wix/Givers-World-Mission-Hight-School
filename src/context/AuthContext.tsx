/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, ROLE_PRIVILEGES_MAP, DEMO_PRESET_USERS, testFirestoreConnection } from '../firebase';
import { UserRole, RolePrivileges, AuthUser } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  privileges: RolePrivileges;
  isLoading: boolean;
  isFirebaseOnline: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  updateUserRole: (targetUserId: string, newRole: UserRole) => Promise<void>;
  userList: AuthUser[];
  can: (permission: keyof Omit<RolePrivileges, 'role' | 'label' | 'description'>) => boolean;
}

const BOOTSTRAPPED_ADMIN_EMAIL = 'nabieumelissajosephine@gmail.com';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirebaseOnline, setIsFirebaseOnline] = useState(false);
  
  // Stored registry of system accounts
  const [userList, setUserList] = useState<AuthUser[]>(() => {
    const saved = localStorage.getItem('sma_user_registry');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user registry', e);
      }
    }
    return Object.values(DEMO_PRESET_USERS);
  });

  // Current active role derived from user or fallback to admin
  const currentRole: UserRole = user?.role || 'admin';
  const privileges: RolePrivileges = ROLE_PRIVILEGES_MAP[currentRole];

  // Helper permission check
  const can = (permission: keyof Omit<RolePrivileges, 'role' | 'label' | 'description'>): boolean => {
    return Boolean(privileges[permission]);
  };

  // Test Firebase connection on boot
  useEffect(() => {
    testFirestoreConnection().then(online => {
      setIsFirebaseOnline(online);
    });
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Determine role: bootstrapped admin email gets 'admin'
        let assignedRole: UserRole = 'teacher';
        if (firebaseUser.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase()) {
          assignedRole = 'admin';
        } else {
          // Check local registry or Firestore
          const existing = userList.find(u => u.uid === firebaseUser.uid || u.email === firebaseUser.email);
          if (existing) {
            assignedRole = existing.role;
          } else {
            // Check Firestore doc if online
            try {
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
              if (userDoc.exists() && userDoc.data().role) {
                assignedRole = userDoc.data().role;
              }
            } catch (err) {
              console.warn('Could not read user profile from Firestore, using default:', err);
            }
          }
        }

        const authUserObj: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          photoURL: firebaseUser.photoURL,
          role: assignedRole,
        };

        setUser(authUserObj);

        // Update in-memory registry
        setUserList(prev => {
          const index = prev.findIndex(p => p.uid === authUserObj.uid);
          let updated: AuthUser[];
          if (index >= 0) {
            updated = [...prev];
            updated[index] = { ...updated[index], ...authUserObj };
          } else {
            updated = [...prev, authUserObj];
          }
          localStorage.setItem('sma_user_registry', JSON.stringify(updated));
          return updated;
        });

        // Save to Firestore if admin
        try {
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            role: assignedRole,
            photoURL: firebaseUser.photoURL || '',
            createdAt: new Date().toISOString()
          }, { merge: true });
        } catch (e) {
          // Non-blocking in case of restricted write
        }
      } else {
        // Fallback to active demo account stored in localStorage or default to Super Admin
        const cachedDemoRole = localStorage.getItem('sma_active_role') as UserRole;
        if (cachedDemoRole && DEMO_PRESET_USERS[cachedDemoRole]) {
          setUser(DEMO_PRESET_USERS[cachedDemoRole]);
        } else {
          setUser(DEMO_PRESET_USERS.admin);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google Sign In
  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Sign-in failed:', error);
      alert(`Authentication failed: ${error.message || 'Please check your connection and popup permissions.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Out
  const signOutUser = async () => {
    try {
      setIsLoading(true);
      await firebaseSignOut(auth);
      // Reset to default guest admin demo for testing
      setUser(DEMO_PRESET_USERS.admin);
      localStorage.removeItem('sma_active_role');
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick switch role (vital for demoing & testing all 5 privilege tiers in real-time)
  const switchRole = (newRole: UserRole) => {
    localStorage.setItem('sma_active_role', newRole);
    if (user) {
      setUser({
        ...user,
        role: newRole,
        displayName: user.displayName || DEMO_PRESET_USERS[newRole].displayName,
      });
    } else {
      setUser(DEMO_PRESET_USERS[newRole]);
    }
  };

  // Update a user's role (Admin Privilege feature)
  const updateUserRole = async (targetUserId: string, newRole: UserRole) => {
    if (!can('canManageUserRoles')) {
      alert('Unauthorized: Only Super Administrators can alter user roles.');
      return;
    }

    setUserList(prev => {
      const updated = prev.map(u => u.uid === targetUserId ? { ...u, role: newRole } : u);
      localStorage.setItem('sma_user_registry', JSON.stringify(updated));
      return updated;
    });

    // If updating currently logged in user
    if (user && user.uid === targetUserId) {
      setUser(prev => prev ? { ...prev, role: newRole } : null);
    }

    // Attempt Firestore persistence if possible
    try {
      await setDoc(doc(db, 'users', targetUserId), { role: newRole }, { merge: true });
    } catch (err) {
      console.warn('Firestore update role notification:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: currentRole,
        privileges,
        isLoading,
        isFirebaseOnline,
        signInWithGoogle,
        signOutUser,
        switchRole,
        updateUserRole,
        userList,
        can,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
