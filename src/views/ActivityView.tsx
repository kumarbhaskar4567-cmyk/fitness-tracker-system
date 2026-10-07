import React, { useState } from 'react';
import {
  Footprints,
  Flame,
  Timer,
  Navigation,
  Building,
  Plus,
  Edit3,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';

export const ActivityView: React.FC = () => {
  const {
    todayActivity,
    activityHistory,
    simulateSteps,
    setManualSteps,
    updateDailyGoals,
  } = useFitness();

  const [customStepsInput, setCustomStepsInput] = useState<string>('');
  const [manualTotalInput, setManualTotalInput] = useState<string>('');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState<number>(todayActivity.stepGoal);

  const stepProgress = Math.min((todayActivity.steps / todayActivity.stepGoal) * 100, 100);

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(customStepsInput, 10);
    if (!isNaN(count) && count > 0) {
      simulateSteps(count);
      setCustomStepsInput('');
    }
  };

  const handleManualSet = (e: React.FormEvent) => {
    e.preventDefault();
    const total = parseInt(manualTotalInput, 10);
    if (!isNaN(total) && total >= 0) {
      setManualSteps(total);
      setManualTotalInput('');
    }
  };

  const handleSaveGoal = () => {
    if (goalInput > 0) {
      updateDailyGoals({ stepGoal: goalInput });
      setIsEditingGoal(false);
    }
  };

  const maxHourly = Math.max(...todayActivity.hourlySteps, 1000);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Banner & Main Step Dial */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Circular Progress Gauge */}
          <div className="relative flex items-center justify-center">
            <svg width="220" height="220" className="rotate-[-90deg]">
              <circle
                cx="110"
                cy="110"
                r="90"
                stroke="currentColor"
                strokeWidth="16"
                className="text-slate-100 dark:text-slate-800"
                fill="transparent"
              />
              <circle
                cx="110"
                cy="110"
                r="90"
                stroke="#fa2d48"
                strokeWidth="16"
                strokeDasharray={2 * Math.PI * 90}
                strokeDashoffset={2 * Math.PI * 90 * (1 - stepProgress / 100)}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <Footprints size={24} className="text-rose-500 mb-1" />
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {todayActivity.steps.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400 font-medium">
                Goal: {todayActivity.stepGoal.toLocaleString()}
              </div>
              <span className="text-[11px] font-bold text-rose-500 mt-1">
                {Math.round((todayActivity.steps / todayActivity.stepGoal) * 100)}% Complete
              </span>
            </div>
          </div>

          {/* Quick Metrics & Goal Edit */}
          <div className="flex-1 w-full space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">Daily Steps Tracker</h1>
                <p className="text-xs text-slate-500">Live pedometer telemetry and target trajectory</p>
              </div>

              {!isEditingGoal ? (
                <button
                  onClick={() => setIsEditingGoal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  <Edit3 size={13} />
                  <span>Edit Target</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={goalInput}
                    onChange={(e) => setGoalInput(Number(e.target.value))}
                    className="w-24 px-2 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 border border-rose-500 text-slate-900 dark:text-white"
                  />
                  <button
                    onClick={handleSaveGoal}
                    className="px-3 py-1 bg-rose-500 text-white text-xs rounded-lg font-bold cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            {/* 4 Cards: Distance, Floors, Active Minutes, Calories */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Navigation size={14} className="text-cyan-500" />
                  <span>Distance</span>
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white">
                  {todayActivity.distanceKm} <span className="text-xs font-normal text-slate-400">km</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Building size={14} className="text-amber-500" />
                  <span>Floors</span>
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white">
                  {todayActivity.floorsClimbed} <span className="text-xs font-normal text-slate-400">floors</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Flame size={14} className="text-rose-500" />
                  <span>Active Cals</span>
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white">
                  {todayActivity.caloriesBurned} <span className="text-xs font-normal text-slate-400">kcal</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Timer size={14} className="text-emerald-500" />
                  <span>Active Mins</span>
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white">
                  {todayActivity.activeMinutes} <span className="text-xs font-normal text-slate-400">mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Step Simulator & Manual Logger */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Simulator */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <Zap size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Step Simulator & Quick Add</h3>
              <p className="text-xs text-slate-500">Simulate walking, jogging, or custom increments</p>
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => simulateSteps(250)}
              className="py-2.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              +250 Stroll
            </button>
            <button
              onClick={() => simulateSteps(1000)}
              className="py-2.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              +1,000 Walk
            </button>
            <button
              onClick={() => simulateSteps(2500)}
              className="py-2.5 px-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              +2,500 Jog
            </button>
          </div>

          <form onSubmit={handleCustomAdd} className="flex gap-2">
            <input
              type="number"
              placeholder="e.g. 750 custom steps"
              value={customStepsInput}
              onChange={(e) => setCustomStepsInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Add Steps
            </button>
          </form>
        </div>

        {/* Manual Total Override */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Edit3 size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Manual Total Entry</h3>
              <p className="text-xs text-slate-500">Sync with smartwatch or external fitness pedometer</p>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Override today’s total step count if you wore an offline fitness tracker or treadmill monitor.
          </p>

          <form onSubmit={handleManualSet} className="flex gap-2 pt-2">
            <input
              type="number"
              placeholder="Total steps, e.g. 11500"
              value={manualTotalInput}
              onChange={(e) => setManualTotalInput(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Set Total
            </button>
          </form>
        </div>
      </div>

      {/* Hourly Breakdown Chart (24h) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">24-Hour Hourly Breakdown</h3>
            <p className="text-xs text-slate-500">Hourly step distribution throughout today</p>
          </div>
          <span className="text-xs font-semibold text-rose-500">Peak at 7:00 AM (2,400 steps)</span>
        </div>

        <div className="h-36 flex items-end justify-between gap-1 pt-4 pb-2 px-1 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
          {todayActivity.hourlySteps.map((steps, hour) => {
            const heightPct = Math.min((steps / maxHourly) * 100, 100);
            return (
              <div key={hour} className="flex-1 min-w-[14px] flex flex-col items-center gap-1 group relative">
                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded shadow z-10 whitespace-nowrap">
                  {hour}:00 - {steps} steps
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-24 rounded-t-sm flex items-end">
                  <div
                    className="w-full bg-rose-500 rounded-t-sm transition-all duration-300 group-hover:bg-rose-400"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                {hour % 3 === 0 && (
                  <span className="text-[9px] text-slate-400 mt-0.5">{hour}h</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 7-Day Step History */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-rose-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">7-Day Step History</h3>
          </div>
          <span className="text-xs text-slate-500">Last 7 recorded days</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {activityHistory.slice(0, 7).map((act) => {
            const d = new Date(act.date);
            const formatted = d.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
            });
            const isCompleted = act.steps >= act.stepGoal;

            return (
              <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isCompleted ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                  />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{formatted}</span>
                    <div className="text-[11px] text-slate-400">
                      {act.distanceKm} km • {act.caloriesBurned} kcal • {act.activeMinutes} mins
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {act.steps.toLocaleString()}
                  </span>
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold">
                      <CheckCircle2 size={12} /> Goal Hit
                    </span>
                  ) : (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                      {Math.round((act.steps / act.stepGoal) * 100)}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
