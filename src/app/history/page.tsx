"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getWorkouts } from "@/lib/firestore";
import { Workout } from "@/types";
import { History as HistoryIcon, ChevronRight, Calendar, Dumbbell, Trash2 } from "lucide-react";
import { clsx } from "clsx";

export default function HistoryPage() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>(null || []);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    try {
      const data = await getWorkouts(user.uid);
      setWorkouts(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-bg-tertiary" />
        ))}
      </div>
    );
  }

  if (!workouts.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-bg-secondary text-text-tertiary">
          <HistoryIcon size={40} />
        </div>
        <h2 className="text-xl font-black tracking-tight">No Workouts Yet</h2>
        <p className="mt-2 text-sm text-text-tertiary">Your fitness journey starts with your first log.</p>
      </div>
    );
  }

  // Simple grouping by Month
  const groupedWorkouts: { [key: string]: Workout[] } = workouts.reduce((acc, workout) => {
    const date = new Date(workout.date);
    const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(workout);
    return acc;
  }, {} as { [key: string]: Workout[] });

  return (
    <div className="animate-fade-in pb-10">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter">HISTORY</h1>
        <p className="text-sm font-bold text-text-tertiary uppercase tracking-widest flex items-center gap-2">
          Total Sessions: <span className="text-accent">{workouts.length}</span>
        </p>
      </header>

      <div className="space-y-10">
        {Object.entries(groupedWorkouts).map(([month, monthWorkouts]) => (
          <div key={month} className="space-y-4">
            <h2 className="sticky top-4 z-10 py-1 text-xs font-black text-text-tertiary uppercase tracking-[0.2em] bg-bg-primary/80 backdrop-blur-md">
              {month}
            </h2>
            <div className="space-y-4">
              {monthWorkouts.map((workout) => (
                <WorkoutCard key={workout.id} workout={workout} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkoutCard({ workout }: { workout: Workout }) {
  const date = new Date(workout.date);
  const day = date.getDate();
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });

  // Get unique exercises
  const uniqueMovements = Array.from(new Set(workout.entries.map(e => e.movementName)));

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-bg-secondary p-5 transition-all active:scale-[0.98] border border-transparent hover:border-bg-tertiary shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="flex flex-col items-center justify-center rounded-xl bg-bg-primary px-3 py-2 shadow-inner min-w-[3.5rem]">
            <span className="text-xs font-bold text-text-tertiary uppercase leading-none">{weekday}</span>
            <span className="text-xl font-black leading-none mt-1">{day}</span>
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight line-clamp-1">
              {uniqueMovements.slice(0, 3).join(", ")}
              {uniqueMovements.length > 3 && ` +${uniqueMovements.length - 3} more`}
            </h3>
            <div className="mt-2 flex items-center gap-3 text-xs font-bold text-text-tertiary">
              <span className="flex items-center gap-1">
                <Dumbbell size={14} className="text-accent" />
                {workout.entries.length} sets
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {workout.date}
              </span>
            </div>
          </div>
        </div>
        <div className="h-8 w-8 rounded-full bg-bg-tertiary flex items-center justify-center text-text-tertiary group-hover:bg-accent group-hover:text-white transition-colors">
          <ChevronRight size={18} />
        </div>
      </div>
    </div>
  );
}
