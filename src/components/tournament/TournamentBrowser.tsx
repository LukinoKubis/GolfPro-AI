import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Globe, MapPin, Calendar, Users, Trophy } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TournamentBrowserProps {
  tournaments: any[];
  onJoinTournament: (tournamentId: string) => void;
}

export function TournamentBrowser({ tournaments, onJoinTournament }: TournamentBrowserProps) {
  const [joinCode, setJoinCode] = useState('');

  const handleJoinByCode = () => {
    if (!joinCode) {
      toast.error('Please enter a join code');
      return;
    }
    
    const tournament = tournaments.find(t => t.joinCode === joinCode.toUpperCase());
    if (tournament) {
      onJoinTournament(tournament.id);
      setJoinCode('');
    } else {
      toast.error('Invalid join code');
    }
  };

  const availableTournaments = tournaments.filter(t => 
    t.isPublic && !t.players.some((p: any) => p.id === 'user1') && t.createdBy !== 'user1'
  );

  return (
    <div className="space-y-6">
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
                  onClick={() => onJoinTournament(tournament.id)}
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
    </div>
  );
}