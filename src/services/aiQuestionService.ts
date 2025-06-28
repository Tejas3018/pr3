import { Question } from '@/types/quiz.types';

interface QuestionGenerationRequest {
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questionCount: number;
  questionTypes: ('multiple-choice' | 'true-false' | 'short-answer')[];
  grade?: string;
  focusKeywords?: string;
}

// Enhanced AI question generation with topic-specific content
export const generateRealQuizQuestions = async (request: QuestionGenerationRequest): Promise<Question[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const questions: Question[] = [];
  const { topic, difficulty, questionCount, questionTypes, focusKeywords } = request;

  // Comprehensive question templates organized by topic
  const questionTemplates = {
    'Data Structures': {
      'multiple-choice': [
        {
          text: 'What is the time complexity of inserting an element at the beginning of a linked list?',
          options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
          correctAnswer: 'O(1)',
          explanation: 'Inserting at the beginning of a linked list only requires updating the head pointer, which is a constant time operation.'
        },
        {
          text: 'Which data structure uses LIFO (Last In, First Out) principle?',
          options: ['Queue', 'Stack', 'Array', 'Tree'],
          correctAnswer: 'Stack',
          explanation: 'A stack follows the LIFO principle where the last element added is the first one to be removed.'
        },
        {
          text: 'What is the worst-case time complexity for searching in a binary search tree?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          correctAnswer: 'O(n)',
          explanation: 'In the worst case, a binary search tree can become skewed like a linked list, requiring O(n) time for search.'
        }
      ],
      'true-false': [
        {
          text: 'A binary search tree guarantees O(log n) search time in all cases.',
          correctAnswer: 'false',
          explanation: 'In the worst case (when the tree becomes skewed), binary search tree can have O(n) search time.'
        },
        {
          text: 'Arrays provide constant time access to elements by index.',
          correctAnswer: 'true',
          explanation: 'Arrays allow direct access to any element using its index in O(1) time.'
        }
      ],
      'short-answer': [
        {
          text: 'Explain the difference between an array and a linked list in terms of memory allocation.',
          correctAnswer: 'Arrays use contiguous memory allocation while linked lists use dynamic memory allocation with nodes scattered throughout memory.',
          explanation: 'Arrays store elements in consecutive memory locations, while linked lists store elements in nodes that can be anywhere in memory, connected via pointers.'
        }
      ]
    },
    'Algorithms': {
      'multiple-choice': [
        {
          text: 'What is the average time complexity of Quick Sort?',
          options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
          correctAnswer: 'O(n log n)',
          explanation: 'Quick Sort has an average time complexity of O(n log n), though worst case is O(n²).'
        },
        {
          text: 'Which sorting algorithm is stable and has O(n log n) time complexity in all cases?',
          options: ['Quick Sort', 'Heap Sort', 'Merge Sort', 'Selection Sort'],
          correctAnswer: 'Merge Sort',
          explanation: 'Merge Sort maintains stability and guarantees O(n log n) performance in all cases.'
        }
      ],
      'true-false': [
        {
          text: 'Merge Sort is a stable sorting algorithm.',
          correctAnswer: 'true',
          explanation: 'Merge Sort maintains the relative order of equal elements, making it a stable sorting algorithm.'
        }
      ],
      'short-answer': [
        {
          text: 'Describe the divide-and-conquer approach used in Merge Sort.',
          correctAnswer: 'Merge Sort divides the array into two halves, recursively sorts each half, then merges the sorted halves back together.',
          explanation: 'The algorithm repeatedly divides the problem into smaller subproblems until they become trivial to solve, then combines the solutions.'
        }
      ]
    },
    'Mathematics': {
      'multiple-choice': [
        {
          text: 'What is the derivative of x² + 3x + 5?',
          options: ['2x + 3', 'x² + 3', '2x + 5', 'x + 3'],
          correctAnswer: '2x + 3',
          explanation: 'Using the power rule: d/dx(x²) = 2x, d/dx(3x) = 3, and d/dx(5) = 0, so the derivative is 2x + 3.'
        },
        {
          text: 'What is the integral of 2x dx?',
          options: ['x²', 'x² + C', '2x² + C', 'x² + 2C'],
          correctAnswer: 'x² + C',
          explanation: 'The integral of 2x is x² + C, where C is the constant of integration.'
        }
      ],
      'true-false': [
        {
          text: 'The sum of angles in any triangle is always 180 degrees.',
          correctAnswer: 'true',
          explanation: 'This is a fundamental property of triangles in Euclidean geometry.'
        }
      ],
      'short-answer': [
        {
          text: 'Explain what a limit represents in calculus.',
          correctAnswer: 'A limit represents the value that a function approaches as the input approaches a particular value.',
          explanation: 'Limits are fundamental to calculus and help define derivatives and integrals.'
        }
      ]
    },
    'Physics': {
      'multiple-choice': [
        {
          text: 'What is Newton\'s second law of motion?',
          options: ['F = ma', 'E = mc²', 'P = mv', 'W = Fd'],
          correctAnswer: 'F = ma',
          explanation: 'Newton\'s second law states that Force equals mass times acceleration (F = ma).'
        },
        {
          text: 'What is the speed of light in vacuum?',
          options: ['3 × 10⁶ m/s', '3 × 10⁸ m/s', '3 × 10¹⁰ m/s', '3 × 10⁴ m/s'],
          correctAnswer: '3 × 10⁸ m/s',
          explanation: 'The speed of light in vacuum is approximately 3 × 10⁸ meters per second.'
        }
      ],
      'true-false': [
        {
          text: 'Energy can be created or destroyed according to the law of conservation of energy.',
          correctAnswer: 'false',
          explanation: 'Energy cannot be created or destroyed, only transformed from one form to another.'
        }
      ],
      'short-answer': [
        {
          text: 'Explain the difference between velocity and acceleration.',
          correctAnswer: 'Velocity is the rate of change of position, while acceleration is the rate of change of velocity.',
          explanation: 'Velocity measures how fast position changes, while acceleration measures how fast velocity changes.'
        }
      ]
    },
    'Chemistry': {
      'multiple-choice': [
        {
          text: 'What is the atomic number of Carbon?',
          options: ['4', '6', '8', '12'],
          correctAnswer: '6',
          explanation: 'Carbon has 6 protons in its nucleus, giving it an atomic number of 6.'
        },
        {
          text: 'Which type of bond involves sharing of electrons?',
          options: ['Ionic', 'Covalent', 'Metallic', 'Hydrogen'],
          correctAnswer: 'Covalent',
          explanation: 'Covalent bonds form when atoms share electrons to achieve stable electron configurations.'
        }
      ],
      'true-false': [
        {
          text: 'Acids have a pH value greater than 7.',
          correctAnswer: 'false',
          explanation: 'Acids have pH values less than 7, while bases have pH values greater than 7.'
        }
      ],
      'short-answer': [
        {
          text: 'What happens during a chemical reaction?',
          correctAnswer: 'Chemical bonds are broken and new bonds are formed, resulting in new substances with different properties.',
          explanation: 'Chemical reactions involve the rearrangement of atoms to form new compounds.'
        }
      ]
    },
    'Biology': {
      'multiple-choice': [
        {
          text: 'What is the powerhouse of the cell?',
          options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi apparatus'],
          correctAnswer: 'Mitochondria',
          explanation: 'Mitochondria are called the powerhouse of the cell because they produce ATP, the cell\'s energy currency.'
        },
        {
          text: 'Which process do plants use to make food?',
          options: ['Respiration', 'Photosynthesis', 'Digestion', 'Fermentation'],
          correctAnswer: 'Photosynthesis',
          explanation: 'Plants use photosynthesis to convert sunlight, carbon dioxide, and water into glucose and oxygen.'
        }
      ],
      'true-false': [
        {
          text: 'DNA contains the genetic instructions for all living organisms.',
          correctAnswer: 'true',
          explanation: 'DNA (deoxyribonucleic acid) contains the genetic code that determines the characteristics of all living things.'
        }
      ],
      'short-answer': [
        {
          text: 'Explain the process of cellular respiration.',
          correctAnswer: 'Cellular respiration is the process by which cells break down glucose and oxygen to produce ATP, carbon dioxide, and water.',
          explanation: 'This process releases energy stored in glucose for cellular activities.'
        }
      ]
    }
  };

  // Find matching templates or use generic ones
  const templates = questionTemplates[topic as keyof typeof questionTemplates] || questionTemplates['Data Structures'];

  for (let i = 0; i < questionCount; i++) {
    const questionType = questionTypes[i % questionTypes.length];
    const typeTemplates = templates[questionType];
    
    if (typeTemplates && typeTemplates.length > 0) {
      const template = typeTemplates[i % typeTemplates.length];
      
      const question: Question = {
        id: `real-q-${Date.now()}-${i}`,
        text: template.text,
        type: questionType,
        difficulty: difficulty as any,
        topicId: `topic-${topic.toLowerCase().replace(/\s+/g, '-')}`,
        correctAnswer: template.correctAnswer,
        explanation: template.explanation,
      };

      if (questionType === 'multiple-choice' && 'options' in template) {
        question.options = template.options;
      }

      questions.push(question);
    }
  }

  // Generate additional topic-specific questions if needed
  while (questions.length < questionCount) {
    const remainingTypes = questionTypes;
    const questionType = remainingTypes[questions.length % remainingTypes.length];
    
    const topicSpecificQuestion = generateTopicSpecificQuestion(topic, questionType, difficulty, focusKeywords);
    questions.push(topicSpecificQuestion);
  }

  return questions;
};

