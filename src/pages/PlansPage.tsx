
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, Dumbbell, Play, RefreshCw, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';

const PlansPage = () => {
  const navigate = useNavigate();
  const { 
    profile, 
    isProfileComplete, 
    workoutPlan, 
    mealPlan, 
    generatePlans,
    todayProgress,
    completeWorkout
  } = useApp();

  useEffect(() => {
    if (isProfileComplete && workoutPlan.length === 0 && mealPlan.length === 0) {
      generatePlans();
    }
  }, [isProfileComplete]);

  if (!isProfileComplete) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
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

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  
  const getTodayWorkout = () => {
    return workoutPlan.find(workout => workout.day === today) || workoutPlan[0];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Your Plans</h1>
        <Button onClick={generatePlans} variant="ghost" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
        </Button>
      </div>
      
      <Tabs defaultValue="today">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="workout">Workout Plan</TabsTrigger>
          <TabsTrigger value="meal">Meal Plan</TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="space-y-8">
          <Card className="bg-netflixDarkGray border-netflixDarkGray">
            <CardHeader className="pb-2 flex flex-row justify-between items-center">
              <CardTitle className="text-xl">Daily Overview</CardTitle>
              <Calendar className="w-5 h-5 text-netflixRed" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-netflixLightGray mb-4">
                Today's target: {todayProgress?.calories.target} calories
              </p>
              
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-medium">Calories Consumed</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold">{todayProgress?.calories.consumed || 0}</span>
                    <span className="text-netflixLightGray text-sm">/ {todayProgress?.calories.target}</span>
                  </div>
                </div>
                
                <div className="w-24 h-24 relative flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#333" 
                      strokeWidth="8"
                    />
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#E50914" 
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={
                        2 * Math.PI * 45 * (1 - ((todayProgress?.calories.consumed || 0) / (todayProgress?.calories.target || 1)))
                      }
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-lg font-bold">
                    {Math.round(((todayProgress?.calories.consumed || 0) / (todayProgress?.calories.target || 1)) * 100)}%
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-netflixBlack p-3 rounded-lg text-center">
                  <h4 className="text-xs text-netflixLightGray mb-1">Protein</h4>
                  <span className="block text-lg font-bold">{todayProgress?.macros.protein.consumed || 0}g</span>
                  <span className="text-xs text-netflixLightGray">of {todayProgress?.macros.protein.target}g</span>
                </div>
                <div className="bg-netflixBlack p-3 rounded-lg text-center">
                  <h4 className="text-xs text-netflixLightGray mb-1">Carbs</h4>
                  <span className="block text-lg font-bold">{todayProgress?.macros.carbs.consumed || 0}g</span>
                  <span className="text-xs text-netflixLightGray">of {todayProgress?.macros.carbs.target}g</span>
                </div>
                <div className="bg-netflixBlack p-3 rounded-lg text-center">
                  <h4 className="text-xs text-netflixLightGray mb-1">Fat</h4>
                  <span className="block text-lg font-bold">{todayProgress?.macros.fat.consumed || 0}g</span>
                  <span className="text-xs text-netflixLightGray">of {todayProgress?.macros.fat.target}g</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-netflixDarkGray border-netflixDarkGray">
            <CardHeader className="pb-2 flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-xl">Today's Workout</CardTitle>
                <p className="text-sm text-netflixLightGray mt-1">{getTodayWorkout()?.name}</p>
              </div>
              <Dumbbell className="w-5 h-5 text-netflixRed" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getTodayWorkout()?.exercises.slice(0, 3).map((exercise, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{exercise.name}</h3>
                      <p className="text-sm text-netflixLightGray">
                        {exercise.sets} sets × {exercise.reps} reps
                      </p>
                    </div>
                    <Badge variant="outline" className="text-netflixLightGray">
                      {exercise.rest}s rest
                    </Badge>
                  </div>
                ))}
                
                {getTodayWorkout()?.exercises.length > 3 && (
                  <p className="text-sm text-netflixLightGray text-center">
                    +{getTodayWorkout()?.exercises.length - 3} more exercises
                  </p>
                )}
                
                <div className="pt-4">
                  <Button 
                    className="w-full netflix-button"
                    onClick={() => {
                      completeWorkout();
                    }}
                    disabled={todayProgress?.workoutCompleted}
                  >
                    {todayProgress?.workoutCompleted ? 'Completed' : 'Complete Workout'}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-netflixDarkGray border-netflixDarkGray">
            <CardHeader className="pb-2 flex flex-row justify-between items-center">
              <CardTitle className="text-xl">Today's Meals</CardTitle>
              <Utensils className="w-5 h-5 text-netflixRed" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mealPlan.map((meal, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{meal.name}</h3>
                      <p className="text-sm text-netflixLightGray">
                        {meal.calories} kcal • {meal.protein}g protein
                      </p>
                    </div>
                    <span className="text-sm text-netflixLightGray">
                      {meal.time}
                    </span>
                  </div>
                ))}
                
                <div className="pt-2">
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate('/scanner')}
                  >
                    <Camera className="mr-2 h-4 w-4" /> Food Scanner
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workout" className="space-y-8">
          <h2 className="text-xl font-bold">Weekly Workout Plan</h2>
          
          {workoutPlan.map((workout, index) => (
            <Card key={index} className="bg-netflixDarkGray border-netflixDarkGray">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div>
                    <Badge variant="outline" className="mb-2">{workout.day}</Badge>
                    <CardTitle>{workout.name}</CardTitle>
                  </div>
                  <Badge className="bg-netflixRed">{workout.duration} min</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workout.exercises.map((exercise, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-netflixDarkGray pb-2 last:border-0 last:pb-0">
                      <div>
                        <h3 className="font-medium">{exercise.name}</h3>
                        <p className="text-sm text-netflixLightGray">
                          {exercise.sets} sets × {exercise.reps} reps
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-netflixLightGray">
                        {exercise.rest}s rest
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="meal" className="space-y-8">
          <h2 className="text-xl font-bold">Daily Meal Plan</h2>
          <p className="text-netflixLightGray mb-4">
            Total: {mealPlan.reduce((acc, meal) => acc + meal.calories, 0)} calories
          </p>
          
          {mealPlan.map((meal, index) => (
            <Card key={index} className="bg-netflixDarkGray border-netflixDarkGray">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>{meal.name}</CardTitle>
                  <Badge className="bg-netflixRed">{meal.time}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-4">
                  <span className="text-lg font-bold">{meal.calories} kcal</span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-netflixBlack p-3 rounded-lg text-center">
                    <h4 className="text-xs text-netflixLightGray mb-1">Protein</h4>
                    <span className="block text-lg font-bold">{meal.protein}g</span>
                  </div>
                  <div className="bg-netflixBlack p-3 rounded-lg text-center">
                    <h4 className="text-xs text-netflixLightGray mb-1">Carbs</h4>
                    <span className="block text-lg font-bold">{meal.carbs}g</span>
                  </div>
                  <div className="bg-netflixBlack p-3 rounded-lg text-center">
                    <h4 className="text-xs text-netflixLightGray mb-1">Fat</h4>
                    <span className="block text-lg font-bold">{meal.fat}g</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlansPage;
