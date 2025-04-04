
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

type TrainingStyle = 'home' | 'gym' | 'calisthenics';
type Gender = 'male' | 'female' | 'other';
type Goal = 'lose' | 'maintain' | 'gain';

interface UserProfile {
  name: string;
  height: number; // cm
  weight: number; // kg
  age: number;
  gender: Gender;
  bodyFatPercentage?: number;
  trainingStyle: TrainingStyle;
  goal: Goal;
  photoUrl?: string;
}

interface MacroTarget {
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

interface DailyProgress {
  date: string;
  calories: {
    consumed: number;
    target: number;
  };
  macros: {
    protein: { consumed: number; target: number };
    carbs: { consumed: number; target: number };
    fat: { consumed: number; target: number };
  };
  workoutCompleted: boolean;
}

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
  time?: string;
}

interface Workout {
  name: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
    rest: number; // seconds
  }[];
  duration: number; // minutes
  day: string; // Monday, Tuesday, etc.
}

interface Reminder {
  id: string;
  type: 'meal' | 'workout';
  time: string;
  enabled: boolean;
  title: string;
  message: string;
}

interface AppContextType {
  // Profile state
  profile: UserProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isProfileComplete: boolean;
  
  // Plans
  workoutPlan: Workout[];
  setWorkoutPlan: React.Dispatch<React.SetStateAction<Workout[]>>;
  mealPlan: Meal[];
  setMealPlan: React.Dispatch<React.SetStateAction<Meal[]>>;
  
  // Daily progress
  todayProgress: DailyProgress | null;
  updateCalorieIntake: (calories: number) => void;
  updateMacroIntake: (protein: number, carbs: number, fat: number) => void;
  completeWorkout: () => void;
  
  // Reminders
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  toggleReminder: (id: string) => void;
  deleteReminder: (id: string) => void;
  
  // App state
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Helpers
  calculateDailyCalories: () => number;
  calculateMacroTargets: () => MacroTarget;
  generatePlans: () => Promise<void>;
  resetProgress: () => void;
}

