
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Search, Upload, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface Paper {
  id: string;
  title: string;
  subject: string;
  year: string;
  type: string;
  fileUrl: string;
  pages: number;
  uploadedBy?: string;
  dateUploaded?: string;
}

const subjects = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 
  'History', 'English Literature', 'Computer Science',
  'Economics', 'Psychology', 'Geography'
];

const years = ['2024', '2023', '2022', '2021', '2020', '2019'];
const types = ['Final Exam', 'Midterm', 'Quiz', 'Assignment', 'Practice Test'];

const PreviousPapers = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterType, setFilterType] = useState('all');
  
  // Upload form states
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSubject, setUploadSubject] = useState('');
  const [uploadYear, setUploadYear] = useState('');
  const [uploadType, setUploadType] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [papers, setPapers] = useState<Paper[]>([
    {
      id: 'p1',
      title: 'Calculus Final Examination',
      subject: 'Mathematics',
      year: '2023',
      type: 'Final Exam',
      fileUrl: '/papers/calculus-final-2023.pdf',
      pages: 8
    },
    {
      id: 'p2',
      title: 'Physics Midterm Test',
      subject: 'Physics',
      year: '2023',
      type: 'Midterm',
      fileUrl: '/papers/physics-midterm-2023.pdf',
      pages: 6
    },
    {
      id: 'p3',
      title: 'Introduction to Literature Quiz',
      subject: 'English Literature',
      year: '2022',
      type: 'Quiz',
      fileUrl: '/papers/literature-quiz-2022.pdf',
      pages: 3
    },
    {
      id: 'p4',
      title: 'Data Structures and Algorithms Final',
      subject: 'Computer Science',
      year: '2024',
      type: 'Final Exam',
      fileUrl: '/papers/algorithms-final-2024.pdf',
      pages: 12
    },
    {
      id: 'p5',
      title: 'Organic Chemistry Practice Test',
      subject: 'Chemistry',
      year: '2023',
      type: 'Practice Test',
      fileUrl: '/papers/organic-chem-practice-2023.pdf',
      pages: 10,
      uploadedBy: 'Sarah Wilson',
      dateUploaded: '2024-01-15'
    },
  ]);

  const filteredPapers = papers.filter(paper => {
    const matchesTerm = searchTerm === '' || 
      paper.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = filterSubject === 'all' || paper.subject === filterSubject;
    const matchesYear = filterYear === 'all' || paper.year === filterYear;
    const matchesType = filterType === 'all' || paper.type === filterType;
    
    return matchesTerm && matchesSubject && matchesYear && matchesType;
  });

  const downloadPaper = (paper: Paper) => {
    // In a real application, this would trigger a file download
    toast({
      title: 'Download started',
      description: `Downloading ${paper.title}`,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload PDF files or images only',
          variant: 'destructive'
        });
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please upload files smaller than 10MB',
          variant: 'destructive'
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const uploadPaper = async () => {
    if (!uploadTitle || !uploadSubject || !uploadYear || !uploadType || !selectedFile) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields and select a file',
        variant: 'destructive'
      });
      return;
    }

    // Simulate file upload
    const newPaper: Paper = {
      id: `upload-${Date.now()}`,
      title: uploadTitle,
      subject: uploadSubject,
      year: uploadYear,
      type: uploadType,
      fileUrl: URL.createObjectURL(selectedFile), // In real app, this would be a server URL
      pages: Math.floor(Math.random() * 15) + 1, // Simulated page count
      uploadedBy: user?.name || 'Anonymous',
      dateUploaded: new Date().toISOString().split('T')[0]
    };

    setPapers(prev => [newPaper, ...prev]);
    
    // Reset form
    setUploadTitle('');
    setUploadSubject('');
    setUploadYear('');
    setUploadType('');
    setUploadDescription('');
    setSelectedFile(null);
    
    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    toast({
      title: 'Paper uploaded successfully',
      description: 'Your paper has been shared with other students',
    });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Previous Year Papers</h1>
          <p className="text-gray-500">Access, download, and share past papers for practice and revision</p>
        </div>

        <Tabs defaultValue="browse">
          <TabsList>
            <TabsTrigger value="browse">Browse Papers</TabsTrigger>
            <TabsTrigger value="upload">Upload Paper</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Search and Filter</CardTitle>
                <CardDescription>Find the papers you need for your studies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <div className="relative">
                      <Input
                        placeholder="Search papers by title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                      />
                      <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <Select value={filterSubject} onValueChange={setFilterSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex gap-2">
                    <Select value={filterYear} onValueChange={setFilterYear}>
                      <SelectTrigger className="flex-grow">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {years.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="flex-grow">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {types.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Available Papers ({filteredPapers.length})</h2>
              
              {filteredPapers.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-center">No papers found matching your criteria.</p>
                    <p className="text-gray-500 text-center mt-1">Try adjusting your filters or search term.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredPapers.map(paper => (
                  <Card key={paper.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex items-center justify-center md:w-1/6">
                        <FileText className="h-12 w-12 text-blue-600" />
                      </div>
                      
                      <div className="p-6 flex-grow md:flex md:items-center md:justify-between">
                        <div className="md:flex-grow">
                          <h3 className="font-medium text-lg">{paper.title}</h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              {paper.subject}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              {paper.year}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                              {paper.type}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100">
                              {paper.pages} pages
                            </span>
                          </div>
                          {paper.uploadedBy && (
                            <p className="text-sm text-gray-500 mt-2">
                              Uploaded by {paper.uploadedBy} on {paper.dateUploaded}
                            </p>
                          )}
                        </div>
                        
                        <Button 
                          onClick={() => downloadPaper(paper)} 
                          className="mt-4 md:mt-0 w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                          <Download className="mr-2" size={16} />
                          Download
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Previous Paper</CardTitle>
                <CardDescription>
                  Share your previous year papers with other students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="upload-title">Paper Title *</Label>
                      <Input 
                        id="upload-title"
                        placeholder="e.g., Advanced Calculus Final Exam" 
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="upload-subject">Subject *</Label>
                      <Select value={uploadSubject} onValueChange={setUploadSubject}>
                        <SelectTrigger id="upload-subject">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map(subject => (
                            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="upload-year">Year *</Label>
                      <Select value={uploadYear} onValueChange={setUploadYear}>
                        <SelectTrigger id="upload-year">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="upload-type">Paper Type *</Label>
                      <Select value={uploadType} onValueChange={setUploadType}>
                        <SelectTrigger id="upload-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {types.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="upload-description">Description (Optional)</Label>
                    <Textarea 
                      id="upload-description"
                      placeholder="Additional notes about this paper..."
                      rows={3}
                      value={uploadDescription}
                      onChange={(e) => setUploadDescription(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="file-upload">Upload File *</Label>
                    <div className="mt-2">
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".pdf,image/*"
                        onChange={handleFileChange}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Accepted formats: PDF, Images (JPG, PNG). Max size: 10MB
                      </p>
                      {selectedFile && (
                        <p className="text-sm text-green-600 mt-2">
                          Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    onClick={uploadPaper} 
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    disabled={!uploadTitle || !uploadSubject || !uploadYear || !uploadType || !selectedFile}
                  >
                    <Upload className="mr-2" size={16} />
                    Upload Paper
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default PreviousPapers;
