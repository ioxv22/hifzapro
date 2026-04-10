'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type Language = 'en' | 'ar' | 'fr' | 'ur' | 'hi' | 'tr' | 'id' | 'bn' | 'ms' | 'de' | 'es' | 'ru';

export interface LangInfo {
  code: Language;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  quranTranslation: string; // AlQuran Cloud API edition identifier
  flag: string;
}

export const languages: LangInfo[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', quranTranslation: 'ar.alafasy', flag: '🇦🇪' },
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', quranTranslation: 'en.sahih', flag: '🇬🇧' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr', quranTranslation: 'fr.hamidullah', flag: '🇫🇷' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', dir: 'rtl', quranTranslation: 'ur.jalandhry', flag: '🇵🇰' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr', quranTranslation: 'hi.hindi', flag: '🇮🇳' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', dir: 'ltr', quranTranslation: 'tr.diyanet', flag: '🇹🇷' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', dir: 'ltr', quranTranslation: 'id.indonesian', flag: '🇮🇩' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', dir: 'ltr', quranTranslation: 'bn.bengali', flag: '🇧🇩' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', dir: 'ltr', quranTranslation: 'ms.basmeih', flag: '🇲🇾' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr', quranTranslation: 'de.aburida', flag: '🇩🇪' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr', quranTranslation: 'es.cortes', flag: '🇪🇸' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', dir: 'ltr', quranTranslation: 'ru.kuliev', flag: '🇷🇺' },
];

