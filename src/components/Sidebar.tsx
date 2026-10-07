import React from 'react';
import {
  LayoutDashboard,
  Footprints,
  Dumbbell,
  HeartPulse,
  Moon,
  UtensilsCrossed,
  Brain,
  Pill,
  Trophy,
  ShieldAlert,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export interface NavTabItem {
  id: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  badge?: string;
}

export const NAV_ITEMS: NavTabItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'activity', label: 'Activity & Steps', icon: Footprints },
  { id: 'workouts', label: 'Workouts', icon: Dumbbell },
  { id: 'health', label: 'Body Health', icon: HeartPulse },
  { id: 'sleep', label: 'Sleep Tracker', icon: Moon },
  { id: 'nutrition', label: 'Nutrition & Water', icon: UtensilsCrossed },
  { id: 'mental', label: 'Mental Health', icon: Brain },
  { id: 'medications', label: 'Medications', icon: Pill },
  { id: 'challenges', label: 'Social Challenges', icon: Trophy, badge: 'New' },
  { id: 'admin', label: 'Admin Panel', icon: ShieldAlert, adminOnly: true },
  { id: 'profile', label: 'Profile & Goals', icon: UserCheck },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { isAdmin } = useAuth();

  const filteredItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Tracking & Health
        </div>
        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/25'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Samsung Health notice */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80 px-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Live Sensors Sync</span>
          </div>
          <p className="text-[10px] mt-1 text-slate-400 leading-tight">
            Encrypted local database with real-time biometric telemetry.
          </p>
        </div>
      </aside>

      {/* Mobile Horizontal Top Navigation / Scrollable Pill Bar */}
      <div className="lg:hidden sticky top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 py-2 overflow-x-auto scrollbar-none flex gap-1.5 shadow-xs">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-medium transition shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-rose-500 text-white font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Icon size={14} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
