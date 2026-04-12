"use client";

import React from "react";
import { WorkoutEntry } from "@/types";
import { Trash2, Copy, Pencil } from "lucide-react";
import { deleteEntry, updateEntry } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";

export const WorkoutList = ({ 
  workoutId, 
  entries, 
  onRefresh 
}: { 
  workoutId: string;
  entries: WorkoutEntry[];
  onRefresh: () => void;
}) => {
  const { user } = useAuth();

  const grouped = entries.reduce((acc, entry) => {
    if (!acc[entry.movementName]) {
      acc[entry.movementName] = [];
    }
    acc[entry.movementName].push(entry);
    return acc;
  }, {} as Record<string, WorkoutEntry[]>);

  const handleDelete = async (entryId: string) => {
    if (!user) return;
    await deleteEntry(user.uid, workoutId, entryId);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([name, movementEntries]) => (
        <div key={name} className="card-depth overflow-hidden animate-slide-up">
          <div className="bg-bg-tertiary px-4 py-2 flex justify-between items-center">
            <h3 className="font-bold text-sm tracking-tight">{name}</h3>
            <span className="text-xs text-text-tertiary font-bold">{movementEntries.length} SETS</span>
          </div>
          <div className="divide-y divide-border">
            {movementEntries.map((entry, idx) => (
              <div key={entry.id} className="flex items-center justify-between px-4 py-3 hover:bg-bg-accent transition-colors">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-text-tertiary w-4">{idx + 1}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold">{entry.weight}</span>
                    <span className="text-[10px] text-text-tertiary font-bold mr-2">{entry.unit}</span>
                    <span className="text-text-tertiary">×</span>
                    <span className="text-lg font-bold ml-1">{entry.reps}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleDelete(entry.id)}
                    className="p-2 text-text-tertiary hover:text-danger active:scale-90 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
