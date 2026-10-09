// ============================================================================
// CAMPUSPULSE: SMART CAMPUS ANALYTICS
// Data Access Layer: Exams, MCQ Builder, Timed Student Attempts & Results
// ============================================================================

import { feedExamScoreIntoStudentTelemetry } from './students';

export interface ExamQuestion {
  id: string;
  exam_id: string;
  question_text: string;
  options: [string, string, string, string]; // exactly 4 options
  correct_index: number; // 0, 1, 2, 3
  topic: string;
  explanation?: string;
}

export interface Exam {
  id: string;
  name: string;
  section_id: 'sec-a' | 'sec-b' | 'sec-c' | 'all';
  section_name: string;
  created_by: string; // Faculty ID (e.g. FAC210)
  duration_minutes: number;
  total_marks: number;
  status: 'draft' | 'published' | 'active' | 'stopped' | 'completed';
  questions_count: number;
  created_at: string;
  published_at?: string;
  questions?: ExamQuestion[];
  submissions_count?: number;
}

export interface ExamAttempt {
  id: string;
  exam_id: string;
  student_id: string;
  student_reg_no: string;
  student_name: string;
  section_name: string;
  answers: Record<string, number>; // question_id -> selected option index (0..3)
  flagged_question_ids?: string[];
  score: number;
  total_marks: number;
  accuracy_pct: number;
  time_spent_seconds: number;
  submitted_at: string;
  rank?: number;
  faculty_note?: string;
}

export interface StudentExamResult {
  student_id: string;
  reg_no: string;
  full_name: string;
  section_name: string;
  score: number;
  total: number;
  accuracy_pct: number;
  rank: number;
  submitted_at: string;
  faculty_note?: string;
}

export interface QuestionAccuracyMetric {
  question_id: string;
  question_number: number;
  question_text: string;
  topic: string;
  correct_count: number;
  total_count: number;
  accuracy_pct: number;
  is_weak_topic: boolean; // accuracy < 60%
}

export interface ExamResultSummary {
  exam_id: string;
  exam_name: string;
  exam_status: 'draft' | 'published' | 'active' | 'stopped' | 'completed';
  total_submissions: number;
  total_enrolled: number;
  submission_percentage: number;
  class_average: number;
  topper: {
    reg_no: string;
    name: string;
    score: number;
    section: string;
  };
  pass_percentage: number;
  student_results: StudentExamResult[];
  question_accuracy: QuestionAccuracyMetric[];
}

