import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { 
  ChevronLeft, Target, Zap, BarChart3, Save, RotateCcw, 
  TrendingUp, Award, Plus, Trash2, Clock, MapPin
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';
import { GOLF_CLUBS } from '../../constants/golf';

interface RangeModeProps {
  onBack: () => void;
}

export function RangeMode({ onBack }: RangeModeProps) {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [selectedClub, setSelectedClub] = useState('7-Iron');
  const [shotDistance, setShotDistance] = useState('');
  const [shotDispersion, setShotDispersion] = useState('');
  const [sessionDuration, setSessionDuration] = useState(0);

  const {
    rangeSessions,
    startRangeSession,
    addRangeShot,
    endRangeSession,
    playerStats,
    updatePlayerStats
  } = useAppContext();

  const activeSession = rangeSessions.find(s => s.id === activeSessionId);

  // Timer for session duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeSessionId) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSessionId]);

  const handleStartSession = () => {
    const sessionId = startRangeSession(selectedClub);
    setActiveSessionId(sessionId);
    setSessionDuration(0);
    toast.success(`Range session started with ${selectedClub}`);
  };

  const handleAddShot = () => {
    if (!activeSessionId || !shotDistance) {
      toast.error('Please enter shot distance');
      return;
    }

    const distance = parseInt(shotDistance);
    const dispersion = parseInt(shotDispersion) || 0;

    if (distance < 50 || distance > 400) {
      toast.error('Please enter a realistic distance (50-400 yards)');
      return;
    }

    addRangeShot(activeSessionId, distance, dispersion);
    setShotDistance('');
    setShotDispersion('');
    toast.success('Shot recorded!');
  };

  const handleEndSession = () => {
    if (!activeSessionId) return;

    endRangeSession(activeSessionId);
    
    // Update player stats if session has enough shots
    if (activeSession && activeSession.totalShots >= 5) {
      updatePlayerStats({
        averageDistances: {
          ...playerStats.averageDistances,
          [activeSession.club]: activeSession.averageDistance
        }
      });
      toast.success('Session saved and stats updated!');
    } else {
      toast.success('Session saved!');
    }
    
    setActiveSessionId(null);
    setSessionDuration(0);
  };

  const handleClubChange = (club: string) => {
    if (activeSessionId) {
      toast.error('End current session before switching clubs');
      return;
    }
    setSelectedClub(club);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionStats = () => {
    if (!activeSession || activeSession.totalShots === 0) return null;

    const shots = activeSession.shots;
    const consistency = 100 - (activeSession.dispersion || 0);
    const improvement = activeSession.averageDistance - (playerStats.averageDistances[activeSession.club] || 0);

    return {
      totalShots: activeSession.totalShots,
      averageDistance: activeSession.averageDistance,
      bestDistance: activeSession.bestDistance,
      consistency: Math.max(0, Math.min(100, consistency)),
      improvement: Math.round(improvement)
    };
  };

  const sessionStats = getSessionStats();

  return (
    <div className="p-4 pb-20 space-y-6 scroll-container overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-medium">Practice Range</h1>
          <p className="text-sm text-muted-foreground">
            {activeSessionId ? `Active session • ${formatTime(sessionDuration)}` : 'Track your practice shots'}
          </p>
        </div>
      </div>

      {/* Session Status */}
      {activeSessionId && (
        <Card className="gradient-card backdrop-blur-sm border-accent/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <div>
                  <div className="font-medium text-primary">Session Active</div>
                  <div className="text-sm text-muted-foreground">
                    {selectedClub} • {formatTime(sessionDuration)}
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleEndSession}
                className="border-accent/30 text-accent hover:bg-accent/10"
              >
                <Save className="w-4 h-4 mr-2" />
                End Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Club Selection */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Club Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedClub} onValueChange={handleClubChange}>
            <SelectTrigger className="bg-background/50 border-white/20 backdrop-blur-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="gradient-card border-white/20 backdrop-blur-sm">
              {GOLF_CLUBS.map((club) => (
                <SelectItem key={club} value={club}>
                  <div className="flex items-center justify-between w-full">
                    <span>{club}</span>
                    <span className="text-xs text-muted-foreground ml-4">
                      {playerStats.averageDistances[club]}y avg
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {!activeSessionId ? (
            <Button 
              className="w-full gradient-bg text-primary-foreground"
              onClick={handleStartSession}
              size="lg"
            >
              <Target className="w-5 h-5 mr-2" />
              Start Practice Session
            </Button>
          ) : (
            <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-sm text-accent text-center">
                Session active with {selectedClub}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shot Entry */}
      {activeSessionId && (
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-primary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Record Shot</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-primary mb-2 block">Distance (yards)</label>
                <Input
                  type="number"
                  placeholder="145"
                  value={shotDistance}
                  onChange={(e) => setShotDistance(e.target.value)}
                  className="bg-background/50 border-white/20 backdrop-blur-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-primary mb-2 block">Dispersion (yards)</label>
                <Input
                  type="number"
                  placeholder="5"
                  value={shotDispersion}
                  onChange={(e) => setShotDispersion(e.target.value)}
                  className="bg-background/50 border-white/20 backdrop-blur-sm"
                />
              </div>
            </div>
            
            <Button 
              className="w-full gradient-bg text-primary-foreground"
              onClick={handleAddShot}
              disabled={!shotDistance}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Shot
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Session Stats */}
      {sessionStats && (
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-primary flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Session Statistics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-primary">{sessionStats.totalShots}</div>
                <div className="text-xs text-muted-foreground">Total Shots</div>
              </div>
              <div className="text-center p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-accent">{sessionStats.averageDistance}y</div>
                <div className="text-xs text-muted-foreground">Average</div>
              </div>
              <div className="text-center p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-green-400">{sessionStats.bestDistance}y</div>
                <div className="text-xs text-muted-foreground">Best Shot</div>
              </div>
              <div className="text-center p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="text-2xl font-bold text-yellow-400">{sessionStats.consistency}%</div>
                <div className="text-xs text-muted-foreground">Consistency</div>
              </div>
            </div>

            {sessionStats.improvement !== 0 && (
              <div className="p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">Improvement vs Average</span>
                  <div className="flex items-center space-x-2">
                    {sessionStats.improvement > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-400" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                    )}
                    <span className={`font-bold ${
                      sessionStats.improvement > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {sessionStats.improvement > 0 ? '+' : ''}{sessionStats.improvement}y
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Session Progress</span>
                <span className="text-sm text-accent">{sessionStats.totalShots}/20 shots</span>
              </div>
              <Progress value={Math.min(100, (sessionStats.totalShots / 20) * 100)} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Sessions */}
      {rangeSessions.length > 0 && (
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-primary flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>Recent Sessions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rangeSessions.slice(0, 5).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{session.club}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(session.date).toLocaleDateString()} • {session.totalShots} shots
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-accent">{session.averageDistance}y</div>
                  <div className="text-xs text-muted-foreground">avg</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Award className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-primary mb-1">Practice Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Record at least 10 shots for accurate statistics</li>
                <li>• Focus on consistency over maximum distance</li>
                <li>• Track dispersion to improve accuracy</li>
                <li>• Practice with different clubs in each session</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}