import { Card, CardContent } from '../ui/card';
import { TrendingUp, Trophy, Calendar } from 'lucide-react';

interface QuickStatsGridProps {
  playerStats?: {
    handicap: number;
    bestScore: number;
  };
  roundCount?: number;
  onNavigate: (screen: string) => void;
}

export function QuickStatsGrid({ playerStats, roundCount = 0, onNavigate }: QuickStatsGridProps) {
  // Default player stats if none provided
  const defaultStats = {
    handicap: 0,
    bestScore: 0
  };

  const stats = playerStats || defaultStats;

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card 
        className="gradient-card backdrop-blur-sm border-white/10 cursor-pointer hover:border-white/20 transition-colors"
        onClick={() => onNavigate('stats')}
      >
        <CardContent className="p-4 text-center">
          <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-400" />
          <div className="text-lg font-bold text-green-400">{stats.handicap}</div>
          <div className="text-xs text-muted-foreground">Handicap</div>
        </CardContent>
      </Card>
      
      <Card 
        className="gradient-card backdrop-blur-sm border-white/10 cursor-pointer hover:border-white/20 transition-colors"
        onClick={() => onNavigate('stats')}
      >
        <CardContent className="p-4 text-center">
          <Trophy className="w-6 h-6 mx-auto mb-2 text-accent" />
          <div className="text-lg font-bold text-accent">{stats.bestScore}</div>
          <div className="text-xs text-muted-foreground">Best Score</div>
        </CardContent>
      </Card>
      
      <Card 
        className="gradient-card backdrop-blur-sm border-white/10 cursor-pointer hover:border-white/20 transition-colors"
        onClick={() => onNavigate('round-history')}
      >
        <CardContent className="p-4 text-center">
          <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
          <div className="text-lg font-bold text-primary">{roundCount}</div>
          <div className="text-xs text-muted-foreground">Rounds</div>
        </CardContent>
      </Card>
    </div>
  );
}