// ----------------------------------------------------------------------------
// SEED QUESTIONS: CIE-2 Data Structures & Algorithms (10 Standardized MCQs)
// ----------------------------------------------------------------------------
const SEED_QUESTIONS_DSA: ExamQuestion[] = [
  {
    id: 'q-dsa-1',
    exam_id: 'exam-cie2-dsa',
    question_text: 'In a Binary Search Tree (BST), what is the in-order successor of a node having a right child?',
    options: [
      'The node with the maximum value in its left subtree',
      'The node with the minimum value in its right subtree',
      'Its immediate parent node',
      'The root node of the entire tree',
    ],
    correct_index: 1,
    topic: 'Binary Search Trees',
    explanation: 'The in-order successor of a node with a non-empty right subtree is always the minimum key in that right subtree.',
  },
  {
    id: 'q-dsa-2',
    exam_id: 'exam-cie2-dsa',
    question_text: 'What is the worst-case time complexity of QuickSort when the pivot is always chosen as the first element?',
    options: ['O(N log N)', 'O(N)', 'O(N^2)', 'O(log N)'],
    correct_index: 2,
    topic: 'Sorting Algorithms',
    explanation: 'If the array is already sorted or reverse sorted, picking the first element as pivot yields unbalanced subproblems of sizes 0 and N-1, leading to O(N^2).',
  },
  {
    id: 'q-dsa-3',
    exam_id: 'exam-cie2-dsa',
    question_text: 'Which optimal substructure property distinguishes 0/1 Knapsack from Fractional Knapsack?',
    options: [
      'Items cannot be broken; a dynamic programming tabulation/memoization is required',
      'Greedy choice property always guarantees global optimum',
      'Items can be sorted by value-to-weight ratio and taken greedily',
      'Divide and conquer without overlapping subproblems',
    ],
    correct_index: 0,
    topic: 'Dynamic Programming',
    explanation: 'In 0/1 Knapsack, items are indivisible, breaking greedy choice and requiring dynamic programming across weight capacities.',
  },
  {
    id: 'q-dsa-4',
    exam_id: 'exam-cie2-dsa',
    question_text: 'Which primary data structure is utilized in Breadth-First Search (BFS) of a graph to track frontier vertices?',
    options: ['LIFO Stack', 'FIFO Queue', 'Priority Min-Heap', 'Binary Trie'],
    correct_index: 1,
    topic: 'Graph Traversal',
    explanation: 'BFS explores vertices in layer-by-layer radial distance order, requiring a First-In-First-Out (FIFO) Queue.',
  },
  {
    id: 'q-dsa-5',
    exam_id: 'exam-cie2-dsa',
    question_text: 'In recursive algorithms, what specifically prevents an unbounded execution leading to a Call Stack Overflow?',
    options: [
      'A deterministic base case condition that terminates recursion',
      'Allocating extra heap memory with malloc()',
      'Increasing compiler optimization flags to -O3',
      'Converting all global variables to static const pointers',
    ],
    correct_index: 0,
    topic: 'Recursion',
    explanation: 'A base case condition tests for the terminal input where no further recursive invocation is triggered, returning unwound call frames.',
  },
  {
    id: 'q-dsa-6',
    exam_id: 'exam-cie2-dsa',
    question_text: 'In Hash Table design, what is the primary drawback of Linear Probing compared to Separate Chaining?',
    options: [
      'Primary clustering where occupied slots form continuous long runs',
      'Higher memory overhead per key pointer',
      'Inability to store string keys',
      'Strict requirement for cryptographic hash functions',
    ],
    correct_index: 0,
    topic: 'Hashing',
    explanation: 'Linear probing suffers from primary clustering: once a collision occurs, contiguous clusters grow rapidly, degrading search time toward O(N).',
  },
  {
    id: 'q-dsa-7',
    exam_id: 'exam-cie2-dsa',
    question_text: 'In an AVL Tree, what are the permissible values for the Balance Factor (Height_Left - Height_Right) of any node?',
    options: ['-1, 0, +1', 'Strictly 0', '-2, 0, +2', 'Any positive integer'],
    correct_index: 0,
    topic: 'Self-Balancing Trees',
    explanation: 'An AVL tree maintains height balance such that for every node, the difference in height between its left and right subtrees is within {-1, 0, 1}.',
  },
  {
    id: 'q-dsa-8',
    exam_id: 'exam-cie2-dsa',
    question_text: 'Given an array representation of a binary heap, where is the parent of an element at 1-based index i located?',
    options: ['Index floor(i / 2)', 'Index 2*i', 'Index 2*i + 1', 'Index i - 1'],
    correct_index: 0,
    topic: 'Heaps & Priority Queues',
    explanation: 'In 1-based indexing for binary heaps, the parent of node i is at floor(i/2), and children are at 2i and 2i+1.',
  },
  {
    id: 'q-dsa-9',
    exam_id: 'exam-cie2-dsa',
    question_text: 'Why does Dijkstra’s shortest path algorithm fail on graphs with negative edge weights?',
    options: [
      'It assumes once a node is visited with min distance, its shortest distance cannot decrease',
      'It cannot execute on directed acyclic graphs',
      'It uses O(V^3) time regardless of edge count',
      'It requires edges to be sorted in reverse topological order',
    ],
    correct_index: 0,
    topic: 'Shortest Path Algorithms',
    explanation: 'Dijkstras greedy choice assumes adding positive edges never shortens a closed path. Negative edges invalidate visited distance finality (Bellman-Ford needed).',
  },
  {
    id: 'q-dsa-10',
    exam_id: 'exam-cie2-dsa',
    question_text: 'Applying the Master Theorem to T(n) = 2T(n/2) + O(n), which case applies and what is the asymptotic bound?',
    options: [
      'Case 2: a = b^c (2 = 2^1), yielding Theta(n log n)',
      'Case 1: a > b^c, yielding Theta(n^2)',
      'Case 3: a < b^c, yielding Theta(n)',
      'Master Theorem is not applicable to divide-and-conquer recurrences',
    ],
    correct_index: 0,
    topic: 'Algorithm Analysis',
    explanation: 'With a=2, b=2, c=1: log_b(a) = log_2(2) = 1 = c. By Case 2, T(n) = Theta(n^(log_b a) * log n) = Theta(n log n).',
  },
];

