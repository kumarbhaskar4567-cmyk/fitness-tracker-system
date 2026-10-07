import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Droplet,
  Coffee,
  Plus,
  Trash2,
  PieChart as PieIcon,
  Flame,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { MealCategory } from '../types';

export const NutritionView: React.FC = () => {
  const {
    todayNutrition,
    logMeal,
    deleteMeal,
    drinkWaterCup,
    removeWaterCup,
    logCaffeine,
  } = useFitness();

  const [isMealFormOpen, setIsMealFormOpen] = useState(false);

  // Form State
  const [mealName, setMealName] = useState('');
  const [category, setCategory] = useState<MealCategory>('Breakfast');
  const [calories, setCalories] = useState<number>(350);
  const [protein, setProtein] = useState<number>(25);
  const [carbs, setCarbs] = useState<number>(35);
  const [fat, setFat] = useState<number>(12);
  const [fiber, setFiber] = useState<number>(5);

  const handleMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;

    logMeal({
      name: mealName.trim(),
      category,
      calories,
      proteinGrams: protein,
      carbsGrams: carbs,
      fatGrams: fat,
      fiberGrams: fiber,
    });

    setIsMealFormOpen(false);
    setMealName('');
  };

  // Totals calculation
  const totalCalories = todayNutrition.meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = todayNutrition.meals.reduce((sum, m) => sum + m.proteinGrams, 0);
  const totalCarbs = todayNutrition.meals.reduce((sum, m) => sum + m.carbsGrams, 0);
  const totalFat = todayNutrition.meals.reduce((sum, m) => sum + m.fatGrams, 0);
  const totalFiber = todayNutrition.meals.reduce((sum, m) => sum + (m.fiberGrams || 0), 0);

  const remainingCalories = Math.max(0, todayNutrition.calorieTarget - totalCalories);
  const caloriePercent = Math.min((totalCalories / todayNutrition.calorieTarget) * 100, 100);

  const categoriesList: MealCategory[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-wider mb-1">
            <UtensilsCrossed size={16} />
            <span>Nutritional Fuel & Hydration</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Nutrition & Water Tracker</h1>
          <p className="text-xs text-slate-500">
            Log meals, track macro distribution, manage 10-glass hydration, and monitor caffeine.
          </p>
        </div>

        <button
          onClick={() => setIsMealFormOpen(!isMealFormOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/25 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Log Meal</span>
        </button>
      </div>

      {/* Top Nutrition & Macros Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calorie Intake Donut Gauge */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame size={16} className="text-amber-500" />
              <span>Calorie Intake Target</span>
            </h2>
            <span className="text-xs text-slate-400">Target: {todayNutrition.calorieTarget} kcal</span>
          </div>

          <div className="py-4 flex flex-col items-center justify-center relative">
            <svg width="190" height="190" className="rotate-[-90deg]">
              <circle
                cx="95"
                cy="95"
                r="75"
                stroke="currentColor"
                strokeWidth="14"
                className="text-slate-100 dark:text-slate-800"
                fill="transparent"
              />
              <circle
                cx="95"
                cy="95"
                r="75"
                stroke="#10b981"
                strokeWidth="14"
                strokeDasharray={2 * Math.PI * 75}
                strokeDashoffset={2 * Math.PI * 75 * (1 - caloriePercent / 100)}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xs text-slate-400 font-medium">Consumed</span>
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                {totalCalories.toLocaleString()}
              </span>
              <span className="text-xs text-emerald-500 font-bold">
                {remainingCalories} kcal left
              </span>
            </div>
          </div>

          <div className="flex items-center justify-around text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Target</span>
              <span className="font-bold text-slate-900 dark:text-white">{todayNutrition.calorieTarget}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Consumed</span>
              <span className="font-bold text-emerald-500">{totalCalories}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Remaining</span>
              <span className="font-bold text-slate-900 dark:text-white">{remainingCalories}</span>
            </div>
          </div>
        </div>

        {/* Macronutrients Progress Bars */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <PieIcon size={16} className="text-emerald-500" />
              <span>Macronutrient Breakdown</span>
            </h2>
            <p className="text-xs text-slate-500 mb-4">Grams consumed vs target benchmarks</p>
          </div>

          <div className="space-y-4">
            {/* Protein */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Protein</span>
                <span className="text-indigo-500 font-bold">{totalProtein}g <span className="text-slate-400 font-normal">/ 140g goal</span></span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totalProtein / 140) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Carbohydrates</span>
                <span className="text-amber-500 font-bold">{totalCarbs}g <span className="text-slate-400 font-normal">/ 220g goal</span></span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totalCarbs / 220) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Fat */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Fats</span>
                <span className="text-rose-500 font-bold">{totalFat}g <span className="text-slate-400 font-normal">/ 65g goal</span></span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totalFat / 65) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Fiber */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Dietary Fiber</span>
                <span className="text-emerald-500 font-bold">{totalFiber}g <span className="text-slate-400 font-normal">/ 35g goal</span></span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((totalFiber / 35) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>High protein ratio supports lean muscle recovery.</span>
            <span className="font-semibold text-emerald-500">In Optimal Balance</span>
          </div>
        </div>
      </div>

      {/* Water Tracker: 10-Glass Cup Interactive System & Caffeine */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 10-Glass System */}
        <div className="md:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
                <Droplet size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Water Intake Tracker</h3>
                <p className="text-xs text-slate-500">10-Glass System (250 ml each = 2,500 ml daily target)</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-black text-cyan-500">
                {todayNutrition.waterCups * 250} <span className="text-xs text-slate-400 font-normal">/ 2500 ml</span>
              </div>
              <span className="text-[11px] text-slate-400">
                {todayNutrition.waterCups} of {todayNutrition.waterTargetCups} cups
              </span>
            </div>
          </div>

          {/* 10 Cups Visual Selector */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 py-3">
            {Array.from({ length: 10 }).map((_, idx) => {
              const isFilled = idx < todayNutrition.waterCups;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (isFilled && idx === todayNutrition.waterCups - 1) {
                      removeWaterCup();
                    } else if (!isFilled) {
                      drinkWaterCup();
                    }
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer group ${
                    isFilled
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-500 scale-105 shadow-sm shadow-cyan-500/10'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-cyan-400'
                  }`}
                  title={`Glass #${idx + 1} (${(idx + 1) * 250} ml)`}
                >
                  <Droplet
                    size={22}
                    className={`transition-all ${
                      isFilled ? 'fill-cyan-500 text-cyan-500' : 'group-hover:text-cyan-400'
                    }`}
                  />
                  <span className="text-[10px] font-bold mt-1">
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400">Tap a cup to drink or adjust your hydration.</span>
            <div className="flex gap-2">
              <button
                onClick={removeWaterCup}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-200 cursor-pointer"
              >
                - 1 Cup
              </button>
              <button
                onClick={drinkWaterCup}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 text-white font-bold hover:bg-cyan-600 cursor-pointer shadow-sm shadow-cyan-500/25"
              >
                + Drink Glass
              </button>
            </div>
          </div>
        </div>

        {/* Caffeine Tracker */}
        <div className="md:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Coffee size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Caffeine Monitor</h3>
                <p className="text-xs text-slate-500">Safe limit: 400 mg daily</p>
              </div>
            </div>

            <div className="my-3">
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {todayNutrition.caffeineMg} <span className="text-xs font-normal text-slate-400">mg</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    todayNutrition.caffeineMg > 400 ? 'bg-rose-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min((todayNutrition.caffeineMg / 400) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 block uppercase">Quick Log</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => logCaffeine(65)}
                className="py-1.5 px-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-amber-500/20 hover:text-amber-500 transition cursor-pointer"
              >
                + Espresso (65mg)
              </button>
              <button
                onClick={() => logCaffeine(95)}
                className="py-1.5 px-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-amber-500/20 hover:text-amber-500 transition cursor-pointer"
              >
                + Coffee (95mg)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Log Meal Form (Expandable) */}
      {isMealFormOpen && (
        <form
          onSubmit={handleMealSubmit}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-4 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Plus size={16} className="text-emerald-500" />
              <span>Add Meal or Snack</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsMealFormOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Food / Meal Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Avocado Toast with Eggs"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category</label>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {categoriesList.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`py-2 text-xs rounded-xl font-medium transition cursor-pointer ${
                      category === cat
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Calories (kcal)</label>
              <input
                type="number"
                min="0"
                required
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Protein (g)</label>
              <input
                type="number"
                min="0"
                value={protein}
                onChange={(e) => setProtein(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Carbs (g)</label>
              <input
                type="number"
                min="0"
                value={carbs}
                onChange={(e) => setCarbs(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Fat (g)</label>
              <input
                type="number"
                min="0"
                value={fat}
                onChange={(e) => setFat(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Fiber (g)</label>
              <input
                type="number"
                min="0"
                value={fiber}
                onChange={(e) => setFiber(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-emerald-600/25 cursor-pointer"
          >
            Add Meal to Log
          </button>
        </form>
      )}

      {/* Logged Meals List by Category */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Today’s Meal Journal</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoriesList.map((cat) => {
            const catMeals = todayNutrition.meals.filter((m) => m.category === cat);
            const catCalories = catMeals.reduce((s, m) => s + m.calories, 0);

            return (
              <div
                key={cat}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2.5"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{cat}</span>
                  <span className="text-xs font-bold text-emerald-500">{catCalories} kcal</span>
                </div>

                {catMeals.length === 0 ? (
                  <div className="text-[11px] text-slate-400 py-2 italic text-center">
                    No items logged for {cat.toLowerCase()}.
                  </div>
                ) : (
                  catMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="flex items-center justify-between text-xs py-1 hover:bg-white dark:hover:bg-slate-800 px-2 rounded-lg transition"
                    >
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{meal.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {meal.proteinGrams}g P • {meal.carbsGrams}g C • {meal.fatGrams}g F
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{meal.calories} kcal</span>
                        <button
                          onClick={() => deleteMeal(meal.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 rounded"
                          title="Delete meal"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
