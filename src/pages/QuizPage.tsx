
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { getQuizById, getQuestionById, saveQuizAttempt, generateReport } from '@/services/dataService';
import { AppLayout } from '@/components/layout/AppLayout';
import { Clock, CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [quiz, setQuiz] = useState(getQuizById(quizId || ''));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!quiz) {
      toast({
        variant: "destructive",
        title: "Quiz not found",
        description: "The requested quiz could not be found.",
      });
      navigate('/dashboard');
      return;
    }

    if (isStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isStarted, timeLeft, quiz, navigate, toast]);

  const startQuiz = () => {
    if (!quiz) return;
    setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
    setIsStarted(true);
    toast({
      title: "Quiz started!",
      description: `You have ${quiz.timeLimit} minutes to complete this quiz.`,
    });
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || !user) return;
    
    setIsSubmitting(true);
    
    try {
      // Process answers and calculate score
      const processedAnswers = quiz.questionIds.map(questionId => {
        const question = getQuestionById(questionId);
        const userAnswer = answers[questionId] || '';
        const isCorrect = question ? userAnswer === question.correctAnswer : false;
        
        return {
          questionId,
          answer: userAnswer,
          isCorrect,
          timeSpent: 0,
          confidenceLevel: 3
        };
      });

      const correctCount = processedAnswers.filter(a => a.isCorrect).length;
      const score = (correctCount / processedAnswers.length) * 100;

      // Create quiz attempt
      const attempt = {
        id: `attempt-${Date.now()}`,
        quizId: quiz.id,
        studentId: user.id,
        score,
        startTime: new Date(Date.now() - (quiz.timeLimit * 60 - timeLeft) * 1000).toISOString(),
        endTime: new Date().toISOString(),
        answers: processedAnswers
      };

      // Save attempt and generate report
      saveQuizAttempt(attempt);
      generateReport(attempt);

      toast({
        title: "Quiz submitted successfully!",
        description: `You scored ${score.toFixed(1)}% (${correctCount}/${processedAnswers.length} correct)`,
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error submitting quiz",
        description: "There was an error submitting your quiz. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = quiz ? ((currentQuestionIndex + 1) / quiz.questionIds.length) * 100 : 0;
  const currentQuestion = quiz && quiz.questionIds[currentQuestionIndex] 
    ? getQuestionById(quiz.questionIds[currentQuestionIndex])
    : null;

  if (!quiz) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Quiz Not Found</h2>
              <p className="text-gray-500 mb-4">The requested quiz could not be found.</p>
              <Button onClick={() => navigate('/dashboard')}>
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (!isStarted) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Time Limit</p>
                    <p className="font-medium">{quiz.timeLimit} minutes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">Questions</p>
                    <p className="font-medium">{quiz.questionIds.length}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Ready to Start
                  </Badge>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-medium text-yellow-800 mb-2">Instructions:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Read each question carefully before answering</li>
                  <li>• You can navigate between questions using the Previous/Next buttons</li>
                  <li>• Make sure to submit your quiz before time runs out</li>
                  <li>• Once submitted, you cannot change your answers</li>
                </ul>
              </div>
              
              <Button 
                onClick={startQuiz}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
                size="lg"
              >
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            <div className="flex items-center space-x-4">
              <Badge variant={timeLeft < 300 ? "destructive" : "outline"} className="text-sm">
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(timeLeft)}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Question {currentQuestionIndex + 1} of {quiz.questionIds.length}</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">{currentQuestion.text}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="text-blue-600"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
              
              {currentQuestion.type === 'true-false' && (
                <div className="space-y-3">
                  {['true', 'false'].map((option) => (
                    <label key={option} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        className="text-blue-600"
                      />
                      <span className="capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex space-x-3">
            {currentQuestionIndex < quiz.questionIds.length - 1 ? (
              <Button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default QuizPage;
