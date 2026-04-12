"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { LogOut, Sun, Moon, Monitor, ShieldCheck } from "lucide-react";
import { clsx } from "clsx";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="animate-fade-in">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tighter">SETTINGS</h1>
      </header>

      <section className="space-y-6">
        {/* Profile Card */}
        <div className="card-depth p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="h-12 w-12 rounded-full border border-border" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                {user?.email?.[0].toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-bold tracking-tight">{user?.displayName || "Athlete"}</p>
              <p className="text-xs text-text-tertiary">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="p-2 text-danger hover:bg-danger/10 rounded-xl transition-all active:scale-90"
          >
            <LogOut size={20} />
          </button>
        </div>

        {/* Appearance */}
        <div>
          <h2 className="mb-4 text-xs font-black text-text-tertiary uppercase tracking-widest">Appearance</h2>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "light", icon: Sun, label: "Light" },
              { id: "dark", icon: Moon, label: "Dark" },
              { id: "system", icon: Monitor, label: "System" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={clsx(
                  "flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-bg-secondary p-4 transition-all active:scale-95",
                  theme === t.id ? "border-accent bg-bg-accent text-accent shadow-card" : "text-text-tertiary hover:border-text-tertiary/20"
                )}
              >
                <t.icon size={20} />
                <span className="text-xs font-bold">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Security Info */}
        <div className="card-depth p-4 flex items-center gap-3 text-success">
          <ShieldCheck size={20} />
          <p className="text-sm font-bold">Data is safely stored in Firebase Firestore</p>
        </div>
      </section>
    </div>
  );
}
