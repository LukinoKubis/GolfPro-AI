import { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { BottomNavigation } from './components/BottomNavigation';
import { ScreenRenderer } from './components/navigation/ScreenRenderer';
import { FloatingActions } from './components/navigation/FloatingActions';
import { VoiceAssistant } from './components/voice/VoiceAssistant';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const { currentScreen, setCurrentScreen, userSettings } = useAppContext();

  // Apply theme on mount and when theme changes
  useEffect(() => {
    const isDark = userSettings.theme === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [userSettings.theme]);

  // Apply dark theme by default on initial mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleNavigate = (screen: string, params?: any) => {
    setCurrentScreen(screen);
  };

  const handleShowVoiceAssistant = () => {
    setShowVoiceAssistant(true);
  };

  const handleCloseVoiceAssistant = () => {
    setShowVoiceAssistant(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="relative min-h-screen">
        <ScreenRenderer 
          activeScreen={currentScreen}
          onNavigate={handleNavigate}
        />
      </main>

      {/* Floating Action Buttons */}
      <FloatingActions
        activeScreen={currentScreen}
        onNavigate={handleNavigate}
        onShowVoiceAssistant={handleShowVoiceAssistant}
      />

      {/* Voice Assistant Overlay */}
      <VoiceAssistant 
        isOpen={showVoiceAssistant}
        onClose={handleCloseVoiceAssistant}
      />

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={currentScreen} 
        onTabChange={setCurrentScreen} 
      />

      {/* Toast Notifications */}
      <Toaster 
        position="top-center"
        expand={false}
        richColors
        theme={userSettings.theme}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}