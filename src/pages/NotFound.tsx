
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-netflixBlack">
      <div className="text-center">
        <h1 className="text-9xl font-bold mb-4 text-netflixRed">404</h1>
        <p className="text-2xl text-white mb-8">Page not found</p>
        <Button 
          className="netflix-button"
          onClick={() => navigate('/')}
        >
          <Home className="mr-2 h-4 w-4" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
