import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { 
  ChevronLeft, Search, UserPlus, QrCode, Camera, Copy, 
  CheckCircle, Users, Zap, Trophy, MapPin
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface AddFriendProps {
  onBack: () => void;
}

export function AddFriend({ onBack }: AddFriendProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const {
    searchUsers,
    addFriend,
    currentUser,
    friends
  } = useAppContext();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const results = searchUsers(query);
      setSearchResults(results.filter(user => 
        user.id !== currentUser.id && 
        !friends.some(friend => friend.user.id === user.id)
      ));
    } else {
      setSearchResults([]);
    }
  };

  const handleAddFriend = async (username: string) => {
    const success = await addFriend(username);
    if (success) {
      toast.success(`Friend request sent to ${username}!`);
      setSearchQuery('');
      setSearchResults([]);
    } else {
      toast.error('User not found or already friends');
    }
  };

  const handleCopyInviteLink = () => {
    const inviteLink = `https://golfproai.com/invite/${currentUser.username}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied to clipboard!');
  };

  const handleStartScanning = () => {
    setIsScanning(true);
    // Simulate QR scanning
    setTimeout(() => {
      setIsScanning(false);
      toast.success('QR code scanned! Friend request sent.');
    }, 3000);
  };

  // Generate QR code data (in real app would be actual QR code)
  const qrCodeData = `${currentUser.username}`;

  return (
    <div className="p-4 pb-20 space-y-6 scroll-container overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-medium">Add Friends</h1>
          <p className="text-sm text-muted-foreground">Connect with other golfers</p>
        </div>
      </div>

      {/* Search Section */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search Players</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Enter username..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-background/50 border-white/20 backdrop-blur-sm"
            />
          </div>
          
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-60 scroll-container overflow-y-auto">
              {searchResults.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} alt={user.displayName} />
                        <AvatarFallback>{user.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                        user.isOnline ? 'bg-green-400' : 'bg-muted'
                      }`} />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{user.displayName}</div>
                      <div className="text-sm text-muted-foreground flex items-center space-x-2">
                        <span>@{user.username}</span>
                        <span>•</span>
                        <span>Handicap {user.handicap}</span>
                      </div>
                      {user.location && (
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span>{user.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="gradient-bg text-primary-foreground"
                    onClick={() => handleAddFriend(user.username)}
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          )}

          {searchQuery.length > 2 && searchResults.length === 0 && (
            <div className="text-center py-6">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">No users found</p>
              <p className="text-xs text-muted-foreground">Try a different username</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Add Methods */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Quick Add</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Show QR Code */}
          <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-start bg-background/30 border-white/20 backdrop-blur-sm hover:bg-background/50"
                onClick={() => setShowQRCode(true)}
              >
                <QrCode className="w-5 h-5 mr-3 text-accent" />
                <div className="text-left">
                  <div className="font-medium">Show My QR Code</div>
                  <div className="text-xs text-muted-foreground">Let others scan to add you</div>
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="gradient-card backdrop-blur-sm border-white/10">
              <DialogHeader>
                <DialogTitle className="text-primary">My QR Code</DialogTitle>
                <DialogDescription>
                  Share this QR code for others to add you as a friend
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                    {/* QR Code placeholder - in real app would use QR generator */}
                    <div className="w-40 h-40 bg-black rounded grid grid-cols-8 gap-1 p-2">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`${Math.random() > 0.5 ? 'bg-white' : 'bg-black'} rounded-sm`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-primary">{currentUser.displayName}</div>
                    <div className="text-sm text-muted-foreground">@{currentUser.username}</div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setShowQRCode(false);
                    toast.success('QR code saved to photos');
                  }}
                >
                  Save QR Code
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Scan QR Code */}
          <Button 
            variant="outline" 
            className="w-full justify-start bg-background/30 border-white/20 backdrop-blur-sm hover:bg-background/50"
            onClick={handleStartScanning}
          >
            <Camera className="w-5 h-5 mr-3 text-accent" />
            <div className="text-left">
              <div className="font-medium">Scan QR Code</div>
              <div className="text-xs text-muted-foreground">Add friends by scanning their code</div>
            </div>
          </Button>

          {/* Copy Invite Link */}
          <Button 
            variant="outline" 
            className="w-full justify-start bg-background/30 border-white/20 backdrop-blur-sm hover:bg-background/50"
            onClick={handleCopyInviteLink}
          >
            <Copy className="w-5 h-5 mr-3 text-accent" />
            <div className="text-left">
              <div className="font-medium">Copy Invite Link</div>
              <div className="text-xs text-muted-foreground">Share your profile link</div>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* QR Scanning Overlay */}
      {isScanning && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
          <Card className="gradient-card backdrop-blur-sm border-white/10 m-4">
            <CardContent className="p-8 text-center">
              <div className="w-64 h-64 border-2 border-accent/50 rounded-lg mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/20 to-transparent animate-pulse"></div>
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-accent animate-pulse"></div>
                <Camera className="w-16 h-16 text-accent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30" />
              </div>
              <h3 className="font-medium text-primary mb-2">Scanning QR Code...</h3>
              <p className="text-sm text-muted-foreground mb-4">Point camera at QR code</p>
              <Button 
                variant="outline" 
                onClick={() => setIsScanning(false)}
                className="border-white/20"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Suggested Friends */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Suggested Friends</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Mock suggested friends based on common interests */}
          {[
            {
              id: 'suggested1',
              displayName: 'Jennifer Park',
              username: 'jen_golf23',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jen',
              handicap: 14.5,
              mutualFriends: 2,
              reason: '2 mutual friends'
            },
            {
              id: 'suggested2',
              displayName: 'Robert Kim',
              username: 'rob_golfer',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rob',
              handicap: 9.8,
              mutualFriends: 1,
              reason: 'Plays nearby courses'
            }
          ].map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.avatar} alt={user.displayName} />
                  <AvatarFallback>{user.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-foreground">{user.displayName}</div>
                  <div className="text-sm text-muted-foreground">@{user.username} • Handicap {user.handicap}</div>
                  <div className="text-xs text-accent">{user.reason}</div>
                </div>
              </div>
              <Button 
                size="sm" 
                className="gradient-bg text-primary-foreground"
                onClick={() => handleAddFriend(user.username)}
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}