'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { StudentExamScreen } from '@/components/student/StudentExamScreen';

export default function StudentExamPage() {
  const params = useParams();
  const examId = (params?.id as string) || 'exam-cie2-dsa';

  return <StudentExamScreen examId={examId} />;
}
