'use client';
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface PrayerTime {
  name: string;
  time: string;
  arabicName: string;
  icon: string;
}

function calculateQibla(lat: number, lng: number): number {
  const meccaLat = 21.4225 * (Math.PI / 180);
  const meccaLng = 39.8262 * (Math.PI / 180);
  const userLat = lat * (Math.PI / 180);
  const userLng = lng * (Math.PI / 180);
  const dLng = meccaLng - userLng;
  const x = Math.sin(dLng);
  const y = Math.cos(userLat) * Math.tan(meccaLat) - Math.sin(userLat) * Math.cos(dLng);
  let angle = Math.atan2(x, y) * (180 / Math.PI);
  return (angle + 360) % 360;
}

const emirates = [
  { id: 'abudhabi', name: 'أبوظبي', nameEn: 'Abu Dhabi', lat: 24.4539, lng: 54.3773 },
  { id: 'dubai', name: 'دبي', nameEn: 'Dubai', lat: 25.2048, lng: 55.2708 },
  { id: 'sharjah', name: 'الشارقة', nameEn: 'Sharjah', lat: 25.3463, lng: 55.4209 },
  { id: 'ajman', name: 'عجمان', nameEn: 'Ajman', lat: 25.4052, lng: 55.5136 },
  { id: 'ummalquwain', name: 'أم القيوين', nameEn: 'Umm Al Quwain', lat: 25.5647, lng: 55.5552 },
  { id: 'rasalkhaimah', name: 'رأس الخيمة', nameEn: 'Ras Al Khaimah', lat: 25.7895, lng: 55.9432 },
  { id: 'fujairah', name: 'الفجيرة', nameEn: 'Fujairah', lat: 25.1288, lng: 56.3265 },
];

