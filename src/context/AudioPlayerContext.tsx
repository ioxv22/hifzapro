'use client';
import React, { createContext, useContext, useState, useRef, useEffect, ReactNode, useCallback } from 'react';

interface AudioState {
  isPlaying: boolean;
  surahNumber: number | null;
  surahName: string;
  ayahNumber: number;
  totalAyahs: number;
  reciterId: string;
  reciterName: string;
  audioUrl: string;
  progress: number;
  duration: number;
  currentTime: number;
}

interface AudioPlayerContextType {
  state: AudioState;
  play: (opts: { surahNumber: number; surahName: string; ayahNumber: number; totalAyahs: number; reciterId: string; reciterName: string }) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  nextAyah: () => void;
  prevAyah: () => void;
  seek: (time: number) => void;
  setReciter: (id: string, name: string) => void;
  isVisible: boolean;
  setIsVisible: (v: boolean) => void;
}

const defaultState: AudioState = {
  isPlaying: false,
  surahNumber: null,
  surahName: '',
  ayahNumber: 1,
  totalAyahs: 0,
  reciterId: 'ar.alafasy',
  reciterName: 'Mishary Rashid Alafasy',
  audioUrl: '',
  progress: 0,
  duration: 0,
  currentTime: 0,
};

const AudioPlayerContext = createContext<AudioPlayerContextType>({
  state: defaultState,
  play: () => {},
  pause: () => {},
  resume: () => {},
  stop: () => {},
  nextAyah: () => {},
  prevAyah: () => {},
  seek: () => {},
  setReciter: () => {},
  isVisible: false,
  setIsVisible: () => {},
});

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AudioState>(defaultState);
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const loadAndPlay = useCallback(async (surahNumber: number, ayahNumber: number, reciterId: string) => {
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/${reciterId}`);
      const data = await res.json();
      const audioUrl = data.data?.audio;
      if (!audioUrl) return;

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute('src');
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.addEventListener('timeupdate', () => {
        setState(prev => ({
          ...prev,
          currentTime: audio.currentTime,
          duration: audio.duration || 0,
          progress: audio.duration ? (audio.currentTime / audio.duration) * 100 : 0,
        }));
      });

      audio.addEventListener('ended', () => {
        const cur = stateRef.current;
        if (cur.ayahNumber < cur.totalAyahs) {
          const nextAyah = cur.ayahNumber + 1;
          setState(prev => ({ ...prev, ayahNumber: nextAyah }));
          loadAndPlay(cur.surahNumber!, nextAyah, cur.reciterId);
        } else {
          setState(prev => ({ ...prev, isPlaying: false }));
        }
      });

      audio.addEventListener('loadedmetadata', () => {
        setState(prev => ({ ...prev, duration: audio.duration }));
      });

      await audio.play();
      setState(prev => ({ ...prev, isPlaying: true, audioUrl }));
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  }, []);

  const play = useCallback((opts: { surahNumber: number; surahName: string; ayahNumber: number; totalAyahs: number; reciterId: string; reciterName: string }) => {
    setState(prev => ({
      ...prev,
      ...opts,
      isPlaying: true,
      progress: 0,
      currentTime: 0,
      duration: 0,
    }));
    setIsVisible(true);
    loadAndPlay(opts.surahNumber, opts.ayahNumber, opts.reciterId);
  }, [loadAndPlay]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const resume = useCallback(() => {
    audioRef.current?.play();
    setState(prev => ({ ...prev, isPlaying: true }));
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
    }
    setState(defaultState);
    setIsVisible(false);
  }, []);

  const nextAyah = useCallback(() => {
    const s = stateRef.current;
    if (s.surahNumber && s.ayahNumber < s.totalAyahs) {
      const next = s.ayahNumber + 1;
      setState(prev => ({ ...prev, ayahNumber: next }));
      loadAndPlay(s.surahNumber, next, s.reciterId);
    }
  }, [loadAndPlay]);

  const prevAyah = useCallback(() => {
    const s = stateRef.current;
    if (s.surahNumber && s.ayahNumber > 1) {
      const prev = s.ayahNumber - 1;
      setState(p => ({ ...p, ayahNumber: prev }));
      loadAndPlay(s.surahNumber, prev, s.reciterId);
    }
  }, [loadAndPlay]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const setReciter = useCallback((id: string, name: string) => {
    setState(prev => ({ ...prev, reciterId: id, reciterName: name }));
    const s = stateRef.current;
    if (s.surahNumber) {
      loadAndPlay(s.surahNumber, s.ayahNumber, id);
    }
  }, [loadAndPlay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <AudioPlayerContext.Provider value={{ state, play, pause, resume, stop, nextAyah, prevAyah, seek, setReciter, isVisible, setIsVisible }}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  return useContext(AudioPlayerContext);
}
