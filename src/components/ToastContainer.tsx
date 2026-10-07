import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useFitness } from '../context/FitnessContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useFitness();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast) => {
        let icon = <CheckCircle className="text-emerald-500 shrink-0" size={18} />;
        let borderClass = 'border-emerald-500/30 bg-emerald-500/10 text-emerald-100';

        if (toast.type === 'error') {
          icon = <AlertCircle className="text-rose-500 shrink-0" size={18} />;
          borderClass = 'border-rose-500/30 bg-rose-500/10 text-rose-100';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="text-amber-500 shrink-0" size={18} />;
          borderClass = 'border-amber-500/30 bg-amber-500/10 text-amber-100';
        } else if (toast.type === 'info') {
          icon = <Info className="text-cyan-500 shrink-0" size={18} />;
          borderClass = 'border-cyan-500/30 bg-cyan-500/10 text-cyan-100';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-md border ${borderClass} shadow-xl shadow-black/30 transition-all duration-300 animate-slide-up`}
          >
            <div className="flex items-start gap-2.5">
              {icon}
              <div>
                <div className="text-xs font-bold text-white">{toast.title}</div>
                <div className="text-xs text-slate-300 mt-0.5 leading-snug">{toast.message}</div>
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
