const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    age: { type: Number, default: 25 },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
    height: { type: Number, default: 170 }, // cm
    weight: { type: Number, default: 70 }, // kg
    targetWeight: { type: Number, default: 68 },
    stepGoal: { type: Number, default: 10000 },
    calorieGoal: { type: Number, default: 500 },
    waterGoalCups: { type: Number, default: 10 },
    sleepGoalHours: { type: Number, default: 8 },
    avatar: { type: String },
  },
  { timestamps: true }
);

const ActivitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    steps: { type: Number, default: 0 },
    stepGoal: { type: Number, default: 10000 },
    activeMinutes: { type: Number, default: 0 },
    activeMinutesGoal: { type: Number, default: 45 },
    caloriesBurned: { type: Number, default: 0 },
    calorieGoal: { type: Number, default: 500 },
    standHours: { type: Number, default: 0 },
    standHoursGoal: { type: Number, default: 12 },
    distanceKm: { type: Number, default: 0 },
    floorsClimbed: { type: Number, default: 0 },
    hourlySteps: { type: [Number], default: new Array(24).fill(0) },
  },
  { timestamps: true }
);

const WorkoutSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['Running', 'Walking', 'Cycling', 'Gym', 'Yoga', 'Swimming', 'HIIT', 'Other'],
      required: true,
    },
    durationMinutes: { type: Number, required: true },
    caloriesBurned: { type: Number, required: true },
    distanceKm: { type: Number },
    avgSpeedKmh: { type: Number },
    avgHeartRate: { type: Number },
    intensity: { type: String, enum: ['Low', 'Medium', 'High', 'Extreme'], default: 'Medium' },
    notes: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const SleepSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    bedtime: { type: String, required: true },
    wakeTime: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    qualityScore: { type: Number, min: 1, max: 10, default: 8 },
    deepSleepPercent: { type: Number, default: 20 },
    remSleepPercent: { type: Number, default: 22 },
    lightSleepPercent: { type: Number, default: 52 },
    awakeMinutes: { type: Number, default: 15 },
    notes: { type: String },
  },
  { timestamps: true }
);

const MealItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  proteinGrams: { type: Number, default: 0 },
  carbsGrams: { type: Number, default: 0 },
  fatGrams: { type: Number, default: 0 },
  fiberGrams: { type: Number, default: 0 },
  category: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], required: true },
  time: { type: String },
});

const NutritionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    calorieTarget: { type: Number, default: 2200 },
    meals: [MealItemSchema],
    waterCups: { type: Number, default: 0 },
    waterTargetCups: { type: Number, default: 10 },
    caffeineMg: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const HealthMetricSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    heartRate: { type: Number, required: true },
    restingHeartRate: { type: Number, default: 65 },
    spo2: { type: Number, default: 98 },
    bloodPressureSystolic: { type: Number, default: 120 },
    bloodPressureDiastolic: { type: Number, default: 80 },
    weight: { type: Number, required: true },
    bodyFatPercentage: { type: Number },
    bmi: { type: Number },
  },
  { timestamps: true }
);

const StressLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    time: { type: String },
    stressLevel: { type: Number, min: 1, max: 10, default: 4 },
    mood: { type: String, enum: ['Great', 'Good', 'Okay', 'Bad', 'Terrible'], default: 'Good' },
    notes: { type: String },
    meditationMinutes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const MedicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    schedule: [{ type: String, enum: ['Morning', 'Afternoon', 'Evening', 'Bedtime'] }],
    instructions: { type: String },
    takenToday: {
      Morning: { type: Boolean, default: false },
      Afternoon: { type: Boolean, default: false },
      Evening: { type: Boolean, default: false },
      Bedtime: { type: Boolean, default: false },
    },
    startDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  },
  { timestamps: true }
);

const ChallengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Steps', 'Workouts', 'Hydration', 'Sleep', 'Mindfulness'],
      default: 'Steps',
    },
    targetValue: { type: Number, required: true },
    currentValue: { type: Number, default: 0 },
    unit: { type: String, default: 'steps' },
    endDate: { type: String },
    rewardBadge: { type: String, default: '🏆 Trophy' },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = {
  User: mongoose.model('User', UserSchema),
  Activity: mongoose.model('Activity', ActivitySchema),
  Workout: mongoose.model('Workout', WorkoutSchema),
  Sleep: mongoose.model('Sleep', SleepSchema),
  Nutrition: mongoose.model('Nutrition', NutritionSchema),
  HealthMetric: mongoose.model('HealthMetric', HealthMetricSchema),
  StressLog: mongoose.model('StressLog', StressLogSchema),
  Medication: mongoose.model('Medication', MedicationSchema),
  Challenge: mongoose.model('Challenge', ChallengeSchema),
};
