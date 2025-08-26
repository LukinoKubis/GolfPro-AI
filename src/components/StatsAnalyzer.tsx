import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  ChevronLeft, TrendingUp, Target, Zap, Trophy, 
  Calendar, BarChart3, PieChart, Activity, MapPin,
  Award, Star, Clock, Users, ArrowUp, ArrowDown,
  Flame, Crown, Crosshair
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

interface StatsAnalyzerProps {
  onBack: () => void;
}

export function StatsAnalyzer({ onBack }: StatsAnalyzerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'trends'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const {
    playerStats,
    roundHistory,
    swingAnalyses,
    currentUser,
    setCurrentScreen
  } = useAppContext();

  const totalRounds = roundHistory.length;
  const avgScore = playerStats.averageScore;
  const bestScore = playerStats.bestScore;
  const handicap = playerStats.handicap;

  // Calculate trends (mock data for demo)
  const scoreTrend = -2.3; // Improvement
  const handicapTrend = -0.8;
  const consistencyScore = 78;

  // Recent performance
  const recentRounds = roundHistory.slice(0, 5);
  const recentAvg = recentRounds.length > 0 
    ? recentRounds.reduce((sum, round) => sum + round.totalScore, 0) / recentRounds.length 
    : avgScore;

  const improvement = avgScore - recentAvg;

  const handleViewHeatmap = () => {
    setCurrentScreen('heatmap-visualization');
  };

  return (
    <div className="p-4 pb-20 space-y-6 scroll-container overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-medium">Performance Analytics</h1>
          <p className="text-sm text-muted-foreground">Track your progress and identify areas for improvement</p>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold text-accent">{bestScore}</div>
            <div className="text-xs text-muted-foreground">Best Round</div>
            {improvement > 0 && (
              <Badge className="mt-1 bg-green-400/20 text-green-400 border-green-400/30 text-xs">
                <ArrowUp className="w-3 h-3 mr-1" />
                Improving
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold text-primary">{handicap}</div>
            <div className="text-xs text-muted-foreground">Handicap</div>
            {handicapTrend < 0 && (
              <Badge className="mt-1 bg-green-400/20 text-green-400 border-green-400/30 text-xs">
                <ArrowDown className="w-3 h-3 mr-1" />
                {Math.abs(handicapTrend).toFixed(1)}
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Tabs */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-0">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 backdrop-blur-sm rounded-none rounded-t-lg">
              <TabsTrigger 
                value="overview"
                className={activeTab === 'overview' ? 'gradient-bg text-primary-foreground' : ''}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="detailed"
                className={activeTab === 'detailed' ? 'gradient-bg text-primary-foreground' : ''}
              >
                <PieChart className="w-4 h-4 mr-2" />
                Detailed
              </TabsTrigger>
              <TabsTrigger 
                value="trends"
                className={activeTab === 'trends' ? 'gradient-bg text-primary-foreground' : ''}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Trends
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6 space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Average Score</span>
                    <Activity className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary">{avgScore.toFixed(1)}</div>
                  <div className="flex items-center mt-1">
                    {scoreTrend < 0 ? (
                      <ArrowDown className="w-3 h-3 text-green-400 mr-1" />
                    ) : (
                      <ArrowUp className="w-3 h-3 text-red-400 mr-1" />
                    )}
                    <span className={`text-xs ${scoreTrend < 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {Math.abs(scoreTrend).toFixed(1)} vs last month
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Rounds Played</span>
                    <Calendar className="w-4 h-4 text-accent" />
                  </div>
                  <div className="text-2xl font-bold text-accent">{totalRounds}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {Math.round(totalRounds / 6)} per month avg
                  </div>
                </div>
              </div>

              {/* Performance Areas */}
              <div className="space-y-3">
                <h3 className="font-medium text-primary">Performance Breakdown</h3>
                
                <div className="space-y-3">
                  <div className="p-3 bg-background/20 backdrop-blur-sm rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">Driving Accuracy</span>
                      <span className="text-sm font-medium text-accent">{playerStats.drivingAccuracy}%</span>
                    </div>
                    <Progress value={playerStats.drivingAccuracy} className="h-2" />
                  </div>
                  
                  <div className="p-3 bg-background/20 backdrop-blur-sm rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">Green in Regulation</span>
                      <span className="text-sm font-medium text-green-400">{playerStats.greenInRegulation}%</span>
                    </div>
                    <Progress value={playerStats.greenInRegulation} className="h-2" />
                  </div>
                  
                  <div className="p-3 bg-background/20 backdrop-blur-sm rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">Putting Average</span>
                      <span className="text-sm font-medium text-yellow-400">{playerStats.puttingAverage}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">putts per hole</div>
                  </div>
                </div>
              </div>

              {/* Shot Pattern Analysis */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-primary">Shot Pattern Analysis</h3>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleViewHeatmap}
                    className="border-accent/30 text-accent hover:bg-accent/10"
                  >
                    <Crosshair className="w-4 h-4 mr-2" />
                    View Heatmap
                  </Button>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <h4 className="font-medium text-primary">Shot Dispersion Insights</h4>
                      <p className="text-sm text-muted-foreground">Based on your recent rounds</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-green-400">72%</div>
                      <div className="text-xs text-muted-foreground">Fairways Hit</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-blue-400">58%</div>
                      <div className="text-xs text-muted-foreground">GIR</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Detailed Tab */}
            <TabsContent value="detailed" className="p-6 space-y-6">
              {/* Club Performance */}
              <div className="space-y-3">
                <h3 className="font-medium text-primary">Club Performance</h3>
                <div className="space-y-2">
                  {Object.entries(playerStats.averageDistances).slice(0, 6).map(([club, distance]) => (
                    <div key={club} className="flex items-center justify-between p-3 bg-background/20 backdrop-blur-sm rounded-lg">
                      <span className="text-sm text-foreground">{club}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium text-accent">{distance}y</div>
                        <div className="text-xs text-muted-foreground">
                          {playerStats.accuracy[club] || 85}% accuracy
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Analysis */}
              <div className="space-y-3">
                <h3 className="font-medium text-primary">Swing Analysis History</h3>
                <div className="space-y-2">
                  {swingAnalyses.slice(0, 3).map((analysis) => (
                    <div key={analysis.id} className="p-3 bg-background/20 backdrop-blur-sm rounded-lg border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-accent" />
                          <span className="text-sm font-medium text-foreground">{analysis.club}</span>
                        </div>
                        <Badge className={`text-xs ${
                          analysis.score >= 80 ? 'bg-green-400/20 text-green-400 border-green-400/30' :
                          analysis.score >= 60 ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30' :
                          'bg-red-400/20 text-red-400 border-red-400/30'
                        }`}>
                          {analysis.score}/100
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {analysis.improvements[0] || 'Great form!'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consistency Score */}
              <div className="p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border border-accent/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-accent" />
                    <span className="font-medium text-primary">Consistency Score</span>
                  </div>
                  <div className="text-2xl font-bold text-accent">{consistencyScore}</div>
                </div>
                <Progress value={consistencyScore} className="h-3 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Based on score variance and performance stability
                </p>
              </div>
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends" className="p-6 space-y-6">
              {/* Performance Timeline */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-primary">Performance Timeline</h3>
                  <div className="flex space-x-1">
                    {(['week', 'month', 'year'] as const).map((period) => (
                      <Button
                        key={period}
                        size="sm"
                        variant={selectedPeriod === period ? 'default' : 'ghost'}
                        onClick={() => setSelectedPeriod(period)}
                        className={selectedPeriod === period ? 'gradient-bg text-primary-foreground text-xs' : 'text-xs'}
                      >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Mock trend chart area */}
                <div className="h-32 bg-background/20 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-400" />
                    <p className="text-sm text-green-400 font-medium">Improving Trend</p>
                    <p className="text-xs text-muted-foreground">
                      Average score down {Math.abs(scoreTrend).toFixed(1)} strokes
                    </p>
                  </div>
                </div>
              </div>

              {/* Goals & Achievements */}
              <div className="space-y-3">
                <h3 className="font-medium text-primary">Goals & Milestones</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-background/20 backdrop-blur-sm rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">Break 80</span>
                      <Star className="w-4 h-4 text-yellow-400" />
                    </div>
                    <Progress value={((80 - bestScore) / (80 - 100)) * 100} className="h-2 mb-1" />
                    <p className="text-xs text-muted-foreground">
                      {80 - bestScore} strokes to go
                    </p>
                  </div>
                  
                  <div className="p-3 bg-background/20 backdrop-blur-sm rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-foreground">Single Digit Handicap</span>
                      <Crown className="w-4 h-4 text-accent" />
                    </div>
                    <Progress value={((15 - handicap) / (15 - 9)) * 100} className="h-2 mb-1" />
                    <p className="text-xs text-muted-foreground">
                      {(handicap - 9).toFixed(1)} strokes to single digit
                    </p>
                  </div>
                </div>
              </div>

              {/* Improvement Recommendations */}
              <div className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                <div className="flex items-center space-x-2 mb-3">
                  <Flame className="w-5 h-5 text-primary" />
                  <span className="font-medium text-primary">Focus Areas</span>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Work on short game - putting average could improve</li>
                  <li>• Practice approach shots for better GIR percentage</li>
                  <li>• Continue consistent driving performance</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Rounds Summary */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Recent Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentRounds.length > 0 ? recentRounds.map((round) => (
            <div key={round.id} className="flex items-center justify-between p-3 bg-background/20 backdrop-blur-sm rounded-lg">
              <div>
                <div className="font-medium text-foreground">{round.courseName}</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(round.date).toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  round.totalScore < avgScore ? 'text-green-400' : 
                  round.totalScore > avgScore ? 'text-red-400' : 'text-accent'
                }`}>
                  {round.totalScore}
                </div>
                <div className="text-xs text-muted-foreground">
                  {round.totalScore < avgScore ? `${avgScore - round.totalScore} under avg` :
                   round.totalScore > avgScore ? `${round.totalScore - avgScore} over avg` :
                   'average'}
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-6">
              <Trophy className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">No recent rounds recorded</p>
              <p className="text-xs text-muted-foreground">Start a new round to track your progress</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}