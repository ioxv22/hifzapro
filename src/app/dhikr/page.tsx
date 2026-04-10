'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getProgress, saveProgress } from '@/lib/store';

const dhikrTypes = [
  { key: 'SubhanAllah', arabic: 'سُبْحَانَ اللَّهِ', english: 'Glory be to Allah', defaultGoal: 33, color: 'from-emerald-500 to-teal-600' },
  { key: 'Alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', english: 'All praise is due to Allah', defaultGoal: 33, color: 'from-amber-500 to-orange-600' },
  { key: 'AllahuAkbar', arabic: 'اللَّهُ أَكْبَرُ', english: 'Allah is the Greatest', defaultGoal: 34, color: 'from-violet-500 to-purple-600' },
  { key: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ اللَّهَ', english: 'I seek forgiveness from Allah', defaultGoal: 100, color: 'from-cyan-500 to-blue-600' },
  { key: 'LaIlahaIllallah', arabic: 'لَا إِلَٰهَ إِلَّا اللَّهُ', english: 'There is no deity but Allah', defaultGoal: 100, color: 'from-rose-500 to-pink-600' },
];

export default function DhikrPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selected, setSelected] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [goals, setGoals] = useState<Record<string, number>>({});
  const [totalToday, setTotalToday] = useState(0);
  const [showRipple, setShowRipple] = useState(false);
  const [vibrate, setVibrate] = useState(false);

  const current = dhikrTypes[selected];

  // Load saved progress
  useEffect(() => {
    if (user) {
      const progress = getProgress(user.id);
      setCounts(progress.dhikrCount);
      setGoals(progress.dhikrGoals);
      const total = Object.values(progress.dhikrCount).reduce((a, b) => a + b, 0);
      setTotalToday(total);
    } else {
      const defaultCounts: Record<string, number> = {};
      const defaultGoals: Record<string, number> = {};
      dhikrTypes.forEach(d => {
        defaultCounts[d.key] = 0;
        defaultGoals[d.key] = d.defaultGoal;
      });
      setCounts(defaultCounts);
      setGoals(defaultGoals);
    }
  }, [user]);

  const increment = useCallback(() => {
    const key = current.key;
    setCounts(prev => {
      const newCounts = { ...prev, [key]: (prev[key] || 0) + 1 };
      // Save to storage
      if (user) {
        const progress = getProgress(user.id);
        progress.dhikrCount = newCounts;
        saveProgress(user.id, progress);
      }
      return newCounts;
    });
    setTotalToday(prev => prev + 1);
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 300);

    // Vibrate on mobile if supported
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }

    // Goal reached effect
    const newCount = (counts[key] || 0) + 1;
    if (newCount === goals[key]) {
      setVibrate(true);
      setTimeout(() => setVibrate(false), 500);
    }
  }, [current.key, counts, goals, user]);

  const resetCurrent = () => {
    const key = current.key;
    const diff = counts[key] || 0;
    setCounts(prev => {
      const newCounts = { ...prev, [key]: 0 };
      if (user) {
        const progress = getProgress(user.id);
        progress.dhikrCount = newCounts;
        saveProgress(user.id, progress);
      }
      return newCounts;
    });
    setTotalToday(prev => prev - diff);
  };

  const resetAll = () => {
    const newCounts: Record<string, number> = {};
    dhikrTypes.forEach(d => { newCounts[d.key] = 0; });
    setCounts(newCounts);
    setTotalToday(0);
    if (user) {
      const progress = getProgress(user.id);
      progress.dhikrCount = newCounts;
      saveProgress(user.id, progress);
    }
  };

  const count = counts[current.key] || 0;
  const goal = goals[current.key] || current.defaultGoal;
  const percentage = Math.min((count / goal) * 100, 100);
  const isComplete = count >= goal;

  return (
    <div className="page-transition max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-display mb-3">
          📿 {t('dhikrTitle')} <span className="text-gradient">{t('counter')}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{t('dhikrDesc')}</p>
      </div>

      {/* Today&apos;s Total */}
      <div className="glass-card p-6 mb-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('todaysTotal')}</p>
        <p className="text-4xl font-bold text-gradient">{totalToday}</p>
      </div>

      {/* Dhikr Type Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-thin">
        {dhikrTypes.map((dhikr, index) => (
          <button
            key={dhikr.key}
            onClick={() => setSelected(index)}
            className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              selected === index
                ? `bg-gradient-to-r ${dhikr.color} text-white shadow-lg`
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-500'
            }`}
          >
            {dhikr.english.split(' ').slice(0, 2).join(' ')}...
          </button>
        ))}
      </div>

      {/* Main Counter Area */}
      <div className="glass-card p-8 md:p-12 text-center mb-8 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${current.color} opacity-5`} />
        <div className="relative">
          {/* Arabic */}
          <p className="font-arabic text-3xl md:text-4xl lg:text-5xl text-emerald-600 dark:text-emerald-400 mb-2" style={{ lineHeight: 2 }}>
            {current.arabic}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">{current.english}</p>

          {/* Circular Progress */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="4" className="text-gray-200 dark:text-gray-700" />
              <circle
                cx="60" cy="60" r="54"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - percentage / 100)}`}
                className={`transition-all duration-300 ${isComplete ? 'text-amber-400' : 'text-emerald-500'}`}
                stroke="currentColor"
              />
            </svg>
            {/* Counter Button */}
            <button
              onClick={increment}
              className={`absolute inset-4 rounded-full flex flex-col items-center justify-center transition-all duration-150 counter-press
                ${isComplete
                  ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-2xl shadow-amber-500/30'
                  : `bg-gradient-to-br ${current.color} text-white shadow-2xl shadow-emerald-500/20`
                }
                ${showRipple ? 'scale-95' : 'scale-100'}
                ${vibrate ? 'animate-bounce' : ''}
              `}
            >
              <span className="text-5xl md:text-6xl font-bold">{count}</span>
              <span className="text-sm opacity-80">/ {goal}</span>
            </button>
          </div>

          {/* Progress text */}
          {isComplete && (
            <div className="mb-6 px-4 py-2 rounded-xl bg-amber-500/10 inline-flex items-center gap-2 text-amber-500 font-medium">
              ✨ {t('goalComplete')} ✨
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={resetCurrent}
              className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              🔄 {t('resetCurrent')}
            </button>
            <button
              onClick={resetAll}
              className="px-6 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              🗑 {t('resetAll')}
            </button>
          </div>
        </div>
      </div>

      {/* All Dhikr Progress */}
      <div className="glass-card p-6">
        <h3 className="font-bold text-lg mb-4">{t('progressOverview')}</h3>
        <div className="space-y-4">
          {dhikrTypes.map(dhikr => {
            const c = counts[dhikr.key] || 0;
            const g = goals[dhikr.key] || dhikr.defaultGoal;
            const pct = Math.min((c / g) * 100, 100);
            return (
              <div key={dhikr.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-arabic text-sm">{dhikr.arabic}</span>
                    <span className="text-xs text-gray-500">({dhikr.english})</span>
                  </div>
                  <span className="text-sm font-medium">{c} / {g}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${dhikr.color} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