// ----------------------------------------------------------------------------
// IN-MEMORY EXAMS AND ATTEMPTS STORE (Deterministic & Persistent in Session)
// ----------------------------------------------------------------------------
let mockExamsStore: Exam[] = [
  {
    id: 'exam-cie2-dsa',
    name: 'CIE-2: Data Structures & Algorithms',
    section_id: 'all',
    section_name: 'All Sections (A, B, C)',
    created_by: 'FAC210',
    duration_minutes: 15,
    total_marks: 10,
    status: 'active',
    questions_count: 10,
    created_at: '2026-10-07T09:30:00Z',
    published_at: '2026-10-07T10:00:00Z',
    questions: SEED_QUESTIONS_DSA,
    submissions_count: 17,
  },
  {
    id: 'exam-midsem-os',
    name: 'Mid-Term: Operating Systems Concepts',
    section_id: 'sec-a',
    section_name: 'Section A',
    created_by: 'FAC210',
    duration_minutes: 20,
    total_marks: 10,
    status: 'draft',
    questions_count: 5,
    created_at: '2026-10-08T14:15:00Z',
    questions: SEED_QUESTIONS_DSA.slice(0, 5),
    submissions_count: 0,
  },
];

// Store attempts by exam_id -> array of attempts
const mockAttemptsStore = new Map<string, ExamAttempt[]>();

