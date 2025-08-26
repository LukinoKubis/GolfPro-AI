import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Checkbox } from '../ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Globe, Lock, Trophy } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TournamentCreatorProps {
  friends: any[];
  onCreateTournament: (tournament: any) => void;
  onTabChange: (tab: string) => void;
}

export function TournamentCreator({ friends, onCreateTournament, onTabChange }: TournamentCreatorProps) {
  const [tournamentName, setTournamentName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

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
      createdBy: 'user1',
      joinCode: isPublic ? undefined : Math.random().toString(36).substring(7).toUpperCase()
    };

    onCreateTournament(newTournament);
    toast.success('Tournament created successfully!');
    setTournamentName('');
    setCourseName('');
    onTabChange('my-tournaments');
  };

  return (
    <div className="space-y-6">
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
    </div>
  );
}