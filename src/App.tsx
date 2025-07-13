import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Trends from "./pages/Trends";
import FestivalInsightPage from "./pages/FestivalInsightPage";
import EmailTester from "./components/EmailTester";
import DebugPage from "./pages/DebugPage";

import CampaignGenerator from "./pages/CampaignGenerator";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/trends" element={<Trends />} />
          
          <Route path="/campaigns" element={<CampaignGenerator />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Development only routes */}
          {import.meta.env.DEV && (
            <>
              <Route path="/test-email" element={<EmailTester />} />
              <Route path="/debug" element={<DebugPage />} />
            </>
          )}
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/insights/:festival" element={<FestivalInsightPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
