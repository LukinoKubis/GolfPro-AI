import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Target, Zap, Cloud, Video, BarChart3, Trophy,
  Navigation, Clock, User, Settings
} from 'lucide-react';
import { VOICE_SUGGESTIONS } from '../../constants/voiceAssistant';

interface VoiceSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const SUGGESTION_ICONS = {
  'How far to the pin?': Target,
  'What club should I use?': Zap,
  'Check weather conditions': Cloud,
  'Record my swing': Video,
  'Show my stats': BarChart3,
  "What's my current score?": Trophy,
  'Start a new round': Navigation,
  'Switch to 8-iron': Zap,
  'Save this shot': Target,
  'End round': Clock
};

const SUGGESTION_COLORS = {
  'How far to the pin?': 'border-primary/30 text-primary hover:bg-primary/10',
  'What club should I use?': 'border-accent/30 text-accent hover:bg-accent/10',
  'Check weather conditions': 'border-blue-400/30 text-blue-400 hover:bg-blue-400/10',
  'Record my swing': 'border-green-400/30 text-green-400 hover:bg-green-400/10',
  'Show my stats': 'border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10',
  "What's my current score?": 'border-orange-400/30 text-orange-400 hover:bg-orange-400/10',
  'Start a new round': 'border-purple-400/30 text-purple-400 hover:bg-purple-400/10',
  'Switch to 8-iron': 'border-accent/30 text-accent hover:bg-accent/10',
  'Save this shot': 'border-primary/30 text-primary hover:bg-primary/10',
  'End round': 'border-red-400/30 text-red-400 hover:bg-red-400/10'
};

export function VoiceSuggestions({ onSuggestionClick }: VoiceSuggestionsProps) {
  const featuredSuggestions = VOICE_SUGGESTIONS.slice(0, 6);
  const allSuggestions = VOICE_SUGGESTIONS;

  return (
    <div className="space-y-4">
      {/* Quick Commands */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-primary">Quick Commands</h4>
          <Badge variant="secondary" className="text-xs">
            Tap to use
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {featuredSuggestions.map((suggestion) => {
            const Icon = SUGGESTION_ICONS[suggestion as keyof typeof SUGGESTION_ICONS] || Target;
            const colorClass = SUGGESTION_COLORS[suggestion as keyof typeof SUGGESTION_COLORS] || 'border-muted text-muted-foreground hover:bg-muted/50';
            
            return (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => onSuggestionClick(suggestion)}
                className={`justify-start h-auto p-3 bg-background/30 backdrop-blur-sm ${colorClass} text-left`}
              >
                <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-xs leading-tight">{suggestion}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Example Commands */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-primary">Example Commands</h4>
        <div className="space-y-2">
          {allSuggestions.slice(6).map((suggestion) => (
            <Button
              key={suggestion}
              variant="ghost"
              size="sm"
              onClick={() => onSuggestionClick(suggestion)}
              className="w-full justify-start h-auto p-2 text-left text-muted-foreground hover:text-foreground hover:bg-muted/30"
            >
              <span className="text-xs">"{suggestion}"</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Help Text */}
      <div className="p-3 bg-background/20 backdrop-blur-sm rounded-lg border border-white/10">
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          💡 <strong>Tip:</strong> Speak naturally! You can ask questions like "How far is it?" or give commands like "Switch to my pitching wedge."
        </p>
      </div>
    </div>
  );
}