import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { getClassesByTeacherId, saveQuiz, saveQuestion } from '@/services/dataService';
import { generateRealQuizQuestions, getAIStudyRecommendations } from '@/services/aiQuestionService';
import { useAuth } from '@/contexts/AuthContext';
import { Question, Quiz } from '@/types/quiz.types';
import { Loader2, Sparkles, PenLine, Plus, Check, Brain, Lightbulb } from 'lucide-react';
import { TopicSelector } from './quiz/TopicSelector';
import { DifficultySelector } from './quiz/DifficultySelector';
import { QuizSettings } from './quiz/QuizSettings';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

export const QuizGenerator: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [quizSaved, setQuizSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('ai');
  const [studyRecommendations, setStudyRecommendations] = useState<string[]>([]);
  
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [grade, setGrade] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [timeLimit, setTimeLimit] = useState(10);
  const [focusKeywords, setFocusKeywords] = useState('');
  const [questionTypes, setQuestionTypes] = useState<('multiple-choice' | 'true-false' | 'short-answer')[]>(['multiple-choice', 'true-false', 'short-answer']);
  
  // Manual question creation state
  const [manualQuestions, setManualQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [questionType, setQuestionType] = useState<'multiple-choice' | 'true-false' | 'short-answer'>('multiple-choice');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [explanation, setExplanation] = useState('');
  
  const classes = getClassesByTeacherId(user?.id || '');
  
  const handleGenerateQuiz = async () => {
    if (!topic || !grade) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in the topic and grade level.",
      });
      return;
    }
    
    setIsGenerating(true);
    setQuizSaved(false);
    
    try {
      // Generate real questions using AI service
      const questions = await generateRealQuizQuestions({
        topic,
        difficulty: difficulty as 'beginner' | 'intermediate' | 'advanced',
        questionCount,
        questionTypes,
        grade,
        focusKeywords
      });
      
      setGeneratedQuestions(questions);
      
      // Get AI study recommendations
      const recommendations = await getAIStudyRecommendations(topic, difficulty);
      setStudyRecommendations(recommendations);
      
      toast({
        title: "Real questions generated!",
        description: `Successfully created ${questions.length} authentic questions about ${topic} using AI.`,
      });
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Failed to generate quiz questions. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleAddManualQuestion = () => {
    if (!currentQuestion) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter a question.",
      });
      return;
    }
    
    if (questionType === 'multiple-choice' && options.some(opt => !opt)) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all options.",
      });
      return;
    }
    
    if (!correctAnswer) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide the correct answer.",
      });
      return;
    }

    const newQuestion: Question = {
      id: `q-manual-${Date.now()}-${manualQuestions.length}`,
      text: currentQuestion,
      type: questionType,
      difficulty: difficulty as any,
      topicId: `topic-${Date.now()}`,
      correctAnswer,
      explanation,
    };

    if (questionType === 'multiple-choice') {
      newQuestion.options = [...options];
    }
    
    saveQuestion(newQuestion);
    setManualQuestions([...manualQuestions, newQuestion]);
    
    // Reset form
    setCurrentQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer('');
    setExplanation('');
    
    toast({
      title: "Question added",
      description: "Your question has been added to the quiz.",
    });
  };
  
  const handleUpdateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  const handleSaveQuiz = () => {
    if (!quizTitle) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide a title for your quiz.",
      });
      return;
    }
    
    const questionsToSave = activeTab === 'ai' ? generatedQuestions : manualQuestions;
    
    if (questionsToSave.length === 0) {
      toast({
        variant: "destructive",
        title: "No questions",
        description: "Please generate or create questions first.",
      });
      return;
    }
    
    try {
      const newQuiz: Quiz = {
        id: `quiz-${Date.now()}`,
        title: quizTitle,
        description: quizDescription,
        createdBy: user?.id || '',
        dateCreated: new Date().toISOString(),
        timeLimit: timeLimit,
        topicIds: [questionsToSave[0].topicId],
        questionIds: questionsToSave.map(q => q.id),
        classIds: selectedClassId ? [selectedClassId] : [],
        isPublished: false
      };
      
      saveQuiz(newQuiz);
      setQuizSaved(true);
      
      toast({
        title: "Quiz saved!",
        description: "Your quiz has been saved. You can now publish it for your students.",
      });
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast({
        variant: "destructive",
        title: "Save failed",
        description: "Failed to save quiz. Please try again.",
      });
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI-Powered Quiz Generator
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Create engaging quizzes with real questions powered by artificial intelligence</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Brain size={24} className="mr-3 text-blue-600" />
              Create Quiz Questions
            </CardTitle>
            <CardDescription className="text-base">
              Customize your quiz settings and generate real questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quizTitle">Quiz Title</Label>
                <Input
                  id="quizTitle"
                  placeholder="Enter a title for your quiz"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  className="bg-white/70 dark:bg-slate-800/70"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quizDescription">Quiz Description</Label>
                <Textarea
                  id="quizDescription"
                  placeholder="Enter a description for your quiz (optional)"
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                  rows={3}
                  className="bg-white/70 dark:bg-slate-800/70"
                />
              </div>
            </div>

            <TopicSelector
              selectedTopic={topic}
              onTopicChange={setTopic}
            />
            
            <DifficultySelector
              selectedDifficulty={difficulty}
              onDifficultyChange={setDifficulty}
            />
            
            <QuizSettings
              questionCount={questionCount}
              onQuestionCountChange={setQuestionCount}
              timeLimit={timeLimit}
              onTimeLimitChange={setTimeLimit}
              grade={grade}
              onGradeChange={setGrade}
            />
            
            <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg">
              <h3 className="font-medium flex items-center text-blue-700 dark:text-blue-300">
                <Sparkles size={18} className="mr-2" />
                AI Enhancement Options
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="focusKeywords">Focus Keywords (Optional)</Label>
                <Textarea
                  id="focusKeywords"
                  placeholder="Enter specific terms or concepts to focus on, separated by commas..."
                  value={focusKeywords}
                  onChange={(e) => setFocusKeywords(e.target.value)}
                  rows={2}
                  className="bg-white/70 dark:bg-slate-800/70"
                />
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  AI will prioritize these concepts when generating real questions
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="classSelect">Assign to class (optional)</Label>
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger id="classSelect" className="bg-white/70 dark:bg-slate-800/70">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ai" className="flex items-center">
                  <Brain size={16} className="mr-2" />
                  AI Generation
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex items-center">
                  <PenLine size={16} className="mr-2" />
                  Manual Creation
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="ai" className="mt-4 space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg">
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                    🤖 <strong>AI-Powered Question Generation</strong>
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Generate authentic, curriculum-aligned questions based on real educational content and best practices.
                  </p>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 h-12 text-lg"
                  onClick={handleGenerateQuiz}
                  disabled={isGenerating || !topic || !grade}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={20} className="mr-2 animate-spin" />
                      Generating Real Questions...
                    </>
                  ) : (
                    <>
                      <Brain size={20} className="mr-2" />
                      Generate Real Quiz Questions
                    </>
                  )}
                </Button>
              </TabsContent>
              
              <TabsContent value="manual" className="mt-4 space-y-4">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Create your own questions manually.
                </div>
                
                <div className="space-y-4 border rounded-md p-4 bg-white/50 dark:bg-slate-800/50">
                  <div className="space-y-2">
                    <Label htmlFor="questionText">Question Text</Label>
                    <Textarea
                      id="questionText"
                      placeholder="Enter your question..."
                      value={currentQuestion}
                      onChange={(e) => setCurrentQuestion(e.target.value)}
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="questionType">Question Type</Label>
                    <Select 
                      value={questionType} 
                      onValueChange={(value) => setQuestionType(value as any)}
                    >
                      <SelectTrigger id="questionType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                        <SelectItem value="true-false">True/False</SelectItem>
                        <SelectItem value="short-answer">Short Answer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {questionType === 'multiple-choice' && (
                    <div className="space-y-3">
                      <Label>Options</Label>
                      {options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Input
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleUpdateOption(index, e.target.value)}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            className={correctAnswer === option ? 'bg-green-50 border-green-500' : ''}
                            onClick={() => setCorrectAnswer(option)}
                            disabled={!option}
                          >
                            {correctAnswer === option ? (
                              <Check size={16} className="text-green-500" />
                            ) : (
                              'Correct'
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {questionType === 'true-false' && (
                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <RadioGroup 
                        value={correctAnswer} 
                        onValueChange={setCorrectAnswer} 
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="true" />
                          <Label htmlFor="true">True</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="false" />
                          <Label htmlFor="false">False</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                  
                  {questionType === 'short-answer' && (
                    <div className="space-y-2">
                      <Label htmlFor="correctShortAnswer">Correct Answer</Label>
                      <Input
                        id="correctShortAnswer"
                        placeholder="Enter the correct answer..."
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="explanation">Explanation (Optional)</Label>
                    <Textarea
                      id="explanation"
                      placeholder="Explain why this answer is correct..."
                      value={explanation}
                      onChange={(e) => setExplanation(e.target.value)}
                      rows={2}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleAddManualQuestion}
                    className="w-full"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Question
                  </Button>
                </div>
                
                {manualQuestions.length > 0 && (
                  <div className="rounded-md border p-4 bg-white/50 dark:bg-slate-800/50">
                    <h3 className="font-medium mb-2">{manualQuestions.length} Questions Added</h3>
                    <ul className="space-y-1">
                      {manualQuestions.map((q, index) => (
                        <li key={q.id} className="text-sm text-slate-600 dark:text-slate-400">
                          {index + 1}. {q.text.substring(0, 50)}{q.text.length > 50 ? '...' : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 h-12 text-lg"
              onClick={handleSaveQuiz}
              disabled={quizSaved || !quizTitle || (activeTab === 'ai' ? generatedQuestions.length === 0 : manualQuestions.length === 0)}
            >
              {quizSaved ? (
                <>
                  <Check size={20} className="mr-2" />
                  Quiz Saved Successfully
                </>
              ) : (
                <>
                  <Check size={20} className="mr-2" />
                  Save Quiz
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50 dark:from-slate-900 dark:to-purple-950/20">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Brain size={20} className="mr-2 text-purple-600" />
                {activeTab === 'ai' ? 'AI Generated Questions' : 'Your Questions'}
              </CardTitle>
              <CardDescription>
                {activeTab === 'ai' ? (
                  generatedQuestions.length > 0 
                    ? `${generatedQuestions.length} authentic questions about "${topic}" generated by AI`
                    : "Real questions will appear here after AI generation"
                ) : (
                  manualQuestions.length > 0
                    ? `${manualQuestions.length} questions created manually`
                    : "Your questions will appear here"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto">
              {activeTab === 'ai' ? (
                isGenerating ? (
                  <div className="flex flex-col items-center justify-center p-8">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <Brain className="absolute inset-0 m-auto text-blue-600" size={24} />
                    </div>
                    <p className="text-blue-600 font-medium mt-4">AI is generating real questions...</p>
                    <p className="text-sm text-slate-500 mt-2">Creating authentic educational content</p>
                  </div>
                ) : generatedQuestions.length > 0 ? (
                  <div className="space-y-4">
                    {generatedQuestions.map((question, index) => (
                      <div key={question.id} className="border rounded-lg p-4 bg-white/50 dark:bg-slate-800/50">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-lg">Question {index + 1}</h3>
                          <div className="flex space-x-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {question.type.replace('-', ' ')}
                            </Badge>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700">
                              {question.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <p className="mb-3 text-slate-700 dark:text-slate-300 leading-relaxed">{question.text}</p>
                        
                        {question.type === 'multiple-choice' && question.options && (
                          <div className="space-y-2 mb-3">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center">
                                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${option === question.correctAnswer ? 'bg-green-100 border-green-500' : 'border-slate-300'}`}>
                                  {option === question.correctAnswer && (
                                    <Check size={12} className="text-green-600" />
                                  )}
                                </div>
                                <span className={option === question.correctAnswer ? 'text-green-700 font-medium' : 'text-slate-600 dark:text-slate-400'}>
                                  {option}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {question.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border-l-4 border-blue-400">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              <span className="font-medium">Explanation:</span> {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Brain className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                    <p className="text-lg font-medium">No questions yet</p>
                    <p className="text-sm mt-2">Fill in the form and click "Generate Real Quiz Questions"</p>
                  </div>
                )
              ) : (
                manualQuestions.length > 0 ? (
                  <div className="space-y-4">
                    {manualQuestions.map((question, index) => (
                      <div key={question.id} className="border rounded-md p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Question {index + 1}</h3>
                          <span className="bg-quiz-light text-quiz-primary text-xs font-medium px-2 py-1 rounded-full">
                            {question.type}
                          </span>
                        </div>
                        <p className="mt-2">{question.text}</p>
                        
                        {question.type === 'multiple-choice' && question.options && (
                          <div className="mt-2 space-y-2">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center">
                                <div className={`w-5 h-5 rounded-full border mr-2 flex items-center justify-center ${option === question.correctAnswer ? 'bg-green-100 border-green-500' : 'border-gray-300'}`}>
                                  {option === question.correctAnswer && (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <span className={option === question.correctAnswer ? 'text-green-700 font-medium' : ''}>
                                  {option}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {question.type === 'true-false' && (
                          <div className="mt-2 flex items-center space-x-4">
                            <div className={`flex items-center ${question.correctAnswer === 'true' ? 'text-green-700 font-medium' : ''}`}>
                              <div className={`w-5 h-5 rounded-full border mr-2 flex items-center justify-center ${question.correctAnswer === 'true' ? 'bg-green-100 border-green-500' : 'border-gray-300'}`}>
                                {question.correctAnswer === 'true' && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <span>True</span>
                            </div>
                            <div className={`flex items-center ${question.correctAnswer === 'false' ? 'text-green-700 font-medium' : ''}`}>
                              <div className={`w-5 h-5 rounded-full border mr-2 flex items-center justify-center ${question.correctAnswer === 'false' ? 'bg-green-100 border-green-500' : 'border-gray-300'}`}>
                                {question.correctAnswer === 'false' && (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <span>False</span>
                            </div>
                          </div>
                        )}
                        
                        {question.explanation && (
                          <div className="mt-3 text-sm text-gray-600 border-t pt-2">
                            <span className="font-medium">Explanation:</span> {question.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No questions yet</p>
                    <p className="text-sm mt-2">Create questions using the form on the left</p>
                  </div>
                )
              )}
            </CardContent>
          </Card>

          {/* AI Study Recommendations */}
          {studyRecommendations.length > 0 && (
            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Lightbulb size={20} className="mr-2 text-amber-600" />
                  AI Study Recommendations
                </CardTitle>
                <CardDescription>
                  Suggestions to help students master this topic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {studyRecommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-sm text-slate-700 dark:text-slate-300">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
