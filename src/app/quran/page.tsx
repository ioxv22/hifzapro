'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { surahs } from '@/lib/quranData';
import { useLanguage } from '@/context/LanguageContext';

export default function QuranPage() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'Meccan' | 'Medinan'>('all');

  const filtered = surahs.filter(s => {
    const matchSearch = s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.name.includes(search) ||
      s.number.toString() === search;
    const matchFilter = filter === 'all' || s.revelationType === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="page-transition max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-display mb-3">
          📖 {t('quranTitle')} <span className="text-gradient">{t('quran')}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{t('quranSubtitle')}</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchSurah')}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all', label: t('all') },
            { key: 'Meccan', label: t('meccan') },
            { key: 'Medinan', label: t('medinan') },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as 'all' | 'Meccan' | 'Medinan')}
              className={`px-5 py-3 rounded-xl text-sm font-medium transition-all ${
                filter === f.key ? 'gradient-primary text-white shadow-lg' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('showing')} {filtered.length} {t('of')} 114 {t('surahs')}</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((surah) => (
          <Link
            key={surah.number}
            href={`/quran/${surah.number}`}
            className="glass-card p-5 flex items-center gap-4 group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow shrink-0">
              {surah.number}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold group-hover:text-emerald-500 transition-colors">{surah.englishName}</h3>
                <span className="font-arabic text-emerald-500 text-lg">{surah.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{surah.englishNameTranslation}</span>
                <span>•</span>
                <span>{surah.numberOfAyahs} {t('ayahs').toLowerCase()}</span>
              </div>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                surah.revelationType === 'Meccan'
                  ? 'bg-amber-500/10 text-amber-500'
                  : 'bg-blue-500/10 text-blue-500'
              }`}>
                {surah.revelationType === 'Meccan' ? t('meccan') : t('medinan')}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
