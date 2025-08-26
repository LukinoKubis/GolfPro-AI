import { Card, CardContent } from '../ui/card';
import { Video, Target, BookOpen, BarChart3 } from 'lucide-react';
import { SCREENS } from '../../constants/navigation';

interface QuickActionsGridProps {
  onNavigate: (screen: string) => void;
}

const QUICK_ACTIONS = [
  {
    screen: SCREENS.ANALYZER,
    icon: Video,
    title: 'Swing Analyzer',
    description: 'AI-powered analysis',
    color: 'text-primary'
  },
  {
    screen: SCREENS.CADDIE,
    icon: Target,
    title: 'Smart Caddie',
    description: 'Club recommendations',
    color: 'text-accent'
  },
  {
    screen: SCREENS.COACH,
    icon: BookOpen,
    title: 'Virtual Coach',
    description: 'Personalized training',
    color: 'text-green-400'
  },
  {
    screen: SCREENS.STATS,
    icon: BarChart3,
    title: 'Stats Analyzer',
    description: 'Performance insights',
    color: 'text-yellow-400'
  }
];

export function QuickActionsGrid({ onNavigate }: QuickActionsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {QUICK_ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <Card 
            key={action.screen}
            className="gradient-card backdrop-blur-sm border-white/10 hover:border-white/20 transition-colors cursor-pointer" 
            onClick={() => onNavigate(action.screen)}
          >
            <CardContent className="p-4 text-center">
              <Icon className={`w-8 h-8 mx-auto mb-3 ${action.color}`} />
              <h3 className="font-medium mb-1">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}