// Initialize realistic cohort attempts for CIE-2 DSA
function initializeSeedAttempts() {
  const attempts: ExamAttempt[] = [];

  // 1. MD SAHIL (241FA18067) - Topper (10/10)
  attempts.push({
    id: 'att-sahil',
    exam_id: 'exam-cie2-dsa',
    student_id: 'stu-0-27',
    student_reg_no: '241FA18067',
    student_name: 'MD SAHIL',
    section_name: 'Section A',
    answers: {
      'q-dsa-1': 1, 'q-dsa-2': 2, 'q-dsa-3': 0, 'q-dsa-4': 1, 'q-dsa-5': 0,
      'q-dsa-6': 0, 'q-dsa-7': 0, 'q-dsa-8': 0, 'q-dsa-9': 0, 'q-dsa-10': 0,
    },
    score: 10,
    total_marks: 10,
    accuracy_pct: 100,
    time_spent_seconds: 480,
    submitted_at: '2026-10-07T10:15:32Z',
  });

  // 2. SAGAR (241FA04070) - Critical Risk (4/10)
  attempts.push({
    id: 'att-sagar',
    exam_id: 'exam-cie2-dsa',
    student_id: 'stu-1-30',
    student_reg_no: '241FA04070',
    student_name: 'SAGAR',
    section_name: 'Section B',
    answers: {
      'q-dsa-1': 1, 'q-dsa-2': 1, 'q-dsa-3': 1, 'q-dsa-4': 1, 'q-dsa-5': 2,
      'q-dsa-6': 2, 'q-dsa-7': 0, 'q-dsa-8': 1, 'q-dsa-9': 2, 'q-dsa-10': 0,
    },
    score: 4,
    total_marks: 10,
    accuracy_pct: 40,
    time_spent_seconds: 720,
    submitted_at: '2026-10-07T10:24:10Z',
  });

  // 3. Realistic student peers across Sections A, B, C
  const peerNames = [
    { name: 'Aarav Sharma', reg: '241FA18001', sec: 'Section A', score: 9 },
    { name: 'Aditya Verma', reg: '241FA18002', sec: 'Section A', score: 9 }, // tie with Aarav
    { name: 'Ananya Patel', reg: '241FA18003', sec: 'Section A', score: 8 },
    { name: 'Chaitanya Reddy', reg: '241FA18004', sec: 'Section A', score: 8 }, // tie with Ananya
    { name: 'Deepak Rao', reg: '241FA18005', sec: 'Section A', score: 7 },
    { name: 'Kavya Nair', reg: '241FA04001', sec: 'Section B', score: 9 },
    { name: 'Manish Joshi', reg: '241FA04002', sec: 'Section B', score: 8 },
    { name: 'Meera Bhat', reg: '241FA04003', sec: 'Section B', score: 7 },
    { name: 'Nikhil Menon', reg: '241FA04004', sec: 'Section B', score: 6 },
    { name: 'Pooja Hegde', reg: '241FA04005', sec: 'Section B', score: 5 },
    { name: 'Rahul Kulkarni', reg: '241FA05001', sec: 'Section C', score: 9 },
    { name: 'Rhea Sen', reg: '241FA05002', sec: 'Section C', score: 8 },
    { name: 'Rohan Das', reg: '241FA05003', sec: 'Section C', score: 7 },
    { name: 'Sneha Chatterjee', reg: '241FA05004', sec: 'Section C', score: 6 },
    { name: 'Tarun Agarwal', reg: '241FA05005', sec: 'Section C', score: 5 },
  ];

  peerNames.forEach((p, idx) => {
    // Generate answers matching their score
    const studentAnswers: Record<string, number> = {};
    SEED_QUESTIONS_DSA.forEach((q, qIdx) => {
      // Determine if they answered correctly
      const isCorrect = qIdx < p.score;
      studentAnswers[q.id] = isCorrect ? q.correct_index : (q.correct_index + 1) % 4;
    });

    attempts.push({
      id: `att-peer-${idx}`,
      exam_id: 'exam-cie2-dsa',
      student_id: `stu-peer-${idx}`,
      student_reg_no: p.reg,
      student_name: p.name,
      section_name: p.sec,
      answers: studentAnswers,
      score: p.score,
      total_marks: 10,
      accuracy_pct: p.score * 10,
      time_spent_seconds: 500 + idx * 25,
      submitted_at: `2026-10-07T10:${16 + (idx % 8)}:00Z`,
    });
  });

  mockAttemptsStore.set('exam-cie2-dsa', attempts);
}

// Initialize seed attempts once
initializeSeedAttempts();

// ----------------------------------------------------------------------------
// EXAM OPERATIONS
// ----------------------------------------------------------------------------

/**
 * Fetch all exams, optionally filtered by section
 */
export async function getExams(sectionId?: string): Promise<Exam[]> {
  if (!sectionId || sectionId === 'all') {
    return mockExamsStore;
  }
  return mockExamsStore.filter((e) => e.section_id === 'all' || e.section_id === sectionId);
}

/**
 * Fetch a single exam with its questions
 */
export async function getExamById(examId: string): Promise<Exam | null> {
  const found = mockExamsStore.find((e) => e.id === examId);
  if (!found) return null;

  const attempts = mockAttemptsStore.get(examId) || [];
  return {
    ...found,
    submissions_count: attempts.length,
  };
}

/**
 * Create a new exam with questions (Draft or Published)
 */
