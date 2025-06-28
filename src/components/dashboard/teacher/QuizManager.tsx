
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getQuizzesByTeacherId, saveQuiz } from '@/services/dataService';
import { Quiz } from '@/types/quiz.types';
import { useToast } from '@/components/ui/use-toast';
import { ArrowRight, CheckCircle, Clock, Edit, FileQuestion, XCircle } from 'lucide-react';

export const QuizManager: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<Quiz[]>(getQuizzesByTeacherId(user?.id || ''));
  
  const togglePublishStatus = (quiz: Quiz) => {
    const updatedQuiz = { ...quiz, isPublished: !quiz.isPublished };
    saveQuiz(updatedQuiz);
    
    // Update local state
    setQuizzes(prev => prev.map(q => q.id === quiz.id ? updatedQuiz : q));
    
    toast({
      title: updatedQuiz.isPublished ? "Quiz Published" : "Quiz Unpublished",
      description: updatedQuiz.isPublished 
        ? "Students can now access this quiz" 
        : "Students can no longer access this quiz",
    });
  };
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quiz Manager</h2>
          <p className="text-gray-500">Manage your existing quizzes</p>
        </div>
      </div>
      
      {quizzes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="p-6 md:w-4/5">
                    <h3 className="text-lg font-semibold mb-1 flex items-center">
                      <FileQuestion size={18} className="mr-2 text-quiz-primary" />
                      {quiz.title}
                      {quiz.isPublished ? (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle size={12} className="mr-1" />
                          Published
                        </span>
                      ) : (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <XCircle size={12} className="mr-1" />
                          Draft
                        </span>
                      )}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{quiz.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="inline-flex items-center text-xs bg-quiz-light text-quiz-primary rounded-full px-2 py-1">
                        <Clock size={12} className="mr-1" />
                        {quiz.timeLimit || 'No'} min time limit
                      </div>
                      <div className="inline-flex items-center text-xs bg-quiz-light text-quiz-primary rounded-full px-2 py-1">
                        <FileQuestion size={12} className="mr-1" />
                        {quiz.questionIds.length} questions
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Created on {new Date(quiz.dateCreated).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col justify-center items-center space-y-3 bg-gray-50 md:w-1/5">
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit size={14} className="mr-1" /> Edit
                    </Button>
                    <Button 
                      variant={quiz.isPublished ? "destructive" : "default"} 
                      size="sm" 
                      className="w-full"
                      onClick={() => togglePublishStatus(quiz)}
                    >
                      {quiz.isPublished ? "Unpublish" : "Publish"}
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full">
                      Details <ArrowRight size={14} className="ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileQuestion size={30} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No quizzes yet</h3>
            <p className="text-gray-500 mb-4">You haven't created any quizzes yet.</p>
            <Button>Create Your First Quiz</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
