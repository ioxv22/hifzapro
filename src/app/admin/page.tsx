'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getUsers, saveUsers, getCustomContent, saveCustomContent, getProgress, type CustomContent } from '@/lib/store';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'content'>('stats');
  const [users, setUsersList] = useState<ReturnType<typeof getUsers>>([]);
  const [content, setContent] = useState<CustomContent>({ duas: [], hadiths: [], quizzes: [] });

  // Content form states
  const [duaForm, setDuaForm] = useState({ title: '', arabic: '', english: '', reference: '' });
  const [hadithForm, setHadithForm] = useState({ text: '', narrator: '', source: '' });
  const [quizForm, setQuizForm] = useState({ question: '', option1: '', option2: '', option3: '', option4: '', correct: 0, category: 'General' });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
    if (user) {
      setUsersList(getUsers());
      setContent(getCustomContent());
    }
  }, [user, authLoading, router]);

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  const totalDhikr = users.reduce((total, u) => {
    const p = getProgress(u.id);
    return total + Object.values(p.dhikrCount).reduce((a, b) => a + b, 0);
  }, 0);

  const totalQuizzes = users.reduce((total, u) => {
    return total + getProgress(u.id).quizScores.length;
  }, 0);

  const activeToday = users.filter(u => {
    const p = getProgress(u.id);
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

  const deleteUser = (userId: string) => {
    if (userId === user.id) return;
    const updated = users.filter(u => u.id !== userId);
    setUsersList(updated);
    saveUsers(updated);
  };

  const deleteContent = (type: 'duas' | 'hadiths' | 'quizzes', id: string) => {
    const newContent = { ...content };
    newContent[type] = newContent[type].filter((item: { id: string }) => item.id !== id);
    setContent(newContent);
    saveCustomContent(newContent);
  };

  const tabs = [
    { key: 'stats', label: 'Statistics', icon: '📊' },
    { key: 'users', label: 'Users', icon: '👥' },
    { key: 'content', label: 'Content', icon: '📝' },
  ] as const;

  return (
    <div className="page-transition max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">
          ⚙️ Admin <span className="text-gradient">Panel</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your platform</p>
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
              <p className="text-sm text-gray-500">Total Users</p>
            </div>
            <div className="glass-card p-6">
              <div className="text-3xl mb-2">🟢</div>
              <p className="text-3xl font-bold">{activeToday}</p>
              <p className="text-sm text-gray-500">Active Today</p>
            </div>
            <div className="glass-card p-6">
              <div className="text-3xl mb-2">📿</div>
              <p className="text-3xl font-bold">{totalDhikr}</p>
              <p className="text-sm text-gray-500">Total Dhikr</p>
            </div>
            <div className="glass-card p-6">
              <div className="text-3xl mb-2">🧠</div>
              <p className="text-3xl font-bold">{totalQuizzes}</p>
              <p className="text-sm text-gray-500">Quizzes Taken</p>
            </div>
          </div>

          {/* User Activity */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-lg mb-4">User Activity</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Streak</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Dhikr</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Quizzes</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => {
                    const p = getProgress(u.id);
                    const dhikr = Object.values(p.dhikrCount).reduce((a, b) => a + b, 0);
                    return (
                      <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-white text-xs font-bold">
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{u.name}</p>
                              <p className="text-xs text-gray-500">{u.email}</p>
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
          <h3 className="font-bold text-lg mb-4">Manage Users ({users.length})</h3>
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-amber-500/10 text-amber-500' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                    {u.role}
                  </span>
                  {u.id !== user.id && (
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-8">
          {/* Add Dua */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-lg mb-4">🤲 Add Dua</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input placeholder="Title" value={duaForm.title} onChange={e => setDuaForm({ ...duaForm, title: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500" />
              <input placeholder="Reference" value={duaForm.reference} onChange={e => setDuaForm({ ...duaForm, reference: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500" />
              <textarea placeholder="Arabic text" value={duaForm.arabic} onChange={e => setDuaForm({ ...duaForm, arabic: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 font-arabic text-right" rows={2} />
              <textarea placeholder="English translation" value={duaForm.english} onChange={e => setDuaForm({ ...duaForm, english: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500" rows={2} />
            </div>
            <button onClick={addDua} className="px-6 py-2.5 rounded-xl gradient-primary text-white font-medium text-sm hover:shadow-lg transition-all">Add Dua</button>

            {/* Existing */}
            {content.duas.length > 0 && (
              <div className="mt-4 space-y-2">
                {content.duas.map(d => (
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm">
                    <span>{d.title}</span>
                    <button onClick={() => deleteContent('duas', d.id)} className="text-red-500 text-xs hover:underline">Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Hadith */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-lg mb-4">📜 Add Hadith</h3>
            <div className="space-y-4 mb-4">
              <textarea placeholder="Hadith text" value={hadithForm.text} onChange={e => setHadithForm({ ...hadithForm, text: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500" rows={3} />
              <div className="grid md:grid-cols-2 gap-4">
                <input placeholder="Narrator" value={hadithForm.narrator} onChange={e => setHadithForm({ ...hadithForm, narrator: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500" />
                <input placeholder="Source" value={hadithForm.source} onChange={e => setHadithForm({ ...hadithForm, source: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <button onClick={addHadith} className="px-6 py-2.5 rounded-xl gradient-primary text-white font-medium text-sm hover:shadow-lg transition-all">Add Hadith</button>

            {content.hadiths.length > 0 && (
              <div className="mt-4 space-y-2">
                {content.hadiths.map(h => (
                  <div key={h.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm">
                    <span className="truncate mr-4">{h.text.slice(0, 60)}...</span>
                    <button onClick={() => deleteContent('hadiths', h.id)} className="text-red-500 text-xs hover:underline shrink-0">Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Quiz */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-lg mb-4">🧠 Add Quiz Question</h3>
            <div className="space-y-4 mb-4">
              <textarea placeholder="Question" value={quizForm.question} onChange={e => setQuizForm({ ...quizForm, question: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500" rows={2} />
              <div className="grid md:grid-cols-2 gap-4">
                <input placeholder="Option A" value={quizForm.option1} onChange={e => setQuizForm({ ...quizForm, option1: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500" />
                <input placeholder="Option B" value={quizForm.option2} onChange={e => setQuizForm({ ...quizForm, option2: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500" />
                <input placeholder="Option C" value={quizForm.option3} onChange={e => setQuizForm({ ...quizForm, option3: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500" />
                <input placeholder="Option D" value={quizForm.option4} onChange={e => setQuizForm({ ...quizForm, option4: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <select value={quizForm.correct} onChange={e => setQuizForm({ ...quizForm, correct: parseInt(e.target.value) })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value={0}>Correct: Option A</option>
                  <option value={1}>Correct: Option B</option>
                  <option value={2}>Correct: Option C</option>
                  <option value={3}>Correct: Option D</option>
                </select>
                <select value={quizForm.category} onChange={e => setQuizForm({ ...quizForm, category: e.target.value })} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>General</option>
                  <option>Quran</option>
                  <option>Pillars</option>
                  <option>Salah</option>
                  <option>Prophets</option>
                </select>
              </div>
            </div>
            <button onClick={addQuiz} className="px-6 py-2.5 rounded-xl gradient-primary text-white font-medium text-sm hover:shadow-lg transition-all">Add Question</button>

            {content.quizzes.length > 0 && (
              <div className="mt-4 space-y-2">
                {content.quizzes.map(q => (
                  <div key={q.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm">
                    <span className="truncate mr-4">{q.question}</span>
                    <button onClick={() => deleteContent('quizzes', q.id)} className="text-red-500 text-xs hover:underline shrink-0">Delete</button>
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
