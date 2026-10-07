import React, { useState } from 'react';
import {
  Flame,
  Moon,
  Sun,
  Dumbbell,
  Droplet,
  Wind,
  Download,
  User as UserIcon,
  LogOut,
  Shield,
  Activity,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFitness } from '../context/FitnessContext';
import { calculateDailyHealthScore } from '../utils/storage';

interface NavbarProps {
  onOpenAuth: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onNavigateToTab }) => {
  const { user, isAuthenticated, isAdmin, logout, loginAsDemo, loginAsAdmin } = useAuth();
  const {
    isDarkMode,
    toggleTheme,
    todayActivity,
    currentSleep,
    todayNutrition,
    currentMetric,
    drinkWaterCup,
    setIsLiveWorkoutModalOpen,
    setIsBreathingModalOpen,
    setIsExportModalOpen,
    userStreak,
  } = useFitness();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const healthScore = calculateDailyHealthScore(
    todayActivity,
    currentSleep,
    todayNutrition,
    currentMetric
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigateToTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 via-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-base shadow-md shadow-rose-500/25 group-hover:scale-105 transition">
            SF
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">
                Smart FITNESS
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 uppercase tracking-wider">
                Health
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:inline">
              Samsung Health Experience
            </span>
          </div>
        </div>

        {/* Center Indicators: Health Score & Streak */}
        <div className="hidden md:flex items-center gap-3">
          {/* Health Score Pill */}
          <div
            onClick={() => onNavigateToTab('health')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 cursor-pointer hover:border-slate-400 transition"
          >
            <Activity size={14} className="text-emerald-500" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Score: <strong className="text-slate-900 dark:text-white">{healthScore.score}</strong>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-500/10 text-emerald-500">
              {healthScore.label}
            </span>
          </div>

          {/* 7-Day Streak */}
          <div
            onClick={() => onNavigateToTab('challenges')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-500 cursor-pointer hover:bg-amber-500/20 transition"
          >
            <Flame size={15} className="animate-pulse" />
            <span className="text-xs font-bold">{userStreak} Day Streak</span>
          </div>
        </div>

        {/* Right Section: Quick Action Shortcuts & User Menu */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Action: Start Workout */}
          <button
            onClick={() => setIsLiveWorkoutModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition shadow-sm shadow-rose-500/20 cursor-pointer"
            title="Start Live Workout Timer"
          >
            <Dumbbell size={14} />
            <span className="hidden sm:inline">Workout</span>
          </button>

          {/* Quick Action: Drink Water */}
          <button
            onClick={drinkWaterCup}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-500 dark:text-cyan-400 text-xs font-semibold transition cursor-pointer"
            title="Log 1 Cup of Water (250ml)"
          >
            <Droplet size={14} />
            <span>+ Water</span>
          </button>

          {/* Quick Action: Breathe */}
          <button
            onClick={() => setIsBreathingModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400 text-xs font-semibold transition cursor-pointer"
            title="4-7-8 Breathing Guide"
          >
            <Wind size={14} />
            <span>Breathe</span>
          </button>

          {/* Data Export */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title="Export Health Data"
          >
            <Download size={18} />
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>

          {/* User Menu Dropdown */}
          <div className="relative">
            {isAuthenticated && user ? (
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 object-cover"
                />
                <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition hover:opacity-90 cursor-pointer"
              >
                Sign In
              </button>
            )}

            {isProfileMenuOpen && isAuthenticated && user && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-xs animate-fade-in"
                onMouseLeave={() => setIsProfileMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white truncate">{user.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isAdmin
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {isAdmin ? 'Admin' : 'Member'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {user.height} cm • {user.weight} kg
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onNavigateToTab('profile');
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-left cursor-pointer"
                  >
                    <UserIcon size={14} />
                    <span>My Profile & Goals</span>
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        onNavigateToTab('admin');
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-purple-400 hover:bg-purple-500/10 text-left cursor-pointer font-semibold"
                    >
                      <Shield size={14} />
                      <span>Admin Dashboard</span>
                    </button>
                  )}
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase">
                    Quick Switch
                  </div>
                  <button
                    onClick={() => {
                      loginAsDemo();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-left cursor-pointer text-[11px]"
                  >
                    Switch to Demo (Alex)
                  </button>
                  <button
                    onClick={() => {
                      loginAsAdmin();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-purple-400 hover:bg-purple-500/10 text-left cursor-pointer text-[11px]"
                  >
                    Switch to Admin (Sarah)
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-rose-500 hover:bg-rose-500/10 text-left cursor-pointer mt-1"
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
