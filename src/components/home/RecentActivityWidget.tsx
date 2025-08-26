import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Trophy, Video } from 'lucide-react';

interface RecentActivityWidgetProps {
  recentRound?: any;
  recentAnalysis?: any;
  onNavigate: (screen: string) => void;
}

export function RecentActivityWidget({ recentRound, recentAnalysis, onNavigate }: RecentActivityWidgetProps) {
  const hasActivity = recentRound || recentAnalysis;

  if (!hasActivity) {
    return (
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Trophy className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
            <p className="text-xs text-muted-foreground">Start playing to see your activity here!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-card backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-primary">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentRound && (
          <div className="flex items-center justify-between p-3 bg-background/20 backdrop-blur-sm rounded-lg">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-accent p-2 bg-accent/20 rounded-lg" />
              <div>
                <p className="font-medium text-foreground">Completed round</p>
                <p className="text-sm text-muted-foreground">
                  {recentRound.courseName} • Score: {recentRound.totalScore}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('round-history')}
            >
              View
            </Button>
          </div>
        )}

        {recentAnalysis && (
          <div className="flex items-center justify-between p-3 bg-background/20 backdrop-blur-sm rounded-lg">
            <div className="flex items-center space-x-3">
              <Video className="w-8 h-8 text-primary p-2 bg-primary/20 rounded-lg" />
              <div>
                <p className="font-medium text-foreground">Swing analyzed</p>
                <p className="text-sm text-muted-foreground">
                  {recentAnalysis.club} • Score: {recentAnalysis.score}/100
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('analyzer')}
            >
              View
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}