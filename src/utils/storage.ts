import {
  User,
  Workout,
  DailyActivity,
  HealthMetric,
  SleepRecord,
  NutritionDay,
  StressLog,
  Medication,
  Challenge,
  Achievement,
  LeaderboardUser,
  WorkoutType,
} from '../types';

const STORAGE_KEYS = {
  USERS: 'smartfit_users',
  CURRENT_USER: 'smartfit_current_user',
  TOKEN: 'smartfit_token',
  WORKOUTS: 'smartfit_workouts',
  ACTIVITIES: 'smartfit_activities',
  HEALTH_METRICS: 'smartfit_health_metrics',
  SLEEP_RECORDS: 'smartfit_sleep_records',
  NUTRITION_DAYS: 'smartfit_nutrition_days',
  STRESS_LOGS: 'smartfit_stress_logs',
  MEDICATIONS: 'smartfit_medications',
  CHALLENGES: 'smartfit_challenges',
  ACHIEVEMENTS: 'smartfit_achievements',
  THEME: 'smartfit_theme',
};

// Default seed users
export const DEFAULT_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'user_demo_01',
    name: 'Alex Johnson',
    email: 'demo@smartfit.com',
    role: 'user',
    age: 28,
    gender: 'male',
    height: 178, // cm
    weight: 74, // kg
    targetWeight: 70,
    stepGoal: 10000,
    calorieGoal: 500,
    waterGoalCups: 10,
    sleepGoalHours: 8,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-01-10T08:00:00Z',
    passwordHash: 'demo123', // Demo plaintext for local check
  },
  {
    id: 'user_admin_01',
    name: 'Sarah Connor (Admin)',
    email: 'admin@smartfit.com',
    role: 'admin',
    age: 34,
    gender: 'female',
    height: 168,
    weight: 62,
    targetWeight: 60,
    stepGoal: 12000,
    calorieGoal: 600,
    waterGoalCups: 10,
    sleepGoalHours: 7.5,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2024-11-01T08:00:00Z',
    passwordHash: 'admin123',
  },
  {
    id: 'user_maria_02',
    name: 'Maria Rossi',
    email: 'maria@fitness.com',
    role: 'user',
    age: 26,
    gender: 'female',
    height: 165,
    weight: 58,
    targetWeight: 56,
    stepGoal: 9000,
    calorieGoal: 450,
    waterGoalCups: 8,
    sleepGoalHours: 8,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-02-14T10:00:00Z',
    passwordHash: 'maria123',
  },
];

// Helper to get formatted today string (YYYY-MM-DD)
export const getTodayDateString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

export const getPastDateString = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

// Seed Achievements
export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach_first_step',
    title: 'First Stride',
    description: 'Log your very first workout or 1,000 steps',
    icon: '👟',
    unlocked: true,
    unlockedAt: '2025-01-10',
    category: 'activity',
  },
  {
    id: 'ach_10k_club',
    title: '10K Crusher',
    description: 'Hit 10,000 steps in a single day',
    icon: '🔥',
    unlocked: true,
    unlockedAt: '2025-01-12',
    category: 'activity',
  },
  {
    id: 'ach_hydration_hero',
    title: 'Hydration Hero',
    description: 'Drink 10 glasses of water in a single day',
    icon: '💧',
    unlocked: true,
    unlockedAt: '2025-01-15',
    category: 'nutrition',
  },
  {
    id: 'ach_zen_master',
    title: 'Zen Master',
    description: 'Complete 3 breathing or meditation sessions',
    icon: '🧘',
    unlocked: true,
    unlockedAt: '2025-01-20',
    category: 'wellness',
  },
  {
    id: 'ach_sleep_champion',
    title: 'Slumber King',
    description: 'Achieve a sleep score of 9+ with 8+ hours restful rest',
    icon: '🌙',
    unlocked: true,
    unlockedAt: '2025-01-22',
    category: 'wellness',
  },
  {
    id: 'ach_7day_streak',
    title: 'Unstoppable 7',
    description: 'Maintain a 7-day daily activity streak',
    icon: '⚡',
    unlocked: true,
    unlockedAt: '2025-01-25',
    category: 'activity',
  },
  {
    id: 'ach_century_ride',
    title: 'Century Ride',
    description: 'Log over 30km of cycling in one week',
    icon: '🚴',
    unlocked: false,
    category: 'workout',
  },
  {
    id: 'ach_iron_lifter',
    title: 'Iron Lifter',
    description: 'Log 5 Gym or HIIT strength workouts',
    icon: '🏋️',
    unlocked: false,
    category: 'workout',
  },
];

