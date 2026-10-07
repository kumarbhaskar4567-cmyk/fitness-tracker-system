import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Shield, ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFitness } from '../context/FitnessContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register, forgotPassword, resetPasswordWithCode, loginAsDemo, loginAsAdmin } = useAuth();
  const { addToast } = useFitness();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset-code'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState(28);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(72);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          addToast({ type: 'success', title: 'Welcome Back!', message: 'Signed in successfully.' });
          onClose();
        } else {
          setError(res.message || 'Login failed');
        }
      } else if (mode === 'register') {
        const res = await register({
          name,
          email,
          password,
          age,
          gender,
          height,
          weight,
          stepGoal: 10000,
          calorieGoal: 500,
          waterGoalCups: 10,
          sleepGoalHours: 8,
        });
        if (res.success) {
          addToast({ type: 'success', title: 'Account Created', message: `Welcome to SmartFit, ${name}!` });
          onClose();
        } else {
          setError(res.message || 'Registration failed');
        }
      } else if (mode === 'forgot') {
        const res = await forgotPassword(email);
        if (res.success) {
          addToast({ type: 'info', title: 'Reset Code Sent', message: res.message });
          if (res.tempCode) setCode(res.tempCode);
          setMode('reset-code');
        } else {
          setError(res.message);
        }
      } else if (mode === 'reset-code') {
        const res = await resetPasswordWithCode(email, code, newPassword);
        if (res.success) {
          addToast({ type: 'success', title: 'Password Reset', message: res.message });
          setMode('login');
        } else {
          setError(res.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = () => {
    loginAsDemo();
    addToast({ type: 'success', title: 'Demo Access Active', message: 'Logged in as Alex Johnson (Demo Profile).' });
    onClose();
  };

  const handleAdminClick = () => {
    loginAsAdmin();
    addToast({ type: 'success', title: 'Admin Session Active', message: 'Logged in with System Admin privileges.' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-rose-500/20">
            SF
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">Smart FITNESS</span>
        </div>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
          {mode === 'login' && 'Sign In to Your Account'}
          {mode === 'register' && 'Create Your Profile'}
          {mode === 'forgot' && 'Reset Password'}
          {mode === 'reset-code' && 'Set New Password'}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          {mode === 'login' && 'Access personal analytics, live telemetry, and community rings.'}
          {mode === 'register' && 'Build your personal health baseline for tailored metabolic tracking.'}
          {mode === 'forgot' && 'Enter your registered email address to receive recovery verification.'}
          {mode === 'reset-code' && 'Enter the reset code and your new secure password.'}
        </p>

        {/* Quick Demo & Admin Switch Buttons */}
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          <button
            type="button"
            onClick={handleDemoClick}
            className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 text-xs font-semibold transition cursor-pointer"
          >
            <UserIcon size={14} />
            <span>Try Demo Account</span>
          </button>
          <button
            type="button"
            onClick={handleAdminClick}
            className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 text-xs font-semibold transition cursor-pointer"
          >
            <Shield size={14} />
            <span>Try Admin Account</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                <div className="relative mt-1">
                  <UserIcon size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Johnson"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Age</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Height (cm)</label>
                  <input
                    type="number"
                    min="100"
                    max="230"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Weight (kg)</label>
                  <input
                    type="number"
                    min="30"
                    max="200"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Gender</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {(['male', 'female', 'other'] as const).map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGender(g)}
                      className={`py-1.5 text-xs rounded-xl capitalize font-medium transition cursor-pointer ${
                        gender === g
                          ? 'bg-rose-500 text-white font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {mode !== 'reset-code' && (
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative mt-1">
                <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@smartfit.com"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'register') && (
            <div>
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setError(null);
                    }}
                    className="text-xs text-rose-500 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative mt-1">
                <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          )}

          {mode === 'reset-code' && (
            <>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Verification Code</label>
                <div className="relative mt-1">
                  <KeyRound size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="FIT-1234"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                <div className="relative mt-1">
                  <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold transition shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>
              {mode === 'login' && 'Sign In'}
              {mode === 'register' && 'Complete Registration'}
              {mode === 'forgot' && 'Send Reset Code'}
              {mode === 'reset-code' && 'Confirm New Password'}
            </span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer switch */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className="text-rose-500 font-bold hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="text-rose-500 font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
