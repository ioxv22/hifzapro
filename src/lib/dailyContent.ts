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
    title: 'Morning Supplication',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
    transliteration: "Asbahna wa asbahal mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la sharika lah",
    english: 'We have reached the morning and at this very time the whole kingdom belongs to Allah. All praise is due to Allah. None has the right to be worshipped except Allah alone, having no partner.',
    reference: 'Muslim 2723',
    category: 'Morning'
  },
  {
    id: '2',
    title: 'Before Sleeping',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: "Bismika Allahumma amutu wa ahya",
    english: 'In Your name O Allah, I die and I live.',
    reference: 'Bukhari 6324',
    category: 'Evening'
  },
  {
    id: '3',
    title: 'After Eating',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    transliteration: "Alhamdu lillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah",
    english: 'All praise is due to Allah, Who has fed me this and provided me with it without any effort or power on my part.',
    reference: 'Tirmidhi 3458',
    category: 'Food'
  },
  {
    id: '4',
    title: 'Entering the Mosque',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    transliteration: "Allahummaf-tahli abwaba rahmatik",
    english: 'O Allah, open for me the doors of Your Mercy.',
    reference: 'Muslim 713',
    category: 'Mosque'
  },
  {
    id: '5',
    title: 'For Protection',
    arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
    transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-Sami'ul-'Alim",
    english: 'In the Name of Allah, with Whose Name nothing on earth or in heaven can harm, and He is the All-Hearing, All-Knowing.',
    reference: 'Abu Dawud 5088',
    category: 'Protection'
  },
  {
    id: '6',
    title: 'Seeking Forgiveness',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    transliteration: "Astaghfirullaha al-'Azima alladhi la ilaha illa Huwa al-Hayyu al-Qayyumu wa atubu ilayh",
    english: 'I seek forgiveness from Allah the Almighty, there is no deity but Him, the Living, the Self-Sustaining, and I repent to Him.',
    reference: 'Abu Dawud 1517',
    category: 'Forgiveness'
  },
  {
    id: '7',
    title: 'For Guidance',
    arabic: 'اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ',
    transliteration: "Allahumma inni astakhiruka bi'ilmika, wa astaqdiruka biqudratika, wa as'aluka min fadlikal-'azim",
    english: 'O Allah, I seek Your guidance through Your knowledge, and I seek ability through Your power, and I ask You from Your immense bounty.',
    reference: 'Bukhari 1166',
    category: 'Guidance'
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
    text: 'The best among you are those who learn the Quran and teach it.',
    narrator: 'Uthman ibn Affan (RA)',
    source: 'Sahih al-Bukhari 5027',
    topic: 'Quran'
  },
  {
    id: '2',
    text: 'None of you truly believes until he loves for his brother what he loves for himself.',
    narrator: 'Anas ibn Malik (RA)',
    source: 'Sahih al-Bukhari 13',
    topic: 'Faith'
  },
  {
    id: '3',
    text: 'The strong is not the one who overcomes the people by his strength, but the strong is the one who controls himself while in anger.',
    narrator: 'Abu Hurairah (RA)',
    source: 'Sahih al-Bukhari 6114',
    topic: 'Character'
  },
  {
    id: '4',
    text: 'Whoever believes in Allah and the Last Day should speak good or remain silent.',
    narrator: 'Abu Hurairah (RA)',
    source: 'Sahih al-Bukhari 6018',
    topic: 'Speech'
  },
  {
    id: '5',
    text: 'The most beloved deed to Allah is the most regular and constant even if it were little.',
    narrator: 'Aisha (RA)',
    source: 'Sahih al-Bukhari 6464',
    topic: 'Deeds'
  },
  {
    id: '6',
    text: 'Make things easy and do not make them difficult, cheer the people up by conveying glad tidings to them and do not repulse them.',
    narrator: 'Anas ibn Malik (RA)',
    source: 'Sahih al-Bukhari 69',
    topic: 'Character'
  },
  {
    id: '7',
    text: 'A Muslim is the one from whose tongue and hands the people are safe.',
    narrator: 'Abdullah ibn Amr (RA)',
    source: 'Sahih al-Bukhari 10',
    topic: 'Character'
  },
  {
    id: '8',
    text: 'The world is a prison for the believer and a paradise for the disbeliever.',
    narrator: 'Abu Hurairah (RA)',
    source: 'Sahih Muslim 2956',
    topic: 'Dunya'
  },
  {
    id: '9',
    text: 'Smiling in the face of your brother is charity.',
    narrator: 'Abu Dharr (RA)',
    source: 'Jami at-Tirmidhi 1956',
    topic: 'Charity'
  },
  {
    id: '10',
    text: 'Seeking knowledge is an obligation upon every Muslim.',
    narrator: 'Anas ibn Malik (RA)',
    source: 'Sunan Ibn Majah 224',
    topic: 'Knowledge'
  },
];

export const islamicReminders = [
  { title: 'Patience', text: 'Indeed, Allah is with the patient. (Quran 2:153)', icon: '🤲' },
  { title: 'Gratitude', text: 'If you are grateful, I will surely increase you in favor. (Quran 14:7)', icon: '✨' },
  { title: 'Trust in Allah', text: 'And whoever relies upon Allah – then He is sufficient for him. (Quran 65:3)', icon: '🌟' },
  { title: 'Kindness', text: 'And speak to people good words. (Quran 2:83)', icon: '💚' },
  { title: 'Remembrance', text: 'Verily, in the remembrance of Allah do hearts find rest. (Quran 13:28)', icon: '🕌' },
  { title: 'Hope', text: 'Do not despair of the mercy of Allah. (Quran 39:53)', icon: '🌙' },
  { title: 'Good Deeds', text: 'Whoever does righteousness, it is for his own soul. (Quran 45:15)', icon: '⭐' },
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
