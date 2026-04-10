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
    question: 'كم عدد سور القرآن الكريم؟ (How many surahs are in the Quran?)',
    options: ['١٠٠ (100)', '١١٠ (110)', '١١٤ (114)', '١٢٠ (120)'],
    correct: 2,
    category: 'القرآن (Quran)',
    explanation: 'يحتوي القرآن الكريم على ١١٤ سورة. (The Holy Quran contains 114 surahs.)'
  },
  {
    id: '2',
    question: 'ما هي أطول سورة في القرآن الكريم؟ (What is the longest surah in the Quran?)',
    options: ['آل عمران (Al-Imran)', 'البقرة (Al-Baqarah)', 'النساء (An-Nisa)', 'المائدة (Al-Maidah)'],
    correct: 1,
    category: 'القرآن (Quran)',
    explanation: 'سورة البقرة هي أطول سورة بـ ٢٨٦ آية. (Surah Al-Baqarah is the longest surah with 286 ayahs.)'
  },
  {
    id: '3',
    question: 'كم عدد أركان الإسلام؟ (How many pillars of Islam are there?)',
    options: ['٣ (3)', '٤ (4)', '٥ (5)', '٦ (6)'],
    correct: 2,
    category: 'أركان الإسلام (Pillars)',
    explanation: 'أركان الإسلام خمسة: الشهادة، الصلاة، الزكاة، الصوم، والحج. (The five pillars are: Shahada, Salah, Zakat, Sawm, and Hajj.)'
  },
  {
    id: '4',
    question: 'ما هو الركن الأول من أركان الإسلام؟ (What is the first pillar of Islam?)',
    options: ['الصلاة (Salah)', 'الشهادة (Shahada)', 'الزكاة (Zakat)', 'الحج (Hajj)'],
    correct: 1,
    category: 'أركان الإسلام (Pillars)',
    explanation: 'الشهادة هي الركن الأول من أركان الإسلام. (The Shahada is the first pillar of Islam.)'
  },
  {
    id: '5',
    question: 'في أي شهر نزل القرآن الكريم؟ (In which month was the Quran revealed?)',
    options: ['شعبان (Shaban)', 'رجب (Rajab)', 'رمضان (Ramadan)', 'محرم (Muharram)'],
    correct: 2,
    category: 'القرآن (Quran)',
    explanation: 'نزل القرآن الكريم في شهر رمضان المبارك. (The Quran was first revealed during the month of Ramadan.)'
  },
  {
    id: '6',
    question: 'كم صلاة مفروضة في اليوم؟ (How many daily prayers are obligatory?)',
    options: ['٣ (3)', '٤ (4)', '٥ (5)', '٧ (7)'],
    correct: 2,
    category: 'الصلاة (Salah)',
    explanation: 'يجب على المسلم أداء خمس صلوات في اليوم. (Muslims are required to pray five times a day.)'
  },
  {
    id: '7',
    question: 'من هو النبي الأكثر ذكراً في القرآن؟ (Which prophet is mentioned most in the Quran?)',
    options: ['محمد ﷺ', 'إبراهيم عليه السلام', 'موسى عليه السلام', 'عيسى عليه السلام'],
    correct: 2,
    category: 'الأنبياء (Prophets)',
    explanation: 'ذكر نبي الله موسى ١٣٦ مرة في القرآن. (Prophet Musa is mentioned 136 times in the Quran.)'
  },
  {
    id: '8',
    question: 'ما هي أقصر سورة في القرآن الكريم؟ (What is the shortest surah in the Quran?)',
    options: ['الإخلاص (Al-Ikhlas)', 'العصر (Al-Asr)', 'الكوثر (Al-Kawthar)', 'الفيل (Al-Fil)'],
    correct: 2,
    category: 'القرآن (Quran)',
    explanation: 'سورة الكوثر هي أقصر سورة بـ ٣ آيات فقط. (Surah Al-Kawthar is the shortest surah with only 3 ayahs.)'
  },
  {
    id: '9',
    question: 'ما هو اتجاه قبلة المسلمين في الصلاة؟ (What is the direction Muslims face during prayer?)',
    options: ['الشرق (East)', 'الغرب (West)', 'الكعبة المشرفة (Kaaba)', 'الشمال (North)'],
    correct: 2,
    category: 'الصلاة (Salah)',
    explanation: 'يتجه المسلمون نحو الكعبة المشرفة في مكة المكرمة. (Muslims face the Qibla, the direction of the Kaaba in Makkah.)'
  },
  {
    id: '10',
    question: 'كم عدد الأنبياء المذكورين في القرآن؟ (How many prophets are mentioned in the Quran?)',
    options: ['٢٠ (20)', '٢٥ (25)', '٣٠ (30)', '٥٠ (50)'],
    correct: 1,
    category: 'الأنبياء (Prophets)',
    explanation: 'ذكر ٢٥ نبياً بأسمائهم في القرآن الكريم. (25 prophets are mentioned by name in the Holy Quran.)'
  },
  {
    id: '11',
    question: 'ما هي أول كلمة نزلت في القرآن الكريم؟ (What is the first word revealed in the Quran?)',
    options: ['بسم الله (Bismillah)', 'اقرأ (Read)', 'الحمد لله (Alhamdulillah)', 'سبحان الله (SubhanAllah)'],
    correct: 1,
    category: 'القرآن (Quran)',
    explanation: 'أول كلمة نزلت هي "اقرأ" من سورة العلق. (The first word revealed was "Iqra" (Read), in Surah Al-Alaq.)'
  },
  {
    id: '12',
    question: 'من هو الملك المسؤول عن إنزال الوحي؟ (Which angel brought the revelation?)',
    options: ['ميكائيل (Mikail)', 'إسرافيل (Israfil)', 'عزرائيل (Azrael)', 'جبريل (Jibril)'],
    correct: 3,
    category: 'الملائكة (Angels)',
    explanation: 'جبريل عليه السلام هو الملك المسؤول عن الوحي. (Angel Jibril was responsible for delivering the revelation.)'
  },
  {
    id: '13',
    question: 'ما هي الزكاة؟ (What is Zakat?)',
    options: ['الصوم (Fasting)', 'الحج (Pilgrimage)', 'صدقة مفروضة (Obligatory Charity)', 'الصلاة (Prayer)'],
    correct: 2,
    category: 'أركان الإسلام (Pillars)',
    explanation: 'الزكاة هي صدقة مفروضة بنسبة ٢.٥٪ من المال المدخر. (Zakat is the obligatory charity of 2.5% of savings.)'
  },
  {
    id: '14',
    question: 'أين تقع الكعبة المشرفة؟ (Where is the Kaaba located?)',
    options: ['المدينة المنورة (Madinah)', 'القدس (Jerusalem)', 'مكة المكرمة (Makkah)', 'القاهرة (Cairo)'],
    correct: 2,
    category: 'عام (General)',
    explanation: 'تقع الكعبة في المسجد الحرام بمكة المكرمة. (The Kaaba is located in Masjid al-Haram in Makkah.)'
  },
  {
    id: '15',
    question: 'أي سورة تلقب بـ "قلب القرآن"؟ (Which surah is the "Heart of the Quran"?)',
    options: ['الملك (Al-Mulk)', 'يس (Ya-Sin)', 'الرحمن (Ar-Rahman)', 'الكهف (Al-Kahf)'],
    correct: 1,
    category: 'القرآن (Quran)',
    explanation: 'تلقب سورة يس بقلب القرآن الكريم. (Surah Ya-Sin is referred to as the Heart of the Quran.)'
  },
  {
    id: '16',
    question: 'كم عدد ركعات صلاة الفجر؟ (How many Rakats are in Fajr prayer?)',
    options: ['٢ (2)', '٣ (3)', '٤ (4)', '١ (1)'],
    correct: 0,
    category: 'الصلاة (Salah)',
    explanation: 'تتكون صلاة الفجر من ركعتين مفروضتين. (Fajr prayer consists of 2 obligatory Rakats.)'
  },
  {
    id: '17',
    question: 'ماذا تسمى الليلة التي نزل فيها القرآن؟ (What is the night of power called?)',
    options: ['الإسراء والمعراج', 'ليلة العيد', 'ليلة القدر (Laylat al-Qadr)', 'ليلة النصف من شعبان'],
    correct: 2,
    category: 'عام (General)',
    explanation: 'ليلة القدر هي الليلة التي نزل فيها القرآن وهي خير من ألف شهر. (Laylat al-Qadr is better than a thousand months.)'
  },
  {
    id: '18',
    question: 'من هم الأنبياء الذين بنوا الكعبة؟ (Which prophets built the Kaaba?)',
    options: ['نوح عليه السلام', 'إبراهيم وإسماعيل عليهما السلام', 'موسى عليه السلام', 'آدم عليه السلام'],
    correct: 1,
    category: 'الأنبياء (Prophets)',
    explanation: 'بنى النبي إبراهيم وابنه إسماعيل الكعبة المشرفة. (Prophet Ibrahim and Ismail rebuilt the Kaaba.)'
  },
  {
    id: '19',
    question: 'ما هي آخر سورة في القرآن الكريم؟ (What is the last surah of the Quran?)',
    options: ['الإخلاص (Al-Ikhlas)', 'الفلق (Al-Falaq)', 'الناس (An-Nas)', 'المسد (Al-Masad)'],
    correct: 2,
    category: 'القرآن (Quran)',
    explanation: 'سورة الناس هي السورة رقم ١١٤ والأخيرة في القرآن. (Surah An-Nas is the 114th and last surah.)'
  },
  {
    id: '20',
    question: 'كم مرة تقرأ الفاتحة في الصلوات المفروضة؟ (How many times is Al-Fatihah recited daily?)',
    options: ['٥ مرات (5 times)', '١٠ مرات (10 times)', '١٧ مرة (17 times)', '٢٠ مرة (20 times)'],
    correct: 2,
    category: 'الصلاة (Salah)',
    explanation: 'تُقرأ الفاتحة في كل ركعة، بإجمالي ١٧ مرة في اليوم. (Al-Fatihah is recited in every Rakah, totaling 17 times daily.)'
  },
];

export const quizCategories = ['All', 'القرآن (Quran)', 'أركان الإسلام (Pillars)', 'الصلاة (Salah)', 'الأنبياء (Prophets)', 'الملائكة (Angels)', 'عام (General)'];
