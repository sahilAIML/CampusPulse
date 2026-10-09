'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementsSection } from '@/components/announcements/AnnouncementsSection';
import { AuthModal } from '@/components/auth/AuthModal';
import { getAnnouncements } from '@/lib/data/announcements';
import { Announcement, UserRole } from '@/lib/data/types';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  useEffect(() => {
    async function load() {
      const data = await getAnnouncements();
      setAnnouncements(data);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--clay-bg)] text-[var(--clay-text)]">
      <Navbar onOpenAuth={(role) => {
        if (role) setSelectedRole(role);
        setAuthModalOpen(true);
      }} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 pt-6 w-full">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-heading font-extrabold text-[var(--clay-muted)] hover:text-[#FF7A59] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Campus Pulse</span>
          </Link>
        </div>

        <AnnouncementsSection initialAnnouncements={announcements} />
      </main>

      <Footer />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole={selectedRole}
      />
    </div>
  );
}
