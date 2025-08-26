import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { MapPin } from 'lucide-react';
import { SCREENS } from '../../constants/navigation';

interface CurrentRoundWidgetProps {
  currentRound: any;
  currentHole: number;
  onNavigate: (screen: string) => void;
}

export function CurrentRoundWidget({ currentRound, currentHole, onNavigate }: CurrentRoundWidgetProps) {
  if (!currentRound) return null;

  return (
    <Card className="gradient-card backdrop-blur-sm border-accent/20">
      <CardHeader>
        <CardTitle className="text-primary flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <span>Current Round</span>
          <Badge className="bg-green-400/20 text-green-400 border-green-400/30">
            Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground">{currentRound.courseName}</h3>
            <p className="text-sm text-muted-foreground">
              Hole {currentHole} of 18 • {currentRound.totalScore} strokes
            </p>
          </div>
          <Button 
            className="gradient-bg text-primary-foreground"
            onClick={() => onNavigate(SCREENS.CADDIE)}
          >
            Continue Round
          </Button>
        </div>
        <Progress value={(currentHole / 18) * 100} className="h-2" />
      </CardContent>
    </Card>
  );
}