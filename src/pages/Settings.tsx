
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { User, Bell, Shield, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    emailNotifications: true,
    quizReminders: true,
    performanceUpdates: false,
    shareProgress: true,
    publicProfile: false,
    darkMode: false,
    language: 'English'
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleSwitchChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-500 mt-2">Manage your account preferences and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input 
                  id="name" 
                  value={settings.name}
                  onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input 
                  id="email" 
                  type="email" 
                  value={settings.email}
                  onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <Button className="w-full" onClick={handleSaveProfile}>Save Changes</Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Control how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email notifications</p>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <Switch 
                  checked={settings.emailNotifications}
                  onCheckedChange={(value) => handleSwitchChange('emailNotifications', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Quiz reminders</p>
                  <p className="text-sm text-gray-500">Get notified about upcoming quizzes</p>
                </div>
                <Switch 
                  checked={settings.quizReminders}
                  onCheckedChange={(value) => handleSwitchChange('quizReminders', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Performance updates</p>
                  <p className="text-sm text-gray-500">Weekly progress summaries</p>
                </div>
                <Switch 
                  checked={settings.performanceUpdates}
                  onCheckedChange={(value) => handleSwitchChange('performanceUpdates', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                Manage your privacy and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Share progress with teachers</p>
                  <p className="text-sm text-gray-500">Allow teachers to view your performance</p>
                </div>
                <Switch 
                  checked={settings.shareProgress}
                  onCheckedChange={(value) => handleSwitchChange('shareProgress', value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Public profile</p>
                  <p className="text-sm text-gray-500">Make your profile visible to others</p>
                </div>
                <Switch 
                  checked={settings.publicProfile}
                  onCheckedChange={(value) => handleSwitchChange('publicProfile', value)}
                />
              </div>
              <Button variant="outline" className="w-full">Change Password</Button>
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize the look and feel of your interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark mode</p>
                  <p className="text-sm text-gray-500">Use dark theme throughout the app</p>
                </div>
                <Switch 
                  checked={settings.darkMode}
                  onCheckedChange={(value) => handleSwitchChange('darkMode', value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Language</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={settings.language}
                  onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
