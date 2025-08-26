import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { 
  Volume2, VolumeX, Play, Pause, RotateCcw,
  MessageSquare, Settings, Headphones
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';

export function VoiceFeedbackSettings() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFeedback] = useState("Try a larger shoulder turn and maintain better balance through impact");

  const { voiceSettings, updateVoiceSettings } = useAppContext();

  const handleToggleVoiceFeedback = (enabled: boolean) => {
    updateVoiceSettings({ feedbackEnabled: enabled });
    toast.success(`Voice feedback ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handlePlayFeedback = () => {
    setIsPlaying(true);
    toast.success('Playing voice feedback...');
    
    // Simulate audio playback
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  return (
    <Card className="gradient-card backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-primary flex items-center space-x-2">
          <Headphones className="w-5 h-5" />
          <span>AI Voice Feedback</span>
          <Badge variant={voiceSettings.feedbackEnabled ? 'default' : 'secondary'} className="text-xs">
            {voiceSettings.feedbackEnabled ? 'ON' : 'OFF'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Toggle Switch */}
        <div className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg">
              {voiceSettings.feedbackEnabled ? (
                <Volume2 className="w-4 h-4 text-primary" />
              ) : (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div>
              <div className="font-medium text-foreground">Enable Voice Feedback</div>
              <div className="text-sm text-muted-foreground">
                Get audio coaching tips for your swings
              </div>
            </div>
          </div>
          <Switch
            checked={voiceSettings.feedbackEnabled}
            onCheckedChange={handleToggleVoiceFeedback}
          />
        </div>

        {/* Sample Feedback */}
        {voiceSettings.feedbackEnabled && (
          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
              <div className="flex items-start space-x-3">
                <MessageSquare className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-primary mb-2">Latest Feedback</h4>
                  <p className="text-sm text-foreground mb-3">"{currentFeedback}"</p>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary/30 text-primary hover:bg-primary/10"
                      onClick={handlePlayFeedback}
                      disabled={isPlaying}
                    >
                      {isPlaying ? (
                        <>
                          <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin mr-2" />
                          Playing...
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 mr-2" />
                          Play Audio
                        </>
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="w-3 h-3 mr-2" />
                      Replay
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Voice Settings */}
            <div className="p-3 bg-background/20 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-primary">Voice Settings</span>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Settings className="w-3 h-3 mr-1" />
                  Customize
                </Button>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Voice Speed</span>
                  <span className="text-accent">Normal</span>
                </div>
                <div className="flex justify-between">
                  <span>Voice Type</span>
                  <span className="text-accent">Professional Coach</span>
                </div>
                <div className="flex justify-between">
                  <span>Auto-play</span>
                  <span className="text-green-400">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}