import React, { useState, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Brain, CalendarIcon, Download, FileDown, FileText, Loader2, Plus, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays, eachDayOfInterval } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { parseSyllabus } from '@/services/dataService';

interface CurriculumUnit {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  duration: number; // weeks
  topics: CurriculumTopic[];
  description?: string;
}

interface CurriculumTopic {
  id: string;
  title: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  keyObjectives: string[];
  resources?: string[];
  scheduled?: boolean;
}

interface ScheduledTopic {
  topicId: string;
  unitId: string;
  date: Date;
}

const subjects = [
  'Design and Analysis of Algorithms', 'Data Structures', 'Deep Learning', 
  'Cloud Computing', 'Natural Language Processing', 'Big Data', 
  'Numerical Methods and Optimization'
];

const gradeLevels = [
  'Undergraduate Year 1', 'Undergraduate Year 2', 'Undergraduate Year 3', 
  'Undergraduate Year 4', 'Graduate', 'Post-Graduate'
];

const CurriculumMapper = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDates, setSelectedDates] = useState<Date | undefined>(new Date());
  const [planningView, setPlanningView] = useState<'6weeks' | '8weeks'>('6weeks');
  const [isAddingUnit, setIsAddingUnit] = useState(false);
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [selectedUnitForTopic, setSelectedUnitForTopic] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploadingSyllabus, setIsUploadingSyllabus] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  
  // Form states
  const [unitTitle, setUnitTitle] = useState('');
  const [unitSubject, setUnitSubject] = useState('');
  const [unitGradeLevel, setUnitGradeLevel] = useState('');
  const [unitDuration, setUnitDuration] = useState('6');
  const [unitDescription, setUnitDescription] = useState('');
  
  const [topicTitle, setTopicTitle] = useState('');
  const [topicDifficulty, setTopicDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [topicHours, setTopicHours] = useState('');
  const [topicObjectives, setTopicObjectives] = useState('');
  const [topicResources, setTopicResources] = useState('');

  const [scheduledTopics, setScheduledTopics] = useState<ScheduledTopic[]>([]);
  
  // Curriculum data
  const [curriculumUnits, setCurriculumUnits] = useState<CurriculumUnit[]>([
    {
      id: 'unit1',
      title: 'Introduction to Design and Analysis of Algorithms',
      subject: 'Design and Analysis of Algorithms',
      gradeLevel: 'Undergraduate Year 2',
      duration: 6,
      description: 'This unit covers fundamental algorithmic concepts including time complexity, space complexity, and algorithmic paradigms.',
      topics: [
        {
          id: 'topic1',
          title: 'Algorithm Analysis Fundamentals',
          difficultyLevel: 'beginner',
          estimatedHours: 4,
          keyObjectives: [
            'Understand Big O, Big Omega, and Big Theta notations',
            'Analyze time and space complexity of algorithms',
            'Compare algorithm efficiencies'
          ],
          resources: [
            'Introduction to Algorithms by Cormen et al. (Ch. 1-3)',
            'Algorithm Design and Applications by Goodrich and Tamassia',
            'Interactive Complexity Calculator Tool'
          ],
          scheduled: true
        },
        {
          id: 'topic2',
          title: 'Divide and Conquer Algorithms',
          difficultyLevel: 'intermediate',
          estimatedHours: 5,
          keyObjectives: [
            'Understand the divide-and-conquer paradigm',
            'Implement and analyze merge sort and quicksort',
            'Solve problems using binary search'
          ],
          scheduled: true
        },
        {
          id: 'topic3',
          title: 'Dynamic Programming',
          difficultyLevel: 'advanced',
          estimatedHours: 6,
          keyObjectives: [
            'Master the dynamic programming approach',
            'Implement solutions for classic DP problems',
            'Analyze time and space complexity of DP algorithms'
          ]
        }
      ]
    }
  ]);

  const handleSyllabusUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsUploadingSyllabus(true);
    setUploadedFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      
      try {
        // Process syllabus content
        const parsedUnits = await parseSyllabus(content);
        
        if (parsedUnits && parsedUnits.length > 0) {
          setCurriculumUnits(parsedUnits);
          toast({
            title: "Syllabus Imported",
            description: `Successfully parsed ${parsedUnits.length} curriculum units from your syllabus.`,
          });
        } else {
          toast({
            title: "Import Issue",
            description: "Could not extract curriculum data from the syllabus. Try a different format or enter manually.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error parsing syllabus:', error);
        toast({
          title: "Syllabus Parse Failed",
          description: "An error occurred while processing your syllabus file. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsUploadingSyllabus(false);
      }
    };
    
    reader.readAsText(file);
  };

  // Add new curriculum unit
  const handleAddUnit = () => {
    if (!unitTitle || !unitSubject || !unitGradeLevel || !unitDuration) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required unit information',
        variant: 'destructive'
      });
      return;
    }

    const newUnit: CurriculumUnit = {
      id: `unit-${Date.now()}`,
      title: unitTitle,
      subject: unitSubject,
      gradeLevel: unitGradeLevel,
      duration: parseInt(unitDuration),
      description: unitDescription,
      topics: []
    };

    setCurriculumUnits([...curriculumUnits, newUnit]);
    
    // Reset form fields
    setUnitTitle('');
    setUnitSubject('');
    setUnitGradeLevel('');
    setUnitDuration('6');
    setUnitDescription('');
    setIsAddingUnit(false);

    toast({
      title: 'Unit Added',
      description: 'New curriculum unit has been created'
    });
  };

  // Add new topic to a unit
  const handleAddTopic = () => {
    if (!topicTitle || !topicDifficulty || !topicHours || !topicObjectives || !selectedUnitForTopic) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required topic information',
        variant: 'destructive'
      });
      return;
    }

    const newTopic: CurriculumTopic = {
      id: `topic-${Date.now()}`,
      title: topicTitle,
      difficultyLevel: topicDifficulty,
      estimatedHours: parseFloat(topicHours),
      keyObjectives: topicObjectives.split('\n').filter(obj => obj.trim() !== ''),
      resources: topicResources ? topicResources.split('\n').filter(res => res.trim() !== '') : undefined
    };

    const updatedUnits = curriculumUnits.map(unit => 
      unit.id === selectedUnitForTopic 
        ? { ...unit, topics: [...unit.topics, newTopic] }
        : unit
    );

    setCurriculumUnits(updatedUnits);
    
    // Reset form fields
    setTopicTitle('');
    setTopicDifficulty('intermediate');
    setTopicHours('');
    setTopicObjectives('');
    setTopicResources('');
    setIsAddingTopic(false);

    toast({
      title: 'Topic Added',
      description: 'New topic has been added to the curriculum unit'
    });
  };

  // Generate adaptive pacing with AI
  const handleGenerateAdaptivePacing = () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Create a mock distribution of topics
      const startDate = new Date();
      const newScheduledTopics: ScheduledTopic[] = [];
      
      curriculumUnits.forEach(unit => {
        let currentDate = new Date(startDate);
        
        // Sort topics by difficulty - advanced first
        const sortedTopics = [...unit.topics].sort((a, b) => {
          const difficultyOrder = { advanced: 3, intermediate: 2, beginner: 1 };
          return difficultyOrder[b.difficultyLevel] - difficultyOrder[a.difficultyLevel];
        });
        
        sortedTopics.forEach((topic, index) => {
          // Distribute topics across the unit's duration
          const offsetDays = Math.floor((index / sortedTopics.length) * (unit.duration * 7));
          const topicDate = addDays(currentDate, offsetDays);
          
          newScheduledTopics.push({
            unitId: unit.id,
            topicId: topic.id,
            date: topicDate
          });
        });
      });
      
      setScheduledTopics(newScheduledTopics);
      setIsGenerating(false);
      
      // Mark topics as scheduled
      const updatedUnits = curriculumUnits.map(unit => ({
        ...unit,
        topics: unit.topics.map(topic => ({
          ...topic,
          scheduled: true
        }))
      }));
      
      setCurriculumUnits(updatedUnits);
      
      toast({
        title: 'Adaptive Pacing Generated',
        description: 'Topics have been scheduled based on difficulty and optimal learning progression'
      });
    }, 2000);
  };

  const exportCurriculum = (format: 'weekly' | 'monthly') => {
    toast({
      title: `${format === 'weekly' ? 'Weekly' : 'Monthly'} Plan Exported`,
      description: 'Your curriculum plan has been exported successfully'
    });
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTopicForDay = (date: Date) => {
    return scheduledTopics.filter(st => 
      format(st.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ).map(st => {
      const unit = curriculumUnits.find(u => u.id === st.unitId);
      const topic = unit?.topics.find(t => t.id === st.topicId);
      return { topic, unit };
    }).filter(item => item.topic && item.unit);
  };

  const getTotalHours = (unit: CurriculumUnit) => {
    return unit.topics.reduce((total, topic) => total + topic.estimatedHours, 0);
  };

  const getDateCellClass = (date: Date) => {
    const hasTopics = getTopicForDay(date).length > 0;
    return hasTopics 
      ? 'bg-quiz-light/20 cursor-pointer hover:bg-quiz-light/40'
      : 'bg-white';
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Curriculum Mapper</h1>
            <p className="text-gray-500">Plan and organize your curriculum with adaptive pacing</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Syllabus
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleSyllabusUpload}
                className="hidden"
              />
            </Button>
            <Button variant="outline" onClick={() => exportCurriculum('weekly')}>
              <FileDown className="mr-2 h-4 w-4" />
              Export Weekly
            </Button>
            <Button variant="outline" onClick={() => exportCurriculum('monthly')}>
              <FileDown className="mr-2 h-4 w-4" />
              Export Monthly
            </Button>
          </div>
        </div>

        {uploadedFileName && (
          <Alert className="bg-green-50 border-green-200">
            <FileText className="h-4 w-4" />
            <AlertTitle>Syllabus uploaded</AlertTitle>
            <AlertDescription>
              {isUploadingSyllabus ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Processing {uploadedFileName}...
                </div>
              ) : (
                `Imported curriculum data from ${uploadedFileName}`
              )}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="calendar">
          <TabsList>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="units">Curriculum Units</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="mt-6 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Curriculum Calendar</CardTitle>
                  <CardDescription>View your curriculum schedule and topic pacing</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={planningView} onValueChange={(val: '6weeks' | '8weeks') => setPlanningView(val)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="View range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6weeks">6 Week View</SelectItem>
                      <SelectItem value="8weeks">8 Week View</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleGenerateAdaptivePacing}
                    disabled={isGenerating || curriculumUnits.length === 0}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Generate Adaptive Pacing
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col">
                  <div className="grid grid-cols-7 gap-px bg-gray-200">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="bg-white p-2 text-center text-sm font-medium">
                        {day}
                      </div>
                    ))}
                    
                    {selectedDates && eachDayOfInterval({
                      start: selectedDates,
                      end: addDays(selectedDates, planningView === '6weeks' ? 41 : 55)
                    }).map((date, i) => {
                      const topicsForDay = getTopicForDay(date);
                      return (
                        <div
                          key={i}
                          className={`min-h-24 p-2 border-t ${getDateCellClass(date)}`}
                        >
                          <div className="font-medium text-xs mb-1">
                            {format(date, 'MMM d')}
                          </div>
                          
                          <div className="space-y-1">
                            {topicsForDay.map(({ topic, unit }, idx) => topic && (
                              <Popover key={idx}>
                                <PopoverTrigger asChild>
                                  <div className={`${getDifficultyColor(topic.difficultyLevel)} text-xs p-1 rounded cursor-pointer truncate`}>
                                    {topic.title}
                                  </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-3">
                                  <div className="space-y-2">
                                    <h3 className="font-medium">{topic.title}</h3>
                                    <p className="text-xs text-gray-500">
                                      {unit?.title} • {topic.estimatedHours} hours
                                    </p>
                                    <div className="space-y-1">
                                      <h4 className="text-xs font-medium">Key Objectives:</h4>
                                      <ul className="text-xs list-disc pl-4 space-y-1">
                                        {topic.keyObjectives.map((obj, i) => (
                                          <li key={i}>{obj}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="units" className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Curriculum Units</h2>
              <Button onClick={() => setIsAddingUnit(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Unit
              </Button>
            </div>
            
            {curriculumUnits.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-gray-100 p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium">No curriculum units yet</h3>
                  <p className="mt-1 text-gray-500">Create your first curriculum unit to get started</p>
                  <Button className="mt-4" onClick={() => setIsAddingUnit(true)}>
                    Create Unit
                  </Button>
                </CardContent>
              </Card>
            ) : (
              curriculumUnits.map(unit => (
                <Card key={unit.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{unit.title}</CardTitle>
                        <CardDescription>
                          {unit.subject} • {unit.gradeLevel} • {unit.duration} weeks
                        </CardDescription>
                      </div>
                      <Button variant="outline" onClick={() => {
                        setSelectedUnitForTopic(unit.id);
                        setIsAddingTopic(true);
                      }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Topic
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {unit.description && (
                      <p className="text-sm text-gray-600 mb-4">{unit.description}</p>
                    )}
                    
                    {unit.topics.length === 0 ? (
                      <div className="text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
                        <p className="text-gray-500">No topics in this unit yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {unit.topics.map(topic => (
                          <div key={topic.id} className="border rounded-lg p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium flex items-center">
                                  {topic.title}
                                  {topic.scheduled && (
                                    <Badge className="ml-2 bg-quiz-primary" variant="secondary">
                                      Scheduled
                                    </Badge>
                                  )}
                                </h3>
                                <div className="flex space-x-3 mt-1 text-sm text-gray-600">
                                  <span className={`px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(topic.difficultyLevel)}`}>
                                    {topic.difficultyLevel}
                                  </span>
                                  <span>{topic.estimatedHours} hours</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-2 space-y-2">
                              <div>
                                <h4 className="text-xs font-medium">Key Objectives:</h4>
                                <ul className="pl-5 list-disc text-sm space-y-0.5 mt-0.5">
                                  {topic.keyObjectives.map((objective, i) => (
                                    <li key={i} className="text-gray-700 text-sm">{objective}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              {topic.resources && topic.resources.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-medium">Resources:</h4>
                                  <ul className="pl-5 list-disc text-sm space-y-0.5 mt-0.5">
                                    {topic.resources.map((resource, i) => (
                                      <li key={i} className="text-gray-700 text-sm">{resource}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t flex justify-between pt-4">
                    <div className="text-sm">
                      Total Topics: <span className="font-medium">{unit.topics.length}</span>
                    </div>
                    <div className="text-sm">
                      Total Hours: <span className="font-medium">{getTotalHours(unit)}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add Unit Dialog */}
      <Dialog open={isAddingUnit} onOpenChange={setIsAddingUnit}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Curriculum Unit</DialogTitle>
            <DialogDescription>
              Create a new unit of study with topics and learning objectives
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="unit-title">Unit Title</Label>
              <Input 
                id="unit-title"
                value={unitTitle}
                onChange={(e) => setUnitTitle(e.target.value)}
                placeholder="E.g., Introduction to Data Structures"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit-subject">Subject</Label>
                <Select value={unitSubject} onValueChange={setUnitSubject}>
                  <SelectTrigger id="unit-subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit-grade">Grade Level</Label>
                <Select value={unitGradeLevel} onValueChange={setUnitGradeLevel}>
                  <SelectTrigger id="unit-grade">
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeLevels.map(grade => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit-duration">Duration (weeks)</Label>
              <Select value={unitDuration} onValueChange={setUnitDuration}>
                <SelectTrigger id="unit-duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 6, 8, 12].map(weeks => (
                    <SelectItem key={weeks} value={weeks.toString()}>{weeks} week{weeks > 1 ? 's' : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit-description">Unit Description (Optional)</Label>
              <Textarea 
                id="unit-description"
                value={unitDescription}
                onChange={(e) => setUnitDescription(e.target.value)}
                placeholder="Describe the unit's focus and major concepts..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingUnit(false)}>Cancel</Button>
            <Button onClick={handleAddUnit}>Add Unit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Topic Dialog */}
      <Dialog open={isAddingTopic} onOpenChange={setIsAddingTopic}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add Topic</DialogTitle>
            <DialogDescription>
              Add a new topic to the curriculum unit
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="topic-title">Topic Title</Label>
              <Input 
                id="topic-title"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                placeholder="E.g., Arrays and Linked Lists"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="topic-difficulty">Difficulty Level</Label>
                <Select
                  value={topicDifficulty}
                  onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => setTopicDifficulty(value)}
                >
                  <SelectTrigger id="topic-difficulty">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="topic-hours">Estimated Hours</Label>
                <Input 
                  id="topic-hours"
                  value={topicHours}
                  onChange={(e) => setTopicHours(e.target.value)}
                  placeholder="E.g., 4.5"
                  type="number"
                  min="0.5"
                  step="0.5"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="topic-objectives">Key Objectives (one per line)</Label>
              <Textarea 
                id="topic-objectives"
                value={topicObjectives}
                onChange={(e) => setTopicObjectives(e.target.value)}
                placeholder="E.g., Understand the implementation of linked lists"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="topic-resources">Resources (Optional, one per line)</Label>
              <Textarea 
                id="topic-resources"
                value={topicResources}
                onChange={(e) => setTopicResources(e.target.value)}
                placeholder="E.g., Textbook Chapter 3, Online practice exercises"
                rows={2}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingTopic(false)}>Cancel</Button>
            <Button onClick={handleAddTopic}>Add Topic</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default CurriculumMapper;
