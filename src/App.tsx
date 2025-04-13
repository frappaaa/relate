
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";
import DashboardPage from "./pages/DashboardPage";
import TestLocationsPage from "./pages/TestLocationsPage";
import TestLocationDetailPage from "./pages/TestLocationDetailPage";
import CalendarPage from "./pages/CalendarPage";
import NewEncounterPage from "./pages/NewEncounterPage";
import NewTestPage from "./pages/NewTestPage";
import EncounterDetailPage from "./pages/EncounterDetailPage";
import EditEncounterPage from "./pages/EditEncounterPage";
import TestDetailPage from "./pages/TestDetailPage";
import EditTestPage from "./pages/EditTestPage";
import SettingsPage from "./pages/SettingsPage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Create a QueryClient instance outside the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
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
                    <Route path="new-test" element={<NewTestPage />} />
                    <Route path="encounter/:id" element={<EncounterDetailPage />} />
                    <Route path="edit-encounter/:id" element={<EditEncounterPage />} />
                    <Route path="test/:id" element={<TestDetailPage />} />
                    <Route path="edit-test/:id" element={<EditTestPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
