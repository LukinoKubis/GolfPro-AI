import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  ChevronLeft, Video, Upload, Play, RotateCcw, 
  TrendingUp, Target, Zap, Award, Settings,
  Camera, FileVideo, Sparkles, BarChart3
} from 'lucide-react';
import { RecordingSetup } from './swing/RecordingSetup';
import { RecordingInProgress } from './swing/RecordingInProgress';
import { AnalysisProgress } from './swing/AnalysisProgress';
import { SwingResults } from './swing/SwingResults';
import { VoiceFeedbackSettings } from './swing/VoiceFeedbackSettings';
import { useAppContext } from '../contexts/AppContext';

type SwingAnalysisState = 'setup' | 'recording' | 'analyzing' | 'results';

interface SwingAnalyzerProps {
  onBack: () => void;
}

export function SwingAnalyzer({ onBack }: SwingAnalyzerProps) {
  const [analysisState, setAnalysisState] = useState<SwingAnalysisState>('setup');
  const [activeTab, setActiveTab] = useState<'record' | 'history' | 'settings'>('record');
  const [selectedClub, setSelectedClub] = useState('7-Iron');
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);

  const { swingAnalyses, addSwingAnalysis } = useAppContext();

  const handleStartRecording = (club: string) => {
    setSelectedClub(club);
    setAnalysisState('recording');
  };

  const handleStopRecording = () => {
    setAnalysisState('analyzing');
  };

  const handleAnalysisComplete = (results: any) => {
    // Create the analysis object
    const analysis = {
      club: selectedClub,
      score: results.overallScore,
      improvements: results.recommendations,
      metrics: results.metrics
    };

    // Store the current analysis for display
    setCurrentAnalysis(analysis);

    // Add the analysis to the context
    addSwingAnalysis(analysis);
    
    setAnalysisState('results');
  };

  const handleNewAnalysis = () => {
    setCurrentAnalysis(null);
    setAnalysisState('setup');
  };

  // Generate comparison data if there are previous analyses
  const getComparisonData = () => {
    if (!currentAnalysis || swingAnalyses.length < 2) {
      return null;
    }

    // Find the most recent previous analysis with the same club
    const previousAnalysis = swingAnalyses
      .filter(a => a.club === currentAnalysis.club && a.id !== currentAnalysis.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    if (!previousAnalysis) {
      return null;
    }

    const scoreChange = currentAnalysis.score - previousAnalysis.score;
    const metricsComparison = Object.keys(currentAnalysis.metrics).map(key => {
      const currentValue = parseFloat(currentAnalysis.metrics[key]) || 0;
      const previousValue = parseFloat(previousAnalysis.metrics[key]) || 0;
      return {
        name: key,
        current: currentValue,
        previous: previousValue,
        change: currentValue - previousValue
      };
    });

    return {
      scoreChange,
      metricsComparison
    };
  };

  const renderAnalysisScreen = () => {
    switch (analysisState) {
      case 'setup':
        return <RecordingSetup onStart={handleStartRecording} />;
      case 'recording':
        return <RecordingInProgress onStop={handleStopRecording} club={selectedClub} />;
      case 'analyzing':
        return <AnalysisProgress onComplete={handleAnalysisComplete} />;
      case 'results':
        return (
          <SwingResults 
            analysis={currentAnalysis}
            comparisonData={getComparisonData()}
            onNewAnalysis={handleNewAnalysis} 
          />
        );
    }
  };

  // If we're in the middle of an analysis flow, show that screen
  if (analysisState !== 'setup') {
    return (
      <div className="p-4 pb-20 space-y-6 scroll-container overflow-y-auto max-h-screen">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => setAnalysisState('setup')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-medium">AI Swing Analyzer</h1>
            <p className="text-sm text-muted-foreground">
              {analysisState === 'recording' ? 'Recording your swing...' :
               analysisState === 'analyzing' ? 'Analyzing swing data...' :
               'Swing analysis complete'}
            </p>
          </div>
        </div>
        {renderAnalysisScreen()}
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 space-y-6 scroll-container overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant={"ghost" as any} size={"sm" as any} onClick={onBack}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-medium">AI Swing Analyzer</h1>
          <p className="text-sm text-muted-foreground">Analyze your swing with AI-powered insights</p>
        </div>
      </div>

      {/* Analysis Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <Video className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-lg font-bold text-primary">{swingAnalyses.length}</div>
            <div className="text-xs text-muted-foreground">Swings Analyzed</div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-accent" />
            <div className="text-lg font-bold text-accent">
              {swingAnalyses.length > 0 ? Math.round(swingAnalyses.reduce((sum, a) => sum + a.score, 0) / swingAnalyses.length) : 0}
            </div>
            <div className="text-xs text-muted-foreground">Avg Score</div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <div className="text-lg font-bold text-green-400">
              {swingAnalyses.length >= 2 && swingAnalyses[0].score > swingAnalyses[1].score ? '+' : ''}
              {swingAnalyses.length >= 2 ? (swingAnalyses[0].score - swingAnalyses[1].score).toFixed(0) : '0'}
            </div>
            <div className="text-xs text-muted-foreground">Latest Change</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-0">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 backdrop-blur-sm rounded-none rounded-t-lg">
              <TabsTrigger 
                value="record"
                className={activeTab === 'record' ? 'gradient-bg text-primary-foreground' : ''}
              >
                <Camera className="w-4 h-4 mr-2" />
                Record
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className={activeTab === 'history' ? 'gradient-bg text-primary-foreground' : ''}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                History
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className={activeTab === 'settings' ? 'gradient-bg text-primary-foreground' : ''}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Record Tab */}
            <TabsContent value="record" className="p-6 space-y-6">
              {renderAnalysisScreen()}
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-primary">Analysis History</h3>
                <Badge variant="secondary" className="text-xs">
                  {swingAnalyses.length} analyses
                </Badge>
              </div>

              {swingAnalyses.length > 0 ? (
                <div className="space-y-3">
                  {swingAnalyses.map((analysis) => (
                    <Card key={analysis.id} className="gradient-card backdrop-blur-sm border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                              <Zap className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground">{analysis.club}</h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(analysis.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-xl font-bold ${
                              analysis.score >= 80 ? 'text-green-400' :
                              analysis.score >= 60 ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {analysis.score}
                            </div>
                            <div className="text-xs text-muted-foreground">Score</div>
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="text-center p-2 bg-background/20 rounded">
                            <div className="text-sm font-medium text-accent">{analysis.metrics.impact}</div>
                            <div className="text-xs text-muted-foreground">Impact</div>
                          </div>
                          <div className="text-center p-2 bg-background/20 rounded">
                            <div className="text-sm font-medium text-primary">{analysis.metrics.balance}</div>
                            <div className="text-xs text-muted-foreground">Balance</div>
                          </div>
                          <div className="text-center p-2 bg-background/20 rounded">
                            <div className="text-sm font-medium text-green-400">{analysis.metrics.rotation}</div>
                            <div className="text-xs text-muted-foreground">Rotation</div>
                          </div>
                        </div>

                        {/* Key Improvements */}
                        {analysis.improvements.length > 0 && (
                          <div className="p-3 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border border-accent/20">
                            <p className="text-sm text-foreground">
                              <Sparkles className="w-4 h-4 inline mr-2 text-accent" />
                              {analysis.improvements[0]}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex space-x-2 mt-3">
                          <Button className="flex-1 text-xs border-accent/30 py-1 px-2 bg-transparent border">
                            <Play className="w-3 h-3 mr-1" />
                            Replay
                          </Button>
                          <Button className="flex-1 text-xs border-primary/30 py-1 px-2 bg-transparent border">
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Compare
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground mb-4">No swing analyses yet</p>
                  <Button 
                    className="gradient-bg text-primary-foreground"
                    onClick={() => setActiveTab('record')}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Record Your First Swing
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="p-6 space-y-6">
              {/* Voice Feedback Settings */}
              <VoiceFeedbackSettings />

              {/* Analysis Settings */}
              <Card className="gradient-card backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-primary">Analysis Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
                      <div>
                        <div className="font-medium text-foreground">Auto-save recordings</div>
                        <div className="text-sm text-muted-foreground">
                          Automatically save swing videos after analysis
                        </div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
                      <div>
                        <div className="font-medium text-foreground">Detailed metrics</div>
                        <div className="text-sm text-muted-foreground">
                          Show advanced swing plane and tempo analysis
                        </div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
                      <div>
                        <div className="font-medium text-foreground">Pro comparisons</div>
                        <div className="text-sm text-muted-foreground">
                          Compare your swing to professional golfers
                        </div>
                      </div>
                      <input type="checkbox" className="w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Video Quality Settings */}
              <Card className="gradient-card backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-primary">Video Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-primary mb-2 block">Recording Quality</label>
                      <select className="w-full p-2 bg-background/50 border border-white/20 rounded-lg text-sm">
                        <option>High (1080p) - Recommended</option>
                        <option>Medium (720p)</option>
                        <option>Low (480p) - Faster processing</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-primary mb-2 block">Frame Rate</label>
                      <select className="w-full p-2 bg-background/50 border border-white/20 rounded-lg text-sm">
                        <option>120 FPS - Best for analysis</option>
                        <option>60 FPS - Good quality</option>
                        <option>30 FPS - Standard</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}