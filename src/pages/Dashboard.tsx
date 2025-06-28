
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { DashboardRoot } from '@/components/dashboard/DashboardRoot';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, FileText, GraduationCap, ListTodo, Video } from 'lucide-react';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-500">Loading your dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  if (!user) {
    return null; // Will be redirected by the useEffect
  }
  
  const isTeacher = user.role === 'teacher';
  
  // Quick links for teachers
  const teacherQuickLinks = [
    { icon: <ListTodo size={24} />, title: "To-Do List", description: "Manage your teaching tasks", path: "/todo", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300" },
    { icon: <GraduationCap size={24} />, title: "Teaching Hooks", description: "Create engaging introductions", path: "/hooks", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300" },
    { icon: <Video size={24} />, title: "Videos", description: "Share educational content", path: "/videos", color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300" },
    { icon: <Calendar size={24} />, title: "Lecture Planner", description: "Schedule your classes", path: "/planner", color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300" },
    { icon: <BookOpen size={24} />, title: "Curriculum Mapper", description: "Plan your curriculum", path: "/curriculum", color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300" },
    { icon: <FileText size={24} />, title: "Research Papers", description: "Upload reference papers", path: "/research", color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300" },
  ];
  
  // Quick links for students
  const studentQuickLinks = [
    { icon: <FileText size={24} />, title: "Quiz Generator", description: "Test your knowledge", path: "/quizzes", color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300" },
    { icon: <FileText size={24} />, title: "Previous Papers", description: "Access exam papers", path: "/papers", color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300" },
    { icon: <Video size={24} />, title: "Reference Videos", description: "Watch educational content", path: "/videos", color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300" },
    { icon: <GraduationCap size={24} />, title: "Search Resources", description: "Find study materials", path: "/search", color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300" },
  ];
  
  const quickLinks = isTeacher ? teacherQuickLinks : studentQuickLinks;
  
  return (
    <AppLayout>
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-2xl p-8 mb-8 gradient-bg text-white">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold">Welcome, {user.name}!</h1>
            <p className="text-white/80 mt-2 max-w-xl">
              {isTeacher 
                ? "Access your teaching tools and create engaging content for your students." 
                : "Explore learning resources and activities designed to enhance your education."}
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-20 -mb-20 blur-3xl"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 dashboard-card">
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold">Quick Access</h2>
                <p className="text-sm text-slate-500">Frequently used features</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickLinks.map((link) => (
                  <Button
                    key={link.path}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center text-center justify-center space-y-3 hover:bg-slate-50 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 dashboard-card"
                    onClick={() => navigate(link.path)}
                  >
                    <div className={`w-12 h-12 rounded-full ${link.color} flex items-center justify-center`}>
                      {link.icon}
                    </div>
                    <div>
                      <div className="font-medium">{link.title}</div>
                      <div className="text-xs text-slate-500 mt-1">{link.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                {isTeacher ? "Teaching Stats" : "Learning Progress"}
              </h2>
              
              {isTeacher ? (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-4 text-slate-500">Classes</div>
                    <div className="ml-auto flex items-center">
                      <span className="font-medium">5</span>
                      <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full ml-2">
                        <div className="h-full bg-primary rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 text-slate-500">Students</div>
                    <div className="ml-auto flex items-center">
                      <span className="font-medium">87</span>
                      <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full ml-2">
                        <div className="h-full bg-primary rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 text-slate-500">Quizzes</div>
                    <div className="ml-auto flex items-center">
                      <span className="font-medium">12</span>
                      <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full ml-2">
                        <div className="h-full bg-primary rounded-full" style={{ width: '24%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 text-slate-500">Resources</div>
                    <div className="ml-auto flex items-center">
                      <span className="font-medium">24</span>
                      <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full ml-2">
                        <div className="h-full bg-primary rounded-full" style={{ width: '48%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="mr-4 text-slate-500">Quizzes</div>
                    <div className="ml-auto flex items-center">
                      <span className="font-medium">8</span>
                      <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full ml-2">
                        <div className="h-full bg-primary rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 text-slate-500">Score</div>
                    <div className="ml-auto flex items-center">
                      <span className="font-medium">78%</span>
                      <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full ml-2">
                        <div className="h-full bg-primary rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 text-slate-500">Resources</div>
                    <div className="ml-auto flex items-center">
                      <span className="font-medium">16</span>
                      <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full ml-2">
                        <div className="h-full bg-primary rounded-full" style={{ width: '53%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-4 text-slate-500">Study</div>
                    <div className="ml-auto flex items-center">
                      <span className="font-medium">14.5 hrs</span>
                      <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full ml-2">
                        <div className="h-full bg-primary rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <Button 
                className="w-full mt-8" 
                onClick={() => navigate(isTeacher ? "/reports" : "/progress")}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <DashboardRoot />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
