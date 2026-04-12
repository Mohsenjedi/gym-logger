"use client";

import React, { useState, useEffect } from "react";
import { WorkoutForm } from "@/components/WorkoutForm";
import { WorkoutList } from "@/components/WorkoutList";
import { useAuth } from "@/contexts/AuthContext";
import { getWorkouts } from "@/lib/firestore";
import { Workout } from "@/types";
import { Activity } from "lucide-react";
import { clsx } from "clsx";

export default function Home() {
  const { user } = useAuth();
  const [todayWorkout, setTodayWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    if (!user) return;
    const allWorkouts = await getWorkouts(user.uid);
    const today = new Date().toISOString().split('T')[0];
    const found = allWorkouts.find(w => w.date === today);
    setTodayWorkout(found || null);
    setLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-40 rounded-2xl bg-bg-tertiary" />
        <div className="h-64 rounded-2xl bg-bg-tertiary" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">
            {todayWorkout?.completed ? "Finished" : "Crushing it"}
          </h1>
          <p className="text-sm font-bold text-text-tertiary uppercase tracking-widest mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-accent text-accent animate-pulse-ring">
          <Activity size={24} />
        </div>
      </header>

      {!todayWorkout?.completed && (
        <WorkoutForm 
          onEntryAdded={refreshData} 
          lastEntries={todayWorkout?.entries}
        />
      )}

      {todayWorkout ? (
        <section className="pb-20">
          <div className="mb-4 flex items-center justify-between px-1">
            <h2 className="text-xs font-black text-text-tertiary uppercase tracking-[0.2em]">Logged Sets</h2>
            <span className="text-xs font-bold text-accent">{todayWorkout.entries.length} sets total</span>
          </div>
          <WorkoutList 
            workoutId={todayWorkout.id} 
            entries={todayWorkout.entries} 
            onRefresh={refreshData} 
          />
          
          {!todayWorkout.completed && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <FinishButton workoutId={todayWorkout.id} onFinished={refreshData} />
              <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                Double tap to finish session
              </p>
            </div>
          )}
        </section>
      ) : (
        <div className="mt-12 text-center text-text-tertiary animate-fade-in">
          <p className="text-lg font-medium">Ready to crush it?</p>
          <p className="text-sm">Log your first set to start your session.</p>
        </div>
      )}
    </div>
  );
}

function FinishButton({ workoutId, onFinished }: { workoutId: string, onFinished: () => void }) {
  const { user } = useAuth();
  const [tapCount, setTapCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tapCount === 0) return;
    const timer = setTimeout(() => setTapCount(0), 1000);
    return () => clearTimeout(timer);
  }, [tapCount]);

  const handleFinish = async () => {
    if (tapCount < 1) {
      setTapCount(1);
      return;
    }

    if (!user) return;
    setLoading(true);
    // Explicitly update completed status in Firestore
    import("@/lib/firestore").then(async ({ updateDoc, doc, db }) => {
      const ref = doc(db, `users/${user.uid}/workouts`, workoutId);
      await updateDoc(ref, { completed: true });
      onFinished();
      setLoading(false);
    });
  };

  return (
    <button
      onClick={handleFinish}
      disabled={loading}
      className={clsx(
        "group relative overflow-hidden rounded-full px-8 py-4 transition-all active:scale-95",
        tapCount === 1 ? "bg-accent scale-105" : "bg-bg-secondary"
      )}
    >
      <span className={clsx(
        "text-lg font-black tracking-tighter transition-colors",
        tapCount === 1 ? "text-white" : "text-text-primary"
      )}>
        {loading ? "SAVING..." : tapCount === 1 ? "STILL CRUSHING IT?" : "FINISH WORKOUT"}
      </span>
      {tapCount === 1 && (
        <div className="absolute inset-0 bg-white/20 animate-pulse" />
      )}
    </button>
  );
}

