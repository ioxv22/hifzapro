'use client';
import React, { useState } from 'react';
import { getDailyDua, getDailyHadith, getDailyReminders, duas, hadiths } from '@/lib/dailyContent';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getProgress, saveProgress } from '@/lib/store';

export default function DailyPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const dailyDua = getDailyDua();
  const dailyHadith = getDailyHadith();
  const reminders = getDailyReminders();
  const [activeTab, setActiveTab] = useState<'dua' | 'hadith' | 'reminders'>('dua');
  const [favDuas, setFavDuas] = useState<Set<string>>(new Set());

  // Load favorites
  React.useEffect(() => {
    if (user) {
      const progress = getProgress(user.id);
      setFavDuas(new Set(progress.favoriteDuas));
    }
  }, [user]);

  const toggleFavDua = (duaId: string) => {
    if (!user) return;
    const progress = getProgress(user.id);
    const idx = progress.favoriteDuas.indexOf(duaId);
    if (idx >= 0) {
      progress.favoriteDuas.splice(idx, 1);
    } else {
      progress.favoriteDuas.push(duaId);
    }
    saveProgress(user.id, progress);
    setFavDuas(new Set(progress.favoriteDuas));
  };

  const tabs = [
    { key: 'dua', label: t('duas'), icon: '🤲' },
    { key: 'hadith', label: t('hadith'), icon: '📜' },
    { key: 'reminders', label: t('reminders'), icon: '✨' },
  ] as const;

  return (
    <div className="page-transition max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-display mb-3">
          🌙 {t('dailyTitle')} <span className="text-gradient">{t('islamicContent')}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{t('dailyDesc')}</p>
      </div>

      {/* Featured Card - Daily Dua */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 p-8 md:p-10 mb-8 text-white">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🤲</span>
            <div>
              <p className="text-emerald-200 text-sm font-medium">{t('duaOfDay')}</p>
              <h2 className="text-xl font-bold">{dailyDua.title}</h2>
            </div>
          </div>
          <p className="font-arabic text-2xl md:text-3xl text-right leading-loose mb-4 text-emerald-50" style={{ lineHeight: 2.5 }}>
            {dailyDua.arabic}
          </p>
          <p className="text-sm text-emerald-100 italic mb-2">{dailyDua.transliteration}</p>
          <p className="text-emerald-50 leading-relaxed mb-4">{dailyDua.english}</p>
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-sm">{dailyDua.reference}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-thin">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'gradient-primary text-white shadow-lg shadow-emerald-500/25'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-500'
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Duas Section */}
      {activeTab === 'dua' && (
        <div className="space-y-4">
          {duas.map(dua => (
            <div key={dua.id} className="glass-card p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <span>🤲</span>
                  </div>
                  <div>
                    <h3 className="font-bold">{dua.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">{dua.category}</span>
                  </div>
                </div>
                {user && (
                  <button
                    onClick={() => toggleFavDua(dua.id)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                      favDuas.has(dua.id) ? 'bg-red-500/10 text-red-500' : 'bg-gray-100 dark:bg-gray-800 hover:bg-red-500/10'
                    }`}
                  >
                    {favDuas.has(dua.id) ? '❤️' : '🤍'}
                  </button>
                )}
              </div>
              <p className="font-arabic text-xl md:text-2xl text-right leading-loose text-emerald-600 dark:text-emerald-400 mb-3" style={{ lineHeight: 2.5 }}>
                {dua.arabic}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-2">{dua.transliteration}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">{dua.english}</p>
              <span className="text-xs text-emerald-500 font-medium">{dua.reference}</span>
            </div>
          ))}
        </div>
      )}

      {/* Hadith Section */}
      {activeTab === 'hadith' && (
        <div className="space-y-4">
          {/* Featured Hadith */}
          <div className="glass-card p-6 bg-gradient-to-r from-amber-500/5 to-yellow-500/5 border-amber-500/20 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">⭐</span>
              <span className="text-sm font-medium text-amber-500">{t('hadithOfDay')}</span>
            </div>
            <blockquote className="text-lg md:text-xl font-light leading-relaxed italic mb-4">
              &ldquo;{dailyHadith.text}&rdquo;
            </blockquote>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500">{dailyHadith.narrator}</span>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500">{dailyHadith.source}</span>
            </div>
          </div>

          {hadiths.map(hadith => (
            <div key={hadith.id} className="glass-card p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <span>📜</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">{hadith.topic}</span>
              </div>
              <blockquote className="text-gray-700 dark:text-gray-300 leading-relaxed italic mb-3">
                &ldquo;{hadith.text}&rdquo;
              </blockquote>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">{hadith.narrator}</span>
                <span className="px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">{hadith.source}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reminders Section */}
      {activeTab === 'reminders' && (
        <div className="grid md:grid-cols-2 gap-4">
          {reminders.map((reminder, i) => (
            <div key={i} className="glass-card p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="text-5xl mb-4">{reminder.icon}</div>
              <h3 className="text-xl font-bold mb-3">{reminder.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 italic leading-relaxed">{reminder.text}</p>
            </div>
          ))}
          {/* Extra reminder cards */}
          <div className="glass-card p-8 text-center bg-gradient-to-br from-emerald-500/5 to-teal-500/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-5xl mb-4">📖</div>
            <h3 className="text-xl font-bold mb-3">Read Quran Daily</h3>
            <p className="text-gray-500 dark:text-gray-400 italic leading-relaxed">
              &ldquo;The best of you are those who learn the Quran and teach it.&rdquo; — Prophet Muhammad ﷺ
            </p>
          </div>
          <div className="glass-card p-8 text-center bg-gradient-to-br from-amber-500/5 to-yellow-500/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-5xl mb-4">🕌</div>
            <h3 className="text-xl font-bold mb-3">Never Miss a Prayer</h3>
            <p className="text-gray-500 dark:text-gray-400 italic leading-relaxed">
              &ldquo;Indeed, prayer prohibits immorality and wrongdoing.&rdquo; — Quran 29:45
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
