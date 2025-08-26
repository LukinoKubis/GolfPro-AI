import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  ChevronLeft, Trophy, Target, Zap, TrendingUp, Award, 
  Star, Calendar, Clock, Crown, Gift, CheckCircle, Flame
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface WeeklyChallengesProps {
  onBack: () => void;
}

export function WeeklyChallenges({ onBack }: WeeklyChallengesProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);

  const {
    weeklyChallenges,
    updateChallengeProgress,
    completeChallenge,
    currentUser,
    updateCurrentUser
  } = useAppContext();

  const completedChallenges = weeklyChallenges.filter(c => c.completed);
  const activeChallenges = weeklyChallenges.filter(c => !c.completed);
  const totalXpEarned = completedChallenges.reduce((sum, c) => sum + c.xpReward, 0);
  const totalPossibleXp = weeklyChallenges.reduce((sum, c) => sum + c.xpReward, 0);

  const handleCompleteChallenge = (challengeId: string) => {
    const challenge = weeklyChallenges.find(c => c.id === challengeId);
    if (!challenge || challenge.current < challenge.target) {
      toast.error('Challenge requirements not met');
      return;
    }

    completeChallenge(challengeId);
    toast.success(`Challenge completed! +${challenge.xpReward} XP earned 🎉`);
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'fairways':
        return Target;
      case 'distance':
        return Zap;
      case 'rounds':
        return Trophy;
      case 'accuracy':
        return Award;
      default:
        return Star;
    }
  };

  const getChallengeColor = (type: string) => {
    switch (type) {
      case 'fairways':
        return 'text-green-400';
      case 'distance':
        return 'text-blue-400';
      case 'rounds':
        return 'text-yellow-400';
      case 'accuracy':
        return 'text-purple-400';
      default:
        return 'text-primary';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-gradient-to-r from-green-400 to-green-600';
    if (progress >= 75) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (progress >= 50) return 'bg-gradient-to-r from-blue-400 to-blue-600';
    return 'bg-gradient-to-r from-gray-400 to-gray-600';
  };

  // Calculate streak (mock data)
  const weeklyStreak = 3;
  const isStreakActive = weeklyStreak > 0;

  return (
    <div className="p-4 pb-20 space-y-6 scroll-container overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-medium">Weekly Challenges</h1>
          <p className="text-sm text-muted-foreground">Complete challenges to earn XP and rewards</p>
        </div>
      </div>

      {/* XP Overview */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-primary">Weekly Progress</h3>
                <p className="text-sm text-muted-foreground">
                  {totalXpEarned} / {totalPossibleXp} XP earned
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-accent">{currentUser.xpPoints}</div>
              <div className="text-xs text-muted-foreground">Total XP</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Week Progress</span>
              <span className="text-sm text-accent">
                {completedChallenges.length} / {weeklyChallenges.length} completed
              </span>
            </div>
            <Progress 
              value={(completedChallenges.length / weeklyChallenges.length) * 100} 
              className="h-3"
            />
          </div>

          {isStreakActive && (
            <div className="flex items-center justify-center mt-4 p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
              <Flame className="w-5 h-5 text-orange-400 mr-2" />
              <span className="font-medium text-orange-400">
                {weeklyStreak} week streak! 🔥
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Challenges */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary flex items-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>Active Challenges</span>
            <Badge variant="secondary" className="text-xs">
              {activeChallenges.length} remaining
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeChallenges.map((challenge) => {
            const Icon = getChallengeIcon(challenge.type);
            const progress = (challenge.current / challenge.target) * 100;
            const isCompleted = progress >= 100;
            
            return (
              <div 
                key={challenge.id}
                className={`p-4 rounded-lg border backdrop-blur-sm transition-all cursor-pointer ${
                  selectedChallenge === challenge.id 
                    ? 'bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30 ring-1 ring-primary/50'
                    : 'bg-background/30 border-white/10 hover:bg-background/40'
                }`}
                onClick={() => setSelectedChallenge(selectedChallenge === challenge.id ? null : challenge.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-r from-background/50 to-background/30 border border-white/20`}>
                      <Icon className={`w-5 h-5 ${getChallengeColor(challenge.type)}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1">{challenge.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="text-xs border-accent/30">
                          <Gift className="w-3 h-3 mr-1" />
                          {challenge.xpReward} XP
                        </Badge>
                        <span className="text-sm font-medium text-accent">
                          {challenge.current} / {challenge.target}
                        </span>
                      </div>
                    </div>
                  </div>
                  {isCompleted && (
                    <Button
                      size="sm"
                      className="gradient-bg text-primary-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompleteChallenge(challenge.id);
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Claim
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Progress</span>
                    <span className="text-xs text-accent">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(progress)}`}
                      style={{ width: `${Math.min(100, progress)}%` }}
                    />
                  </div>
                </div>
                
                {selectedChallenge === challenge.id && (
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <div className="space-y-2">
                      <h5 className="font-medium text-primary text-sm">Challenge Details</h5>
                      <p className="text-xs text-muted-foreground">
                        Track your progress through regular gameplay. This challenge will automatically 
                        update as you play rounds, record shots, and use the app features.
                      </p>
                      {challenge.current > 0 && (
                        <div className="flex items-center space-x-2 text-xs text-green-400">
                          <TrendingUp className="w-3 h-3" />
                          <span>You're making great progress!</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Completed Challenges */}
      {completedChallenges.length > 0 && (
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-primary flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Completed This Week</span>
              <Badge className="bg-green-400/20 text-green-400 border-green-400/30">
                {completedChallenges.length} done
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedChallenges.map((challenge) => {
              const Icon = getChallengeIcon(challenge.type);
              
              return (
                <div 
                  key={challenge.id}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-lg border border-green-500/30"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                      <Icon className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{challenge.title}</h4>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-400/20 text-green-400 border-green-400/30">
                      +{challenge.xpReward} XP
                    </Badge>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Rewards Preview */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary flex items-center space-x-2">
            <Crown className="w-5 h-5 text-accent" />
            <span>Upcoming Rewards</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-foreground">Weekly Champion</h4>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                Complete All
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Complete all weekly challenges to unlock exclusive rewards
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400">+500 Bonus XP</span>
              <span className="text-muted-foreground">•</span>
              <Crown className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400">Special Badge</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-foreground">Monthly Streak</h4>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                4/4 Weeks
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Complete challenges for 4 consecutive weeks
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400">Premium Features</span>
              <span className="text-muted-foreground">•</span>
              <Gift className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400">Exclusive Content</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Reset Timer */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-accent" />
              <div>
                <h4 className="font-medium text-primary">Weekly Reset</h4>
                <p className="text-sm text-muted-foreground">New challenges in 3 days, 14 hours</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-accent/30 text-accent">
              <Calendar className="w-4 h-4 mr-2" />
              Set Reminder
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}