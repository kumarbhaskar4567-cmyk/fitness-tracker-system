import React from 'react';
import { X, FileJson, FileSpreadsheet, Printer, Download, CheckCircle } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { useAuth } from '../context/AuthContext';
import { exportHealthDataJSON, exportWorkoutsCSV, getTodayDateString } from '../utils/storage';

export const ExportModal: React.FC = () => {
  const { isExportModalOpen, setIsExportModalOpen, todayActivity, currentSleep, currentMetric } = useFitness();
  const { user } = useAuth();

  if (!isExportModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
        <button
          onClick={() => setIsExportModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 text-indigo-500 mb-1">
          <Download size={20} />
          <span className="text-xs font-bold uppercase tracking-wider">Health Data Export</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Export Records</h2>
        <p className="text-xs text-slate-500 mb-6">
          Download your complete activity, workouts, biometric readings, and nutrition logs.
        </p>

        {/* Quick Snapshot */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 mb-6 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Subject</span>
            <span className="font-semibold text-slate-900 dark:text-white">{user?.name}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Date Range</span>
            <span className="font-semibold text-slate-900 dark:text-white">Up to {getTodayDateString()}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Today’s Summary</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {todayActivity.steps.toLocaleString()} steps • {Math.round(currentSleep.durationMinutes / 60)}h rest • HR {currentMetric.heartRate} bpm
            </span>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="space-y-3">
          <button
            onClick={exportHealthDataJSON}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FileJson size={22} className="text-indigo-500" />
              <div className="text-left">
                <div className="text-sm font-semibold">Complete JSON Archive</div>
                <div className="text-xs opacity-75">All workouts, vitals, nutrition & activities</div>
              </div>
            </div>
            <Download size={18} />
          </button>

          <button
            onClick={exportWorkoutsCSV}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet size={22} className="text-emerald-500" />
              <div className="text-left">
                <div className="text-sm font-semibold">Workout History (CSV)</div>
                <div className="text-xs opacity-75">Excel / Sheets compatible workout log</div>
              </div>
            </div>
            <Download size={18} />
          </button>

          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Printer size={22} className="text-slate-500 dark:text-slate-400" />
              <div className="text-left">
                <div className="text-sm font-semibold">Print / PDF Health Report</div>
                <div className="text-xs opacity-75">Formatted clinical / personal summary</div>
              </div>
            </div>
            <Download size={18} />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <CheckCircle size={14} className="text-emerald-500" />
          <span>Local client-side encryption & zero data telemetry</span>
        </div>
      </div>
    </div>
  );
};
