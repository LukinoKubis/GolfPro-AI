import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Mic, MicOff, X, Volume2, Waves, Zap
} from 'lucide-react';
import { VoiceSuggestions } from './VoiceSuggestions';
import { VoiceStatusDisplay } from './VoiceStatusDisplay';
import { useAppContext } from '../../contexts/AppContext';
import { VOICE_RESPONSES, LISTENING_DURATION, PROCESSING_DURATION } from '../../constants/voiceAssistant';
import { toast } from 'sonner@2.0.3';

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceAssistant({ isOpen, onClose }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [lastResponse, setLastResponse] = useState('');
  const [pulseAnimation, setPulseAnimation] = useState(false);

  const { 
    currentWeather, 
    playerStats, 
    voiceSettings, 
    updateVoiceSettings 
  } = useAppContext();

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setPulseAnimation(prev => !prev);
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isListening]);

  const handleStartListening = () => {
    setIsListening(true);
    setCurrentTranscript('');
    toast.info('Listening... Speak now');

    // Simulate listening duration
    setTimeout(() => {
      setIsListening(false);
      setIsProcessing(true);
      
      // Mock transcript
      const mockTranscripts = [
        'How far to pin?',
        'Record shot',
        'Switch to 8 Iron',
        'Check wind conditions',
        'Show driving stats'
      ];
      
      const transcript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      setCurrentTranscript(transcript);

      // Process the command
      setTimeout(() => {
        setIsProcessing(false);
        processVoiceCommand(transcript.toLowerCase());
      }, PROCESSING_DURATION);
    }, LISTENING_DURATION);
  };

  const handleStopListening = () => {
    setIsListening(false);
    toast.info('Stopped listening');
  };

  const processVoiceCommand = (command: string) => {
    const responseKey = Object.keys(VOICE_RESPONSES).find(key => 
      command.includes(key.toLowerCase())
    );

    if (responseKey) {
      const responseGenerator = VOICE_RESPONSES[responseKey as keyof typeof VOICE_RESPONSES];
      const response = responseGenerator(currentWeather, playerStats);
      setLastResponse(response);
      
      if (voiceSettings.feedbackEnabled) {
        toast.success('Voice response ready to play');
      }
    } else {
      setLastResponse("I didn't understand that command. Try one of the suggestions below.");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentTranscript(suggestion);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      processVoiceCommand(suggestion.toLowerCase());
    }, 1000);
  };

  const handlePlayAudio = () => {
    toast.success('Playing audio response...');
    // In a real app, this would play the audio
  };

  const handleToggleVoiceFeedback = () => {
    updateVoiceSettings({ feedbackEnabled: !voiceSettings.feedbackEnabled });
    toast.success(`Voice feedback ${voiceSettings.feedbackEnabled ? 'disabled' : 'enabled'}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end justify-center p-4">
      <Card className="w-full max-w-md gradient-card backdrop-blur-md border-white/20 animate-in slide-in-from-bottom-5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-primary flex items-center space-x-2">
              <Waves className="w-5 h-5" />
              <span>Voice Assistant</span>
              <Badge variant={voiceSettings.feedbackEnabled ? 'default' : 'secondary'} className="text-xs">
                {voiceSettings.feedbackEnabled ? 'Voice ON' : 'Voice OFF'}
              </Badge>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleVoiceFeedback}
                className="text-accent"
              >
                {voiceSettings.feedbackEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4 opacity-50" />
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Voice Status */}
          <VoiceStatusDisplay
            isListening={isListening}
            isProcessing={isProcessing}
            currentTranscript={currentTranscript}
            lastResponse={lastResponse}
            pulseAnimation={pulseAnimation}
            voiceFeedbackEnabled={voiceSettings.feedbackEnabled}
            onPlayAudio={handlePlayAudio}
          />

          {/* Microphone Controls */}
          <div className="text-center">
            {!isListening && !isProcessing ? (
              <Button
                className="w-16 h-16 rounded-full gradient-bg text-primary-foreground hover:scale-105 transition-transform"
                onClick={handleStartListening}
              >
                <Mic className="w-6 h-6" />
              </Button>
            ) : (
              <Button
                className="w-16 h-16 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                onClick={handleStopListening}
                disabled={isProcessing}
              >
                <MicOff className="w-6 h-6" />
              </Button>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              {isListening ? 'Tap to stop listening' : 'Tap to start listening'}
            </p>
          </div>

          {/* Voice Suggestions */}
          {!isListening && !isProcessing && (
            <VoiceSuggestions onSuggestionClick={handleSuggestionClick} />
          )}

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 border-accent/30 text-accent hover:bg-accent/10"
              onClick={() => handleSuggestionClick('How far to pin?')}
            >
              <Zap className="w-4 h-4 mr-2" />
              Quick Distance
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 border-primary/30 text-primary hover:bg-primary/10"
              onClick={() => handleSuggestionClick('Check wind conditions')}
            >
              <Waves className="w-4 h-4 mr-2" />
              Weather
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}