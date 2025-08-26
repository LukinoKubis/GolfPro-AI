import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  ChevronLeft, Calendar, MapPin, Trophy, Target, 
  BarChart3, Eye, TrendingUp, Clock, Award, Star
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { SCREENS } from '../../constants/navigation';

interface RoundHistoryProps {
  onBack: () => void;
  onNavigate: (screen: string, params?: any) => void;
}

interface RoundDetailProps {
  round: any;
  onBack: () => void;
}

function RoundDetail({ round, onBack }: RoundDetailProps) {
  const [activeTab, setActiveTab] = useState<'scorecard' | 'map' | 'stats'>('scorecard');

  // Generate hole data for the round
  const holes = Array.from({ length: 18 }, (_, i) => ({
    number: i + 1,
    par: [4, 3, 5, 4, 4, 3, 4, 5, 4, 4, 3, 5, 4, 4, 3, 4, 5, 4][i],
    score: Math.floor(Math.random() * 3) + 3, // Random score between 3-6
    distance: Math.floor(Math.random() * 200) + 150, // Random distance
    fairwayHit: Math.random() > 0.3,
    greenInRegulation: Math.random() > 0.4,
    putts: Math.floor(Math.random() * 3) + 1
  }));

  const totalPar = holes.reduce((sum, hole) => sum + hole.par, 0);
  const totalScore = holes.reduce((sum, hole) => sum + hole.score, 0);
  const scoreToPar = totalScore - totalPar;
  const fairwaysHit = holes.filter(h => h.fairwayHit).length;
  const girsHit = holes.filter(h => h.greenInRegulation).length;

  return (
    <div className="p-4 pb-20 space-y-6 scroll-container overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-medium">{round.courseName}</h1>
          <p className="text-sm text-muted-foreground">
            {new Date(round.date).toLocaleDateString()} • Final Score: {totalScore}
          </p>
        </div>
      </div>

      {/* Round Summary */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-3 text-center">
            <div className={`text-xl font-bold ${
              scoreToPar < 0 ? 'text-green-400' : 
              scoreToPar > 0 ? 'text-red-400' : 'text-accent'
            }`}>
              {scoreToPar > 0 ? '+' + scoreToPar : scoreToPar}
            </div>
            <div className="text-xs text-muted-foreground">Score</div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-primary">{fairwaysHit}/14</div>
            <div className="text-xs text-muted-foreground">Fairways</div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-accent">{girsHit}/18</div>
            <div className="text-xs text-muted-foreground">GIR</div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-green-400">{holes.reduce((sum, h) => sum + h.putts, 0)}</div>
            <div className="text-xs text-muted-foreground">Putts</div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Tabs */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-0">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 backdrop-blur-sm rounded-none rounded-t-lg">
              <TabsTrigger 
                value="scorecard"
                className={activeTab === 'scorecard' ? 'gradient-bg text-primary-foreground' : ''}
              >
                <Trophy className="w-4 h-4 mr-2" />
                Scorecard
              </TabsTrigger>
              <TabsTrigger 
                value="map"
                className={activeTab === 'map' ? 'gradient-bg text-primary-foreground' : ''}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Course Map
              </TabsTrigger>
              <TabsTrigger 
                value="stats"
                className={activeTab === 'stats' ? 'gradient-bg text-primary-foreground' : ''}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Statistics
              </TabsTrigger>
            </TabsList>

            {/* Scorecard Tab */}
            <TabsContent value="scorecard" className="p-4 space-y-4">
              <div className="space-y-2">
                {/* Front 9 */}
                <div className="p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
                  <h3 className="font-medium text-primary mb-3">Front 9</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left p-2">Hole</th>
                          <th className="text-center p-2">Par</th>
                          <th className="text-center p-2">Score</th>
                          <th className="text-center p-2">+/-</th>
                        </tr>
                      </thead>
                      <tbody>
                        {holes.slice(0, 9).map((hole) => (
                          <tr key={hole.number} className="border-b border-white/5">
                            <td className="p-2 font-medium">{hole.number}</td>
                            <td className="text-center p-2">{hole.par}</td>
                            <td className="text-center p-2">
                              <span className={`font-bold ${
                                hole.score < hole.par ? 'text-green-400' :
                                hole.score > hole.par ? 'text-red-400' : 'text-foreground'
                              }`}>
                                {hole.score}
                              </span>
                            </td>
                            <td className="text-center p-2">
                              <span className={`text-xs ${
                                hole.score < hole.par ? 'text-green-400' :
                                hole.score > hole.par ? 'text-red-400' : 'text-muted-foreground'
                              }`}>
                                {hole.score - hole.par > 0 ? '+' + (hole.score - hole.par) : hole.score - hole.par || 'E'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Back 9 */}
                <div className="p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
                  <h3 className="font-medium text-primary mb-3">Back 9</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left p-2">Hole</th>
                          <th className="text-center p-2">Par</th>
                          <th className="text-center p-2">Score</th>
                          <th className="text-center p-2">+/-</th>
                        </tr>
                      </thead>
                      <tbody>
                        {holes.slice(9, 18).map((hole) => (
                          <tr key={hole.number} className="border-b border-white/5">
                            <td className="p-2 font-medium">{hole.number}</td>
                            <td className="text-center p-2">{hole.par}</td>
                            <td className="text-center p-2">
                              <span className={`font-bold ${
                                hole.score < hole.par ? 'text-green-400' :
                                hole.score > hole.par ? 'text-red-400' : 'text-foreground'
                              }`}>
                                {hole.score}
                              </span>
                            </td>
                            <td className="text-center p-2">
                              <span className={`text-xs ${
                                hole.score < hole.par ? 'text-green-400' :
                                hole.score > hole.par ? 'text-red-400' : 'text-muted-foreground'
                              }`}>
                                {hole.score - hole.par > 0 ? '+' + (hole.score - hole.par) : hole.score - hole.par || 'E'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Course Map Tab */}
            <TabsContent value="map" className="p-4 space-y-4">
              <div className="space-y-3">
                <h3 className="font-medium text-primary">Hole Layout & Shots</h3>
                {holes.slice(0, 6).map((hole) => (
                  <div key={hole.number} className="p-3 bg-background/20 backdrop-blur-sm rounded-lg border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{hole.number}</span>
                        </div>
                        <div>
                          <div className="font-medium">Par {hole.par}</div>
                          <div className="text-sm text-muted-foreground">{hole.distance} yards</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          hole.score < hole.par ? 'text-green-400' :
                          hole.score > hole.par ? 'text-red-400' : 'text-foreground'
                        }`}>
                          {hole.score}
                        </div>
                      </div>
                    </div>
                    
                    {/* Hole visual representation */}
                    <div className="relative h-16 bg-golf-fairway/20 rounded-lg border border-golf-fairway/30 mb-3">
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-golf-green border border-golf-green/50 rounded-full" />
                      <div className="absolute top-1 right-1 text-xs text-golf-green">⛳</div>
                    </div>
                    
                    <div className="flex space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${hole.fairwayHit ? 'bg-green-400' : 'bg-red-400'}`} />
                        <span className="text-muted-foreground">Fairway</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${hole.greenInRegulation ? 'bg-green-400' : 'bg-red-400'}`} />
                        <span className="text-muted-foreground">GIR</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-accent">{hole.putts}</span>
                        <span className="text-muted-foreground">putts</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-accent/30 text-accent">
                  View All 18 Holes
                </Button>
              </div>
            </TabsContent>

            {/* Statistics Tab */}
            <TabsContent value="stats" className="p-4 space-y-6">
              {/* Performance Breakdown */}
              <div className="space-y-3">
                <h3 className="font-medium text-primary">Round Performance</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-background/20 backdrop-blur-sm rounded-lg text-center">
                    <div className="text-lg font-bold text-primary">{Math.round((fairwaysHit / 14) * 100)}%</div>
                    <div className="text-xs text-muted-foreground">Fairways Hit</div>
                  </div>
                  <div className="p-3 bg-background/20 backdrop-blur-sm rounded-lg text-center">
                    <div className="text-lg font-bold text-accent">{Math.round((girsHit / 18) * 100)}%</div>
                    <div className="text-xs text-muted-foreground">Greens in Reg.</div>
                  </div>
                  <div className="p-3 bg-background/20 backdrop-blur-sm rounded-lg text-center">
                    <div className="text-lg font-bold text-green-400">{(holes.reduce((sum, h) => sum + h.putts, 0) / 18).toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">Putts/Hole</div>
                  </div>
                  <div className="p-3 bg-background/20 backdrop-blur-sm rounded-lg text-center">
                    <div className="text-lg font-bold text-yellow-400">{Math.round(round.handicap * 10) / 10}</div>
                    <div className="text-xs text-muted-foreground">Round Handicap</div>
                  </div>
                </div>
              </div>

              {/* Best Holes */}
              <div className="space-y-3">
                <h3 className="font-medium text-primary">Highlights</h3>
                <div className="space-y-2">
                  {holes
                    .filter(h => h.score <= h.par)
                    .slice(0, 3)
                    .map((hole) => (
                      <div key={hole.number} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-400/10 to-primary/10 rounded-lg border border-green-400/20">
                        <div className="flex items-center space-x-3">
                          <Award className="w-5 h-5 text-green-400" />
                          <div>
                            <div className="font-medium">Hole {hole.number}</div>
                            <div className="text-sm text-muted-foreground">
                              {hole.score === hole.par - 2 ? 'Eagle!' : 
                               hole.score === hole.par - 1 ? 'Birdie!' : 'Par'}
                            </div>
                          </div>
                        </div>
                        <div className="text-green-400 font-bold">{hole.score}</div>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export function RoundHistory({ onBack, onNavigate }: RoundHistoryProps) {
  const [selectedRound, setSelectedRound] = useState<any>(null);
  const { roundHistory } = useAppContext();

  if (selectedRound) {
    return <RoundDetail round={selectedRound} onBack={() => setSelectedRound(null)} />;
  }

  return (
    <div className="p-4 pb-20 space-y-6 scroll-container overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-medium">Round History</h1>
          <p className="text-sm text-muted-foreground">View detailed statistics for each round</p>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-accent" />
            <div className="text-lg font-bold text-accent">{roundHistory.length}</div>
            <div className="text-xs text-muted-foreground">Total Rounds</div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <div className="text-lg font-bold text-green-400">
              {roundHistory.length > 0 ? Math.min(...roundHistory.map(r => r.totalScore)) : '--'}
            </div>
            <div className="text-xs text-muted-foreground">Best Score</div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-lg font-bold text-primary">
              {roundHistory.length > 0 ? 
                Math.round(roundHistory.reduce((sum, r) => sum + r.totalScore, 0) / roundHistory.length) : 
                '--'
              }
            </div>
            <div className="text-xs text-muted-foreground">Average</div>
          </CardContent>
        </Card>
      </div>

      {/* Rounds List */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Recent Rounds</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {roundHistory.length > 0 ? roundHistory.map((round) => (
            <div key={round.id} className="p-4 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 transition-colors">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-foreground">{round.courseName}</h3>
                    <Badge className={`text-xs ${
                      round.totalScore < 80 ? 'bg-green-400/20 text-green-400 border-green-400/30' :
                      round.totalScore < 90 ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30' :
                      'bg-red-400/20 text-red-400 border-red-400/30'
                    }`}>
                      {round.totalScore}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(round.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{Math.floor(Math.random() * 2) + 3}h {Math.floor(Math.random() * 60)}m</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>Handicap: {round.handicap}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setSelectedRound(round)}
                  className="border-accent/30 text-accent hover:bg-accent/10"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          )) : (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground mb-4">No rounds recorded yet</p>
              <Button 
                className="gradient-bg text-primary-foreground"
                onClick={() => onNavigate(SCREENS.CADDIE)}
              >
                Start Your First Round
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}