// Seed Challenges
export const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: 'chal_50k_steps',
    title: '50,000 Steps Blitz',
    description: 'Clock 50,000 steps within 5 days to jumpstart your metabolic burn.',
    category: 'Steps',
    targetValue: 50000,
    currentValue: 36420,
    unit: 'steps',
    endDate: getPastDateString(-3),
    joined: true,
    completed: false,
    rewardBadge: '🏆 Step Master',
    participantsCount: 1420,
    daysRemaining: 3,
  },
  {
    id: 'chal_water_week',
    title: 'Hydrate 20 Litres',
    description: 'Maintain top hydration: consume 10 full glasses daily for a whole week.',
    category: 'Hydration',
    targetValue: 70,
    currentValue: 58,
    unit: 'glasses',
    endDate: getPastDateString(-2),
    joined: true,
    completed: false,
    rewardBadge: '🌊 Water Titan',
    participantsCount: 890,
    daysRemaining: 2,
  },
  {
    id: 'chal_weekend_run',
    title: 'Weekend 10K Runner',
    description: 'Run or walk a total of 10 kilometers over this weekend.',
    category: 'Workouts',
    targetValue: 10,
    currentValue: 10,
    unit: 'km',
    endDate: getPastDateString(1),
    joined: true,
    completed: true,
    rewardBadge: '⚡ Speed Demon',
    participantsCount: 2340,
    daysRemaining: 0,
  },
  {
    id: 'chal_mindful_minutes',
    title: 'Mindful 60 Minutes',
    description: 'Complete 60 minutes of 4-7-8 breathing and guided meditation.',
    category: 'Mindfulness',
    targetValue: 60,
    currentValue: 35,
    unit: 'minutes',
    endDate: getPastDateString(-5),
    joined: false,
    completed: false,
    rewardBadge: '🧘 Inner Peace',
    participantsCount: 654,
    daysRemaining: 5,
  },
];

// Seed Leaderboard
export const DEFAULT_LEADERBOARD: LeaderboardUser[] = [
  {
    rank: 1,
    id: 'lb_01',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    steps: 14850,
    isCurrentUser: false,
    streakDays: 14,
  },
  {
    rank: 2,
    id: 'lb_02',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    steps: 12400,
    isCurrentUser: false,
    streakDays: 9,
  },
  {
    rank: 3,
    id: 'user_demo_01',
    name: 'Alex Johnson (You)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    steps: 10420,
    isCurrentUser: true,
    streakDays: 7,
  },
  {
    rank: 4,
    id: 'lb_04',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    steps: 9280,
    isCurrentUser: false,
    streakDays: 5,
  },
  {
    rank: 5,
    id: 'user_maria_02',
    name: 'Maria Rossi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    steps: 8640,
    isCurrentUser: false,
    streakDays: 4,
  },
];

