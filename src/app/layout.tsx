import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { AudioPlayerProvider } from "@/context/AudioPlayerContext";
import Navbar from "@/components/Navbar";
import FloatingAudioPlayer from "@/components/FloatingAudioPlayer";
import VoiceAssistant from "@/components/VoiceAssistant";

export const metadata: Metadata = {
  title: "HifzaPro - Strengthen Your Connection with Islam",
  description: "A modern Islamic platform for Quran reading with audio recitations, Dhikr tracking, Prayer times, Qibla direction, Islamic quizzes, and daily spiritual content — in every language.",
  keywords: ["Islam", "Quran", "Prayer", "Dhikr", "Islamic App", "HifzaPro", "Quran Audio", "Voice Assistant"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <AudioPlayerProvider>
                <Navbar />
                <main className="pt-16 pb-20 md:pb-0 min-h-screen">
                  {children}
                </main>
                <FloatingAudioPlayer />
                <VoiceAssistant />
              </AudioPlayerProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
