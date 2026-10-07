import React, { useState } from 'react';
import {
  Moon,
  Clock,
  Sparkles,
  Plus,
  Calendar,
  CheckCircle2,
  Bed,
  Sun,
  ShieldCheck,
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';

export const SleepView: React.FC = () => {
  const { currentSleep, sleepHistory, logSleep } = useFitness();

  const [isLogFormOpen, setIsLogFormOpen] = useState(false);

  // Form State
  const [bedtime, setBedtime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('07:00');
  const [qualityScore, setQualityScore] = useState<number>(8);
  const [deepPercent, setDeepPercent] = useState<number>(22);
  const [remPercent, setRemPercent] = useState<number>(24);
  const [lightPercent, setLightPercent] = useState<number>(50);
  const [notes, setNotes] = useState('');

  // Auto calculate duration in minutes
  const calcMinutes = (start: string, end: string): number => {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    let sTotal = sh * 60 + sm;
    let eTotal = eh * 60 + em;
    if (eTotal < sTotal) {
      eTotal += 24 * 60; // Next day
    }
    return eTotal - sTotal;
  };

  const currentDurationMins = calcMinutes(bedtime, wakeTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logSleep({
      bedtime,
      wakeTime,
      durationMinutes: currentDurationMins,
      qualityScore,
      deepSleepPercent: deepPercent,
      remSleepPercent: remPercent,
      lightSleepPercent: lightPercent,
      awakeMinutes: 15,
      notes: notes.trim() || undefined,
    });
    setIsLogFormOpen(false);
  };

  const weeklyReversed = [...sleepHistory].slice(0, 7).reverse();

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-wider mb-1">
            <Moon size={16} />
            <span>Circadian Rhythm & Recovery</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Sleep Tracker</h1>
          <p className="text-xs text-slate-500">
            Monitor nocturnal recovery phases, deep sleep restoration, and circadian regularity.
          </p>
        </div>

        <button
          onClick={() => setIsLogFormOpen(!isLogFormOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/25 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Log Last Night's Sleep</span>
        </button>
      </div>

      {/* Primary Sleep Score & Phase Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Night Summary */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-500" />
              <span>Last Night's Sleep Analysis</span>
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              Score: {currentSleep.qualityScore} / 10
            </span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-xs text-slate-400">Total Duration</span>
              <div className="text-4xl font-black text-slate-900 dark:text-white mt-0.5">
                {Math.floor(currentSleep.durationMinutes / 60)}h {currentSleep.durationMinutes % 60}m
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="text-xs text-slate-500 flex items-center justify-end gap-1.5">
                <Bed size={14} className="text-slate-400" />
                <span>Bedtime: <strong>{currentSleep.bedtime}</strong></span>
              </div>
              <div className="text-xs text-slate-500 flex items-center justify-end gap-1.5">
                <Sun size={14} className="text-amber-500" />
                <span>Woke up: <strong>{currentSleep.wakeTime}</strong></span>
              </div>
            </div>
          </div>

          {/* Sleep Stages Multi-Bar */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Sleep Stages Breakdown</span>
              <span>100% Monitored</span>
            </div>

            <div className="h-5 rounded-xl overflow-hidden flex shadow-inner">
              <div
                style={{ width: `${currentSleep.deepSleepPercent}%` }}
                className="bg-indigo-700 h-full"
                title={`Deep Sleep: ${currentSleep.deepSleepPercent}%`}
              />
              <div
                style={{ width: `${currentSleep.remSleepPercent}%` }}
                className="bg-purple-500 h-full"
                title={`REM Sleep: ${currentSleep.remSleepPercent}%`}
              />
              <div
                style={{ width: `${currentSleep.lightSleepPercent}%` }}
                className="bg-indigo-300 dark:bg-indigo-400 h-full"
                title={`Light Sleep: ${currentSleep.lightSleepPercent}%`}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Deep</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{currentSleep.deepSleepPercent}%</span>
              </div>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">REM</span>
                <span className="font-bold text-purple-600 dark:text-purple-400">{currentSleep.remSleepPercent}%</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Light</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{currentSleep.lightSleepPercent}%</span>
              </div>
            </div>
          </div>

          {currentSleep.notes && (
            <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              "{currentSleep.notes}"
            </p>
          )}
        </div>

        {/* Weekly Sleep Analytics Chart */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock size={16} className="text-indigo-500" />
                <span>7-Day Sleep Duration vs 8h Target</span>
              </h2>
              <span className="text-xs text-emerald-500 font-semibold">Target: 8.0 hrs</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Nightly hours slept</p>
          </div>

          <div className="h-44 flex items-end justify-between gap-2 px-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            {weeklyReversed.map((s) => {
              const hours = s.durationMinutes / 60;
              const heightPct = Math.min((hours / 9) * 100, 100);
              const dateObj = new Date(s.date);
              const day = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

              return (
                <div key={s.id} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded shadow z-10 whitespace-nowrap">
                    {hours.toFixed(1)} hrs • Score {s.qualityScore}/10
                  </div>
                  <div className="w-full max-w-[32px] bg-slate-100 dark:bg-slate-800 h-32 rounded-t-md flex items-end">
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        hours >= 7
                          ? 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                          : 'bg-gradient-to-t from-amber-600 to-amber-400'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">{day}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Average: 7.6 hrs/night</span>
            <span className="text-indigo-500 font-semibold flex items-center gap-1">
              <ShieldCheck size={14} /> High Recovery
            </span>
          </div>
        </div>
      </div>

      {/* Log Form Expandable */}
      {isLogFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Moon size={16} className="text-indigo-500" />
              <span>Log Sleep Record</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsLogFormOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Bedtime</label>
              <input
                type="time"
                required
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Wake Up Time</label>
              <input
                type="time"
                required
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Quality Score (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                required
                value={qualityScore}
                onChange={(e) => setQualityScore(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Deep Sleep (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={deepPercent}
                onChange={(e) => setDeepPercent(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">REM Sleep (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={remPercent}
                onChange={(e) => setRemPercent(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Light Sleep (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={lightPercent}
                onChange={(e) => setLightPercent(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Sleep Notes</label>
            <input
              type="text"
              placeholder="e.g. Slept through the night without interruptions"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="p-3 bg-indigo-500/10 rounded-xl text-xs text-indigo-400">
            Duration calculated: {Math.floor(currentDurationMins / 60)}h {currentDurationMins % 60}m
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-indigo-600/25 cursor-pointer"
          >
            Save Sleep Record
          </button>
        </form>
      )}

      {/* Sleep Hygiene Tips */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          <span>Samsung Health Sleep Architecture Recommendations</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-indigo-500 block mb-1">Optimal Temperature</span>
            Keep bedroom between 18-20°C (65-68°F) to trigger body temperature drop necessary for deep sleep.
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-indigo-500 block mb-1">Blue Light Cutoff</span>
            Limit screen exposure 60 minutes prior to bedtime to maximize natural melatonin release.
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-indigo-500 block mb-1">Circadian Regularity</span>
            Maintain consistent wake times (within 30 mins) on weekends to prevent social jetlag.
          </div>
        </div>
      </div>
    </div>
  );
};
