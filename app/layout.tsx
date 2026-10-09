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
      <body className="min-h-screen bg-[var(--clay-bg)] text-[var(--clay-text)] antialiased transition-colors duration-300 font-sans">
        {children}
        <CampusPulseChatbot />
      </body>
    </html>
  );
}
