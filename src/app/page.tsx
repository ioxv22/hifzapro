'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getDailyHadith, getDailyReminders } from '@/lib/dailyContent';

export default function HomePage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const hadith = getDailyHadith();
  const reminders = getDailyReminders();

  const features = [
    { href: '/quran', icon: '📖', title: t('quran'), desc: t('quranSubtitle'), color: 'from-emerald-500 to-teal-600' },
    { href: '/dhikr', icon: '📿', title: `${t('dhikrTitle')} ${t('counter')}`, desc: t('dhikrDesc'), color: 'from-violet-500 to-purple-600' },
    { href: '/prayer-times', icon: '🕌', title: t('prayerTimes'), desc: t('prayerDesc'), color: 'from-amber-500 to-orange-600' },
    { href: '/daily', icon: '🌙', title: `${t('dailyTitle')} ${t('islamicContent')}`, desc: t('dailyDesc'), color: 'from-cyan-500 to-blue-600' },
    { href: '/quiz', icon: '🧠', title: `${t('quizTitle')} ${t('quizWord')}`, desc: t('quizDesc'), color: 'from-rose-500 to-pink-600' },
    { href: '/dashboard', icon: '📊', title: t('dashboard'), desc: t('journeyOverview'), color: 'from-indigo-500 to-blue-600' },
  ];

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-islamic opacity-90" />
        <div className="absolute inset-0 islamic-pattern" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-300/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
          <div className="text-center">
            <p className="font-arabic text-2xl md:text-3xl text-emerald-200/80 mb-6 animate-float">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display text-white mb-6 leading-tight">
              {t('heroTitle1')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200">
                {t('heroTitle2')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-emerald-100/80 max-w-2xl mx-auto mb-10 leading-relaxed">
              {t('heroDesc')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link href="/dashboard" className="px-8 py-4 rounded-2xl bg-white text-emerald-800 font-semibold text-lg hover:bg-emerald-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/20 flex items-center gap-2">
                  📊 {t('goToDashboard')}
                </Link>
              ) : (
                <Link href="/auth" className="px-8 py-4 rounded-2xl bg-white text-emerald-800 font-semibold text-lg hover:bg-emerald-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/20 flex items-center gap-2">
                  🚀 {t('getStarted')}
                </Link>
              )}
              <Link href="/quran" className="px-8 py-4 rounded-2xl border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2">
                📖 {t('readQuran')}
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { value: '114', label: t('surahs') },
                { value: '6,236', label: t('ayahs') },
                { value: '5', label: t('dailyPrayers') },
                { value: '∞', label: t('blessings') },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-emerald-200/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" className="fill-gray-50 dark:fill-gray-950" />
          </svg>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            {t('features')}
            <span className="text-gradient"> {t('spiritualJourney')}</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {t('featuresDesc')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group glass-card p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-500 transition-colors">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              <div className="mt-4 flex items-center gap-2 text-emerald-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {t('explore')} <span>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Hadith of the Day */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-8 md:p-12">
          <div className="absolute inset-0 islamic-pattern opacity-30" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center text-lg">📜</div>
              <h2 className="text-xl font-bold text-white font-display">{t('hadithOfDay')}</h2>
            </div>
            <blockquote className="text-xl md:text-2xl text-gray-200 font-light leading-relaxed mb-6 italic">
              &ldquo;{hadith.text}&rdquo;
            </blockquote>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                {hadith.narrator}
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300">
                {hadith.source}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Reminders */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-bold font-display mb-8 text-center">
          {t('dailyTitle')} <span className="text-gradient">{t('reminders')}</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {reminders.map((reminder, i) => (
            <div key={i} className="glass-card p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">{reminder.icon}</div>
              <h3 className="font-bold text-lg mb-2">{reminder.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed italic">{reminder.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center glass-card p-12 md:p-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            {t('beginJourney')} <span className="text-gradient-gold">{t('today')}</span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-8">
            {t('joinMessage')}
          </p>
          <Link href={user ? '/dashboard' : '/auth'} className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl gradient-primary text-white font-semibold text-lg hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-1">
            {user ? `📊 ${t('viewDashboard')}` : `🌟 ${t('startNow')}`}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">ح</span>
              </div>
              <span className="font-bold font-display">
                <span className="text-gradient">حفظ_</span><span className="text-gradient-gold">Pro</span>
              </span>
            </div>
            <div className="flex flex-col items-end gap-1 text-sm text-gray-500 dark:text-gray-400">
              <p>© 2026 حمد العبدولي. جميع الحقوق محفوظة.</p>
              <a href="https://t.me/iivoz" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-500 transition-colors flex items-center gap-1">
                تواصل عبر تيليجرام <span>💬</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