export default function PrayerTimesPage() {
  const { t, lang } = useLanguage();
  const [prayers, setPrayers] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmirate, setSelectedEmirate] = useState(emirates[1]); // Default to Dubai
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextPrayer, setNextPrayer] = useState<string>('');
  const [hijriDate, setHijriDate] = useState('');
  const [error, setError] = useState('');
  const [qiblaAngle, setQiblaAngle] = useState(0);
  const [activeTab, setActiveTab] = useState<'prayer' | 'qibla'>('prayer');

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPrayers = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const res = await fetch(`https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${selectedEmirate.lat}&longitude=${selectedEmirate.lng}&method=2`);
        const data = await res.json();
        const timings = data.data.timings;
        setPrayers([
          { name: 'Fajr', time: timings.Fajr, arabicName: 'الفجر', icon: '🌅' },
          { name: 'Sunrise', time: timings.Sunrise, arabicName: 'الشروق', icon: '☀️' },
          { name: 'Dhuhr', time: timings.Dhuhr, arabicName: 'الظهر', icon: '🌤' },
          { name: 'Asr', time: timings.Asr, arabicName: 'العصر', icon: '⛅' },
          { name: 'Maghrib', time: timings.Maghrib, arabicName: 'المغرب', icon: '🌅' },
          { name: 'Isha', time: timings.Isha, arabicName: 'العشاء', icon: '🌙' },
        ]);
        const hijri = data.data.date.hijri;
        setHijriDate(`${hijri.day} ${hijri.month.ar} ${hijri.year}`);
        
        // Calculate Qibla
        const angle = calculateQibla(selectedEmirate.lat, selectedEmirate.lng);
        setQiblaAngle(angle);
      } catch (err) {
        console.error('Prayer times error:', err);
        setError('Failed to load prayer times.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrayers();
  }, [selectedEmirate]);

  useEffect(() => {
    if (prayers.length === 0) return;
    const now = currentTime;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    for (const prayer of prayers) {
      if (prayer.name === 'Sunrise') continue;
      const [h, m] = prayer.time.split(':').map(Number);
      if (h * 60 + m > nowMinutes) { setNextPrayer(prayer.name); return; }
    }
    setNextPrayer('Fajr');
  }, [prayers, currentTime]);

  const getTimeUntilNext = () => {
    if (!nextPrayer || prayers.length === 0) return '';
    const prayer = prayers.find(p => p.name === nextPrayer);
    if (!prayer) return '';
    const [h, m] = prayer.time.split(':').map(Number);
    let diff = (h * 60 + m) - (currentTime.getHours() * 60 + currentTime.getMinutes());
    if (diff < 0) diff += 24 * 60;
    const hours = Math.floor(diff / 60);
    const mins = diff % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="page-transition max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-display mb-3">
          🕌 <span className="text-gradient">مواقيت الصلاة في الإمارات</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Prayer Times in UAE</p>
      </div>

      {/* Emirates Selector */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {emirates.map((emirate) => (
          <button
            key={emirate.id}
            onClick={() => setSelectedEmirate(emirate)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              selectedEmirate.id === emirate.id
                ? 'gradient-primary text-white shadow-lg shadow-emerald-500/25'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:text-emerald-500'
            }`}
          >
            {lang === 'ar' ? emirate.name : emirate.nameEn}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 justify-center">
        <button onClick={() => setActiveTab('prayer')} className={`px-5 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'prayer' ? 'gradient-primary text-white shadow-lg' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}>
          🕌 {t('prayerTimes')}
        </button>
        <button onClick={() => setActiveTab('qibla')} className={`px-5 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'qibla' ? 'gradient-primary text-white shadow-lg' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}>
          🧭 {t('qiblaDirection')}
        </button>
      </div>

      {/* Clock & Date */}
      <div className="glass-card p-8 mb-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 gradient-islamic opacity-5" />
        <div className="relative">
          <div className="text-5xl md:text-6xl font-bold font-display mb-2 text-gradient" dir="ltr">
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-1">
            {currentTime.toLocaleDateString(lang === 'ar' ? 'ar-AE' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          {hijriDate && <p className="text-emerald-500 text-sm font-medium font-arabic text-lg">📅 {hijriDate} هـ</p>}
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-3">📍 {lang === 'ar' ? selectedEmirate.name : selectedEmirate.nameEn}, UAE</p>
        </div>
      </div>

      {activeTab === 'prayer' && (
        <>
          {/* Next Prayer */}
          {nextPrayer && (
            <div className="glass-card p-6 mb-8 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">{t('nextPrayer')}</p>
                  <p className="text-2xl font-bold">{lang === 'ar' ? prayers.find(p => p.name === nextPrayer)?.arabicName : nextPrayer}</p>
                </div>
                <div className={lang === 'ar' ? 'text-left' : 'text-right'}>
                  <p className="text-sm text-gray-500 mb-1">{t('timeRemaining')}</p>
                  <p className="text-2xl font-bold text-gradient" dir="ltr">{getTimeUntilNext()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Prayer List */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card p-6 animate-pulse flex items-center justify-between">
                  <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" /><div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" /></div>
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="glass-card p-8 text-center text-red-500">{error}</div>
          ) : (
            <div className="space-y-3">
              {prayers.map((prayer) => {
                const isNext = prayer.name === nextPrayer;
                return (
                  <div key={prayer.name} className={`glass-card p-5 flex items-center justify-between transition-all duration-300 ${isNext ? 'prayer-active border-emerald-500/30' : ''} ${prayer.name === 'Sunrise' ? 'opacity-70' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${isNext ? 'gradient-primary text-white shadow-lg shadow-emerald-500/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                        {prayer.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${isNext ? 'text-emerald-500' : ''}`}>
                            {lang === 'ar' ? prayer.arabicName : prayer.name}
                          </h3>
                          {isNext && <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-medium">NEXT</span>}
                        </div>
                        <p className={`text-sm text-gray-500 dark:text-gray-400 ${lang === 'ar' ? 'font-display' : 'font-arabic'}`}>
                          {lang === 'ar' ? prayer.name : prayer.arabicName}
                        </p>
                      </div>
                    </div>
                    <div className={`text-xl font-bold font-display ${isNext ? 'text-emerald-500' : ''}`} dir="ltr">{prayer.time}</div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Qibla Tab */}
      {activeTab === 'qibla' && (
        <div className="glass-card p-8 text-center">
          <h2 className="text-xl font-bold mb-2">🧭 {t('qiblaDirection')}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">{t('qiblaDesc')}</p>

          {/* Compass */}
          <div className="relative w-72 h-72 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
              <div key={deg} className="absolute inset-0" style={{ transform: `rotate(${deg}deg)` }}>
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>
            ))}
            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-sm font-bold text-red-500">N</span>
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-400">S</span>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">W</span>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">E</span>
            
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20" />
            
            <div className="absolute inset-0 transition-transform duration-700" style={{ transform: `rotate(${qiblaAngle}deg)` }}>
              <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="text-2xl">🕋</div>
                <div className="w-1 h-24 bg-gradient-to-b from-emerald-500 to-transparent rounded-full" />
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full gradient-primary shadow-lg shadow-emerald-500/30" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-lg font-bold" dir="ltr">{qiblaAngle.toFixed(1)}° from North</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">🕋 Direction to Makkah Al-Mukarramah</p>
            <p className="text-xs text-gray-400 font-bold">From: {lang === 'ar' ? selectedEmirate.name : selectedEmirate.nameEn}, UAE</p>
          </div>
        </div>
      )}
    </div>
  );
}
