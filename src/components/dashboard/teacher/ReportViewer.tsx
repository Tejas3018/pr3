
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getQuizzesByTeacherId, getReports, getUserById } from '@/services/dataService';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart, FileText } from 'lucide-react';

export const ReportViewer: React.FC = () => {
  const { user } = useAuth();
  const reports = getReports();
  const quizzes = getQuizzesByTeacherId(user?.id || '');
  
  // Filter reports that match the teacher's quizzes
  const teacherReports = reports.filter(report => 
    quizzes.some(quiz => quiz.id === report.quizId)
  );
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Reports</h2>
        <p className="text-gray-500">View student performance reports</p>
      </div>
      
      {teacherReports.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText size={18} className="mr-2 text-quiz-primary" />
              Recent Quiz Reports
            </CardTitle>
            <CardDescription>
              Performance data from recent quiz attempts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Quiz</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teacherReports.map((report) => {
                  const student = getUserById(report.studentId);
                  const quiz = quizzes.find(q => q.id === report.quizId);
                  
                  return (
                    <TableRow key={report.id}>
                      <TableCell>{student?.name || 'Unknown Student'}</TableCell>
                      <TableCell>{quiz?.title || 'Unknown Quiz'}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-12 bg-gray-200 rounded h-2 mr-2">
                            <div 
                              className={`h-full rounded ${report.score >= 70 ? 'bg-green-500' : 'bg-red-500'}`} 
                              style={{ width: `${Math.max(report.score, 5)}%` }}
                            ></div>
                          </div>
                          {report.score.toFixed(1)}%
                        </div>
                      </TableCell>
                      <TableCell>{new Date(report.dateGenerated).toLocaleDateString()}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BarChart size={30} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No reports yet</h3>
            <p className="text-gray-500">
              Student reports will appear here after they complete quizzes
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
