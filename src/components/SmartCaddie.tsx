import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ChevronLeft, Target, MapPin, Wind, Thermometer, 
  Eye, TrendingUp, Calendar, Trophy, Flag,
  Play, RotateCcw, CheckCircle, Plus, History
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { HoleMap } from './HoleMap';
import { Scorecard } from './Scorecard';

interface SmartCaddieProps {
  onBack: () => void;
}

export function SmartCaddie({ onBack }: SmartCaddieProps) {
  const [activeTab, setActiveTab] = useState<'caddie' | 'scorecard' | 'history'>('caddie');
  const [selectedClub, setSelectedClub] = useState<string | null>(null);

  const {
    currentRound,
    currentHole,
    currentWeather,
    playerStats,
    roundHistory,
    startNewRound,
    updateHoleScore,
    addShot,
    getHoleShots
  } = useAppContext();

  const courses = [
    'Pebble Beach Golf Links',
    'Augusta National',
    'St. Andrews Old Course',
    'Pinehurst No. 2',
    'Bethpage Black'
  ];

  const clubs = [
    'Driver', '3-Wood', '5-Wood', '3-Iron', '4-Iron', '5-Iron',
    '6-Iron', '7-Iron', '8-Iron', '9-Iron', 'PW', 'SW', 'LW', 'Putter'
  ];

  const handleStartNewRound = () => {
    const selectedCourse = courses[0]; // For demo, select first course
    startNewRound(selectedCourse);
    setActiveTab('caddie');
  };

  const handleRecordShot = (club: string, distance: number) => {
    if (currentRound) {
      addShot({
        holeNumber: currentHole,
        club,
        distance,
        accuracy: 'fairway', // This would be determined by user input
        x: Math.random() * 300, // Mock coordinates
        y: Math.random() * 200
      });
    }
  };

  const getClubRecommendation = () => {
    if (!currentRound) return null;

    const currentHoleData = currentRound.holes[currentHole - 1];
    const remainingDistance = 150; // Mock distance to pin
    
    // Simple club recommendation based on distance and player stats
    if (remainingDistance > 250) return 'Driver';
    if (remainingDistance > 200) return '3-Wood';
    if (remainingDistance > 180) return '5-Wood';
    if (remainingDistance > 160) return '5-Iron';
    if (remainingDistance > 140) return '6-Iron';
    if (remainingDistance > 120) return '7-Iron';
    if (remainingDistance > 100) return '8-Iron';
    if (remainingDistance > 80) return '9-Iron';
    if (remainingDistance > 60) return 'PW';
    if (remainingDistance > 40) return 'SW';
    if (remainingDistance > 20) return 'LW';
    return 'Putter';
  };

  // No Active Round State
  if (!currentRound) {
    return (
      <div className="p-4 pb-20 space-y-4 scroll-container overflow-y-auto max-h-screen">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-medium">Smart Caddie</h1>
            <p className="text-sm text-muted-foreground">Course strategy and shot tracking</p>
          </div>
        </div>

        {/* No Active Round */}
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flag className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-medium text-primary mb-2">No Active Round</h2>
            <p className="text-muted-foreground mb-6">
              Start a new round to get AI-powered course strategy and club recommendations
            </p>
            <Button 
              className="gradient-bg text-primary-foreground"
              size="lg"
              onClick={handleStartNewRound}
            >
              <Play className="w-5 h-5 mr-2" />
              Start New Round
            </Button>
          </CardContent>
        </Card>

        {/* Game History */}
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-primary flex items-center space-x-2">
              <History className="w-5 h-5" />
              <span>Round History</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {roundHistory.length > 0 ? roundHistory.map((round) => (
              <div key={round.id} className="flex items-center justify-between p-4 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{round.courseName}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{round.date.toLocaleDateString()}</span>
                      </div>
                      <span>•</span>
                      <span>{round.holes} holes</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-bold ${
                    round.totalScore <= 72 ? 'text-green-400' :
                    round.totalScore <= 80 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {round.totalScore}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {round.totalScore <= 72 ? 'Excellent' :
                     round.totalScore <= 80 ? 'Good' : 'Average'}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">No rounds played yet</p>
                <p className="text-xs text-muted-foreground">Your round history will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="gradient-card backdrop-blur-sm border-white/10">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-accent" />
              <div className="font-bold text-accent">{playerStats.averageScore}</div>
              <div className="text-xs text-muted-foreground">Average Score</div>
            </CardContent>
          </Card>
          
          <Card className="gradient-card backdrop-blur-sm border-white/10">
            <CardContent className="p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="font-bold text-green-400">{playerStats.bestScore}</div>
              <div className="text-xs text-muted-foreground">Best Score</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Active Round State
  return (
    <div className="p-0 pb-20 scroll-container overflow-y-auto max-h-screen">
      {/* Compact Header */}
      <div className="flex items-center justify-between p-4 bg-background/95 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="font-medium">Hole {currentHole}</h1>
            <p className="text-xs text-muted-foreground">{currentRound.courseName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-primary/20 text-primary border-primary/30">
            Par {currentRound.holes[currentHole - 1]?.par || 4}
          </Badge>
          <Badge className="bg-accent/20 text-accent border-accent/30">
            Score: {currentRound.holes.reduce((sum, hole) => sum + hole.strokes, 0)}
          </Badge>
        </div>
      </div>

      {/* Full-width Hole Map */}
      <div className="w-full">
        <HoleMap 
          holeNumber={currentHole}
          par={currentRound.holes[currentHole - 1]?.par || 4}
          distance={420} // Mock distance
          shots={getHoleShots(currentHole)}
          onAddShot={(shot) => handleRecordShot(shot.club, shot.distance)}
        />
      </div>

      {/* Compact Navigation Tabs */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 backdrop-blur-sm">
            <TabsTrigger 
              value="caddie"
              className={activeTab === 'caddie' ? 'gradient-bg text-primary-foreground text-sm' : 'text-sm'}
            >
              <Target className="w-4 h-4 mr-1" />
              Caddie
            </TabsTrigger>
            <TabsTrigger 
              value="scorecard"
              className={activeTab === 'scorecard' ? 'gradient-bg text-primary-foreground text-sm' : 'text-sm'}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Scorecard
            </TabsTrigger>
            <TabsTrigger 
              value="history"
              className={activeTab === 'history' ? 'gradient-bg text-primary-foreground text-sm' : 'text-sm'}
            >
              <History className="w-4 h-4 mr-1" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Caddie Tab - Club Recommendations */}
          <TabsContent value="caddie" className="space-y-4">
            {/* Weather Conditions */}
            <Card className="gradient-card backdrop-blur-sm border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Thermometer className="w-4 h-4 text-accent" />
                      <span className="text-sm">{currentWeather.temperature}°F</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Wind className="w-4 h-4 text-primary" />
                      <span className="text-sm">{currentWeather.windSpeed}mph {currentWeather.windDirection}</span>
                    </div>
                  </div>
                  <Badge className="bg-green-400/20 text-green-400 border-green-400/30">
                    <Eye className="w-3 h-3 mr-1" />
                    Good Visibility
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Club Recommendation */}
            <Card className="gradient-card backdrop-blur-sm border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-primary text-base">AI Club Recommendation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg border border-primary/30">
                  <div className="text-2xl font-bold text-primary mb-1">{getClubRecommendation()}</div>
                  <div className="text-sm text-muted-foreground">Recommended for 150y to pin</div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 bg-background/30 rounded">
                    <div className="font-medium text-accent">85%</div>
                    <div className="text-muted-foreground">Confidence</div>
                  </div>
                  <div className="text-center p-2 bg-background/30 rounded">
                    <div className="font-medium text-green-400">145y</div>
                    <div className="text-muted-foreground">Your Avg</div>
                  </div>
                  <div className="text-center p-2 bg-background/30 rounded">
                    <div className="font-medium text-yellow-400">Slight</div>
                    <div className="text-muted-foreground">Wind Effect</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Shot Entry */}
            <Card className="gradient-card backdrop-blur-sm border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-primary text-base">Record Shot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-4 gap-2">
                  {clubs.slice(0, 8).map((club) => (
                    <Button
                      key={club}
                      size="sm"
                      variant={selectedClub === club ? "default" : "outline"}
                      className={selectedClub === club ? "gradient-bg text-primary-foreground text-xs" : "text-xs border-white/20"}
                      onClick={() => setSelectedClub(club)}
                    >
                      {club}
                    </Button>
                  ))}
                </div>
                
                {selectedClub && (
                  <Button 
                    className="w-full gradient-bg text-primary-foreground"
                    onClick={() => handleRecordShot(selectedClub, 150)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Record {selectedClub} Shot
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scorecard Tab */}
          <TabsContent value="scorecard" className="space-y-0">
            <Scorecard 
              currentRound={currentRound}
              currentHole={currentHole}
              onUpdateScore={updateHoleScore}
            />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <div className="text-center py-8">
              <History className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">Shot history for this hole</p>
              <p className="text-xs text-muted-foreground">Previous shots will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}