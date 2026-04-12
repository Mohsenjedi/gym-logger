"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithRedirect, 
  signOut, 
  User,
  getRedirectResult
} from "firebase/auth";
import { auth, googleProvider, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, writeBatch, collection } from "firebase/firestore";
import { Movement } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setLoading(false); // Set loading to false immediately to show the app
        seedDefaultData(user).catch(console.error); // Seed in background
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        await signInWithRedirect(auth, googleProvider);
      } else {
        console.error("Login error", error);
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

async function seedDefaultData(user: User) {
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    // New user, seed default movements and settings
    const batch = writeBatch(db);
    
    // Default settings
    batch.set(doc(db, `users/${user.uid}/settings/current`), {
      unit: 'kg',
      theme: 'system'
    });

    // Default movements
    const movements: Omit<Movement, 'id'>[] = [
      // Legs
      { name: 'Squat', category: 'Legs', isCustom: false },
      { name: 'Leg Press', category: 'Legs', isCustom: false },
      { name: 'Leg Extension', category: 'Legs', isCustom: false },
      { name: 'Leg Curl', category: 'Legs', isCustom: false },
      { name: 'Calf Raise', category: 'Legs', isCustom: false },
      // Back
      { name: 'Deadlift', category: 'Back', isCustom: false },
      { name: 'Pull-Up', category: 'Back', isCustom: false },
      { name: 'Lat Pulldown', category: 'Back', isCustom: false },
      { name: 'Seated Row', category: 'Back', isCustom: false },
      // Chest
      { name: 'Bench Press', category: 'Chest', isCustom: false },
      { name: 'Incline Press', category: 'Chest', isCustom: false },
      { name: 'Chest Fly', category: 'Chest', isCustom: false },
      { name: 'Push-Up', category: 'Chest', isCustom: false },
      // Shoulders
      { name: 'Overhead Press', category: 'Shoulders', isCustom: false },
      { name: 'Lateral Raise', category: 'Shoulders', isCustom: false },
      // Arms
      { name: 'Bicep Curl', category: 'Arms', isCustom: false },
      { name: 'Tricep Pushdown', category: 'Arms', isCustom: false },
      // Core
      { name: 'Plank', category: 'Core', isCustom: false },
      { name: 'Crunch', category: 'Core', isCustom: false },
      // Cardio
      { name: 'Running', category: 'Cardio', isCustom: false },
    ];

    movements.forEach((m) => {
      const mRef = doc(collection(db, `users/${user.uid}/movements`));
      batch.set(mRef, m);
    });

    await batch.commit();
    await setDoc(userDocRef, { initialized: true });
  }
}
