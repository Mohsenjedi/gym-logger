"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getTemplates, saveTemplate, deleteTemplate, addEntriesToWorkout } from "@/lib/firestore";
import { WorkoutTemplate } from "@/types";
import { Copy, Plus, Play, Trash2, Layout, X, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TemplatesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");

  const fetchData = async () => {
    if (!user) return;
    try {
      const data = await getTemplates(user.uid);
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleCreate = async () => {
    if (!newTemplateName.trim() || !user) return;
    await saveTemplate(user.uid, newTemplateName, []);
    setNewTemplateName("");
    setIsCreating(false);
    fetchData();
  };

  const handleStartTemplate = async (template: WorkoutTemplate) => {
    if (!user || !template.entries.length) return;
    const today = new Date().toISOString().split('T')[0];
    await addEntriesToWorkout(user.uid, today, template.entries);
    router.push("/");
  };

  const handleDelete = async (id: string) => {
    if (!user || !confirm("Delete this template?")) return;
    await deleteTemplate(user.uid, id);
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-bg-tertiary" />
        ))}
      </div>
    );
  }

  return (
    <div className="animate-fade-in relative min-h-[80vh]">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter">TEMPLATES</h1>
          <p className="text-sm font-bold text-text-tertiary uppercase tracking-widest">
            {templates.length} saved routines
          </p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-white shadow-lg active:scale-90 transition-transform"
        >
          <Plus size={24} />
        </button>
      </header>

      {!templates.length && !isCreating ? (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-bg-secondary text-text-tertiary">
            <Layout size={40} />
          </div>
          <h2 className="text-xl font-black tracking-tight">Focus Your Gains</h2>
          <p className="mt-2 text-sm text-text-tertiary max-w-[240px]">Save your favorite routines to start workouts faster.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {templates.map((template) => (
            <div key={template.id} className="group relative overflow-hidden rounded-2xl bg-bg-secondary p-5 border border-transparent hover:border-bg-tertiary transition-all active:scale-[0.98]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{template.name}</h3>
                  <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider mt-1">
                    {template.entries?.length || 0} Exercises
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleStartTemplate(template)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-accent text-accent hover:bg-accent hover:text-white transition-colors"
                  >
                    <Play size={18} fill="currentColor" />
                  </button>
                  <button 
                    onClick={() => handleDelete(template.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-tertiary text-text-tertiary hover:bg-error/10 hover:text-error transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal Overlay */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4 sm:items-center">
          <div className="w-full max-w-sm rounded-[2rem] bg-bg-primary p-8 shadow-2xl animate-slide-up border border-white/10">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight">NEW TEMPLATE</h2>
              <button onClick={() => setIsCreating(false)} className="text-text-tertiary hover:text-text-primary">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                autoFocus
                type="text"
                placeholder="Routine Name (e.g. Push Day)"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                className="w-full rounded-2xl bg-bg-secondary p-4 text-lg font-bold placeholder:text-text-tertiary outline-none ring-2 ring-transparent focus:ring-accent transition-all"
              />
              <button 
                onClick={handleCreate}
                disabled={!newTemplateName.trim()}
                className="w-full rounded-2xl bg-accent py-4 text-center text-lg font-black text-white shadow-xl active:scale-95 transition-all disabled:opacity-50"
              >
                CREATE TEMPLATE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
