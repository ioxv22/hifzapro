'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { getUsers, saveUsers, getCustomContent, saveCustomContent, getProgress, type CustomContent } from '@/lib/store';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'content'>('stats');
  const [users, setUsersList] = useState<ReturnType<typeof getUsers>>([]);
  const [allProgress, setAllProgress] = useState<Record<string, any>>({});
  const [content, setContent] = useState<CustomContent>({ duas: [], hadiths: [], quizzes: [] });
  const [dataLoading, setDataLoading] = useState(false);
  const [totalVisitors, setTotalVisitors] = useState(0);

  // Content form states
  const [duaForm, setDuaForm] = useState({ title: '', arabic: '', english: '', reference: '' });
  const [hadithForm, setHadithForm] = useState({ text: '', narrator: '', source: '' });
  const [quizForm, setQuizForm] = useState({ question: '', option1: '', option2: '', option3: '', option4: '', correct: 0, category: 'General' });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
      return;
    }
    
    if (user && user.role === 'admin') {
      const fetchFirebaseData = async () => {
        setDataLoading(true);
        try {
          const { collection, getDocs, doc, getDoc } = await import('firebase/firestore');
          const { db } = await import('@/lib/firebase');
          
          // Users
          const usersSnap = await getDocs(collection(db, 'users'));
          const fetchedUsers = usersSnap.docs.map(d => d.data() as ReturnType<typeof getUsers>[0]);
          setUsersList(fetchedUsers.length > 0 ? fetchedUsers : getUsers());
          
          // Progress mapping
          const progSnap = await getDocs(collection(db, 'progress'));
          const progMap: Record<string, any> = {};
          progSnap.docs.forEach(d => { progMap[d.id] = d.data(); });
          setAllProgress(progMap);
          
          // Content
          const contentDoc = await getDoc(doc(db, 'system', 'custom_content'));
          if (contentDoc.exists()) {
             setContent(contentDoc.data() as CustomContent);
          } else {
             setContent(getCustomContent());
          }

          // Stats (Visitors)
          const statsSnap = await getDoc(doc(db, 'system', 'stats'));
          if (statsSnap.exists()) {
            setTotalVisitors(statsSnap.data().totalVisitors || 0);
          } else {
            // Fallback: count documents in visitors collection
            const visitorsSnap = await getDocs(collection(db, 'visitors'));
            setTotalVisitors(visitorsSnap.size);
          }
        } catch (e) {
          console.error("Failed to fetch admin data from Firebase:", e);
          setUsersList(getUsers());
          setContent(getCustomContent());
        }
        setDataLoading(false);
      };
      
      fetchFirebaseData();
    }
  }, [user, authLoading, router]);

  if (authLoading || dataLoading || !user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  const totalDhikr = users.reduce((total, u) => {
    const p = allProgress[u.id] || getProgress(u.id);
    return total + Object.values(p.dhikrCount as Record<string, number>).reduce((a, b) => a + b, 0);
  }, 0);

  const totalQuizzes = users.reduce((total, u) => {
    const p = allProgress[u.id] || getProgress(u.id);
    return total + (p.quizScores ? p.quizScores.length : 0);
  }, 0);

  const activeToday = users.filter(u => {
    const p = allProgress[u.id] || getProgress(u.id);
    return p.lastActiveDate === new Date().toISOString().split('T')[0];
  }).length;

  const addDua = () => {
    if (!duaForm.title || !duaForm.arabic || !duaForm.english) return;
    const newContent = { ...content };
    newContent.duas.push({ ...duaForm, id: crypto.randomUUID() });
    setContent(newContent);
    saveCustomContent(newContent);
    setDuaForm({ title: '', arabic: '', english: '', reference: '' });
  };

  const addHadith = () => {
    if (!hadithForm.text || !hadithForm.narrator) return;
    const newContent = { ...content };
    newContent.hadiths.push({ ...hadithForm, id: crypto.randomUUID() });
    setContent(newContent);
    saveCustomContent(newContent);
    setHadithForm({ text: '', narrator: '', source: '' });
  };

  const addQuiz = () => {
    if (!quizForm.question || !quizForm.option1 || !quizForm.option2) return;
    const newContent = { ...content };
    newContent.quizzes.push({
      id: crypto.randomUUID(),
      question: quizForm.question,
      options: [quizForm.option1, quizForm.option2, quizForm.option3, quizForm.option4].filter(Boolean),
      correct: quizForm.correct,
      category: quizForm.category,
    });
    setContent(newContent);
    saveCustomContent(newContent);
    setQuizForm({ question: '', option1: '', option2: '', option3: '', option4: '', correct: 0, category: 'General' });
  };

  const deleteUser = async (userId: string) => {
    if (userId === user?.id) return;
    const updated = users.filter(u => u.id !== userId);
    setUsersList(updated);
    saveUsers(updated);
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      await deleteDoc(doc(db, 'users', userId));
      await deleteDoc(doc(db, 'progress', userId));
    } catch(err) {
      console.error("Failed to delete from Firestore:", err);
    }
  };

  const deleteContent = (type: 'duas' | 'hadiths' | 'quizzes', id: string) => {
    const newContent = { ...content };
    if (type === 'duas') {
      newContent.duas = newContent.duas.filter(item => item.id !== id);
    } else if (type === 'hadiths') {
      newContent.hadiths = newContent.hadiths.filter(item => item.id !== id);
    } else if (type === 'quizzes') {
      newContent.quizzes = newContent.quizzes.filter(item => item.id !== id);
    }
    setContent(newContent);
    saveCustomContent(newContent);
  };

  const tabs = [
    { key: 'stats', label: t('statsTab'), icon: '📊' },
    { key: 'users', label: t('usersTab'), icon: '👥' },
    { key: 'content', label: t('contentTab'), icon: '📝' },
  ] as const;

  return (
    <div className="page-transition max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">
          ⚙️ {t('admin')} <span className="text-gradient">Panel</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{t('managePlatform')}</p>
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
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Statistics Tab */}
      {activeTab === 'stats' && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-6">
              <div className="text-3xl mb-2">👥</div>
              <p className="text-3xl font-bold">{users.length}</p>
              <p className="text-sm text-gray-500">{t('totalUsers')}</p>
            </div>
            <div className="glass-card p-6">
              <div className="text-3xl mb-2">🟢</div>
              <p className="text-3xl font-bold">{activeToday}</p>
              <p className="text-sm text-gray-500">{t('activeUsers')}</p>
            </div>
            <div className="glass-card p-6">
              <div className="text-3xl mb-2">✨</div>
              <p className="text-3xl font-bold">{totalVisitors}</p>
              <p className="text-sm text-gray-500">{t('guestVisitsUnique')}</p>
            </div>
            <div className="glass-card p-6">
              <div className="text-3xl mb-2">📿</div>
              <p className="text-3xl font-bold">{totalDhikr}</p>
              <p className="text-sm text-gray-500">{t('totalDhikrStat')}</p>
            </div>
            <div className="glass-card p-6">
              <div className="text-3xl mb-2">🧠</div>
              <p className="text-3xl font-bold">{totalQuizzes}</p>
              <p className="text-sm text-gray-500">{t('quizzesTakenStat')}</p>
            </div>
          </div>

          {/* User Activity */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-lg mb-4">{t('userActivity')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 text-right">
                    <th className="py-3 px-4 font-medium text-gray-500">{t('usersTab')}</th>
                    <th className="py-3 px-4 font-medium text-gray-500">{t('streak')}</th>
                    <th className="py-3 px-4 font-medium text-gray-500">{t('dhikr')}</th>
                    <th className="py-3 px-4 font-medium text-gray-500">{t('quiz')}</th>
                    <th className="py-3 px-4 font-medium text-gray-500">{t('joined')}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => {
                    const p = allProgress[u.id] || getProgress(u.id);
                    const dhikr = Object.values(p.dhikrCount as Record<string, number>).reduce((a, b) => a + b, 0);
                    return (
                      <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800 text-right">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 justify-end">
                            <div className="text-right">
                              <p className="font-medium">{u.name}</p>
                              <p className="text-xs text-gray-500">{u.email}</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">🔥 {p.streak}</td>
                        <td className="py-3 px-4">{dhikr}</td>
                        <td className="py-3 px-4">{p.quizScores.length}</td>
                        <td className="py-3 px-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="glass-card p-6">
          <h3 className="font-bold text-lg mb-4">{t('manageUsers')} ({users.length})</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-right text-sm text-gray-500">
                  <th className="p-4">{t('usersTab')}</th>
                  <th className="p-4">{t('role')}</th>
                  <th className="p-4">{t('streak')}</th>
                  <th className="p-4">{t('lastActive')}</th>
                  <th className="p-4">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const p = allProgress[u.id] || getProgress(u.id);
                  return (
                    <tr key={u.id} className="border-t border-gray-100 dark:border-gray-800 text-right">
                      <td className="p-4 text-right">
                        <div className="flex items-center gap-3 justify-end">
                          <div className="text-right">
                            <div className="font-medium">{u.name}</div>
                            <div className="text-sm text-gray-500">{u.email}</div>
                          </div>
                          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          u.role === 'admin' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4 font-medium">{p.streak} {p.streak >= 3 ? '🔥' : ''}</td>
                      <td className="p-4 text-sm text-gray-500">{new Date(p.lastActiveDate).toLocaleDateString()}</td>
                      <td className="p-4">
                        <button
                          onClick={() => deleteUser(u.id)}
                          disabled={u.role === 'admin'}
                          className="text-red-500 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
                        >
                          {t('delete')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-8">
          {/* Add Dua */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-lg mb-4">🤲 {t('addDua')}</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input placeholder={t('title')} value={duaForm.title} onChange={e => setDuaForm({ ...duaForm, title: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 text-right" />
              <input placeholder={t('reference')} value={duaForm.reference} onChange={e => setDuaForm({ ...duaForm, reference: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 text-right" />
              <textarea placeholder={t('arabicText')} value={duaForm.arabic} onChange={e => setDuaForm({ ...duaForm, arabic: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 font-arabic text-right" rows={2} />
              <textarea placeholder={t('englishTranslation')} value={duaForm.english} onChange={e => setDuaForm({ ...duaForm, english: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 text-right" rows={2} />
            </div>
            <button onClick={addDua} className="px-6 py-2.5 rounded-xl gradient-primary text-white font-medium text-sm hover:shadow-lg transition-all">{t('addDua')}</button>

            {/* Existing */}
            {content.duas.length > 0 && (
              <div className="mt-4 space-y-2">
                {content.duas.map(d => (
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm">
                    <span>{d.title}</span>
                    <button onClick={() => deleteContent('duas', d.id)} className="text-red-500 text-xs hover:underline">{t('delete')}</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Hadith */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-lg mb-4">📜 {t('addHadith')}</h3>
            <div className="space-y-4 mb-4">
              <textarea placeholder={t('arabicText')} value={hadithForm.text} onChange={e => setHadithForm({ ...hadithForm, text: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 text-right" rows={3} />
              <div className="grid md:grid-cols-2 gap-4">
                <input placeholder={t('narrator')} value={hadithForm.narrator} onChange={e => setHadithForm({ ...hadithForm, narrator: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 text-right" />
                <input placeholder={t('source')} value={hadithForm.source} onChange={e => setHadithForm({ ...hadithForm, source: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 text-right" />
              </div>
            </div>
            <button onClick={addHadith} className="px-6 py-2.5 rounded-xl gradient-primary text-white font-medium text-sm hover:shadow-lg transition-all">{t('addHadith')}</button>

            {content.hadiths.length > 0 && (
              <div className="mt-4 space-y-2">
                {content.hadiths.map(h => (
                  <div key={h.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm">
                    <span className="truncate mr-4">{h.text.slice(0, 60)}...</span>
                    <button onClick={() => deleteContent('hadiths', h.id)} className="text-red-500 text-xs hover:underline shrink-0">{t('delete')}</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Quiz */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-lg mb-4">🧠 {t('addQuizQuestion')}</h3>
            <div className="space-y-4 mb-4">
              <textarea placeholder={t('question')} value={quizForm.question} onChange={e => setQuizForm({ ...quizForm, question: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 text-right" rows={2} />
              <div className="grid md:grid-cols-2 gap-4">
                <input placeholder={`${t('option')} A`} value={quizForm.option1} onChange={e => setQuizForm({ ...quizForm, option1: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 text-right" />
                <input placeholder={`${t('option')} B`} value={quizForm.option2} onChange={e => setQuizForm({ ...quizForm, option2: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 text-right" />
                <input placeholder={`${t('option')} C`} value={quizForm.option3} onChange={e => setQuizForm({ ...quizForm, option3: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 text-right" />
                <input placeholder={`${t('option')} D`} value={quizForm.option4} onChange={e => setQuizForm({ ...quizForm, option4: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 text-right" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <select value={quizForm.correct} onChange={e => setQuizForm({ ...quizForm, correct: parseInt(e.target.value) })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 text-right">
                  <option value={0}>{t('correctOption')}: A</option>
                  <option value={1}>{t('correctOption')}: B</option>
                  <option value={2}>{t('correctOption')}: C</option>
                  <option value={3}>{t('correctOption')}: D</option>
                </select>
                <select value={quizForm.category} onChange={e => setQuizForm({ ...quizForm, category: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 text-right">
                  <option value="General">{t('all')}</option>
                  <option value="Quran">{t('quran')}</option>
                  <option value="Pillars">{t('dailyPrayers')}</option>
                  <option value="Salah">{t('prayer')}</option>
                  <option value="Prophets">{t('features')}</option>
                </select>
              </div>
            </div>
            <button onClick={addQuiz} className="px-6 py-2.5 rounded-xl gradient-primary text-white font-medium text-sm hover:shadow-lg transition-all">{t('addQuizQuestion')}</button>

            {content.quizzes.length > 0 && (
              <div className="mt-4 space-y-2">
                {content.quizzes.map(q => (
                  <div key={q.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm">
                    <span>{q.question}</span>
                    <button onClick={() => deleteContent('quizzes', q.id)} className="text-red-500 text-xs hover:underline shrink-0">{t('delete')}</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
