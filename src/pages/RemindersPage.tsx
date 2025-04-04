
import React, { useState } from 'react';
import { Bell, Clock, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const RemindersPage = () => {
  const { reminders, addReminder, toggleReminder, deleteReminder } = useApp();
  const [open, setOpen] = useState(false);
  
  const handleAddReminder = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    addReminder({
      type: formData.get('type') as 'meal' | 'workout',
      time: formData.get('time') as string,
      title: formData.get('title') as string,
      message: formData.get('message') as string,
      enabled: true
    });
    
    setOpen(false);
  };
  
  const getTimeString = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const time = new Date();
      time.setHours(parseInt(hours, 10));
      time.setMinutes(parseInt(minutes, 10));
      
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeString;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Reminders</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="netflix-button">
              <Plus className="w-4 h-4 mr-2" /> New Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-netflixDarkGray border-netflixDarkGray">
            <DialogHeader>
              <DialogTitle>Create New Reminder</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddReminder} className="space-y-4 pt-2">
              <div className="space-y-2">
                <label htmlFor="type" className="block text-sm font-medium">Type</label>
                <Select name="type" defaultValue="meal" required>
                  <SelectTrigger className="netflix-input">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meal">Meal</SelectItem>
                    <SelectItem value="workout">Workout</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium">Title</label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="e.g. Morning Protein Shake" 
                  className="netflix-input" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="time" className="block text-sm font-medium">Time</label>
                <Input 
                  id="time" 
                  name="time" 
                  type="time" 
                  className="netflix-input" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">Message</label>
                <Input 
                  id="message" 
                  name="message" 
                  placeholder="e.g. Time for your protein shake!" 
                  className="netflix-input" 
                  required 
                />
              </div>
              
              <Button type="submit" className="netflix-button w-full">
                Create Reminder
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {reminders.length === 0 ? (
        <Card className="bg-netflixDarkGray border-netflixDarkGray">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="w-12 h-12 mb-4 text-netflixGray" />
            <h2 className="text-xl font-bold mb-2">No Reminders</h2>
            <p className="text-netflixLightGray text-center mb-6">
              Create reminders for your meals and workouts to stay on track with your fitness goals.
            </p>
            <Button onClick={() => setOpen(true)} className="netflix-button">
              <Plus className="w-4 h-4 mr-2" /> Add First Reminder
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <Card key={reminder.id} className="bg-netflixDarkGray border-netflixDarkGray">
              <CardHeader className="pb-2 flex flex-row justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-2 h-8 rounded-full mr-4 ${reminder.type === 'meal' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                  <CardTitle>{reminder.title}</CardTitle>
                </div>
                <Badge type={reminder.type} />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-netflixLightGray" />
                    <span>{getTimeString(reminder.time)}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Switch 
                      checked={reminder.enabled} 
                      onCheckedChange={() => toggleReminder(reminder.id)}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteReminder(reminder.id)}
                      className="text-netflixLightGray hover:text-netflixRed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-netflixLightGray mt-2">{reminder.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <Card className="bg-netflixDarkGray border-netflixDarkGray mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Reminder Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notification Sound</p>
                <p className="text-sm text-netflixLightGray">Play sound when reminders are triggered</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Vibration</p>
                <p className="text-sm text-netflixLightGray">Vibrate when reminders are triggered</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Simple badge component for reminder types
const Badge = ({ type }: { type: 'meal' | 'workout' }) => {
  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      ${type === 'meal' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}
    `}>
      {type === 'meal' ? 'Meal' : 'Workout'}
    </span>
  );
};

export default RemindersPage;