// Seed Workouts
export const DEFAULT_WORKOUTS: Workout[] = [
  {
    id: 'w_01',
    userId: 'user_demo_01',
    type: 'Running',
    durationMinutes: 42,
    caloriesBurned: 430,
    distanceKm: 6.2,
    avgSpeedKmh: 8.8,
    avgHeartRate: 152,
    intensity: 'High',
    notes: 'Morning outdoor park run, felt energetic and smooth!',
    date: `${getTodayDateString()}T07:15:00Z`,
  },
  {
    id: 'w_02',
    userId: 'user_demo_01',
    type: 'Gym',
    durationMinutes: 50,
    caloriesBurned: 320,
    avgHeartRate: 134,
    intensity: 'Medium',
    notes: 'Upper body hypertrophy + core circuit.',
    date: `${getPastDateString(1)}T18:30:00Z`,
  },
  {
    id: 'w_03',
    userId: 'user_demo_01',
    type: 'Cycling',
    durationMinutes: 35,
    caloriesBurned: 280,
    distanceKm: 11.4,
    avgSpeedKmh: 19.5,
    avgHeartRate: 140,
    intensity: 'Medium',
    notes: 'Scenic commute ride around lake.',
    date: `${getPastDateString(2)}T17:00:00Z`,
  },
  {
    id: 'w_04',
    userId: 'user_demo_01',
    type: 'HIIT',
    durationMinutes: 25,
    caloriesBurned: 290,
    avgHeartRate: 168,
    intensity: 'Extreme',
    notes: 'Tabata burpees and kettlebell swings.',
    date: `${getPastDateString(3)}T12:30:00Z`,
  },
  {
    id: 'w_05',
    userId: 'user_demo_01',
    type: 'Yoga',
    durationMinutes: 40,
    caloriesBurned: 140,
    avgHeartRate: 98,
    intensity: 'Low',
    notes: 'Vinyasa flow stretch and mobility.',
    date: `${getPastDateString(4)}T08:00:00Z`,
  },
  {
    id: 'w_06',
    userId: 'user_demo_01',
    type: 'Walking',
    durationMinutes: 45,
    caloriesBurned: 180,
    distanceKm: 3.5,
    avgSpeedKmh: 4.7,
    avgHeartRate: 105,
    intensity: 'Low',
    notes: 'Evening post-dinner cooldown walk.',
    date: `${getPastDateString(5)}T19:40:00Z`,
  },
];

// Seed Daily Activities (Last 7 days)
export const DEFAULT_ACTIVITIES: DailyActivity[] = [
  {
    id: 'act_today',
    userId: 'user_demo_01',
    date: getTodayDateString(),
    steps: 10420,
    stepGoal: 10000,
    activeMinutes: 52,
    activeMinutesGoal: 45,
    caloriesBurned: 580,
    calorieGoal: 500,
    standHours: 11,
    standHoursGoal: 12,
    distanceKm: 7.8,
    floorsClimbed: 14,
    hourlySteps: [0, 0, 0, 0, 0, 0, 180, 2400, 1100, 850, 420, 680, 1500, 720, 480, 950, 620, 180, 310, 0, 0, 0, 0, 0],
  },
  {
    id: 'act_1',
    userId: 'user_demo_01',
    date: getPastDateString(1),
    steps: 11250,
    stepGoal: 10000,
    activeMinutes: 60,
    activeMinutesGoal: 45,
    caloriesBurned: 620,
    calorieGoal: 500,
    standHours: 12,
    standHoursGoal: 12,
    distanceKm: 8.4,
    floorsClimbed: 18,
    hourlySteps: [0, 0, 0, 0, 0, 0, 120, 1200, 950, 780, 600, 1100, 1900, 850, 500, 1200, 1100, 550, 400, 0, 0, 0, 0, 0],
  },
  {
    id: 'act_2',
    userId: 'user_demo_01',
    date: getPastDateString(2),
    steps: 9680,
    stepGoal: 10000,
    activeMinutes: 48,
    activeMinutesGoal: 45,
    caloriesBurned: 490,
    calorieGoal: 500,
    standHours: 10,
    standHoursGoal: 12,
    distanceKm: 7.1,
    floorsClimbed: 12,
    hourlySteps: [0, 0, 0, 0, 0, 0, 90, 800, 1200, 600, 450, 850, 1400, 920, 610, 750, 890, 620, 500, 0, 0, 0, 0, 0],
  },
  {
    id: 'act_3',
    userId: 'user_demo_01',
    date: getPastDateString(3),
    steps: 12840,
    stepGoal: 10000,
    activeMinutes: 72,
    activeMinutesGoal: 45,
    caloriesBurned: 710,
    calorieGoal: 500,
    standHours: 13,
    standHoursGoal: 12,
    distanceKm: 9.6,
    floorsClimbed: 22,
    hourlySteps: [0, 0, 0, 0, 0, 0, 240, 2800, 1300, 900, 550, 950, 1800, 1100, 800, 1050, 850, 300, 200, 0, 0, 0, 0, 0],
  },
  {
    id: 'act_4',
    userId: 'user_demo_01',
    date: getPastDateString(4),
    steps: 8950,
    stepGoal: 10000,
    activeMinutes: 40,
    activeMinutesGoal: 45,
    caloriesBurned: 440,
    calorieGoal: 500,
    standHours: 9,
    standHoursGoal: 12,
    distanceKm: 6.6,
    floorsClimbed: 10,
    hourlySteps: [0, 0, 0, 0, 0, 0, 80, 950, 1100, 500, 400, 700, 1200, 800, 720, 800, 900, 450, 350, 0, 0, 0, 0, 0],
  },
  {
    id: 'act_5',
    userId: 'user_demo_01',
    date: getPastDateString(5),
    steps: 10180,
    stepGoal: 10000,
    activeMinutes: 50,
    activeMinutesGoal: 45,
    caloriesBurned: 530,
    calorieGoal: 500,
    standHours: 11,
    standHoursGoal: 12,
    distanceKm: 7.5,
    floorsClimbed: 15,
    hourlySteps: [0, 0, 0, 0, 0, 0, 150, 1600, 900, 750, 500, 800, 1600, 950, 600, 850, 900, 380, 100, 0, 0, 0, 0, 0],
  },
  {
    id: 'act_6',
    userId: 'user_demo_01',
    date: getPastDateString(6),
    steps: 13400,
    stepGoal: 10000,
    activeMinutes: 80,
    activeMinutesGoal: 45,
    caloriesBurned: 760,
    calorieGoal: 500,
    standHours: 12,
    standHoursGoal: 12,
    distanceKm: 10.1,
    floorsClimbed: 24,
    hourlySteps: [0, 0, 0, 0, 0, 0, 200, 3200, 1400, 1000, 600, 900, 1900, 1200, 900, 1100, 800, 100, 0, 0, 0, 0, 0, 0],
  },
];

