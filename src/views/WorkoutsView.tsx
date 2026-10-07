import React, { useState } from 'react';
import {
  Dumbbell,
  Play,
  Plus,
  Trash2,
  Flame,
  Timer,
  Navigation,
  Heart,
  Filter,
  PieChart as PieIcon,
  Sparkles,
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { useAuth } from '../context/AuthContext';
import { WorkoutType, IntensityLevel, Workout } from '../types';
import { estimateCaloriesBurned } from '../utils/storage';

export const WorkoutsView: React.FC = () => {
  const { user } = useAuth();
  const { workouts, logWorkout, deleteWorkout, setIsLiveWorkoutModalOpen } = useFitness();

  const [isLogFormOpen, setIsLogFormOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('All');

  // Form State
  const [type, setType] = useState<WorkoutType>('Running');
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [distanceKm, setDistanceKm] = useState<string>('4.5');
  const [avgHeartRate, setAvgHeartRate] = useState<string>('145');
  const [intensity, setIntensity] = useState<IntensityLevel>('Medium');
  const [notes, setNotes] = useState<string>('');

  // Auto-calculated calories preview
  const autoEstimatedCalories = estimateCaloriesBurned(type, durationMinutes, user?.weight || 70);

  // Auto-calculated speed preview
  const parsedDist = parseFloat(distanceKm);
  const autoAvgSpeed =
    !isNaN(parsedDist) && parsedDist > 0 && durationMinutes > 0
      ? Number(((parsedDist / (durationMinutes / 60))).toFixed(1))
      : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logWorkout({
      type,
      durationMinutes,
      caloriesBurned: autoEstimatedCalories,
      distanceKm: !isNaN(parsedDist) && parsedDist > 0 ? parsedDist : undefined,
      avgSpeedKmh: autoAvgSpeed,
      avgHeartRate: avgHeartRate ? parseInt(avgHeartRate, 10) : undefined,
      intensity,
      notes: notes.trim() || undefined,
    });
    setIsLogFormOpen(false);
    setNotes('');
  };

  const workoutTypesList: WorkoutType[] = [
    'Running',
    'Walking',
    'Cycling',
    'Gym',
    'Yoga',
    'Swimming',
    'HIIT',
    'Other',
  ];

  const filteredWorkouts = workouts.filter((w) => filterType === 'All' || w.type === filterType);

  // Stats calculation
  const totalDuration = workouts.reduce((sum, w) => sum + w.durationMinutes, 0);
  const totalCalories = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0);

  // Distribution for donut chart
  const typeCounts: Record<string, number> = {};
  workouts.forEach((w) => {
    typeCounts[w.type] = (typeCounts[w.type] || 0) + 1;
  });

  const donutColors: Record<WorkoutType, string> = {
    Running: '#f43f5e',
    Walking: '#10b981',
    Cycling: '#06b6d4',
    Gym: '#8b5cf6',
    Yoga: '#ec4899',
    Swimming: '#3b82f6',
    HIIT: '#f59e0b',
    Other: '#64748b',
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider mb-1">
            <Dumbbell size={16} />
            <span>Training & Athletics</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Workout Tracker</h1>
          <p className="text-xs text-slate-500">
            Log sport sessions, track metabolic exertion, and analyze activity variety.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsLiveWorkoutModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/25 cursor-pointer"
          >
            <Play size={14} fill="currentColor" />
            <span>Live Stopwatch Timer</span>
          </button>
          <button
            onClick={() => setIsLogFormOpen(!isLogFormOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition shadow-md shadow-rose-500/25 cursor-pointer"
          >
            <Plus size={16} />
            <span>Manual Workout Log</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
            <Dumbbell size={22} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold">Total Sessions</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {workouts.length}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <Timer size={22} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold">Total Duration</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Flame size={22} />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold">Calories Burned</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {totalCalories.toLocaleString()} <span className="text-xs font-normal text-slate-400">kcal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Workout Log Form (Expandable) */}
      {isLogFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus size={16} className="text-rose-500" />
              <span>Record Finished Workout</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsLogFormOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Workout Type</label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mt-1.5">
              {workoutTypesList.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setType(t)}
                  className={`py-2 px-1 text-xs rounded-xl font-medium transition cursor-pointer text-center ${
                    type === t
                      ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="600"
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Distance (km) <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Avg Heart Rate (bpm)
              </label>
              <input
                type="number"
                min="40"
                max="220"
                value={avgHeartRate}
                onChange={(e) => setAvgHeartRate(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Exertion Intensity</label>
              <div className="grid grid-cols-4 gap-2 mt-1.5">
                {(['Low', 'Medium', 'High', 'Extreme'] as IntensityLevel[]).map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setIntensity(lvl)}
                    className={`py-2 text-xs rounded-xl font-medium transition cursor-pointer ${
                      intensity === lvl
                        ? 'bg-rose-500 text-white font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Workout Notes</label>
              <input
                type="text"
                placeholder="e.g. Great pace, felt energized"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full mt-1.5 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Auto Calculation Preview Banner */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs text-amber-500">
            <div className="flex items-center gap-2">
              <Sparkles size={16} />
              <span>
                Calculated Exertion: ~<strong>{autoEstimatedCalories} kcal</strong>
                {autoAvgSpeed ? ` • Avg Speed: ${autoAvgSpeed} km/h` : ''}
              </span>
            </div>
            <span className="text-[11px] opacity-75">Formula: MET × Weight × Duration</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-rose-500/25 cursor-pointer"
          >
            Save Workout to History
          </button>
        </form>
      )}

      {/* Distribution Chart & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Workout Type Distribution Donut Chart */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon size={16} className="text-rose-500" />
              <span>Workout Distribution</span>
            </h3>
            <span className="text-xs text-slate-500">{workouts.length} total</span>
          </div>

          <div className="py-4 space-y-3">
            {Object.keys(typeCounts).map((typeName) => {
              const count = typeCounts[typeName];
              const pct = Math.round((count / workouts.length) * 100);
              const color = donutColors[typeName as WorkoutType] || '#64748b';

              return (
                <div key={typeName} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{typeName}</span>
                    <span className="text-slate-500 font-bold">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[11px] text-slate-400 text-center">
            Cross-training improves VO2 max and prevents injury.
          </div>
        </div>

        {/* Workout History List */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Workout History</h3>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <Filter size={14} className="text-slate-400 shrink-0" />
              {['All', ...workoutTypesList].slice(0, 5).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterType(f)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    filterType === f
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredWorkouts.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No workouts logged in this category. Start one now!
              </div>
            ) : (
              filteredWorkouts.map((w) => {
                const dateStr = new Date(w.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div key={w.id} className="pt-3 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold shrink-0">
                        <Dumbbell size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {w.type}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">
                            {w.intensity}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {dateStr} • {w.durationMinutes} mins
                          {w.distanceKm ? ` • ${w.distanceKm} km` : ''}
                          {w.avgHeartRate ? ` • HR ${w.avgHeartRate} bpm` : ''}
                        </div>
                        {w.notes && (
                          <div className="text-[11px] text-slate-500 italic mt-0.5 max-w-md truncate">
                            "{w.notes}"
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-black text-rose-500 text-sm">{w.caloriesBurned} kcal</div>
                        {w.avgSpeedKmh && (
                          <div className="text-[10px] text-slate-400">{w.avgSpeedKmh} km/h</div>
                        )}
                      </div>
                      <button
                        onClick={() => deleteWorkout(w.id)}
                        className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        title="Delete workout"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
