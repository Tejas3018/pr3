
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { QuizManager } from './QuizManager';
import { ClassManager } from './ClassManager';
import { QuizGenerator } from './QuizGenerator';
import { ReportViewer } from './ReportViewer';
import { useAuth } from '@/contexts/AuthContext';
import { getQuizzesByTeacherId, getClassesByTeacherId } from '@/services/dataService';
import { Activity, BookOpen, Calendar, CheckSquare, FileText, PlusCircle, Users, Video } from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const teacherId = user?.id || '';
  const quizzes = getQuizzesByTeacherId(teacherId);
  const classes = getClassesByTeacherId(teacherId);
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
        <p className="text-slate-500">Manage your classes, quizzes and view student reports</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-4xl mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="generator">Quiz Generator</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="overflow-hidden border-slate-200 dark:border-slate-800 dashboard-card">
              <CardHeader className="bg-blue-50 dark:bg-blue-900/20 pb-2">
                <CardTitle className="flex items-center text-blue-700 dark:text-blue-300">
                  <Users size={18} className="mr-2" />
                  My Classes
                </CardTitle>
                <CardDescription>Classes you currently teach</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-1">{classes.length}</div>
                <p className="text-sm text-slate-500">{classes.length} active classes</p>
              </CardContent>
              <CardFooter className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 py-2">
                <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-0">View all classes</Button>
              </CardFooter>
            </Card>
            
            <Card className="overflow-hidden border-slate-200 dark:border-slate-800 dashboard-card">
              <CardHeader className="bg-purple-50 dark:bg-purple-900/20 pb-2">
                <CardTitle className="flex items-center text-purple-700 dark:text-purple-300">
                  <CheckSquare size={18} className="mr-2" />
                  My Quizzes
                </CardTitle>
                <CardDescription>Quizzes you've created</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-1">{quizzes.length}</div>
                <p className="text-sm text-slate-500">{quizzes.filter(q => q.isPublished).length} published quizzes</p>
              </CardContent>
              <CardFooter className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 py-2">
                <Button variant="ghost" size="sm" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 p-0">View all quizzes</Button>
              </CardFooter>
            </Card>
            
            <Card className="overflow-hidden border-slate-200 dark:border-slate-800 dashboard-card">
              <CardHeader className="bg-green-50 dark:bg-green-900/20 pb-2">
                <CardTitle className="flex items-center text-green-700 dark:text-green-300">
                  <Activity size={18} className="mr-2" />
                  Student Activity
                </CardTitle>
                <CardDescription>Recent quiz attempts</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-1">0</div>
                <p className="text-sm text-slate-500">No recent activity</p>
              </CardContent>
              <CardFooter className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 py-2">
                <Button variant="ghost" size="sm" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 p-0">View all activity</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors dashboard-card" onClick={() => setActiveTab('generator')}>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-3 text-purple-600 dark:text-purple-300">
                    <PlusCircle size={24} />
                  </div>
                  <h3 className="font-medium">Create Quiz</h3>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors dashboard-card" onClick={() => setActiveTab('classes')}>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3 text-blue-600 dark:text-blue-300">
                    <Users size={24} />
                  </div>
                  <h3 className="font-medium">Manage Classes</h3>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors dashboard-card" onClick={() => setActiveTab('reports')}>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3 text-amber-600 dark:text-amber-300">
                    <Activity size={24} />
                  </div>
                  <h3 className="font-medium">View Reports</h3>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors dashboard-card">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-3 text-green-600 dark:text-green-300">
                    <Video size={24} />
                  </div>
                  <h3 className="font-medium">Upload Resource</h3>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="classes" className="mt-0">
          <ClassManager />
        </TabsContent>
        
        <TabsContent value="quizzes" className="mt-0">
          <QuizManager />
        </TabsContent>
        
        <TabsContent value="generator" className="mt-0">
          <QuizGenerator />
        </TabsContent>
        
        <TabsContent value="reports" className="mt-0">
          <ReportViewer />
        </TabsContent>
      </Tabs>
    </div>
  );
};