// Seed Health Metrics (30-day recent readings)
export const DEFAULT_HEALTH_METRICS: HealthMetric[] = [
  {
    id: 'hm_today',
    userId: 'user_demo_01',
    date: getTodayDateString(),
    heartRate: 68,
    restingHeartRate: 62,
    spo2: 99,
    bloodPressureSystolic: 118,
    bloodPressureDiastolic: 76,
    weight: 73.8,
    bodyFatPercentage: 16.4,
    bmi: 23.3,
  },
  {
    id: 'hm_1',
    userId: 'user_demo_01',
    date: getPastDateString(1),
    heartRate: 70,
    restingHeartRate: 63,
    spo2: 98,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 78,
    weight: 74.0,
    bodyFatPercentage: 16.5,
    bmi: 23.4,
  },
  {
    id: 'hm_3',
    userId: 'user_demo_01',
    date: getPastDateString(3),
    heartRate: 67,
    restingHeartRate: 61,
    spo2: 99,
    bloodPressureSystolic: 117,
    bloodPressureDiastolic: 75,
    weight: 74.2,
    bodyFatPercentage: 16.6,
    bmi: 23.4,
  },
  {
    id: 'hm_7',
    userId: 'user_demo_01',
    date: getPastDateString(7),
    heartRate: 72,
    restingHeartRate: 64,
    spo2: 98,
    bloodPressureSystolic: 121,
    bloodPressureDiastolic: 79,
    weight: 74.5,
    bodyFatPercentage: 16.8,
    bmi: 23.5,
  },
  {
    id: 'hm_14',
    userId: 'user_demo_01',
    date: getPastDateString(14),
    heartRate: 71,
    restingHeartRate: 63,
    spo2: 98,
    bloodPressureSystolic: 119,
    bloodPressureDiastolic: 77,
    weight: 74.9,
    bodyFatPercentage: 17.0,
    bmi: 23.6,
  },
  {
    id: 'hm_21',
    userId: 'user_demo_01',
    date: getPastDateString(21),
    heartRate: 69,
    restingHeartRate: 62,
    spo2: 99,
    bloodPressureSystolic: 122,
    bloodPressureDiastolic: 80,
    weight: 75.3,
    bodyFatPercentage: 17.2,
    bmi: 23.8,
  },
];

