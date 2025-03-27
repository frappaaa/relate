
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import DashboardPage from "./pages/DashboardPage";
import TestLocationsPage from "./pages/TestLocationsPage";
import TestLocationDetailPage from "./pages/TestLocationDetailPage";
import CalendarPage from "./pages/CalendarPage";
import NewEncounterPage from "./pages/NewEncounterPage";
import SettingsPage from "./pages/SettingsPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/app" element={<Layout />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="test-locations" element={<TestLocationsPage />} />
                <Route path="test-locations/:id" element={<TestLocationDetailPage />} />
                <Route path="calendar" element={<CalendarPage />} />
                <Route path="new-encounter" element={<NewEncounterPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
