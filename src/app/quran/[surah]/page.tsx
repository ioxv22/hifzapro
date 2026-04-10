'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { surahs, reciters, fetchSurah } from '@/lib/quranData';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { getProgress, saveProgress } from '@/lib/store';

interface Ayah {
  number: number;
  text: string;
}

export default function SurahPage() {
  const params = useParams();
  const surahNumber = parseInt(params.surah as string);
  const surahInfo = surahs.find(s => s.number === surahNumber);
  const { user } = useAuth();
  const { t, langInfo } = useLanguage();
  const { play: globalPlay, state: playerState, pause: globalPause } = useAudioPlayer();

  const [arabic, setArabic] = useState<Ayah[]>([]);
  const [translation, setTranslation] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReciter, setSelectedReciter] = useState(reciters[0].id);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [fontSize, setFontSize] = useState(28);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch surah with language-specific translation
  useEffect(() => {
    setLoading(true);
    fetchSurah(surahNumber, langInfo.quranTranslation).then(data => {
      setArabic(data.arabic);
      setTranslation(data.translation);
      setLoading(false);
    });
  }, [surahNumber, langInfo.quranTranslation]);

  // Load bookmarks
  useEffect(() => {
    if (user) {
      const progress = getProgress(user.id);
      const marks = new Set(
        progress.quranBookmarks
          .filter(b => b.surah === surahNumber)
          .map(b => b.ayah)
      );
      setBookmarked(marks);
    }
  }, [user, surahNumber]);

  const saveLastRead = useCallback((ayahNumber: number) => {
    if (!user) return;
    const progress = getProgress(user.id);
    progress.quranLastRead = { surah: surahNumber, ayah: ayahNumber };
    saveProgress(user.id, progress);
  }, [user, surahNumber]);

  const toggleBookmark = (ayahNumber: number) => {
    if (!user) return;
    const progress = getProgress(user.id);
    const exists = progress.quranBookmarks.findIndex(b => b.surah === surahNumber && b.ayah === ayahNumber);
    if (exists >= 0) {
      progress.quranBookmarks.splice(exists, 1);
      setBookmarked(prev => { const n = new Set(prev); n.delete(ayahNumber); return n; });
    } else {
      progress.quranBookmarks.push({ surah: surahNumber, ayah: ayahNumber, surahName: surahInfo?.name.replace('سورة ', '') || '', date: new Date().toISOString() });
      setBookmarked(prev => new Set(prev).add(ayahNumber));
    }
    saveProgress(user.id, progress);
  };

  const toggleFavorite = (ayahNumber: number) => {
    if (!user) return;
    const progress = getProgress(user.id);
    const ayah = arabic.find(a => a.number === ayahNumber);
    const trans = translation.find(a => a.number === ayahNumber);
    if (!ayah) return;
    const exists = progress.favoriteAyahs.findIndex(f => f.surah === surahNumber && f.ayah === ayahNumber);
    if (exists >= 0) {
      progress.favoriteAyahs.splice(exists, 1);
    } else {
      progress.favoriteAyahs.push({ surah: surahNumber, ayah: ayahNumber, text: ayah.text, translation: trans?.text || '' });
    }
    saveProgress(user.id, progress);
  };

  // Play single ayah locally
  const playAyah = async (ayahNumber: number) => {
    if (audioRef.current) audioRef.current.pause();
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/${selectedReciter}`);
      const data = await res.json();
      const audioUrl = data.data.audio;
      if (audioUrl) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.play();
        setPlayingAyah(ayahNumber);
        audioRef.current.onended = () => setPlayingAyah(null);
      }
    } catch (e) { console.error('Audio error:', e); }
    saveLastRead(ayahNumber);
  };

  const stopAudio = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setPlayingAyah(null);
  };

  // Play entire surah via global player
  const playSurahFromAyah = (ayahNumber: number) => {
    const reciter = reciters.find(r => r.id === selectedReciter) || reciters[0];
    globalPlay({
      surahNumber,
      surahName: surahInfo?.name.replace('سورة ', '') || '',
      ayahNumber,
      totalAyahs: surahInfo?.numberOfAyahs || 0,
      reciterId: selectedReciter,
      reciterName: reciter.name,
    });
    saveLastRead(ayahNumber);
  };

  if (!surahInfo) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Surah not found</h1>
        <Link href="/quran" className="text-emerald-500 hover:underline">← {t('backToSurahs')}</Link>
      </div>
    );
  }

  return (
    <div className="page-transition max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/quran" className="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-500 transition-colors">
          ← {t('backToSurahs')}
        </Link>
        <div className="flex items-center gap-2">
          {surahNumber > 1 && (
            <Link href={`/quran/${surahNumber - 1}`} className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              ← {t('prev')}
            </Link>
          )}
          {surahNumber < 114 && (
            <Link href={`/quran/${surahNumber + 1}`} className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              {t('next')} →
            </Link>
          )}
        </div>
      </div>

      {/* Surah Header */}
      <div className="glass-card p-8 mb-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 gradient-islamic opacity-5" />
        <div className="relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary text-white font-bold text-xl mb-4 shadow-lg shadow-emerald-500/20">
            {surahInfo.number}
          </div>
          <h1 className="font-arabic text-4xl md:text-5xl text-emerald-600 dark:text-emerald-400 mb-2">سورة {surahInfo.name.replace('سورة ', '')}</h1>
          <div className="flex items-center justify-center gap-3 mt-3 text-xs text-gray-500">
            <span className={`px-2 py-1 rounded-full ${surahInfo.revelationType === 'Meccan' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'}`}>
              {surahInfo.revelationType}
            </span>
            <span>{surahInfo.numberOfAyahs} {t('ayahs')}</span>
          </div>
          {/* Play entire surah button */}
          <button
            onClick={() => playSurahFromAyah(1)}
            className="mt-4 px-6 py-2.5 rounded-xl gradient-primary text-white text-sm font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all inline-flex items-center gap-2"
          >
            ▶ {t('play')} سورة {surahInfo.name.replace('سورة ', '')}
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-card p-4 mb-6 flex flex-wrap items-center gap-4">
        <select
          value={selectedReciter}
          onChange={(e) => { stopAudio(); setSelectedReciter(e.target.value); }}
          className="flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm outline-none border border-gray-200 dark:border-gray-700"
        >
          {reciters.map(r => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>

        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${showTranslation ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-800'}`}
        >
          🌐 {showTranslation ? t('translationOn') : t('translationOff')}
        </button>

        <div className="flex items-center gap-2">
          <button onClick={() => setFontSize(Math.max(18, fontSize - 2))} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-bold">A-</button>
          <button onClick={() => setFontSize(Math.min(48, fontSize + 2))} className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-bold">A+</button>
        </div>
      </div>

      {/* Bismillah */}
      {surahNumber !== 1 && surahNumber !== 9 && (
        <div className="text-center py-6 mb-6">
          <p className="font-arabic text-2xl md:text-3xl text-emerald-600 dark:text-emerald-400" style={{ lineHeight: 2.5 }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      )}

      {/* Ayahs */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-card p-6 animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {arabic.map((ayah, index) => {
            const isGlobalPlaying = playerState.surahNumber === surahNumber && playerState.ayahNumber === ayah.number && playerState.isPlaying;
            return (
              <div
                key={ayah.number}
                className={`glass-card p-6 transition-all duration-300 ${
                  playingAyah === ayah.number || isGlobalPlaying ? 'ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/10' : ''
                }`}
                id={`ayah-${ayah.number}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xs font-bold">{ayah.number}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => playingAyah === ayah.number ? stopAudio() : playAyah(ayah.number)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${playingAyah === ayah.number ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-emerald-500/10'}`}
                      title={t('play')}
                    >
                      {playingAyah === ayah.number ? '⏸' : '▶'}
                    </button>
                    <button
                      onClick={() => playSurahFromAyah(ayah.number)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-gray-100 dark:bg-gray-800 hover:bg-emerald-500/10 transition-all"
                      title="Play from here (global)"
                    >
                      🔊
                    </button>
                    {user && (
                      <>
                        <button
                          onClick={() => toggleBookmark(ayah.number)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${bookmarked.has(ayah.number) ? 'bg-amber-500/20 text-amber-500' : 'bg-gray-100 dark:bg-gray-800 hover:bg-amber-500/10'}`}
                          title={t('bookmark')}
                        >
                          🔖
                        </button>
                        <button
                          onClick={() => toggleFavorite(ayah.number)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-gray-100 dark:bg-gray-800 hover:bg-red-500/10 transition-all"
                          title={t('favorite')}
                        >
                          ❤️
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <p className="arabic-text text-right leading-loose mb-4" style={{ fontSize: `${fontSize}px` }}>
                  {ayah.text}
                </p>

                {showTranslation && translation[index] && (
                  <p className={`text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4 ${langInfo.dir === 'rtl' ? 'text-right' : ''}`}>
                    {translation[index].text}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom navigation */}
      <div className="flex items-center justify-between mt-8 mb-8">
        {surahNumber > 1 ? (
          <Link href={`/quran/${surahNumber - 1}`} className="px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            ← سورة {surahs[surahNumber - 2]?.name.replace('سورة ', '')}
          </Link>
        ) : <div />}
        {surahNumber < 114 ? (
          <Link href={`/quran/${surahNumber + 1}`} className="px-6 py-3 rounded-xl gradient-primary text-white font-medium hover:shadow-lg transition-all">
            سورة {surahs[surahNumber]?.name.replace('سورة ', '')} →
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