// Seed Sleep Records
export const DEFAULT_SLEEP_RECORDS: SleepRecord[] = [
  {
    id: 'sl_today',
    userId: 'user_demo_01',
    date: getTodayDateString(),
    bedtime: '23:10',
    wakeTime: '07:05',
    durationMinutes: 475, // 7h 55m
    qualityScore: 9,
    deepSleepPercent: 22,
    remSleepPercent: 24,
    lightSleepPercent: 49,
    awakeMinutes: 15,
    notes: 'Woke up feeling deeply refreshed and ready for the day.',
  },
  {
    id: 'sl_1',
    userId: 'user_demo_01',
    date: getPastDateString(1),
    bedtime: '23:30',
    wakeTime: '06:50',
    durationMinutes: 440, // 7h 20m
    qualityScore: 8,
    deepSleepPercent: 20,
    remSleepPercent: 22,
    lightSleepPercent: 51,
    awakeMinutes: 20,
    notes: 'Good sleep, woke up briefly around 3am.',
  },
  {
    id: 'sl_2',
    userId: 'user_demo_01',
    date: getPastDateString(2),
    bedtime: '00:05',
    wakeTime: '07:15',
    durationMinutes: 430, // 7h 10m
    qualityScore: 7,
    deepSleepPercent: 18,
    remSleepPercent: 20,
    lightSleepPercent: 54,
    awakeMinutes: 25,
    notes: 'Slightly late bedtime due to reading.',
  },
  {
    id: 'sl_3',
    userId: 'user_demo_01',
    date: getPastDateString(3),
    bedtime: '22:45',
    wakeTime: '07:00',
    durationMinutes: 495, // 8h 15m
    qualityScore: 10,
    deepSleepPercent: 26,
    remSleepPercent: 25,
    lightSleepPercent: 46,
    awakeMinutes: 10,
    notes: 'Exceptional regenerative sleep after outdoor training.',
  },
  {
    id: 'sl_4',
    userId: 'user_demo_01',
    date: getPastDateString(4),
    bedtime: '23:45',
    wakeTime: '06:30',
    durationMinutes: 405, // 6h 45m
    qualityScore: 6,
    deepSleepPercent: 16,
    remSleepPercent: 18,
    lightSleepPercent: 57,
    awakeMinutes: 30,
    notes: 'Slightly restless.',
  },
  {
    id: 'sl_5',
    userId: 'user_demo_01',
    date: getPastDateString(5),
    bedtime: '23:00',
    wakeTime: '07:10',
    durationMinutes: 490, // 8h 10m
    qualityScore: 9,
    deepSleepPercent: 24,
    remSleepPercent: 23,
    lightSleepPercent: 48,
    awakeMinutes: 12,
  },
  {
    id: 'sl_6',
    userId: 'user_demo_01',
    date: getPastDateString(6),
    bedtime: '23:20',
    wakeTime: '07:00',
    durationMinutes: 460, // 7h 40m
    qualityScore: 8,
    deepSleepPercent: 21,
    remSleepPercent: 22,
    lightSleepPercent: 50,
    awakeMinutes: 18,
  },
];

