
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Menu } from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import NavMenu from './NavMenu';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-netflixBlack/95 backdrop-blur-sm shadow-lg border-b border-netflixDarkGray">
      <div className="flex items-center justify-between p-4">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-6 h-6 text-white" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-netflixBlack border-netflixDarkGray">
            <NavMenu />
          </SheetContent>
        </Sheet>
        
        {/* Logo */}
        <div 
          className="flex-1 text-center cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <h1 className="text-netflixRed font-bold text-2xl tracking-tight">NUTRI AI</h1>
        </div>
        
        {/* Reminders button - on mobile just show icon */}
        <Button 
          variant="ghost" 
          size="icon"
          className="text-white" 
          onClick={() => navigate('/reminders')}
        >
          <CalendarDays className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden md:block border-t border-netflixDarkGray">
        <nav className="container mx-auto">
          <NavMenu horizontal />
        </nav>
      </div>
    </header>
  );
};

export default Header;
