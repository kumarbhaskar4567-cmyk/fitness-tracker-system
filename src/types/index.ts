export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  targetWeight?: number;
  stepGoal: number;
  calorieGoal: number;
  waterGoalCups: number; // default 10 (2500ml)
  sleepGoalHours: number;
  avatar?: string;
  createdAt: string;
}

export type WorkoutType =
  | 'Running'
  | 'Walking'
  | 'Cycling'
  | 'Gym'
  | 'Yoga'
  | 'Swimming'
  | 'HIIT'
  | 'Other';

export type IntensityLevel = 'Low' | 'Medium' | 'High' | 'Extreme';

export interface Workout {
  id: string;
  userId: string;
  type: WorkoutType;
  durationMinutes: number;
  caloriesBurned: number;
  distanceKm?: number;
  avgSpeedKmh?: number;
  avgHeartRate?: number;
  intensity: IntensityLevel;
  notes?: string;
  date: string; // ISO date string
}

export interface DailyActivity {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  steps: number;
  stepGoal: number;
  activeMinutes: number;
  activeMinutesGoal: number;
  caloriesBurned: number;
  calorieGoal: number;
  standHours: number;
  standHoursGoal: number;
  distanceKm: number;
  floorsClimbed: number;
  hourlySteps: number[]; // 24 hours
}

export interface HealthMetric {
  id: string;
  userId: string;
  date: string;
  heartRate: number; // bpm
  restingHeartRate: number;
  spo2: number; // %
  bloodPressureSystolic: number; // mmHg
  bloodPressureDiastolic: number; // mmHg
  weight: number; // kg
  bodyFatPercentage?: number;
  bmi: number;
}

export interface SleepRecord {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  bedtime: string; // e.g. "23:15"
  wakeTime: string; // e.g. "07:30"
  durationMinutes: number;
  qualityScore: number; // 1-10
  deepSleepPercent: number; // %
  remSleepPercent: number; // %
  lightSleepPercent: number; // %
  awakeMinutes: number;
  notes?: string;
}

export type MealCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface MealItem {
  id: string;
  name: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams?: number;
  category: MealCategory;
  time: string;
}

export interface NutritionDay {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  calorieTarget: number;
  meals: MealItem[];
  waterCups: number; // each cup ~250ml
  waterTargetCups: number;
  caffeineMg: number;
}

export type MoodType = 'Great' | 'Good' | 'Okay' | 'Bad' | 'Terrible';

export interface StressLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  time: string;
  stressLevel: number; // 1-10
  mood: MoodType;
  notes?: string;
  meditationMinutes?: number;
}

export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string; // e.g. "500mg"
  schedule: ('Morning' | 'Afternoon' | 'Evening' | 'Bedtime')[];
  instructions?: string;
  takenToday: {
    Morning?: boolean;
    Afternoon?: boolean;
    Evening?: boolean;
    Bedtime?: boolean;
  };
  startDate: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'Steps' | 'Workouts' | 'Hydration' | 'Sleep' | 'Mindfulness';
  targetValue: number;
  currentValue: number;
  unit: string;
  endDate: string;
  joined: boolean;
  completed: boolean;
  rewardBadge: string;
  participantsCount: number;
  daysRemaining: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'activity' | 'workout' | 'nutrition' | 'wellness';
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  steps: number;
  isCurrentUser: boolean;
  streakDays: number;
}
