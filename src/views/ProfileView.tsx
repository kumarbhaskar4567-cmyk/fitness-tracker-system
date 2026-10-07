import React, { useState } from 'react';
import {
  User as UserIcon,
  Shield,
  Save,
  Target,
  Scale,
  Footprints,
  Flame,
  Droplet,
  Moon,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFitness } from '../context/FitnessContext';

export const ProfileView: React.FC = () => {
  const { user, updateProfile, isAdmin } = useAuth();
  const { updateDailyGoals, addToast } = useFitness();

  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age || 28);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(user?.gender || 'male');
  const [height, setHeight] = useState(user?.height || 178);
  const [weight, setWeight] = useState(user?.weight || 74);
  const [targetWeight, setTargetWeight] = useState(user?.targetWeight || 70);

  // Goals
  const [stepGoal, setStepGoal] = useState(user?.stepGoal || 10000);
  const [calorieGoal, setCalorieGoal] = useState(user?.calorieGoal || 500);
  const [waterGoalCups, setWaterGoalCups] = useState(user?.waterGoalCups || 10);
  const [sleepGoalHours, setSleepGoalHours] = useState(user?.sleepGoalHours || 8);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      age,
      gender,
      height,
      weight,
      targetWeight,
      stepGoal,
      calorieGoal,
      waterGoalCups,
      sleepGoalHours,
    });
    updateDailyGoals({
      stepGoal,
      calorieGoal,
    });
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your health profile and metabolic targets have been updated.',
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl mx-auto">
      {/* Header Profile Badge */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Athlete'}`}
            alt={user?.name}
            className="w-24 h-24 rounded-3xl border-2 border-rose-500/40 p-1 object-cover shadow-lg shadow-rose-500/10"
          />

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">{user?.name}</h1>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  isAdmin
                    ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {isAdmin ? 'System Admin' : 'Athlete Member'}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">{user?.email}</p>
            <p className="text-xs text-slate-400 pt-1">
              Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2025'} • Baseline metabolic profile active
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Physical Metrics */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserIcon size={18} className="text-rose-500" />
            <span>Biometric Baseline Characteristics</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Gender</label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {(['male', 'female', 'other'] as const).map((g) => (
                  <button
                    type="button"
                    key={g}
                    onClick={() => setGender(g)}
                    className={`py-2 text-xs rounded-xl font-bold capitalize transition cursor-pointer ${
                      gender === g
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Age</label>
              <input
                type="number"
                min="10"
                max="110"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full mt-1 px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Height (cm)</label>
              <input
                type="number"
                min="100"
                max="230"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full mt-1 px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Weight (kg)</label>
              <input
                type="number"
                min="30"
                max="250"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full mt-1 px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Weight (kg)</label>
              <input
                type="number"
                min="30"
                max="250"
                value={targetWeight}
                onChange={(e) => setTargetWeight(Number(e.target.value))}
                className="w-full mt-1 px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Daily Fitness Goals Targets */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target size={18} className="text-rose-500" />
            <span>Daily Fitness & Health Goals</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-500">
                <Footprints size={16} />
                <span>Daily Steps Target</span>
              </div>
              <input
                type="number"
                min="1000"
                step="500"
                value={stepGoal}
                onChange={(e) => setStepGoal(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <span className="text-[11px] text-slate-400">Default recommended: 10,000 steps</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-500">
                <Flame size={16} />
                <span>Active Calorie Burn Target (kcal)</span>
              </div>
              <input
                type="number"
                min="100"
                step="50"
                value={calorieGoal}
                onChange={(e) => setCalorieGoal(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <span className="text-[11px] text-slate-400">Standard metabolic target: 500 kcal</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-500">
                <Droplet size={16} />
                <span>Water Glasses (250ml each)</span>
              </div>
              <input
                type="number"
                min="4"
                max="20"
                value={waterGoalCups}
                onChange={(e) => setWaterGoalCups(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <span className="text-[11px] text-slate-400">10 cups = 2.5 Litres per day</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-500">
                <Moon size={16} />
                <span>Nocturnal Sleep Target (hours)</span>
              </div>
              <input
                type="number"
                step="0.5"
                min="5"
                max="12"
                value={sleepGoalHours}
                onChange={(e) => setSleepGoalHours(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <span className="text-[11px] text-slate-400">Circadian recommendation: 7.5 - 8.5 hours</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl transition shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <Save size={18} />
          <span>Save Changes to Profile & Goals</span>
        </button>
      </form>
    </div>
  );
};
