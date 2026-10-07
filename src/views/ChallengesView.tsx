import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Award,
  Users,
  Plus,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';

export const ChallengesView: React.FC = () => {
  const {
    challenges,
    achievements,
    leaderboard,
    userStreak,
    joinChallenge,
    createChallenge,
  } = useFitness();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Custom Challenge Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Steps' | 'Workouts' | 'Hydration' | 'Sleep' | 'Mindfulness'>('Steps');
  const [targetValue, setTargetValue] = useState<number>(30000);
  const [unit, setUnit] = useState('steps');
  const [rewardBadge, setRewardBadge] = useState('🏅 Champion');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createChallenge({
      title: title.trim(),
      description: description.trim(),
      category,
      targetValue,
      unit,
      rewardBadge,
      endDate: '2025-03-30',
      daysRemaining: 7,
    });

    setTitle('');
    setDescription('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy size={16} />
            <span>Gamification & Community Motivation</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Social Challenges & Badges</h1>
          <p className="text-xs text-slate-500">
            Compete on the weekly leaderboard, maintain your 7-day streak, and unlock prestige trophies.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(!isCreateModalOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-md shadow-amber-500/25 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Create Custom Challenge</span>
        </button>
      </div>

      {/* 7-Day Streak & Leaderboard Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-Day Activity Streak Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-indigo-500/15 border border-amber-500/30 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                <Flame size={16} className="text-amber-500 animate-bounce" />
                Active Habit Streak
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                Milestone Reached!
              </span>
            </div>

            <div className="my-4">
              <div className="text-5xl font-black text-slate-900 dark:text-white flex items-baseline gap-2">
                <span>{userStreak}</span>
                <span className="text-base font-bold text-slate-500">Consecutive Days</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                You have fulfilled daily activity and hydration milestones for 7 straight days without interruption!
              </p>
            </div>
          </div>

          {/* 7 Day Dots */}
          <div className="pt-4 border-t border-amber-500/20">
            <div className="flex items-center justify-between">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <div key={day} className="flex flex-col items-center gap-1.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black shadow-md shadow-amber-500/30">
                    ✓
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Step Leaderboard */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users size={16} className="text-indigo-500" />
              <span>Weekly Step Leaderboard</span>
            </h2>
            <span className="text-xs text-slate-400">Resets every Sunday midnight</span>
          </div>

          <div className="space-y-2.5">
            {leaderboard.map((member) => (
              <div
                key={member.id}
                className={`flex items-center justify-between p-2.5 rounded-2xl border transition ${
                  member.isCurrentUser
                    ? 'bg-rose-500/10 border-rose-500/30 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 text-center font-black text-xs ${
                      member.rank === 1
                        ? 'text-amber-500 text-sm'
                        : member.rank === 2
                        ? 'text-slate-400 text-sm'
                        : member.rank === 3
                        ? 'text-amber-700 text-sm'
                        : 'text-slate-400'
                    }`}
                  >
                    #{member.rank}
                  </span>

                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
                  />

                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{member.name}</span>
                      {member.isCurrentUser && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-rose-500 text-white">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      🔥 {member.streakDays} day streak
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-xs text-slate-900 dark:text-white">
                    {member.steps.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400">steps</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-slate-400 text-center">
            You are currently ranked in the top 10% of active athletes this week!
          </div>
        </div>
      </div>

      {/* Active Community Challenges */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Trophy size={16} className="text-amber-500" />
          <span>Active Community Challenges</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((c) => {
            const progress = Math.min((c.currentValue / c.targetValue) * 100, 100);

            return (
              <div
                key={c.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="px-2 py-0.5 rounded-full font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px]">
                      {c.category}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {c.daysRemaining > 0 ? `${c.daysRemaining} days remaining` : 'Completed!'}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{c.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{c.description}</p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {c.currentValue.toLocaleString()} / {c.targetValue.toLocaleString()} {c.unit}
                    </span>
                    <span className="font-bold text-amber-500">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <span className="text-[11px] font-semibold text-indigo-400">
                    Prize: {c.rewardBadge}
                  </span>

                  {!c.joined ? (
                    <button
                      onClick={() => joinChallenge(c.id)}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl cursor-pointer"
                    >
                      Join Challenge
                    </button>
                  ) : c.completed ? (
                    <span className="text-emerald-500 font-bold flex items-center gap-1">
                      <CheckCircle2 size={14} /> Completed
                    </span>
                  ) : (
                    <span className="text-indigo-400 font-semibold text-[11px]">
                      Joined • {c.participantsCount} participants
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Badges Shelf */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award size={16} className="text-amber-500" />
            <span>Achievement Badges Trophy Room</span>
          </h2>
          <span className="text-xs text-slate-400">
            {achievements.filter((a) => a.unlocked).length} of {achievements.length} Badges Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between transition ${
                ach.unlocked
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="relative mb-2">
                <span className="text-4xl">{ach.icon}</span>
                {!ach.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                    <Lock size={16} className="text-white" />
                  </div>
                )}
              </div>

              <div className="font-bold text-xs text-slate-900 dark:text-white">{ach.title}</div>
              <p className="text-[10px] text-slate-400 mt-1 leading-tight">{ach.description}</p>

              <div className="mt-3">
                {ach.unlocked ? (
                  <span className="text-[10px] font-bold text-amber-500">
                    Unlocked {ach.unlockedAt ? `• ${ach.unlockedAt}` : ''}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-slate-400">Locked</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Custom Challenge Form (Expandable) */}
      {isCreateModalOpen && (
        <form
          onSubmit={handleCreateSubmit}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus size={16} className="text-amber-500" />
              <span>Create New Community Challenge</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Challenge Title</label>
              <input
                type="text"
                required
                placeholder="e.g. 100k Monthly Step March"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="Steps">Steps</option>
                <option value="Workouts">Workouts</option>
                <option value="Hydration">Hydration</option>
                <option value="Sleep">Sleep</option>
                <option value="Mindfulness">Mindfulness</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Goal Value</label>
              <input
                type="number"
                min="1"
                required
                value={targetValue}
                onChange={(e) => setTargetValue(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Unit</label>
              <input
                type="text"
                required
                placeholder="steps, km, glasses, mins"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Prize Badge Icon</label>
              <input
                type="text"
                required
                value={rewardBadge}
                onChange={(e) => setRewardBadge(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description</label>
            <input
              type="text"
              placeholder="Explain the rules and purpose of the challenge"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-amber-500/25 cursor-pointer"
          >
            Publish Challenge to Community
          </button>
        </form>
      )}
    </div>
  );
};
