import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { languages } from "@/lib/i18n";
import pwaService, { PWAService } from "@/services/pwaService";
import offlineStorage from "@/services/offlineStorage";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SplashScreen from "./pages/SplashScreen";
import Dashboard from "./pages/Dashboard";
import CameraCapture from "./pages/CameraCapture";
import BreedResults from "./pages/BreedResults";
import ManualSelection from "./pages/ManualSelection";
import AnimalProfile from "./pages/AnimalProfile";
import LearningCenter from "./pages/LearningCenter";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import DataManagement from "./pages/DataManagement";
import ManualIdentification from "./pages/ManualIdentification";
import BreedPhotoDatabase from "./components/BreedPhotoDatabase";
import LearningQuiz from "./components/LearningQuiz";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

// Import i18n configuration
import "@/lib/i18n";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize PWA functionality
        await pwaService.initialize();
        
        // Initialize offline storage
        await offlineStorage.initialize();
        
        // Set up PWA event listeners
        pwaService.onOnline(() => {
          setIsOnline(true);
          console.log('App is online');
        });
        
        pwaService.onOffline(() => {
          setIsOnline(false);
          console.log('App is offline');
        });
        
        pwaService.onUpdate((updateAvailable) => {
          setIsUpdateAvailable(updateAvailable);
          if (updateAvailable) {
            console.log('App update available');
          }
        });
        
        // Handle install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
          e.preventDefault();
          PWAService.setInstallPrompt(e);
        });
        
        console.log('App initialized successfully');
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (hasSeenOnboarding) {
      setShowSplash(false);
    }

    // Initialize language and RTL support
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      const currentLang = languages.find(lang => lang.code === savedLanguage);
      if (currentLang) {
        document.documentElement.dir = currentLang.rtl ? 'rtl' : 'ltr';
        document.documentElement.lang = savedLanguage;
      }
    }
  }, [i18n]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Online/Offline Status Indicator */}
          {!isOnline && (
            <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50">
              <div className="container-responsive">
                <span className="text-responsive-sm font-medium">
                  You are currently offline. Some features may be limited.
                </span>
              </div>
            </div>
          )}
          
          {/* Update Available Indicator */}
          {isUpdateAvailable && (
            <div className="fixed top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 z-50">
              <div className="container-responsive">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                  <span className="text-responsive-sm font-medium">
                    A new version is available
                  </span>
                  <button
                    onClick={() => pwaService.updateApp()}
                    className="btn-responsive bg-white text-blue-500 hover:bg-gray-100 touch-friendly"
                  >
                    Update Now
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={
              <ProtectedRoute requireAuth={false}>
                <Login />
              </ProtectedRoute>
            } />
            <Route path="/signup" element={
              <ProtectedRoute requireAuth={false}>
                <Signup />
              </ProtectedRoute>
            } />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                {showSplash ? <SplashScreen /> : <Dashboard />}
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/camera" element={
              <ProtectedRoute>
                <CameraCapture />
              </ProtectedRoute>
            } />
            <Route path="/breed-results" element={
              <ProtectedRoute>
                <BreedResults />
              </ProtectedRoute>
            } />
            <Route path="/results" element={
              <ProtectedRoute>
                <BreedResults />
              </ProtectedRoute>
            } />
            <Route path="/manual-selection" element={
              <ProtectedRoute>
                <ManualSelection />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <AnimalProfile />
              </ProtectedRoute>
            } />
            <Route path="/learning" element={
              <ProtectedRoute>
                <LearningCenter />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <AnalyticsDashboard />
              </ProtectedRoute>
            } />
            <Route path="/data-management" element={
              <ProtectedRoute>
                <DataManagement />
              </ProtectedRoute>
            } />
            <Route path="/manual-identification" element={
              <ProtectedRoute>
                <ManualIdentification />
              </ProtectedRoute>
            } />
            <Route path="/photo-database" element={
              <ProtectedRoute>
                <BreedPhotoDatabase />
              </ProtectedRoute>
            } />
            <Route path="/quiz" element={
              <ProtectedRoute>
                <LearningQuiz />
              </ProtectedRoute>
            } />
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/legacy" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
