
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@/types/quiz.types';
import { authenticateUser, getUserById } from '@/services/dataService';
import { useToast } from '@/components/ui/use-toast';

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for existing session
    const userId = localStorage.getItem('quizAppUserId');
    if (userId) {
      const foundUser = getUserById(userId);
      if (foundUser) {
        setUser(foundUser);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const authenticatedUser = authenticateUser(email, password);
      
      if (authenticatedUser) {
        setUser(authenticatedUser);
        localStorage.setItem('quizAppUserId', authenticatedUser.id);
        toast({
          title: "Login successful!",
          description: `Welcome back, ${authenticatedUser.name}!`,
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
        });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('quizAppUserId');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
