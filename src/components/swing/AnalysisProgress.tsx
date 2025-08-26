import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { Zap, Brain, Eye, Target } from 'lucide-react';

interface AnalysisProgressProps {
  onComplete: (results: any) => void;
}

export function AnalysisProgress({ onComplete }: AnalysisProgressProps) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('processing');

  useEffect(() => {
    // Simulate AI analysis progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // After 100%, wait a moment then complete
          setTimeout(() => {
            // Mock analysis results
            const results = {
              overallScore: Math.floor(Math.random() * 40) + 60, // 60-100
              metrics: {
                impact: `${Math.floor(Math.random() * 20) + 80}%`,
                balance: `${Math.floor(Math.random() * 15) + 75}%`,
                rotation: `${Math.floor(Math.random() * 25) + 70}%`
              },
              recommendations: [
                'Focus on maintaining better balance during your backswing',
                'Try to keep your head more steady throughout the swing',
                'Work on rotating your hips more actively in the downswing'
              ]
            };
            onComplete(results);
          }, 500);
          return 100;
        }
        return prev + 4; // Increase by 4% each interval
      });
    }, 150); // Update every 150ms

    // Update stage based on progress
    const stageInterval = setInterval(() => {
      setProgress(currentProgress => {
        if (currentProgress < 30) {
          setStage('processing');
        } else if (currentProgress < 60) {
          setStage('analyzing');
        } else if (currentProgress < 90) {
          setStage('calculating');
        } else {
          setStage('finalizing');
        }
        return currentProgress;
      });
    }, 200);

    return () => {
      clearInterval(interval);
      clearInterval(stageInterval);
    };
  }, [onComplete]);

  const getStageInfo = () => {
    switch (stage) {
      case 'processing':
        return {
          icon: <Eye className="w-8 h-8 text-primary-foreground" />,
          title: 'Processing Video',
          description: 'Extracting swing data from your recording...'
        };
      case 'analyzing':
        return {
          icon: <Brain className="w-8 h-8 text-primary-foreground" />,
          title: 'Analyzing Swing',
          description: 'AI is examining your swing mechanics...'
        };
      case 'calculating':
        return {
          icon: <Target className="w-8 h-8 text-primary-foreground" />,
          title: 'Calculating Metrics',
          description: 'Computing performance scores and recommendations...'
        };
      case 'finalizing':
        return {
          icon: <Zap className="w-8 h-8 text-primary-foreground" />,
          title: 'Finalizing Results',
          description: 'Preparing your personalized analysis...'
        };
      default:
        return {
          icon: <Zap className="w-8 h-8 text-primary-foreground" />,
          title: 'Analyzing Your Swing',
          description: 'AI is processing your swing data...'
        };
    }
  };

  const stageInfo = getStageInfo();

  return (
    <div className="space-y-6">
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg">
            {stageInfo.icon}
          </div>
          
          <h3 className="text-xl font-medium text-primary mb-2">{stageInfo.title}</h3>
          <p className="text-sm text-muted-foreground mb-6">
            {stageInfo.description}
          </p>
          
          <div className="space-y-4">
            <Progress value={progress} className="h-3" />
            <p className="text-sm font-medium text-accent">
              {Math.round(progress)}% complete
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Steps */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                progress >= 25 ? 'bg-green-400 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                <Eye className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className={`font-medium ${progress >= 25 ? 'text-green-400' : 'text-muted-foreground'}`}>
                  Video Processing
                </div>
                <div className="text-xs text-muted-foreground">Extract swing data</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                progress >= 50 ? 'bg-green-400 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                <Brain className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className={`font-medium ${progress >= 50 ? 'text-green-400' : 'text-muted-foreground'}`}>
                  AI Analysis
                </div>
                <div className="text-xs text-muted-foreground">Analyze swing mechanics</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                progress >= 75 ? 'bg-green-400 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                <Target className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className={`font-medium ${progress >= 75 ? 'text-green-400' : 'text-muted-foreground'}`}>
                  Score Calculation
                </div>
                <div className="text-xs text-muted-foreground">Generate metrics</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                progress >= 100 ? 'bg-green-400 text-white' : 'bg-muted text-muted-foreground'
              }`}>
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className={`font-medium ${progress >= 100 ? 'text-green-400' : 'text-muted-foreground'}`}>
                  Results Ready
                </div>
                <div className="text-xs text-muted-foreground">Personalized recommendations</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Tips */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardContent className="p-4">
          <h4 className="font-medium text-primary mb-3">Did You Know?</h4>
          <p className="text-sm text-muted-foreground">
            Our AI analyzes over 50 different data points in your swing, including club path, 
            face angle, tempo, and body positioning to provide you with the most accurate 
            feedback possible.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}