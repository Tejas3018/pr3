
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher';
  classId?: string;
}

export interface Class {
  id: string;
  name: string;
  grade: string;
  teacherId: string;
  studentIds: string[];
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topicId: string;
  imageUrl?: string;
}

export interface Topic {
  id: string;
  name: string;
  subject: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  dateCreated: string;
  timeLimit?: number; // in minutes
  topicIds: string[];
  questionIds: string[];
  classIds: string[];
  isPublished: boolean;
  attempts?: number; // Added attempts property
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  startTime: string;
  endTime?: string;
  score?: number;
  answers: {
    questionId: string;
    answer: string | string[];
    isCorrect: boolean;
    timeSpent: number; // in seconds
    confidenceLevel?: number; // 1-5
  }[];
}

export interface Report {
  id: string;
  studentId: string;
  quizId: string;
  score: number;
  totalQuestions: number; // Added totalQuestions property
  topicPerformance: {
    topicId: string;
    score: number;
  }[];
  weakAreas: string[];
  suggestedTopics: string[];
  dateGenerated: string;
}
