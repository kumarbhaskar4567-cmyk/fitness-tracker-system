import React, { useState } from 'react';
import {
  Pill,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';

export const MedicationsView: React.FC = () => {
  const { medications, addMedication, toggleMedicationTaken, deleteMedication } = useFitness();

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [schedule, setSchedule] = useState<('Morning' | 'Afternoon' | 'Evening' | 'Bedtime')[]>([
    'Morning',
  ]);

  const toggleScheduleSlot = (slot: 'Morning' | 'Afternoon' | 'Evening' | 'Bedtime') => {
    if (schedule.includes(slot)) {
      if (schedule.length > 1) {
        setSchedule(schedule.filter((s) => s !== slot));
      }
    } else {
      setSchedule([...schedule, slot]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) return;

    addMedication({
      name: name.trim(),
      dosage: dosage.trim(),
      schedule,
      instructions: instructions.trim() || undefined,
    });

    setName('');
    setDosage('');
    setInstructions('');
    setIsAddFormOpen(false);
  };

  // Calculate today's adherence
  let totalDosesRequired = 0;
  let dosesTaken = 0;

  medications.forEach((m) => {
    m.schedule.forEach((slot) => {
      totalDosesRequired++;
      if (m.takenToday[slot]) {
        dosesTaken++;
      }
    });
  });

  const adherencePercent =
    totalDosesRequired > 0 ? Math.round((dosesTaken / totalDosesRequired) * 100) : 100;

  const slotsList: ('Morning' | 'Afternoon' | 'Evening' | 'Bedtime')[] = [
    'Morning',
    'Afternoon',
    'Evening',
    'Bedtime',
  ];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider mb-1">
            <Pill size={16} />
            <span>Regimen & Therapeutics</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Medications & Supplements</h1>
          <p className="text-xs text-slate-500">
            Log clinical prescriptions, supplements, dosages, and verify daily adherence.
          </p>
        </div>

        <button
          onClick={() => setIsAddFormOpen(!isAddFormOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition shadow-md shadow-rose-500/25 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add New Medication</span>
        </button>
      </div>

      {/* Adherence KPI Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Today's Adherence</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              {adherencePercent}%
            </div>
            <span className="text-xs text-emerald-500 font-semibold">
              {dosesTaken} of {totalDosesRequired} doses taken
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
            <ShieldCheck size={26} />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Active Prescriptions</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              {medications.length}
            </div>
            <span className="text-xs text-slate-400">All current regimens</span>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
            <Pill size={26} />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Adherence Streak</span>
            <div className="text-3xl font-black text-slate-900 dark:text-white mt-0.5">
              14 Days
            </div>
            <span className="text-xs text-indigo-500 font-semibold">Zero missed morning doses</span>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
            <Clock size={26} />
          </div>
        </div>
      </div>

      {/* Add Medication Form (Expandable) */}
      {isAddFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus size={16} className="text-rose-500" />
              <span>Schedule New Medication or Supplement</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAddFormOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Medication / Supplement Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CoQ10 or Lisinopril"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Dosage & Unit
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 100 mg or 1 Capsule"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Schedule Times of Day
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
              {slotsList.map((slot) => {
                const isSelected = schedule.includes(slot);
                return (
                  <button
                    type="button"
                    key={slot}
                    onClick={() => toggleScheduleSlot(slot)}
                    className={`py-2 px-2 text-xs rounded-xl font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Special Instructions (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Take with meal and 250ml water"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-rose-500/25 cursor-pointer"
          >
            Save to Medication Schedule
          </button>
        </form>
      )}

      {/* Medications List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Schedule & Today's Doses</h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {medications.map((med) => (
            <div key={med.id} className="py-4 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <Pill size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{med.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300">
                      {med.dosage}
                    </span>
                  </div>
                  {med.instructions && (
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                      <AlertCircle size={12} className="text-amber-500 shrink-0" />
                      <span>{med.instructions}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dose Checkboxes per schedule slot */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {med.schedule.map((slot) => {
                  const isTaken = !!med.takenToday[slot];
                  return (
                    <button
                      key={slot}
                      onClick={() => toggleMedicationTaken(med.id, slot)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        isTaken
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500'
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-400'
                      }`}
                    >
                      <CheckCircle2 size={13} className={isTaken ? 'text-emerald-500' : 'text-slate-400'} />
                      <span>{slot}</span>
                      <span className="text-[10px] opacity-75">{isTaken ? '(Taken)' : ''}</span>
                    </button>
                  );
                })}

                <button
                  onClick={() => deleteMedication(med.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer ml-1"
                  title="Remove medication"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
