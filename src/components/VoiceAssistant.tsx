'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { surahs } from '@/lib/quranData';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

// Islamic knowledge base for AI responses
const knowledgeBase: Record<string, string> = {
  'ayat al-kursi': 'Ayat Al-Kursi is verse 255 of Surah Al-Baqarah (Chapter 2). It is one of the most powerful verses in the Quran. The Prophet ﷺ said it is the greatest verse in the Quran. It speaks about Allah\'s sovereignty, knowledge, and power over all creation.',
  'surah fatiha': 'Surah Al-Fatihah is the opening chapter of the Quran. It has 7 verses and is recited in every unit of prayer. It is also known as "The Opening" and "Umm Al-Quran" (Mother of the Quran).',
  'five pillars': 'The Five Pillars of Islam are: 1) Shahada (Declaration of Faith), 2) Salah (Prayer - 5 times daily), 3) Zakat (Charity - 2.5% of savings), 4) Sawm (Fasting during Ramadan), 5) Hajj (Pilgrimage to Makkah).',
  'ramadan': 'Ramadan is the 9th month of the Islamic calendar. Muslims fast from dawn to sunset, refraining from food, drink, and other physical needs. It is the month in which the Quran was first revealed.',
  'hajj': 'Hajj is the annual Islamic pilgrimage to Makkah, Saudi Arabia. It is one of the five pillars of Islam and is obligatory for every Muslim who is physically and financially able to perform it at least once in their lifetime.',
  'zakat': 'Zakat is the obligatory charity in Islam. Muslims must give 2.5% of their qualifying wealth annually to those in need. It purifies wealth and helps the community.',
  'shahada': 'The Shahada is the Islamic declaration of faith: "La ilaha illallah, Muhammadur Rasulullah" - There is no god but Allah, and Muhammad is the Messenger of Allah.',
  'bismillah': 'Bismillah (بِسْمِ اللَّهِ) means "In the name of Allah." The full phrase is "Bismillahir Rahmanir Raheem" - In the name of Allah, the Most Gracious, the Most Merciful. Muslims say it before beginning any action.',
  'prophet muhammad': 'Prophet Muhammad ﷺ is the last messenger of Allah. He was born in Makkah around 570 CE, received revelation at age 40, and established the Muslim community. He is the perfect example for all Muslims to follow.',
  'quran': 'The Quran is the holy book of Islam, revealed to Prophet Muhammad ﷺ through Angel Jibril over 23 years. It contains 114 surahs (chapters) and 6,236 ayahs (verses). It is the literal word of Allah.',
};

