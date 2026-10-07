import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  DailyActivity,
  Workout,
  HealthMetric,
  SleepRecord,
  NutritionDay,
  StressLog,
  Medication,
  Challenge,
  Achievement,
  LeaderboardUser,
  MealItem,
  WorkoutType,
  IntensityLevel,
  MoodType,
} from '../types';
import {
  STORAGE_KEYS,
  getStoredItem,
  setStoredItem,
  getTodayDateString,
  DEFAULT_ACTIVITIES,
  DEFAULT_WORKOUTS,
  DEFAULT_HEALTH_METRICS,
  DEFAULT_SLEEP_RECORDS,
  DEFAULT_NUTRITION_DAYS,
  DEFAULT_STRESS_LOGS,
  DEFAULT_MEDICATIONS,
  DEFAULT_CHALLENGES,
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_LEADERBOARD,
  estimateCaloriesBurned,
  calculateBMI,
} from '../utils/storage';
import { useAuth } from './AuthContext';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface FitnessContextType {
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Activities & Steps
  todayActivity: DailyActivity;
  activityHistory: DailyActivity[];
  simulateSteps: (stepIncrement: number) => void;
  setManualSteps: (newTotal: number) => void;
  updateDailyGoals: (goals: { stepGoal?: number; calorieGoal?: number; waterGoal?: number }) => void;

  // Workouts
  workouts: Workout[];
  logWorkout: (workout: Omit<Workout, 'id' | 'userId' | 'date'>) => void;
  deleteWorkout: (id: string) => void;

  // Health Metrics
  currentMetric: HealthMetric;
  healthMetricsHistory: HealthMetric[];
  logHealthMetric: (metric: Omit<HealthMetric, 'id' | 'userId' | 'date' | 'bmi'>) => void;

  // Sleep
  currentSleep: SleepRecord;
  sleepHistory: SleepRecord[];
  logSleep: (record: Omit<SleepRecord, 'id' | 'userId' | 'date'>) => void;

  // Nutrition & Water
  todayNutrition: NutritionDay;
  logMeal: (meal: Omit<MealItem, 'id' | 'time'>) => void;
  deleteMeal: (id: string) => void;
  drinkWaterCup: () => void;
  removeWaterCup: () => void;
  setWaterCupCount: (cups: number) => void;
  logCaffeine: (mg: number) => void;

  // Mental Health
  todayStressLog: StressLog | undefined;
  stressHistory: StressLog[];
  logStressAndMood: (stressLevel: number, mood: MoodType, notes?: string) => void;
  logMeditation: (minutes: number) => void;

  // Medications
  medications: Medication[];
  addMedication: (med: Omit<Medication, 'id' | 'userId' | 'takenToday' | 'startDate'>) => void;
  toggleMedicationTaken: (id: string, timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime') => void;
  deleteMedication: (id: string) => void;

  // Social & Gamification
  challenges: Challenge[];
  achievements: Achievement[];
  leaderboard: LeaderboardUser[];
  userStreak: number;
  joinChallenge: (challengeId: string) => void;
  createChallenge: (challenge: Omit<Challenge, 'id' | 'joined' | 'completed' | 'participantsCount' | 'currentValue'>) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Modal Triggers
  isLiveWorkoutModalOpen: boolean;
  setIsLiveWorkoutModalOpen: (open: boolean) => void;
  isBreathingModalOpen: boolean;
  setIsBreathingModalOpen: (open: boolean) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const todayStr = getTodayDateString();

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) return saved === 'dark';
    return true; // Default sleek Samsung Health dark mode
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Modals
  const [isLiveWorkoutModalOpen, setIsLiveWorkoutModalOpen] = useState(false);
  const [isBreathingModalOpen, setIsBreathingModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Activities
  const [activityHistory, setActivityHistory] = useState<DailyActivity[]>(() =>
    getStoredItem<DailyActivity[]>(STORAGE_KEYS.ACTIVITIES, DEFAULT_ACTIVITIES)
  );

  const todayActivity = activityHistory.find((a) => a.date === todayStr) || {
    id: `act_${todayStr}`,
    userId: user?.id || 'user_demo_01',
    date: todayStr,
    steps: 10420,
    stepGoal: user?.stepGoal || 10000,
    activeMinutes: 52,
    activeMinutesGoal: 45,
    caloriesBurned: 580,
    calorieGoal: user?.calorieGoal || 500,
    standHours: 11,
    standHoursGoal: 12,
    distanceKm: 7.8,
    floorsClimbed: 14,
    hourlySteps: [0, 0, 0, 0, 0, 0, 180, 2400, 1100, 850, 420, 680, 1500, 720, 480, 950, 620, 180, 310, 0, 0, 0, 0, 0],
  };

  const updateActivityHistory = (updatedToday: DailyActivity) => {
    const exists = activityHistory.some((a) => a.date === todayStr);
    const updated = exists
      ? activityHistory.map((a) => (a.date === todayStr ? updatedToday : a))
      : [updatedToday, ...activityHistory];
    setActivityHistory(updated);
    setStoredItem(STORAGE_KEYS.ACTIVITIES, updated);
  };

  const simulateSteps = (stepIncrement: number) => {
    const newSteps = todayActivity.steps + stepIncrement;
    const additionalKm = Number(((stepIncrement * 0.75) / 1000).toFixed(2));
    const newKm = Number((todayActivity.distanceKm + additionalKm).toFixed(2));
    const addedCals = Math.round(stepIncrement * 0.04);
    const newCals = todayActivity.caloriesBurned + addedCals;
    const addedActiveMins = Math.round(stepIncrement / 100);
    const newActiveMins = todayActivity.activeMinutes + addedActiveMins;
    const currentHour = new Date().getHours();

    const newHourly = [...todayActivity.hourlySteps];
    newHourly[currentHour] = (newHourly[currentHour] || 0) + stepIncrement;

    const updated: DailyActivity = {
      ...todayActivity,
      steps: newSteps,
      distanceKm: newKm,
      caloriesBurned: newCals,
      activeMinutes: newActiveMins,
      hourlySteps: newHourly,
    };
    updateActivityHistory(updated);

    addToast({
      type: 'success',
      title: 'Steps Recorded',
      message: `Added +${stepIncrement.toLocaleString()} steps! Now at ${newSteps.toLocaleString()} steps today.`,
    });

    if (todayActivity.steps < todayActivity.stepGoal && newSteps >= todayActivity.stepGoal) {
      triggerConfetti();
      addToast({
        type: 'success',
        title: 'Goal Crushed! 🎉',
        message: `You reached your daily goal of ${todayActivity.stepGoal.toLocaleString()} steps!`,
      });
    }
  };

  const setManualSteps = (newTotal: number) => {
    const safeTotal = Math.max(0, newTotal);
    const newKm = Number(((safeTotal * 0.75) / 1000).toFixed(2));
    const newCals = Math.round(safeTotal * 0.04);
    const updated: DailyActivity = {
      ...todayActivity,
      steps: safeTotal,
      distanceKm: newKm,
      caloriesBurned: newCals,
    };
    updateActivityHistory(updated);
    addToast({
      type: 'info',
      title: 'Steps Updated',
      message: `Step count set to ${safeTotal.toLocaleString()} steps.`,
    });
  };

  const updateDailyGoals = (goals: { stepGoal?: number; calorieGoal?: number; waterGoal?: number }) => {
    const updated: DailyActivity = {
      ...todayActivity,
      stepGoal: goals.stepGoal ?? todayActivity.stepGoal,
      calorieGoal: goals.calorieGoal ?? todayActivity.calorieGoal,
    };
    updateActivityHistory(updated);
    addToast({
      type: 'success',
      title: 'Goals Updated',
      message: 'Your personal fitness goals have been updated.',
    });
  };

  // Workouts
  const [workouts, setWorkouts] = useState<Workout[]>(() =>
    getStoredItem<Workout[]>(STORAGE_KEYS.WORKOUTS, DEFAULT_WORKOUTS)
  );

  const logWorkout = (workoutData: Omit<Workout, 'id' | 'userId' | 'date'>) => {
    const newWorkout: Workout = {
      ...workoutData,
      id: `w_${Date.now()}`,
      userId: user?.id || 'user_demo_01',
      date: new Date().toISOString(),
    };
    const updated = [newWorkout, ...workouts];
    setWorkouts(updated);
    setStoredItem(STORAGE_KEYS.WORKOUTS, updated);

    // Update today's active calories and minutes
    const updatedActivity: DailyActivity = {
      ...todayActivity,
      caloriesBurned: todayActivity.caloriesBurned + workoutData.caloriesBurned,
      activeMinutes: todayActivity.activeMinutes + workoutData.durationMinutes,
      steps: workoutData.type === 'Running' || workoutData.type === 'Walking'
        ? todayActivity.steps + Math.round((workoutData.distanceKm || 3) * 1300)
        : todayActivity.steps,
      distanceKm: workoutData.distanceKm
        ? Number((todayActivity.distanceKm + workoutData.distanceKm).toFixed(2))
        : todayActivity.distanceKm,
    };
    updateActivityHistory(updatedActivity);

    triggerConfetti();
    addToast({
      type: 'success',
      title: 'Workout Logged! 💪',
      message: `${workoutData.type} for ${workoutData.durationMinutes} mins (${workoutData.caloriesBurned} kcal burned).`,
    });
  };

  const deleteWorkout = (id: string) => {
    const updated = workouts.filter((w) => w.id !== id);
    setWorkouts(updated);
    setStoredItem(STORAGE_KEYS.WORKOUTS, updated);
    addToast({
      type: 'info',
      title: 'Workout Removed',
      message: 'Workout log deleted.',
    });
  };

  // Health Metrics
  const [healthMetricsHistory, setHealthMetricsHistory] = useState<HealthMetric[]>(() =>
    getStoredItem<HealthMetric[]>(STORAGE_KEYS.HEALTH_METRICS, DEFAULT_HEALTH_METRICS)
  );

  const currentMetric = healthMetricsHistory.find((h) => h.date === todayStr) ||
    healthMetricsHistory[0] || {
      id: `hm_${todayStr}`,
      userId: user?.id || 'user_demo_01',
      date: todayStr,
      heartRate: 68,
      restingHeartRate: 62,
      spo2: 99,
      bloodPressureSystolic: 118,
      bloodPressureDiastolic: 76,
      weight: user?.weight || 74,
      bodyFatPercentage: 16.5,
      bmi: 23.3,
    };

  const logHealthMetric = (metricData: Omit<HealthMetric, 'id' | 'userId' | 'date' | 'bmi'>) => {
    const heightCm = user?.height || 178;
    const { bmi } = calculateBMI(metricData.weight, heightCm);

    const newMetric: HealthMetric = {
      ...metricData,
      id: `hm_${Date.now()}`,
      userId: user?.id || 'user_demo_01',
      date: todayStr,
      bmi,
    };

    const exists = healthMetricsHistory.some((m) => m.date === todayStr);
    const updated = exists
      ? healthMetricsHistory.map((m) => (m.date === todayStr ? newMetric : m))
      : [newMetric, ...healthMetricsHistory];

    setHealthMetricsHistory(updated);
    setStoredItem(STORAGE_KEYS.HEALTH_METRICS, updated);

    addToast({
      type: 'success',
      title: 'Health Metrics Saved',
      message: `HR: ${metricData.heartRate} bpm | SpO2: ${metricData.spo2}% | BP: ${metricData.bloodPressureSystolic}/${metricData.bloodPressureDiastolic} mmHg`,
    });
  };

  // Sleep
  const [sleepHistory, setSleepHistory] = useState<SleepRecord[]>(() =>
    getStoredItem<SleepRecord[]>(STORAGE_KEYS.SLEEP_RECORDS, DEFAULT_SLEEP_RECORDS)
  );

  const currentSleep = sleepHistory.find((s) => s.date === todayStr) ||
    sleepHistory[0] || {
      id: `sl_${todayStr}`,
      userId: user?.id || 'user_demo_01',
      date: todayStr,
      bedtime: '23:15',
      wakeTime: '07:15',
      durationMinutes: 480,
      qualityScore: 9,
      deepSleepPercent: 22,
      remSleepPercent: 24,
      lightSleepPercent: 49,
      awakeMinutes: 15,
      notes: 'Deep restful recovery.',
    };

  const logSleep = (recordData: Omit<SleepRecord, 'id' | 'userId' | 'date'>) => {
    const newRecord: SleepRecord = {
      ...recordData,
      id: `sl_${Date.now()}`,
      userId: user?.id || 'user_demo_01',
      date: todayStr,
    };

    const exists = sleepHistory.some((s) => s.date === todayStr);
    const updated = exists
      ? sleepHistory.map((s) => (s.date === todayStr ? newRecord : s))
      : [newRecord, ...sleepHistory];

    setSleepHistory(updated);
    setStoredItem(STORAGE_KEYS.SLEEP_RECORDS, updated);

    addToast({
      type: 'success',
      title: 'Sleep Logged',
      message: `Recorded ${Math.floor(recordData.durationMinutes / 60)}h ${recordData.durationMinutes % 60}m with quality score ${recordData.qualityScore}/10.`,
    });
  };

  // Nutrition
  const [nutritionHistory, setNutritionHistory] = useState<NutritionDay[]>(() =>
    getStoredItem<NutritionDay[]>(STORAGE_KEYS.NUTRITION_DAYS, DEFAULT_NUTRITION_DAYS)
  );

  const todayNutrition = nutritionHistory.find((n) => n.date === todayStr) || {
    id: `nut_${todayStr}`,
    userId: user?.id || 'user_demo_01',
    date: todayStr,
    calorieTarget: 2200,
    waterCups: 8,
    waterTargetCups: 10,
    caffeineMg: 160,
    meals: DEFAULT_NUTRITION_DAYS[0]?.meals || [],
  };

  const updateNutritionHistory = (updatedToday: NutritionDay) => {
    const exists = nutritionHistory.some((n) => n.date === todayStr);
    const updated = exists
      ? nutritionHistory.map((n) => (n.date === todayStr ? updatedToday : n))
      : [updatedToday, ...nutritionHistory];
    setNutritionHistory(updated);
    setStoredItem(STORAGE_KEYS.NUTRITION_DAYS, updated);
  };

  const logMeal = (mealData: Omit<MealItem, 'id' | 'time'>) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMeal: MealItem = {
      ...mealData,
      id: `m_${Date.now()}`,
      time: timeStr,
    };
    const updated = {
      ...todayNutrition,
      meals: [...todayNutrition.meals, newMeal],
    };
    updateNutritionHistory(updated);

    addToast({
      type: 'success',
      title: 'Meal Logged 🥗',
      message: `Added ${newMeal.name} (${newMeal.calories} kcal) to ${newMeal.category}.`,
    });
  };

  const deleteMeal = (id: string) => {
    const updated = {
      ...todayNutrition,
      meals: todayNutrition.meals.filter((m) => m.id !== id),
    };
    updateNutritionHistory(updated);
    addToast({
      type: 'info',
      title: 'Meal Removed',
      message: 'Meal removed from today’s log.',
    });
  };

  const drinkWaterCup = () => {
    const newCups = Math.min(todayNutrition.waterCups + 1, 20);
    const updated = {
      ...todayNutrition,
      waterCups: newCups,
    };
    updateNutritionHistory(updated);

    if (newCups === todayNutrition.waterTargetCups) {
      triggerConfetti();
      addToast({
        type: 'success',
        title: 'Hydration Target Achieved! 💧',
        message: `You completed your daily 10 glasses (2,500 ml) of water!`,
      });
    } else {
      addToast({
        type: 'info',
        title: 'Water Logged',
        message: `Glass ${newCups}/${todayNutrition.waterTargetCups} (${newCups * 250} ml drank).`,
      });
    }
  };

  const removeWaterCup = () => {
    const newCups = Math.max(todayNutrition.waterCups - 1, 0);
    const updated = {
      ...todayNutrition,
      waterCups: newCups,
    };
    updateNutritionHistory(updated);
  };

  const setWaterCupCount = (cups: number) => {
    const safe = Math.max(0, Math.min(cups, 24));
    const updated = {
      ...todayNutrition,
      waterCups: safe,
    };
    updateNutritionHistory(updated);
  };

  const logCaffeine = (mg: number) => {
    const newTotal = todayNutrition.caffeineMg + mg;
    const updated = {
      ...todayNutrition,
      caffeineMg: newTotal,
    };
    updateNutritionHistory(updated);
    addToast({
      type: newTotal > 400 ? 'warning' : 'info',
      title: 'Caffeine Tracked',
      message: `+${mg} mg caffeine added. Daily total: ${newTotal} mg (Safe limit: 400mg).`,
    });
  };

  // Mental Health
  const [stressHistory, setStressHistory] = useState<StressLog[]>(() =>
    getStoredItem<StressLog[]>(STORAGE_KEYS.STRESS_LOGS, DEFAULT_STRESS_LOGS)
  );

  const todayStressLog = stressHistory.find((s) => s.date === todayStr);

  const logStressAndMood = (stressLevel: number, mood: MoodType, notes?: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newLog: StressLog = {
      id: `str_${Date.now()}`,
      userId: user?.id || 'user_demo_01',
      date: todayStr,
      time: timeStr,
      stressLevel,
      mood,
      notes,
    };
    const exists = stressHistory.some((s) => s.date === todayStr);
    const updated = exists
      ? stressHistory.map((s) => (s.date === todayStr ? { ...s, ...newLog } : s))
      : [newLog, ...stressHistory];

    setStressHistory(updated);
    setStoredItem(STORAGE_KEYS.STRESS_LOGS, updated);

    addToast({
      type: 'success',
      title: 'Mindfulness Logged 🧘',
      message: `Mood: ${mood} | Stress Level: ${stressLevel}/10`,
    });
  };

  const logMeditation = (minutes: number) => {
    const currentMins = todayStressLog?.meditationMinutes || 0;
    const newMins = currentMins + minutes;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newLog: StressLog = todayStressLog
      ? { ...todayStressLog, meditationMinutes: newMins }
      : {
          id: `str_${Date.now()}`,
          userId: user?.id || 'user_demo_01',
          date: todayStr,
          time: timeStr,
          stressLevel: 3,
          mood: 'Good',
          meditationMinutes: newMins,
        };

    const exists = stressHistory.some((s) => s.date === todayStr);
    const updated = exists
      ? stressHistory.map((s) => (s.date === todayStr ? newLog : s))
      : [newLog, ...stressHistory];

    setStressHistory(updated);
    setStoredItem(STORAGE_KEYS.STRESS_LOGS, updated);

    triggerConfetti();
    addToast({
      type: 'success',
      title: 'Meditation Completed 🌿',
      message: `Completed a ${minutes}-minute calming mindfulness session. Total today: ${newMins} mins.`,
    });
  };

  // Medications
  const [medications, setMedications] = useState<Medication[]>(() =>
    getStoredItem<Medication[]>(STORAGE_KEYS.MEDICATIONS, DEFAULT_MEDICATIONS)
  );

  const addMedication = (medData: Omit<Medication, 'id' | 'userId' | 'takenToday' | 'startDate'>) => {
    const newMed: Medication = {
      ...medData,
      id: `med_${Date.now()}`,
      userId: user?.id || 'user_demo_01',
      takenToday: {},
      startDate: todayStr,
    };
    const updated = [...medications, newMed];
    setMedications(updated);
    setStoredItem(STORAGE_KEYS.MEDICATIONS, updated);
    addToast({
      type: 'success',
      title: 'Medication Added',
      message: `${newMed.name} (${newMed.dosage}) scheduled.`,
    });
  };

  const toggleMedicationTaken = (id: string, timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime') => {
    const updated = medications.map((m) => {
      if (m.id === id) {
        const current = !!m.takenToday[timeSlot];
        return {
          ...m,
          takenToday: {
            ...m.takenToday,
            [timeSlot]: !current,
          },
        };
      }
      return m;
    });
    setMedications(updated);
    setStoredItem(STORAGE_KEYS.MEDICATIONS, updated);

    const targetMed = medications.find((m) => m.id === id);
    if (targetMed) {
      const isNowTaken = !targetMed.takenToday[timeSlot];
      addToast({
        type: isNowTaken ? 'success' : 'info',
        title: isNowTaken ? 'Medication Taken' : 'Dose Marked Untaken',
        message: `${targetMed.name} (${timeSlot}) marked ${isNowTaken ? 'as taken' : 'untaken'}.`,
      });
    }
  };

  const deleteMedication = (id: string) => {
    const updated = medications.filter((m) => m.id !== id);
    setMedications(updated);
    setStoredItem(STORAGE_KEYS.MEDICATIONS, updated);
    addToast({
      type: 'info',
      title: 'Medication Removed',
      message: 'Medication record deleted.',
    });
  };

  // Challenges, Achievements & Leaderboard
  const [challenges, setChallenges] = useState<Challenge[]>(() =>
    getStoredItem<Challenge[]>(STORAGE_KEYS.CHALLENGES, DEFAULT_CHALLENGES)
  );

  const [achievements, setAchievements] = useState<Achievement[]>(() =>
    getStoredItem<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, DEFAULT_ACHIEVEMENTS)
  );

  const leaderboard = DEFAULT_LEADERBOARD.map((lb) =>
    lb.isCurrentUser ? { ...lb, steps: todayActivity.steps } : lb
  ).sort((a, b) => b.steps - a.steps).map((u, i) => ({ ...u, rank: i + 1 }));

  const userStreak = 7; // 7-day steady streak

  const joinChallenge = (challengeId: string) => {
    const updated = challenges.map((c) =>
      c.id === challengeId
        ? { ...c, joined: true, participantsCount: c.participantsCount + 1 }
        : c
    );
    setChallenges(updated);
    setStoredItem(STORAGE_KEYS.CHALLENGES, updated);
    addToast({
      type: 'success',
      title: 'Joined Challenge! 🏆',
      message: 'You are now participating in this community challenge.',
    });
  };

  const createChallenge = (
    challengeData: Omit<Challenge, 'id' | 'joined' | 'completed' | 'participantsCount' | 'currentValue'>
  ) => {
    const newChallenge: Challenge = {
      ...challengeData,
      id: `chal_${Date.now()}`,
      joined: true,
      completed: false,
      participantsCount: 1,
      currentValue: 0,
    };
    const updated = [newChallenge, ...challenges];
    setChallenges(updated);
    setStoredItem(STORAGE_KEYS.CHALLENGES, updated);
    addToast({
      type: 'success',
      title: 'Challenge Created',
      message: `"${challengeData.title}" is now open for community members!`,
    });
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#3b82f6'],
      });
    } catch {
      // ignore
    }
  };

  return (
    <FitnessContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        todayActivity,
        activityHistory,
        simulateSteps,
        setManualSteps,
        updateDailyGoals,
        workouts,
        logWorkout,
        deleteWorkout,
        currentMetric,
        healthMetricsHistory,
        logHealthMetric,
        currentSleep,
        sleepHistory,
        logSleep,
        todayNutrition,
        logMeal,
        deleteMeal,
        drinkWaterCup,
        removeWaterCup,
        setWaterCupCount,
        logCaffeine,
        todayStressLog,
        stressHistory,
        logStressAndMood,
        logMeditation,
        medications,
        addMedication,
        toggleMedicationTaken,
        deleteMedication,
        challenges,
        achievements,
        leaderboard,
        userStreak,
        joinChallenge,
        createChallenge,
        toasts,
        addToast,
        removeToast,
        isLiveWorkoutModalOpen,
        setIsLiveWorkoutModalOpen,
        isBreathingModalOpen,
        setIsBreathingModalOpen,
        isExportModalOpen,
        setIsExportModalOpen,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};