export async function createExam(
  examData: {
    name: string;
    section_id: 'sec-a' | 'sec-b' | 'sec-c' | 'all';
    duration_minutes: number;
    total_marks: number;
    status: 'draft' | 'published';
  },
  questions: Omit<ExamQuestion, 'id' | 'exam_id'>[]
): Promise<Exam> {
  const newId = `exam-${Date.now()}`;
  const sectionNameMap = {
    'all': 'All Sections (A, B, C)',
    'sec-a': 'Section A',
    'sec-b': 'Section B',
    'sec-c': 'Section C',
  };

  const formattedQuestions: ExamQuestion[] = questions.map((q, idx) => ({
    ...q,
    id: `q-${newId}-${idx + 1}`,
    exam_id: newId,
  }));

  const newExam: Exam = {
    id: newId,
    name: examData.name,
    section_id: examData.section_id,
    section_name: sectionNameMap[examData.section_id] || 'All Sections',
    created_by: 'FAC210',
    duration_minutes: examData.duration_minutes || 15,
    total_marks: examData.total_marks || formattedQuestions.length,
    status: examData.status,
    questions_count: formattedQuestions.length,
    created_at: new Date().toISOString(),
    published_at: examData.status === 'published' ? new Date().toISOString() : undefined,
    questions: formattedQuestions,
    submissions_count: 0,
  };

  mockExamsStore = [newExam, ...mockExamsStore];
  mockAttemptsStore.set(newId, []);
  return newExam;
}

/**
 * Publish an existing draft exam
 */
export async function publishExam(examId: string): Promise<Exam | null> {
  const target = mockExamsStore.find((e) => e.id === examId);
  if (!target) return null;

  target.status = 'active';
  target.published_at = new Date().toISOString();
  return target;
}

/**
 * Start or resume an exam (activates submission portal)
 */
export async function startExam(examId: string): Promise<Exam | null> {
  const target = mockExamsStore.find((e) => e.id === examId);
  if (!target) return null;

  target.status = 'active';
  target.published_at = target.published_at || new Date().toISOString();
  return target;
}

/**
 * Stop an exam (closes submission portal, freezes attempts)
 */
export async function stopExam(examId: string): Promise<Exam | null> {
  const target = mockExamsStore.find((e) => e.id === examId);
  if (!target) return null;

  target.status = 'stopped';
  return target;
}

/**
 * Appoint / Adjust marks for a student directly on the faculty leaderboard.
 * Updates student score, accuracy, and recomputes the student's success score telemetry.
 */
export async function appointStudentMarks(
  examId: string,
  studentRegNo: string,
  newScore: number,
  facultyNote?: string
): Promise<{
  attempt: ExamAttempt;
  telemetry_update: {
    old_score: number;
    new_score: number;
    old_cie: number;
    new_cie: number;
  };
}> {
  const exam = await getExamById(examId);
  if (!exam) throw new Error('Exam not found');

  const attempts = mockAttemptsStore.get(examId) || [];
  const attemptIndex = attempts.findIndex((a) => a.student_reg_no === studentRegNo);

  const totalMarks = exam.total_marks || 10;
  const clampedScore = Math.max(0, Math.min(totalMarks, Number(newScore.toFixed(1))));
  const accuracyPct = Math.round((clampedScore / totalMarks) * 100);

  let updatedAttempt: ExamAttempt;

  if (attemptIndex >= 0) {
    updatedAttempt = {
      ...attempts[attemptIndex],
      score: clampedScore,
      accuracy_pct: accuracyPct,
      faculty_note: facultyNote || attempts[attemptIndex].faculty_note,
    };
    attempts[attemptIndex] = updatedAttempt;
  } else {
    // If student did not submit an online attempt, create faculty graded entry
    updatedAttempt = {
      id: `att-faculty-${Date.now()}`,
      exam_id: examId,
      student_id: `stu-${studentRegNo}`,
      student_reg_no: studentRegNo,
      student_name: studentRegNo === '241FA18067' ? 'MD SAHIL' : studentRegNo === '241FA04070' ? 'SAGAR' : 'Student ' + studentRegNo,
      section_name: exam.section_name.includes('A') ? 'Section A' : exam.section_name.includes('B') ? 'Section B' : 'Section C',
      answers: {},
      score: clampedScore,
      total_marks: totalMarks,
      accuracy_pct: accuracyPct,
      time_spent_seconds: 0,
      submitted_at: new Date().toISOString(),
      faculty_note: facultyNote,
    };
    attempts.push(updatedAttempt);
  }

  mockAttemptsStore.set(examId, attempts);

  // Feed score into student academic indicator & recompute success score
  const telemetryResult = await feedExamScoreIntoStudentTelemetry(
    studentRegNo,
    exam.name,
    clampedScore,
    totalMarks
  );

  return {
    attempt: updatedAttempt,
    telemetry_update: {
      old_score: telemetryResult.old_score,
      new_score: telemetryResult.new_score,
      old_cie: telemetryResult.old_cie,
      new_cie: telemetryResult.new_cie,
    },
  };
}

