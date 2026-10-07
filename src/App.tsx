import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FitnessProvider, useFitness } from './context/FitnessContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/ToastContainer';
import { BreathingExerciseModal } from './components/BreathingExerciseModal';
import { LiveWorkoutModal } from './components/LiveWorkoutModal';
import { ExportModal } from './components/ExportModal';
import { AuthModal } from './components/AuthModal';

import { DashboardView } from './views/DashboardView';
import { ActivityView } from './views/ActivityView';
import { WorkoutsView } from './views/WorkoutsView';
import { HealthMetricsView } from './views/HealthMetricsView';
import { SleepView } from './views/SleepView';
import { NutritionView } from './views/NutritionView';
import { MentalHealthView } from './views/MentalHealthView';
import { MedicationsView } from './views/MedicationsView';
import { ChallengesView } from './views/ChallengesView';
import { AdminView } from './views/AdminView';
import { ProfileView } from './views/ProfileView';

const FitnessAppContent: React.FC = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // If user tries to open admin tab but is not admin, fallback to dashboard
  const currentTab = activeTab === 'admin' && !isAdmin ? 'dashboard' : activeTab;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onNavigateToTab={(tab) => setActiveTab(tab)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar Navigation */}
        <Sidebar activeTab={currentTab} setActiveTab={setActiveTab} />

        {/* Content View Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {currentTab === 'dashboard' && <DashboardView onNavigate={(tab) => setActiveTab(tab)} />}
          {currentTab === 'activity' && <ActivityView />}
          {currentTab === 'workouts' && <WorkoutsView />}
          {currentTab === 'health' && <HealthMetricsView />}
          {currentTab === 'sleep' && <SleepView />}
          {currentTab === 'nutrition' && <NutritionView />}
          {currentTab === 'mental' && <MentalHealthView />}
          {currentTab === 'medications' && <MedicationsView />}
          {currentTab === 'challenges' && <ChallengesView />}
          {currentTab === 'admin' && <AdminView />}
          {currentTab === 'profile' && <ProfileView />}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <BreathingExerciseModal />
      <LiveWorkoutModal />
      <ExportModal />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <FitnessProvider>
        <FitnessAppContent />
      </FitnessProvider>
    </AuthProvider>
  );
}
