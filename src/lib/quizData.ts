export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  category: string;
  explanation?: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'How many surahs are in the Quran?',
    options: ['100', '110', '114', '120'],
    correct: 2,
    category: 'Quran',
    explanation: 'The Holy Quran contains 114 surahs (chapters).'
  },
  {
    id: '2',
    question: 'What is the longest surah in the Quran?',
    options: ['Al-Imran', 'Al-Baqarah', 'An-Nisa', 'Al-Maidah'],
    correct: 1,
    category: 'Quran',
    explanation: 'Surah Al-Baqarah is the longest surah with 286 ayahs.'
  },
  {
    id: '3',
    question: 'How many pillars of Islam are there?',
    options: ['3', '4', '5', '6'],
    correct: 2,
    category: 'Pillars',
    explanation: 'The five pillars are: Shahada, Salah, Zakat, Sawm, and Hajj.'
  },
  {
    id: '4',
    question: 'What is the first pillar of Islam?',
    options: ['Salah', 'Shahada', 'Zakat', 'Hajj'],
    correct: 1,
    category: 'Pillars',
    explanation: 'The Shahada (declaration of faith) is the first pillar of Islam.'
  },
  {
    id: '5',
    question: 'In which month was the Quran revealed?',
    options: ['Shaban', 'Rajab', 'Ramadan', 'Muharram'],
    correct: 2,
    category: 'Quran',
    explanation: 'The Quran was first revealed during the month of Ramadan.'
  },
  {
    id: '6',
    question: 'How many daily prayers (Salah) are obligatory?',
    options: ['3', '4', '5', '7'],
    correct: 2,
    category: 'Salah',
    explanation: 'Muslims are required to pray five times a day.'
  },
  {
    id: '7',
    question: 'Which prophet is mentioned most in the Quran?',
    options: ['Prophet Muhammad ﷺ', 'Prophet Ibrahim (AS)', 'Prophet Musa (AS)', 'Prophet Isa (AS)'],
    correct: 2,
    category: 'Prophets',
    explanation: 'Prophet Musa (Moses) is mentioned 136 times in the Quran.'
  },
  {
    id: '8',
    question: 'What is the shortest surah in the Quran?',
    options: ['Al-Ikhlas', 'Al-Asr', 'Al-Kawthar', 'Al-Fil'],
    correct: 2,
    category: 'Quran',
    explanation: 'Surah Al-Kawthar is the shortest surah with only 3 ayahs.'
  },
  {
    id: '9',
    question: 'What is the direction Muslims face during prayer?',
    options: ['East', 'West', 'Qibla (Kaaba)', 'North'],
    correct: 2,
    category: 'Salah',
    explanation: 'Muslims face the Qibla, the direction of the Kaaba in Makkah.'
  },
  {
    id: '10',
    question: 'How many prophets are mentioned in the Quran?',
    options: ['20', '25', '30', '50'],
    correct: 1,
    category: 'Prophets',
    explanation: '25 prophets are mentioned by name in the Holy Quran.'
  },
  {
    id: '11',
    question: 'What is the first word revealed in the Quran?',
    options: ['Bismillah', 'Iqra (Read)', 'Alhamdulillah', 'SubhanAllah'],
    correct: 1,
    category: 'Quran',
    explanation: 'The first word revealed was "Iqra" (Read), in Surah Al-Alaq.'
  },
  {
    id: '12',
    question: 'Which angel brought the revelation to Prophet Muhammad ﷺ?',
    options: ['Mikail', 'Israfil', 'Azrael', 'Jibril'],
    correct: 3,
    category: 'Angels',
    explanation: 'Angel Jibril (Gabriel) was responsible for delivering the revelation.'
  },
  {
    id: '13',
    question: 'What is Zakat?',
    options: ['Fasting', 'Pilgrimage', 'Charity (2.5% of savings)', 'Prayer'],
    correct: 2,
    category: 'Pillars',
    explanation: 'Zakat is the obligatory charity of 2.5% of qualifying wealth.'
  },
  {
    id: '14',
    question: 'Where is the Kaaba located?',
    options: ['Madinah', 'Jerusalem', 'Makkah', 'Cairo'],
    correct: 2,
    category: 'General',
    explanation: 'The Kaaba is located in Masjid al-Haram in Makkah, Saudi Arabia.'
  },
  {
    id: '15',
    question: 'Which surah is known as the "Heart of the Quran"?',
    options: ['Al-Mulk', 'Ya-Sin', 'Ar-Rahman', 'Al-Kahf'],
    correct: 1,
    category: 'Quran',
    explanation: 'Surah Ya-Sin is referred to as the Heart of the Quran.'
  },
  {
    id: '16',
    question: 'How many Rakats are in Fajr prayer?',
    options: ['2', '3', '4', '1'],
    correct: 0,
    category: 'Salah',
    explanation: 'Fajr prayer consists of 2 obligatory Rakats.'
  },
  {
    id: '17',
    question: 'What is the night of power called?',
    options: ['Laylat al-Isra', 'Laylat al-Miraj', 'Laylat al-Qadr', 'Laylat al-Bara\'ah'],
    correct: 2,
    category: 'General',
    explanation: 'Laylat al-Qadr (Night of Power) is better than a thousand months.'
  },
  {
    id: '18',
    question: 'Which prophet built the Kaaba?',
    options: ['Prophet Nuh (AS)', 'Prophet Ibrahim (AS)', 'Prophet Musa (AS)', 'Prophet Adam (AS)'],
    correct: 1,
    category: 'Prophets',
    explanation: 'Prophet Ibrahim (Abraham) and his son Ismail rebuilt the Kaaba.'
  },
  {
    id: '19',
    question: 'What is the last surah of the Quran?',
    options: ['Al-Ikhlas', 'Al-Falaq', 'An-Nas', 'Al-Masad'],
    correct: 2,
    category: 'Quran',
    explanation: 'Surah An-Nas (Mankind) is the 114th and last surah.'
  },
  {
    id: '20',
    question: 'How many times a day should a Muslim recite Surah Al-Fatihah in obligatory prayers?',
    options: ['5 times', '10 times', '17 times', '20 times'],
    correct: 2,
    category: 'Salah',
    explanation: 'Al-Fatihah is recited in every Rakah, totaling 17 times in obligatory prayers.'
  },
];

export const quizCategories = ['All', 'Quran', 'Pillars', 'Salah', 'Prophets', 'Angels', 'General'];