// Seed Nutrition
export const DEFAULT_NUTRITION_DAYS: NutritionDay[] = [
  {
    id: 'nut_today',
    userId: 'user_demo_01',
    date: getTodayDateString(),
    calorieTarget: 2200,
    waterCups: 8, // 8/10
    waterTargetCups: 10,
    caffeineMg: 160,
    meals: [
      {
        id: 'm_1',
        name: 'Oatmeal with Blueberries & Whey',
        calories: 460,
        proteinGrams: 32,
        carbsGrams: 58,
        fatGrams: 10,
        fiberGrams: 9,
        category: 'Breakfast',
        time: '08:15',
      },
      {
        id: 'm_2',
        name: 'Grilled Salmon with Quinoa & Asparagus',
        calories: 620,
        proteinGrams: 48,
        carbsGrams: 42,
        fatGrams: 24,
        fiberGrams: 7,
        category: 'Lunch',
        time: '13:00',
      },
      {
        id: 'm_3',
        name: 'Greek Yogurt & Almonds',
        calories: 220,
        proteinGrams: 18,
        carbsGrams: 12,
        fatGrams: 11,
        fiberGrams: 3,
        category: 'Snack',
        time: '16:30',
      },
      {
        id: 'm_4',
        name: 'Chicken Breast Stir-Fry with Brown Rice',
        calories: 550,
        proteinGrams: 44,
        carbsGrams: 55,
        fatGrams: 12,
        fiberGrams: 6,
        category: 'Dinner',
        time: '19:45',
      },
    ],
  },
  {
    id: 'nut_1',
    userId: 'user_demo_01',
    date: getPastDateString(1),
    calorieTarget: 2200,
    waterCups: 10,
    waterTargetCups: 10,
    caffeineMg: 200,
    meals: [
      {
        id: 'm_1_1',
        name: 'Avocado Toast with 2 Poached Eggs',
        calories: 480,
        proteinGrams: 24,
        carbsGrams: 38,
        fatGrams: 26,
        fiberGrams: 8,
        category: 'Breakfast',
        time: '08:30',
      },
      {
        id: 'm_1_2',
        name: 'Turkey Whole Grain Wrap with Greens',
        calories: 540,
        proteinGrams: 40,
        carbsGrams: 48,
        fatGrams: 18,
        fiberGrams: 6,
        category: 'Lunch',
        time: '12:45',
      },
      {
        id: 'm_1_3',
        name: 'Lean Beef Sirloin with Sweet Potato',
        calories: 680,
        proteinGrams: 52,
        carbsGrams: 60,
        fatGrams: 22,
        fiberGrams: 7,
        category: 'Dinner',
        time: '19:30',
      },
    ],
  },
];

// Seed Stress & Mood Logs
export const DEFAULT_STRESS_LOGS: StressLog[] = [
  {
    id: 'str_today',
    userId: 'user_demo_01',
    date: getTodayDateString(),
    time: '14:20',
    stressLevel: 3,
    mood: 'Great',
    notes: 'Completed workout early and feeling productive!',
    meditationMinutes: 10,
  },
  {
    id: 'str_1',
    userId: 'user_demo_01',
    date: getPastDateString(1),
    time: '18:10',
    stressLevel: 4,
    mood: 'Good',
    notes: 'Steady workday, calm evening.',
    meditationMinutes: 15,
  },
  {
    id: 'str_2',
    userId: 'user_demo_01',
    date: getPastDateString(2),
    time: '16:00',
    stressLevel: 6,
    mood: 'Okay',
    notes: 'Busy afternoon deadline.',
    meditationMinutes: 5,
  },
  {
    id: 'str_3',
    userId: 'user_demo_01',
    date: getPastDateString(3),
    time: '15:30',
    stressLevel: 2,
    mood: 'Great',
    notes: 'Weekend vibe, relaxed and centered.',
    meditationMinutes: 20,
  },
  {
    id: 'str_4',
    userId: 'user_demo_01',
    date: getPastDateString(4),
    time: '19:00',
    stressLevel: 5,
    mood: 'Good',
    meditationMinutes: 10,
  },
  {
    id: 'str_5',
    userId: 'user_demo_01',
    date: getPastDateString(5),
    time: '17:30',
    stressLevel: 4,
    mood: 'Good',
    meditationMinutes: 10,
  },
  {
    id: 'str_6',
    userId: 'user_demo_01',
    date: getPastDateString(6),
    time: '20:10',
    stressLevel: 3,
    mood: 'Great',
    meditationMinutes: 15,
  },
];

