
import React from 'react';
import Header from './Header';
import { useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Loader } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoading } = useApp();
  const location = useLocation();
  const isSetupPage = location.pathname === '/setup';
  
  return (
    <div className="min-h-screen bg-netflixBlack text-white flex flex-col">
      {!isSetupPage && <Header />}
      
      <main className={`flex-1 ${!isSetupPage ? 'pt-16 md:pt-24' : ''}`}>
        {isLoading ? (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="text-center">
              <Loader className="w-12 h-12 mx-auto animate-spin text-netflixRed" />
              <p className="mt-4 text-xl font-semibold">Processing...</p>
            </div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
};

export default Layout;
