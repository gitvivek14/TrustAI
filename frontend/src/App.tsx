import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import DecisionDetails from "./pages/DecisionDetails";
import Simulator from "./pages/Simulator";
import DataControls from "./pages/DataControls";
import Anomalies from "./pages/Anomalies";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile"; // Import the page

// 1. IMPORT THE WATCHDOG COMPONENT
import GlobalAlert from "@/components/GlobalAlert"; 

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      
      {/* 2. MOUNT IT HERE (Global Overlay) */}
      <GlobalAlert />
      
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/decision/:id" element={<DecisionDetails />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/data-controls" element={<DataControls />} />
            <Route path="/anomalies" element={<Anomalies />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;