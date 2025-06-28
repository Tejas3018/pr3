
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { getQuizzesByClassId, getQuizAttemptsByStudentId } from '@/services/dataService';
import { useNavigate } from 'react-router-dom';
import { Clock, FileQuestion, Users } from 'lucide-react';

export const AvailableQuizzes: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const studentId = user?.id || '';
  const classId = user?.classId || 'class1'; // Default for demo
  
  const availableQuizzes = getQuizzesByClassId(classId);
  const completedAttempts = getQuizAttemptsByStudentId(studentId);
  
  // Filter out completed quizzes
  const pendingQuizzes = availableQuizzes.filter(quiz => 
    !completedAttempts.some(attempt => attempt.quizId === quiz.id)
  );

  const startQuiz = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Available Quizzes</h2>
        <p className="text-gray-500">Take these quizzes assigned by your teachers</p>
      </div>

      {pendingQuizzes.length > 0 ? (
        <div className="space-y-4">
          {pendingQuizzes.map((quiz) => (
            <Card key={quiz.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileQuestion className="h-5 w-5 text-blue-600" />
                      {quiz.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {quiz.description}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Available
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FileQuestion className="h-4 w-4" />
                      <span>{quiz.questionIds.length} questions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{quiz.timeLimit} minutes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{quiz.attempts || 0} attempts</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => startQuiz(quiz.id)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Start Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <FileQuestion className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No quizzes available</h3>
            <p className="text-gray-500">
              {availableQuizzes.length > 0 
                ? "You've completed all available quizzes!" 
                : "Your teacher hasn't assigned any quizzes yet."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
