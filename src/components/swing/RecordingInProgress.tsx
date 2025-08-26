import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Square, Camera, Zap } from 'lucide-react';

interface RecordingInProgressProps {
  club: string;
  onStop: () => void;
}

export function RecordingInProgress({ club, onStop }: RecordingInProgressProps) {
  const [recordingTime, setRecordingTime] = useState(0);
  const maxTime = 8; // 8 second recording time
  
  useEffect(() => {
    const timer = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= maxTime) {
          onStop(); // Auto-stop when max time reached
          return maxTime;
        }
        return prev + 0.1;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [maxTime, onStop]);

  const progressPercentage = (recordingTime / maxTime) * 100;
  const remainingTime = Math.max(0, maxTime - recordingTime);

  return (
    <div className="space-y-6">
      {/* Recording Status */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardContent className="p-8 text-center">
          <div className="w-32 h-32 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg">
            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h3 className="font-medium text-primary mb-2">Recording Your Swing</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {club} • {remainingTime.toFixed(1)}s remaining
          </p>
          
          <div className="w-full bg-muted/50 rounded-full h-3 mb-6 overflow-hidden">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-100 ease-out"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>

          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-red-500 mb-1">
              {recordingTime.toFixed(1)}s
            </div>
            <div className="text-sm text-muted-foreground">
              Hold steady and complete your swing
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={onStop}
            className="border-red-500 text-red-500 hover:bg-red-500/10 transition-colors"
            size="lg"
          >
            <Square className="w-5 h-5 mr-2" />
            Stop Recording
          </Button>
        </CardContent>
      </Card>

      {/* Recording Tips */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Zap className="w-5 h-5 text-accent" />
            <h4 className="font-medium text-primary">Recording Tips</h4>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Keep the camera steady and maintain full body view</p>
            <p>• Ensure good lighting for best analysis results</p>
            <p>• Take your normal swing - don't overcompensate</p>
            <p>• Recording will auto-stop at {maxTime} seconds</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}