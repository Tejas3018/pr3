
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppLayout } from '@/components/layout/AppLayout';
import { BookOpen, UserPlus, ArrowRight, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    grade: '',
    subject: '',
    institution: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'Passwords do not match. Please try again.',
        variant: 'destructive'
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Weak Password',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate signup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Account Created!',
        description: 'Your account has been successfully created. Please sign in to continue.',
      });
      
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Signup Failed',
        description: 'There was an error creating your account. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[90vh] py-8">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <BookOpen size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Join EduConnect
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Create your account and start your learning journey
            </p>
          </div>
          
          <Card className="shadow-xl border-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>
                Fill in your details to get started
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSignup}>
              <CardContent className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <UserPlus size={20} className="mr-2 text-blue-600" />
                    Personal Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        className="bg-white/50 dark:bg-slate-800/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="bg-white/50 dark:bg-slate-800/50"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                        className="bg-white/50 dark:bg-slate-800/50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        required
                        className="bg-white/50 dark:bg-slate-800/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Account Type</h3>
                  <RadioGroup 
                    value={formData.role} 
                    onValueChange={(value) => handleInputChange('role', value)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg bg-white/30 dark:bg-slate-800/30">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">Student</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Take quizzes and track your progress
                          </p>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-4 border rounded-lg bg-white/30 dark:bg-slate-800/30">
                      <RadioGroupItem value="teacher" id="teacher" />
                      <Label htmlFor="teacher" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">Teacher</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Create quizzes and manage classes
                          </p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Additional Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.role === 'student' ? (
                      <div className="space-y-2">
                        <Label htmlFor="grade">Grade Level</Label>
                        <Select value={formData.grade} onValueChange={(value) => handleInputChange('grade', value)}>
                          <SelectTrigger className="bg-white/50 dark:bg-slate-800/50">
                            <SelectValue placeholder="Select your grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="elementary">Elementary (K-5)</SelectItem>
                            <SelectItem value="middle">Middle School (6-8)</SelectItem>
                            <SelectItem value="high">High School (9-12)</SelectItem>
                            <SelectItem value="college">College/University</SelectItem>
                            <SelectItem value="graduate">Graduate Studies</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="subject">Primary Subject</Label>
                        <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                          <SelectTrigger className="bg-white/50 dark:bg-slate-800/50">
                            <SelectValue placeholder="Select your subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="computer-science">Computer Science</SelectItem>
                            <SelectItem value="mathematics">Mathematics</SelectItem>
                            <SelectItem value="physics">Physics</SelectItem>
                            <SelectItem value="chemistry">Chemistry</SelectItem>
                            <SelectItem value="biology">Biology</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="history">History</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution (Optional)</Label>
                      <Input
                        id="institution"
                        type="text"
                        placeholder="Your school or university"
                        value={formData.institution}
                        onChange={(e) => handleInputChange('institution', e.target.value)}
                        className="bg-white/50 dark:bg-slate-800/50"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Check size={20} className="mr-2" />
                      Create Account
                    </span>
                  )}
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Signup;
