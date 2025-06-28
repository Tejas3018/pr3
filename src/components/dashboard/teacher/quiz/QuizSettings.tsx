
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QuizSettingsProps {
  questionCount: number;
  onQuestionCountChange: (count: number) => void;
  timeLimit: number;
  onTimeLimitChange: (time: number) => void;
  grade: string;
  onGradeChange: (grade: string) => void;
}

export const QuizSettings: React.FC<QuizSettingsProps> = ({
  questionCount,
  onQuestionCountChange,
  timeLimit,
  onTimeLimitChange,
  grade,
  onGradeChange
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Number of Questions: {questionCount}</Label>
          <Slider
            value={[questionCount]}
            min={1}
            max={20}
            step={1}
            onValueChange={(values) => onQuestionCountChange(values[0])}
            className="mt-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            Recommended: 5-10 questions for a balanced quiz
          </p>
        </div>

        <div>
          <Label>Time Limit: {timeLimit} minutes</Label>
          <Slider
            value={[timeLimit]}
            min={5}
            max={60}
            step={5}
            onValueChange={(values) => onTimeLimitChange(values[0])}
            className="mt-2"
          />
          <p className="text-sm text-gray-500 mt-1">
            Suggested: {Math.round(timeLimit / questionCount)} minutes per question
          </p>
        </div>

        <div className="space-y-2">
          <Label>Grade Level</Label>
          <Select value={grade} onValueChange={onGradeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select grade level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Elementary (1-5)">Elementary (Grades 1-5)</SelectItem>
              <SelectItem value="Middle School (6-8)">Middle School (Grades 6-8)</SelectItem>
              <SelectItem value="High School (9-12)">High School (Grades 9-12)</SelectItem>
              <SelectItem value="College">College Level</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
