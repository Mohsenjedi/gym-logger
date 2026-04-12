"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, ClipboardList, Dumbbell, BarChart2, Settings } from "lucide-react";
import { clsx } from "clsx";

const tabs = [
  { name: "Workout", href: "/", icon: Activity },
  { name: "Templates", href: "/templates", icon: ClipboardList },
  { name: "Movements", href: "/movements", icon: Dumbbell },
  { name: "History", href: "/history", icon: BarChart2 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div className="flex w-full max-w-lg items-center justify-around border-t border-[var(--glass-border)] bg-[var(--glass-bg)] px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={clsx(
                "group relative flex flex-col items-center justify-center space-y-1 transition-all active:scale-90",
                isActive ? "text-accent scale-105 drop-shadow-md" : "text-text-tertiary hover:text-accent/70"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {tab.name}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 h-1 w-1 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
