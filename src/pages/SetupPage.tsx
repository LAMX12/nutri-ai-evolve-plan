
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ChevronRight, Image, User } from 'lucide-react';
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
  const [setupMethod, setSetupMethod] = useState<'manual' | 'photo' | null>(null);
  
  const [name, setName] = useState('');
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('');
  const [bodyFatPercentage, setBodyFatPercentage] = useState(15);
  const [trainingStyle, setTrainingStyle] = useState('');
  const [goal, setGoal] = useState('');
  
  // Photo capture (mock)
  const [photoStep, setPhotoStep] = useState(0);
  
  const handleManualSetup = () => {
    setSetupMethod('manual');
  };
  
  const handlePhotoSetup = () => {
    setSetupMethod('photo');
  };
  
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
  
  const simulatePhotoAnalysis = () => {
    // In a real app, this would process the photo and extract body measurements
    // Here we just simulate the process
    setPhotoStep(prev => prev + 1);
    
    if (photoStep === 2) {
      setProfile({
        name: "User",
        height: 175,
        weight: 75,
        age: 32,
        gender: 'male',
        bodyFatPercentage: 18,
        trainingStyle: 'gym',
        goal: 'lose'
      });
      
      toast.success("Profile created from photo analysis!");
      navigate('/plans');
    }
  };
  
  // Initial setup method selection
  if (setupMethod === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-netflixBlack">
        <h1 className="text-netflixRed font-bold text-4xl mb-8">NUTRI AI</h1>
        <h2 className="text-2xl font-bold mb-12 text-center">Let's set up your profile</h2>
        
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl">
          <Card className="flex-1 border-netflixDarkGray bg-netflixDarkGray/50 backdrop-blur-sm hover:bg-netflixDarkGray transition-colors cursor-pointer" onClick={handleManualSetup}>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="w-16 h-16 rounded-full bg-netflixRed/20 flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-netflixRed" />
              </div>
              <h3 className="text-xl font-bold mb-2">Manual Setup</h3>
              <p className="text-netflixLightGray text-center">
                Enter your measurements and preferences manually
              </p>
            </CardContent>
          </Card>
          
          <Card className="flex-1 border-netflixDarkGray bg-netflixDarkGray/50 backdrop-blur-sm hover:bg-netflixDarkGray transition-colors cursor-pointer" onClick={handlePhotoSetup}>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="w-16 h-16 rounded-full bg-netflixRed/20 flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-netflixRed" />
              </div>
              <h3 className="text-xl font-bold mb-2">Photo Analysis</h3>
              <p className="text-netflixLightGray text-center">
                Take a photo for automatic body measurements
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Manual setup form
  if (setupMethod === 'manual') {
    return (
      <div className="min-h-screen py-8 px-4 bg-netflixBlack">
        <div className="max-w-md mx-auto">
          <h1 className="text-netflixRed font-bold text-3xl mb-8 text-center">Complete Your Profile</h1>
          
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
  }
  
  // Photo analysis flow
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-netflixBlack">
      <h1 className="text-netflixRed font-bold text-3xl mb-8 text-center">Photo Analysis</h1>
      
      {photoStep === 0 && (
        <div className="text-center max-w-md">
          <div className="w-24 h-24 rounded-full bg-netflixRed/20 flex items-center justify-center mx-auto mb-6">
            <Camera className="w-12 h-12 text-netflixRed" />
          </div>
          <p className="mb-6 text-netflixLightGray">
            Take a full body photo in tight fitting clothes for the most accurate measurements.
            Stand against a neutral background if possible.
          </p>
          <Button onClick={simulatePhotoAnalysis} className="netflix-button">
            <Camera className="mr-2 h-4 w-4" /> Take Photo
          </Button>
        </div>
      )}
      
      {photoStep === 1 && (
        <div className="text-center max-w-md">
          <div className="w-64 h-80 mx-auto mb-6 bg-netflixDarkGray rounded-lg border border-netflixGray flex items-center justify-center">
            <Image className="w-16 h-16 text-netflixGray opacity-50" />
          </div>
          <p className="mb-6 text-netflixLightGray">
            Select your training style preference:
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => setTrainingStyle('home')} className="netflix-button" variant={trainingStyle === 'home' ? 'default' : 'outline'}>
              Home Workout
            </Button>
            <Button onClick={() => setTrainingStyle('gym')} className="netflix-button" variant={trainingStyle === 'gym' ? 'default' : 'outline'}>
              Gym
            </Button>
            <Button onClick={() => setTrainingStyle('calisthenics')} className="netflix-button" variant={trainingStyle === 'calisthenics' ? 'default' : 'outline'}>
              Calisthenics
            </Button>
            
            <Button 
              onClick={simulatePhotoAnalysis} 
              className="netflix-button mt-4"
              disabled={!trainingStyle}
            >
              Continue <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {photoStep === 2 && (
        <div className="text-center max-w-md">
          <div className="w-64 h-80 mx-auto mb-6 bg-netflixDarkGray rounded-lg border border-netflixGray flex items-center justify-center">
            <Image className="w-16 h-16 text-netflixGray opacity-50" />
          </div>
          <p className="mb-6 text-netflixLightGray">
            Select your fitness goal:
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={() => setGoal('lose')} className="netflix-button" variant={goal === 'lose' ? 'default' : 'outline'}>
              Lose Weight
            </Button>
            <Button onClick={() => setGoal('maintain')} className="netflix-button" variant={goal === 'maintain' ? 'default' : 'outline'}>
              Maintain Weight
            </Button>
            <Button onClick={() => setGoal('gain')} className="netflix-button" variant={goal === 'gain' ? 'default' : 'outline'}>
              Gain Muscle
            </Button>
            
            <Button 
              onClick={simulatePhotoAnalysis} 
              className="netflix-button mt-4"
              disabled={!goal}
            >
              Complete Setup <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetupPage;
