
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Brain, Loader2 } from 'lucide-react';

interface Hook {
  id: string;
  title: string;
  subject: string;
  content: string;
}

const subjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 
  'History', 'Geography', 'Literature', 'Computer Science'
];

const grades = [
  'Elementary (K-5)', 'Middle School (6-8)', 'High School (9-12)', 'College'
];

const TeachingHooks = () => {
  const [hooks, setHooks] = useState<Hook[]>([
    {
      id: '1',
      title: 'The Pythagorean Mystery',
      subject: 'Mathematics',
      content: 'Start by showing students a right-angled triangle and ask them if there\'s a relationship between the sides. Then introduce the famous a² + b² = c² formula and its historical significance.'
    },
    {
      id: '2',
      title: 'Electricity in Everyday Life',
      subject: 'Physics',
      content: 'Begin the class by asking students to list all the devices they used today that require electricity. Discuss how electricity powers our modern world before diving into circuit theory.'
    }
  ]);
  
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [filter, setFilter] = useState('');
  
  // AI Hook Generator states
  const [topicInput, setTopicInput] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationType, setGenerationType] = useState<'question' | 'activity' | 'statement'>('question');
  
  const { toast } = useToast();

  const addHook = () => {
    if (!title || !subject || !content) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }
    
    const newHook = {
      id: Date.now().toString(),
      title,
      subject,
      content
    };
    
    setHooks([...hooks, newHook]);
    setTitle('');
    setSubject('');
    setContent('');
    
    toast({
      title: 'Hook added',
      description: 'Your teaching hook has been saved',
    });
  };

  const deleteHook = (id: string) => {
    setHooks(hooks.filter(hook => hook.id !== id));
    toast({
      title: 'Hook deleted',
      description: 'Teaching hook has been removed',
    });
  };

  const generateAIHook = () => {
    if (!topicInput || !selectedGrade || !selectedSubject) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in topic, grade level, and subject',
        variant: 'destructive'
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI generation - in a real app, this would call an AI API
    setTimeout(() => {
      let generatedContent = '';
      let generatedTitle = '';

      // Simple templates for demo purposes - in a real app, this would be AI-generated
      if (generationType === 'question') {
        generatedTitle = `Questioning ${topicInput}`;
        generatedContent = `Have you ever wondered how ${topicInput} impacts our daily lives? Today we'll explore this fascinating concept and discover why it's so important in ${selectedSubject}. Let's start by considering how we might apply this knowledge to solve real-world problems.`;
      } else if (generationType === 'activity') {
        generatedTitle = `Hands-on ${topicInput}`;
        generatedContent = `Let's start today's lesson with a quick activity. In pairs, I want you to ${topicInput.includes('history') ? 'create a timeline of key events' : 'draw a diagram showing the relationship between key concepts'} in ${topicInput}. You have 5 minutes, and then we'll share what we've created with the class.`;
      } else {
        generatedTitle = `The Wonder of ${topicInput}`;
        generatedContent = `${topicInput} is one of the most revolutionary concepts in ${selectedSubject}. When it was first discovered, it changed how we understand the world. Today, we'll see why this topic continues to fascinate scientists and researchers around the globe.`;
      }

      setTitle(generatedTitle);
      setSubject(selectedSubject);
      setContent(generatedContent);
      setIsGenerating(false);

      toast({
        title: 'Hook generated',
        description: 'AI has created a teaching hook for your topic',
      });
    }, 2000); // Simulate API delay
  };

  const filteredHooks = filter 
    ? hooks.filter(hook => hook.subject.toLowerCase().includes(filter.toLowerCase()))
    : hooks;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Teaching Hooks</h1>
          <p className="text-gray-500">Create and store engaging topic introductions for your classes</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AI Hook Generator</CardTitle>
            <CardDescription>
              Use AI to generate engaging hooks for your lessons based on topic and grade level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="topic">Topic</Label>
                <Input 
                  id="topic" 
                  placeholder="E.g., Photosynthesis, World War II, Quadratic Equations" 
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="grade">Grade Level</Label>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger id="grade">
                    <SelectValue placeholder="Select a grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map(grade => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="ai-subject">Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="ai-subject">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subj => (
                      <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Hook Type</Label>
                <div className="flex space-x-2 mt-1">
                  <Button 
                    type="button"
                    variant={generationType === 'question' ? 'default' : 'outline'} 
                    onClick={() => setGenerationType('question')}
                    className="flex-1"
                  >
                    Question
                  </Button>
                  <Button 
                    type="button"
                    variant={generationType === 'activity' ? 'default' : 'outline'} 
                    onClick={() => setGenerationType('activity')}
                    className="flex-1"
                  >
                    Activity
                  </Button>
                  <Button 
                    type="button"
                    variant={generationType === 'statement' ? 'default' : 'outline'} 
                    onClick={() => setGenerationType('statement')}
                    className="flex-1"
                  >
                    Statement
                  </Button>
                </div>
              </div>

              <Button 
                className="w-full"
                disabled={isGenerating}
                onClick={generateAIHook}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Generate Teaching Hook
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create New Teaching Hook</CardTitle>
            <CardDescription>
              Craft an engaging introduction to help explain concepts to your students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Hook Title</Label>
                <Input 
                  id="title" 
                  placeholder="E.g., The Pythagorean Mystery" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subj => (
                      <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="content">Hook Content</Label>
                <Textarea 
                  id="content" 
                  placeholder="Write your teaching hook here..." 
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              
              <Button onClick={addHook} className="w-full">Save Teaching Hook</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Teaching Hooks</h2>
            <div className="w-64">
              <Input 
                placeholder="Filter by subject..." 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>

          {filteredHooks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No teaching hooks found. Create your first one above!</p>
              </CardContent>
            </Card>
          ) : (
            filteredHooks.map(hook => (
              <Card key={hook.id} className="overflow-hidden">
                <CardHeader className="bg-quiz-light/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{hook.title}</CardTitle>
                      <CardDescription>Subject: {hook.subject}</CardDescription>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteHook(hook.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="whitespace-pre-wrap">{hook.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default TeachingHooks;