// UI Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
  en: {
    home: 'Home', quran: 'Quran', dhikr: 'Dhikr', prayer: 'Prayer', daily: 'Daily', quiz: 'Quiz',
    signIn: 'Sign In', signUp: 'Sign Up', logout: 'Logout', dashboard: 'Dashboard', admin: 'Admin Panel',
    heroTitle1: 'Strengthen Your', heroTitle2: 'Connection with Islam',
    heroDesc: 'Your comprehensive Islamic companion for Quran reading, Dhikr tracking, Prayer times, and spiritual growth.',
    getStarted: 'Get Started Free', readQuran: 'Read Quran',
    surahs: 'Surahs', ayahs: 'Ayahs', dailyPrayers: 'Daily Prayers', blessings: 'Blessings',
    features: 'Everything You Need for Your', spiritualJourney: 'Spiritual Journey',
    featuresDesc: 'Comprehensive tools designed to help you grow in faith every single day.',
    quranTitle: 'The Holy', quranSubtitle: 'Read, listen, and reflect on the words of Allah',
    searchSurah: 'Search surah by name or number...', all: 'All', meccan: 'Meccan', medinan: 'Medinan',
    showing: 'Showing', of: 'of',
    dhikrTitle: 'Dhikr', counter: 'Counter', dhikrDesc: 'Remember Allah with consistency and devotion',
    todaysTotal: "Today's Total Dhikr", resetCurrent: 'Reset Current', resetAll: 'Reset All',
    goalComplete: 'Goal Complete! MashaAllah!', progressOverview: 'Progress Overview',
    prayerTitle: 'Prayer', times: 'Times', prayerDesc: 'Accurate prayer times for your location',
    nextPrayer: 'Next Prayer', timeRemaining: 'Time Remaining',
    qiblaDirection: 'Qibla Direction', qiblaDesc: 'Direction to Makkah from your location',
    dailyTitle: 'Daily', islamicContent: 'Islamic Content', dailyDesc: 'Nourish your soul with daily spiritual reminders',
    duas: 'Duas', hadith: 'Hadith', reminders: 'Reminders', duaOfDay: 'Dua of the Day', hadithOfDay: 'Hadith of the Day',
    quizTitle: 'Islamic', quizWord: 'Quiz', quizDesc: 'Test and strengthen your Islamic knowledge',
    chooseCategory: 'Choose a Category', selectTopic: 'Select a topic to test your knowledge',
    recentScores: 'Recent Scores', question: 'Question', score: 'Score', seeResults: 'See Results',
    nextQuestion: 'Next Question', tryAgain: 'Try Again', categories: 'Categories', explanation: 'Explanation',
    welcomeBack: 'Welcome Back', joinHifzpro: 'Join HifzPro',
    signInContinue: 'Sign in to continue your journey', createAccount: 'Create an account to track your progress',
    fullName: 'Full Name', email: 'Email Address', password: 'Password',
    assalamuAlaikum: 'Assalamu Alaikum,', journeyOverview: "Here's your spiritual journey overview",
    dayStreak: 'Day Streak', keepGoing: 'Keep going! Consistency is key to spiritual growth.',
    bookmarks: 'Bookmarks', totalDhikr: 'Total Dhikr', quizzesTaken: 'Quizzes Taken', avgScore: 'Avg Quiz Score',
    quranProgress: 'Quran Progress', lastRead: 'Last Read', continueReading: 'Continue Reading',
    todaysDhikr: "Today's Dhikr", openCounter: 'Open Counter', quizHistory: 'Quiz History', takeQuiz: 'Take a Quiz',
    favoriteAyahs: 'Favorite Ayahs', quickActions: 'Quick Actions', prayerTimes: 'Prayer Times',
    statistics: 'Statistics', users: 'Users', content: 'Content', totalUsers: 'Total Users',
    activeToday: 'Active Today', userActivity: 'User Activity', manageUsers: 'Manage Users',
    addDua: 'Add Dua', addHadith: 'Add Hadith', addQuiz: 'Add Quiz Question',
    title: 'Title', reference: 'Reference', arabicText: 'Arabic text', englishTranslation: 'English translation',
    narrator: 'Narrator', source: 'Source', delete: 'Delete',
    backToSurahs: 'Back to Surahs', prev: 'Prev', next: 'Next',
    translationOn: 'Translation ON', translationOff: 'Translation OFF',
    bookmark: 'Bookmark', favorite: 'Favorite', play: 'Play', pause: 'Pause',
    language: 'Language', selectLanguage: 'Select Language',
    voiceAssistant: 'Voice Assistant', listening: 'Listening...', speak: 'Speak a command...',
    askQuestion: 'Ask a question or give a command', close: 'Close',
    audioPlayer: 'Audio Player', nowPlaying: 'Now Playing', download: 'Download',
    beginJourney: 'Begin Your Journey', today: 'Today',
    joinMessage: 'Join thousands of Muslims strengthening their connection with Allah through consistent daily practice.',
    startNow: 'Start Now', viewDashboard: 'View Dashboard', goToDashboard: 'Go to Dashboard',
    builtForUmmah: 'Built with ❤️ for the Ummah.',
    islamicCalendar: 'Islamic Calendar',
    explore: 'Explore',
    orSignInWith: 'Or sign in with',
    loginFailed: 'Login failed',
    registrationFailed: 'Registration failed',
    googleLoginFailed: 'Google login failed',
    nameRequired: 'Name is required',
    passwordShort: 'Password must be at least 6 characters',
    statsTab: 'Statistics',
    usersTab: 'Users',
    contentTab: 'Content',
    managePlatform: 'Manage your platform',
    totalUsers: 'Total Users',
    activeUsers: 'Active Users',
    guestVisitsUnique: 'Guest Visits (Unique)',
    totalDhikrStat: 'Total Dhikr',
    quizzesTakenStat: 'Quizzes Taken',
    userActivity: 'User Activity',
    joined: 'Joined',
    streak: 'Streak',
    manageUsers: 'Manage Users',
    role: 'Role',
    lastActive: 'Last Active',
    actions: 'Actions',
    addDua: 'Add Dua',
    addHadith: 'Add Hadith',
    addQuizQuestion: 'Add Quiz Question',
    option: 'Option',
    correctOption: 'Correct Option',
  },
  ar: {
    home: 'الرئيسية', quran: 'القرآن', dhikr: 'الذكر', prayer: 'الصلاة', daily: 'يومي', quiz: 'اختبار',
    signIn: 'تسجيل الدخول', signUp: 'إنشاء حساب', logout: 'تسجيل الخروج', dashboard: 'لوحة التحكم', admin: 'لوحة الإدارة',
    heroTitle1: 'عزّز', heroTitle2: 'صلتك بالإسلام',
    heroDesc: 'رفيقك الإسلامي الشامل لقراءة القرآن وتتبع الأذكار ومواقيت الصلاة والنمو الروحي.',
    getStarted: 'ابدأ مجاناً', readQuran: 'اقرأ القرآن',
    surahs: 'سور', ayahs: 'آيات', dailyPrayers: 'صلوات', blessings: 'بركات',
    features: 'كل ما تحتاجه في', spiritualJourney: 'رحلتك الروحية',
    featuresDesc: 'أدوات شاملة مصممة لمساعدتك على النمو في الإيمان كل يوم.',
    quranTitle: 'القرآن', quranSubtitle: 'اقرأ واستمع وتدبر كلام الله',
    searchSurah: 'ابحث عن سورة بالاسم أو الرقم...', all: 'الكل', meccan: 'مكية', medinan: 'مدنية',
    showing: 'عرض', of: 'من',
    dhikrTitle: 'عداد', counter: 'الأذكار', dhikrDesc: 'اذكر الله بثبات وإخلاص',
    todaysTotal: 'إجمالي أذكار اليوم', resetCurrent: 'إعادة الحالي', resetAll: 'إعادة الكل',
    goalComplete: 'اكتمل الهدف! ما شاء الله!', progressOverview: 'نظرة عامة على التقدم',
    prayerTitle: 'مواقيت', times: 'الصلاة', prayerDesc: 'مواقيت صلاة دقيقة لموقعك',
    nextPrayer: 'الصلاة القادمة', timeRemaining: 'الوقت المتبقي',
    qiblaDirection: 'اتجاه القبلة', qiblaDesc: 'اتجاه مكة من موقعك',
    dailyTitle: 'المحتوى', islamicContent: 'الإسلامي اليومي', dailyDesc: 'غذّ روحك بتذكيرات روحية يومية',
    duas: 'أدعية', hadith: 'حديث', reminders: 'تذكيرات', duaOfDay: 'دعاء اليوم', hadithOfDay: 'حديث اليوم',
    quizTitle: 'اختبار', quizWord: 'إسلامي', quizDesc: 'اختبر وعزز معرفتك الإسلامية',
    chooseCategory: 'اختر فئة', selectTopic: 'اختر موضوعاً لاختبار معرفتك',
    recentScores: 'النتائج الأخيرة', question: 'سؤال', score: 'النتيجة', seeResults: 'عرض النتائج',
    nextQuestion: 'السؤال التالي', tryAgain: 'حاول مرة أخرى', categories: 'الفئات', explanation: 'الشرح',
    welcomeBack: 'مرحباً بعودتك', joinHifzpro: 'انضم إلى حفظ برو',
    signInContinue: 'سجل الدخول لمواصلة رحلتك', createAccount: 'أنشئ حساباً لتتبع تقدمك',
    fullName: 'الاسم الكامل', email: 'البريد الإلكتروني', password: 'كلمة المرور',
    assalamuAlaikum: 'السلام عليكم،', journeyOverview: 'نظرة عامة على رحلتك الروحية',
    dayStreak: 'يوم متتالي', keepGoing: 'واصل! الثبات هو مفتاح النمو الروحي.',
    bookmarks: 'إشارات مرجعية', totalDhikr: 'إجمالي الذكر', quizzesTaken: 'اختبارات', avgScore: 'متوسط النتيجة',
    quranProgress: 'تقدم القرآن', lastRead: 'آخر قراءة', continueReading: 'متابعة القراءة',
    todaysDhikr: 'أذكار اليوم', openCounter: 'فتح العداد', quizHistory: 'سجل الاختبارات', takeQuiz: 'خذ اختباراً',
    favoriteAyahs: 'الآيات المفضلة', quickActions: 'إجراءات سريعة', prayerTimes: 'مواقيت الصلاة',
    statistics: 'الإحصائيات', users: 'المستخدمون', content: 'المحتوى', totalUsers: 'إجمالي المستخدمين',
    activeToday: 'نشط اليوم', userActivity: 'نشاط المستخدمين', manageUsers: 'إدارة المستخدمين',
    addDua: 'إضافة دعاء', addHadith: 'إضافة حديث', addQuiz: 'إضافة سؤال',
    title: 'العنوان', reference: 'المرجع', arabicText: 'النص العربي', englishTranslation: 'الترجمة',
    narrator: 'الراوي', source: 'المصدر', delete: 'حذف',
    backToSurahs: 'العودة إلى السور', prev: 'السابق', next: 'التالي',
    translationOn: 'الترجمة مفعلة', translationOff: 'الترجمة معطلة',
    bookmark: 'إشارة', favorite: 'مفضلة', play: 'تشغيل', pause: 'إيقاف',
    language: 'اللغة', selectLanguage: 'اختر اللغة',
    voiceAssistant: 'المساعد الصوتي', listening: 'جارٍ الاستماع...', speak: 'تحدث بأمر...',
    askQuestion: 'اطرح سؤالاً أو أعطِ أمراً', close: 'إغلاق',
    audioPlayer: 'مشغل الصوت', nowPlaying: 'يعمل الآن', download: 'تحميل',
    beginJourney: 'ابدأ رحلتك', today: 'اليوم',
    joinMessage: 'انضم إلى آلاف المسلمين الذين يعززون صلتهم بالله من خلال الممارسة اليومية المنتظمة.',
    startNow: 'ابدأ الآن', viewDashboard: 'عرض لوحة التحكم', goToDashboard: 'اذهب إلى لوحة التحكم',
    builtForUmmah: 'صنع بـ ❤️ للأمة.',
    islamicCalendar: 'التقويم الهجري',
    explore: 'استكشف',
    orSignInWith: 'أو سجل عبر',
    loginFailed: 'فشل تسجيل الدخول',
    registrationFailed: 'فشل إنشاء الحساب',
    googleLoginFailed: 'فشل الدخول بقوقل',
    nameRequired: 'الاسم مطلوب',
    passwordShort: 'كلمة المرور قصيرة جداً',
    statsTab: 'الإحصائيات',
    usersTab: 'المستخدمون',
    contentTab: 'المحتوى',
    managePlatform: 'إدارة المنصة الخاصة بك',
    totalUsers: 'إجمالي المستخدمين',
    activeUsers: 'المستخدمون النشطون',
    guestVisitsUnique: 'زيارات الضيوف (فريدة)',
    totalDhikrStat: 'إجمالي الأذكار',
    quizzesTakenStat: 'الاختبارات المنجزة',
    userActivity: 'نشاط المستخدمين',
    joined: 'تاريخ الانضمام',
    streak: 'الاستمرارية',
    manageUsers: 'إدارة المستخدمين',
    role: 'الدور',
    lastActive: 'آخر نشاط',
    actions: 'الإجراءات',
    addDua: 'إضافة دعاء',
    addHadith: 'إضافة حديث',
    addQuizQuestion: 'إضافة سؤال اختبار',
    option: 'خيار',
    correctOption: 'الخيار الصحيح',
  },
  fr: {
    home: 'Accueil', quran: 'Coran', dhikr: 'Dhikr', prayer: 'Prière', daily: 'Quotidien', quiz: 'Quiz',
    signIn: 'Connexion', signUp: "S'inscrire", logout: 'Déconnexion', dashboard: 'Tableau de bord', admin: "Panneau d'admin",
    heroTitle1: 'Renforcez Votre', heroTitle2: "Connexion avec l'Islam",
    heroDesc: "Votre compagnon islamique complet pour la lecture du Coran, le suivi du Dhikr, les heures de prière et la croissance spirituelle.",
    getStarted: 'Commencer Gratuitement', readQuran: 'Lire le Coran',
    surahs: 'Sourates', ayahs: 'Versets', dailyPrayers: 'Prières', blessings: 'Bénédictions',
    features: 'Tout ce dont vous avez besoin pour votre', spiritualJourney: 'Voyage Spirituel',
    featuresDesc: 'Des outils complets conçus pour vous aider à grandir dans la foi chaque jour.',
    quranTitle: 'Le Saint', quranSubtitle: "Lisez, écoutez et méditez les paroles d'Allah",
    searchSurah: 'Rechercher une sourate...', all: 'Tout', meccan: 'Mecquoise', medinan: 'Médinoise',
    showing: 'Affichage', of: 'sur',
    dhikrTitle: 'Compteur', counter: 'de Dhikr', dhikrDesc: "Rappelez-vous d'Allah avec constance et dévotion",
    todaysTotal: "Total du Dhikr d'aujourd'hui", resetCurrent: 'Réinitialiser', resetAll: 'Tout Réinitialiser',
    goalComplete: 'Objectif atteint ! MashaAllah !', progressOverview: 'Aperçu du progrès',
    prayerTitle: 'Heures de', times: 'Prière', prayerDesc: 'Heures de prière précises pour votre lieu',
    nextPrayer: 'Prochaine Prière', timeRemaining: 'Temps Restant',
    qiblaDirection: 'Direction de la Qibla', qiblaDesc: 'Direction de La Mecque depuis votre position',
    dailyTitle: 'Contenu', islamicContent: 'Islamique Quotidien', dailyDesc: 'Nourrissez votre âme avec des rappels spirituels',
    duas: 'Douaas', hadith: 'Hadith', reminders: 'Rappels', duaOfDay: 'Doua du Jour', hadithOfDay: 'Hadith du Jour',
    quizTitle: 'Quiz', quizWord: 'Islamique', quizDesc: 'Testez et renforcez vos connaissances islamiques',
    chooseCategory: 'Choisir une catégorie', selectTopic: 'Sélectionnez un sujet',
    recentScores: 'Scores Récents', question: 'Question', score: 'Score', seeResults: 'Voir les Résultats',
    nextQuestion: 'Question Suivante', tryAgain: 'Réessayer', categories: 'Catégories', explanation: 'Explication',
    welcomeBack: 'Bon Retour', joinHifzpro: 'Rejoindre HifzPro',
    signInContinue: 'Connectez-vous pour continuer', createAccount: 'Créez un compte pour suivre votre progrès',
    fullName: 'Nom Complet', email: 'Adresse Email', password: 'Mot de Passe',
    assalamuAlaikum: 'Assalamu Alaikum,', journeyOverview: 'Aperçu de votre parcours spirituel',
    dayStreak: 'Jours Consécutifs', keepGoing: 'Continuez ! La constance est la clé de la croissance.',
    bookmarks: 'Signets', totalDhikr: 'Total Dhikr', quizzesTaken: 'Quiz Passés', avgScore: 'Score Moyen',
    quranProgress: 'Progrès Coran', lastRead: 'Dernière Lecture', continueReading: 'Continuer la Lecture',
    todaysDhikr: "Dhikr d'Aujourd'hui", openCounter: 'Ouvrir le Compteur', quizHistory: 'Historique Quiz', takeQuiz: 'Passer un Quiz',
    favoriteAyahs: 'Versets Favoris', quickActions: 'Actions Rapides', prayerTimes: 'Heures de Prière',
    statistics: 'Statistiques', users: 'Utilisateurs', content: 'Contenu', totalUsers: 'Total Utilisateurs',
    activeToday: "Actifs Aujourd'hui", userActivity: 'Activité Utilisateurs', manageUsers: 'Gérer les Utilisateurs',
    addDua: 'Ajouter Doua', addHadith: 'Ajouter Hadith', addQuiz: 'Ajouter Question',
    title: 'Titre', reference: 'Référence', arabicText: 'Texte Arabe', englishTranslation: 'Traduction',
    narrator: 'Narrateur', source: 'Source', delete: 'Supprimer',
    backToSurahs: 'Retour aux Sourates', prev: 'Préc.', next: 'Suiv.',
    translationOn: 'Traduction ON', translationOff: 'Traduction OFF',
    bookmark: 'Signet', favorite: 'Favori', play: 'Lire', pause: 'Pause',
    language: 'Langue', selectLanguage: 'Choisir la langue',
    voiceAssistant: 'Assistant Vocal', listening: 'Écoute en cours...', speak: 'Parlez une commande...',
    askQuestion: 'Posez une question ou donnez une commande', close: 'Fermer',
    audioPlayer: 'Lecteur Audio', nowPlaying: 'En cours', download: 'Télécharger',
    beginJourney: 'Commencez Votre Voyage', today: "Aujourd'hui",
    joinMessage: "Rejoignez des milliers de musulmans qui renforcent leur lien avec Allah par la pratique quotidienne.",
    startNow: 'Commencer', viewDashboard: 'Voir le Tableau', goToDashboard: 'Aller au Tableau',
    builtForUmmah: "Construit avec ❤️ pour la Oumma.",
    islamicCalendar: 'Calendrier Islamique',
  },
  ur: {
    home: 'ہوم', quran: 'قرآن', dhikr: 'ذکر', prayer: 'نماز', daily: 'روزانہ', quiz: 'کوئز',
    signIn: 'لاگ ان', signUp: 'سائن اپ', logout: 'لاگ آؤٹ', dashboard: 'ڈیش بورڈ', admin: 'ایڈمن پینل',
    heroTitle1: 'اپنا رشتہ', heroTitle2: 'اسلام سے مضبوط کریں',
    heroDesc: 'قرآن پڑھنے، ذکر، نماز کے اوقات اور روحانی ترقی کے لیے آپ کا جامع اسلامی ساتھی۔',
    getStarted: 'مفت شروع کریں', readQuran: 'قرآن پڑھیں',
    surahs: 'سورتیں', ayahs: 'آیات', dailyPrayers: 'نمازیں', blessings: 'برکات',
    features: 'آپ کی روحانی سفر کے لیے', spiritualJourney: 'سب کچھ موجود',
    quranTitle: 'قرآن', quranSubtitle: 'اللہ کے کلام کو پڑھیں، سنیں اور غور کریں',
    searchSurah: 'سورہ تلاش کریں...', all: 'سب', meccan: 'مکی', medinan: 'مدنی',
    showing: 'دکھایا جا رہا ہے', of: 'میں سے',
    dhikrTitle: 'ذکر', counter: 'کاؤنٹر', dhikrDesc: 'ثابت قدمی اور اخلاص سے اللہ کو یاد کریں',
    todaysTotal: 'آج کے کل اذکار', resetCurrent: 'ری سیٹ', resetAll: 'سب ری سیٹ',
    goalComplete: 'ہدف مکمل! ماشاءاللہ!', progressOverview: 'پیشرفت کا جائزہ',
    prayerTitle: 'نماز', times: 'کے اوقات', prayerDesc: 'آپ کے مقام کے لیے درست اوقات',
    nextPrayer: 'اگلی نماز', timeRemaining: 'باقی وقت',
    qiblaDirection: 'قبلہ کی سمت', qiblaDesc: 'آپ کے مقام سے مکہ کی سمت',
    dailyTitle: 'روزانہ', islamicContent: 'اسلامی مواد', dailyDesc: 'روزانہ روحانی یاد دہانیوں سے اپنی روح کی پرورش کریں',
    duas: 'دعائیں', hadith: 'حدیث', reminders: 'یاد دہانیاں', duaOfDay: 'آج کی دعا', hadithOfDay: 'آج کی حدیث',
    quizTitle: 'اسلامی', quizWord: 'کوئز', quizDesc: 'اپنے اسلامی علم کی جانچ کریں',
    chooseCategory: 'زمرہ منتخب کریں', selectTopic: 'موضوع منتخب کریں',
    recentScores: 'حالیہ نتائج', question: 'سوال', score: 'اسکور', seeResults: 'نتائج دیکھیں',
    nextQuestion: 'اگلا سوال', tryAgain: 'دوبارہ کوشش', categories: 'زمرے', explanation: 'وضاحت',
    welcomeBack: 'خوش آمدید', joinHifzpro: 'حفظ پرو میں شامل ہوں',
    signInContinue: 'جاری رکھنے کے لیے لاگ ان کریں', createAccount: 'ترقی ٹریک کرنے کے لیے اکاؤنٹ بنائیں',
    fullName: 'پورا نام', email: 'ای میل', password: 'پاسورڈ',
    assalamuAlaikum: 'السلام علیکم،', journeyOverview: 'آپ کے روحانی سفر کا جائزہ',
    dayStreak: 'دن کا سلسلہ', keepGoing: 'جاری رکھیں! ثابت قدمی کامیابی کی کنجی ہے۔',
    bookmarks: 'بُک مارکس', totalDhikr: 'کل ذکر', quizzesTaken: 'کوئز', avgScore: 'اوسط اسکور',
    quranProgress: 'قرآن کی پیشرفت', lastRead: 'آخری پڑھا', continueReading: 'پڑھنا جاری رکھیں',
    todaysDhikr: 'آج کے اذکار', openCounter: 'کاؤنٹر کھولیں', quizHistory: 'کوئز کی تاریخ', takeQuiz: 'کوئز لیں',
    favoriteAyahs: 'پسندیدہ آیات', quickActions: 'فوری اقدامات', prayerTimes: 'نماز کے اوقات',
    statistics: 'اعداد و شمار', users: 'صارفین', content: 'مواد', totalUsers: 'کل صارفین',
    activeToday: 'آج فعال', userActivity: 'صارفین کی سرگرمی', manageUsers: 'صارفین کا انتظام',
    addDua: 'دعا شامل کریں', addHadith: 'حدیث شامل کریں', addQuiz: 'سوال شامل کریں',
    title: 'عنوان', reference: 'حوالہ', arabicText: 'عربی متن', englishTranslation: 'ترجمہ',
    narrator: 'راوی', source: 'ماخذ', delete: 'مٹائیں',
    backToSurahs: 'سورتوں پر واپس', prev: 'پچھلا', next: 'اگلا',
    translationOn: 'ترجمہ آن', translationOff: 'ترجمہ آف',
    bookmark: 'بک مارک', favorite: 'پسندیدہ', play: 'چلائیں', pause: 'روکیں',
    language: 'زبان', selectLanguage: 'زبان منتخب کریں',
    voiceAssistant: 'صوتی مددگار', listening: 'سن رہا ہے...', speak: 'ایک حکم بولیں...',
    askQuestion: 'سوال پوچھیں یا حکم دیں', close: 'بند',
    audioPlayer: 'آڈیو پلیئر', nowPlaying: 'چل رہا ہے', download: 'ڈاؤن لوڈ',
    beginJourney: 'اپنا سفر شروع کریں', today: 'آج',
    joinMessage: 'ہزاروں مسلمانوں میں شامل ہوں جو روزانہ عمل سے اللہ سے اپنا تعلق مضبوط کر رہے ہیں۔',
    startNow: 'ابھی شروع کریں', viewDashboard: 'ڈیش بورڈ دیکھیں', goToDashboard: 'ڈیش بورڈ پر جائیں',
    builtForUmmah: 'امت کے لیے ❤️ سے بنایا گیا',
    islamicCalendar: 'اسلامی کیلنڈر',
  },
  // Shorter fallback entries for other languages - they inherit from English
  hi: {} as Record<string, string>,
  tr: {} as Record<string, string>,
  id: {} as Record<string, string>,
  bn: {} as Record<string, string>,
  ms: {} as Record<string, string>,
  de: {} as Record<string, string>,
  es: {} as Record<string, string>,
  ru: {} as Record<string, string>,
};

