
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Clock, Download, Loader2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type LectureTopic = {
  id: string;
  title: string;
  estimatedMinutes: number;
  complexity: 'low' | 'medium' | 'high';
  notes?: string;
};

type LectureSession = {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  topics: string[];
};

const LecturePlanner = () => {
  const { toast } = useToast();
  const [topics, setTopics] = useState<LectureTopic[]>([
    { id: '1', title: 'Introduction to Quantum Physics', estimatedMinutes: 30, complexity: 'medium' },
    { id: '2', title: 'Wave-Particle Duality', estimatedMinutes: 45, complexity: 'high' },
    { id: '3', title: 'Schrödinger Equation Basics', estimatedMinutes: 60, complexity: 'high' },
    { id: '4', title: 'Quantum Tunneling', estimatedMinutes: 30, complexity: 'medium' },
    { id: '5', title: 'Practical Applications', estimatedMinutes: 20, complexity: 'low' },
  ]);
  
  const [sessions, setSessions] = useState<LectureSession[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // New topic form states
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicMinutes, setNewTopicMinutes] = useState('');
  const [newTopicComplexity, setNewTopicComplexity] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTopicNotes, setNewTopicNotes] = useState('');
  
  // Session form states
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [sessionStartTime, setSessionStartTime] = useState('09:00');
  const [sessionEndTime, setSessionEndTime] = useState('10:30');

  // AI distribution states
  const [isDistributing, setIsDistributing] = useState(false);
  const [numberOfSessions, setNumberOfSessions] = useState('3');
  const [sessionDuration, setSessionDuration] = useState('90');
  const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);

  const addTopic = () => {
    if (!newTopicTitle || !newTopicMinutes) {
      toast({
        title: 'Missing fields',
        description: 'Please provide both title and estimated time',
        variant: 'destructive',
      });
      return;
    }

    const newTopic: LectureTopic = {
      id: Date.now().toString(),
      title: newTopicTitle,
      estimatedMinutes: parseInt(newTopicMinutes),
      complexity: newTopicComplexity,
      notes: newTopicNotes || undefined,
    };

    setTopics([...topics, newTopic]);
    
    // Reset form
    setNewTopicTitle('');
    setNewTopicMinutes('');
    setNewTopicComplexity('medium');
    setNewTopicNotes('');

    toast({
      title: 'Topic Added',
      description: `${newTopicTitle} has been added to your topics`,
    });
  };

  const deleteTopic = (id: string) => {
    setTopics(topics.filter(topic => topic.id !== id));
    toast({
      title: 'Topic Deleted',
      description: 'The topic has been removed',
    });
  };

  const addSession = () => {
    if (!selectedDate || !sessionStartTime || !sessionEndTime) {
      toast({
        title: 'Missing information',
        description: 'Please select a date and provide start/end times',
        variant: 'destructive',
      });
      return;
    }

    const newSession: LectureSession = {
      id: Date.now().toString(),
      date: selectedDate,
      startTime: sessionStartTime,
      endTime: sessionEndTime,
      topics: [],
    };

    setSessions([...sessions, newSession]);
    setIsAddingSession(false);
    
    // Reset form
    setSelectedDate(undefined);
    
    toast({
      title: 'Session Added',
      description: `New lecture session created`,
    });
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(session => session.id !== id));
    toast({
      title: 'Session Deleted',
      description: 'The lecture session has been removed',
    });
  };

  const distributeWithAI = () => {
    setIsDistributing(true);
    
    // Simulate AI processing - in a real app, this would call an API
    setTimeout(() => {
      const sessionCount = parseInt(numberOfSessions);
      const duration = parseInt(sessionDuration);
      
      // Simple algorithm to distribute topics
      let newSessions: LectureSession[] = [];
      let currentDate = new Date();
      let topicsToDistribute = [...topics];
      
      // Sort topics by complexity (high to low)
      topicsToDistribute.sort((a, b) => {
        const complexityOrder = { high: 3, medium: 2, low: 1 };
        return complexityOrder[b.complexity] - complexityOrder[a.complexity];
      });
      
      for (let i = 0; i < sessionCount; i++) {
        const sessionDate = new Date(currentDate);
        sessionDate.setDate(currentDate.getDate() + (i * 2)); // Skip a day between sessions
        
        // Calculate how many topics can fit in this session
        const sessionTopics: string[] = [];
        let remainingMinutes = duration;
        
        while (remainingMinutes > 0 && topicsToDistribute.length > 0) {
          const nextTopic = topicsToDistribute[0];
          
          if (nextTopic.estimatedMinutes <= remainingMinutes) {
            sessionTopics.push(nextTopic.id);
            remainingMinutes -= nextTopic.estimatedMinutes;
            topicsToDistribute.shift(); // Remove the topic we just used
          } else {
            break; // Can't fit more topics in this session
          }
        }
        
        // Create the session
        newSessions.push({
          id: `ai-${Date.now()}-${i}`,
          date: sessionDate,
          startTime: '09:00',
          endTime: `${9 + Math.floor(duration / 60)}:${duration % 60 === 0 ? '00' : duration % 60}`,
          topics: sessionTopics,
        });
      }
      
      setSessions(newSessions);
      setIsDistributing(false);
      setIsAIDialogOpen(false);
      
      toast({
        title: 'Sessions Distributed',
        description: `Created ${sessionCount} optimized lecture sessions`,
      });
    }, 2000);
  };

  const getTopicById = (id: string) => {
    return topics.find(topic => topic.id === id);
  };

  const getTotalSessionMinutes = (session: LectureSession) => {
    return session.topics.reduce((total, topicId) => {
      const topic = getTopicById(topicId);
      return total + (topic ? topic.estimatedMinutes : 0);
    }, 0);
  };

  const formatSessionTime = (session: LectureSession) => {
    return `${session.startTime} - ${session.endTime}`;
  };

  const formatSessionDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 
      ? `${hours} hr${hours > 1 ? 's' : ''} ${mins > 0 ? `${mins} min` : ''}`
      : `${mins} min`;
  };

  const exportTimetable = () => {
    // In a real app, this would export to PDF or similar
    toast({
      title: 'Timetable Exported',
      description: 'Your lecture timetable has been exported',
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Lecture Planner</h1>
            <p className="text-gray-500">Organize and schedule your lecture topics efficiently</p>
          </div>
          <Button onClick={exportTimetable}>
            <Download className="mr-2 h-4 w-4" />
            Export Timetable
          </Button>
        </div>

        <Tabs defaultValue="timetable">
          <TabsList>
            <TabsTrigger value="timetable">Lecture Timetable</TabsTrigger>
            <TabsTrigger value="topics">Manage Topics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timetable" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Lecture Sessions</CardTitle>
                  <CardDescription>Plan your lecture sessions and assign topics</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setIsAIDialogOpen(true)}>
                    <Brain className="mr-2 h-4 w-4" />
                    Auto-Distribute
                  </Button>
                  <Button onClick={() => setIsAddingSession(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Session
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {sessions.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
                    <Clock className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">No sessions yet</h3>
                    <p className="mt-1 text-gray-500">Create sessions manually or use auto-distribute</p>
                    <div className="mt-6 flex justify-center space-x-4">
                      <Button variant="outline" onClick={() => setIsAddingSession(true)}>
                        Add Session
                      </Button>
                      <Button onClick={() => setIsAIDialogOpen(true)}>
                        Auto-Distribute Topics
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y">
                    {sessions.sort((a, b) => a.date.getTime() - b.date.getTime()).map(session => (
                      <div key={session.id} className="py-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">
                              {session.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </h3>
                            <p className="text-sm text-gray-500">{formatSessionTime(session)}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteSession(session.id)} 
                            className="text-red-500 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                        
                        <div className="mt-2 space-y-2">
                          {session.topics.length > 0 ? (
                            <>
                              <p className="text-sm text-gray-600">Topics:</p>
                              <ul className="pl-5 list-disc text-sm space-y-1">
                                {session.topics.map(topicId => {
                                  const topic = getTopicById(topicId);
                                  return topic ? (
                                    <li key={topicId} className="text-gray-700">
                                      {topic.title} 
                                      <span className="text-gray-500 ml-2">
                                        ({formatSessionDuration(topic.estimatedMinutes)})
                                      </span>
                                    </li>
                                  ) : null;
                                })}
                              </ul>
                              <div className="flex justify-between text-sm pt-2">
                                <span>Total Session Time:</span>
                                <span className="font-medium">{formatSessionDuration(getTotalSessionMinutes(session))}</span>
                              </div>
                            </>
                          ) : (
                            <p className="text-sm italic text-gray-500">No topics assigned to this session yet</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="topics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Topic</CardTitle>
                <CardDescription>Define lecture topics with estimated time requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="topic-title">Topic Title</Label>
                    <Input 
                      id="topic-title" 
                      placeholder="E.g., Introduction to Thermodynamics"
                      value={newTopicTitle}
                      onChange={(e) => setNewTopicTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="topic-minutes">Estimated Time (minutes)</Label>
                      <Input 
                        id="topic-minutes" 
                        type="number" 
                        min="5"
                        placeholder="E.g., 45"
                        value={newTopicMinutes}
                        onChange={(e) => setNewTopicMinutes(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="topic-complexity">Topic Complexity</Label>
                      <Select 
                        value={newTopicComplexity} 
                        onValueChange={(value: 'low' | 'medium' | 'high') => setNewTopicComplexity(value)}
                      >
                        <SelectTrigger id="topic-complexity">
                          <SelectValue placeholder="Select complexity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="topic-notes">Notes (Optional)</Label>
                    <Textarea 
                      id="topic-notes" 
                      placeholder="Any additional notes about this topic..."
                      value={newTopicNotes}
                      onChange={(e) => setNewTopicNotes(e.target.value)}
                    />
                  </div>
                  
                  <Button className="w-full" onClick={addTopic}>Add Topic</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Your Topics</CardTitle>
                <CardDescription>All your defined lecture topics</CardDescription>
              </CardHeader>
              <CardContent>
                {topics.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No topics defined yet. Add some above.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topics.map(topic => (
                      <div key={topic.id} className="border rounded-md p-4">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{topic.title}</h3>
                            <div className="flex space-x-4 mt-1">
                              <span className="text-sm text-gray-500">
                                {formatSessionDuration(topic.estimatedMinutes)}
                              </span>
                              <span className={`text-sm px-2 py-0.5 rounded-full ${
                                topic.complexity === 'high' ? 'bg-red-100 text-red-800' : 
                                topic.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {topic.complexity.charAt(0).toUpperCase() + topic.complexity.slice(1)} complexity
                              </span>
                            </div>
                            {topic.notes && (
                              <p className="text-sm text-gray-600 mt-2">{topic.notes}</p>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteTopic(topic.id)} 
                            className="text-red-500 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <div className="text-sm text-gray-500">
                  Total topics: <span className="font-medium">{topics.length}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Total time: <span className="font-medium">
                    {formatSessionDuration(topics.reduce((sum, topic) => sum + topic.estimatedMinutes, 0))}
                  </span>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add Session Dialog */}
      <Dialog open={isAddingSession} onOpenChange={setIsAddingSession}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Lecture Session</DialogTitle>
            <DialogDescription>
              Create a new lecture session by selecting a date and time
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex flex-col space-y-2">
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="border rounded-md p-2"
                initialFocus
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Start Time</Label>
                <Input 
                  id="start-time" 
                  type="time"
                  value={sessionStartTime}
                  onChange={(e) => setSessionStartTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end-time">End Time</Label>
                <Input 
                  id="end-time" 
                  type="time"
                  value={sessionEndTime}
                  onChange={(e) => setSessionEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingSession(false)}>Cancel</Button>
            <Button onClick={addSession}>Add Session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* AI Distribution Dialog */}
      <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>AI Topic Distribution</DialogTitle>
            <DialogDescription>
              Automatically distribute your topics across multiple lecture sessions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="num-sessions">Number of Sessions</Label>
              <Select value={numberOfSessions} onValueChange={setNumberOfSessions}>
                <SelectTrigger id="num-sessions">
                  <SelectValue placeholder="Select number of sessions" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 8, 10].map(num => (
                    <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="session-duration">Session Duration (minutes)</Label>
              <Select value={sessionDuration} onValueChange={setSessionDuration}>
                <SelectTrigger id="session-duration">
                  <SelectValue placeholder="Select session duration" />
                </SelectTrigger>
                <SelectContent>
                  {[45, 60, 75, 90, 120, 180].map(duration => (
                    <SelectItem key={duration} value={duration.toString()}>
                      {duration} min ({Math.floor(duration/60)}h {duration%60 > 0 ? `${duration%60}m` : ''})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> The AI will distribute {topics.length} topics across {numberOfSessions} sessions,
                prioritizing more complex topics for earlier sessions.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAIDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={distributeWithAI} 
              disabled={isDistributing || topics.length === 0}
            >
              {isDistributing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Distribute Topics
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default LecturePlanner;
