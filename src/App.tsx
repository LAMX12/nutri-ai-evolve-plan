
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";

// Pages
import Layout from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SetupPage from "./pages/SetupPage";
import ProfilePage from "./pages/ProfilePage";
import PlansPage from "./pages/PlansPage";
import ProgressPage from "./pages/ProgressPage";
import ScannerPage from "./pages/ScannerPage";
import RemindersPage from "./pages/RemindersPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
            <Route path="/plans" element={<Layout><PlansPage /></Layout>} />
            <Route path="/progress" element={<Layout><ProgressPage /></Layout>} />
            <Route path="/scanner" element={<Layout><ScannerPage /></Layout>} />
            <Route path="/reminders" element={<Layout><RemindersPage /></Layout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