// Fill missing translations with English fallback
Object.keys(translations).forEach(lang => {
  if (lang !== 'en') {
    Object.keys(translations.en).forEach(key => {
      if (!(key in translations[lang as Language])) {
        translations[lang as Language][key] = translations.en[key];
      }
    });
  }
});

interface LanguageContextType {
  lang: Language;
  langInfo: LangInfo;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ar',
  langInfo: languages.find(l => l.code === 'ar') || languages[0],
  setLang: () => {},
  t: (k) => k,
  dir: 'ltr',
});

function detectBrowserLanguage(): Language {
  return 'ar'; // Force Arabic by default
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('ar');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('hifzpro_lang') as Language | null;
    const detected = saved || 'ar'; // Priority to Arabic
    setLangState(detected);
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('hifzpro_lang', newLang);
    const info = languages.find(l => l.code === newLang)!;
    document.documentElement.dir = info.dir;
    document.documentElement.lang = newLang;
  }, []);

  useEffect(() => {
    if (mounted) {
      const info = languages.find(l => l.code === lang)!;
      document.documentElement.dir = info.dir;
      document.documentElement.lang = lang;
    }
  }, [lang, mounted]);

  const langInfo = languages.find(l => l.code === lang) || languages[0];
  const dir = langInfo.dir;

  const t = useCallback((key: string): string => {
    return translations[lang]?.[key] || translations.en[key] || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, langInfo, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
