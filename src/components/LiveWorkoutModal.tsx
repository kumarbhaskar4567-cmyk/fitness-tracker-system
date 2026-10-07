import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Square, Flame, Heart, Timer, Dumbbell } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { useAuth } from '../context/AuthContext';
import { WorkoutType, IntensityLevel } from '../types';
import { estimateCaloriesBurned } from '../utils/storage';

export const LiveWorkoutModal: React.FC = () => {
  const { isLiveWorkoutModalOpen, setIsLiveWorkoutModalOpen, logWorkout } = useFitness();
  const { user } = useAuth();

  const [workoutType, setWorkoutType] = useState<WorkoutType>('Running');
  const [intensity, setIntensity] = useState<IntensityLevel>('Medium');
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
        if (workoutType === 'Running' || workoutType === 'Cycling' || workoutType === 'Walking') {
          // Increment distance slightly
          setDistance((prev) => Number((prev + 0.003).toFixed(3)));
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, workoutType]);

  if (!isLiveWorkoutModalOpen) return null;

  const durationMinutes = Math.max(1, Math.round(seconds / 60));
  const estimatedCalories = Math.max(
    Math.round(seconds * 0.15),
    estimateCaloriesBurned(workoutType, durationMinutes, user?.weight || 70)
  );

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinish = () => {
    if (seconds >= 10) {
      logWorkout({
        type: workoutType,
        durationMinutes: Math.max(1, Math.round(seconds / 60)),
        caloriesBurned: estimatedCalories,
        distanceKm: distance > 0 ? Number(distance.toFixed(2)) : undefined,
        intensity,
        avgHeartRate: intensity === 'High' ? 155 : intensity === 'Extreme' ? 172 : 130,
        notes: `Live tracked session with SmartFit stopwatch.`,
      });
    }
    handleClose();
  };

  const handleClose = () => {
    setIsRunning(false);
    setSeconds(0);
    setDistance(0);
    setIsLiveWorkoutModalOpen(false);
  };

  const workoutTypes: WorkoutType[] = [
    'Running',
    'Walking',
    'Cycling',
    'Gym',
    'Yoga',
    'Swimming',
    'HIIT',
    'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 text-rose-500 mb-1">
          <Dumbbell size={20} />
          <span className="text-xs font-bold uppercase tracking-wider">Live Workout Tracker</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Real-time Exercise Session</h2>

        {/* Workout Selector */}
        {!isRunning && seconds === 0 && (
          <div className="mb-6 space-y-3">
            <label className="text-xs font-semibold text-slate-400 uppercase">Select Activity</label>
            <div className="grid grid-cols-4 gap-2">
              {workoutTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setWorkoutType(type)}
                  className={`py-2 px-1 text-xs rounded-xl font-medium transition cursor-pointer text-center ${
                    workoutType === type
                      ? 'bg-rose-500 text-white font-bold shadow-md shadow-rose-500/25'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-400 uppercase">Target Intensity</label>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {(['Low', 'Medium', 'High', 'Extreme'] as IntensityLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setIntensity(lvl)}
                    className={`py-1.5 text-xs rounded-xl font-medium transition cursor-pointer ${
                      intensity === lvl
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Live Stopwatch Display */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-2">
            <Timer size={14} />
            <span>Elapsed Duration</span>
          </div>
          <div className="text-6xl font-black tracking-tight text-white font-mono">
            {formatTime(seconds)}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/80">
            <div>
              <div className="flex items-center justify-center gap-1 text-rose-500 text-xs font-medium mb-1">
                <Flame size={14} />
                <span>Calories</span>
              </div>
              <div className="text-xl font-bold text-white">{estimatedCalories} <span className="text-xs font-normal text-slate-400">kcal</span></div>
            </div>

            <div>
              <div className="flex items-center justify-center gap-1 text-red-500 text-xs font-medium mb-1">
                <Heart size={14} />
                <span>Zone HR</span>
              </div>
              <div className="text-xl font-bold text-white">
                {isRunning ? (intensity === 'Extreme' ? '165-175' : intensity === 'High' ? '145-160' : '125-140') : '--'}
                <span className="text-xs font-normal text-slate-400"> bpm</span>
              </div>
            </div>

            <div>
              <div className="text-slate-400 text-xs font-medium mb-1">
                <span>Distance</span>
              </div>
              <div className="text-xl font-bold text-white">
                {distance > 0 ? distance.toFixed(2) : '--'}
                <span className="text-xs font-normal text-slate-400"> km</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          {!isRunning ? (
            <button
              onClick={() => setIsRunning(true)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition shadow-lg shadow-rose-500/25 cursor-pointer"
            >
              <Play size={18} fill="currentColor" />
              <span>{seconds === 0 ? 'Start Workout' : 'Resume Workout'}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsRunning(false)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition cursor-pointer"
            >
              <Pause size={18} fill="currentColor" />
              <span>Pause</span>
            </button>
          )}

          {seconds > 0 && (
            <button
              onClick={handleFinish}
              className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-lg shadow-emerald-600/25 cursor-pointer"
            >
              <Square size={16} fill="currentColor" />
              <span>Finish & Save</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
