
import React, { useState } from 'react';
import { AlertCircle, Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const ScannerPage = () => {
  const navigate = useNavigate();
  const { isProfileComplete, updateCalorieIntake, updateMacroIntake } = useApp();
  
  const [scanning, setScanning] = useState(false);
  const [scannedFood, setScannedFood] = useState<FoodItem | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [foodWeight, setFoodWeight] = useState<string>("100");
  
  if (!isProfileComplete) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Set Up</h1>
          <p className="text-netflixLightGray mb-6">
            You need to set up your profile to use the food scanner.
          </p>
          <Button className="netflix-button" onClick={() => navigate('/setup')}>
            Set Up Profile
          </Button>
        </div>
      </div>
    );
  }
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
        simulateScan();
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleTakePhoto = () => {
    setScanning(true);
    // Simulate camera capture with timeout
    setTimeout(() => {
      setImagePreview('/placeholder.svg'); // Using placeholder
      simulateScan();
    }, 1500);
  };
  
  const simulateScan = () => {
    setScanning(true);
    
    // Simulate processing time
    setTimeout(() => {
      // Mock food detection result
      const mockFoods = [
        { name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
        { name: 'Salmon Fillet', calories: 233, protein: 25, carbs: 0, fat: 15 },
        { name: 'Greek Yogurt', calories: 100, protein: 10, carbs: 4, fat: 5 },
        { name: 'Avocado Toast', calories: 210, protein: 5, carbs: 25, fat: 10 },
        { name: 'Banana Smoothie', calories: 180, protein: 4, carbs: 38, fat: 2 }
      ];
      
      const randomFood = mockFoods[Math.floor(Math.random() * mockFoods.length)];
      setScannedFood(randomFood);
      setScanning(false);
    }, 2000);
  };
  
  const handleAddFood = () => {
    if (scannedFood) {
      // Calculate calories and macros based on the weight
      const weightMultiplier = parseInt(foodWeight) / 100;
      const adjustedCalories = Math.round(scannedFood.calories * weightMultiplier);
      const adjustedProtein = Math.round(scannedFood.protein * weightMultiplier * 10) / 10;
      const adjustedCarbs = Math.round(scannedFood.carbs * weightMultiplier * 10) / 10;
      const adjustedFat = Math.round(scannedFood.fat * weightMultiplier * 10) / 10;
      
      updateCalorieIntake(adjustedCalories);
      updateMacroIntake(adjustedProtein, adjustedCarbs, adjustedFat);
      
      toast.success(`Added ${scannedFood.name} (${foodWeight}g) to your daily intake`);
      navigate('/progress');
    }
  };

  const getWeightAdjustedNutrition = () => {
    if (!scannedFood) return null;
    
    const weightMultiplier = parseInt(foodWeight) / 100;
    return {
      calories: Math.round(scannedFood.calories * weightMultiplier),
      protein: Math.round(scannedFood.protein * weightMultiplier * 10) / 10,
      carbs: Math.round(scannedFood.carbs * weightMultiplier * 10) / 10,
      fat: Math.round(scannedFood.fat * weightMultiplier * 10) / 10
    };
  };

  const adjustedNutrition = getWeightAdjustedNutrition();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Food Scanner</h1>
      
      {!scannedFood && !scanning && !imagePreview && (
        <Card className="bg-netflixDarkGray border-netflixDarkGray mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="w-32 h-32 rounded-full bg-netflixRed/20 flex items-center justify-center">
                <Camera className="w-16 h-16 text-netflixRed" />
              </div>
              
              <p className="text-center text-netflixLightGray">
                Scan your food to get nutrition information and add it to your daily intake.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
                <Button onClick={handleTakePhoto} className="netflix-button">
                  <Camera className="mr-2 h-4 w-4" /> Take Photo
                </Button>
                
                <div className="relative">
                  <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" /> Upload Image
                  </Button>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {scanning && (
        <div className="text-center py-12">
          {imagePreview && (
            <div className="mb-6 mx-auto">
              <img 
                src={imagePreview} 
                alt="Food" 
                className="w-full max-w-md mx-auto rounded-lg object-cover h-64" 
              />
            </div>
          )}
          <div className="animate-pulse">
            <div className="w-16 h-16 mx-auto mb-4">
              <svg className="w-full h-full text-netflixRed animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Analyzing food...</h2>
            <p className="text-netflixLightGray">Using AI to identify ingredients and calculate nutrition info</p>
          </div>
        </div>
      )}
      
      {scannedFood && imagePreview && (
        <div>
          <Card className="bg-netflixDarkGray border-netflixDarkGray mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <img 
                    src={imagePreview} 
                    alt={scannedFood.name} 
                    className="w-full rounded-lg h-60 object-cover" 
                  />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-4">{scannedFood.name}</h2>
                  
                  <div className="mb-4">
                    <label htmlFor="weight" className="block text-sm font-medium mb-1">
                      Portion Size (g)
                    </label>
                    <div className="flex gap-2">
                      <Select 
                        value={foodWeight} 
                        onValueChange={setFoodWeight}
                      >
                        <SelectTrigger className="w-full bg-netflixBlack">
                          <SelectValue placeholder="Select weight" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50">50g</SelectItem>
                          <SelectItem value="100">100g</SelectItem>
                          <SelectItem value="150">150g</SelectItem>
                          <SelectItem value="200">200g</SelectItem>
                          <SelectItem value="250">250g</SelectItem>
                          <SelectItem value="300">300g</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        value={foodWeight}
                        onChange={(e) => setFoodWeight(e.target.value)}
                        className="netflix-input w-24"
                        min="1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="bg-netflixBlack p-4 rounded-lg flex justify-between items-center">
                      <span className="font-medium">Calories</span>
                      <span className="text-xl font-bold">{adjustedNutrition?.calories} kcal</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-netflixBlack p-3 rounded-lg text-center">
                        <h4 className="text-xs text-netflixLightGray mb-1">Protein</h4>
                        <span className="block text-lg font-bold">{adjustedNutrition?.protein}g</span>
                      </div>
                      <div className="bg-netflixBlack p-3 rounded-lg text-center">
                        <h4 className="text-xs text-netflixLightGray mb-1">Carbs</h4>
                        <span className="block text-lg font-bold">{adjustedNutrition?.carbs}g</span>
                      </div>
                      <div className="bg-netflixBlack p-3 rounded-lg text-center">
                        <h4 className="text-xs text-netflixLightGray mb-1">Fat</h4>
                        <span className="block text-lg font-bold">{adjustedNutrition?.fat}g</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-netflixLightGray mb-6">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">AI-estimated values may vary from actual nutrition data</span>
                  </div>
                  
                  <Button onClick={handleAddFood} className="netflix-button w-full">
                    Add to Daily Intake
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center">
            <Button variant="outline" onClick={() => {
              setScannedFood(null);
              setImagePreview(null);
            }}>
              Scan Different Food
            </Button>
          </div>
        </div>
      )}
      
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Manual Entry</h2>
        <Card className="bg-netflixDarkGray border-netflixDarkGray">
          <CardContent className="p-6">
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const manualFood = {
                name: formData.get('foodName') as string,
                calories: parseInt(formData.get('calories') as string, 10),
                protein: parseInt(formData.get('protein') as string, 10),
                carbs: parseInt(formData.get('carbs') as string, 10),
                fat: parseInt(formData.get('fat') as string, 10)
              };
              
              updateCalorieIntake(manualFood.calories);
              updateMacroIntake(manualFood.protein, manualFood.carbs, manualFood.fat);
              
              toast.success(`Added ${manualFood.name} to your daily intake`);
              navigate('/progress');
            }}>
              <div>
                <label htmlFor="foodName" className="block text-sm font-medium mb-1">Food Name</label>
                <Input id="foodName" name="foodName" className="netflix-input" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="calories" className="block text-sm font-medium mb-1">Calories</label>
                  <Input id="calories" name="calories" type="number" className="netflix-input" required />
                </div>
                <div>
                  <label htmlFor="protein" className="block text-sm font-medium mb-1">Protein (g)</label>
                  <Input id="protein" name="protein" type="number" className="netflix-input" required />
                </div>
                <div>
                  <label htmlFor="carbs" className="block text-sm font-medium mb-1">Carbs (g)</label>
                  <Input id="carbs" name="carbs" type="number" className="netflix-input" required />
                </div>
                <div>
                  <label htmlFor="fat" className="block text-sm font-medium mb-1">Fat (g)</label>
                  <Input id="fat" name="fat" type="number" className="netflix-input" required />
                </div>
              </div>
              
              <Button type="submit" className="w-full">Add Manually</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScannerPage;
