import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, FileText, Loader2, Search } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  url: string;
  publicationDate: string;
  source: string;
  isBookmarked: boolean;
  importanceRating?: number;
  aiSummary?: string;
  keyPoints?: string[];
}

const ResearchPapers = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSource, setSearchSource] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const [papers, setPapers] = useState<ResearchPaper[]>([
    {
      id: '1',
      title: 'Deep Learning Approaches to Educational Content Generation: A Comprehensive Review',
      authors: ['Sarah Johnson', 'Michael Chen'],
      abstract: 'This paper reviews current deep learning models and their applications in generating educational content for various subjects and grade levels. We examine neural network architectures and their effectiveness in creating accurate and pedagogically sound learning materials.',
      url: 'https://example.com/paper1',
      publicationDate: '2023-11-15',
      source: 'arXiv',
      isBookmarked: true,
    },
    {
      id: '2',
      title: 'Student Engagement Patterns in Online Learning Environments',
      authors: ['David Wilson', 'Rebecca Taylor', 'James Anderson'],
      abstract: 'This study analyzes engagement patterns of 1,500 students across different online learning platforms. We identify key factors that influence student participation and provide recommendations for designing more engaging virtual classrooms.',
      url: 'https://example.com/paper2',
      publicationDate: '2023-08-22',
      source: 'Semantic Scholar',
      isBookmarked: false,
    },
  ]);

  const search = () => {
    if (!searchQuery.trim()) {
      toast({
        title: 'Empty Search Query',
        description: 'Please enter a search term',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSearching(true);
    
    // Simulating API call to academic databases
    setTimeout(() => {
      // Mock results - in a real app, these would come from the API
      const newResults: ResearchPaper[] = [
        {
          id: `search-${Date.now()}-1`,
          title: `Recent Advances in ${searchQuery}: Educational Applications`,
          authors: ['Alexandra Smith', 'Robert Chen'],
          abstract: `This paper explores recent developments in ${searchQuery} and their implications for educational settings. Through a series of experiments in classroom environments, we demonstrate how these advances can enhance learning outcomes across multiple age groups.`,
          url: 'https://example.com/paper-new-1',
          publicationDate: '2024-01-10',
          source: 'arXiv',
          isBookmarked: false,
        },
        {
          id: `search-${Date.now()}-2`,
          title: `Pedagogical Frameworks for Teaching ${searchQuery} in Secondary Education`,
          authors: ['Michael Rodriguez', 'Emma Williams'],
          abstract: `We present a comprehensive review of pedagogical approaches for introducing ${searchQuery} concepts to secondary school students. Our analysis covers both traditional and innovative teaching methodologies, with a focus on their effectiveness for different learning styles.`,
          url: 'https://example.com/paper-new-2',
          publicationDate: '2023-12-05',
          source: 'Semantic Scholar',
          isBookmarked: false,
        },
        {
          id: `search-${Date.now()}-3`,
          title: `Assessment Strategies for ${searchQuery}-Based Learning Activities`,
          authors: ['Jennifer Lee', 'Thomas Brown'],
          abstract: `This research examines various assessment strategies suitable for evaluating student performance in ${searchQuery}-centered educational activities. We propose a flexible assessment framework that addresses both knowledge acquisition and practical skill development.`,
          url: 'https://example.com/paper-new-3',
          publicationDate: '2023-11-18',
          source: 'ERIC',
          isBookmarked: false,
        },
      ];
      
      // Filter by source if needed
      const filteredResults = searchSource === 'all' 
        ? newResults 
        : newResults.filter(paper => paper.source.toLowerCase() === searchSource.toLowerCase());
      
      // Add new papers to the list
      setPapers([...filteredResults, ...papers]);
      setIsSearching(false);
      
      toast({
        title: 'Search Complete',
        description: `Found ${filteredResults.length} papers matching your query`,
      });
    }, 1500);
  };

  const toggleBookmark = (id: string) => {
    setPapers(papers.map(paper => 
      paper.id === id ? { ...paper, isBookmarked: !paper.isBookmarked } : paper
    ));
    
    const paper = papers.find(p => p.id === id);
    if (paper) {
      toast({
        title: paper.isBookmarked ? 'Removed from Bookmarks' : 'Added to Bookmarks',
        description: `"${paper.title.substring(0, 40)}..." has been ${paper.isBookmarked ? 'removed from' : 'added to'} your bookmarks`,
      });
    }
  };

  const generateAISummary = (paper: ResearchPaper) => {
    setIsSummarizing(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      // Generate mock summary and key points
      const updatedPaper: ResearchPaper = {
        ...paper,
        aiSummary: `This paper provides a comprehensive analysis of ${paper.title.split(':')[0].toLowerCase()}. The authors present compelling evidence that supports new approaches to teaching this topic, particularly highlighting the effectiveness of interactive methods combined with traditional instruction. The research methodology involves a mixed-methods approach, combining quantitative surveys with qualitative classroom observations across multiple educational settings.`,
        keyPoints: [
          'Introduces a novel framework for integrating this topic into curriculum design',
          'Demonstrates 27% improvement in student comprehension compared to traditional methods',
          'Provides practical implementation guidelines for various educational contexts',
          'Addresses common misconceptions and learning barriers in this subject area',
          'Suggests future research directions focusing on long-term retention assessment'
        ],
        importanceRating: Math.floor(Math.random() * 3) + 3, // Random rating between 3-5
      };
      
      setPapers(papers.map(p => p.id === paper.id ? updatedPaper : p));
      setSelectedPaper(updatedPaper);
      setIsSummarizing(false);
      
      toast({
        title: 'AI Summary Generated',
        description: 'Key points and summary have been extracted from the paper',
      });
    }, 2000);
  };

  const viewPaperDetails = (paper: ResearchPaper) => {
    setSelectedPaper(paper);
    setIsDetailModalOpen(true);
    
    // If no AI summary exists, generate one
    if (!paper.aiSummary && !isSummarizing) {
      generateAISummary(paper);
    }
  };

  const bookmarkedPapers = papers.filter(paper => paper.isBookmarked);
  
  const renderStarRating = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map(star => (
          <svg
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Research Papers</h1>
          <p className="text-gray-500">Find, summarize, and organize academic research relevant to your teaching</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Find Research Papers</CardTitle>
            <CardDescription>Search academic databases for relevant papers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow">
                  <Input
                    placeholder="Search academic papers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && search()}
                  />
                </div>
                
                <Select value={searchSource} onValueChange={setSearchSource}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="arxiv">arXiv</SelectItem>
                    <SelectItem value="semantic scholar">Semantic Scholar</SelectItem>
                    <SelectItem value="eric">ERIC</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={search} 
                  disabled={isSearching}
                  className="min-w-[120px]"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Papers</TabsTrigger>
            <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="space-y-4">
              {papers.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">No papers found</h3>
                    <p className="mt-1 text-gray-500">Search academic databases to find research papers</p>
                  </CardContent>
                </Card>
              ) : (
                papers.map(paper => (
                  <Card key={paper.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center space-x-2">
                            <CardTitle className="text-lg">{paper.title}</CardTitle>
                            {renderStarRating(paper.importanceRating)}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {paper.authors.join(', ')} • {paper.publicationDate} • {paper.source}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(paper.id)}
                          className={paper.isBookmarked ? 'text-quiz-primary' : 'text-gray-400'}
                        >
                          {paper.isBookmarked ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                            </svg>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 line-clamp-3">{paper.abstract}</p>
                      
                      {paper.keyPoints && (
                        <div className="mt-3">
                          <p className="text-sm font-medium">Key Points:</p>
                          <ul className="pl-5 list-disc text-sm space-y-1 mt-1">
                            {paper.keyPoints.slice(0, 2).map((point, i) => (
                              <li key={i} className="text-gray-700">{point}</li>
                            ))}
                            {paper.keyPoints.length > 2 && (
                              <li className="text-gray-500 italic">...and {paper.keyPoints.length - 2} more points</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => viewPaperDetails(paper)}
                      >
                        View Details
                      </Button>
                      
                      {!paper.aiSummary && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={isSummarizing}
                          onClick={() => generateAISummary(paper)}
                        >
                          {isSummarizing && paper.id === selectedPaper?.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Brain className="mr-2 h-4 w-4" />
                              AI Analyze
                            </>
                          )}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="bookmarked" className="mt-6">
            <div className="space-y-4">
              {bookmarkedPapers.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-12 w-12 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium">No bookmarked papers</h3>
                    <p className="mt-1 text-gray-500">Save papers for quick access</p>
                  </CardContent>
                </Card>
              ) : (
                bookmarkedPapers.map(paper => (
                  <Card key={paper.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center space-x-2">
                            <CardTitle className="text-lg">{paper.title}</CardTitle>
                            {renderStarRating(paper.importanceRating)}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {paper.authors.join(', ')} • {paper.publicationDate} • {paper.source}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(paper.id)}
                          className="text-quiz-primary"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                          </svg>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {paper.aiSummary ? (
                        <p className="text-sm text-gray-700 line-clamp-3">{paper.aiSummary}</p>
                      ) : (
                        <p className="text-sm text-gray-700 line-clamp-3">{paper.abstract}</p>
                      )}
                      
                      {paper.keyPoints && (
                        <div className="mt-3">
                          <p className="text-sm font-medium">Key Points:</p>
                          <ul className="pl-5 list-disc text-sm space-y-1 mt-1">
                            {paper.keyPoints.slice(0, 2).map((point, i) => (
                              <li key={i} className="text-gray-700">{point}</li>
                            ))}
                            {paper.keyPoints.length > 2 && (
                              <li className="text-gray-500 italic">...and {paper.keyPoints.length - 2} more points</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => viewPaperDetails(paper)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Paper Details Dialog */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          {selectedPaper && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedPaper.title}</DialogTitle>
                <DialogDescription>
                  {selectedPaper.authors.join(', ')} • {selectedPaper.publicationDate} • {selectedPaper.source}
                </DialogDescription>
              </DialogHeader>
              
              <ScrollArea className="max-h-[60vh] pr-4">
                <div className="space-y-4 py-4">
                  <div>
                    <h3 className="text-sm font-medium">Abstract</h3>
                    <p className="mt-1 text-sm text-gray-700">{selectedPaper.abstract}</p>
                  </div>
                  
                  {selectedPaper.aiSummary ? (
                    <>
                      <Separator />
                      
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-sm font-medium">AI-Generated Summary</h3>
                          {renderStarRating(selectedPaper.importanceRating)}
                          {selectedPaper.importanceRating && (
                            <span className="text-sm ml-2">
                              ({selectedPaper.importanceRating}/5 relevance)
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-gray-700">{selectedPaper.aiSummary}</p>
                      </div>
                      
                      {selectedPaper.keyPoints && (
                        <div>
                          <h3 className="text-sm font-medium">Key Points</h3>
                          <ul className="pl-5 list-disc text-sm space-y-1 mt-1">
                            {selectedPaper.keyPoints.map((point, i) => (
                              <li key={i} className="text-gray-700">{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="bg-gray-50 p-3 rounded-md">
                        <h3 className="text-sm font-medium mb-1">Teaching Context</h3>
                        <p className="text-sm text-gray-700">
                          This research would be particularly valuable for classroom applications involving 
                          active learning strategies. Consider incorporating the findings when designing 
                          group activities or assessment methods for intermediate to advanced students.
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-center py-6">
                      <Button
                        onClick={() => generateAISummary(selectedPaper)}
                        disabled={isSummarizing}
                      >
                        {isSummarizing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing Paper...
                          </>
                        ) : (
                          <>
                            <Brain className="mr-2 h-4 w-4" />
                            Generate AI Summary
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <DialogFooter className="flex items-center justify-between sm:justify-between">
                <Button
                  variant={selectedPaper.isBookmarked ? "default" : "outline"}
                  onClick={() => toggleBookmark(selectedPaper.id)}
                >
                  {selectedPaper.isBookmarked ? 'Bookmarked' : 'Add to Bookmarks'}
                </Button>
                <Button
                  variant="default"
                  onClick={() => window.open(selectedPaper.url, '_blank', 'noopener,noreferrer')}
                >
                  View Original Paper
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default ResearchPapers;
