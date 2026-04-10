'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage, languages, Language } from '@/context/LanguageContext';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, lang, setLang, dir } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('home'), icon: '🏠' },
    { href: '/quran', label: t('quran'), icon: '📖' },
    { href: '/dhikr', label: t('dhikr'), icon: '📿' },
    { href: '/prayer-times', label: t('prayer'), icon: '🕌' },
    { href: '/daily', label: t('daily'), icon: '🌙' },
    { href: '/quiz', label: t('quiz'), icon: '🧠' },
  ];

  const currentLangInfo = languages.find(l => l.code === lang)!;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                <span className="text-white font-bold text-lg">ح</span>
              </div>
              <span className="text-xl font-bold font-display">
                <span className="text-gradient">Hifza</span>
                <span className="text-gradient-gold">Pro</span>
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    pathname === link.href
                      ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  onClick={() => { setLangOpen(!langOpen); setProfileOpen(false); }}
                  className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
                  title={t('language')}
                >
                  {currentLangInfo.flag}
                </button>
                {langOpen && (
                  <div className="absolute right-0 mt-2 w-56 glass-card p-2 shadow-2xl z-50 max-h-80 overflow-y-auto scrollbar-thin">
                    <p className="px-3 py-1.5 text-xs font-medium text-gray-500">{t('selectLanguage')}</p>
                    {languages.map(l => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setLangOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          lang === l.code
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <span className="text-lg">{l.flag}</span>
                        <span className="font-medium">{l.nativeName}</span>
                        <span className="text-xs text-gray-400 ml-auto">{l.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => { setProfileOpen(!profileOpen); setLangOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 glass-card p-2 shadow-2xl z-50">
                      <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm" onClick={() => setProfileOpen(false)}>
                        <span>📊</span> {t('dashboard')}
                      </Link>
                      {user.role === 'admin' && (
                        <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm" onClick={() => setProfileOpen(false)}>
                          <span>⚙️</span> {t('admin')}
                        </Link>
                      )}
                      <hr className="my-1 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors text-sm"
                      >
                        <span>🚪</span> {t('logout')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="px-5 py-2 rounded-xl gradient-primary text-white text-sm font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 hover:-translate-y-0.5"
                >
                  {t('signIn')}
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
              >
                {mobileOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pathname === link.href
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
              {user && (
                <>
                  <hr className="border-gray-200 dark:border-gray-800" />
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <span className="text-lg">📊</span> {t('dashboard')}
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <span className="text-lg">⚙️</span> {t('admin')}
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 dark:border-gray-800/50 pb-safe">
        <div className="flex justify-around py-2">
          {navLinks.slice(0, 5).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
                pathname === link.href
                  ? 'text-emerald-500 dark:text-emerald-400'
                  : 'text-gray-500 dark:text-gray-500'
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
