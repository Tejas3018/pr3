
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { BookOpen, Lock, User, GraduationCap } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mx-auto bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <BookOpen size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to EduConnect
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Sign in to continue learning</p>
          </div>
          
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials below to access your account
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700"
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700"
                    autoComplete="current-password"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Lock size={18} className="mr-2" />
                      Sign In
                    </span>
                  )}
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Don't have an account?{' '}
                    <Link 
                      to="/signup" 
                      className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    >
                      Create one here
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </form>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 font-medium">
              Try demo accounts:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => {
                  setEmail('smith@teacher.com');
                  setPassword('teacher123');
                }}
              >
                <GraduationCap size={16} className="mr-2" />
                Teacher Demo
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:bg-green-50 dark:hover:bg-slate-700 transition-colors"
                onClick={() => {
                  setEmail('alice@student.com');
                  setPassword('student123');
                }}
              >
                <User size={16} className="mr-2" />
                Student Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Login;