// Hugging Face API Key
const HF_API_KEY = "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"; 

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<Workout[]>([]);
  const [mealPlan, setMealPlan] = useState<Meal[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize today's progress
  const [todayProgress, setTodayProgress] = useState<DailyProgress | null>(null);
  
  // Check if we have a stored profile on load
  useEffect(() => {
    const storedProfile = localStorage.getItem('nutriai-profile');
    if (storedProfile) {
      try {
        setProfile(JSON.parse(storedProfile));
      } catch (e) {
        console.error('Error parsing stored profile', e);
      }
    }
    
    const storedWorkoutPlan = localStorage.getItem('nutriai-workout-plan');
    if (storedWorkoutPlan) {
      try {
        setWorkoutPlan(JSON.parse(storedWorkoutPlan));
      } catch (e) {
        console.error('Error parsing stored workout plan', e);
      }
    }
    
    const storedMealPlan = localStorage.getItem('nutriai-meal-plan');
    if (storedMealPlan) {
      try {
        setMealPlan(JSON.parse(storedMealPlan));
      } catch (e) {
        console.error('Error parsing stored meal plan', e);
      }
    }
    
    const storedReminders = localStorage.getItem('nutriai-reminders');
    if (storedReminders) {
      try {
        setReminders(JSON.parse(storedReminders));
      } catch (e) {
        console.error('Error parsing stored reminders', e);
      }
    }
    
    initTodayProgress();
  }, []);
  
  // Persist data when it changes
  useEffect(() => {
    if (profile) {
      localStorage.setItem('nutriai-profile', JSON.stringify(profile));
    }
  }, [profile]);
  
  useEffect(() => {
    if (workoutPlan.length > 0) {
      localStorage.setItem('nutriai-workout-plan', JSON.stringify(workoutPlan));
    }
  }, [workoutPlan]);
  
  useEffect(() => {
    if (mealPlan.length > 0) {
      localStorage.setItem('nutriai-meal-plan', JSON.stringify(mealPlan));
    }
  }, [mealPlan]);
  
  useEffect(() => {
    if (reminders.length > 0) {
      localStorage.setItem('nutriai-reminders', JSON.stringify(reminders));
    }
  }, [reminders]);
  
  const initTodayProgress = () => {
    const today = new Date().toISOString().split('T')[0];
    const storedProgress = localStorage.getItem(`nutriai-progress-${today}`);
    
    if (storedProgress) {
      try {
        setTodayProgress(JSON.parse(storedProgress));
      } catch (e) {
        console.error('Error parsing stored progress', e);
        createNewDailyProgress();
      }
    } else {
      createNewDailyProgress();
    }
  };
  
  const createNewDailyProgress = () => {
    const macroTargets = calculateMacroTargets();
    const calorieTarget = calculateDailyCalories();
    
    const newProgress: DailyProgress = {
      date: new Date().toISOString().split('T')[0],
      calories: {
        consumed: 0,
        target: calorieTarget
      },
      macros: {
        protein: { consumed: 0, target: macroTargets.protein },
        carbs: { consumed: 0, target: macroTargets.carbs },
        fat: { consumed: 0, target: macroTargets.fat }
      },
      workoutCompleted: false
    };
    
    setTodayProgress(newProgress);
    localStorage.setItem(`nutriai-progress-${newProgress.date}`, JSON.stringify(newProgress));
  };
  
  // Calculate daily calorie needs based on user profile
  const calculateDailyCalories = () => {
    if (!profile) return 2000; // Default
    
    const { weight, height, age, gender, goal, trainingStyle, bodyFatPercentage } = profile;
    
    // Basic BMR calculation using Mifflin-St Jeor Equation
    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // Activity multiplier based on training style
    let activityMultiplier = 1.2; // Sedentary
    if (trainingStyle === 'home') activityMultiplier = 1.375; // Light activity
    if (trainingStyle === 'gym') activityMultiplier = 1.55; // Moderate activity
    if (trainingStyle === 'calisthenics') activityMultiplier = 1.725; // Very active
    
    let tdee = bmr * activityMultiplier;
    
    // Adjust based on goal
    if (goal === 'lose') tdee -= 500; // Caloric deficit
    if (goal === 'gain') tdee += 300; // Caloric surplus
    
    return Math.round(tdee);
  };
  
  // Calculate macro targets based on calorie needs
  const calculateMacroTargets = (): MacroTarget => {
    const calories = calculateDailyCalories();
    
    if (!profile) {
      return { protein: 150, carbs: 200, fat: 70 }; // Default
    }
    
    let proteinRatio, carbsRatio, fatRatio;
    
    // Adjust macro ratios based on goal
    switch (profile.goal) {
      case 'lose':
        proteinRatio = 0.4; // Higher protein for muscle preservation
        fatRatio = 0.35;
        carbsRatio = 0.25;
        break;
      case 'maintain':
        proteinRatio = 0.3;
        carbsRatio = 0.4;
        fatRatio = 0.3;
        break;
      case 'gain':
        proteinRatio = 0.3;
        carbsRatio = 0.5; // Higher carbs for energy
        fatRatio = 0.2;
        break;
      default:
        proteinRatio = 0.3;
        carbsRatio = 0.4;
        fatRatio = 0.3;
    }
    
    // Calculate grams based on calorie ratios and macronutrient caloric values
    // Protein: 4 calories per gram
    // Carbs: 4 calories per gram
    // Fat: 9 calories per gram
    const proteinGrams = Math.round((calories * proteinRatio) / 4);
    const carbsGrams = Math.round((calories * carbsRatio) / 4);
    const fatGrams = Math.round((calories * fatRatio) / 9);
    
    return { protein: proteinGrams, carbs: carbsGrams, fat: fatGrams };
  };

  // Update the today's progress with new calorie intake
  const updateCalorieIntake = (calories: number) => {
    if (!todayProgress) return;
    
    const updatedProgress = {
      ...todayProgress,
      calories: {
        ...todayProgress.calories,
        consumed: todayProgress.calories.consumed + calories
      }
    };
    
    setTodayProgress(updatedProgress);
    localStorage.setItem(`nutriai-progress-${updatedProgress.date}`, JSON.stringify(updatedProgress));
  };
  
  // Update the today's progress with new macro intake
  const updateMacroIntake = (protein: number, carbs: number, fat: number) => {
    if (!todayProgress) return;
    
    const updatedProgress = {
      ...todayProgress,
      macros: {
        protein: {
          ...todayProgress.macros.protein,
          consumed: todayProgress.macros.protein.consumed + protein
        },
        carbs: {
          ...todayProgress.macros.carbs,
          consumed: todayProgress.macros.carbs.consumed + carbs
        },
        fat: {
          ...todayProgress.macros.fat,
          consumed: todayProgress.macros.fat.consumed + fat
        }
      }
    };
    
    setTodayProgress(updatedProgress);
    localStorage.setItem(`nutriai-progress-${updatedProgress.date}`, JSON.stringify(updatedProgress));
  };
  
  // Mark today's workout as completed
  const completeWorkout = () => {
    if (!todayProgress) return;
    
    const updatedProgress = {
      ...todayProgress,
      workoutCompleted: true
    };
    
    setTodayProgress(updatedProgress);
    localStorage.setItem(`nutriai-progress-${updatedProgress.date}`, JSON.stringify(updatedProgress));
    toast("Workout completed! Great job!");
  };

  // Add a new reminder
  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder = {
      ...reminder,
      id: Date.now().toString()
    };
    
    setReminders(prev => [...prev, newReminder]);
    toast("Reminder set successfully");
  };
  
  // Toggle a reminder on/off
  const toggleReminder = (id: string) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id
          ? { ...reminder, enabled: !reminder.enabled }
          : reminder
      )
    );
  };
  
  // Delete a reminder
  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
    toast("Reminder deleted");
  };

  // Reset today's progress
  const resetProgress = () => {
    createNewDailyProgress();
    toast("Progress reset for today");
  };

  // Generate plan using Hugging Face API
  const generatePlanWithAPI = async () => {
    if (!profile) {
      throw new Error("Profile is required to generate a plan");
    }

    // Create a detailed profile description for the API
    const profileDescription = `
      Generate a detailed fitness plan for a ${profile.age} year old ${profile.gender} 
      with height ${profile.height}cm and weight ${profile.weight}kg.
      Their goal is to ${profile.goal === 'lose' ? 'lose weight' : profile.goal === 'gain' ? 'gain muscle' : 'maintain weight'}.
      They prefer ${profile.trainingStyle} training.
      Daily calorie target: ${calculateDailyCalories()} calories.
      Daily macro targets: Protein: ${calculateMacroTargets().protein}g, Carbs: ${calculateMacroTargets().carbs}g, Fat: ${calculateMacroTargets().fat}g.
      
      Please provide:
      1. A weekly workout plan with 3 different workouts (for Monday, Wednesday, Friday).
      2. Each workout should have a name, 4 exercises (name, sets, reps, rest time), and duration.
      3. A daily meal plan with 4 meals (breakfast, lunch, snack, dinner) including name, calories, and macros.
      
      Return the data in JSON format only, no explanations needed.
    `;

    try {
      const response = await fetch("https://api-inference.huggingface.co/models/meta-llama/Llama-2-70b-chat-hf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${HF_API_KEY}`
        },
        body: JSON.stringify({
          inputs: profileDescription,
          parameters: {
            max_new_tokens: 2000,
            temperature: 0.7,
            return_full_text: false
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      let planData;
      
      try {
        // Try to parse the response as JSON
        const responseText = data[0].generated_text;
        
        // Look for JSON in the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          planData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (error) {
        console.error("Failed to parse API response:", error);
        throw new Error("Failed to parse the workout and meal plan data");
      }
      
      return planData;
    } catch (error) {
      console.error("API request error:", error);
      throw error;
    }
  };

  // Function to generate workout and meal plans based on profile
  const generatePlans = async () => {
    if (!profile) {
      toast.error("Please complete your profile first");
      return;
    }

    setIsLoading(true);
    
    try {
      // Try to use the Hugging Face API first
      let planData;
      try {
        planData = await generatePlanWithAPI();
      } catch (apiError) {
        console.error("API Error:", apiError);
        toast.error("API error, falling back to generated plans");
        // Fall back to generated plans if API fails
        planData = null;
      }
      
      let workoutPlanData: Workout[];
      let mealPlanData: Meal[];
      
      if (planData && planData.workoutPlan && planData.mealPlan) {
        // Use the API-generated plan
        workoutPlanData = planData.workoutPlan;
        mealPlanData = planData.mealPlan;
      } else {
        // Fall back to local generation
        workoutPlanData = generateMockWorkoutPlan(profile.trainingStyle);
        
        const calorieTarget = calculateDailyCalories();
        const macroTargets = calculateMacroTargets();
        mealPlanData = generateMockMealPlan(calorieTarget, macroTargets);
      }
      
      setWorkoutPlan(workoutPlanData);
      setMealPlan(mealPlanData);
      
      toast.success("Your personalized workout and meal plans are ready!");
    } catch (error) {
      console.error("Error generating plans:", error);
      toast.error("Failed to generate plans. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to generate mock workout plan
  const generateMockWorkoutPlan = (trainingStyle: TrainingStyle): Workout[] => {
    if (trainingStyle === 'home') {
      return [
        {
          name: "Upper Body Strength",
          exercises: [
            { name: "Push-ups", sets: 3, reps: 15, rest: 60 },
            { name: "Chair Dips", sets: 3, reps: 12, rest: 60 },
            { name: "Plank", sets: 3, reps: 30, rest: 45 }, // seconds
            { name: "Wide Push-ups", sets: 3, reps: 10, rest: 60 }
          ],
          duration: 30,
          day: "Monday"
        },
        {
          name: "Lower Body Focus",
          exercises: [
            { name: "Bodyweight Squats", sets: 4, reps: 20, rest: 60 },
            { name: "Lunges", sets: 3, reps: 12, rest: 60 },
            { name: "Glute Bridges", sets: 3, reps: 15, rest: 45 },
            { name: "Calf Raises", sets: 3, reps: 20, rest: 30 }
          ],
          duration: 30,
          day: "Wednesday"
        },
        {
          name: "Full Body Circuit",
          exercises: [
            { name: "Jumping Jacks", sets: 3, reps: 30, rest: 30 },
            { name: "Mountain Climbers", sets: 3, reps: 20, rest: 30 },
            { name: "Burpees", sets: 3, reps: 10, rest: 60 },
            { name: "Bicycle Crunches", sets: 3, reps: 20, rest: 45 }
          ],
          duration: 25,
          day: "Friday"
        }
      ];
    } else if (trainingStyle === 'gym') {
      return [
        {
          name: "Chest and Triceps",
          exercises: [
            { name: "Bench Press", sets: 4, reps: 8, rest: 90 },
            { name: "Incline Dumbbell Press", sets: 3, reps: 10, rest: 75 },
            { name: "Cable Flyes", sets: 3, reps: 12, rest: 60 },
            { name: "Tricep Pushdowns", sets: 3, reps: 12, rest: 60 }
          ],
          duration: 45,
          day: "Monday"
        },
        {
          name: "Back and Biceps",
          exercises: [
            { name: "Deadlifts", sets: 4, reps: 8, rest: 120 },
            { name: "Pull-ups", sets: 3, reps: 8, rest: 90 },
            { name: "Seated Cable Rows", sets: 3, reps: 10, rest: 75 },
            { name: "Barbell Curls", sets: 3, reps: 12, rest: 60 }
          ],
          duration: 50,
          day: "Wednesday"
        },
        {
          name: "Legs and Shoulders",
          exercises: [
            { name: "Squats", sets: 4, reps: 8, rest: 120 },
            { name: "Leg Press", sets: 3, reps: 12, rest: 90 },
            { name: "Military Press", sets: 3, reps: 10, rest: 75 },
            { name: "Lateral Raises", sets: 3, reps: 15, rest: 60 }
          ],
          duration: 45,
          day: "Friday"
        }
      ];
    } else { // calisthenics
      return [
        {
          name: "Push Day",
          exercises: [
            { name: "Handstand Push-ups", sets: 3, reps: 8, rest: 90 },
            { name: "Ring Push-ups", sets: 3, reps: 12, rest: 75 },
            { name: "Dips", sets: 4, reps: 10, rest: 90 },
            { name: "Pike Push-ups", sets: 3, reps: 15, rest: 60 }
          ],
          duration: 40,
          day: "Monday"
        },
        {
          name: "Pull Day",
          exercises: [
            { name: "Pull-ups", sets: 4, reps: 8, rest: 90 },
            { name: "Australian Pull-ups", sets: 3, reps: 12, rest: 60 },
            { name: "Chin-ups", sets: 3, reps: 8, rest: 90 },
            { name: "Face Pulls", sets: 3, reps: 12, rest: 60 }
          ],
          duration: 40,
          day: "Wednesday"
        },
        {
          name: "Legs and Core",
          exercises: [
            { name: "Pistol Squats", sets: 3, reps: 8, rest: 90 },
            { name: "Jump Squats", sets: 3, reps: 15, rest: 60 },
            { name: "L-sits", sets: 3, reps: 20, rest: 60 }, // seconds
            { name: "Dragon Flags", sets: 3, reps: 8, rest: 90 }
          ],
          duration: 35,
          day: "Friday"
        }
      ];
    }
  };

  // Helper function to generate mock meal plan
  const generateMockMealPlan = (calorieTarget: number, macroTargets: MacroTarget): Meal[] => {
    // Calculate rough distribution across meals
    const breakfast = {
      calories: Math.round(calorieTarget * 0.25),
      protein: Math.round(macroTargets.protein * 0.25),
      carbs: Math.round(macroTargets.carbs * 0.25),
      fat: Math.round(macroTargets.fat * 0.25)
    };
    
    const lunch = {
      calories: Math.round(calorieTarget * 0.35),
      protein: Math.round(macroTargets.protein * 0.35),
      carbs: Math.round(macroTargets.carbs * 0.35),
      fat: Math.round(macroTargets.fat * 0.35)
    };
    
    const dinner = {
      calories: Math.round(calorieTarget * 0.3),
      protein: Math.round(macroTargets.protein * 0.3),
      carbs: Math.round(macroTargets.carbs * 0.3),
      fat: Math.round(macroTargets.fat * 0.3)
    };
    
    const snack = {
      calories: calorieTarget - breakfast.calories - lunch.calories - dinner.calories,
      protein: macroTargets.protein - breakfast.protein - lunch.protein - dinner.protein,
      carbs: macroTargets.carbs - breakfast.carbs - lunch.carbs - dinner.carbs,
      fat: macroTargets.fat - breakfast.fat - lunch.fat - dinner.fat
    };
    
    return [
      {
        name: "Protein Oatmeal with Berries",
        calories: breakfast.calories,
        protein: breakfast.protein,
        carbs: breakfast.carbs,
        fat: breakfast.fat,
        time: "08:00"
      },
      {
        name: "Grilled Chicken Salad with Quinoa",
        calories: lunch.calories,
        protein: lunch.protein,
        carbs: lunch.carbs,
        fat: lunch.fat,
        time: "13:00"
      },
      {
        name: "Greek Yogurt with Nuts and Honey",
        calories: snack.calories,
        protein: snack.protein,
        carbs: snack.carbs,
        fat: snack.fat,
        time: "16:00"
      },
      {
        name: "Baked Salmon with Sweet Potato and Asparagus",
        calories: dinner.calories,
        protein: dinner.protein,
        carbs: dinner.carbs,
        fat: dinner.fat,
        time: "19:00"
      }
    ];
  };

  // Check if profile is complete with all required fields
  const isProfileComplete = !!profile && !!profile.name && 
                            !!profile.height && !!profile.weight && 
                            !!profile.age && !!profile.gender &&
                            !!profile.trainingStyle && !!profile.goal;
  
  return (
    <AppContext.Provider value={{
      profile,
      setProfile,
      isProfileComplete,
      workoutPlan,
      setWorkoutPlan,
      mealPlan,
      setMealPlan,
      todayProgress,
      updateCalorieIntake,
      updateMacroIntake,
      completeWorkout,
      reminders,
      addReminder,
      toggleReminder,
      deleteReminder,
      isLoading,
      setIsLoading,
      calculateDailyCalories,
      calculateMacroTargets,
      generatePlans,
      resetProgress
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
