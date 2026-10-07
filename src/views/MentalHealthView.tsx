import React, { useState } from 'react';
import {
  Brain,
  Wind,
  Sparkles,
  Smile,
  Meh,
  Frown,
  Timer,
  Play,
  Heart,
  TrendingDown,
  Calendar,
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { MoodType } from '../types';

export const MentalHealthView: React.FC = () => {
  const {
    todayStressLog,
    stressHistory,
    logStressAndMood,
    logMeditation,
    setIsBreathingModalOpen,
  } = useFitness();

  const [stressLevel, setStressLevel] = useState<number>(todayStressLog?.stressLevel || 4);
  const [selectedMood, setSelectedMood] = useState<MoodType>(todayStressLog?.mood || 'Good');
  const [moodNote, setMoodNote] = useState<string>(todayStressLog?.notes || '');

  // Meditation timer state
  const [customMedMinutes, setCustomMedMinutes] = useState<number>(10);
  const [isMeditating, setIsMeditating] = useState(false);
  const [medSecondsLeft, setMedSecondsLeft] = useState(10 * 60);

  const handleSaveCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    logStressAndMood(stressLevel, selectedMood, moodNote);
  };

  const startMeditation = (minutes: number) => {
    setCustomMedMinutes(minutes);
    setMedSecondsLeft(minutes * 60);
    setIsMeditating(true);
  };

  React.useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isMeditating) {
      timer = setInterval(() => {
        setMedSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsMeditating(false);
            logMeditation(customMedMinutes);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isMeditating, customMedMinutes, logMeditation]);

  const moodsList: { type: MoodType; emoji: string; label: string }[] = [
    { type: 'Great', emoji: '😄', label: 'Great' },
    { type: 'Good', emoji: '🙂', label: 'Good' },
    { type: 'Okay', emoji: '😐', label: 'Okay' },
    { type: 'Bad', emoji: '🙁', label: 'Bad' },
    { type: 'Terrible', emoji: '😫', label: 'Terrible' },
  ];

  let stressCategory = 'Low Stress';
  let stressColor = 'text-emerald-500';
  if (stressLevel >= 8) {
    stressCategory = 'Severe Stress - Action Recommended';
    stressColor = 'text-rose-500';
  } else if (stressLevel >= 6) {
    stressCategory = 'Elevated Stress';
    stressColor = 'text-amber-500';
  } else if (stressLevel >= 4) {
    stressCategory = 'Moderate Stress';
    stressColor = 'text-indigo-400';
  }

  const formatMedTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-indigo-500 text-xs font-bold uppercase tracking-wider mb-1">
            <Brain size={16} />
            <span>Mindfulness & Neuro-Regulation</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Mental Health & Mood</h1>
          <p className="text-xs text-slate-500">
            Regulate autonomic arousal with 4-7-8 breathing, log subjective stress, and meditate.
          </p>
        </div>

        <button
          onClick={() => setIsBreathingModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/25 cursor-pointer self-start sm:self-auto"
        >
          <Wind size={16} />
          <span>Launch 4-7-8 Breathing Guide</span>
        </button>
      </div>

      {/* Daily Mindful Check-in & Stress Slider */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mood & Stress Logging Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Smile size={16} className="text-indigo-500" />
              <span>Daily Mental Health Check-in</span>
            </h2>
            {todayStressLog && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold">
                Logged at {todayStressLog.time}
              </span>
            )}
          </div>

          <form onSubmit={handleSaveCheckin} className="space-y-5">
            {/* Mood Emoji Select */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                How are you feeling emotionally right now?
              </label>
              <div className="grid grid-cols-5 gap-2">
                {moodsList.map((m) => (
                  <button
                    type="button"
                    key={m.type}
                    onClick={() => setSelectedMood(m.type)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition cursor-pointer ${
                      selectedMood === m.type
                        ? 'bg-indigo-500/15 border-indigo-500/50 shadow-sm scale-105'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span className="text-2xl mb-1">{m.emoji}</span>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stress Level Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Stress Level (1 - 10)</span>
                <span className={`font-black text-sm ${stressColor}`}>
                  {stressLevel}/10 • {stressCategory}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stressLevel}
                onChange={(e) => setStressLevel(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>1 Relaxed & Calm</span>
                <span>5 Balanced</span>
                <span>10 Severe Overwhelm</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Reflections & Triggers (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Cleared difficult morning project, feel centered now"
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-indigo-600/20 cursor-pointer"
            >
              Save Mental Health Check-In
            </button>
          </form>
        </div>

        {/* Guided Meditation Timer */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Timer size={16} className="text-indigo-500" />
                <span>Ambient Meditation</span>
              </h2>
              <span className="text-xs text-indigo-400 font-semibold">
                Today: {todayStressLog?.meditationMinutes || 0} mins
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Calm your sympathetic nervous system with silent breath meditation.
            </p>
          </div>

          <div className="my-auto py-4 text-center">
            {isMeditating ? (
              <div className="space-y-4">
                <div className="w-36 h-36 mx-auto rounded-full bg-indigo-500/10 border-2 border-indigo-500 flex flex-col items-center justify-center animate-pulse">
                  <span className="text-xs text-indigo-400 font-medium">Breathe</span>
                  <span className="text-3xl font-black text-white font-mono mt-1">
                    {formatMedTime(medSecondsLeft)}
                  </span>
                </div>
                <button
                  onClick={() => setIsMeditating(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white text-xs rounded-xl cursor-pointer"
                >
                  End Session Early
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <span className="text-xs text-slate-400 block">Select session duration:</span>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 20].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => startMeditation(mins)}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-600 hover:text-white border border-slate-200 dark:border-slate-700 text-xs font-bold transition cursor-pointer"
                    >
                      {mins}m
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsBreathingModalOpen(true)}
                  className="w-full mt-2 py-3 rounded-2xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-600/30 text-indigo-500 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Wind size={15} />
                  <span>Start 4-7-8 Breathing Cycle</span>
                </button>
              </div>
            )}
          </div>

          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-[11px] text-indigo-500 text-center border border-indigo-100 dark:border-indigo-900">
            10 daily minutes of mindfulness lowers resting cortisol by up to 23%.
          </div>
        </div>
      </div>

      {/* 7-Day Mood & Stress Trend Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">7-Day Mood & Stress History</h3>
          </div>
          <span className="text-xs text-slate-400">Weekly psychological equilibrium</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 pt-2">
          {stressHistory.slice(0, 7).map((log) => {
            const dateObj = new Date(log.date);
            const dayLabel = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

            const moodEmoji =
              log.mood === 'Great'
                ? '😄'
                : log.mood === 'Good'
                ? '🙂'
                : log.mood === 'Okay'
                ? '😐'
                : log.mood === 'Bad'
                ? '🙁'
                : '😫';

            return (
              <div
                key={log.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center space-y-1.5"
              >
                <span className="text-[10px] text-slate-400 block font-semibold">{dayLabel}</span>
                <span className="text-2xl block">{moodEmoji}</span>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Stress: {log.stressLevel}/10
                </div>
                {log.meditationMinutes && (
                  <span className="text-[10px] text-indigo-400 block">
                    {log.meditationMinutes}m mindful
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
