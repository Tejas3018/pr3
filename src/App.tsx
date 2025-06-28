
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import QuizPage from "./pages/QuizPage";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// New pages
import TodoList from "./pages/tutor/TodoList";
import TeachingHooks from "./pages/tutor/TeachingHooks";
import ReferenceVideos from "./pages/common/ReferenceVideos";
import LecturePlanner from "./pages/tutor/LecturePlanner";
import ResearchPapers from "./pages/tutor/ResearchPapers";
import QuizGenerator from "./pages/student/QuizGenerator";
import PreviousPapers from "./pages/student/PreviousPapers";
import SearchResources from "./pages/student/SearchResources";
import CurriculumMapper from "./pages/tutor/CurriculumMapper";

import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
              {/* Tutor Routes */}
              <Route path="/todo" element={
                <ProtectedRoute requiredRole="teacher">
                  <TodoList />
                </ProtectedRoute>
              } />
              <Route path="/hooks" element={
                <ProtectedRoute requiredRole="teacher">
                  <TeachingHooks />
                </ProtectedRoute>
              } />
              <Route path="/planner" element={
                <ProtectedRoute requiredRole="teacher">
                  <LecturePlanner />
                </ProtectedRoute>
              } />
              <Route path="/research" element={
                <ProtectedRoute requiredRole="teacher">
                  <ResearchPapers />
                </ProtectedRoute>
              } />
              <Route path="/curriculum" element={
                <ProtectedRoute requiredRole="teacher">
                  <CurriculumMapper />
                </ProtectedRoute>
              } />
              
              {/* Common Routes - Quiz Generator accessible by both roles */}
              <Route path="/quizzes" element={
                <ProtectedRoute>
                  <QuizGenerator />
                </ProtectedRoute>
              } />
              <Route path="/videos" element={
                <ProtectedRoute>
                  <ReferenceVideos />
                </ProtectedRoute>
              } />
              
              {/* Student Routes */}
              <Route path="/papers" element={
                <ProtectedRoute requiredRole="student">
                  <PreviousPapers />
                </ProtectedRoute>
              } />
              <Route path="/search" element={
                <ProtectedRoute requiredRole="student">
                  <SearchResources />
                </ProtectedRoute>
              } />
              <Route path="/quiz/:quizId" element={
                <ProtectedRoute requiredRole="student">
                  <QuizPage />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
