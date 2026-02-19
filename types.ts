
export enum SectionType {
  MATERIALS = 'MATERIALS',
  PRACTICE_EXAMS = 'PRACTICE_EXAMS',
  INTERACTIVE_QUIZ = 'INTERACTIVE_QUIZ'
}

export enum Subject {
  HISTOLOGY = 'علم الأنسجة',
  HUMAN_RIGHTS = 'حقوق الإنسان والديمقراطية',
  LAB_PREP = 'التحضيرات المختبرية'
}

export interface Question {
  id: string;
  lecture: number;
  subject: Subject;
  textEn: string;
  textAr: string;
  options: string[];
  correctAnswer: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  password?: string;
  avatar?: string;
  bio?: string;
  age?: number;
  showAge?: boolean;
  deletionDate?: number;
  points: number;
  totalAnswered: number;
  correctCount: number;
  wrongCount: number;
  isGuest: boolean;
  role?: 'admin' | 'user';
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole?: 'admin' | 'user';
  text: string;
  timestamp: number;
  targetId: string;
}

export interface Material {
  id: string;
  title: string;
  subject: Subject;
  section: SectionType;
  type: 'PDF' | 'DOC' | 'QUIZ';
  url: string;
}

export interface ParticipationData {
  [key: string]: number;
}

export interface InteractionData {
  [key: string]: string[];
}
