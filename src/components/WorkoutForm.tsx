"use client";

import React, { useState, useEffect } from "react";
import { Movement, WorkoutEntry } from "@/types";
import { getMovements, addEntriesToWorkout } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronDown, Plus, RotateCcw } from "lucide-react";
import { clsx } from "clsx";

export const WorkoutForm = ({ 
  onEntryAdded, 
  lastEntries 
}: { 
  onEntryAdded: () => void, 
  lastEntries?: WorkoutEntry[] 
}) => {
  const { user } = useAuth();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [movementInput, setMovementInput] = useState("");
  const [reps, setReps] = useState<number>(8);
  const [weight, setWeight] = useState<number>(40);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  // Find the last set for the current movement input
  const lastSet = lastEntries?.filter(e => e.movementName.toLowerCase() === movementInput.toLowerCase()).pop();

  useEffect(() => {
    if (user) {
      getMovements(user.uid).then(setMovements);
    }
  }, [user]);

  const suggestions = movements
    .filter(m => m.name.toLowerCase().includes(movementInput.toLowerCase()))
    .slice(0, 8);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !movementInput) return;

    setLoading(true);
    await addEntriesToWorkout(user.uid, new Date().toISOString().split('T')[0], [
      { movementName: movementInput, reps, weight, unit: 'kg' }
    ]);
    setLoading(false);
    onEntryAdded();
  };

  const handleRepeatLast = () => {
    if (lastSet) {
      setReps(lastSet.reps);
      setWeight(lastSet.weight);
    }
  };

  return (
    <div className="card-depth p-4 mb-6 animate-slide-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Movement (e.g. Bench Press)"
            className="w-full rounded-xl bg-bg-primary px-4 py-3.5 text-lg font-bold outline-none border-2 border-transparent focus:border-accent transition-all placeholder:text-text-tertiary"
            value={movementInput}
            onChange={(e) => {
              setMovementInput(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-64 overflow-auto rounded-2xl border border-white/10 bg-bg-secondary p-1 shadow-2xl backdrop-blur-xl animate-modal-in">
              {suggestions.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="w-full rounded-xl px-4 py-3 text-left font-bold text-sm hover:bg-bg-accent active:bg-accent active:text-white transition-all"
                  onClick={() => {
                    setMovementInput(m.name);
                    setShowSuggestions(false);
                  }}
                >
                  {m.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <label className="mb-2 block text-[10px] font-black text-text-tertiary uppercase tracking-widest px-1">REPS</label>
            <input
              type="number"
              className="w-full rounded-2xl bg-bg-primary px-4 py-4 text-2xl font-black text-center shadow-inner outline-none focus:ring-2 focus:ring-accent transition-all"
              value={reps}
              onChange={(e) => setReps(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="relative flex-1">
            <label className="mb-2 block text-[10px] font-black text-text-tertiary uppercase tracking-widest px-1">WEIGHT (KG)</label>
            <input
              type="number"
              className="w-full rounded-2xl bg-bg-primary px-4 py-4 text-2xl font-black text-center shadow-inner outline-none focus:ring-2 focus:ring-accent transition-all"
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          {lastSet && (
            <button
              type="button"
              onClick={handleRepeatLast}
              className="flex h-14 w-14 items-center justify-center rounded-2xl bg-bg-secondary text-text-tertiary hover:text-accent hover:bg-bg-accent active:scale-90 transition-all"
              title={`Repeat last: ${lastSet.reps}x ${lastSet.weight}kg`}
            >
              <RotateCcw size={24} />
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !movementInput}
            className="flex-1 h-14 rounded-2xl bg-accent font-black text-white shadow-lg shadow-accent/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Plus size={24} strokeWidth={3} />
                <span className="tracking-tighter">LOG SET</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

