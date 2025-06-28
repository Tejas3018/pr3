
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { getQuizAttemptsByStudentId, getQuizById } from '@/services/dataService';
import { FileText } from 'lucide-react';

export const CompletedQuizzes: React.FC = () => {
  const { user } = useAuth();
  const studentId = user?.id || '';
  const attempts = getQuizAttemptsByStudentId(studentId);
  
  return (
    <div>
      {attempts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {attempts.map((attempt) => {
            const quiz = getQuizById(attempt.quizId);
            if (!quiz) return null;
            
            const correctAnswers = attempt.answers.filter(a => a.isCorrect).length;
            const totalQuestions = attempt.answers.length;
            const scorePercentage = (correctAnswers / totalQuestions) * 100;
            
            const completionDate = new Date(attempt.endTime || '');
            
            return (
              <Card key={attempt.id}>
                <CardHeader>
                  <CardTitle>{quiz.title}</CardTitle>
                  <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Score</span>
                      <span className="text-sm font-medium">{scorePercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={scorePercentage} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <div className="text-gray-500">Correct Answers</div>
                      <div className="font-medium">{correctAnswers} of {totalQuestions}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Completed On</div>
                      <div className="font-medium">{completionDate.toLocaleDateString()}</div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <FileText size={16} className="mr-2" />
                    View Details
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText size={30} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No quizzes completed</h3>
            <p className="text-gray-500">
              You haven't completed any quizzes yet. Take a quiz to see your results here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
