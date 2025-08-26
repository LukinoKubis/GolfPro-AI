import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { 
  ChevronLeft, Watch, Zap, Target, Bluetooth, 
  CheckCircle, AlertCircle, Smartphone, Settings
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface SmartwatchSettingsProps {
  onBack: () => void;
}

export function SmartwatchSettings({ onBack }: SmartwatchSettingsProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const {
    smartwatchSettings,
    updateSmartwatchSettings
  } = useAppContext();

  const handleToggleSetting = (setting: keyof typeof smartwatchSettings, value: boolean) => {
    if (!isConnected && value) {
      toast.error('Connect your smartwatch first');
      return;
    }
    
    updateSmartwatchSettings({ [setting]: value });
    toast.success(`${setting} ${value ? 'enabled' : 'disabled'}`);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      updateSmartwatchSettings({ enabled: true });
      toast.success('Smartwatch connected successfully!');
    }, 3000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    updateSmartwatchSettings({ 
      enabled: false, 
      clubSuggestions: false, 
      swingDetection: false 
    });
    toast.success('Smartwatch disconnected');
  };

  return (
    <div className="p-4 pb-20 space-y-6 scroll-container overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-medium">Smartwatch Integration</h1>
          <p className="text-sm text-muted-foreground">Connect and configure your smartwatch</p>
        </div>
      </div>

      {/* Connection Status */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {/* Smartwatch Illustration */}
                <div className="w-16 h-20 bg-gradient-to-b from-muted to-muted/50 rounded-lg border border-white/20 flex items-center justify-center">
                  <div className="w-12 h-14 bg-background rounded border border-white/30 flex items-center justify-center">
                    <Watch className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${
                  isConnected ? 'bg-green-400' : 'bg-muted'
                }`} />
              </div>
              
              <div>
                <h3 className="font-medium text-primary">
                  {isConnected ? 'Apple Watch Series 9' : 'No Device Connected'}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  {isConnected ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">Connected</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Disconnected</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {!isConnected ? (
              <Button
                className="gradient-bg text-primary-foreground"
                onClick={handleConnect}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Bluetooth className="w-4 h-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleDisconnect}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                Disconnect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Watch Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Club Suggestions */}
          <div className="flex items-center justify-between p-4 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Club Suggestions</h4>
                <p className="text-sm text-muted-foreground">
                  Receive AI club recommendations on your watch
                </p>
              </div>
            </div>
            <Switch
              checked={smartwatchSettings.clubSuggestions}
              onCheckedChange={(checked) => handleToggleSetting('clubSuggestions', checked)}
              disabled={!isConnected}
            />
          </div>

          {/* Swing Detection */}
          <div className="flex items-center justify-between p-4 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg">
                <Zap className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-medium text-foreground">Swing Detection</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically detect and track swings
                </p>
              </div>
            </div>
            <Switch
              checked={smartwatchSettings.swingDetection}
              onCheckedChange={(checked) => handleToggleSetting('swingDetection', checked)}
              disabled={!isConnected}
            />
          </div>
        </CardContent>
      </Card>

      {/* Watch App Features */}
      {isConnected && (
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-primary">Available on Watch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-background/20 backdrop-blur-sm rounded-lg">
              <div className="flex items-center space-x-3">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm">Distance to pin</span>
              </div>
              <Badge className="bg-green-400/20 text-green-400 border-green-400/30">
                Active
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-background/20 backdrop-blur-sm rounded-lg">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-4 h-4 text-accent" />
                <span className="text-sm">Score tracking</span>
              </div>
              <Badge className="bg-green-400/20 text-green-400 border-green-400/30">
                Active
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-background/20 backdrop-blur-sm rounded-lg">
              <div className="flex items-center space-x-3">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">Shot analysis</span>
              </div>
              <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
                Coming Soon
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Setup Instructions */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Setup Instructions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                1
              </div>
              <p className="text-sm text-muted-foreground">
                Install GolfPro AI app on your Apple Watch
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                2
              </div>
              <p className="text-sm text-muted-foreground">
                Enable Bluetooth and location permissions
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground">
                3
              </div>
              <p className="text-sm text-muted-foreground">
                Tap "Connect" above to pair your devices
              </p>
            </div>
          </div>
          
          {!isConnected && (
            <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-sm text-accent text-center">
                Watch app required for full functionality
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Battery & Performance */}
      {isConnected && (
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-primary">Battery & Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Watch Battery Impact</span>
              <Badge variant="outline" className="border-green-400/30 text-green-400">
                Minimal
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Data Sync</span>
              <Badge variant="outline" className="border-blue-400/30 text-blue-400">
                Real-time
              </Badge>
            </div>
            
            <div className="text-xs text-muted-foreground mt-2">
              Features are optimized for minimal battery usage during rounds
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}