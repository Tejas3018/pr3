import { Quiz, Question, QuizAttempt, Report, User, Class, Topic } from '@/types/quiz.types';

// Mock users data - Updated to match login demo credentials
const mockUsers: User[] = [
  {
    id: 'student1',
    name: 'Alice Johnson',
    email: 'alice@student.com',
    role: 'student',
    classId: 'class1'
  },
  {
    id: 'teacher1',
    name: 'Dr. Smith',
    email: 'smith@teacher.com',
    role: 'teacher'
  },
  {
    id: 'teacher2',
    name: 'Prof. Wilson',
    email: 'wilson@teacher.com',
    role: 'teacher'
  }
];

// Mock classes data
const mockClasses: Class[] = [
  {
    id: 'class1',
    name: 'Computer Science Grade 12',
    grade: '12',
    teacherId: 'teacher1',
    studentIds: ['student1']
  },
  {
    id: 'class2',
    name: 'Physics Grade 11',
    grade: '11',
    teacherId: 'teacher2',
    studentIds: []
  }
];

// Mock topics data
const mockTopics: Topic[] = [
  {
    id: 'topic1',
    name: 'Data Structures',
    subject: 'Computer Science'
  },
  {
    id: 'topic2',
    name: 'Algorithms',
    subject: 'Computer Science'
  },
  {
    id: 'topic3',
    name: 'Mechanics',
    subject: 'Physics'
  }
];

// Mock questions data
const mockQuestions: Question[] = [
  {
    id: 'q1',
    text: 'What is the time complexity of searching in a binary search tree?',
    type: 'multiple-choice',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctAnswer: 'O(log n)',
    explanation: 'Binary search tree allows logarithmic search time in the average case.',
    difficulty: 'medium',
    topicId: 'topic1'
  },
  {
    id: 'q2',
    text: 'Arrays are stored in contiguous memory locations.',
    type: 'true-false',
    correctAnswer: 'true',
    explanation: 'Arrays are indeed stored in contiguous memory locations.',
    difficulty: 'easy',
    topicId: 'topic1'
  }
];

// Mock data
const mockQuizzes: Quiz[] = [
  {
    id: 'q1',
    title: 'Introduction to Data Structures',
    description: 'Basic concepts of arrays, linked lists, and stacks',
    createdBy: 'teacher1',
    classIds: ['class1'],
    questionIds: ['q1', 'q2'],
    topicIds: ['topic1'],
    timeLimit: 30,
    isPublished: true,
    dateCreated: '2024-01-15',
    attempts: 25
  },
  {
    id: 'q2',
    title: 'Advanced Algorithms',
    description: 'Sorting and searching algorithms with complexity analysis',
    createdBy: 'teacher1',
    classIds: ['class1'],
    questionIds: ['q1', 'q2'],
    topicIds: ['topic2'],
    timeLimit: 45,
    isPublished: true,
    dateCreated: '2024-01-20',
    attempts: 18
  },
  {
    id: 'q3',
    title: 'Physics Fundamentals',
    description: 'Newton\'s laws and basic mechanics',
    createdBy: 'teacher2',
    classIds: ['class2'],
    questionIds: ['q1'],
    topicIds: ['topic3'],
    timeLimit: 25,
    isPublished: false,
    dateCreated: '2024-01-25',
    attempts: 0
  }
];

const mockQuizAttempts: QuizAttempt[] = [
  {
    id: 'attempt1',
    quizId: 'q1',
    studentId: 'student1',
    score: 85,
    startTime: '2024-01-16T10:00:00Z',
    endTime: '2024-01-16T10:25:00Z',
    answers: [
      {
        questionId: 'q1',
        answer: 'O(log n)',
        isCorrect: true,
        timeSpent: 120,
        confidenceLevel: 4
      },
      {
        questionId: 'q2',
        answer: 'true',
        isCorrect: true,
        timeSpent: 90,
        confidenceLevel: 5
      }
    ]
  }
];

