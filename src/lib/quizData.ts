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
    question: 'ما هي أوَّل سورةٍ قرآنيَّةٍ نزلت على رسول الله ﷺ؟ (What is the first surah revealed to the Prophet ﷺ?)',
    options: ['الفاتحة (Al-Fatihah)', 'العلق (Al-Alaq)', 'المدثر (Al-Muddathir)', 'القلم (Al-Qalam)'],
    correct: 1,
    category: 'القرآن (Quran)',
    explanation: 'سورة العلق هي أول ما نزل من القرآن الكريم. (Surah Al-Alaq was the first revelation.)'
  },
  {
    id: '12',
    question: 'ما هي السورة التي تعدُّ "أمُّ الكتاب"؟ (Which surah is called "The Mother of the Book"?)',
    options: ['الإخلاص (Al-Ikhlas)', 'البقرة (Al-Baqarah)', 'يس (Ya-Sin)', 'الفاتحة (Al-Fatihah)'],
    correct: 3,
    category: 'القرآن (Quran)',
    explanation: 'تلقب سورة الفاتحة بأم الكتاب. (Surah Al-Fatihah is called Umm al-Kitab.)'
  },
  {
    id: '13',
    question: 'ما هي السُّورة التي تخلو من البسملة في بدايتها؟ (Which surah has no Basmalah at the beginning?)',
    options: ['يس (Ya-Sin)', 'التوبة (At-Tawbah)', 'الرحمن (Ar-Rahman)', 'الكهف (Al-Kahf)'],
    correct: 1,
    category: 'القرآن (Quran)',
    explanation: 'سورة التوبة هي السورة الوحيدة التي لا تبدأ بالبسملة. (Surah At-Tawbah is the only surah without Basmalah at the start.)'
  },
  {
    id: '14',
    question: 'كم هي المدَّة التي استغرقها نزول القرآن الكريم؟ (How long did the Quran revelation take?)',
    options: ['١٠ سنوات', '١٥ سنة', '٢٠ سنة', '٢٣ سنة'],
    correct: 3,
    category: 'القرآن (Quran)',
    explanation: 'استغرق نزول القرآن الكريم ٢٣ عاماً. (The revelation took 23 years.)'
  },
  {
    id: '15',
    question: 'أين كان يتعبَّد رسول الله ﷺ قبل البعثة؟ (Where did the Prophet ﷺ worship before the mission?)',
    options: ['غار ثور (Cave Thawr)', 'المسجد الحرام', 'غار حراء (Cave Hira)', 'جبل أحد'],
    correct: 2,
    category: 'السيرة النبوية (Seerah)',
    explanation: 'كان يتعبد في غار حراء. (He used to worship in Cave Hira.)'
  },
  {
    id: '16',
    question: 'ما اسم الدَّابة التي ركبها رسول الله ﷺ في ليلة الإسراء والمعراج؟ (What was the name of the creature the Prophet ﷺ rode during Isra and Mi\'raj?)',
    options: ['البراق (Al-Buraq)', 'القصواء', 'العذراء', 'البيداء'],
    correct: 0,
    category: 'السيرة النبوية (Seerah)',
    explanation: 'البراق هي الدابة التي ركبها النَّبي ﷺ. (Al-Buraq was the creature the Prophet ﷺ rode.)'
  },
  {
    id: '17',
    question: 'من هي أوَّل شهيدة في الإسلام؟ (Who was the first female martyr in Islam?)',
    options: ['خديجة رضي الله عنها', 'سمية بنت الخياط', 'عائشة رضي الله عنها', 'فاطمة رضي الله عنها'],
    correct: 1,
    category: 'الصحابة (Companions)',
    explanation: 'سمية بنت الخياط هي أول شهيدة في الإسلام. (Sumayyah bint Khayyat was the first martyr.)'
  },
  {
    id: '18',
    question: 'من هو الصحابي الذي ذكر اسمه في القرآن صريحاً؟ (Which companion\'s name is explicitly mentioned in the Quran?)',
    options: ['أبو بكر الصديق', 'عمر بن الخطاب', 'علي بن أبي طالب', 'زيد بن حارثة'],
    correct: 3,
    category: 'الصحابة (Companions)',
    explanation: 'زيد بن حارثة هو الصحابي الوحيد الذي ذكر اسمه صراحة في القرآن. (Zayd ibn Harithah is the only companion mentioned by name.)'
  },
  {
    id: '19',
    question: 'من هو الملك خازن الجنَّة؟ (Which angel is the keeper of Paradise?)',
    options: ['مالك (Malik)', 'رضوان (Ridwan)', 'ميكائيل', 'إسرافيل'],
    correct: 1,
    category: 'الملائكة (Angels)',
    explanation: 'رضوان عليه السلام هو خازن الجنة. (Ridwan is the keeper of Paradise.)'
  },
  {
    id: '20',
    question: 'من هو الملك خازن النَّار؟ (Which angel is the keeper of Hellfire?)',
    options: ['رضوان', 'جبريل', 'مالك (Malik)', 'إسرافيل'],
    correct: 2,
    category: 'الملائكة (Angels)',
    explanation: 'مالك عليه السلام هو خازن النار. (Malik is the keeper of Hellfire.)'
  },
  {
    id: '21',
    question: 'متى فرض الصِّيام على المسلمين؟ (When was fasting made obligatory for Muslims?)',
    options: ['السنة الأولى للهجرة', 'السنة الثانية للهجرة', 'السنة الثالثة للهجرة', 'السنة الرابعة للهجرة'],
    correct: 1,
    category: 'أركان الإسلام (Pillars)',
    explanation: 'فرض الصيام في السنة الثانية من الهجرة. (Fasting was made obligatory in the 2nd year of Hijra.)'
  },
  {
    id: '22',
    question: 'كم كانت أول عدد صلوات فرضها الله في ليلة الإسراء والمعراج؟ (How many prayers were initially prescribed during Isra and Mi\'raj?)',
    options: ['٥ صلوات', '١٠ صلوات', '٤٠ صلاة', '٥٠ صلاة'],
    correct: 3,
    category: 'الصلاة (Salah)',
    explanation: 'فرضت الصلاة أولاً خمسين صلاة ثم خففت إلى خمس. (Prayers were initially fifty, then reduced to five.)'
  },
  {
    id: '23',
    question: 'ما هي السورة التي شيّبت رسول الله ﷺ؟ (Which surah made the Prophet\'s hair turn white?)',
    options: ['البقرة', 'هود وأخواتها (Hud & sisters)', 'يس', 'الواقعة'],
    correct: 1,
    category: 'القرآن (Quran)',
    explanation: 'قال ﷺ: "شيبتني هود وأخواتها". (The Prophet ﷺ said Hud and its sisters made him turn white.)'
  },
  {
    id: '24',
    question: 'من هو خليل الله؟ (Who is the "Khalil" (Friend) of Allah?)',
    options: ['محمد ﷺ', 'موسى عليه السلام', 'إبراهيم عليه السلام', 'عيسى عليه السلام'],
    correct: 2,
    category: 'الأنبياء (Prophets)',
    explanation: 'النبي إبراهيم عليه السلام هو خليل الله. (Prophet Ibrahim is the Khalil of Allah.)'
  },
  {
    id: '25',
    question: 'من هو كليم الله؟ (Who is the "Kalim" (Spoken to) of Allah?)',
    options: ['إبراهيم عليه السلام', 'موسى عليه السلام', 'نوح عليه السلام', 'عيسى عليه السلام'],
    correct: 1,
    category: 'الأنبياء (Prophets)',
    explanation: 'النبي موسى عليه السلام هو كليم الله. (Prophet Musa is the Kalim of Allah.)'
  }
];

export const quizCategories = ['All', 'القرآن (Quran)', 'أركان الإسلام (Pillars)', 'الصلاة (Salah)', 'الأنبياء (Prophets)', 'الملائكة (Angels)', 'السيرة النبوية (Seerah)', 'الصحابة (Companions)', 'عام (General)'];
