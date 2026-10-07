import React from 'react';
import { Flame, Timer, PersonStanding } from 'lucide-react';

interface ActivityRingsProps {
  calories: number;
  calorieGoal: number;
  activeMinutes: number;
  activeMinutesGoal: number;
  standHours: number;
  standHoursGoal: number;
  size?: number;
}

export const ActivityRings: React.FC<ActivityRingsProps> = ({
  calories,
  calorieGoal,
  activeMinutes,
  activeMinutesGoal,
  standHours,
  standHoursGoal,
  size = 220,
}) => {
  const strokeWidth = 14;
  const center = size / 2;

  // Ring 1 (Outer - Move / Calories) - Coral / Rose / Red
  const r1 = center - strokeWidth / 2 - 4;
  const c1 = 2 * Math.PI * r1;
  const p1 = Math.min(calories / (calorieGoal || 500), 1.75);
  const offset1 = c1 - Math.min(p1, 1) * c1;

  // Ring 2 (Middle - Exercise / Active Mins) - Neon Green
  const r2 = r1 - strokeWidth - 5;
  const c2 = 2 * Math.PI * r2;
  const p2 = Math.min(activeMinutes / (activeMinutesGoal || 45), 1.75);
  const offset2 = c2 - Math.min(p2, 1) * c2;

  // Ring 3 (Inner - Stand / Hours) - Vibrant Cyan
  const r3 = r2 - strokeWidth - 5;
  const c3 = 2 * Math.PI * r3;
  const p3 = Math.min(standHours / (standHoursGoal || 12), 1.75);
  const offset3 = c3 - Math.min(p3, 1) * c3;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          {/* Ring 1 - Background */}
          <circle
            cx={center}
            cy={center}
            r={r1}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-rose-950/40 dark:text-rose-950/60"
            fill="transparent"
          />
          {/* Ring 1 - Progress */}
          <circle
            cx={center}
            cy={center}
            r={r1}
            stroke="#fa2d48"
            strokeWidth={strokeWidth}
            strokeDasharray={c1}
            strokeDashoffset={offset1}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />

          {/* Ring 2 - Background */}
          <circle
            cx={center}
            cy={center}
            r={r2}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-emerald-950/40 dark:text-emerald-950/60"
            fill="transparent"
          />
          {/* Ring 2 - Progress */}
          <circle
            cx={center}
            cy={center}
            r={r2}
            stroke="#10b981"
            strokeWidth={strokeWidth}
            strokeDasharray={c2}
            strokeDashoffset={offset2}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />

          {/* Ring 3 - Background */}
          <circle
            cx={center}
            cy={center}
            r={r3}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-cyan-950/40 dark:text-cyan-950/60"
            fill="transparent"
          />
          {/* Ring 3 - Progress */}
          <circle
            cx={center}
            cy={center}
            r={r3}
            stroke="#06b6d4"
            strokeWidth={strokeWidth}
            strokeDasharray={c3}
            strokeDashoffset={offset3}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Icons Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Daily Rings
          </span>
          <span className="text-xl font-bold text-slate-900 dark:text-white">
            {Math.round(((p1 + p2 + p3) / 3) * 100)}%
          </span>
        </div>
      </div>

      {/* Legend & Stats */}
      <div className="flex flex-col gap-3 min-w-[170px]">
        {/* Move */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-rose-500 text-white">
              <Flame size={16} />
            </div>
            <div>
              <div className="text-xs font-medium text-rose-500">Move</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {calories} <span className="text-xs font-normal text-slate-500">/ {calorieGoal} kcal</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-500">{Math.round(p1 * 100)}%</span>
        </div>

        {/* Exercise */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500 text-white">
              <Timer size={16} />
            </div>
            <div>
              <div className="text-xs font-medium text-emerald-500">Exercise</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {activeMinutes} <span className="text-xs font-normal text-slate-500">/ {activeMinutesGoal}m</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-500">{Math.round(p2 * 100)}%</span>
        </div>

        {/* Stand */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500 text-white">
              <PersonStanding size={16} />
            </div>
            <div>
              <div className="text-xs font-medium text-cyan-500">Stand / Active</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {standHours} <span className="text-xs font-normal text-slate-500">/ {standHoursGoal}h</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-cyan-500">{Math.round(p3 * 100)}%</span>
        </div>
      </div>
    </div>
  );
};
