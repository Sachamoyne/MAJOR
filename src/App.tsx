import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import ProfileView from "./pages/ProfileView";
import MatchScreen from "./pages/MatchScreen";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing (Web) */}
          <Route path="/" element={<Landing />} />
          
          {/* Onboarding (multi-step) */}
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* Home - Swipe (Core feature) */}
          <Route path="/home" element={<Home />} />
          
          {/* Profile detail (before match) */}
          <Route path="/profile/:id" element={<ProfileView />} />
          
          {/* Match screen */}
          <Route path="/match" element={<MatchScreen />} />
          
          {/* Messaging */}
          <Route path="/messages" element={<Messages />} />
          
          {/* My profile (DO NOT CHANGE) */}
          <Route path="/profile" element={<Profile />} />
          
          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
