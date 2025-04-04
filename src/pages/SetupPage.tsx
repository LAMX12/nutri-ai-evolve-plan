
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const SetupPage = () => {
  const navigate = useNavigate();
  const { setProfile } = useApp();
  
  // Setup state
  const [name, setName] = useState('');
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('');
  const [bodyFatPercentage, setBodyFatPercentage] = useState(15);
  const [trainingStyle, setTrainingStyle] = useState('');
  const [goal, setGoal] = useState('');
  
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !gender || !trainingStyle || !goal) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setProfile({
      name,
      height,
      weight,
      age,
      gender: gender as any,
      bodyFatPercentage,
      trainingStyle: trainingStyle as any,
      goal: goal as any
    });
    
    toast.success("Profile created successfully!");
    navigate('/plans');
  };
  
  return (
    <div className="min-h-screen py-8 px-4 bg-netflixBlack">
      <div className="max-w-md mx-auto">
        <h1 className="text-netflixRed font-bold text-3xl mb-8 text-center">NUTRI AI</h1>
        <h2 className="text-2xl font-bold mb-8 text-center">Complete Your Profile</h2>
        
        <form onSubmit={handleManualSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter your name" 
              className="netflix-input"
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <div className="flex items-center gap-4">
              <Input 
                id="height" 
                type="number" 
                value={height} 
                onChange={(e) => setHeight(Number(e.target.value))} 
                className="netflix-input"
                min={120}
                max={220}
              />
              <span className="text-xl font-bold w-12">{height}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <div className="flex items-center gap-4">
              <Input 
                id="weight" 
                type="number" 
                value={weight} 
                onChange={(e) => setWeight(Number(e.target.value))} 
                className="netflix-input"
                min={30}
                max={200}
              />
              <span className="text-xl font-bold w-12">{weight}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <div className="flex items-center gap-4">
              <Input 
                id="age" 
                type="number" 
                value={age} 
                onChange={(e) => setAge(Number(e.target.value))} 
                className="netflix-input"
                min={18}
                max={100}
              />
              <span className="text-xl font-bold w-12">{age}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup value={gender} onValueChange={setGender} className="flex justify-between">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="gender-male" />
                <Label htmlFor="gender-male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="gender-female" />
                <Label htmlFor="gender-female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="gender-other" />
                <Label htmlFor="gender-other">Other</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bodyFat">Body Fat % (estimate)</Label>
            <div className="space-y-4">
              <Slider
                id="bodyFat"
                min={5} 
                max={40}
                step={1}
                value={[bodyFatPercentage]} 
                onValueChange={([value]) => setBodyFatPercentage(value)}
              />
              <div className="flex justify-between text-sm text-netflixLightGray">
                <span>5%</span>
                <span>{bodyFatPercentage}%</span>
                <span>40%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="trainingStyle">Training Style</Label>
            <Select value={trainingStyle} onValueChange={setTrainingStyle} required>
              <SelectTrigger className="netflix-input">
                <SelectValue placeholder="Select training style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Home Workout</SelectItem>
                <SelectItem value="gym">Gym</SelectItem>
                <SelectItem value="calisthenics">Calisthenics</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goal">Your Goal</Label>
            <Select value={goal} onValueChange={setGoal} required>
              <SelectTrigger className="netflix-input">
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lose">Lose Weight</SelectItem>
                <SelectItem value="maintain">Maintain Weight</SelectItem>
                <SelectItem value="gain">Gain Weight</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" className="netflix-button w-full">
            Create Profile
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SetupPage;