// Seed Medications
export const DEFAULT_MEDICATIONS: Medication[] = [
  {
    id: 'med_1',
    userId: 'user_demo_01',
    name: 'Omega-3 Fish Oil',
    dosage: '1000 mg',
    schedule: ['Morning'],
    instructions: 'Take with breakfast and plenty of water',
    takenToday: {
      Morning: true,
    },
    startDate: '2025-01-01',
  },
  {
    id: 'med_2',
    userId: 'user_demo_01',
    name: 'Vitamin D3 + K2',
    dosage: '5000 IU',
    schedule: ['Morning'],
    instructions: 'Take with healthy fats',
    takenToday: {
      Morning: true,
    },
    startDate: '2025-01-01',
  },
  {
    id: 'med_3',
    userId: 'user_demo_01',
    name: 'Magnesium Glycinate',
    dosage: '400 mg',
    schedule: ['Bedtime'],
    instructions: 'Take 30 minutes before sleep for muscle relaxation',
    takenToday: {
      Bedtime: false,
    },
    startDate: '2025-01-05',
  },
];

// Storage Initialization
export const initLocalStorage = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
    localStorage.setItem(STORAGE_KEYS.TOKEN, 'jwt_simulated_token_demo_user');
  }
  if (!localStorage.getItem(STORAGE_KEYS.WORKOUTS)) {
    localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(DEFAULT_WORKOUTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(DEFAULT_ACTIVITIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.HEALTH_METRICS)) {
    localStorage.setItem(STORAGE_KEYS.HEALTH_METRICS, JSON.stringify(DEFAULT_HEALTH_METRICS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SLEEP_RECORDS)) {
    localStorage.setItem(STORAGE_KEYS.SLEEP_RECORDS, JSON.stringify(DEFAULT_SLEEP_RECORDS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NUTRITION_DAYS)) {
    localStorage.setItem(STORAGE_KEYS.NUTRITION_DAYS, JSON.stringify(DEFAULT_NUTRITION_DAYS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.STRESS_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.STRESS_LOGS, JSON.stringify(DEFAULT_STRESS_LOGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MEDICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(DEFAULT_MEDICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CHALLENGES)) {
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(DEFAULT_CHALLENGES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS)) {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(DEFAULT_ACHIEVEMENTS));
  }
};

// Generic storage getters & setters
export const getStoredItem = <T>(key: string, defaultValue: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setStoredItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage set failed', err);
  }
};

export { STORAGE_KEYS };

// Helper calculations
export const calculateBMI = (weightKg: number, heightCm: number) => {
  if (!weightKg || !heightCm) return { bmi: 0, category: 'Unknown', color: 'gray' };
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  let category = 'Normal';
  let color = 'emerald';
  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'amber';
  } else if (bmi >= 18.5 && bmi < 25) {
    category = 'Normal';
    color = 'emerald';
  } else if (bmi >= 25 && bmi < 30) {
    category = 'Overweight';
    color = 'orange';
  } else {
    category = 'Obese';
    color = 'rose';
  }
  return { bmi, category, color };
};

// MET values for standard activities
export const MET_VALUES: Record<WorkoutType, number> = {
  Running: 9.8,
  Walking: 3.5,
  Cycling: 7.5,
  Gym: 5.5,
  Yoga: 3.0,
  Swimming: 8.0,
  HIIT: 9.0,
  Other: 5.0,
};

export const estimateCaloriesBurned = (type: WorkoutType, durationMins: number, weightKg: number = 70): number => {
  const met = MET_VALUES[type] || 5.0;
  // Calories = MET * weight(kg) * (duration in mins / 60)
  return Math.round(met * weightKg * (durationMins / 60));
};

// Composite Daily Health Score (0 to 100)
export const calculateDailyHealthScore = (
  activity: DailyActivity | undefined,
  sleep: SleepRecord | undefined,
  nutrition: NutritionDay | undefined,
  metric: HealthMetric | undefined
): { score: number; label: string; tips: string[] } => {
  let totalScore = 0;
  const tips: string[] = [];

  // 1. Steps & Movement (30 pts)
  if (activity) {
    const stepRatio = Math.min(activity.steps / (activity.stepGoal || 10000), 1.2);
    const stepPoints = Math.round(Math.min(stepRatio * 20, 20));
    const activePoints = Math.round(Math.min((activity.activeMinutes / 45) * 10, 10));
    totalScore += stepPoints + activePoints;
    if (activity.steps < activity.stepGoal) {
      tips.push(`Walk ${(activity.stepGoal - activity.steps).toLocaleString()} more steps to achieve your daily target.`);
    }
  } else {
    totalScore += 15;
  }

  // 2. Sleep Quality & Rest (25 pts)
  if (sleep) {
    const sleepQualityPoints = Math.round((sleep.qualityScore / 10) * 15);
    const sleepDurationHours = sleep.durationMinutes / 60;
    const durationPoints = sleepDurationHours >= 7 && sleepDurationHours <= 9 ? 10 : 6;
    totalScore += sleepQualityPoints + durationPoints;
    if (sleep.qualityScore < 7) {
      tips.push('Aim for an earlier bedtime to enhance deep and REM sleep restoration.');
    }
  } else {
    totalScore += 18;
  }

  // 3. Hydration & Nutrition (25 pts)
  if (nutrition) {
    const waterRatio = Math.min(nutrition.waterCups / (nutrition.waterTargetCups || 10), 1);
    const waterPoints = Math.round(waterRatio * 15);
    const mealPoints = nutrition.meals.length >= 3 ? 10 : nutrition.meals.length * 3;
    totalScore += waterPoints + mealPoints;
    if (nutrition.waterCups < (nutrition.waterTargetCups || 10)) {
      tips.push(`Drink ${nutrition.waterTargetCups - nutrition.waterCups} more glasses of water to complete hydration.`);
    }
  } else {
    totalScore += 15;
  }

  // 4. Vitals & Resting Heart Rate (20 pts)
  if (metric) {
    let vitalsPoints = 12;
    if (metric.restingHeartRate <= 70) vitalsPoints += 4;
    if (metric.spo2 >= 97) vitalsPoints += 4;
    totalScore += vitalsPoints;
  } else {
    totalScore += 16;
  }

  const finalScore = Math.min(Math.max(totalScore, 10), 100);

  let label = 'Fair';
  if (finalScore >= 85) label = 'Optimal';
  else if (finalScore >= 70) label = 'Good';
  else if (finalScore >= 55) label = 'Fair';
  else label = 'Needs Focus';

  if (tips.length === 0) {
    tips.push('You are smashing all health benchmarks today! Keep up the momentum.');
  }

  return { score: finalScore, label, tips };
};

// Export to JSON
export const exportHealthDataJSON = () => {
  const exportData = {
    exportedAt: new Date().toISOString(),
    user: getStoredItem(STORAGE_KEYS.CURRENT_USER, null),
    activities: getStoredItem(STORAGE_KEYS.ACTIVITIES, []),
    workouts: getStoredItem(STORAGE_KEYS.WORKOUTS, []),
    healthMetrics: getStoredItem(STORAGE_KEYS.HEALTH_METRICS, []),
    sleepRecords: getStoredItem(STORAGE_KEYS.SLEEP_RECORDS, []),
    nutrition: getStoredItem(STORAGE_KEYS.NUTRITION_DAYS, []),
    stressLogs: getStoredItem(STORAGE_KEYS.STRESS_LOGS, []),
    medications: getStoredItem(STORAGE_KEYS.MEDICATIONS, []),
    challenges: getStoredItem(STORAGE_KEYS.CHALLENGES, []),
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SmartFit_Health_Export_${getTodayDateString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

// Export Workouts to CSV
export const exportWorkoutsCSV = () => {
  const workouts: Workout[] = getStoredItem(STORAGE_KEYS.WORKOUTS, []);
  if (!workouts.length) return;

  const headers = ['ID', 'Date', 'Type', 'Duration (mins)', 'Calories Burned', 'Distance (km)', 'Heart Rate (bpm)', 'Intensity', 'Notes'];
  const rows = workouts.map(w => [
    w.id,
    w.date,
    w.type,
    w.durationMinutes,
    w.caloriesBurned,
    w.distanceKm ?? '',
    w.avgHeartRate ?? '',
    w.intensity,
    `"${(w.notes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `SmartFit_Workouts_${getTodayDateString()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
