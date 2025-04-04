
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart2, Camera, Home, Utensils, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

interface NavMenuProps {
  horizontal?: boolean;
}

const NavMenu: React.FC<NavMenuProps> = ({ horizontal = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isProfileComplete } = useApp();
  
  const menuItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Profile', path: '/profile', icon: UserCircle },
    { name: 'Progress', path: '/progress', icon: BarChart2, requiresProfile: true },
    { name: 'Plans', path: '/plans', icon: Utensils, requiresProfile: true },
    { name: 'Food Scanner', path: '/scanner', icon: Camera, requiresProfile: true },
  ];
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className={cn(
      "flex items-center gap-2", 
      horizontal ? "flex-row justify-center py-2" : "flex-col mt-8"
    )}>
      {menuItems.map((item) => (
        <button
          key={item.name}
          onClick={() => handleNavigation(item.path)}
          disabled={item.requiresProfile && !isProfileComplete}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
            horizontal ? "mx-1" : "w-full justify-start",
            location.pathname === item.path 
              ? "bg-netflixRed text-white" 
              : "text-netflixLightGray hover:text-white",
            (item.requiresProfile && !isProfileComplete) && "opacity-50 cursor-not-allowed"
          )}
        >
          <item.icon className="w-5 h-5" />
          <span className={cn(horizontal ? "hidden md:inline" : "")}>
            {item.name}
          </span>
        </button>
      ))}
    </div>
  );
};

export default NavMenu;
