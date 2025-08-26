import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  ChevronLeft, Settings, Trophy, Target, TrendingUp, 
  Calendar, Award, History, Camera, Edit, Share, 
  Lock, Star, Zap, Crown, Medal, Gift, Check, X
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface ProfileProps {
  onBack: () => void;
}

export function Profile({ onBack }: ProfileProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [showEditProfile, setShowEditProfile] = useState(false);
  
  const { 
    currentUser, 
    playerStats, 
    roundHistory, 
    swingAnalyses,
    achievements,
    setCurrentScreen,
    updateUserProfile
  } = useAppContext();

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
  };

  const handleEditName = () => {
    setNewDisplayName(currentUser.displayName);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (newDisplayName.trim() && newDisplayName !== currentUser.displayName) {
      updateUserProfile({ displayName: newDisplayName.trim() });
      toast.success('Name updated successfully!');
    }
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setNewDisplayName('');
  };

  const handleChangeProfilePicture = () => {
    // In a real app, this would open file picker
    toast.info('Profile picture update coming soon!');
  };

  // Calculate XP and level progression
  const totalXP = achievements.reduce((sum, achievement) => sum + achievement.xpReward, 0);
  const currentLevel = Math.floor(totalXP / 1000) + 1;
  const xpForCurrentLevel = (currentLevel - 1) * 1000;
  const xpForNextLevel = currentLevel * 1000;
  const currentLevelXP = totalXP - xpForCurrentLevel;
  const xpNeededForNext = xpForNextLevel - totalXP;
  const progressPercentage = (currentLevelXP / 1000) * 100;

  // All possible achievements (locked and unlocked)
  const allAchievements = [
    // Unlocked achievements (from context)
    ...achievements,
    // Locked achievements that haven't been earned yet
    {
      id: 'locked-1',
      title: '???',
      description: 'Complete a special challenge to unlock',
      icon: 'lock',
      xpReward: 500,
      unlocked: false,
      isLocked: true
    },
    {
      id: 'locked-2', 
      title: '???',
      description: 'Achieve something extraordinary',
      icon: 'lock',
      xpReward: 750,
      unlocked: false,
      isLocked: true
    },
    {
      id: 'future-1',
      title: 'Eagle Master',
      description: 'Score 5 eagles in tournament play',
      icon: 'crown',
      xpReward: 1000,
      unlocked: false,
      isLocked: false
    },
    {
      id: 'future-2',
      title: 'Social Butterfly',
      description: 'Add 10 friends to your network',
      icon: 'users',
      xpReward: 300,
      unlocked: false,
      isLocked: false
    },
    {
      id: 'future-3',
      title: 'Practice Makes Perfect',
      description: 'Complete 50 practice sessions',
      icon: 'target',
      xpReward: 750,
      unlocked: false,
      isLocked: false
    }
  ];

  const unlockedAchievements = allAchievements.filter(a => a.unlocked !== false);
  const lockedAchievements = allAchievements.filter(a => a.unlocked === false);

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'lock': return <Lock className="w-5 h-5" />;
      case 'crown': return <Crown className="w-5 h-5" />;
      case 'users': return <Trophy className="w-5 h-5" />;
      case 'target': return <Target className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-4 pb-20 space-y-6 scroll-container overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-medium">Profile</h1>
          <p className="text-sm text-muted-foreground">Your golf journey and achievements</p>
        </div>
      </div>

      {/* Profile Header */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="text-xl bg-gradient-to-r from-primary to-accent text-primary-foreground">
                  {currentUser.displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="sm" 
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full p-0 gradient-bg"
                onClick={handleChangeProfilePicture}
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              {/* Editable Name */}
              <div className="flex items-center space-x-2 mb-1">
                {isEditingName ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      className="text-xl font-medium bg-background/50 border-primary/30"
                      autoFocus
                    />
                    <Button size="sm" onClick={handleSaveName} className="gradient-bg text-primary-foreground">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-medium text-foreground">{currentUser.displayName}</h2>
                    <Button variant="ghost" size="sm" className="text-accent" onClick={handleEditName}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">@{currentUser.username}</p>
              
              <div className="flex items-center space-x-4 mb-3">
                <Badge className="bg-accent/20 text-accent border-accent/30">
                  Handicap {playerStats.handicap}
                </Badge>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Level {currentLevel}
                </Badge>
              </div>

              {/* XP Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Level Progress</span>
                  <span className="text-accent font-medium">{currentLevelXP}/1000 XP</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {xpNeededForNext} XP needed for Level {currentLevel + 1}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-2 mt-4">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 border-accent/30 text-accent hover:bg-accent/10"
            >
              <Share className="w-4 h-4 mr-2" />
              Share Profile
            </Button>
            <Button 
              size="sm" 
              className="flex-1 gradient-bg text-primary-foreground"
              onClick={() => setShowEditProfile(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-accent" />
            <div className="text-lg font-bold text-accent">{playerStats.bestScore}</div>
            <div className="text-xs text-muted-foreground">Best Score</div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
            <div className="text-lg font-bold text-primary">{roundHistory.length}</div>
            <div className="text-xs text-muted-foreground">Rounds</div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <div className="text-lg font-bold text-green-400">{playerStats.greenInRegulation}%</div>
            <div className="text-xs text-muted-foreground">GIR</div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-4 text-center">
            <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
            <div className="text-lg font-bold text-yellow-400">{swingAnalyses.length}</div>
            <div className="text-xs text-muted-foreground">Swings</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Menu */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Quick Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start bg-background/30 border-white/20 hover:bg-background/50"
            onClick={() => handleNavigate('round-history')}
          >
            <History className="w-5 h-5 mr-3 text-primary" />
            <div className="text-left">
              <div className="font-medium">Round History</div>
              <div className="text-xs text-muted-foreground">View detailed scorecards and statistics</div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start bg-background/30 border-white/20 hover:bg-background/50"
            onClick={() => handleNavigate('friends-leaderboard')}
          >
            <Trophy className="w-5 h-5 mr-3 text-yellow-400" />
            <div className="text-left">
              <div className="font-medium">Friends Leaderboard</div>
              <div className="text-xs text-muted-foreground">See how you rank against friends</div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start bg-background/30 border-white/20 hover:bg-background/50"
            onClick={() => handleNavigate('settings')}
          >
            <Settings className="w-5 h-5 mr-3 text-muted-foreground" />
            <div className="text-left">
              <div className="font-medium">Settings</div>
              <div className="text-xs text-muted-foreground">App preferences and smartwatch</div>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Achievements Section */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>Achievements ({unlockedAchievements.length}/{allAchievements.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Achievement Progress */}
          <div className="text-center p-4 bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg border border-accent/30">
            <Award className="w-8 h-8 mx-auto mb-2 text-accent" />
            <div className="text-2xl font-bold text-accent mb-1">{totalXP}</div>
            <div className="text-sm text-muted-foreground">Total XP Earned</div>
          </div>

          {/* Unlocked Achievements */}
          {unlockedAchievements.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-green-400">Unlocked</h4>
              {unlockedAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-green-400/20">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-400/20 to-accent/20 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  <Badge className="bg-green-400/20 text-green-400 border-green-400/30">
                    +{achievement.xpReward} XP
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Available Achievements */}
          {lockedAchievements.some(a => !a.isLocked) && (
            <div className="space-y-3">
              <h4 className="font-medium text-yellow-400">Available</h4>
              {lockedAchievements.filter(a => !a.isLocked).map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-background/20 backdrop-blur-sm rounded-lg border border-yellow-400/20">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400/20 to-accent/20 rounded-full flex items-center justify-center">
                    {getAchievementIcon(achievement.icon)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
                    +{achievement.xpReward} XP
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Locked/Secret Achievements */}
          {lockedAchievements.some(a => a.isLocked) && (
            <div className="space-y-3">
              <h4 className="font-medium text-muted-foreground">Secret Achievements</h4>
              {lockedAchievements.filter(a => a.isLocked).map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-background/10 backdrop-blur-sm rounded-lg border border-muted/20">
                  <div className="w-10 h-10 bg-gradient-to-r from-muted/20 to-muted/30 rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-muted-foreground">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground opacity-60">{achievement.description}</p>
                  </div>
                  <Badge variant="secondary" className="opacity-60">
                    +{achievement.xpReward} XP
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Performance Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-3 bg-background/30 backdrop-blur-sm rounded-lg">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-accent" />
              <div className="text-lg font-bold text-accent">{playerStats.averageScore}</div>
              <div className="text-xs text-muted-foreground">Average Score</div>
            </div>
            <div className="p-3 bg-background/30 backdrop-blur-sm rounded-lg">
              <Target className="w-5 h-5 mx-auto mb-1 text-green-400" />
              <div className="text-lg font-bold text-green-400">{playerStats.drivingDistance}y</div>
              <div className="text-xs text-muted-foreground">Avg Distance</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">This Month</div>
            <div className="flex items-center justify-between text-sm">
              <span>Rounds Played</span>
              <span className="font-medium text-primary">{Math.min(3, roundHistory.length)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Best Round</span>
              <span className="font-medium text-green-400">{playerStats.bestScore}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Improvement</span>
              <span className="font-medium text-accent">-2.1 strokes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information and preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="text-xl">
                  {currentUser.displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={handleChangeProfilePicture}>
                <Camera className="w-4 h-4 mr-2" />
                Change Picture
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Name</label>
              <Input
                value={newDisplayName || currentUser.displayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                className="flex-1 gradient-bg text-primary-foreground"
                onClick={() => {
                  handleSaveName();
                  setShowEditProfile(false);
                }}
              >
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowEditProfile(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}