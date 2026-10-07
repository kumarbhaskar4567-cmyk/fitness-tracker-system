import React from 'react';
import { Activity, Sparkles, CheckCircle2 } from 'lucide-react';

interface HealthScoreGaugeProps {
  score: number;
  label: string;
  tips: string[];
}

export const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({ score, label, tips }) => {
  // Radial half gauge or 270deg gauge
  const radius = 64;
  const circumference = Math.PI * radius; // 180 degrees half-arch
  const progressOffset = circumference - (Math.min(score, 100) / 100) * circumference;

  let color = '#10b981'; // Green
  let gradeBg = 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';

  if (score < 50) {
    color = '#f43f5e';
    gradeBg = 'bg-rose-500/10 text-rose-500 border-rose-500/20';
  } else if (score < 75) {
    color = '#f59e0b';
    gradeBg = 'bg-amber-500/10 text-amber-500 border-amber-500/20';
  } else if (score >= 90) {
    color = '#06b6d4';
    gradeBg = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
            <Activity size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">Daily Health Score</h3>
            <p className="text-xs text-slate-500">Holistic activity & vital synthesis</p>
          </div>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${gradeBg}`}>
          {label}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5 my-2">
        {/* Arc Gauge */}
        <div className="relative flex flex-col items-center justify-center">
          <svg width="150" height="95" viewBox="0 0 160 100" className="overflow-visible">
            {/* Background Arc */}
            <path
              d="M 15 85 A 65 65 0 0 1 145 85"
              fill="none"
              stroke="currentColor"
              strokeWidth="14"
              strokeLinecap="round"
              className="text-slate-100 dark:text-slate-800"
            />
            {/* Progress Arc */}
            <path
              d="M 15 85 A 65 65 0 0 1 145 85"
              fill="none"
              stroke={color}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute top-10 flex flex-col items-center">
            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {score}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              / 100 PTS
            </span>
          </div>
        </div>

        {/* Actionable Tips */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Sparkles size={14} className="text-amber-500" />
            <span>Health Insights</span>
          </div>
          <div className="space-y-1.5">
            {tips.slice(0, 2).map((tip, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800"
              >
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
