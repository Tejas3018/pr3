
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { TopicSelector } from '@/components/dashboard/teacher/quiz/TopicSelector';
import { DifficultySelector } from '@/components/dashboard/teacher/quiz/DifficultySelector';
import { QuizSettings } from '@/components/dashboard/teacher/quiz/QuizSettings';
import { Brain, Check, CheckCircle, Loader2, Play, Sparkles, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { generateRealQuizQuestions, getAIStudyRecommendations, analyzeStudentPerformance } from '@/services/aiQuestionService';
import { Question } from '@/types/quiz.types';

interface GeneratedQuiz {
  id: string;
  title: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  timeLimit: number;
  date: string;
  questions?: Question[];
}

const QuizGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [questionCount, setQuestionCount] = useState(5);
  const [timeLimit, setTimeLimit] = useState(15);
  const [grade, setGrade] = useState('High School (9-12)');
  const [focusKeywords, setFocusKeywords] = useState('');
  
  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [studyRecommendations, setStudyRecommendations] = useState<string[]>([]);
  
  // Generated quizzes
  const [generatedQuizzes, setGeneratedQuizzes] = useState<GeneratedQuiz[]>([
    {
      id: 'q1',
      title: 'Data Structures Fundamentals',
      topic: 'Computer Science',
      difficulty: 'intermediate',
      questionCount: 8,
      timeLimit: 20,
      date: '2024-01-15'
    },
    {
      id: 'q2',
      title: 'Machine Learning Basics',
      topic: 'Artificial Intelligence',
      difficulty: 'beginner',
      questionCount: 6,
      timeLimit: 15,
      date: '2024-01-18'
    }
  ]);

  const handleShowPreview = async () => {
    if (!topic) {
      toast({
        title: 'Topic required',
        description: 'Please select or enter a topic for your quiz',
        variant: 'destructive'
      });
      return;
    }

    setGeneratedQuestions([]);
    setGenerationProgress(0);
    setIsGenerating(true);
    setShowPreviewDialog(true);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Generate real questions using AI
      const questions = await generateRealQuizQuestions({
        topic,
        difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
        questionCount,
        questionTypes: ['multiple-choice', 'true-false', 'short-answer'],
        grade,
        focusKeywords
      });

      // Get study recommendations
      const recommendations = await getAIStudyRecommendations(topic, difficulty);
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      setGeneratedQuestions(questions);
      setStudyRecommendations(recommendations);
      setIsGenerating(false);

      toast({
        title: 'Real questions generated!',
        description: `Created ${questions.length} authentic questions about ${topic} using AI.`,
      });
    } catch (error) {
      console.error('Error generating questions:', error);
      setIsGenerating(false);
      toast({
        title: 'Generation failed',
        description: 'Failed to generate quiz questions. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleGenerateQuiz = () => {
    if (!topic || generatedQuestions.length === 0) {
      toast({
        title: 'Missing information',
        description: 'Please generate questions first',
        variant: 'destructive'
      });
      return;
    }
    
    setShowPreviewDialog(false);
    
    const newQuiz: GeneratedQuiz = {
      id: `q${Date.now().toString()}`,
      title: `AI Quiz: ${topic}`,
      topic,
      difficulty,
      questionCount: generatedQuestions.length,
      timeLimit,
      date: new Date().toISOString().split('T')[0],
      questions: generatedQuestions
    };
    
    setGeneratedQuizzes([newQuiz, ...generatedQuizzes]);
    
    toast({
      title: 'Quiz Generated!',
      description: `A new AI-powered quiz on ${topic} has been created with ${generatedQuestions.length} real questions.`,
    });
  };

  const startQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI-Powered Quiz Generator
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Generate personalized practice quizzes with real questions powered by artificial intelligence
          </p>
        </div>

        <Tabs defaultValue="create">
          <TabsList className="mb-6">
            <TabsTrigger value="create" className="flex items-center">
              <Brain className="mr-2" size={16} />
              Create AI Quiz
            </TabsTrigger>
            <TabsTrigger value="recent">Recent Quizzes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="mt-6">
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-blue-950/20">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Sparkles className="mr-3 text-blue-600" size={28} />
                  Generate AI-Powered Quiz
                </CardTitle>
                <CardDescription className="text-base">
                  Create personalized quizzes with authentic questions generated by AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                      Select Topic
                    </h3>
                    <TopicSelector 
                      selectedTopic={topic} 
                      onTopicChange={setTopic} 
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                      Choose Difficulty
                    </h3>
                    <DifficultySelector 
                      selectedDifficulty={difficulty} 
                      onDifficultyChange={setDifficulty}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                      Quiz Settings
                    </h3>
                    <QuizSettings 
                      questionCount={questionCount}
                      onQuestionCountChange={setQuestionCount}
                      timeLimit={timeLimit}
                      onTimeLimitChange={setTimeLimit}
                      grade={grade}
                      onGradeChange={setGrade}
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium flex items-center">
                      <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                      AI Enhancement
                    </h3>
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border">
                      <div className="space-y-3">
                        <div className="flex items-center text-amber-700 dark:text-amber-300">
                          <Brain size={18} className="mr-2" />
                          <span className="font-medium">Focus Keywords (Optional)</span>
                        </div>
                        <Textarea 
                          placeholder="Enter specific concepts or topics you want to focus on (e.g., 'sorting algorithms, time complexity, binary search')..."
                          value={focusKeywords}
                          onChange={(e) => setFocusKeywords(e.target.value)}
                          className="bg-white/70 dark:bg-slate-800/70"
                          rows={2}
                        />
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          🤖 AI will prioritize these concepts when generating authentic questions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={handleShowPreview}
                  disabled={!topic}
                >
                  <Brain className="mr-3" size={24} />
                  Generate Real AI Questions
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="recent" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your AI-Generated Quizzes</CardTitle>
                <CardDescription>Practice with your personalized AI quizzes</CardDescription>
              </CardHeader>
              <CardContent>
                {generatedQuizzes.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-500">You haven't generated any AI quizzes yet.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        const createTabTrigger = document.querySelector('[data-value="create"]');
                        if (createTabTrigger instanceof HTMLElement) {
                          createTabTrigger.click();
                        }
                      }}
                    >
                      Generate Your First AI Quiz
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {generatedQuizzes.map(quiz => (
                      <div key={quiz.id} className="border rounded-lg p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-blue-50 dark:from-slate-900 dark:to-blue-950/20">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center mb-2">
                              <Brain size={20} className="text-blue-600 mr-2" />
                              <h3 className="font-semibold text-xl">{quiz.title}</h3>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                {quiz.topic}
                              </Badge>
                              <Badge className={getDifficultyColor(quiz.difficulty)}>
                                {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                              </Badge>
                              <Badge variant="outline" className="bg-slate-50 text-slate-700">
                                {quiz.questionCount} AI questions
                              </Badge>
                              <Badge variant="outline" className="bg-slate-50 text-slate-700">
                                {quiz.timeLimit} minutes
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-500 mt-2">
                              Generated on {new Date(quiz.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Button 
                            onClick={() => startQuiz(quiz.id)}
                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                          >
                            <Play className="mr-2" size={16} />
                            Start AI Quiz
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Question Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <Brain className="mr-2 text-blue-600" size={24} />
              AI Quiz Preview
            </DialogTitle>
            <DialogDescription>
              AI is generating authentic questions about {topic}
            </DialogDescription>
          </DialogHeader>
          
          {isGenerating ? (
            <div className="py-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <Brain className="absolute inset-0 m-auto text-blue-600" size={32} />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-blue-600">AI is generating real questions...</p>
                  <p className="text-sm text-slate-500 mt-1">Creating authentic educational content</p>
                </div>
                <div className="space-y-2">
                  <Progress value={generationProgress} className="h-3" />
                  <p className="text-xs text-slate-500 text-center">{generationProgress}% complete</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {generatedQuestions.map((question, i) => (
                  <div key={i} className="border rounded-md p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 animate-fade-in">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1">
                        <CheckCircle className="text-green-500" size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Question {i + 1} Generated</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {question.text.substring(0, 80)}...
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {question.difficulty}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="py-4 space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 p-6 rounded-lg border">
                  <div className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200 text-lg">
                        AI Quiz Successfully Generated
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                        Your personalized quiz about <strong>{topic}</strong> is ready with{' '}
                        <strong>{generatedQuestions.length} authentic questions</strong> generated by AI.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4 flex items-center">
                    <Sparkles className="mr-2 text-purple-600" size={18} />
                    Sample Questions Preview
                  </h3>
                  <div className="space-y-3">
                    {generatedQuestions.slice(0, 3).map((question, i) => (
                      <div key={i} className="border rounded-lg p-4 bg-white/50 dark:bg-slate-800/50">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-medium">Question {i + 1}</p>
                          <Badge className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm mb-3 text-slate-700 dark:text-slate-300">
                          {question.text}
                        </p>
                        <div className="flex items-center text-xs text-slate-500">
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            {question.type.replace('-', ' ')} question
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {generatedQuestions.length > 3 && (
                      <p className="text-xs text-slate-500 text-center py-2">
                        ...and {generatedQuestions.length - 3} more authentic questions
                      </p>
                    )}
                  </div>
                </div>

                {studyRecommendations.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center text-amber-700 dark:text-amber-300">
                      <Lightbulb className="mr-2" size={16} />
                      AI Study Tips
                    </h3>
                    <ul className="space-y-1">
                      {studyRecommendations.slice(0, 3).map((rec, index) => (
                        <li key={index} className="text-xs text-amber-600 dark:text-amber-400 flex items-start">
                          <span className="w-1 h-1 bg-amber-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleGenerateQuiz}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Create AI Quiz
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default QuizGenerator;
