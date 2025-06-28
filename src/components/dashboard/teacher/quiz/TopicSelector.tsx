
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

const commonTopics = [
  { 
    id: 'daa',
    name: 'Design and Analysis of Algorithms',
    subjects: ['Algorithm Analysis', 'Divide and Conquer', 'Dynamic Programming', 'Greedy Algorithms', 'Graph Algorithms', 'Computational Complexity']
  },
  {
    id: 'ds',
    name: 'Data Structures',
    subjects: ['Arrays and Linked Lists', 'Stacks and Queues', 'Trees and Graphs', 'Hash Tables', 'Heaps', 'Advanced Data Structures']
  },
  {
    id: 'dl',
    name: 'Deep Learning',
    subjects: ['Neural Networks', 'Convolutional Networks', 'Recurrent Networks', 'Transformers', 'Generative Models', 'Reinforcement Learning']
  },
  {
    id: 'cc',
    name: 'Cloud Computing',
    subjects: ['Virtualization', 'Containers', 'Microservices', 'Serverless Computing', 'Cloud Security', 'Distributed Systems']
  },
  {
    id: 'nlp',
    name: 'Natural Language Processing',
    subjects: ['Text Processing', 'Language Models', 'Named Entity Recognition', 'Sentiment Analysis', 'Machine Translation', 'Question Answering']
  },
  {
    id: 'bd',
    name: 'Big Data',
    subjects: ['Hadoop', 'Spark', 'NoSQL Databases', 'Data Warehousing', 'Stream Processing', 'Data Mining']
  },
  {
    id: 'nmot',
    name: 'Numerical Methods and Optimization',
    subjects: ['Linear Programming', 'Gradient Descent', 'Numerical Integration', 'Interpolation', 'Root Finding', 'Differential Equations']
  }
];

interface TopicSelectorProps {
  selectedTopic: string;
  onTopicChange: (topic: string) => void;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({ selectedTopic, onTopicChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="customTopic">Custom Topic</Label>
        <Input
          id="customTopic"
          placeholder="Enter a custom topic..."
          value={selectedTopic}
          onChange={(e) => onTopicChange(e.target.value)}
        />
      </div>
      
      <div className="mt-6">
        <Label>Or choose from common topics:</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {commonTopics.map((topic) => (
            <Card
              key={topic.id}
              className={`cursor-pointer transition-all hover:border-quiz-primary ${
                selectedTopic === topic.name ? 'border-quiz-primary bg-quiz-light/10' : ''
              }`}
              onClick={() => onTopicChange(topic.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{topic.name}</h4>
                  {selectedTopic === topic.name && (
                    <Check className="h-4 w-4 text-quiz-primary" />
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  {topic.subjects.join(' · ')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
