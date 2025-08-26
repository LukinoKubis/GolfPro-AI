import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Mic, Brain, Volume2, CheckCircle, AlertCircle,
  Waves, Loader2, MessageSquare
} from 'lucide-react';

interface VoiceStatusDisplayProps {
  isListening: boolean;
  isProcessing: boolean;
  currentTranscript: string;
  lastResponse: string;
  pulseAnimation: boolean;
  voiceFeedbackEnabled: boolean;
  onPlayAudio: () => void;
}

export function VoiceStatusDisplay({
  isListening,
  isProcessing,
  currentTranscript,
  lastResponse,
  pulseAnimation,
  voiceFeedbackEnabled,
  onPlayAudio
}: VoiceStatusDisplayProps) {
  if (isListening) {
    return (
      <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center transition-transform duration-500 ${
          pulseAnimation ? 'scale-110' : 'scale-100'
        }`}>
          <Waves className="w-8 h-8 text-primary-foreground" />
        </div>
        <h3 className="font-medium text-primary mb-2">Listening...</h3>
        <div className="flex items-center justify-center space-x-2">
          <div className="flex space-x-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-1 h-8 bg-gradient-to-t from-primary to-accent rounded-full transition-all duration-300 ${
                  pulseAnimation && i % 2 === 0 ? 'h-12' : 'h-8'
                }`}
                style={{
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3">Speak clearly and naturally</p>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="text-center p-6 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border border-accent/20">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center">
          <Brain className="w-8 h-8 text-primary-foreground animate-pulse" />
        </div>
        <h3 className="font-medium text-accent mb-2">Processing...</h3>
        <Progress value={75} className="h-2 mb-3" />
        {currentTranscript && (
          <div className="p-3 bg-background/50 backdrop-blur-sm rounded-lg border border-white/10">
            <p className="text-sm text-muted-foreground mb-1">You said:</p>
            <p className="text-accent font-medium">"{currentTranscript}"</p>
          </div>
        )}
      </div>
    );
  }

  if (lastResponse) {
    return (
      <div className="space-y-4">
        {/* Response Display */}
        <div className="p-4 bg-gradient-to-r from-green-400/10 to-primary/10 rounded-lg border border-green-400/20">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-green-400 mb-2">Assistant Response</h4>
              <p className="text-sm text-foreground leading-relaxed">{lastResponse}</p>
            </div>
          </div>
          
          {voiceFeedbackEnabled && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <Button
                size="sm"
                variant="outline"
                onClick={onPlayAudio}
                className="border-green-400/30 text-green-400 hover:bg-green-400/10"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Play Audio Response
              </Button>
            </div>
          )}
        </div>

        {/* Ready for Next Command */}
        <div className="text-center p-4 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
          <MessageSquare className="w-6 h-6 mx-auto mb-2 text-primary opacity-70" />
          <p className="text-sm text-muted-foreground">Ready for your next command</p>
        </div>
      </div>
    );
  }

  // Initial state
  return (
    <div className="text-center p-6 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-muted to-secondary flex items-center justify-center">
        <Mic className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-medium text-primary mb-2">Voice Assistant Ready</h3>
      <p className="text-sm text-muted-foreground">
        Tap the microphone to start a voice command
      </p>
      
      {!voiceFeedbackEnabled && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <Badge variant="secondary" className="bg-orange-400/20 text-orange-400 border-orange-400/30">
            <AlertCircle className="w-3 h-3 mr-1" />
            Voice feedback disabled
          </Badge>
        </div>
      )}
    </div>
  );
}