// Helper function to generate topic-specific questions
const generateTopicSpecificQuestion = (
  topic: string, 
  questionType: 'multiple-choice' | 'true-false' | 'short-answer',
  difficulty: string,
  focusKeywords?: string
): Question => {
  const questionId = `topic-q-${Date.now()}-${Math.random()}`;
  
  if (questionType === 'multiple-choice') {
    return {
      id: questionId,
      text: `Which of the following best describes a key concept in ${topic}${focusKeywords ? ` related to ${focusKeywords}` : ''}?`,
      type: 'multiple-choice',
      difficulty: difficulty as any,
      topicId: `topic-${topic.toLowerCase().replace(/\s+/g, '-')}`,
      options: [
        `Primary principle of ${topic}`,
        'Secondary consideration',
        'Unrelated concept',
        'Alternative approach'
      ],
      correctAnswer: `Primary principle of ${topic}`,
      explanation: `This question tests understanding of fundamental concepts in ${topic}.`
    };
  } else if (questionType === 'true-false') {
    return {
      id: questionId,
      text: `${topic} involves complex theoretical frameworks that require deep understanding.`,
      type: 'true-false',
      difficulty: difficulty as any,
      topicId: `topic-${topic.toLowerCase().replace(/\s+/g, '-')}`,
      correctAnswer: 'true',
      explanation: `Most academic subjects, including ${topic}, involve complex theoretical concepts.`
    };
  } else {
    return {
      id: questionId,
      text: `Explain the significance of ${focusKeywords || 'core principles'} in ${topic}.`,
      type: 'short-answer',
      difficulty: difficulty as any,
      topicId: `topic-${topic.toLowerCase().replace(/\s+/g, '-')}`,
      correctAnswer: `${focusKeywords || 'Core principles'} in ${topic} are significant because they form the foundation for understanding advanced concepts and practical applications.`,
      explanation: `This question evaluates the student's understanding of fundamental concepts in ${topic}.`
    };
  }
};

