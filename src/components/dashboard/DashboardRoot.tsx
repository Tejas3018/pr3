
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TeacherDashboard } from './teacher/TeacherDashboard';
import { StudentDashboard } from './student/StudentDashboard';

export const DashboardRoot: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-medium">Not logged in</h2>
          <p className="text-gray-500 mt-2">Please log in to access your dashboard</p>
        </div>
      </div>
    );
  }
  
  return user.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />;
};
