
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { getClassesByTeacherId, getUserById } from '@/services/dataService';
import { Users } from 'lucide-react';

export const ClassManager: React.FC = () => {
  const { user } = useAuth();
  const classes = getClassesByTeacherId(user?.id || '');
  
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Class Manager</h2>
          <p className="text-gray-500">Manage your classes and students</p>
        </div>
        <Button>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Class
        </Button>
      </div>
      
      {classes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((cls) => {
            const studentCount = cls.studentIds.length;
            
            return (
              <Card key={cls.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users size={18} className="mr-2 text-quiz-primary" />
                    {cls.name}
                  </CardTitle>
                  <CardDescription>Grade: {cls.grade}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-1">Students: {studentCount}</div>
                    <div className="flex -space-x-2 overflow-hidden">
                      {cls.studentIds.slice(0, 5).map((studentId) => {
                        const student = getUserById(studentId);
                        const initials = student?.name.split(' ').map(n => n[0]).join('') || '?';
                        
                        return (
                          <div 
                            key={studentId}
                            className="w-8 h-8 rounded-full bg-quiz-light text-quiz-primary flex items-center justify-center border-2 border-white text-xs font-medium"
                            title={student?.name || 'Unknown student'}
                          >
                            {initials}
                          </div>
                        );
                      })}
                      {studentCount > 5 && (
                        <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center border-2 border-white text-xs">
                          +{studentCount - 5}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Manage Students</Button>
                    <Button variant="outline" size="sm">View Quizzes</Button>
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
              <Users size={30} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No classes yet</h3>
            <p className="text-gray-500 mb-4">You haven't created any classes yet.</p>
            <Button>Create Your First Class</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