/**
 * Submit a timed student exam attempt.
 * Evaluates responses, computes score & accuracy, records attempt,
 * AND feeds the exam score into the student's academic indicator (recomputing Success Score).
 */
export async function submitExamAttempt(params: {
  exam_id: string;
  student_reg_no: string;
  student_name: string;
  section_name: string;
  answers: Record<string, number>;
  time_spent_seconds: number;
}): Promise<{
  attempt: ExamAttempt;
  telemetry_update: {
    old_score: number;
    new_score: number;
    old_cie: number;
    new_cie: number;
  };
}> {
  const exam = await getExamById(params.exam_id);
  if (!exam || !exam.questions) {
    throw new Error('Exam not found or has no questions');
  }

  if (exam.status === 'stopped') {
    throw new Error('This examination has been stopped by faculty. Submissions are closed.');
  }

  // Calculate score
  let correctCount = 0;
  for (const q of exam.questions) {
    const chosen = params.answers[q.id];
    if (chosen !== undefined && chosen === q.correct_index) {
      correctCount++;
    }
  }

  const scoreFraction = correctCount / exam.questions.length;
  const rawScore = Number((scoreFraction * exam.total_marks).toFixed(1));
  const accuracyPct = Math.round(scoreFraction * 100);

  const attempt: ExamAttempt = {
    id: `att-${Date.now()}`,
    exam_id: params.exam_id,
    student_id: `stu-${params.student_reg_no}`,
    student_reg_no: params.student_reg_no,
    student_name: params.student_name,
    section_name: params.section_name,
    answers: params.answers,
    score: rawScore,
    total_marks: exam.total_marks,
    accuracy_pct: accuracyPct,
    time_spent_seconds: params.time_spent_seconds,
    submitted_at: new Date().toISOString(),
  };

  // Save attempt
  const currentAttempts = mockAttemptsStore.get(params.exam_id) || [];
  // Remove prior attempt by this student if any
  const filtered = currentAttempts.filter((a) => a.student_reg_no !== params.student_reg_no);
  mockAttemptsStore.set(params.exam_id, [attempt, ...filtered]);

  // Feed score into student academic indicator & recompute success score
  const telemetryResult = await feedExamScoreIntoStudentTelemetry(
    params.student_reg_no,
    exam.name,
    rawScore,
    exam.total_marks
  );

  return {
    attempt,
    telemetry_update: {
      old_score: telemetryResult.old_score,
      new_score: telemetryResult.new_score,
      old_cie: telemetryResult.old_cie,
      new_cie: telemetryResult.new_cie,
    },
  };
}

/**
 * Fetch comprehensive Exam Results for Faculty:
 * - Section filtered
 * - Tie-aware ranking (1224 competition rank)
 * - Class average & topper
 * - Question-wise accuracy chart & weak topics detection
 */
