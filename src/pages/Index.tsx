
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Dumbbell, LineChart, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';

const Index = () => {
  const navigate = useNavigate();
  const { isProfileComplete } = useApp();
  
  // If profile is setup, navigate to plans page
  useEffect(() => {
    if (isProfileComplete) {
      navigate('/plans');
    }
  }, [isProfileComplete, navigate]);

  return (
    <div className="min-h-screen bg-netflixBlack text-white">
      {/* Hero Section */}
      <section className="h-[80vh] relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-netflixBlack via-netflixBlack/90 to-netflixBlack/30 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438')] bg-cover bg-center opacity-30"></div>
        
        <div className="container mx-auto px-4 z-20 text-center">
          <h1 className="text-netflixRed font-bold text-6xl mb-4 animate-pulse-red">NUTRI AI</h1>
          <p className="text-2xl mb-8 max-w-2xl mx-auto">
            Your personalized nutrition and fitness plan powered by AI
          </p>
          <Button 
            className="netflix-button text-lg py-6 px-8"
            onClick={() => navigate('/setup')}
          >
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-netflixBlack">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Dumbbell className="w-8 h-8 text-netflixRed" />}
              title="Personalized Workout Plans"
              description="AI-generated workout routines based on your body metrics and fitness goals"
            />
            
            <FeatureCard 
              icon={<Utensils className="w-8 h-8 text-netflixRed" />}
              title="Custom Meal Plans"
              description="Nutrition plans tailored to your fitness goals, with precise macro calculations"
            />
            
            <FeatureCard 
              icon={<LineChart className="w-8 h-8 text-netflixRed" />}
              title="Progress Tracking"
              description="Monitor your daily nutrition and workout progress with detailed visualizations"
            />
            
            <FeatureCard 
              icon={<Camera className="w-8 h-8 text-netflixRed" />}
              title="Food Scanner"
              description="Instantly analyze food nutrition by taking a photo of your meals"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// Simple feature card component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <Card className="bg-netflixDarkGray border-netflixDarkGray hover:border-netflixRed transition-colors">
      <CardContent className="pt-6">
        <div className="w-16 h-16 rounded-full bg-netflixRed/10 flex items-center justify-center mb-4 mx-auto">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-center">{title}</h3>
        <p className="text-netflixLightGray text-center">
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

// Import missing Camera icon
import { Camera } from 'lucide-react';

export default Index;