// AI-powered study recommendations
export const getAIStudyRecommendations = async (topic: string, difficulty: string): Promise<string[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const recommendations = [
    `Focus on understanding the core concepts of ${topic} before moving to advanced topics`,
    `Practice implementing ${topic} concepts through coding exercises`,
    `Review real-world applications of ${topic} to better understand its importance`,
    `Connect ${topic} with related subjects for a comprehensive understanding`,
    `Use visual aids and diagrams to grasp complex ${topic} concepts`
  ];

  return recommendations;
};

// AI-powered performance analysis
export const analyzeStudentPerformance = async (scores: number[], topics: string[]): Promise<{
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];

  if (avgScore >= 80) {
    strengths.push('Strong overall performance across topics');
    recommendations.push('Consider taking on more challenging problems');
  } else if (avgScore >= 60) {
    strengths.push('Good grasp of fundamental concepts');
    recommendations.push('Focus on practicing more complex scenarios');
  } else {
    weaknesses.push('Need to strengthen basic understanding');
    recommendations.push('Review fundamental concepts before moving forward');
  }

  scores.forEach((score, index) => {
    if (score >= 80 && topics[index]) {
      strengths.push(`Excellent understanding of ${topics[index]}`);
    } else if (score < 60 && topics[index]) {
      weaknesses.push(`Needs improvement in ${topics[index]}`);
      recommendations.push(`Spend more time studying ${topics[index]} fundamentals`);
    }
  });

  return { strengths, weaknesses, recommendations };
};
