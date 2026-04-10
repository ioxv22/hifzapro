'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getProgress } from '@/lib/store';
import { surahs } from '@/lib/quranData';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [progress, setProgress] = useState<ReturnType<typeof getProgress> | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
    if (user) {
      setProgress(getProgress(user.id));
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || !progress) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  const totalDhikr = Object.values(progress.dhikrCount).reduce((a, b) => a + b, 0);
  const totalQuizzes = progress.quizScores.length;
  const avgQuizScore = totalQuizzes > 0
    ? Math.round(progress.quizScores.reduce((a, s) => a + (s.score / s.total) * 100, 0) / totalQuizzes)
    : 0;
  const lastRead = progress.quranLastRead;
  const lastReadSurah = lastRead ? surahs.find(s => s.number === lastRead.surah) : null;

  const streakDays = progress.streak || 0;
  const streakEmoji = streakDays >= 30 ? '🔥🔥🔥' : streakDays >= 7 ? '🔥🔥' : streakDays >= 1 ? '🔥' : '❄️';

  return (
    <div className="page-transition max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">
          Assalamu Alaikum, <span className="text-gradient">{user.name}</span>! 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Here&apos;s your spiritual journey overview</p>
      </div>

      {/* Streak Banner */}
      <div className="glass-card p-6 mb-8 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 border-amber-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold mb-1">{streakEmoji} {streakDays} Day Streak</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Keep going! Consistency is key to spiritual growth.</p>
          </div>
          <div className="hidden sm:block text-6xl">{streakDays >= 7 ? '🏆' : '⭐'}</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
            <span className="text-lg">📖</span>
          </div>
          <p className="text-2xl font-bold">{progress.quranBookmarks.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Bookmarks</p>
        </div>
        <div className="glass-card p-5">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-3">
            <span className="text-lg">📿</span>
          </div>
          <p className="text-2xl font-bold">{totalDhikr}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Dhikr</p>
        </div>
        <div className="glass-card p-5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-3">
            <span className="text-lg">🧠</span>
          </div>
          <p className="text-2xl font-bold">{totalQuizzes}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Quizzes Taken</p>
        </div>
        <div className="glass-card p-5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
            <span className="text-lg">🎯</span>
          </div>
          <p className="text-2xl font-bold">{avgQuizScore}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg Quiz Score</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Continue Reading */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">📖 Quran Progress</h3>
          {lastReadSurah ? (
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Last Read</p>
              <p className="font-bold font-arabic text-xl text-emerald-600 dark:text-emerald-400">سورة {lastReadSurah.name.replace('سورة ', '')}</p>
              <p className="text-sm text-gray-500">Ayah {lastRead?.ayah}</p>
              <Link href={`/quran/${lastRead?.surah}`} className="inline-flex items-center gap-1 mt-3 px-4 py-2 rounded-lg gradient-primary text-white text-sm font-medium hover:shadow-lg transition-all">
                Continue Reading →
              </Link>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No reading history yet. Start reading!</p>
          )}

          {/* Bookmarks */}
          {progress.quranBookmarks.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Bookmarks</p>
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                {progress.quranBookmarks.slice(-5).reverse().map((b, i) => (
                  <Link
                    key={i}
                    href={`/quran/${b.surah}#ayah-${b.ayah}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                  >
                    <span className="font-arabic">سورة {b.surahName.replace('سورة ', '')} - آية {b.ayah}</span>
                    <span className="text-gray-400">🔖</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dhikr Progress */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">📿 Today&apos;s Dhikr</h3>
          <div className="space-y-3">
            {Object.entries(progress.dhikrCount).map(([key, count]) => {
              const goal = progress.dhikrGoals[key] || 33;
              const pct = Math.min((count / goal) * 100, 100);
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-xs text-gray-500">{count}/{goal}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div className="h-full rounded-full gradient-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <Link href="/dhikr" className="inline-flex items-center gap-1 mt-4 text-sm text-emerald-500 font-medium hover:underline">
            Open Counter →
          </Link>
        </div>

        {/* Quiz History */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">🧠 Quiz History</h3>
          {progress.quizScores.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
              {progress.quizScores.slice(-8).reverse().map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm">
                  <div>
                    <span className="font-medium">{s.category}</span>
                    <span className="text-xs text-gray-500 ml-2">{new Date(s.date).toLocaleDateString()}</span>
                  </div>
                  <span className={`font-bold ${(s.score / s.total) >= 0.7 ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {s.score}/{s.total}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No quizzes taken yet.</p>
          )}
          <Link href="/quiz" className="inline-flex items-center gap-1 mt-4 text-sm text-emerald-500 font-medium hover:underline">
            Take a Quiz →
          </Link>
        </div>

        {/* Favorite Ayahs */}
        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">❤️ Favorite Ayahs</h3>
          {progress.favoriteAyahs.length > 0 ? (
            <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-thin">
              {progress.favoriteAyahs.slice(-5).reverse().map((f, i) => (
                <div key={i} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <p className="font-arabic text-sm text-emerald-600 dark:text-emerald-400 text-right mb-1" style={{ lineHeight: 2 }}>{f.text.slice(0, 80)}...</p>
                  <p className="text-xs text-gray-500 font-arabic">سورة {surahs[f.surah - 1]?.name.replace('سورة ', '')} : {f.ayah}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No favorite ayahs yet. Heart ayahs while reading!</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/quran', icon: '📖', label: 'Read Quran' },
            { href: '/dhikr', icon: '📿', label: 'Dhikr Counter' },
            { href: '/prayer-times', icon: '🕌', label: 'Prayer Times' },
            { href: '/quiz', icon: '🧠', label: 'Take Quiz' },
          ].map(action => (
            <Link
              key={action.href}
              href={action.href}
              className="glass-card p-4 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <span className="text-2xl">{action.icon}</span>
              <p className="text-sm font-medium mt-1">{action.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
