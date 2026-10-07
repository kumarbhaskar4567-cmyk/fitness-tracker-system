# 💪 Smart FITNESS Tracker

A full-stack health and fitness tracking web application inspired by Samsung Health, built with React.js frontend, Node.js + Express backend, MongoDB database, and JWT authentication.

---

## 🌟 Features

### 🔐 Authentication
- User registration with profile details (name, email, age, gender, height, weight)
- JWT-based login / logout
- Password encryption with bcrypt
- Forgot password flow
- Demo account for quick access
- Admin panel for role-based access

### 📊 Dashboard
- Daily health score
- Live metrics: Steps, Calories, Heart Rate, Sleep, Water, Weight
- Activity rings visualization (Move / Exercise / Stand)
- Weekly activity bar charts
- Recent workouts list
- Health trend line charts

### 👟 Activity Tracker
- Step counter with goal progress
- Distance, floors climbed, calories, active minutes
- Simulate steps or manual entry
- Hourly activity breakdown chart
- 7-day step history

### 🏋️ Workout Tracker
- Log 8 workout types: Running, Walking, Cycling, Gym, Yoga, Swimming, HIIT, Other
- Track duration, calories, distance, avg speed, heart rate, intensity
- Auto-calculate workout metrics
- Full workout history
- Workout type distribution donut chart

### ❤️ Body Health Monitor
- Heart rate, SpO2, blood pressure
- BMI calculator with visual scale
- Body fat percentage, weight tracker
- 30-day health metrics trend charts

### 😴 Sleep Tracker
- Log bedtime and wake time
- Sleep quality score (1–10)
- Deep sleep, REM tracking
- Weekly sleep analytics bar/line chart

### 🥗 Nutrition Tracker
- Calorie intake with donut chart
- Macro tracking: Protein, Carbs, Fat, Fiber
- Meal logging: Breakfast, Lunch, Dinner, Snack
- Water intake tracker (10-glass cup system)
- Caffeine tracking

### 🧘 Mental Health
- Stress level slider (1–10)
- Mood logging (Great / Good / Okay / Bad / Terrible)
- 4-7-8 Breathing exercise with animated timer
- Meditation session tracker
- 7-day mood & stress trend chart

### 💊 Medications
- Add medications with dosage and schedule
- Mark medications as taken
- Adherence tracking chart

### 🏆 Social Challenges
- 7-day activity streak tracker
- Achievement badges (earned & locked)
- Weekly step leaderboard
- Active challenges with progress bars
- Create custom challenges

### ⚙️ Admin Panel
- Platform statistics (total users, active, workouts, challenges)
- User management table
- Platform growth chart
- Remove inactive accounts

---

## 🗂 Project Structure

```
smart-fitness-tracker/
├── frontend/
│   └── index.html              # Complete single-file frontend
├── backend/
│   ├── server.js               # Express app entry point
│   ├── package.json
│   ├── .env.example
│   ├── models/
│   │   └── index.js            # All MongoDB schemas (User, Activity, Workout, Sleep, Nutrition, HealthMetrics, StressLog, Medication, Challenge)
│   ├── routes/
│   │   ├── auth.js             # Register, Login, Profile, Forgot Password
│   │   ├── activities.js       # CRUD for daily activity
│   │   ├── workouts.js         # Log & fetch workouts
│   │   ├── sleep.js            # Sleep data
│   │   ├── nutrition.js        # Meal & water logging
│   │   ├── health.js           # Health metrics
│   │   ├── stress.js           # Stress & mood logs
│   │   ├── medications.js      # Medication management
│   │   ├── challenges.js       # Community challenges
│   │   └── admin.js            # Admin-only routes
│   └── middleware/
│       └── auth.js             # JWT protect & adminOnly middleware
└── README.md
```

---

## 🚀 Quick Start

### 1. Open the Frontend (No Setup Required)
Simply open the web app. Everything runs locally with `localStorage` and instant reactivity.

**Demo credentials:**
- Email: `demo@smartfit.com` | Password: `demo123`
- Admin: `admin@smartfit.com` | Password: `admin123`

Or click **"Try Demo Account"** or **"Try Admin Account"** on the login modal or user menu.

---

### 2. Run the Full Backend (Optional)

#### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

#### Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

npm run dev    # Development with nodemon
npm start      # Production
```

#### `.env` Configuration
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smart-fitness-tracker
JWT_SECRET=your_super_secret_jwt_key_here
CLIENT_URL=http://localhost:3000
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with JWT |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| POST | `/api/auth/forgot-password` | Send reset email |

### Activities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/activities` | Get today's activity |
| POST | `/api/activities` | Log activity |
| GET | `/api/activities/history` | 7-day history |

### Workouts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workouts` | List workouts |
| POST | `/api/workouts` | Log workout |
| DELETE | `/api/workouts/:id` | Delete workout |

### Health Metrics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Get metrics |
| POST | `/api/health` | Save reading |

### Sleep
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sleep` | Get sleep data |
| POST | `/api/sleep` | Log sleep |

### Nutrition
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/nutrition/today` | Today's nutrition |
| POST | `/api/nutrition/meal` | Add meal |
| PUT | `/api/nutrition/water` | Update water intake |

### Admin (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | All users |
| GET | `/api/admin/stats` | Platform statistics |
| DELETE | `/api/admin/users/:id` | Remove user |

---

## 🗄 Database Collections

| Collection | Purpose |
|-----------|---------|
| `users` | Profiles, auth, health baseline |
| `activities` | Daily steps, distance, floors |
| `workouts` | Logged exercise sessions |
| `sleepdata` | Nightly sleep records |
| `nutrition` | Meals, macros, water |
| `healthmetrics` | HR, SpO2, BP, weight, BMI |
| `stresslogs` | Mood, stress, meditation |
| `medications` | Meds, schedules, adherence |
| `challenges` | Community fitness challenges |

---

## 📱 Features

- ✅ Dark / Light mode toggle
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Data export (JSON, CSV, PDF)
- ✅ LocalStorage persistence (frontend-only mode)
- ✅ Smooth animations & transitions
- ✅ Toast notifications
- ✅ Admin panel
- ✅ Achievement badges & streaks
- ✅ Breathing exercise timer
- ✅ BMI calculator

---

© 2025 Smart FITNESS Tracker
