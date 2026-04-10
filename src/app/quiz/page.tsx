'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { quizQuestions, quizCategories, QuizQuestion } from '@/lib/quizData';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getProgress, saveProgress } from '@/lib/store';

type QuizState = 'menu' | 'playing' | 'result';

export default function QuizPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [state, setState] = useState<QuizState>('menu');
  const [category, setCategory] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const questions = useMemo(() => {
    const filtered = category === 'All' ? quizQuestions : quizQuestions.filter(q => q.category === category);
    return [...filtered].sort(() => Math.random() - 0.5).slice(0, 10);
  }, [category, state]); // re-shuffle on new game

  const currentQuestion = questions[currentIndex];
  const progress = useMemo(() => ((currentIndex) / questions.length) * 100, [currentIndex, questions.length]);

  const startQuiz = (cat: string) => {
    setCategory(cat);
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setAnswers([]);
    setShowExplanation(false);
    setState('playing');
  };

  const selectAnswer = useCallback((index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setShowExplanation(true);
    if (index === currentQuestion.correct) {
      setScore(prev => prev + 1);
    }
    setAnswers(prev => [...prev, index]);
  }, [selected, currentQuestion]);

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      // Save score
      if (user) {
        const prog = getProgress(user.id);
        prog.quizScores.push({
          date: new Date().toISOString(),
          score: score + (selected === currentQuestion.correct ? 0 : 0), // already counted
          total: questions.length,
          category,
        });
        prog.totalQuizScore += score;
        saveProgress(user.id, prog);
      }
      setState('result');
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  };

  const getScoreMessage = () => {
    const pct = (score / questions.length) * 100;
    if (pct === 100) return { emoji: '🏆', msg: 'Perfect Score! MashaAllah!' };
    if (pct >= 80) return { emoji: '🌟', msg: 'Excellent! Keep it up!' };
    if (pct >= 60) return { emoji: '👍', msg: 'Good effort! Keep learning!' };
    if (pct >= 40) return { emoji: '📚', msg: 'Keep studying, you\'ll improve!' };
    return { emoji: '💪', msg: 'Don\'t give up! Try again!' };
  };

  // Past scores
  const pastScores = useMemo(() => {
    if (!user) return [];
    const prog = getProgress(user.id);
    return prog.quizScores.slice(-5).reverse();
  }, [user, state]);

  return (
    <div className="page-transition max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-display mb-3">
          🧠 {t('quizTitle')} <span className="text-gradient">{t('quizWord')}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{t('quizDesc')}</p>
      </div>

      {/* Menu State */}
      {state === 'menu' && (
        <div>
          {/* Category Selection */}
          <div className="glass-card p-8 mb-8 text-center">
            <h2 className="text-xl font-bold mb-2">{t('chooseCategory')}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{t('selectTopic')}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quizCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => startQuiz(cat)}
                  className="px-4 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-emerald-500/10 hover:border-emerald-500 border border-gray-200 dark:border-gray-700 transition-all duration-200 font-medium text-sm hover:-translate-y-0.5"
                >
                  {cat === 'All' ? '🎯' : cat === 'Quran' ? '📖' : cat === 'Pillars' ? '🕋' : cat === 'Salah' ? '🕌' : cat === 'Prophets' ? '📿' : cat === 'Angels' ? '👼' : '🌟'} {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Past Scores */}
          {pastScores.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="font-bold text-lg mb-4">📊 {t('recentScores')}</h3>
              <div className="space-y-3">
                {pastScores.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div>
                      <span className="font-medium text-sm">{s.category}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {new Date(s.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className={`font-bold ${(s.score / s.total) >= 0.7 ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {s.score}/{s.total}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Playing State */}
      {state === 'playing' && currentQuestion && (
        <div>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="text-gray-500">{t('question')} {currentIndex + 1} of {questions.length}</span>
              <span className="font-medium text-emerald-500">{t('score')}: {score}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className="h-full rounded-full gradient-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="glass-card p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-medium">{currentQuestion.category}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-8 leading-relaxed">{currentQuestion.question}</h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                let optionClass = 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:bg-emerald-500/5 cursor-pointer';

                if (selected !== null) {
                  if (index === currentQuestion.correct) {
                    optionClass = 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400';
                  } else if (index === selected && selected !== currentQuestion.correct) {
                    optionClass = 'bg-red-500/10 border-red-500 text-red-700 dark:text-red-400';
                  } else {
                    optionClass = 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50';
                  }
                }

                return (
                  <button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    disabled={selected !== null}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${optionClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-sm font-bold shrink-0">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="font-medium">{option}</span>
                      {selected !== null && index === currentQuestion.correct && (
                        <span className="ml-auto text-emerald-500">✓</span>
                      )}
                      {selected !== null && index === selected && selected !== currentQuestion.correct && (
                        <span className="ml-auto text-red-500">✕</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explanation */}
          {showExplanation && currentQuestion.explanation && (
            <div className="glass-card p-6 mb-6 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border-blue-500/20">
              <div className="flex items-start gap-3">
                <span className="text-xl">💡</span>
                <div>
                  <p className="font-medium text-sm mb-1">{t('explanation')}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{currentQuestion.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Next Button */}
          {selected !== null && (
            <button
              onClick={nextQuestion}
              className="w-full py-4 rounded-xl gradient-primary text-white font-semibold text-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
            >
              {currentIndex + 1 >= questions.length ? `📊 ${t('seeResults')}` : `${t('nextQuestion')} →`}
            </button>
          )}
        </div>
      )}

      {/* Result State */}
      {state === 'result' && (
        <div className="glass-card p-8 md:p-12 text-center">
          <div className="text-6xl mb-4">{getScoreMessage().emoji}</div>
          <h2 className="text-3xl font-bold mb-2">{getScoreMessage().msg}</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">You scored</p>

          {/* Score Circle */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-200 dark:text-gray-700" />
              <circle
                cx="60" cy="60" r="54"
                fill="none" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 54}`}
                strokeDashoffset={`${2 * Math.PI * 54 * (1 - score / questions.length)}`}
                className={`transition-all duration-1000 ${(score / questions.length) >= 0.7 ? 'text-emerald-500' : 'text-amber-500'}`}
                stroke="currentColor"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{score}</span>
              <span className="text-gray-500">/ {questions.length}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => startQuiz(category)}
              className="px-8 py-3 rounded-xl gradient-primary text-white font-medium hover:shadow-lg transition-all"
            >
              🔄 {t('tryAgain')}
            </button>
            <button
              onClick={() => setState('menu')}
              className="px-8 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              📋 {t('categories')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