export async function getExamResults(
  examId: string,
  sectionFilter?: string
): Promise<ExamResultSummary | null> {
  const exam = await getExamById(examId);
  if (!exam) return null;

  let attempts = mockAttemptsStore.get(examId) || [];

  // Filter by section if requested
  if (sectionFilter && sectionFilter !== 'all') {
    const secTarget = sectionFilter === 'sec-a' ? 'Section A' : sectionFilter === 'sec-b' ? 'Section B' : 'Section C';
    attempts = attempts.filter((a) => a.section_name === secTarget);
  }

  // Sort descending by score, tiebreaker on time spent (faster gets edge, but same rank if tied)
  const sortedAttempts = [...attempts].sort((a, b) => b.score - a.score || a.time_spent_seconds - b.time_spent_seconds);

  // Apply Tie-Aware Standard Competition Ranking (1, 2, 2, 4...)
  const studentResults: StudentExamResult[] = [];
  let currentRank = 1;
  for (let i = 0; i < sortedAttempts.length; i++) {
    const curr = sortedAttempts[i];
    if (i > 0 && curr.score < sortedAttempts[i - 1].score) {
      currentRank = i + 1;
    }
    studentResults.push({
      student_id: curr.student_id,
      reg_no: curr.student_reg_no,
      full_name: curr.student_name,
      section_name: curr.section_name,
      score: curr.score,
      total: curr.total_marks,
      accuracy_pct: curr.accuracy_pct,
      rank: currentRank,
      submitted_at: curr.submitted_at,
      faculty_note: curr.faculty_note,
    });
  }

  // Enrolled batch counts (40 per section, 120 total)
  const totalEnrolled = sectionFilter && sectionFilter !== 'all' ? 40 : 120;
  const submissionPct = totalEnrolled > 0 ? Math.min(100, Math.round((studentResults.length / totalEnrolled) * 100)) : 0;

  // Compute Class Average
  const totalScoreSum = studentResults.reduce((acc, s) => acc + s.score, 0);
  const classAvg = studentResults.length > 0 ? Number((totalScoreSum / studentResults.length).toFixed(1)) : 0;

  // Identify Topper
  const topper = studentResults.length > 0
    ? {
        reg_no: studentResults[0].reg_no,
        name: studentResults[0].full_name,
        score: studentResults[0].score,
        section: studentResults[0].section_name,
      }
    : { reg_no: 'N/A', name: 'No submissions', score: 0, section: 'N/A' };

  // Pass percentage (score >= 50% of total)
  const passedCount = studentResults.filter((s) => s.score >= s.total * 0.5).length;
  const passPct = studentResults.length > 0 ? Math.round((passedCount / studentResults.length) * 100) : 0;

  // Question-Wise Accuracy Chart Data
  const questions = exam.questions || [];
  const questionAccuracy: QuestionAccuracyMetric[] = questions.map((q, idx) => {
    let correctInCohort = 0;
    attempts.forEach((att) => {
      if (att.answers[q.id] === q.correct_index) {
        correctInCohort++;
      }
    });

    const accuracy = attempts.length > 0 ? Math.round((correctInCohort / attempts.length) * 100) : 0;

    return {
      question_id: q.id,
      question_number: idx + 1,
      question_text: q.question_text,
      topic: q.topic || `Topic ${idx + 1}`,
      correct_count: correctInCohort,
      total_count: attempts.length,
      accuracy_pct: accuracy,
      is_weak_topic: accuracy < 60, // flag weak topics below 60%
    };
  });

  return {
    exam_id: exam.id,
    exam_name: exam.name,
    exam_status: exam.status,
    total_submissions: studentResults.length,
    total_enrolled: totalEnrolled,
    submission_percentage: submissionPct,
    class_average: classAvg,
    topper,
    pass_percentage: passPct,
    student_results: studentResults,
    question_accuracy: questionAccuracy,
  };
}

// ----------------------------------------------------------------------------
// CSV QUESTION PARSER & SAMPLE GENERATOR
// ----------------------------------------------------------------------------

/**
 * Generate sample CSV template for faculty question uploads
 */
