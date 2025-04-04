
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';

const ProgressPage = () => {
  const navigate = useNavigate();
  const { todayProgress, isProfileComplete } = useApp();
  
  if (!isProfileComplete) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Set Up</h1>
          <p className="text-netflixLightGray mb-6">
            You need to set up your profile to track your progress.
          </p>
          <Button className="netflix-button" onClick={() => navigate('/setup')}>
            Set Up Profile
          </Button>
        </div>
      </div>
    );
  }

  if (!todayProgress) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">No Progress Data</h1>
          <p className="text-netflixLightGray mb-6">
            Start tracking your meals and workouts to see your progress.
          </p>
          <Button className="netflix-button" onClick={() => navigate('/plans')}>
            View Plans
          </Button>
        </div>
      </div>
    );
  }
  
  // Calculate macro percentages
  const proteinPercentage = Math.min(100, Math.round((todayProgress.macros.protein.consumed / todayProgress.macros.protein.target) * 100));
  const carbsPercentage = Math.min(100, Math.round((todayProgress.macros.carbs.consumed / todayProgress.macros.carbs.target) * 100));
  const fatPercentage = Math.min(100, Math.round((todayProgress.macros.fat.consumed / todayProgress.macros.fat.target) * 100));
  const caloriePercentage = Math.min(100, Math.round((todayProgress.calories.consumed / todayProgress.calories.target) * 100));
  
  // Macro data for pie charts
  const proteinData = [
    { name: 'Consumed', value: todayProgress.macros.protein.consumed },
    { name: 'Remaining', value: Math.max(0, todayProgress.macros.protein.target - todayProgress.macros.protein.consumed) }
  ];
  
  const carbsData = [
    { name: 'Consumed', value: todayProgress.macros.carbs.consumed },
    { name: 'Remaining', value: Math.max(0, todayProgress.macros.carbs.target - todayProgress.macros.carbs.consumed) }
  ];
  
  const fatData = [
    { name: 'Consumed', value: todayProgress.macros.fat.consumed },
    { name: 'Remaining', value: Math.max(0, todayProgress.macros.fat.target - todayProgress.macros.fat.consumed) }
  ];
  
  const calorieData = [
    { name: 'Consumed', value: todayProgress.calories.consumed },
    { name: 'Remaining', value: Math.max(0, todayProgress.calories.target - todayProgress.calories.consumed) }
  ];
  
  // Colors for charts
  const COLORS = ['#E50914', '#333333'];
  
  // Mock weekly progress data
  const weeklyProgressData = [
    { name: 'Mon', calories: 1850, protein: 120, target: 2000 },
    { name: 'Tue', calories: 1950, protein: 135, target: 2000 },
    { name: 'Wed', calories: 2100, protein: 140, target: 2000 },
    { name: 'Thu', calories: 1800, protein: 115, target: 2000 },
    { name: 'Fri', calories: 2200, protein: 145, target: 2000 },
    { name: 'Sat', calories: 2300, protein: 150, target: 2000 },
    { name: 'Sun', calories: todayProgress.calories.consumed, protein: todayProgress.macros.protein.consumed, target: todayProgress.calories.target }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Progress Tracker</h1>
      
      <div className="mb-8">
        <Card className="bg-netflixDarkGray border-netflixDarkGray">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Daily Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex overflow-x-auto pb-4 gap-4 md:gap-8">
              <div className="flex flex-col items-center min-w-[110px]">
                <div className="w-20 h-20 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={calorieData}
                        innerRadius={25}
                        outerRadius={35}
                        paddingAngle={2}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {calorieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="text-lg font-bold">{caloriePercentage}%</span>
                  </div>
                </div>
                <span className="text-sm font-medium mt-2">Calories</span>
                <span className="text-xs text-netflixLightGray">{todayProgress.calories.consumed} / {todayProgress.calories.target}</span>
              </div>
              
              <div className="flex flex-col items-center min-w-[110px]">
                <div className="w-20 h-20 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={proteinData}
                        innerRadius={25}
                        outerRadius={35}
                        paddingAngle={2}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {proteinData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="text-lg font-bold">{proteinPercentage}%</span>
                  </div>
                </div>
                <span className="text-sm font-medium mt-2">Protein</span>
                <span className="text-xs text-netflixLightGray">{todayProgress.macros.protein.consumed}g / {todayProgress.macros.protein.target}g</span>
              </div>
              
              <div className="flex flex-col items-center min-w-[110px]">
                <div className="w-20 h-20 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={carbsData}
                        innerRadius={25}
                        outerRadius={35}
                        paddingAngle={2}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {carbsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="text-lg font-bold">{carbsPercentage}%</span>
                  </div>
                </div>
                <span className="text-sm font-medium mt-2">Carbs</span>
                <span className="text-xs text-netflixLightGray">{todayProgress.macros.carbs.consumed}g / {todayProgress.macros.carbs.target}g</span>
              </div>
              
              <div className="flex flex-col items-center min-w-[110px]">
                <div className="w-20 h-20 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={fatData}
                        innerRadius={25}
                        outerRadius={35}
                        paddingAngle={2}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {fatData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                    <span className="text-lg font-bold">{fatPercentage}%</span>
                  </div>
                </div>
                <span className="text-sm font-medium mt-2">Fat</span>
                <span className="text-xs text-netflixLightGray">{todayProgress.macros.fat.consumed}g / {todayProgress.macros.fat.target}g</span>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Workout Status</h3>
              <div className="bg-netflixBlack p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span>Today's workout</span>
                  <span className={`font-medium ${todayProgress.workoutCompleted ? 'text-green-500' : 'text-netflixRed'}`}>
                    {todayProgress.workoutCompleted ? 'Completed' : 'Not completed'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-netflixDarkGray border-netflixDarkGray mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Weekly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={weeklyProgressData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#B3B3B3" />
                <YAxis stroke="#B3B3B3" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141414', borderColor: '#333' }}
                  itemStyle={{ color: '#B3B3B3' }}
                  labelStyle={{ color: 'white' }}
                />
                <Legend />
                <Line type="monotone" dataKey="calories" stroke="#E50914" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="target" stroke="#808080" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <Button className="netflix-button" onClick={() => navigate('/scanner')}>
          Log Food with Scanner
        </Button>
      </div>
    </div>
  );
};

export default ProgressPage;
