
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getQuizzesByClassId, getQuizAttemptsByStudentId, getReportsByStudentId } from '@/services/dataService';
import { useAuth } from '@/contexts/AuthContext';
import { AvailableQuizzes } from './AvailableQuizzes';
import { CompletedQuizzes } from './CompletedQuizzes';
import { StudentReports } from './StudentReports';
import { StudentProgress } from './StudentProgress';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const studentId = user?.id || '';
  const classId = user?.classId || '';
  
  const availableQuizzes = getQuizzesByClassId(classId);
  const completedAttempts = getQuizAttemptsByStudentId(studentId);
  const reports = getReportsByStudentId(studentId);
  
  // Quizzes the student hasn't completed yet
  const pendingQuizzes = availableQuizzes.filter(quiz => 
    !completedAttempts.some(attempt => attempt.quizId === quiz.id)
  );
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100 mt-2">Ready to learn something new today?</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-blue-600">Available Quizzes</CardTitle>
                <CardDescription>Quizzes you can take</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{pendingQuizzes.length}</div>
                <p className="text-sm text-gray-500 mt-2">{pendingQuizzes.length} quizzes available</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-green-600">Completed Quizzes</CardTitle>
                <CardDescription>Quizzes you've taken</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{completedAttempts.length}</div>
                <p className="text-sm text-gray-500 mt-2">{completedAttempts.length} quizzes completed</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-purple-600">Reports</CardTitle>
                <CardDescription>Your performance data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{reports.length}</div>
                <p className="text-sm text-gray-500 mt-2">{reports.length} reports available</p>
              </CardContent>
            </Card>
          </div>
          
          {pendingQuizzes.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Quick Start - Take a Quiz</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingQuizzes.slice(0, 4).map((quiz) => (
                  <Card key={quiz.id} className="hover:shadow-md transition-all hover:scale-105">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2 text-lg">{quiz.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{quiz.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {quiz.questionIds.length} questions • {quiz.timeLimit} min
                        </span>
                        <button 
                          onClick={() => setActiveTab('quizzes')}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors text-sm font-medium"
                        >
                          Start Quiz
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="quizzes" className="mt-6">
          <AvailableQuizzes />
        </TabsContent>
        
        <TabsContent value="progress" className="mt-6">
          <StudentProgress />
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <StudentReports />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <CompletedQuizzes />
        </TabsContent>
      </Tabs>
    </div>
  );
};
