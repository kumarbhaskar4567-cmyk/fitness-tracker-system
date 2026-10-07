import React from 'react';
import {
  Footprints,
  Flame,
  Heart,
  Moon,
  Droplet,
  Scale,
  Plus,
  Play,
  Wind,
  TrendingUp,
  ArrowRight,
  Dumbbell,
  CheckCircle,
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { useAuth } from '../context/AuthContext';
import { ActivityRings } from '../components/ActivityRings';
import { HealthScoreGauge } from '../components/HealthScoreGauge';
import { calculateDailyHealthScore } from '../utils/storage';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const {
    todayActivity,
    activityHistory,
    workouts,
    currentMetric,
    currentSleep,
    todayNutrition,
    drinkWaterCup,
    simulateSteps,
    setIsLiveWorkoutModalOpen,
    setIsBreathingModalOpen,
  } = useFitness();

  const healthScore = calculateDailyHealthScore(
    todayActivity,
    currentSleep,
    todayNutrition,
    currentMetric
  );

  // 7-day activities reversed for chronological chart
  const weeklyActivities = [...activityHistory].slice(0, 7).reverse();
  const maxWeeklySteps = Math.max(...weeklyActivities.map((a) => a.steps), 12000);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-indigo-500/10 border border-rose-500/20 dark:border-rose-500/10 p-5 rounded-3xl">
        <div>
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider mb-1">
            <TrendingUp size={14} />
            <span>Samsung Health Engine Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Hello, {user?.name ? user.name.split(' ')[0] : 'Athlete'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            You're currently {Math.round((todayActivity.steps / todayActivity.stepGoal) * 100)}% towards your daily step goal today.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => simulateSteps(500)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:border-rose-500 transition cursor-pointer"
          >
            <Plus size={14} className="text-rose-500" />
            <span>+500 Steps</span>
          </button>
          <button
            onClick={drinkWaterCup}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:border-cyan-500 transition cursor-pointer"
          >
            <Droplet size={14} className="text-cyan-500" />
            <span>+1 Glass Water</span>
          </button>
          <button
            onClick={() => setIsLiveWorkoutModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition shadow-md shadow-rose-500/20 cursor-pointer"
          >
            <Play size={13} fill="currentColor" />
            <span>Live Workout</span>
          </button>
        </div>
      </div>

      {/* Top Grid: Health Score Dial & Activity Rings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Daily Health Score Gauge */}
        <div className="lg:col-span-5 flex flex-col">
          <HealthScoreGauge
            score={healthScore.score}
            label={healthScore.label}
            tips={healthScore.tips}
          />
        </div>

        {/* Right: Activity Rings Card */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Activity Rings</h2>
              <p className="text-xs text-slate-500">Move • Exercise • Stand Targets</p>
            </div>
            <button
              onClick={() => onNavigate('activity')}
              className="text-xs text-rose-500 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Details</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="py-2">
            <ActivityRings
              calories={todayActivity.caloriesBurned}
              calorieGoal={todayActivity.calorieGoal}
              activeMinutes={todayActivity.activeMinutes}
              activeMinutesGoal={todayActivity.activeMinutesGoal}
              standHours={todayActivity.standHours}
              standHoursGoal={todayActivity.standHoursGoal}
            />
          </div>
        </div>
      </div>

      {/* 6 Live Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. Steps */}
        <div
          onClick={() => onNavigate('activity')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs hover:border-rose-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Steps</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 group-hover:scale-110 transition">
              <Footprints size={16} />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {todayActivity.steps.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Goal: {todayActivity.stepGoal.toLocaleString()}
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((todayActivity.steps / todayActivity.stepGoal) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* 2. Active Calories */}
        <div
          onClick={() => onNavigate('activity')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs hover:border-amber-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Active Cal</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 group-hover:scale-110 transition">
              <Flame size={16} />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {todayActivity.caloriesBurned} <span className="text-xs font-normal text-slate-400">kcal</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Target: {todayActivity.calorieGoal} kcal
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((todayActivity.caloriesBurned / todayActivity.calorieGoal) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* 3. Heart Rate */}
        <div
          onClick={() => onNavigate('health')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs hover:border-red-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Heart Rate</span>
            <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500 group-hover:scale-110 transition">
              <Heart size={16} />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
            <span>{currentMetric.heartRate}</span>
            <span className="text-xs font-normal text-slate-400">bpm</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Resting: {currentMetric.restingHeartRate} bpm
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-semibold mt-2">
            <CheckCircle size={12} /> Normal Rhythm
          </div>
        </div>

        {/* 4. Sleep */}
        <div
          onClick={() => onNavigate('sleep')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs hover:border-indigo-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Sleep</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition">
              <Moon size={16} />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {Math.floor(currentSleep.durationMinutes / 60)}h {currentSleep.durationMinutes % 60}m
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Score: {currentSleep.qualityScore}/10 (Deep {currentSleep.deepSleepPercent}%)
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((currentSleep.durationMinutes / (8 * 60)) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* 5. Water Intake */}
        <div
          onClick={() => onNavigate('nutrition')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs hover:border-cyan-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Hydration</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-500 group-hover:scale-110 transition">
              <Droplet size={16} />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {todayNutrition.waterCups * 250} <span className="text-xs font-normal text-slate-400">ml</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {todayNutrition.waterCups} of {todayNutrition.waterTargetCups} cups
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min((todayNutrition.waterCups / todayNutrition.waterTargetCups) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* 6. Weight */}
        <div
          onClick={() => onNavigate('health')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs hover:border-emerald-500/50 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Weight</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition">
              <Scale size={16} />
            </div>
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {currentMetric.weight} <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            BMI: {currentMetric.bmi} (Normal)
          </div>
          <div className="text-[11px] text-emerald-500 font-semibold mt-2">
            Target: {user?.targetWeight || 70} kg
          </div>
        </div>
      </div>

      {/* Mid Grid: Weekly Activity Bar Chart + Recent Workouts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Activity Bar Chart */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Weekly Activity Flow</h2>
              <p className="text-xs text-slate-500">Steps trend vs 10,000 goal line</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
                <span className="text-slate-500">Steps</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500"></span>
                <span className="text-slate-500">Goal Line</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-52 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-800">
            {weeklyActivities.map((act) => {
              const heightPct = Math.min((act.steps / maxWeeklySteps) * 100, 100);
              const isGoalMet = act.steps >= act.stepGoal;
              const dateObj = new Date(act.date);
              const dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

              return (
                <div key={act.id} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md shadow-lg whitespace-nowrap z-10">
                    {act.steps.toLocaleString()} steps ({act.caloriesBurned} kcal)
                  </div>

                  <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800/80 rounded-t-lg h-40 flex items-end p-1">
                    <div
                      className={`w-full rounded-md transition-all duration-500 ${
                        isGoalMet
                          ? 'bg-gradient-to-t from-rose-600 to-rose-400'
                          : 'bg-gradient-to-t from-slate-400 to-slate-300 dark:from-slate-700 dark:to-slate-500'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>

                  <span className="text-[11px] font-semibold text-slate-500 group-hover:text-rose-500 transition">
                    {dayLabel}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-3">
            <span>Weekly Average: 11,040 steps/day</span>
            <span className="text-emerald-500 font-semibold">100% Consistency Streak</span>
          </div>
        </div>

        {/* Recent Workouts List */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Workouts</h2>
              <p className="text-xs text-slate-500">Logged training sessions</p>
            </div>
            <button
              onClick={() => onNavigate('workouts')}
              className="text-xs text-rose-500 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-56 pr-1">
            {workouts.slice(0, 4).map((workout) => {
              const workoutDate = new Date(workout.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
                      <Dumbbell size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {workout.type}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {workoutDate} • {workout.durationMinutes} mins {workout.distanceKm ? `• ${workout.distanceKm} km` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-rose-500">
                      {workout.caloriesBurned} kcal
                    </div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {workout.intensity}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => onNavigate('workouts')}
            className="w-full mt-3 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-rose-500 hover:text-rose-500 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            <span>Log New Workout Session</span>
          </button>
        </div>
      </div>

      {/* Bottom Health Trend Lines Overview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Health Metrics Trend</h2>
            <p className="text-xs text-slate-500">Resting Heart Rate & SpO2 stability check</p>
          </div>
          <button
            onClick={() => onNavigate('health')}
            className="text-xs text-rose-500 font-semibold hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Open Body Health Monitor</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-400">Resting HR Baseline</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              62 <span className="text-xs font-normal text-slate-400">bpm</span>
            </div>
            <p className="text-[11px] text-emerald-500 mt-1">Steady athletic cardiovascular condition</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-400">Blood Oxygen (SpO2)</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {currentMetric.spo2}%
            </div>
            <p className="text-[11px] text-emerald-500 mt-1">Optimal oxygen transport capacity</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-400">Blood Pressure</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {currentMetric.bloodPressureSystolic} / {currentMetric.bloodPressureDiastolic}{' '}
              <span className="text-xs font-normal text-slate-400">mmHg</span>
            </div>
            <p className="text-[11px] text-emerald-500 mt-1">Ideal normotensive reading</p>
          </div>
        </div>
      </div>
    </div>
  );
};
