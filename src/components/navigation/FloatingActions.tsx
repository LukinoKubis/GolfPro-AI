import { useState } from 'react';
import { Button } from '../ui/button';
import { Mic, Plus, Camera, Target, MessageSquare } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

interface FloatingActionsProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  onShowVoiceAssistant: () => void;
}

export function FloatingActions({ 
  activeScreen, 
  onNavigate, 
  onShowVoiceAssistant 
}: FloatingActionsProps) {
  const [showActions, setShowActions] = useState(false);
  const { setCurrentScreen } = useAppContext();

  const handleQuickAction = (action: string) => {
    setShowActions(false);
    
    switch (action) {
      case 'voice':
        onShowVoiceAssistant();
        break;
      case 'analyzer':
        setCurrentScreen('analyzer');
        break;
      case 'caddie':
        setCurrentScreen('caddie');
        break;
      case 'feedback':
        setCurrentScreen('feedback');
        break;
      default:
        break;
    }
  };

  // Don't show floating actions on certain screens to avoid clutter
  const hiddenScreens = ['feedback', 'settings'];
  if (hiddenScreens.includes(activeScreen)) {
    return null;
  }

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {/* Quick Actions Menu */}
      {showActions && (
        <div className="flex flex-col space-y-2 mb-2">
          <Button
            size="sm"
            className="gradient-bg text-primary-foreground shadow-lg h-10 w-10 p-0 rounded-full"
            onClick={() => handleQuickAction('voice')}
          >
            <Mic className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            className="bg-accent text-accent-foreground shadow-lg h-10 w-10 p-0 rounded-full hover:bg-accent/90"
            onClick={() => handleQuickAction('analyzer')}
          >
            <Camera className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            className="bg-green-500 text-white shadow-lg h-10 w-10 p-0 rounded-full hover:bg-green-600"
            onClick={() => handleQuickAction('caddie')}
          >
            <Target className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            className="bg-orange-500 text-white shadow-lg h-10 w-10 p-0 rounded-full hover:bg-orange-600"
            onClick={() => handleQuickAction('feedback')}
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
      )}
      
      {/* Main Floating Action Button */}
      <Button
        className={`h-14 w-14 rounded-full shadow-lg transition-transform ${
          showActions 
            ? 'gradient-bg text-primary-foreground rotate-45' 
            : 'gradient-bg text-primary-foreground hover:scale-105'
        }`}
        onClick={() => setShowActions(!showActions)}
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
}