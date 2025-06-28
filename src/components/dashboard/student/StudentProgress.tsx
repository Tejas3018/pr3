import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { getQuizAttemptsByStudentId } from '@/services/dataService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Award, Clock, Target } from 'lucide-react';

export const StudentProgress: React.FC = () => {
  const { user } = useAuth();
  const studentId = user?.id || '';
  
  const attempts = getQuizAttemptsByStudentId(studentId);
  
  // Calculate progress statistics
  const totalQuizzes = attempts.length;
  const averageScore = attempts.length > 0 
    ? Math.round(attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / attempts.length)
    : 0;
  
  // Calculate total time spent from all answers
  const totalTimeSpent = attempts.reduce((sum, attempt) => {
    const attemptTimeSpent = attempt.answers.reduce((answerSum, answer) => answerSum + (answer.timeSpent || 0), 0);
    return sum + attemptTimeSpent;
  }, 0);
  
  const highestScore = attempts.length > 0 ? Math.max(...attempts.map(a => a.score || 0)) : 0;
  
  // Prepare chart data
  const scoreData = attempts.map((attempt, index) => {
    const attemptTimeSpent = attempt.answers.reduce((sum, answer) => sum + (answer.timeSpent || 0), 0);
    return {
      quiz: `Quiz ${index + 1}`,
      score: attempt.score || 0,
      timeSpent: Math.round(attemptTimeSpent / 60) // Convert to minutes
    };
  });
  
  const performanceData = [
    { name: 'Excellent (90-100)', value: attempts.filter(a => (a.score || 0) >= 90).length, color: '#10B981' },
    { name: 'Good (75-89)', value: attempts.filter(a => (a.score || 0) >= 75 && (a.score || 0) < 90).length, color: '#3B82F6' },
    { name: 'Average (60-74)', value: attempts.filter(a => (a.score || 0) >= 60 && (a.score || 0) < 75).length, color: '#F59E0B' },
    { name: 'Below Average (<60)', value: attempts.filter(a => (a.score || 0) < 60).length, color: '#EF4444' }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Your Learning Progress</h2>
        <p className="text-gray-600">Track your performance and improvement over time</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                <p className="text-2xl font-bold text-gray-900">{totalQuizzes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Highest Score</p>
                <p className="text-2xl font-bold text-gray-900">{highestScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(totalTimeSpent / 60)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {attempts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Score Progression</CardTitle>
              <CardDescription>Your quiz scores over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quiz" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Distribution</CardTitle>
              <CardDescription>Breakdown of your quiz performance levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Time vs Score Analysis */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quiz Performance Overview</CardTitle>
              <CardDescription>Score and time spent per quiz</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quiz" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="score" fill="#3B82F6" name="Score (%)" />
                  <Bar yAxisId="right" dataKey="timeSpent" fill="#10B981" name="Time (min)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mb-4">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Progress Data Yet</h3>
            <p className="text-gray-600 mb-4">
              Take some quizzes to see your learning progress and performance analytics here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
