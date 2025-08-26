import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Star, Crown, Target, MessageSquare } from 'lucide-react';
import { SCREENS } from '../../constants/navigation';

interface FeatureDiscoveryWidgetProps {
  onNavigate: (screen: string) => void;
}

const FEATURED_ITEMS = [
  {
    screen: SCREENS.TOURNAMENT_MODE,
    icon: Crown,
    title: 'Join Tournaments',
    description: 'Compete with friends and players worldwide',
    color: 'text-yellow-400'
  },
  {
    screen: SCREENS.RANGE_MODE,
    icon: Target,
    title: 'Practice Range Mode',
    description: 'Track your practice sessions with detailed analytics',
    color: 'text-green-400'
  },
  {
    screen: SCREENS.FEEDBACK,
    icon: MessageSquare,
    title: 'Share Feedback',
    description: 'Help us improve your golfing experience',
    color: 'text-accent'
  }
];

export function FeatureDiscoveryWidget({ onNavigate }: FeatureDiscoveryWidgetProps) {
  return (
    <Card className="gradient-card backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-primary flex items-center space-x-2">
          <Star className="w-5 h-5" />
          <span>Discover Features</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {FEATURED_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Button 
              key={item.screen}
              variant="outline" 
              className="w-full justify-start bg-background/30 border-white/20 backdrop-blur-sm hover:bg-background/50"
              onClick={() => onNavigate(item.screen)}
            >
              <Icon className={`w-5 h-5 mr-3 ${item.color}`} />
              <div className="text-left">
                <div className="font-medium">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}