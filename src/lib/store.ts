// Local storage helper for persisting user data

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: string;
  streak: number;
  lastActive: string;
}

export interface UserProgress {
  userId: string;
  quranLastRead: { surah: number; ayah: number } | null;
  quranBookmarks: { surah: number; ayah: number; surahName: string; date: string }[];
  favoriteAyahs: { surah: number; ayah: number; text: string; translation: string }[];
  favoriteDuas: string[];
  dhikrCount: Record<string, number>;
  dhikrGoals: Record<string, number>;
  dhikrHistory: { date: string; total: number }[];
  quizScores: { date: string; score: number; total: number; category: string }[];
  totalQuizScore: number;
  streak: number;
  lastActiveDate: string;
}

const STORAGE_KEYS = {
  USERS: 'hifzpro_users',
  CURRENT_USER: 'hifzpro_current_user',
  PROGRESS: 'hifzpro_progress',
  THEME: 'hifzpro_theme',
  CUSTOM_CONTENT: 'hifzpro_custom_content',
};

function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

// User management
export function getUsers(): User[] {
  return getItem<User[]>(STORAGE_KEYS.USERS, []);
}

export function saveUsers(users: User[]): void {
  setItem(STORAGE_KEYS.USERS, users);
}

export function getCurrentUser(): User | null {
  return getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);
}

export function setCurrentUser(user: User | null): void {
  setItem(STORAGE_KEYS.CURRENT_USER, user);
}

export function registerUser(name: string, email: string, password: string): { success: boolean; error?: string; user?: User } {
  const users = getUsers();
  const normalizedEmail = email.toLowerCase().trim();
  
  if (normalizedEmail === 'hamad@hifzapro.com') {
    return { success: false, error: 'This email is reserved for the administrator' };
  }
  if (users.find(u => u.email.toLowerCase().trim() === normalizedEmail)) {
    return { success: false, error: 'Email already registered' };
  }
  const user: User = {
    id: crypto.randomUUID(),
    name,
    email: normalizedEmail,
    password,
    role: 'user',
    createdAt: new Date().toISOString(),
    streak: 0,
    lastActive: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  setCurrentUser(user);
  initProgress(user.id);
  return { success: true, user };
}

export function loginUser(email: string, password: string): { success: boolean; error?: string; user?: User } {
  const users = getUsers();
  const normalizedEmail = email.toLowerCase().trim();

  // Admin Master Login
  if (normalizedEmail === 'hamad@hifzapro.com' && password === 'hamadk2010@@') {
    let adminUser = users.find(u => u.email.toLowerCase().trim() === normalizedEmail);
    if (!adminUser) {
      adminUser = {
        id: 'admin_master_123',
        name: 'Hamad',
        email: 'hamad@hifzapro.com',
        password: 'hamadk2010@@',
        role: 'admin',
        createdAt: new Date().toISOString(),
        streak: 0,
        lastActive: new Date().toISOString(),
      };
      users.push(adminUser);
      saveUsers(users);
      initProgress(adminUser.id);
    } else {
      // Just in case password changed somehow, update it to master password
      adminUser.password = 'hamadk2010@@';
      adminUser.role = 'admin';
      saveUsers(users);
    }
  }

  const user = users.find(u => u.email.toLowerCase().trim() === normalizedEmail && u.password === password);
  if (!user) {
    return { success: false, error: 'Invalid email or password' };
  }
  // Update streak
  const progress = getProgress(user.id);
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (progress.lastActiveDate === yesterday) {
    progress.streak += 1;
  } else if (progress.lastActiveDate !== today) {
    progress.streak = 1;
  }
  progress.lastActiveDate = today;
  saveProgress(user.id, progress);
  user.streak = progress.streak;
  user.lastActive = new Date().toISOString();
  const idx = users.findIndex(u => u.id === user.id);
  users[idx] = user;
  saveUsers(users);
  setCurrentUser(user);
  return { success: true, user };
}

export function logoutUser(): void {
  setCurrentUser(null);
}

// Progress management
export function initProgress(userId: string): UserProgress {
  const progress: UserProgress = {
    userId,
    quranLastRead: null,
    quranBookmarks: [],
    favoriteAyahs: [],
    favoriteDuas: [],
    dhikrCount: { 'SubhanAllah': 0, 'Alhamdulillah': 0, 'AllahuAkbar': 0, 'Astaghfirullah': 0, 'LaIlahaIllallah': 0 },
    dhikrGoals: { 'SubhanAllah': 33, 'Alhamdulillah': 33, 'AllahuAkbar': 34, 'Astaghfirullah': 100, 'LaIlahaIllallah': 100 },
    dhikrHistory: [],
    quizScores: [],
    totalQuizScore: 0,
    streak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
  };
  saveProgress(userId, progress);
  return progress;
}

export function getProgress(userId: string): UserProgress {
  const all = getItem<Record<string, UserProgress>>(STORAGE_KEYS.PROGRESS, {});
  return all[userId] || initProgress(userId);
}

export function saveProgress(userId: string, progress: UserProgress): void {
  const all = getItem<Record<string, UserProgress>>(STORAGE_KEYS.PROGRESS, {});
  all[userId] = progress;
  setItem(STORAGE_KEYS.PROGRESS, all);
}

// Theme
export function getTheme(): 'light' | 'dark' {
  return getItem<'light' | 'dark'>(STORAGE_KEYS.THEME, 'dark');
}

export function setTheme(theme: 'light' | 'dark'): void {
  setItem(STORAGE_KEYS.THEME, theme);
}

// Custom content (admin)
export interface CustomContent {
  duas: { id: string; title: string; arabic: string; english: string; reference: string }[];
  hadiths: { id: string; text: string; narrator: string; source: string }[];
  quizzes: { id: string; question: string; options: string[]; correct: number; category: string }[];
}

export function getCustomContent(): CustomContent {
  return getItem<CustomContent>(STORAGE_KEYS.CUSTOM_CONTENT, { duas: [], hadiths: [], quizzes: [] });
}

export function saveCustomContent(content: CustomContent): void {
  setItem(STORAGE_KEYS.CUSTOM_CONTENT, content);
}
