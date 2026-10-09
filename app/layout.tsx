import type { Metadata, Viewport } from 'next';
import { Oxanium } from 'next/font/google';
import './globals.css';
import CampusPulseChatbot from '@/components/chatbot/CampusPulseChatbot';

const oxanium = Oxanium({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-oxanium',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CampusPulse — Student Success Platform | KPMG Smart Campus Analytics',
  description:
    'Decision intelligence & early-warning student success analytics platform converting student data into explainable interventions for faculty and administrators.',
  keywords: [
    'Student Success Platform',
    'Smart Campus Analytics',
    'KPMG Challenge',
    'Early Warning System',
    'Higher Education Analytics',
    'Attendance Risk',
    'Placement Readiness',
  ],
  authors: [{ name: 'CampusPulse Engineering' }],
  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#EEF1F6',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oxanium.variable} font-sans scroll-smooth`}>
      <body className="min-h-screen text-[var(--clay-text)] antialiased transition-colors duration-300 font-sans relative">
        {/* Full-screen HD Background Animation Video */}
        <div
          className="fixed inset-0 pointer-events-none -z-50 overflow-hidden"
          aria-hidden="true"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover filter brightness-[0.96] contrast-[1.04]"
            src="/Bytexl.mp4"
          />
          {/* Subtle light/dark frosted overlay for maximum text contrast */}
          <div className="absolute inset-0 bg-[#EEF1F6]/55 dark:bg-[#1A1E29]/65 backdrop-blur-[1px]" />
        </div>

        {children}
        <CampusPulseChatbot />
      </body>
    </html>
  );
}
