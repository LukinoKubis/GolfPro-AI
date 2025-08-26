import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Trophy } from 'lucide-react';
import { SCREENS } from '../../constants/navigation';

interface WeeklyChallengesWidgetProps {
  activeChallenges?: any[];
  onNavigate: (screen: string) => void;
}

export function WeeklyChallengesWidget({ activeChallenges = [], onNavigate }: WeeklyChallengesWidgetProps) {
  // Safely check if activeChallenges exists and has items
  if (!activeChallenges || activeChallenges.length === 0) {
    return (
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-primary flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span>Weekly Challenges</span>
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate(SCREENS.WEEKLY_CHALLENGES)}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">No active challenges</p>
            <p className="text-xs text-muted-foreground">Check back later for new challenges!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-card backdrop-blur-sm border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-primary flex items-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>Weekly Challenges</span>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onNavigate(SCREENS.WEEKLY_CHALLENGES)}
          >
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeChallenges.slice(0, 2).map((challenge) => (
          <div key={challenge.id} className="p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">{challenge.title}</span>
              <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">
                +{challenge.xpReward || 0} XP
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Progress</span>
                <span className="text-xs text-accent">{challenge.current || 0}/{challenge.target || 0}</span>
              </div>
              <Progress 
                value={challenge.target ? ((challenge.current || 0) / challenge.target) * 100 : 0} 
                className="h-2" 
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}