export default function VoiceAssistant() {
  const { t, lang } = useLanguage();
  const { play } = useAudioPlayer();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition
  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addMessage('assistant', 'Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang === 'ar' ? 'ar-SA' : lang === 'fr' ? 'fr-FR' : lang === 'ur' ? 'ur-PK' : lang === 'tr' ? 'tr-TR' : lang === 'hi' ? 'hi-IN' : 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleCommand(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }, [lang]);

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ar' ? 'ar-SA' : lang === 'fr' ? 'fr-FR' : lang === 'ur' ? 'ur-PK' : 'en-US';
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [lang]);

  const addMessage = (role: 'user' | 'assistant', text: string) => {
    setMessages(prev => [...prev, { role, text }]);
  };

  const handleCommand = useCallback((input: string) => {
    const lower = input.toLowerCase().trim();
    addMessage('user', input);

    // Navigate commands
    if (lower.includes('prayer time') || lower.includes('salah time') || lower.includes('namaz')) {
      const response = 'Opening prayer times for your location...';
      addMessage('assistant', response);
      speak(response);
      router.push('/prayer-times');
      return;
    }

    if (lower.includes('qibla') || lower.includes('direction')) {
      const response = 'Opening Qibla direction finder...';
      addMessage('assistant', response);
      speak(response);
      router.push('/prayer-times');
      return;
    }

    if (lower.includes('quiz')) {
      const response = 'Opening the Islamic Quiz...';
      addMessage('assistant', response);
      speak(response);
      router.push('/quiz');
      return;
    }

    if (lower.includes('dhikr') || lower.includes('tasbeeh') || lower.includes('counter')) {
      const response = 'Opening the Dhikr counter...';
      addMessage('assistant', response);
      speak(response);
      router.push('/dhikr');
      return;
    }

    if (lower.includes('daily') || lower.includes('dua') || lower.includes('hadith')) {
      const response = 'Opening daily Islamic content...';
      addMessage('assistant', response);
      speak(response);
      router.push('/daily');
      return;
    }

    // Read/Play surah commands - more flexible matching
    const surahMatch = lower.match(/(?:read|play|open|recite|go to|show)\s+(?:surah\s+)?(.+)/);
    if (surahMatch) {
      const surahQuery = surahMatch[1].replace(/surah\s*/i, '').trim();
      const normalize = (s: string) => s.toLowerCase().replace(/[-_'\s]/g, '');
      const queryNorm = normalize(surahQuery);
      const found = surahs.find(s =>
        normalize(s.englishName).includes(queryNorm) ||
        normalize(s.englishNameTranslation).includes(queryNorm) ||
        s.name.includes(surahQuery) ||
        queryNorm.includes(normalize(s.englishName))
      );
      if (found) {
        const response = `Opening Surah ${found.englishName} (${found.name})... Starting recitation.`;
        addMessage('assistant', response);
        speak(response);
        router.push(`/quran/${found.number}`);

        // Also start audio playback
        setTimeout(() => {
          play({
            surahNumber: found.number,
            surahName: found.englishName,
            ayahNumber: 1,
            totalAyahs: found.numberOfAyahs,
            reciterId: 'ar.alafasy',
            reciterName: 'Mishary Rashid Alafasy',
          });
        }, 1000);
        return;
      }
    }

    // Also try direct surah name anywhere in the text
    if (!surahMatch) {
      const queryNorm = lower.replace(/[-_'\s]/g, '');
      const found = surahs.find(s => {
        const nameNorm = s.englishName.toLowerCase().replace(/[-_'\s]/g, '');
        return queryNorm.includes(nameNorm) && nameNorm.length > 2;
      });
      if (found && (lower.includes('surah') || lower.includes('read') || lower.includes('play'))) {
        const response = `Opening Surah ${found.englishName} (${found.name})...`;
        addMessage('assistant', response);
        speak(response);
        router.push(`/quran/${found.number}`);
        return;
      }
    }

    // Knowledge base lookup
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (lower.includes(key)) {
        addMessage('assistant', value);
        speak(value);
        return;
      }
    }

    // General greeting
    if (lower.includes('hello') || lower.includes('salam') || lower.includes('assalamu')) {
      const response = 'Wa Alaikum Assalam! How can I help you today? You can ask me about the Quran, prayer times, duas, or say "Read Surah Al-Fatihah" to start a recitation.';
      addMessage('assistant', response);
      speak(response);
      return;
    }

    // Fallback
    const response = 'I can help you with: Reading the Quran, Prayer times, Dhikr counter, Islamic quizzes, and answering questions about Islam. Try saying "Read Surah Yaseen" or "Show prayer times".';
    addMessage('assistant', response);
    speak(response);
  }, [speak, router, play]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    handleCommand(inputText);
    setInputText('');
  };

  return (
    <>
      {/* Floating mic button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 md:bottom-6 right-4 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1 ${
          isOpen
            ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30'
            : 'gradient-primary hover:shadow-emerald-500/40 shadow-emerald-500/20'
        } ${isSpeaking ? 'animate-pulse' : ''}`}
        title={t('voiceAssistant')}
      >
        <span className="text-white text-xl">{isOpen ? '✕' : '🎤'}</span>
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-40 md:bottom-24 right-4 z-50 w-[90vw] max-w-md animate-in fade-in slide-in-from-bottom-4">
          <div className="glass-card shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: '70vh' }}>
            {/* Header */}
            <div className="p-4 gradient-primary text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg">🤖</div>
                  <div>
                    <h3 className="font-bold text-sm">{t('voiceAssistant')}</h3>
                    <p className="text-xs text-emerald-100">{isListening ? t('listening') : t('askQuestion')}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setIsOpen(false); window.speechSynthesis?.cancel(); }}
                  className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[400px] scrollbar-thin">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🌙</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Assalamu Alaikum! I&apos;m your Islamic assistant.</p>
                  <p className="text-xs text-gray-400 mt-2">Try: &quot;Read Surah Al-Fatihah&quot; or &quot;Show prayer times&quot;</p>
                  <div className="flex flex-wrap gap-2 justify-center mt-4">
                    {['Read Surah Yaseen', 'Prayer Times', 'What is Ayat Al-Kursi?', 'Open Dhikr'].map(cmd => (
                      <button
                        key={cmd}
                        onClick={() => handleCommand(cmd)}
                        className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium hover:bg-emerald-500/20 transition-colors"
                      >
                        {cmd}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'gradient-primary text-white rounded-br-md'
                      : 'bg-gray-100 dark:bg-gray-800 rounded-bl-md'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-emerald-500/10'
                  }`}
                  title={isListening ? 'Stop listening' : 'Start listening'}
                >
                  🎙️
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t('speak')}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-xl gradient-primary text-white flex items-center justify-center shrink-0 hover:shadow-lg transition-all"
                >
                  ➤
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
