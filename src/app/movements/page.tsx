"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getMovements } from "@/lib/firestore";
import { Movement } from "@/types";
import { Search, Dumbbell } from "lucide-react";

export default function MovementsPage() {
  const { user } = useAuth();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getMovements(user.uid).then((data) => {
        setMovements(data);
        setLoading(false);
      });
    }
  }, [user]);

  const filtered = movements.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter">MOVEMENTS</h1>
      </header>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-text-tertiary">
          <Search size={18} />
        </div>
        <input 
          type="text"
          placeholder="Search exercises..."
          className="w-full rounded-xl bg-bg-secondary border border-border pl-11 pr-4 py-3 outline-none focus:border-accent shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-14 rounded-xl skeleton" />)}
        </div>
      ) : (
        <div className="grid gap-2">
          {filtered.map((m) => (
            <div key={m.id} className="card-depth p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-bg-accent text-accent flex items-center justify-center">
                <Dumbbell size={20} />
              </div>
              <div>
                <p className="font-bold tracking-tight">{m.name}</p>
                <p className="text-[10px] uppercase font-black tracking-widest text-text-tertiary">{m.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
