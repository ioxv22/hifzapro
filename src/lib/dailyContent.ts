export interface Dua {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  english: string;
  reference: string;
  category: string;
}

export const duas: Dua[] = [
  {
    id: '1',
    title: 'دعاء الصباح',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: "Asbahna wa asbahal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah",
    english: 'We have reached the morning and at this very time the whole kingdom belongs to Allah.',
    reference: 'رواه مسلم ٢٧٢٣',
    category: 'الصباح'
  },
  {
    id: '2',
    title: 'عند النوم',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: "Bismika Allahumma amutu wa ahya",
    english: 'In Your name O Allah, I die and I live.',
    reference: 'رواه البخاري ٦٣٢٤',
    category: 'المساء'
  },
  {
    id: '3',
    title: 'بعد الطعام',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    transliteration: "Alhamdu lillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah",
    english: 'All praise is due to Allah, Who has fed me this.',
    reference: 'رواه الترمذي ٣٤٥٨',
    category: 'الطعام'
  },
  {
    id: '4',
    title: 'دخول المسجد',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: "Allahummaf-tahli abwaba rahmatik",
    english: 'O Allah, open for me the doors of Your Mercy.',
    reference: 'رواه مسلم ٧١٣',
    category: 'المسجد'
  },
  {
    id: '5',
    title: 'دعاء الحماية',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-Sami'ul-'Alim",
    english: 'In the Name of Allah, with Whose Name nothing can harm.',
    reference: 'رواه أبو داود ٥٠٨٨',
    category: 'الحماية'
  },
  {
    id: '6',
    title: 'طلب المغفرة',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    transliteration: "Astaghfirullaha al-'Azima alladhi la ilaha illa Huwa al-Hayyu al-Qayyumu wa atubu ilayh",
    english: 'I seek forgiveness from Allah the Almighty.',
    reference: 'رواه أبو داود ١٥١٧',
    category: 'الاستغفار'
  },
  {
    id: '7',
    title: 'دعاء الاستخارة',
    arabic: 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ',
    transliteration: "Allahumma inni astakhiruka bi'ilmika, wa astaqdiruka biqudratika, wa as'aluka min fadlikal-'azim",
    english: 'O Allah, I seek Your guidance through Your knowledge.',
    reference: 'رواه البخاري ١١٦٦',
    category: 'الهداية'
  },
];

export interface Hadith {
  id: string;
  text: string;
  narrator: string;
  source: string;
  topic: string;
}

export const hadiths: Hadith[] = [
  {
    id: '1',
    text: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    narrator: 'عثمان بن عفان رضي الله عنه',
    source: 'صحيح البخاري ٥٠٢٧',
    topic: 'القرآن'
  },
  {
    id: '2',
    text: 'لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    narrator: 'أنس بن مالك رضي الله عنه',
    source: 'صحيح البخاري ١٣',
    topic: 'الإيمان'
  },
  {
    id: '3',
    text: 'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ',
    narrator: 'أبو هريرة رضي الله عنه',
    source: 'صحيح البخاري ٦١١٤',
    topic: 'الأخلاق'
  },
  {
    id: '4',
    text: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    narrator: 'أبو هريرة رضي الله عنه',
    source: 'صحيح البخاري ٦٠١٨',
    topic: 'اللسان'
  },
  {
    id: '5',
    text: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ',
    narrator: 'عائشة رضي الله عنها',
    source: 'صحيح البخاري ٦٤٦٤',
    topic: 'الأعمال'
  },
  {
    id: '6',
    text: 'يَسِّرُوا وَلاَ تُعَسِّرُوا، وَبَشِّرُوا وَلاَ تُنَفِّرُوا',
    narrator: 'أنس بن مالك رضي الله عنه',
    source: 'صحيح البخاري ٦٩',
    topic: 'الأخلاق'
  },
  {
    id: '7',
    text: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
    narrator: 'عبد الله بن عمرو رضي الله عنه',
    source: 'صحيح البخاري ١٠',
    topic: 'الأخلاق'
  },
  {
    id: '8',
    text: 'الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ',
    narrator: 'أبو هريرة رضي الله عنه',
    source: 'صحيح مسلم ٢٩٥٦',
    topic: 'الدنيا'
  },
  {
    id: '9',
    text: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
    narrator: 'أبو ذر رضي الله عنه',
    source: 'جامع الترمذي ١٩٥٦',
    topic: 'الصدقة'
  },
  {
    id: '10',
    text: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
    narrator: 'أنس بن مالك رضي الله عنه',
    source: 'سنن ابن ماجه ٢٢٤',
    topic: 'العلم'
  },
];

export const islamicReminders = [
  { title: 'الصبر', text: 'إن الله مع الصابرين (البقرة ٢:١٥٣)', icon: '🤲' },
  { title: 'الشكر', text: 'لئن شكرتم لأزيدنكم (إبراهيم ١٤:٧)', icon: '✨' },
  { title: 'التوكل', text: 'ومن يتوكل على الله فهو حسبه (الطلاق ٦٥:٣)', icon: '🌟' },
  { title: 'الكلمة الطيبة', text: 'وقولوا للناس حسناً (البقرة ٢:٨٣)', icon: '💚' },
  { title: 'الذكر', text: 'ألا بذكر الله تطمئن القلوب (الرعد ١٣:٢٨)', icon: '🕌' },
  { title: 'الأمل', text: 'لا تقنطوا من رحمة الله (الزمر ٣٩:٥٣)', icon: '🌙' },
  { title: 'العمل الصالح', text: 'من عمل صالحاً فلنفسه (الجاثية ٤٥:١٥)', icon: '⭐' },
];

export function getDailyDua(): Dua {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return duas[dayOfYear % duas.length];
}

export function getDailyHadith(): Hadith {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return hadiths[dayOfYear % hadiths.length];
}

export function getDailyReminders() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const start = (dayOfYear * 3) % islamicReminders.length;
  return [
    islamicReminders[start % islamicReminders.length],
    islamicReminders[(start + 1) % islamicReminders.length],
    islamicReminders[(start + 2) % islamicReminders.length],
  ];
}
