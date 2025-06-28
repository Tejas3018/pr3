import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SearchX, Youtube, ExternalLink } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface Video {
  id: string;
  title: string;
  subject: string;
  description: string;
  url: string;
  youtubeUrl: string;
  uploadedBy: string;
  dateAdded: string;
  isAiGenerated?: boolean;
  duration?: string;
  views?: string;
}

const subjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 
  'History', 'Geography', 'Literature', 'Computer Science'
];

const ReferenceVideos = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isTeacher = user?.role === 'teacher';
  
  const [videos, setVideos] = useState<Video[]>([
    {
      id: '1',
      title: 'Khan Academy: Introduction to Calculus',
      subject: 'Mathematics',
      description: 'Learn the fundamentals of calculus including limits, derivatives, and integrals with clear explanations.',
      url: 'https://www.youtube.com/embed/WUvTyaaNkzM',
      youtubeUrl: 'https://www.youtube.com/watch?v=WUvTyaaNkzM',
      uploadedBy: 'Khan Academy',
      dateAdded: '2023-03-15',
      duration: '15:32',
      views: '2.1M'
    },
    {
      id: '2',
      title: 'Crash Course Biology: Cell Structure',
      subject: 'Biology',
      description: 'Comprehensive overview of cell structure and organelles with engaging animations.',
      url: 'https://www.youtube.com/embed/URUJD5NEXC8',
      youtubeUrl: 'https://www.youtube.com/watch?v=URUJD5NEXC8',
      uploadedBy: 'Crash Course',
      dateAdded: '2023-04-22',
      duration: '12:45',
      views: '1.8M'
    },
    {
      id: '3',
      title: 'MIT Physics: Classical Mechanics Lecture 1',
      subject: 'Physics',
      description: 'Introduction to classical mechanics from MIT\'s renowned physics course.',
      url: 'https://www.youtube.com/embed/pyX8kQ-JzHI',
      youtubeUrl: 'https://www.youtube.com/watch?v=pyX8kQ-JzHI',
      uploadedBy: 'MIT OpenCourseWare',
      dateAdded: '2023-05-10',
      duration: '48:30',
      views: '950K'
    },
    {
      id: '4',
      title: 'Organic Chemistry Tutor: Chemical Bonding',
      subject: 'Chemistry',
      description: 'Detailed explanation of ionic and covalent bonding with practice problems.',
      url: 'https://www.youtube.com/embed/CGA8sRwqIFg',
      youtubeUrl: 'https://www.youtube.com/watch?v=CGA8sRwqIFg',
      uploadedBy: 'The Organic Chemistry Tutor',
      dateAdded: '2023-06-01',
      duration: '32:15',
      views: '1.2M'
    }
  ]);
  
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // AI video recommendations with real YouTube videos
  const getVideoRecommendations = (topic: string): Video[] => {
    const normalizedTopic = topic.toLowerCase();
    const currentDate = new Date().toISOString().split('T')[0];
    
    const educationalVideos: Record<string, Video[]> = {
      mathematics: [
        {
          id: `ai-${Date.now()}-math-1`,
          title: '3Blue1Brown: Essence of Linear Algebra',
          subject: 'Mathematics',
          description: 'Visual and intuitive introduction to linear algebra concepts.',
          url: 'https://www.youtube.com/embed/fNk_zzaMoSs',
          youtubeUrl: 'https://www.youtube.com/watch?v=fNk_zzaMoSs',
          uploadedBy: '3Blue1Brown',
          dateAdded: currentDate,
          isAiGenerated: true,
          duration: '14:52',
          views: '4.2M'
        },
        {
          id: `ai-${Date.now()}-math-2`,
          title: 'Khan Academy: Algebra Basics',
          subject: 'Mathematics',
          description: 'Complete guide to algebra fundamentals and problem-solving techniques.',
          url: 'https://www.youtube.com/embed/NybHckSEQBI',
          youtubeUrl: 'https://www.youtube.com/watch?v=NybHckSEQBI',
          uploadedBy: 'Khan Academy',
          dateAdded: currentDate,
          isAiGenerated: true,
          duration: '18:25',
          views: '3.1M'
        }
      ],
      physics: [
        {
          id: `ai-${Date.now()}-physics-1`,
          title: 'Veritasium: Understanding Quantum Physics',
          subject: 'Physics',
          description: 'Mind-bending concepts of quantum mechanics explained clearly.',
          url: 'https://www.youtube.com/embed/MzRCDLre1b4',
          youtubeUrl: 'https://www.youtube.com/watch?v=MzRCDLre1b4',
          uploadedBy: 'Veritasium',
          dateAdded: currentDate,
          isAiGenerated: true,
          duration: '22:14',
          views: '8.5M'
        },
        {
          id: `ai-${Date.now()}-physics-2`,
          title: 'MinutePhysics: Special Relativity',
          subject: 'Physics',
          description: 'Einstein\'s theory of special relativity explained in simple terms.',
          url: 'https://www.youtube.com/embed/ajhFNcUTJI0',
          youtubeUrl: 'https://www.youtube.com/watch?v=ajhFNcUTJI0',
          uploadedBy: 'MinutePhysics',
          dateAdded: currentDate,
          isAiGenerated: true,
          duration: '4:32',
          views: '2.8M'
        }
      ],
      chemistry: [
        {
          id: `ai-${Date.now()}-chem-1`,
          title: 'NileRed: Chemical Reactions Explained',
          subject: 'Chemistry',
          description: 'Fascinating chemical reactions with detailed explanations.',
          url: 'https://www.youtube.com/embed/IrdYueB9pY4',
          youtubeUrl: 'https://www.youtube.com/watch?v=IrdYueB9pY4',
          uploadedBy: 'NileRed',
          dateAdded: currentDate,
          isAiGenerated: true,
          duration: '16:48',
          views: '5.2M'
        }
      ],
      biology: [
        {
          id: `ai-${Date.now()}-bio-1`,
          title: 'Kurzgesagt: Evolution Explained',
          subject: 'Biology',
          description: 'Beautiful animation explaining the process of evolution.',
          url: 'https://www.youtube.com/embed/hOfRN0KihOU',
          youtubeUrl: 'https://www.youtube.com/watch?v=hOfRN0KihOU',
          uploadedBy: 'Kurzgesagt',
          dateAdded: currentDate,
          isAiGenerated: true,
          duration: '12:15',
          views: '15.2M'
        }
      ],
      'computer science': [
        {
          id: `ai-${Date.now()}-cs-1`,
          title: 'CS50: Introduction to Programming',
          subject: 'Computer Science',
          description: 'Harvard\'s famous introduction to computer science and programming.',
          url: 'https://www.youtube.com/embed/jjqgP9dpD1k',
          youtubeUrl: 'https://www.youtube.com/watch?v=jjqgP9dpD1k',
          uploadedBy: 'CS50',
          dateAdded: currentDate,
          isAiGenerated: true,
          duration: '127:32',
          views: '2.1M'
        }
      ]
    };

    // Find matching videos based on topic
    for (const [key, videos] of Object.entries(educationalVideos)) {
      if (normalizedTopic.includes(key) || key.includes(normalizedTopic)) {
        return videos;
      }
    }

    // Default recommendations
    return [
      {
        id: `ai-${Date.now()}-default`,
        title: `${topic} - Educational Overview`,
        subject: guessSubject(topic),
        description: `Comprehensive introduction to ${topic} with examples and explanations.`,
        url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        uploadedBy: 'Educational Channel',
        dateAdded: currentDate,
        isAiGenerated: true,
        duration: '15:00',
        views: '1.0M'
      }
    ];
  };

  // Guess the subject based on the topic
  const guessSubject = (topic: string): string => {
    const topicLower = topic.toLowerCase();
    
    if (topicLower.includes('math') || topicLower.includes('calculus') || topicLower.includes('algebra')) {
      return 'Mathematics';
    } else if (topicLower.includes('physics') || topicLower.includes('mechanics')) {
      return 'Physics';
    } else if (topicLower.includes('chemistry') || topicLower.includes('molecule')) {
      return 'Chemistry';
    } else if (topicLower.includes('biology') || topicLower.includes('cell')) {
      return 'Biology';
    } else if (topicLower.includes('history')) {
      return 'History';
    } else if (topicLower.includes('geography') || topicLower.includes('map')) {
      return 'Geography';
    } else if (topicLower.includes('literature') || topicLower.includes('book')) {
      return 'Literature';
    } else if (topicLower.includes('computer') || topicLower.includes('code')) {
      return 'Computer Science';
    }
    
    return 'General';
  };

  // Add a new video to the list
  const addVideo = () => {
    if (!title || !subject || !description || !url) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }
    
    let videoUrl = url;
    let youtubeUrl = url;
    
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      if (videoId) {
        videoUrl = `https://www.youtube.com/embed/${videoId}`;
        youtubeUrl = url;
      }
    }
    
    const newVideo: Video = {
      id: Date.now().toString(),
      title,
      subject,
      description,
      url: videoUrl,
      youtubeUrl,
      uploadedBy: user?.name || 'Unknown',
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    setVideos([...videos, newVideo]);
    setTitle('');
    setSubject('');
    setDescription('');
    setUrl('');
    
    toast({
      title: 'Video added',
      description: 'Reference video has been added successfully',
    });
  };

  // Filter videos based on search term and subject
  const filteredVideos = videos.filter(video => {
    const matchesTerm = searchTerm === '' || 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = filterSubject === 'all' || video.subject === filterSubject;
    
    return matchesTerm && matchesSubject;
  });

  // Fixed generateAIVideos function to match Video interface
  const generateAIVideos = async (topic: string, level: string): Promise<Video[]> => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    // Simulate AI processing
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Generate AI videos that match the Video interface
    const aiGeneratedVideos: Video[] = [
      {
        id: `ai-${Date.now()}-1`,
        title: `${topic} - Complete ${level} Tutorial`,
        subject: guessSubject(topic),
        description: `Comprehensive ${level} level tutorial covering all aspects of ${topic}`,
        url: `https://www.youtube.com/embed/ai_${topic.toLowerCase().replace(/\s+/g, '_')}_${level}`,
        youtubeUrl: `https://youtube.com/watch?v=ai_${topic.toLowerCase().replace(/\s+/g, '_')}_${level}`,
        uploadedBy: 'AI EduChannel',
        dateAdded: currentDate,
        isAiGenerated: true,
        duration: '45:30',
        views: '250K'
      },
      {
        id: `ai-${Date.now()}-2`,
        title: `${topic} - Practical Examples and Applications`,
        subject: guessSubject(topic),
        description: `Real-world applications and examples of ${topic} concepts`,
        url: `https://www.youtube.com/embed/practical_${topic.toLowerCase().replace(/\s+/g, '_')}`,
        youtubeUrl: `https://youtube.com/watch?v=practical_${topic.toLowerCase().replace(/\s+/g, '_')}`,
        uploadedBy: 'Practical Learning',
        dateAdded: currentDate,
        isAiGenerated: true,
        duration: '32:15',
        views: '180K'
      }
    ];
    
    clearInterval(interval);
    setGenerationProgress(100);
    
    // Add the generated videos to the main list
    setVideos(prevVideos => [...prevVideos, ...aiGeneratedVideos]);
    
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationProgress(0);
    }, 500);
    
    toast({
      title: 'AI Videos Found!',
      description: `Found ${aiGeneratedVideos.length} videos for ${topic}`,
    });
    
    return aiGeneratedVideos;
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Reference Videos</h1>
          <p className="text-gray-500">
            {isTeacher 
              ? 'Share educational videos with your students' 
              : 'Access educational videos shared by your tutors'}
          </p>
        </div>

        <Tabs defaultValue="browse">
          <TabsList>
            <TabsTrigger value="browse">Browse Videos</TabsTrigger>
            <TabsTrigger value="ai">AI Video Finder</TabsTrigger>
            {isTeacher && <TabsTrigger value="add">Add New Video</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="browse" className="mt-6">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow"
                />
                
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(subj => (
                      <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {filteredVideos.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <SearchX size={48} className="text-gray-400 mb-4" />
                    <p className="text-gray-500">No videos found matching your criteria.</p>
                    <div className="mt-4 flex gap-4">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          const aiTabTrigger = document.querySelector('[data-value="ai"]');
                          if (aiTabTrigger instanceof HTMLElement) {
                            aiTabTrigger.click();
                          }
                        }}
                      >
                        Find videos with AI
                      </Button>
                      {isTeacher && (
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            const addTabTrigger = document.querySelector('[data-value="add"]');
                            if (addTabTrigger instanceof HTMLElement) {
                              addTabTrigger.click();
                            }
                          }}
                        >
                          Add a new video
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredVideos.map(video => (
                    <Card key={video.id} className="overflow-hidden">
                      <div className="w-full">
                        <AspectRatio ratio={16 / 9}>
                          <iframe 
                            src={video.url} 
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        </AspectRatio>
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{video.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <span>{video.subject}</span>
                              {video.duration && <span>• {video.duration}</span>}
                              {video.views && <span>• {video.views} views</span>}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2 ml-2">
                            {video.isAiGenerated && (
                              <Badge variant="secondary">AI Found</Badge>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(video.youtubeUrl || video.url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{video.description}</p>
                      </CardContent>
                      <CardFooter className="text-sm text-gray-500">
                        <div>
                          Shared by {video.uploadedBy} on {video.dateAdded}
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Video Recommendation</CardTitle>
                <CardDescription>
                  Enter a topic to get AI-curated educational video recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="ai-topic">What would you like to learn about?</Label>
                    <div className="flex gap-2">
                      <Input
                        id="ai-topic"
                        value={aiTopic}
                        onChange={(e) => setAiTopic(e.target.value)}
                        placeholder="e.g., Quantum Physics, Cell Biology, Linear Algebra"
                        disabled={isGenerating}
                      />
                      <Button 
                        onClick={() => generateAIVideos(aiTopic, 'beginner')} 
                        disabled={isGenerating || !aiTopic.trim()}
                      >
                        <Youtube className="mr-2 h-4 w-4" />
                        Find Videos
                      </Button>
                    </div>
                  </div>
                  
                  {isGenerating && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Searching for videos...</span>
                        <span>{generationProgress}%</span>
                      </div>
                      <Progress value={generationProgress} />
                    </div>
                  )}
                  
                  <div className="bg-gray-50 rounded-md p-4">
                    <h3 className="font-medium mb-2">Popular Topics:</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Linear Algebra', 'Quantum Physics', 'Organic Chemistry', 'Cell Biology', 'Machine Learning'].map(topic => (
                        <Button 
                          key={topic} 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setAiTopic(topic);
                            generateAIVideos(topic, 'beginner');
                          }}
                          disabled={isGenerating}
                        >
                          {topic}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {isTeacher && (
            <TabsContent value="add" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Reference Video</CardTitle>
                  <CardDescription>
                    Share educational videos with your students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Video Title</Label>
                      <Input 
                        id="title" 
                        placeholder="E.g., Understanding Quantum Physics" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Select value={subject} onValueChange={setSubject}>
                        <SelectTrigger id="subject">
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
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Describe what the video covers..." 
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="url">Video URL (YouTube link)</Label>
                      <Input 
                        id="url" 
                        placeholder="https://www.youtube.com/watch?v=..." 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Regular YouTube links will be converted to embed format automatically
                      </p>
                    </div>
                    
                    <Button onClick={addVideo} className="w-full">Add Reference Video</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default ReferenceVideos;