const mockReports: Report[] = [
  {
    id: 'report1',
    studentId: 'student1',
    quizId: 'q1',
    score: 85,
    totalQuestions: 2,
    topicPerformance: [
      { topicId: 'topic1', score: 85 }
    ],
    weakAreas: ['Need to work on linked lists'],
    suggestedTopics: ['Practice more linked list problems'],
    dateGenerated: '2024-01-16'
  }
];

// Authentication functions - Updated to use simple password matching
export const authenticateUser = (email: string, password: string): User | null => {
  // Demo authentication - match credentials
  const validCredentials = [
    { email: 'alice@student.com', password: 'student123' },
    { email: 'smith@teacher.com', password: 'teacher123' },
    { email: 'wilson@teacher.com', password: 'teacher123' }
  ];
  
  const credential = validCredentials.find(cred => cred.email === email && cred.password === password);
  if (credential) {
    const user = mockUsers.find(u => u.email === email);
    return user || null;
  }
  
  return null;
};

// User functions
export const getUserById = (id: string): User | null => {
  return mockUsers.find(user => user.id === id) || null;
};

// Quiz functions
export const getQuizById = (id: string): Quiz | null => {
  return mockQuizzes.find(quiz => quiz.id === id) || null;
};

export const getQuizzesByClassId = (classId: string): Quiz[] => {
  return mockQuizzes.filter(quiz => quiz.classIds.includes(classId) && quiz.isPublished);
};

export const getQuizzesByTeacherId = (teacherId: string): Quiz[] => {
  return mockQuizzes.filter(quiz => quiz.createdBy === teacherId);
};

export const saveQuiz = (quiz: Quiz): void => {
  const existingIndex = mockQuizzes.findIndex(q => q.id === quiz.id);
  if (existingIndex !== -1) {
    mockQuizzes[existingIndex] = quiz;
  } else {
    mockQuizzes.push(quiz);
  }
};

// Question functions
export const getQuestionById = (id: string): Question | null => {
  return mockQuestions.find(question => question.id === id) || null;
};

export const saveQuestion = (question: Question): void => {
  const existingIndex = mockQuestions.findIndex(q => q.id === question.id);
  if (existingIndex !== -1) {
    mockQuestions[existingIndex] = question;
  } else {
    mockQuestions.push(question);
  }
};

// Quiz attempt functions
export const getQuizAttemptsByStudentId = (studentId: string): QuizAttempt[] => {
  return mockQuizAttempts.filter(attempt => attempt.studentId === studentId);
};

export const saveQuizAttempt = (attempt: QuizAttempt): void => {
  mockQuizAttempts.push(attempt);
};

// Report functions
export const getReports = (): Report[] => {
  return mockReports;
};

export const getReportsByStudentId = (studentId: string): Report[] => {
  return mockReports.filter(report => report.studentId === studentId);
};

export const generateReport = (attempt: QuizAttempt): void => {
  const correctAnswers = attempt.answers.filter(a => a.isCorrect).length;
  const score = (correctAnswers / attempt.answers.length) * 100;
  
  const report: Report = {
    id: `report-${Date.now()}`,
    studentId: attempt.studentId,
    quizId: attempt.quizId,
    score,
    totalQuestions: attempt.answers.length,
    topicPerformance: [
      { topicId: 'topic1', score }
    ],
    weakAreas: score < 70 ? ['Needs improvement in this topic'] : [],
    suggestedTopics: score < 70 ? ['Review the fundamentals'] : [],
    dateGenerated: new Date().toISOString()
  };
  
  mockReports.push(report);
};

// Class functions
export const getClassesByTeacherId = (teacherId: string): Class[] => {
  return mockClasses.filter(cls => cls.teacherId === teacherId);
};

// Topic functions
export const getTopicById = (id: string): Topic | null => {
  return mockTopics.find(topic => topic.id === id) || null;
};

// Additional utility function for curriculum mapping
export const parseSyllabus = (syllabusText: string): any => {
  // Mock implementation for syllabus parsing
  return {
    topics: ['Basic Programming', 'Data Structures', 'Algorithms'],
    units: 3,
    duration: '6 months'
  };
};

// Export mock data for components that need it
export { mockQuizzes, mockQuizAttempts, mockReports, mockUsers, mockClasses, mockTopics, mockQuestions };
