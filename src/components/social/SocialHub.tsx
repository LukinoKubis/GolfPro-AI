import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { 
  ChevronLeft, Users, UserPlus, Trophy, Search, 
  Calendar, Crown, Medal, Award, Target, Zap, 
  ChevronRight, MapPin, Clock, Gift, MessageCircle,
  TrendingUp, Star
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { getUserProfileScreen } from '../../constants/navigation';
import { toast } from 'sonner@2.0.3';

interface SocialHubProps {
  onBack: () => void;
}

export function SocialHub({ onBack }: SocialHubProps) {
  const [activeTab, setActiveTab] = useState<'friends' | 'leaderboard' | 'discover'>('friends');
  const [searchQuery, setSearchQuery] = useState('');

  const {
    friends,
    currentUser,
    playerStats,
    setCurrentScreen,
    gameInvitations,
    searchUsers,
    addFriend,
    allUsers
  } = useAppContext();

  const acceptedFriends = friends.filter(f => f.status === 'accepted');
  const pendingFriends = friends.filter(f => f.status === 'pending');

  const handleViewProfile = (userId: string) => {
    const profileScreen = getUserProfileScreen(userId);
    setCurrentScreen(profileScreen);
  };

  const handleAddFriend = async (username: string) => {
    const success = await addFriend(username);
    if (success) {
      toast.success(`Friend request sent to ${username}!`);
    } else {
      toast.error('User not found or already friends');
    }
  };

  const handleCreateTournament = () => {
    setCurrentScreen('tournament-mode');
    toast.success('Tournament creator opened!');
  };

  const handleOpenMessages = () => {
    setCurrentScreen('messages');
  };

  const searchResults = searchQuery.length > 2 ? searchUsers(searchQuery) : [];

  // Create leaderboard data
  const createLeaderboardData = () => {
    const allPlayers = [
      {
        ...currentUser,
        stats: {
          averageScore: playerStats.averageScore,
          bestScore: playerStats.bestScore,
          drivingDistance: playerStats.drivingDistance,
          drivingAccuracy: playerStats.drivingAccuracy
        }
      },
      ...acceptedFriends.map(f => f.user)
    ];

    return allPlayers
      .sort((a, b) => a.stats.averageScore - b.stats.averageScore)
      .map((player, index) => ({ ...player, rank: index + 1 }));
  };

  const leaderboardData = createLeaderboardData();

  return (
    <div className="p-4 pb-20 space-y-4 scroll-container overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-medium">Social Hub</h1>
          <p className="text-sm text-muted-foreground">Connect with the golf community</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-3 text-center">
            <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
            <div className="font-bold text-primary">{acceptedFriends.length}</div>
            <div className="text-xs text-muted-foreground">Friends</div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-3 text-center">
            <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
            <div className="font-bold text-yellow-400">
              #{leaderboardData.find(p => p.id === currentUser.id)?.rank || '-'}
            </div>
            <div className="text-xs text-muted-foreground">Rank</div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-3 text-center">
            <MessageCircle className="w-5 h-5 mx-auto mb-1 text-accent" />
            <div className="font-bold text-accent">3</div>
            <div className="text-xs text-muted-foreground">Messages</div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-3 text-center">
            <Gift className="w-5 h-5 mx-auto mb-1 text-green-400" />
            <div className="font-bold text-green-400">{pendingFriends.length}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="justify-start bg-background/30 border-white/20 hover:bg-background/50 text-sm h-12"
          onClick={handleOpenMessages}
        >
          <MessageCircle className="w-4 h-4 mr-3 text-accent" />
          <div className="text-left">
            <div className="font-medium">Messages</div>
            <div className="text-xs text-muted-foreground">Chat with friends</div>
          </div>
        </Button>
        
        <Button 
          variant="outline" 
          className="justify-start bg-background/30 border-white/20 hover:bg-background/50 text-sm h-12"
          onClick={() => setCurrentScreen('add-friend')}
        >
          <UserPlus className="w-4 h-4 mr-3 text-primary" />
          <div className="text-left">
            <div className="font-medium">Add Friends</div>
            <div className="text-xs text-muted-foreground">Find golfers</div>
          </div>
        </Button>
      </div>

      {/* Game Invitations */}
      {gameInvitations.length > 0 && (
        <Card className="gradient-card backdrop-blur-sm border-accent/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-accent flex items-center space-x-2 text-base">
              <Calendar className="w-4 h-4" />
              <span>Game Invitations</span>
              <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">
                {gameInvitations.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {gameInvitations.slice(0, 2).map((invitation) => (
              <div key={invitation.id} className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={invitation.from.avatar} />
                    <AvatarFallback className="text-xs">{invitation.from.displayName.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground text-sm">{invitation.from.displayName}</div>
                    <div className="text-xs text-muted-foreground">{invitation.course}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="border-white/20 text-xs px-2">
                    Decline
                  </Button>
                  <Button size="sm" className="gradient-bg text-primary-foreground text-xs px-2">
                    Accept
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-0">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 backdrop-blur-sm rounded-none rounded-t-lg">
              <TabsTrigger 
                value="friends"
                className={activeTab === 'friends' ? 'gradient-bg text-primary-foreground text-sm' : 'text-sm'}
              >
                <Users className="w-4 h-4 mr-1" />
                Friends
              </TabsTrigger>
              <TabsTrigger 
                value="leaderboard"
                className={activeTab === 'leaderboard' ? 'gradient-bg text-primary-foreground text-sm' : 'text-sm'}
              >
                <Trophy className="w-4 h-4 mr-1" />
                Rankings
              </TabsTrigger>
              <TabsTrigger 
                value="discover"
                className={activeTab === 'discover' ? 'gradient-bg text-primary-foreground text-sm' : 'text-sm'}
              >
                <Search className="w-4 h-4 mr-1" />
                Discover
              </TabsTrigger>
            </TabsList>

            {/* Friends Tab */}
            <TabsContent value="friends" className="p-4 space-y-4">
              {acceptedFriends.length > 0 ? (
                <div className="space-y-2">
                  {acceptedFriends.slice(0, 4).map((friend) => (
                    <div 
                      key={friend.id} 
                      className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-background/40 transition-colors cursor-pointer"
                      onClick={() => handleViewProfile(friend.user.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={friend.user.avatar} />
                            <AvatarFallback className="text-sm">{friend.user.displayName.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                            friend.user.isOnline ? 'bg-green-400' : 'bg-muted'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground text-sm">{friend.user.displayName}</div>
                          <div className="text-xs text-muted-foreground">
                            Handicap {friend.user.handicap} • {friend.user.stats.averageScore.toFixed(1)} avg
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenMessages();
                          }}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                  
                  {acceptedFriends.length > 4 && (
                    <Button 
                      variant="outline" 
                      className="w-full text-sm"
                      onClick={() => setCurrentScreen('add-friend')}
                    >
                      View All Friends ({acceptedFriends.length})
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <h3 className="font-medium text-primary mb-2">No Friends Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect with other golfers!
                  </p>
                  <Button 
                    className="gradient-bg text-primary-foreground"
                    onClick={() => setCurrentScreen('add-friend')}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Find Friends
                  </Button>
                </div>
              )}

              {/* Pending Requests */}
              {pendingFriends.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-primary text-sm">Pending ({pendingFriends.length})</h4>
                  {pendingFriends.slice(0, 2).map((friend) => (
                    <div key={friend.id} className="flex items-center justify-between p-2 bg-background/20 rounded-lg border border-yellow-400/30">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={friend.user.avatar} />
                          <AvatarFallback className="text-xs">{friend.user.displayName.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-foreground text-sm">{friend.user.displayName}</div>
                        </div>
                      </div>
                      <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Leaderboard Tab */}
            <TabsContent value="leaderboard" className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-primary text-sm">Top Players</h3>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setCurrentScreen('friends-leaderboard')}
                  className="border-white/20 text-xs"
                >
                  View All
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>

              <div className="space-y-2">
                {leaderboardData.slice(0, 3).map((player) => {
                  const isCurrentUser = player.id === currentUser.id;
                  return (
                    <div 
                      key={player.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border backdrop-blur-sm transition-all cursor-pointer ${
                        isCurrentUser 
                          ? 'bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30' 
                          : 'bg-background/30 border-white/10 hover:bg-background/40'
                      }`}
                      onClick={() => !isCurrentUser && handleViewProfile(player.id)}
                    >
                      <div className="flex items-center space-x-2">
                        {player.rank === 1 ? <Crown className="w-5 h-5 text-yellow-400" /> :
                         player.rank === 2 ? <Medal className="w-5 h-5 text-gray-400" /> :
                         <Award className="w-5 h-5 text-amber-600" />}
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={player.avatar} />
                          <AvatarFallback className="text-xs">{player.displayName.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="flex-1">
                        <div className={`font-medium text-sm ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                          {player.displayName}
                          {isCurrentUser && <span className="text-xs text-accent ml-1">(You)</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Handicap {player.handicap}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`font-bold ${
                          player.rank === 1 ? 'text-yellow-400' :
                          player.rank === 2 ? 'text-gray-400' :
                          'text-amber-600'
                        }`}>
                          {player.stats.averageScore.toFixed(1)}
                        </div>
                        <div className="text-xs text-muted-foreground">Avg</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* Discover Tab */}
            <TabsContent value="discover" className="p-4 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search golfers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-white/20 backdrop-blur-sm text-sm"
                />
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="font-medium text-primary text-sm">Search Results</h4>
                  {searchResults
                    .filter(user => user.id !== currentUser.id && !friends.some(f => f.user.id === user.id))
                    .slice(0, 3)
                    .map((user) => (
                      <div 
                        key={user.id} 
                        className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10"
                      >
                        <div className="flex items-center space-x-3" onClick={() => handleViewProfile(user.id)}>
                          <Avatar className="w-8 h-8 cursor-pointer">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="text-xs">{user.displayName.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="cursor-pointer">
                            <div className="font-medium text-foreground text-sm">{user.displayName}</div>
                            <div className="text-xs text-muted-foreground">Handicap {user.handicap}</div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="gradient-bg text-primary-foreground text-xs px-2"
                          onClick={() => handleAddFriend(user.username)}
                        >
                          <UserPlus className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <h4 className="font-medium text-primary text-sm">Suggested Players</h4>
                  {allUsers
                    .filter(user => 
                      user.id !== currentUser.id && 
                      !friends.some(f => f.user.id === user.id)
                    )
                    .slice(0, 3)
                    .map((user) => (
                      <div 
                        key={user.id} 
                        className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10"
                      >
                        <div className="flex items-center space-x-3" onClick={() => handleViewProfile(user.id)}>
                          <Avatar className="w-8 h-8 cursor-pointer">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="text-xs">{user.displayName.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="cursor-pointer">
                            <div className="font-medium text-foreground text-sm">{user.displayName}</div>
                            <div className="text-xs text-accent">Similar skill level</div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="gradient-bg text-primary-foreground text-xs px-2"
                          onClick={() => handleAddFriend(user.username)}
                        >
                          <UserPlus className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Extended Quick Actions */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardContent className="p-4 space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start bg-background/30 border-white/20 hover:bg-background/50 text-sm h-12"
            onClick={() => setCurrentScreen('friends-leaderboard')}
          >
            <Trophy className="w-4 h-4 mr-3 text-yellow-400" />
            <div className="text-left">
              <div className="font-medium">View Full Leaderboard</div>
              <div className="text-xs text-muted-foreground">See detailed rankings and stats</div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start bg-background/30 border-white/20 hover:bg-background/50 text-sm h-12"
            onClick={handleCreateTournament}
          >
            <Calendar className="w-4 h-4 mr-3 text-green-400" />
            <div className="text-left">
              <div className="font-medium">Create Tournament</div>
              <div className="text-xs text-muted-foreground">Organize competitions with friends</div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}