
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, Video, FileText, Link, Filter, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'pdf' | 'website';
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  date: string;
}

const SearchResources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Mock search results for demonstration
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Introduction to Data Structures and Algorithms',
      description: 'Comprehensive guide covering arrays, linked lists, stacks, queues, and basic sorting algorithms with practical examples.',
      url: 'https://example.com/dsa-intro',
      type: 'article',
      subject: 'Computer Science',
      difficulty: 'beginner',
      date: '2024-01-15'
    },
    {
      id: '2',
      title: 'Machine Learning Fundamentals - Complete Course',
      description: 'Learn the basics of machine learning including supervised and unsupervised learning, neural networks, and practical applications.',
      url: 'https://example.com/ml-course',
      type: 'video',
      subject: 'Artificial Intelligence',
      difficulty: 'intermediate',
      date: '2024-02-10'
    },
    {
      id: '3',
      title: 'Database Design and SQL Optimization',
      description: 'Advanced techniques for database design, normalization, indexing, and query optimization for better performance.',
      url: 'https://example.com/database-design.pdf',
      type: 'pdf',
      subject: 'Database Systems',
      difficulty: 'advanced',
      date: '2024-01-28'
    },
    {
      id: '4',
      title: 'React.js Best Practices and Patterns',
      description: 'Modern React development patterns, hooks, context API, and performance optimization techniques.',
      url: 'https://example.com/react-patterns',
      type: 'website',
      subject: 'Web Development',
      difficulty: 'intermediate',
      date: '2024-03-05'
    },
    {
      id: '5',
      title: 'Cybersecurity Essentials for Beginners',
      description: 'Understanding common security threats, encryption, network security, and basic penetration testing.',
      url: 'https://example.com/cybersecurity-basics',
      type: 'article',
      subject: 'Cybersecurity',
      difficulty: 'beginner',
      date: '2024-02-20'
    }
  ];

  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Filter mock results based on search query and filters
    let filtered = mockResults.filter(result => 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Apply filters
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(result => result.subject === selectedSubject);
    }
    if (selectedType !== 'all') {
      filtered = filtered.filter(result => result.type === selectedType);
    }
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(result => result.difficulty === selectedDifficulty);
    }

    setSearchResults(filtered);
    setIsSearching(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText size={16} />;
      case 'video': return <Video size={16} />;
      case 'pdf': return <FileText size={16} />;
      case 'website': return <Link size={16} />;
      default: return <BookOpen size={16} />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Load popular resources on component mount
  useEffect(() => {
    setSearchResults(mockResults.slice(0, 3));
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Search Learning Resources
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Discover curated learning materials across all subjects
          </p>
        </div>

        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <Input
                    placeholder="Search for topics, concepts, or subjects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && performSearch()}
                    className="pl-10 h-12 text-lg border-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
                  />
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-2">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-full md:w-40 bg-white/50 dark:bg-slate-900/50">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="Artificial Intelligence">AI/ML</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full md:w-32 bg-white/50 dark:bg-slate-900/50">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="article">Articles</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="pdf">PDFs</SelectItem>
                    <SelectItem value="website">Websites</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={performSearch} 
                  disabled={isSearching || !searchQuery.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                >
                  {isSearching ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Search size={20} />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="results" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="results">Search Results</TabsTrigger>
            <TabsTrigger value="popular">Popular Resources</TabsTrigger>
            <TabsTrigger value="recent">Recently Added</TabsTrigger>
          </TabsList>
          
          <TabsContent value="results">
            {isSearching ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <Loader2 className="animate-spin mx-auto mb-4 text-blue-600" size={32} />
                  <p className="text-slate-600 dark:text-slate-400">Searching for resources...</p>
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid gap-6">
                {searchResults.map((result) => (
                  <Card key={result.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(result.type)}
                          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                            {result.title}
                          </h3>
                        </div>
                        <Badge className={getDifficultyColor(result.difficulty)}>
                          {result.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                        {result.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {result.subject}
                          </Badge>
                          <span className="text-sm text-slate-500">
                            {new Date(result.date).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                          onClick={() => window.open(result.url, '_blank')}
                        >
                          <Link size={14} className="mr-2" />
                          View Resource
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="mx-auto mb-4 text-slate-400" size={48} />
                <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  {searchQuery ? 'No results found' : 'Start your search'}
                </h3>
                <p className="text-slate-500">
                  {searchQuery 
                    ? 'Try different keywords or adjust your filters' 
                    : 'Enter a topic or subject to find learning resources'
                  }
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="popular">
            <div className="grid gap-6">
              {mockResults.slice(0, 4).map((result) => (
                <Card key={result.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(result.type)}
                        <h3 className="text-xl font-semibold">{result.title}</h3>
                      </div>
                      <Badge className={getDifficultyColor(result.difficulty)}>
                        {result.difficulty}
                      </Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">{result.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{result.subject}</Badge>
                      <Button variant="outline" onClick={() => window.open(result.url, '_blank')}>
                        <Link size={14} className="mr-2" />
                        View Resource
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recent">
            <div className="grid gap-6">
              {mockResults.slice(2).map((result) => (
                <Card key={result.id} className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(result.type)}
                        <h3 className="text-xl font-semibold">{result.title}</h3>
                      </div>
                      <Badge className={getDifficultyColor(result.difficulty)}>
                        {result.difficulty}
                      </Badge>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">{result.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{result.subject}</Badge>
                      <Button variant="outline" onClick={() => window.open(result.url, '_blank')}>
                        <Link size={14} className="mr-2" />
                        View Resource
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SearchResources;
