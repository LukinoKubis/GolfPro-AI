import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  ChevronLeft, Trophy, Plus, Users, Calendar, MapPin, 
  Lock, Globe, Copy, Crown, Medal, Award, Share, 
  Star, Target, Clock
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface TournamentModeProps {
  onBack: () => void;
}

export function TournamentMode({ onBack }: TournamentModeProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'my-tournaments'>('browse');
  const [tournamentName, setTournamentName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [joinCode, setJoinCode] = useState('');

  const {
    tournaments,
    createTournament,
    joinTournament,
    friends,
    currentUser
  } = useAppContext();

  const handleCreateTournament = () => {
    if (!tournamentName || !courseName) {
      toast.error('Please fill in tournament name and course');
      return;
    }

    const newTournament = {
      name: tournamentName,
      course: courseName,
      date: new Date(Date.now() + 86400000 * 7), // 7 days from now
      isPublic,
      createdBy: currentUser.id,
      joinCode: isPublic ? undefined : Math.random().toString(36).substring(7).toUpperCase()
    };

    createTournament(newTournament);
    toast.success('Tournament created successfully!');
    setTournamentName('');
    setCourseName('');
    setActiveTab('my-tournaments');
  };

  const handleJoinTournament = (tournamentId: string) => {
    joinTournament(tournamentId);
    toast.success('Joined tournament successfully!');
  };

  const handleJoinByCode = () => {
    if (!joinCode) {
      toast.error('Please enter a join code');
      return;
    }
    
    const tournament = tournaments.find(t => t.joinCode === joinCode.toUpperCase());
    if (tournament) {
      handleJoinTournament(tournament.id);
      setJoinCode('');
    } else {
      toast.error('Invalid join code');
    }
  };

  const handleCopyJoinCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Join code copied to clipboard!');
  };

  const myTournaments = tournaments.filter(t => 
    t.createdBy === currentUser.id || t.players.some(p => p.id === currentUser.id)
  );

  const availableTournaments = tournaments.filter(t => 
    t.isPublic && !t.players.some(p => p.id === currentUser.id) && t.createdBy !== currentUser.id
  );

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{position}</span>;
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
          <h1 className="text-xl font-medium">Tournaments</h1>
          <p className="text-sm text-muted-foreground">Compete with friends and players worldwide</p>
        </div>
      </div>

      {/* Main Tabs */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-0">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 backdrop-blur-sm rounded-none rounded-t-lg">
              <TabsTrigger 
                value="browse"
                className={activeTab === 'browse' ? 'gradient-bg text-primary-foreground' : ''}
              >
                <Globe className="w-4 h-4 mr-2" />
                Browse
              </TabsTrigger>
              <TabsTrigger 
                value="create"
                className={activeTab === 'create' ? 'gradient-bg text-primary-foreground' : ''}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create
              </TabsTrigger>
              <TabsTrigger 
                value="my-tournaments"
                className={activeTab === 'my-tournaments' ? 'gradient-bg text-primary-foreground' : ''}
              >
                <Trophy className="w-4 h-4 mr-2" />
                My Events
              </TabsTrigger>
            </TabsList>

            {/* Browse Tournaments */}
            <TabsContent value="browse" className="p-6 space-y-4">
              {/* Join by Code */}
              <div className="space-y-3">
                <h3 className="font-medium text-primary">Join with Code</h3>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter tournament code..."
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="bg-background/50 border-white/20 backdrop-blur-sm"
                  />
                  <Button 
                    onClick={handleJoinByCode}
                    className="gradient-bg text-primary-foreground"
                  >
                    Join
                  </Button>
                </div>
              </div>

              {/* Public Tournaments */}
              <div className="space-y-3">
                <h3 className="font-medium text-primary">Public Tournaments</h3>
                <div className="space-y-3">
                  {availableTournaments.length > 0 ? availableTournaments.map((tournament) => (
                    <div key={tournament.id} className="p-4 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-foreground">{tournament.name}</h4>
                            <Badge className="bg-green-400/20 text-green-400 border-green-400/30">
                              <Globe className="w-3 h-3 mr-1" />
                              Public
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{tournament.course}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{tournament.date.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{tournament.players.length} players</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm"
                          className="gradient-bg text-primary-foreground"
                          onClick={() => handleJoinTournament(tournament.id)}
                        >
                          Join
                        </Button>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8">
                      <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-sm text-muted-foreground">No public tournaments available</p>
                      <p className="text-xs text-muted-foreground">Create one or join with a code</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Create Tournament */}
            <TabsContent value="create" className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-primary mb-2 block">Tournament Name</label>
                  <Input
                    placeholder="Spring Championship 2024"
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                    className="bg-background/50 border-white/20 backdrop-blur-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-primary mb-2 block">Course Name</label>
                  <Input
                    placeholder="Pebble Beach Golf Links"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="bg-background/50 border-white/20 backdrop-blur-sm"
                  />
                </div>

                {/* Privacy Setting */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-primary">Privacy</label>
                  <div className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
                    <div className="flex items-center space-x-3">
                      {isPublic ? (
                        <Globe className="w-5 h-5 text-green-400" />
                      ) : (
                        <Lock className="w-5 h-5 text-accent" />
                      )}
                      <div>
                        <div className="font-medium text-foreground">
                          {isPublic ? 'Public Tournament' : 'Private Tournament'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {isPublic ? 'Anyone can join' : 'Invite only with code'}
                        </div>
                      </div>
                    </div>
                    <Switch
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                    />
                  </div>
                </div>

                {/* Invite Friends */}
                {friends.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-primary">Invite Friends</label>
                    <div className="space-y-2 max-h-32 scroll-container overflow-y-auto">
                      {friends.filter(f => f.status === 'accepted').map((friend) => (
                        <div key={friend.id} className="flex items-center space-x-3 p-2">
                          <Checkbox
                            checked={selectedFriends.includes(friend.user.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedFriends([...selectedFriends, friend.user.id]);
                              } else {
                                setSelectedFriends(selectedFriends.filter(id => id !== friend.user.id));
                              }
                            }}
                          />
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={friend.user.avatar} />
                            <AvatarFallback>{friend.user.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-foreground">{friend.user.displayName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full gradient-bg text-primary-foreground"
                  onClick={handleCreateTournament}
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Create Tournament
                </Button>
              </div>
            </TabsContent>

            {/* My Tournaments */}
            <TabsContent value="my-tournaments" className="p-6 space-y-4">
              {myTournaments.length > 0 ? myTournaments.map((tournament) => (
                <Card key={tournament.id} className="gradient-card backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-primary flex items-center space-x-2">
                          <Trophy className="w-5 h-5" />
                          <span>{tournament.name}</span>
                        </CardTitle>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{tournament.course}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{tournament.date.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {tournament.isPublic ? (
                          <Badge className="bg-green-400/20 text-green-400 border-green-400/30">
                            <Globe className="w-3 h-3 mr-1" />
                            Public
                          </Badge>
                        ) : (
                          <Badge className="bg-accent/20 text-accent border-accent/30">
                            <Lock className="w-3 h-3 mr-1" />
                            Private
                          </Badge>
                        )}
                        {tournament.createdBy === currentUser.id && (
                          <Badge variant="secondary">Host</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Join Code */}
                    {tournament.joinCode && tournament.createdBy === currentUser.id && (
                      <div className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
                        <div>
                          <div className="font-medium text-primary">Join Code</div>
                          <div className="text-sm text-muted-foreground">Share with players</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <code className="px-2 py-1 bg-muted rounded text-foreground font-mono">
                            {tournament.joinCode}
                          </code>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleCopyJoinCode(tournament.joinCode!)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Leaderboard */}
                    <div>
                      <h4 className="font-medium text-primary mb-3 flex items-center space-x-2">
                        <Star className="w-4 h-4" />
                        <span>Leaderboard ({tournament.players.length} players)</span>
                      </h4>
                      <div className="space-y-2">
                        {tournament.players
                          .map((player, index) => ({
                            ...player,
                            score: tournament.scores[player.id] || Math.floor(Math.random() * 20) + 70,
                            position: index + 1
                          }))
                          .sort((a, b) => a.score - b.score)
                          .map((player, index) => {
                            const actualPosition = index + 1;
                            const isCurrentUser = player.id === currentUser.id;
                            
                            return (
                              <div 
                                key={player.id}
                                className={`flex items-center justify-between p-3 rounded-lg border backdrop-blur-sm ${
                                  isCurrentUser 
                                    ? 'bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30 ring-1 ring-primary/50'
                                    : 'bg-background/20 border-white/10'
                                }`}
                              >
                                <div className="flex items-center space-x-3">
                                  {getRankIcon(actualPosition)}
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={player.avatar} />
                                    <AvatarFallback>{player.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className={`font-medium ${isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                                      {player.displayName}
                                      {isCurrentUser && <span className="text-xs text-accent ml-2">(You)</span>}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      Handicap {player.handicap}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className={`text-lg font-bold ${
                                    actualPosition === 1 ? 'text-yellow-400' :
                                    actualPosition === 2 ? 'text-gray-400' :
                                    actualPosition === 3 ? 'text-amber-600' :
                                    'text-accent'
                                  }`}>
                                    {tournament.completed ? player.score : '--'}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {tournament.completed ? 'Final' : 'TBD'}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* Tournament Actions */}
                    <div className="flex space-x-2">
                      {!tournament.completed && (
                        <Button 
                          size="sm"
                          className="gradient-bg text-primary-foreground flex-1"
                        >
                          <Target className="w-4 h-4 mr-2" />
                          Enter Score
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-accent/30 text-accent"
                      >
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground mb-4">You haven't joined any tournaments yet</p>
                  <Button 
                    className="gradient-bg text-primary-foreground"
                    onClick={() => setActiveTab('browse')}
                  >
                    Browse Tournaments
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}