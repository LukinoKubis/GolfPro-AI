import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { 
  ChevronLeft, UserPlus, MessageCircle, MapPin, Calendar, 
  Trophy, Target, TrendingUp, Clock, Play, Video, Star,
  Crown, Zap, Award, Users
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface OtherUserProfileProps {
  userId: string;
  onBack: () => void;
}

export function OtherUserProfile({ userId, onBack }: OtherUserProfileProps) {
  const [inviteMessage, setInviteMessage] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('Pebble Beach Golf Links');

  const {
    getUserById,
    friends,
    addFriend,
    sendGameInvitation,
    currentUser,
    roundHistory
  } = useAppContext();

  const user = getUserById(userId);
  
  if (!user) {
    return (
      <div className="p-4 pb-20 space-y-6">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-medium">User Not Found</h1>
          </div>
        </div>
      </div>
    );
  }

  const friendship = friends.find(f => f.user.id === userId);
  const isFriend = friendship?.status === 'accepted';
  const isPending = friendship?.status === 'pending';

  const handleAddFriend = async () => {
    const success = await addFriend(user.username);
    if (success) {
      toast.success(`Friend request sent to ${user.displayName}!`);
    } else {
      toast.error('Failed to send friend request');
    }
  };

  const handleInviteToGame = () => {
    sendGameInvitation([user.id], selectedCourse, new Date(Date.now() + 86400000 * 2), inviteMessage);
    toast.success(`Game invitation sent to ${user.displayName}!`);
    setInviteMessage('');
  };

  // Mock recent activity for other users
  const recentActivity = [
    {
      id: '1',
      type: 'swing-analysis',
      timestamp: new Date(Date.now() - 3600000 * 2),
      details: 'Uploaded swing video with Driver',
      score: 88
    },
    {
      id: '2', 
      type: 'round-completed',
      timestamp: new Date(Date.now() - 86400000),
      details: `Finished round at Augusta National`,
      score: user.stats.bestScore
    },
    {
      id: '3',
      type: 'achievement',
      timestamp: new Date(Date.now() - 86400000 * 3),
      details: 'Earned "Consistency King" achievement',
      icon: '👑'
    }
  ];

  const achievements = [
    { 
      id: 'sub-par', 
      name: 'Sub-Par Master', 
      icon: '⭐', 
      earned: user.stats.bestScore < 72,
      description: 'Shot under par'
    },
    { 
      id: 'social', 
      name: 'Social Butterfly', 
      icon: '🦋', 
      earned: true,
      description: 'Made 10+ friends'
    },
    { 
      id: 'distance', 
      name: 'Long Drive', 
      icon: '💪', 
      earned: user.stats.drivingDistance > 280,
      description: '280+ yard drives'
    },
    { 
      id: 'accuracy', 
      name: 'Precision Player', 
      icon: '🎯', 
      earned: user.stats.drivingAccuracy > 70,
      description: '70%+ fairway accuracy'
    }
  ];

  return (
    <div className="p-4 pb-20 space-y-6 scroll-container overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-medium">Profile</h1>
          <p className="text-sm text-muted-foreground">{user.displayName}</p>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="gradient-card border-white/10 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user.avatar} alt={user.displayName} />
                <AvatarFallback>{user.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${
                user.isOnline ? 'bg-green-400' : 'bg-muted'
              }`} />
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-medium text-primary">{user.displayName}</h3>
                <p className="text-sm text-muted-foreground">@{user.username}</p>
                {user.location && (
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>Joined {user.joinDate.toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="text-center">
                  <div className="font-medium text-primary">{user.handicap}</div>
                  <div className="text-xs text-muted-foreground">Handicap</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-accent">{user.xpPoints}</div>
                  <div className="text-xs text-muted-foreground">XP Points</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-green-400">{user.stats.roundsPlayed}</div>
                  <div className="text-xs text-muted-foreground">Rounds</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Button */}
      <div className="flex space-x-3">
        {!isFriend && !isPending ? (
          <Button 
            className="flex-1 gradient-bg text-primary-foreground"
            onClick={handleAddFriend}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Friend
          </Button>
        ) : isPending ? (
          <Button className="flex-1" variant="outline" disabled>
            <Clock className="w-4 h-4 mr-2" />
            Request Pending
          </Button>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex-1 gradient-bg text-primary-foreground">
                <Play className="w-4 h-4 mr-2" />
                Invite to Game
              </Button>
            </DialogTrigger>
            <DialogContent className="gradient-card border-white/10 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle className="text-primary">Invite to Play</DialogTitle>
                <DialogDescription>
                  Send a game invitation to {user.displayName}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-primary mb-2 block">Course</label>
                  <Input
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="bg-background/50 border-white/20 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-primary mb-2 block">Message (optional)</label>
                  <Textarea
                    placeholder="Add a message..."
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    className="bg-background/50 border-white/20 backdrop-blur-sm resize-none"
                    rows={3}
                  />
                </div>
                <Button 
                  className="w-full gradient-bg text-primary-foreground"
                  onClick={handleInviteToGame}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-lg font-bold text-primary">{user.stats.averageScore}</div>
            <div className="text-xs text-muted-foreground">Avg Score</div>
          </CardContent>
        </Card>
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-accent" />
            <div className="text-lg font-bold text-accent">{user.stats.bestScore}</div>
            <div className="text-xs text-muted-foreground">Best Score</div>
          </CardContent>
        </Card>
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <Zap className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <div className="text-lg font-bold text-green-400">{user.stats.swingsAnalyzed || 47}</div>
            <div className="text-xs text-muted-foreground">Swings</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary flex items-center space-x-2">
            <Crown className="w-5 h-5 text-accent" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-3 scroll-horizontal overflow-x-auto pb-2">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`flex-shrink-0 w-16 h-20 rounded-lg border backdrop-blur-sm flex flex-col items-center justify-center space-y-1 ${
                  achievement.earned 
                    ? 'bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30' 
                    : 'bg-background/30 border-white/10 opacity-50'
                }`}
              >
                <span className="text-lg">{achievement.icon}</span>
                <span className="text-xs text-center px-1 leading-tight">{achievement.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  activity.type === 'swing-analysis' ? 'bg-gradient-to-r from-blue-500 to-purple-600' :
                  activity.type === 'round-completed' ? 'bg-gradient-to-r from-green-500 to-teal-600' :
                  'bg-gradient-to-r from-yellow-500 to-orange-600'
                }`}>
                  {activity.type === 'swing-analysis' ? <Video className="w-5 h-5 text-white" /> :
                   activity.type === 'round-completed' ? <Trophy className="w-5 h-5 text-white" /> :
                   <Award className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <p className="font-medium text-sm">{activity.details}</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.floor((Date.now() - activity.timestamp.getTime()) / (1000 * 60 * 60))} hours ago
                  </p>
                </div>
              </div>
              {activity.score && (
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  {activity.score}
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}