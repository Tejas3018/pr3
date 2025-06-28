
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ListTodo, 
  FileText, 
  Video, 
  Calendar, 
  GraduationCap, 
  LayoutDashboard, 
  Search, 
  CheckSquare, 
  LogOut,
  BookOpen,
  BookText,
  FileTextIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export const SidebarNav: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);

  if (!user) return null;

  const tutorLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/todo', label: 'To-Do List', icon: <ListTodo size={18} /> },
    { to: '/hooks', label: 'Teaching Hooks', icon: <GraduationCap size={18} /> },
    { to: '/videos', label: 'Reference Videos', icon: <Video size={18} /> },
    { to: '/planner', label: 'Lecture Planner', icon: <Calendar size={18} /> },
    { to: '/curriculum', label: 'Curriculum Mapper', icon: <BookOpen size={18} /> },
    { to: '/research', label: 'Research Papers', icon: <FileTextIcon size={18} /> },
    { to: '/quizzes', label: 'Quiz Generator', icon: <CheckSquare size={18} /> },
  ];

  const studentLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/quizzes', label: 'Quiz Generator', icon: <CheckSquare size={18} /> },
    { to: '/papers', label: 'Previous Papers', icon: <FileText size={18} /> },
    { to: '/videos', label: 'Reference Videos', icon: <Video size={18} /> },
    { to: '/search', label: 'Search Resources', icon: <Search size={18} /> },
  ];

  const links = user.role === 'teacher' ? tutorLinks : studentLinks;
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
        {(!isMobile || isOpen) && (
          <h2 className="font-medium text-primary">
            {user.role === 'teacher' ? 'Tutor Portal' : 'Student Portal'}
          </h2>
        )}
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleSidebar} 
          className="ml-auto"
        >
          {isOpen ? <ChevronLeftIcon size={18} /> : <ChevronRightIcon size={18} />}
        </Button>
      </div>
      
      {(!isMobile || isOpen) && (
        <>
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <p className="font-medium text-sm">{user.name}</p>
            <div className="text-xs text-slate-500 mt-0.5">
              {user.role === 'teacher' ? 'Computer Science Department' : 'Computer Science'}
            </div>
          </div>
          
          <nav className="flex-grow p-3 overflow-y-auto">
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => 
                      cn(
                        "sidebar-link",
                        isActive ? "sidebar-link-active" : "sidebar-link-inactive"
                      )
                    }
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    <span className="mr-3 text-primary">{link.icon}</span>
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-3 border-t border-slate-200 dark:border-slate-800">
            <Button 
              variant="ghost" 
              className="sidebar-link sidebar-link-inactive w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-3 text-primary" />
              Sign Out
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
