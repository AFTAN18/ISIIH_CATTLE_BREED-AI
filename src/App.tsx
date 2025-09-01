import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import pwaService, { PWAService } from "@/services/pwaService";
import offlineStorage from "@/services/offlineStorage";
import "./styles/fonts.css"; // Import fonts
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

// Import i18n configuration
import "@/lib/i18n";

const App = () => {
  const [pwaServiceState, setPwaService] = useState<PWAService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { i18n } = useTranslation();
  const queryClient = useMemo(() => new QueryClient(), []);

  // Set document direction based on language
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'ur' ? 'rtl' : 'ltr';
    
    // Add language class to body for font styling
    const languageCode = i18n.language.split('-')[0];
    document.body.className = `font-${languageCode}`;
    
    // Handle RTL for Arabic and other RTL languages
    if (i18n.language === 'ur') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [i18n.language]);

  const [showSplash, setShowSplash] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

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
      document.documentElement.dir = savedLanguage === 'ur' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLanguage;
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
            <Route path="/" element={showSplash ? <SplashScreen /> : <Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/camera" element={<CameraCapture />} />
            <Route path="/breed-results" element={<BreedResults />} />
            <Route path="/results" element={<BreedResults />} />
            <Route path="/manual-selection" element={<ManualSelection />} />
            <Route path="/profile" element={<AnimalProfile />} />
            <Route path="/learning" element={<LearningCenter />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/data-management" element={<DataManagement />} />
            <Route path="/manual-identification" element={<ManualIdentification />} />
            <Route path="/photo-database" element={<BreedPhotoDatabase />} />
            <Route path="/quiz" element={<LearningQuiz />} />
            <Route path="/splash" element={<SplashScreen />} />
            <Route path="/legacy" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
