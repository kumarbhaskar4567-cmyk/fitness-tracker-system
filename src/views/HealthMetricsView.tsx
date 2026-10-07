import React, { useState } from 'react';
import {
  Heart,
  Activity,
  Droplets,
  Scale,
  Plus,
  Percent,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { useAuth } from '../context/AuthContext';
import { calculateBMI } from '../utils/storage';

export const HealthMetricsView: React.FC = () => {
  const { user } = useAuth();
  const { currentMetric, healthMetricsHistory, logHealthMetric } = useFitness();

  const [isLogFormOpen, setIsLogFormOpen] = useState(false);

  // Form State
  const [heartRate, setHeartRate] = useState<number>(currentMetric.heartRate || 70);
  const [restingHeartRate, setRestingHeartRate] = useState<number>(currentMetric.restingHeartRate || 62);
  const [spo2, setSpo2] = useState<number>(currentMetric.spo2 || 99);
  const [systolic, setSystolic] = useState<number>(currentMetric.bloodPressureSystolic || 118);
  const [diastolic, setDiastolic] = useState<number>(currentMetric.bloodPressureDiastolic || 76);
  const [weight, setWeight] = useState<number>(currentMetric.weight || user?.weight || 74);
  const [bodyFat, setBodyFat] = useState<number>(currentMetric.bodyFatPercentage || 16.5);

  // Interactive BMI Calculator Interactive Sliders State
  const [calcWeight, setCalcWeight] = useState<number>(user?.weight || 74);
  const [calcHeight, setCalcHeight] = useState<number>(user?.height || 178);

  const interactiveBMI = calculateBMI(calcWeight, calcHeight);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    logHealthMetric({
      heartRate,
      restingHeartRate,
      spo2,
      bloodPressureSystolic: systolic,
      bloodPressureDiastolic: diastolic,
      weight,
      bodyFatPercentage: bodyFat,
    });
    setIsLogFormOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider mb-1">
            <Heart size={16} />
            <span>Cardiovascular & Body Composition</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Body Health Monitor</h1>
          <p className="text-xs text-slate-500">
            Real-time biometric monitoring, BMI classification, SpO2 blood oxygen, and blood pressure.
          </p>
        </div>

        <button
          onClick={() => setIsLogFormOpen(!isLogFormOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition shadow-md shadow-rose-500/25 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Record New Health Reading</span>
        </button>
      </div>

      {/* Log Form Expandable */}
      {isLogFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity size={16} className="text-rose-500" />
              <span>Record Biometric Vitals</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsLogFormOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                min="40"
                max="220"
                required
                value={heartRate}
                onChange={(e) => setHeartRate(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Resting HR (bpm)
              </label>
              <input
                type="number"
                min="35"
                max="120"
                required
                value={restingHeartRate}
                onChange={(e) => setRestingHeartRate(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Blood Oxygen SpO2 (%)
              </label>
              <input
                type="number"
                min="80"
                max="100"
                required
                value={spo2}
                onChange={(e) => setSpo2(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="250"
                required
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Systolic BP (mmHg)
              </label>
              <input
                type="number"
                min="80"
                max="220"
                required
                value={systolic}
                onChange={(e) => setSystolic(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Diastolic BP (mmHg)
              </label>
              <input
                type="number"
                min="40"
                max="140"
                required
                value={diastolic}
                onChange={(e) => setDiastolic(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Body Fat % (optional)
              </label>
              <input
                type="number"
                step="0.1"
                min="4"
                max="60"
                value={bodyFat}
                onChange={(e) => setBodyFat(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-rose-500/25 cursor-pointer"
          >
            Save Biometric Reading
          </button>
        </form>
      )}

      {/* Primary Vitals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Heart Rate</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <Heart size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {currentMetric.heartRate} <span className="text-xs font-normal text-slate-400">bpm</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Resting HR: {currentMetric.restingHeartRate} bpm</span>
            <span className="text-emerald-500 font-semibold">Normal</span>
          </div>
        </div>

        {/* SpO2 */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Blood Oxygen</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
              <Droplets size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {currentMetric.spo2}%
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Clinical Target: 95-100%</span>
            <span className="text-emerald-500 font-semibold">Optimal</span>
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Blood Pressure</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Activity size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {currentMetric.bloodPressureSystolic} / {currentMetric.bloodPressureDiastolic}{' '}
            <span className="text-xs font-normal text-slate-400">mmHg</span>
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Category: Ideal</span>
            <span className="text-emerald-500 font-semibold">&lt;120/80</span>
          </div>
        </div>

        {/* Body Fat & Weight */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Body Fat & Mass</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Percent size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {currentMetric.bodyFatPercentage || 16.5}%
          </div>
          <div className="text-xs text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Weight: {currentMetric.weight} kg</span>
            <span className="text-amber-500 font-semibold">Fitness Range</span>
          </div>
        </div>
      </div>

      {/* Interactive BMI Calculator with Visual Scale */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale size={18} className="text-rose-500" />
              <span>Interactive BMI Calculator & Visual Scale</span>
            </h2>
            <p className="text-xs text-slate-500">Adjust sliders to test body mass index thresholds</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Calculated BMI:</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{interactiveBMI.bmi}</span>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                interactiveBMI.category === 'Normal'
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                  : interactiveBMI.category === 'Overweight'
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
              }`}
            >
              {interactiveBMI.category}
            </span>
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-300">Current Weight (kg)</span>
              <span className="text-rose-500 font-bold">{calcWeight} kg</span>
            </div>
            <input
              type="range"
              min="40"
              max="160"
              step="0.5"
              value={calcWeight}
              onChange={(e) => setCalcWeight(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>40 kg</span>
              <span>100 kg</span>
              <span>160 kg</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600 dark:text-slate-300">Height (cm)</span>
              <span className="text-indigo-500 font-bold">{calcHeight} cm</span>
            </div>
            <input
              type="range"
              min="130"
              max="220"
              value={calcHeight}
              onChange={(e) => setCalcHeight(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>130 cm</span>
              <span>175 cm</span>
              <span>220 cm</span>
            </div>
          </div>
        </div>

        {/* Color-Coded BMI Scale Bar */}
        <div className="space-y-2 pt-2">
          <div className="h-4 rounded-full overflow-hidden flex shadow-inner">
            <div className="bg-amber-400 h-full w-[25%]" title="Underweight (< 18.5)" />
            <div className="bg-emerald-500 h-full w-[35%]" title="Normal (18.5 - 24.9)" />
            <div className="bg-orange-500 h-full w-[20%]" title="Overweight (25 - 29.9)" />
            <div className="bg-rose-600 h-full w-[20%]" title="Obese (≥ 30)" />
          </div>

          <div className="grid grid-cols-4 text-center text-[11px] font-semibold text-slate-500">
            <div>Underweight &lt;18.5</div>
            <div className="text-emerald-500 font-bold">Normal 18.5-24.9</div>
            <div>Overweight 25-29.9</div>
            <div>Obese ≥30</div>
          </div>
        </div>
      </div>

      {/* 30-Day Metrics Trend History Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-rose-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Biometric History</h3>
          </div>
          <span className="text-xs text-slate-400">Chronological telemetry readings</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Heart Rate</th>
                <th className="py-2.5 px-3">Resting HR</th>
                <th className="py-2.5 px-3">SpO2</th>
                <th className="py-2.5 px-3">Blood Pressure</th>
                <th className="py-2.5 px-3">Weight</th>
                <th className="py-2.5 px-3">BMI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {healthMetricsHistory.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{m.date}</td>
                  <td className="py-2.5 px-3 text-rose-500 font-bold">{m.heartRate} bpm</td>
                  <td className="py-2.5 px-3 text-slate-500">{m.restingHeartRate} bpm</td>
                  <td className="py-2.5 px-3 text-cyan-500 font-bold">{m.spo2}%</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                    {m.bloodPressureSystolic}/{m.bloodPressureDiastolic} mmHg
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{m.weight} kg</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                      {m.bmi}
                    </span>
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
