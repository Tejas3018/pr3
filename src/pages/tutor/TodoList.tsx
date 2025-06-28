
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckSquare, Trash2, Calendar as CalendarIcon, Bell } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: Date;
  calendarEventId?: string;
  reminderSet: boolean;
}

const TodoList = () => {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: '1', text: 'Prepare lecture notes for Math class', completed: false, reminderSet: false },
    { id: '2', text: 'Grade physics assignments', completed: true, reminderSet: false },
    { id: '3', text: 'Record video for online class', completed: false, reminderSet: false },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);
  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [reminderTime, setReminderTime] = useState("1day");
  const { toast } = useToast();
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);

  // Simulate Google Calendar authentication
  const authenticateGoogle = () => {
    // In a real app, this would redirect to Google OAuth flow
    setTimeout(() => {
      setIsGoogleAuthenticated(true);
      toast({
        title: "Google Calendar Connected",
        description: "Your Google Calendar account is now connected.",
      });
    }, 1000);
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const newItem: TodoItem = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      reminderSet: false
    };
    setTodos([...todos, newItem]);
    setNewTodo('');
    toast({
      title: 'Task added',
      description: 'New task has been added to your list',
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast({
      title: 'Task removed',
      description: 'Task has been removed from your list',
    });
  };

  const openCalendarDialog = (todo: TodoItem) => {
    setSelectedTodo(todo);
    setSelectedDate(todo.dueDate || new Date());
    setIsCalendarDialogOpen(true);
  };

  const addToCalendar = () => {
    if (!selectedTodo || !selectedDate) return;
    
    // In a real app, this would call Google Calendar API
    const updatedTodos = todos.map(todo => 
      todo.id === selectedTodo.id 
        ? { 
            ...todo, 
            dueDate: selectedDate, 
            calendarEventId: `event-${Date.now()}` 
          } 
        : todo
    );
    
    setTodos(updatedTodos);
    setIsCalendarDialogOpen(false);
    
    toast({
      title: 'Added to Calendar',
      description: `"${selectedTodo.text}" has been added to your calendar for ${format(selectedDate, 'PPP')}`,
    });
  };

  const toggleReminder = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, reminderSet: !todo.reminderSet } 
        : todo
    ));

    const todo = todos.find(t => t.id === id);
    if (todo) {
      toast({
        title: todo.reminderSet ? 'Reminder Removed' : 'Reminder Set',
        description: todo.reminderSet 
          ? `Reminders for "${todo.text}" have been removed` 
          : `You will be reminded about "${todo.text}" before the due date`,
      });
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">To-Do List</h1>
          <p className="text-gray-500">Manage your teaching tasks and stay organized with Google Calendar integration</p>
        </div>

        {!isGoogleAuthenticated && (
          <Card>
            <CardHeader>
              <CardTitle>Connect Google Calendar</CardTitle>
              <CardDescription>
                Connect your Google Calendar to sync tasks and set reminders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={authenticateGoogle}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                Connect Google Calendar
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-grow">
                <Input 
                  placeholder="Enter a new task..." 
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTodo()}
                />
              </div>
              <Button onClick={addTodo}>Add Task</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todos.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No tasks yet. Add some tasks to get started!</p>
              ) : (
                todos.map(todo => (
                  <div 
                    key={todo.id}
                    className={`flex items-center justify-between p-3 border rounded-md ${
                      todo.completed ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <button 
                        onClick={() => toggleTodo(todo.id)}
                        className={`w-5 h-5 rounded mr-3 flex items-center justify-center ${
                          todo.completed ? 'bg-quiz-primary text-white' : 'border border-gray-300'
                        }`}
                      >
                        {todo.completed && <CheckSquare size={16} />}
                      </button>
                      <div className="flex flex-col">
                        <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                          {todo.text}
                        </span>
                        {todo.dueDate && (
                          <span className="text-xs text-gray-500">
                            Due: {format(todo.dueDate, 'PPP')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-gray-500"
                        disabled={!isGoogleAuthenticated}
                        onClick={() => openCalendarDialog(todo)}
                      >
                        <CalendarIcon size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={todo.reminderSet ? "text-quiz-primary" : "text-gray-500"}
                        disabled={!isGoogleAuthenticated || !todo.dueDate}
                        onClick={() => toggleReminder(todo.id)}
                      >
                        <Bell size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteTodo(todo.id)}
                      >
                        <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isCalendarDialogOpen} onOpenChange={setIsCalendarDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add to Calendar</DialogTitle>
            <DialogDescription>
              Select a due date to add this task to your calendar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col space-y-2">
              <Label>Task</Label>
              <p className="text-sm">{selectedTodo?.text}</p>
            </div>
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
            <div className="flex flex-col space-y-2">
              <Label>Set Reminder</Label>
              <Select value={reminderTime} onValueChange={setReminderTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reminder time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30min">30 minutes before</SelectItem>
                  <SelectItem value="1hour">1 hour before</SelectItem>
                  <SelectItem value="1day">1 day before</SelectItem>
                  <SelectItem value="2days">2 days before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCalendarDialogOpen(false)}>Cancel</Button>
            <Button onClick={addToCalendar}>Add to Calendar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default TodoList;
