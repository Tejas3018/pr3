
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';

const difficulties = [
  { id: 'beginner', name: 'Beginner', description: 'Basic concepts and fundamentals' },
  { id: 'intermediate', name: 'Intermediate', description: 'Applied knowledge and problem-solving' },
  { id: 'advanced', name: 'Advanced', description: 'Complex problems and deep understanding' }
];

interface DifficultySelectorProps {
  selectedDifficulty: string;
  onDifficultyChange: (difficulty: string) => void;
}

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ 
  selectedDifficulty, 
  onDifficultyChange 
}) => {
  return (
    <div className="space-y-4">
      <Label>Select Difficulty Level</Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {difficulties.map((difficulty) => (
          <Card
            key={difficulty.id}
            className={`cursor-pointer transition-all hover:border-quiz-primary ${
              selectedDifficulty === difficulty.id ? 'border-quiz-primary bg-quiz-light/10' : ''
            }`}
            onClick={() => onDifficultyChange(difficulty.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{difficulty.name}</h4>
                {selectedDifficulty === difficulty.id && (
                  <Check className="h-4 w-4 text-quiz-primary" />
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">{difficulty.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
