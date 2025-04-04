
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { profile, isProfileComplete } = useApp();
  
  if (!isProfileComplete) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <UserCircle className="w-24 h-24 mx-auto text-netflixGray mb-4" />
          <h1 className="text-2xl font-bold mb-4">Profile Not Set Up</h1>
          <p className="text-netflixLightGray mb-6">
            You need to set up your profile to access personalized fitness plans.
          </p>
          <Button className="netflix-button" onClick={() => navigate('/setup')}>
            Set Up Profile
          </Button>
        </div>
      </div>
    );
  }
  
  const getTrainingStyleText = (style: string) => {
    switch (style) {
      case 'home': return 'Home Workout';
      case 'gym': return 'Gym';
      case 'calisthenics': return 'Calisthenics';
      default: return style;
    }
  };
  
  const getGoalText = (goal: string) => {
    switch (goal) {
      case 'lose': return 'Lose Weight';
      case 'maintain': return 'Maintain Weight';
      case 'gain': return 'Gain Weight';
      default: return goal;
    }
  };
  
  const calculateBMI = () => {
    if (!profile) return 'N/A';
    
    const heightInMeters = profile.height / 100;
    const bmi = profile.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };
  
  const getBMICategory = () => {
    const bmi = parseFloat(calculateBMI());
    
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <Button onClick={() => navigate('/setup')} variant="ghost" size="sm">
          <Edit className="w-4 h-4 mr-2" /> Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-netflixDarkGray border-netflixDarkGray">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Personal Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-netflixGray pb-2">
                <span className="text-netflixLightGray">Name</span>
                <span className="font-semibold">{profile?.name}</span>
              </div>
              <div className="flex justify-between border-b border-netflixGray pb-2">
                <span className="text-netflixLightGray">Age</span>
                <span className="font-semibold">{profile?.age} years</span>
              </div>
              <div className="flex justify-between border-b border-netflixGray pb-2">
                <span className="text-netflixLightGray">Gender</span>
                <span className="font-semibold">{profile?.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-netflixLightGray">Goal</span>
                <span className="font-semibold">{getGoalText(profile!.goal)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-netflixDarkGray border-netflixDarkGray">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Body Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between border-b border-netflixGray pb-2">
                <span className="text-netflixLightGray">Height</span>
                <span className="font-semibold">{profile?.height} cm</span>
              </div>
              <div className="flex justify-between border-b border-netflixGray pb-2">
                <span className="text-netflixLightGray">Weight</span>
                <span className="font-semibold">{profile?.weight} kg</span>
              </div>
              <div className="flex justify-between border-b border-netflixGray pb-2">
                <span className="text-netflixLightGray">BMI</span>
                <span className="font-semibold">{calculateBMI()} ({getBMICategory()})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-netflixLightGray">Body Fat</span>
                <span className="font-semibold">{profile?.bodyFatPercentage}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-netflixDarkGray border-netflixDarkGray mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Training Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between">
            <span className="text-netflixLightGray">Training Style</span>
            <span className="font-semibold">{getTrainingStyleText(profile!.trainingStyle)}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-netflixDarkGray border-netflixDarkGray">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Daily Targets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-netflixGray pb-2">
              <span className="text-netflixLightGray">Daily Calories</span>
              <span className="font-semibold">{calculateDailyCalories()} kcal</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  function calculateDailyCalories() {
    if (!profile) return 'N/A';
    
    // Basic BMR calculation using Mifflin-St Jeor Equation
    let bmr = 0;
    if (profile.gender === 'male') {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
    } else {
      bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
    }
    
    // Activity multiplier based on training style
    let activityMultiplier = 1.2; // Sedentary
    if (profile.trainingStyle === 'home') activityMultiplier = 1.375; // Light activity
    if (profile.trainingStyle === 'gym') activityMultiplier = 1.55; // Moderate activity
    if (profile.trainingStyle === 'calisthenics') activityMultiplier = 1.725; // Very active
    
    let tdee = bmr * activityMultiplier;
    
    // Adjust based on goal
    if (profile.goal === 'lose') tdee -= 500; // Caloric deficit
    if (profile.goal === 'gain') tdee += 300; // Caloric surplus
    
    return Math.round(tdee);
  }
};

export default ProfilePage;
