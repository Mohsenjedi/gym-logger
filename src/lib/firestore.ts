import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  getDoc,
  setDoc,
  writeBatch
} from "firebase/firestore";
import { db } from "./firebase";
import { Workout, WorkoutEntry, Movement } from "@/types";

export const getWorkouts = async (userId: string) => {
  const q = query(
    collection(db, `users/${userId}/workouts`),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Workout))
    .filter(w => w.entries && w.entries.length > 0);
};

export const getMovements = async (userId: string) => {
  const q = query(collection(db, `users/${userId}/movements`), orderBy("name", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Movement));
};

export const addEntriesToWorkout = async (
  userId: string, 
  date: string, 
  newEntries: Omit<WorkoutEntry, 'id' | 'createdAt'>[]
) => {
  const workoutId = date; // One workout per day for simplicity, or use a unique ID
  const workoutRef = doc(db, `users/${userId}/workouts`, workoutId);
  const workoutSnap = await getDoc(workoutRef);

  const formattedEntries = newEntries.map(e => ({
    ...e,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: Date.now()
  }));

  if (workoutSnap.exists()) {
    const currentWorkout = workoutSnap.data() as Workout;
    await updateDoc(workoutRef, {
      entries: [...currentWorkout.entries, ...formattedEntries]
    });
  } else {
    await setDoc(workoutRef, {
      date,
      entries: formattedEntries,
      createdAt: Date.now(),
      completed: false
    });
  }
};

export const deleteEntry = async (userId: string, workoutId: string, entryId: string) => {
  const workoutRef = doc(db, `users/${userId}/workouts`, workoutId);
  const workoutSnap = await getDoc(workoutRef);

  if (workoutSnap.exists()) {
    const workout = workoutSnap.data() as Workout;
    const updatedEntries = workout.entries.filter(e => e.id !== entryId);

    if (updatedEntries.length === 0) {
      await deleteDoc(workoutRef);
    } else {
      await updateDoc(workoutRef, { entries: updatedEntries });
    }
  }
};

export const updateEntry = async (
  userId: string, 
  workoutId: string, 
  entryId: string, 
  updates: Partial<WorkoutEntry>
) => {
  const workoutRef = doc(db, `users/${userId}/workouts`, workoutId);
  const workoutSnap = await getDoc(workoutRef);

  if (workoutSnap.exists()) {
    const workout = workoutSnap.data() as Workout;
    const updatedEntries = workout.entries.map(e => 
      e.id === entryId ? { ...e, ...updates } : e
    );
    await updateDoc(workoutRef, { entries: updatedEntries });
  }
};

// Templates
export const getTemplates = async (userId: string) => {
  const q = query(collection(db, `users/${userId}/templates`), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
};

export const saveTemplate = async (userId: string, name: string, entries: any[]) => {
  const templatesRef = collection(db, `users/${userId}/templates`);
  const snapshot = await getDocs(templatesRef);
  const order = snapshot.size;
  
  await addDoc(templatesRef, {
    name,
    entries,
    createdAt: Date.now(),
    order
  });
};

export const deleteTemplate = async (userId: string, templateId: string) => {
  await deleteDoc(doc(db, `users/${userId}/templates`, templateId));
};
export const completeWorkout = async (userId: string, workoutId: string) => {
  const ref = doc(db, `users/${userId}/workouts`, workoutId);
  await updateDoc(ref, { completed: true });
};
