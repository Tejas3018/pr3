
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { getReportsByStudentId, getQuizById, getTopicById } from '@/services/dataService';
import { Award, BarChart2, BookOpen, Target } from 'lucide-react';

export const StudentReports: React.FC = () => {
  const { user } = useAuth();
  const studentId = user?.id || '';
  const reports = getReportsByStudentId(studentId);
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">My Learning Reports</h2>
        <p className="text-gray-500">Review your performance and areas for improvement</p>
      </div>
      
      {reports.length > 0 ? (
        <div className="space-y-6">
          {reports.map((report) => {
            const quiz = getQuizById(report.quizId);
            if (!quiz) return null;
            
            return (
              <Card key={report.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart2 size={18} className="mr-2 text-quiz-primary" />
                    {quiz.title} Report
                  </CardTitle>
                  <CardDescription>
                    Completed on {new Date(report.dateGenerated).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Overall Score</span>
                      <span 
                        className={`font-bold ${report.score >= 80 ? 'text-green-600' : report.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}
                      >
                        {report.score.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          report.score >= 80 ? 'bg-green-600' : 
                          report.score >= 60 ? 'bg-amber-600' : 
                          'bg-red-600'
                        }`}
                        style={{ width: `${report.score}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium flex items-center mb-3">
                        <BookOpen size={16} className="mr-2 text-quiz-primary" />
                        Topic Performance
                      </h3>
                      <div className="space-y-3">
                        {report.topicPerformance.map((topicPerf) => {
                          const topic = getTopicById(topicPerf.topicId);
                          if (!topic) return null;
                          
                          return (
                            <div key={topicPerf.topicId}>
                              <div className="flex justify-between text-sm mb-1">
                                <span>{topic.name}</span>
                                <span 
                                  className={`font-medium ${
                                    topicPerf.score >= 80 ? 'text-green-600' : 
                                    topicPerf.score >= 60 ? 'text-amber-600' : 
                                    'text-red-600'
                                  }`}
                                >
                                  {topicPerf.score.toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    topicPerf.score >= 80 ? 'bg-green-600' : 
                                    topicPerf.score >= 60 ? 'bg-amber-600' : 
                                    'bg-red-600'
                                  }`}
                                  style={{ width: `${topicPerf.score}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div>
                      {report.weakAreas.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium flex items-center mb-3">
                            <Target size={16} className="mr-2 text-quiz-primary" />
                            Areas for Improvement
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {report.weakAreas.map((area, i) => (
                              <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {report.suggestedTopics.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium flex items-center mb-3">
                            <Award size={16} className="mr-2 text-quiz-primary" />
                            Recommended Study
                          </h3>
                          <ul className="space-y-2 text-sm">
                            {report.suggestedTopics.map((topic, i) => (
                              <li key={i} className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-quiz-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BarChart2 size={30} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No reports yet</h3>
            <p className="text-gray-500">
              Complete quizzes to see your performance reports here
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
