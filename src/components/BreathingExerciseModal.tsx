import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Wind, Sparkles } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';

export const BreathingExerciseModal: React.FC = () => {
  const { isBreathingModalOpen, setIsBreathingModalOpen, logMeditation } = useFitness();

  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Idle'>('Idle');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [targetCycles] = useState(4);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isBreathingModalOpen) {
      setIsActive(false);
      setPhase('Idle');
      setCyclesCompleted(0);
      setSecondsLeft(4);
    }
  }, [isBreathingModalOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev > 1) return prev - 1;

          // Transition to next phase
          if (phase === 'Idle' || phase === 'Inhale') {
            setPhase('Hold');
            return 7;
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            return 8;
          } else if (phase === 'Exhale') {
            const nextCycle = cyclesCompleted + 1;
            setCyclesCompleted(nextCycle);
            if (nextCycle >= targetCycles) {
              setIsActive(false);
              setPhase('Idle');
              logMeditation(3); // 3 mins recorded
              return 4;
            }
            setPhase('Inhale');
            return 4;
          }
          return 4;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, phase, cyclesCompleted, targetCycles, logMeditation]);

  if (!isBreathingModalOpen) return null;

  const handleStart = () => {
    setPhase('Inhale');
    setSecondsLeft(4);
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('Idle');
    setCyclesCompleted(0);
    setSecondsLeft(4);
  };

  // Circle scaling and coloring depending on phase
  let scaleClass = 'scale-100';
  let phaseColor = 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10';
  let instruction = 'Relax and prepare your body';

  if (phase === 'Inhale') {
    scaleClass = 'scale-125 duration-[4000ms]';
    phaseColor = 'text-cyan-400 border-cyan-500 bg-cyan-500/20';
    instruction = 'Breathe in slowly through your nose...';
  } else if (phase === 'Hold') {
    scaleClass = 'scale-125 duration-1000';
    phaseColor = 'text-amber-400 border-amber-500 bg-amber-500/20';
    instruction = 'Hold your breath gently...';
  } else if (phase === 'Exhale') {
    scaleClass = 'scale-90 duration-[8000ms]';
    phaseColor = 'text-emerald-400 border-emerald-500 bg-emerald-500/20';
    instruction = 'Exhale completely through your mouth...';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center">
        {/* Close Button */}
        <button
          onClick={() => setIsBreathingModalOpen(false)}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center justify-center gap-2 text-indigo-400 mb-1">
          <Wind size={20} />
          <span className="text-xs font-bold uppercase tracking-wider">Mindful Recovery</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">4-7-8 Breathing Guide</h2>
        <p className="text-xs text-slate-400 mb-8 max-w-xs mx-auto">
          Proven technique to reduce heart rate, dissolve cortisol, and settle the nervous system.
        </p>

        {/* Animated Breathing Circle */}
        <div className="relative w-56 h-56 mx-auto flex items-center justify-center mb-8">
          {/* Subtle Outer Glow */}
          <div
            className={`absolute inset-0 rounded-full border border-dashed transition-all ease-in-out ${scaleClass} ${phaseColor}`}
          />
          <div
            className={`w-44 h-44 rounded-full border-4 flex flex-col items-center justify-center transition-all ease-in-out ${scaleClass} ${phaseColor}`}
          >
            <span className="text-sm font-semibold tracking-wide uppercase opacity-80">
              {phase === 'Idle' ? 'Ready' : phase}
            </span>
            <span className="text-5xl font-black text-white my-1">
              {phase === 'Idle' ? '4s' : `${secondsLeft}s`}
            </span>
            <span className="text-xs text-slate-400">
              Cycle {cyclesCompleted + 1} / {targetCycles}
            </span>
          </div>
        </div>

        {/* Current Instruction */}
        <p className="text-sm font-medium text-slate-200 h-6 mb-8 transition-all">
          {instruction}
        </p>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <Play size={18} fill="currentColor" />
              <span>{phase === 'Idle' ? 'Begin Session' : 'Resume'}</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-semibold transition cursor-pointer"
            >
              <Pause size={18} fill="currentColor" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            title="Reset"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        {cyclesCompleted >= targetCycles && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center justify-center gap-1.5">
            <Sparkles size={14} />
            <span>Session completed! +3 mindful minutes added to your wellness log.</span>
          </div>
        )}
      </div>
    </div>
  );
};
