import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  ChevronLeft, Trophy, Target, Zap, Crown, Medal, 
  TrendingUp, Star, Award, Users
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { getUserProfileScreen } from '../../constants/navigation';

interface FriendsLeaderboardProps {
  onBack: () => void;
}

interface PlayerWithStats {
  id: string;
  displayName: string;
  username: string;
  avatar: string;
  handicap: number;
  stats: {
    averageScore: number;
    bestScore: number;
    drivingDistance: number;
    drivingAccuracy: number;
    fairwaysHit: number;
  };
}

export function FriendsLeaderboard({ onBack }: FriendsLeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'score' | 'distance' | 'fairways'>('score');

  const {
    friends,
    currentUser,
    playerStats,
    setCurrentScreen
  } = useAppContext();

  // Get accepted friends only
  const acceptedFriends = friends?.filter(f => f.status === 'accepted') || [];
  
  // Create mock stats for friends (in a real app, this would come from the backend)
  const createMockStats = (user: any) => ({
    averageScore: 80 + Math.random() * 20, // Random score between 80-100
    bestScore: 75 + Math.random() * 15, // Random best score between 75-90
    drivingDistance: 200 + Math.random() * 100, // Random distance between 200-300
    drivingAccuracy: 50 + Math.random() * 40, // Random accuracy between 50-90%
    fairwaysHit: 50 + Math.random() * 40 // Random fairways between 50-90%
  });

  // Create players with stats
  const createPlayerWithStats = (user: any, isCurrentUser: boolean = false): PlayerWithStats => {
    return {
      id: user.id,
      displayName: user.displayName,
      username: user.username,
      avatar: user.avatar,
      handicap: user.handicap,
      stats: isCurrentUser ? {
        averageScore: playerStats.averageScore,
        bestScore: playerStats.bestScore,
        drivingDistance: playerStats.drivingDistance,
        drivingAccuracy: playerStats.drivingAccuracy,
        fairwaysHit: playerStats.fairwaysHit
      } : createMockStats(user)
    };
  };

  // Create all players with stats
  const allPlayersWithStats = [
    createPlayerWithStats(currentUser, true),
    ...acceptedFriends.map(f => createPlayerWithStats(f.user))
  ];

  // Sort by different criteria
  const getLeaderboardData = (criteria: 'score' | 'distance' | 'fairways') => {
    return allPlayersWithStats
      .map(player => ({
        ...player,
        value: criteria === 'score' ? player.stats.averageScore :
               criteria === 'distance' ? player.stats.drivingDistance :
               player.stats.fairwaysHit
      }))
      .sort((a, b) => {
        if (criteria === 'score') {
          return a.value - b.value; // Lower is better for score
        } else {
          return b.value - a.value; // Higher is better for distance/fairways
        }
      })
      .map((player, index) => ({ ...player, rank: index + 1 }));
  };

  const scoreLeaderboard = getLeaderboardData('score');
  const distanceLeaderboard = getLeaderboardData('distance');
  const fairwaysLeaderboard = getLeaderboardData('fairways');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-medium text-muted-foreground">{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black';
      case 2:
        return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleViewProfile = (userId: string) => {
    if (userId !== currentUser.id) {
      const profileScreen = getUserProfileScreen(userId);
      setCurrentScreen(profileScreen);
    }
  };

  const LeaderboardList = ({ data, valueLabel, format }: { 
    data: any[], 
    valueLabel: string,
    format?: (value: number) => string 
  }) => (
    <div className="space-y-2">
      {data.map((player, index) => {
        const isCurrentUser = player.id === currentUser.id;
        return (
          <div 
            key={player.id}
            className={`p-4 rounded-lg border backdrop-blur-sm transition-all cursor-pointer ${
              isCurrentUser 
                ? 'bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30 ring-1 ring-primary/50' 
                : 'bg-background/30 border-white/10 hover:bg-background/40'
            }`}
            onClick={() => handleViewProfile(player.id)}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                {getRankIcon(player.rank)}
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={player.avatar} alt={player.displayName} />
                    <AvatarFallback>{player.displayName?.slice(0, 2).toUpperCase() || 'UN'}</AvatarFallback>
                  </Avatar>
                  {player.rank <= 3 && (
                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${getRankBadgeColor(player.rank)}`}>
                      {player.rank}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <div className={`font-medium ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                  {player.displayName}
                  {isCurrentUser && <span className="text-xs text-accent ml-2">(You)</span>}
                </div>
                <div className="text-sm text-muted-foreground">
                  @{player.username} • Handicap {player.handicap?.toFixed(1) || 'N/A'}
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  player.rank === 1 ? 'text-yellow-400' :
                  player.rank === 2 ? 'text-gray-400' :
                  player.rank === 3 ? 'text-amber-600' :
                  'text-accent'
                }`}>
                  {format ? format(player.value) : player.value?.toFixed(1) || 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">{valueLabel}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="p-4 pb-20 space-y-6 scroll-container overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-medium">Friends Leaderboard</h1>
          <p className="text-sm text-muted-foreground">Compare your performance with friends • Tap to view profiles</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
            <div className="text-lg font-bold text-yellow-400">
              #{scoreLeaderboard.find(p => p.id === currentUser.id)?.rank || '-'}
            </div>
            <div className="text-xs text-muted-foreground">Score Rank</div>
          </CardContent>
        </Card>
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <Zap className="w-6 h-6 mx-auto mb-2 text-accent" />
            <div className="text-lg font-bold text-accent">
              #{distanceLeaderboard.find(p => p.id === currentUser.id)?.rank || '-'}
            </div>
            <div className="text-xs text-muted-foreground">Distance Rank</div>
          </CardContent>
        </Card>
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <div className="text-lg font-bold text-green-400">
              #{fairwaysLeaderboard.find(p => p.id === currentUser.id)?.rank || '-'}
            </div>
            <div className="text-xs text-muted-foreground">Accuracy Rank</div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard Tabs */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Rankings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 backdrop-blur-sm">
              <TabsTrigger 
                value="score" 
                className={activeTab === 'score' ? 'gradient-bg text-primary-foreground' : ''}
              >
                <Trophy className="w-4 h-4 mr-2" />
                Score
              </TabsTrigger>
              <TabsTrigger 
                value="distance"
                className={activeTab === 'distance' ? 'gradient-bg text-primary-foreground' : ''}
              >
                <Zap className="w-4 h-4 mr-2" />
                Distance
              </TabsTrigger>
              <TabsTrigger 
                value="fairways"
                className={activeTab === 'fairways' ? 'gradient-bg text-primary-foreground' : ''}
              >
                <Target className="w-4 h-4 mr-2" />
                Fairways
              </TabsTrigger>
            </TabsList>

            <TabsContent value="score" className="space-y-0">
              <div className="mb-4">
                <h3 className="font-medium text-primary mb-2">Average Score</h3>
                <p className="text-sm text-muted-foreground">Lower scores rank higher • Tap players to view their profiles</p>
              </div>
              <LeaderboardList 
                data={scoreLeaderboard} 
                valueLabel="Average Score"
                format={(value) => value.toFixed(1)}
              />
            </TabsContent>

            <TabsContent value="distance" className="space-y-0">
              <div className="mb-4">
                <h3 className="font-medium text-primary mb-2">Driving Distance</h3>
                <p className="text-sm text-muted-foreground">Longer drives rank higher • Tap players to view their profiles</p>
              </div>
              <LeaderboardList 
                data={distanceLeaderboard} 
                valueLabel="Avg Distance"
                format={(value) => `${Math.round(value)}y`}
              />
            </TabsContent>

            <TabsContent value="fairways" className="space-y-0">
              <div className="mb-4">
                <h3 className="font-medium text-primary mb-2">Fairway Accuracy</h3>
                <p className="text-sm text-muted-foreground">Higher accuracy ranks higher • Tap players to view their profiles</p>
              </div>
              <LeaderboardList 
                data={fairwaysLeaderboard} 
                valueLabel="Accuracy"
                format={(value) => `${Math.round(value)}%`}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Achievement Spotlight */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary flex items-center space-x-2">
            <Star className="w-5 h-5 text-accent" />
            <span>This Week's Champions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-lg border border-yellow-400/30">
            <div className="flex items-center space-x-3">
              <Crown className="w-6 h-6 text-yellow-400" />
              <div>
                <div className="font-medium text-foreground">Best Round</div>
                <div className="text-sm text-muted-foreground">
                  {scoreLeaderboard[0]?.displayName || 'No data'} • {scoreLeaderboard[0]?.stats?.bestScore?.toFixed(1) || 'N/A'}
                </div>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">
              Champion
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-lg border border-blue-400/30">
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 text-blue-400" />
              <div>
                <div className="font-medium text-foreground">Longest Drive</div>
                <div className="text-sm text-muted-foreground">
                  {distanceLeaderboard[0]?.displayName || 'No data'} • {Math.round(distanceLeaderboard[0]?.stats?.drivingDistance || 0)}y
                </div>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-blue-400 to-blue-600 text-white">
              Power Player
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-lg border border-green-400/30">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-green-400" />
              <div>
                <div className="font-medium text-foreground">Most Accurate</div>
                <div className="text-sm text-muted-foreground">
                  {fairwaysLeaderboard[0]?.displayName || 'No data'} • {Math.round(fairwaysLeaderboard[0]?.stats?.drivingAccuracy || 0)}%
                </div>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-green-400 to-green-600 text-white">
              Precision Pro
            </Badge>
          </div>
        </CardContent>
      </Card>

      {acceptedFriends.length === 0 && (
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-8 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-medium text-primary mb-2">No Friends Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add friends to see leaderboards and compete!
            </p>
            <Button 
              className="gradient-bg text-primary-foreground"
              onClick={() => onBack()}
            >
              Add Friends
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}