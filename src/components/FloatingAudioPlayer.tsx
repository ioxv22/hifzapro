'use client';
import React from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { useLanguage } from '@/context/LanguageContext';

export default function FloatingAudioPlayer() {
  const { state, pause, resume, stop, nextAyah, prevAyah, seek, isVisible } = useAudioPlayer();
  const { t } = useLanguage();

  if (!isVisible || !state.surahNumber) return null;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 md:bottom-4 left-0 right-0 md:left-4 md:right-4 z-40 md:max-w-2xl md:mx-auto mb-[60px] md:mb-0">
      <div className="glass-card p-3 md:p-4 shadow-2xl border-t md:border border-emerald-500/20 mx-0 md:mx-auto">
        {/* Progress bar */}
        <div
          className="w-full h-1 rounded-full bg-gray-200 dark:bg-gray-700 mb-3 cursor-pointer group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            seek(pct * state.duration);
          }}
        >
          <div
            className="h-full rounded-full gradient-primary transition-all duration-200 relative"
            style={{ width: `${state.progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">
              {state.surahName}
              <span className="text-emerald-500 ml-1">:{state.ayahNumber}</span>
            </p>
            <p className="text-xs text-gray-500 truncate">{state.reciterName}</p>
          </div>

          {/* Time */}
          <span className="text-xs text-gray-500 hidden sm:block">
            {formatTime(state.currentTime)} / {formatTime(state.duration)}
          </span>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={prevAyah}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
              title="Previous ayah"
            >
              ⏮
            </button>
            <button
              onClick={state.isPlaying ? pause : resume}
              className="w-10 h-10 rounded-xl gradient-primary text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all text-lg"
            >
              {state.isPlaying ? '⏸' : '▶'}
            </button>
            <button
              onClick={nextAyah}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
              title="Next ayah"
            >
              ⏭
            </button>
            <button
              onClick={stop}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 transition-colors text-sm ml-1"
              title={t('close')}
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
