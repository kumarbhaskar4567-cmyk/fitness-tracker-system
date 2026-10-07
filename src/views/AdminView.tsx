import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Dumbbell,
  Trophy,
  Activity,
  Trash2,
  CheckCircle,
  Search,
  RotateCcw,
  UserCheck,
  Shield,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFitness } from '../context/FitnessContext';
import { initLocalStorage, DEFAULT_USERS, setStoredItem, STORAGE_KEYS } from '../utils/storage';

export const AdminView: React.FC = () => {
  const { allUsers, deleteUser, toggleUserRole } = useAuth();
  const { workouts, challenges, addToast } = useFitness();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = allUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleResetData = () => {
    if (window.confirm('Reset all user profiles and records back to initial seeded demo data?')) {
      localStorage.clear();
      initLocalStorage();
      addToast({
        type: 'info',
        title: 'System Reset',
        message: 'Database restored to initial demo state. Refreshing application...',
      });
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-purple-500/10 border border-purple-500/20 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert size={16} />
            <span>Root System Administration</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Admin Management Panel</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Platform governance, user account RBAC administration, and telemetry diagnostics.
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 dark:bg-slate-800 text-slate-200 hover:text-white text-xs font-bold transition hover:bg-rose-500/20 hover:text-rose-400 border border-slate-700 cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw size={14} />
          <span>Reset Demo Database</span>
        </button>
      </div>

      {/* Platform Statistics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Total Registered Users</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              {allUsers.length}
            </div>
            <span className="text-xs text-emerald-500 font-semibold">+100% On-Device Auth</span>
          </div>
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">
            <Users size={24} />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Total Workouts Logged</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              {workouts.length}
            </div>
            <span className="text-xs text-rose-500 font-semibold">Active Athletics Flow</span>
          </div>
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-500">
            <Dumbbell size={24} />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Active Challenges</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              {challenges.length}
            </div>
            <span className="text-xs text-amber-500 font-semibold">Gamified Community</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
            <Trophy size={24} />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">System Engine Status</span>
            <div className="text-2xl font-black text-emerald-500 mt-1 flex items-center gap-1.5">
              <CheckCircle size={20} />
              <span>Operational</span>
            </div>
            <span className="text-xs text-slate-400">Low-latency Local Engine</span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
            <Activity size={24} />
          </div>
        </div>
      </div>

      {/* Platform Growth Trend Chart Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-purple-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Platform Growth & Activity Volume</h2>
          </div>
          <span className="text-xs text-slate-400">Monthly engagement trajectory</span>
        </div>

        <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-4 border-b border-slate-100 dark:border-slate-800">
          {[
            { month: 'Oct', users: 320, workouts: 1200 },
            { month: 'Nov', users: 540, workouts: 2300 },
            { month: 'Dec', users: 780, workouts: 3400 },
            { month: 'Jan', users: 1100, workouts: 5100 },
            { month: 'Feb', users: 1650, workouts: 7800 },
            { month: 'Mar', users: 2420, workouts: 11200 },
          ].map((item) => (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center gap-1.5 h-32">
                <div
                  className="w-1/2 max-w-[20px] bg-purple-500/80 rounded-t-md transition-all"
                  style={{ height: `${(item.users / 2500) * 100}%` }}
                  title={`Users: ${item.users}`}
                />
                <div
                  className="w-1/2 max-w-[20px] bg-rose-500/80 rounded-t-md transition-all"
                  style={{ height: `${(item.workouts / 12000) * 100}%` }}
                  title={`Workouts: ${item.workouts}`}
                />
              </div>
              <span className="text-[10px] font-semibold text-slate-400">{item.month}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-purple-500" />
            <span>Active Users</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-rose-500" />
            <span>Workouts Logged</span>
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck size={16} className="text-purple-400" />
              <span>User Management & RBAC Roles</span>
            </h2>
            <p className="text-xs text-slate-500">Manage registered members, promote admins, or remove accounts</p>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search user by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white w-64 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="py-3 px-3">User</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Profile Stats</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                        alt={u.name}
                        className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
                      />
                      <span className="font-bold text-slate-900 dark:text-white">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">{u.email}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {u.age}y • {u.gender} • {u.height}cm / {u.weight}kg
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => toggleUserRole(u.id)}
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase cursor-pointer border transition ${
                        u.role === 'admin'
                          ? 'bg-purple-500/15 text-purple-400 border-purple-500/30 hover:bg-purple-500/30'
                          : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'
                      }`}
                      title="Click to toggle user/admin role"
                    >
                      {u.role}
                    </button>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete user account ${u.name}?`)) {
                          deleteUser(u.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                      title="Remove Account"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