export function getSampleQuestionsCSV(): string {
  return [
    'question,option_a,option_b,option_c,option_d,correct_answer,topic',
    '"What is the worst-case time complexity of QuickSort?","O(N)","O(N log N)","O(N^2)","O(2^N)","C","Sorting Algorithms"',
    '"Which data structure is used in Breadth First Search (BFS)?","Stack","Queue","Priority Queue","Hash Table","B","Graph Traversal"',
    '"In an AVL Tree, what are the allowed balance factors?","-1, 0, +1","Strictly 0","-2, 0, +2","Any integer","A","Self-Balancing Trees"',
    '"Which property is required for Dynamic Programming?","Greedy Choice","Overlapping Subproblems","Random Access Memory","Monotonic Queues","B","Dynamic Programming"',
    '"Where is the parent of node at 1-based index i in a binary heap?","floor(i/2)","2*i","2*i + 1","i - 1","A","Heaps"',
  ].join('\n');
}

/**
 * Parse uploaded CSV text into ExamQuestion objects
 */
export function parseQuestionsFromCSV(
  csvText: string
): { success: boolean; questions: Omit<ExamQuestion, 'id' | 'exam_id'>[]; errors: string[] } {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) {
    return { success: false, questions: [], errors: ['CSV file is empty or missing data rows.'] };
  }

  const errors: string[] = [];
  const parsedQuestions: Omit<ExamQuestion, 'id' | 'exam_id'>[] = [];

  // Parse header
  const header = lines[0].toLowerCase();
  if (!header.includes('question') || !header.includes('option_a') || !header.includes('correct_answer')) {
    return {
      success: false,
      questions: [],
      errors: ['Invalid CSV headers. Expected: question, option_a, option_b, option_c, option_d, correct_answer, topic'],
    };
  }

  // Regex for parsing CSV row handling quotes
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let insideQuote = false;
    let entry = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        result.push(entry.trim().replace(/^["']|["']$/g, ''));
        entry = '';
      } else {
        entry += char;
      }
    }
    result.push(entry.trim().replace(/^["']|["']$/g, ''));
    return result;
  };

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    const cols = parseCSVLine(rawLine);
    if (cols.length < 6) {
      errors.push(`Row ${i + 1}: Insufficient columns (found ${cols.length}, expected at least 6).`);
      continue;
    }

    const [qText, optA, optB, optC, optD, correctAns, topic] = cols;

    if (!qText || !optA || !optB || !optC || !optD) {
      errors.push(`Row ${i + 1}: Missing question text or options.`);
      continue;
    }

    // Determine correct index
    let correctIdx = 0;
    const cleanAns = (correctAns || '').trim().toUpperCase();
    if (cleanAns === 'A' || cleanAns === '1' || cleanAns === '0') correctIdx = 0;
    else if (cleanAns === 'B' || cleanAns === '2') correctIdx = 1;
    else if (cleanAns === 'C' || cleanAns === '3') correctIdx = 2;
    else if (cleanAns === 'D' || cleanAns === '4') correctIdx = 3;
    else {
      // Check if text matches option directly
      if (cleanAns.toLowerCase() === optA.toLowerCase()) correctIdx = 0;
      else if (cleanAns.toLowerCase() === optB.toLowerCase()) correctIdx = 1;
      else if (cleanAns.toLowerCase() === optC.toLowerCase()) correctIdx = 2;
      else if (cleanAns.toLowerCase() === optD.toLowerCase()) correctIdx = 3;
      else {
        errors.push(`Row ${i + 1}: Unrecognized correct answer "${correctAns}". Must be A, B, C, or D.`);
        continue;
      }
    }

    parsedQuestions.push({
      question_text: qText,
      options: [optA, optB, optC, optD],
      correct_index: correctIdx,
      topic: topic || 'General Concepts',
      explanation: `Correct answer is Option ${String.fromCharCode(65 + correctIdx)}.`,
    });
  }

  return {
    success: parsedQuestions.length > 0 && errors.length === 0,
    questions: parsedQuestions,
    errors,
  };
}
