import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  ChevronLeft, Moon, Sun, Volume2, VolumeX, Smartphone, 
  Bell, Shield, Database, Palette, Settings as SettingsIcon,
  Globe, User, Camera, Mic, MapPin, Wifi, Battery, Watch,
  Bluetooth, CheckCircle, AlertCircle, Target, Zap
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';

interface SettingsProps {
  onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
  const [soundVolume, setSoundVolume] = useState([75]);
  const [units, setUnits] = useState('imperial');
  const [language, setLanguage] = useState('english');
  const [isConnectingWatch, setIsConnectingWatch] = useState(false);
  const [isWatchConnected, setIsWatchConnected] = useState(false);

  const { 
    userSettings, 
    updateUserSettings,
    voiceSettings,
    updateVoiceSettings,
    smartwatchSettings,
    updateSmartwatchSettings
  } = useAppContext();

  // Initialize theme from user settings and apply to document
  useEffect(() => {
    const isDark = userSettings.theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
  }, [userSettings.theme]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    // Apply theme to document immediately
    const isDark = newTheme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    
    // Update context
    updateUserSettings({ theme: newTheme });
    toast.success(`Switched to ${newTheme} theme`);
  };

  const handleSettingChange = (setting: string, value: any, label: string) => {
    updateUserSettings({ [setting]: value });
    toast.success(`${label} ${value ? 'enabled' : 'disabled'}`);
  };

  const handleConnectWatch = async () => {
    setIsConnectingWatch(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnectingWatch(false);
      setIsWatchConnected(true);
      updateSmartwatchSettings({ enabled: true });
      toast.success('Smartwatch connected successfully!');
    }, 3000);
  };

  const handleDisconnectWatch = () => {
    setIsWatchConnected(false);
    updateSmartwatchSettings({ 
      enabled: false, 
      clubSuggestions: false, 
      swingDetection: false 
    });
    toast.success('Smartwatch disconnected');
  };

  const handleToggleWatchSetting = (setting: keyof typeof smartwatchSettings, value: boolean) => {
    if (!isWatchConnected && value) {
      toast.error('Connect your smartwatch first');
      return;
    }
    
    updateSmartwatchSettings({ [setting]: value });
    toast.success(`${setting} ${value ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="p-4 pb-20 space-y-6 scroll-container overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-medium">Settings</h1>
          <p className="text-sm text-muted-foreground">Customize your app experience</p>
        </div>
      </div>

      {/* Appearance */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Appearance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Theme Toggle */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-primary">Theme</label>
            <div className="flex space-x-2">
              <Button
                variant={userSettings.theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleThemeChange('light')}
                className={userSettings.theme === 'light' ? 'gradient-bg text-primary-foreground' : 'border-white/20'}
              >
                <Sun className="w-4 h-4 mr-2" />
                Light
              </Button>
              <Button
                variant={userSettings.theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleThemeChange('dark')}
                className={userSettings.theme === 'dark' ? 'gradient-bg text-primary-foreground' : 'border-white/20'}
              >
                <Moon className="w-4 h-4 mr-2" />
                Dark
              </Button>
            </div>
          </div>

          {/* Units */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">Measurement Units</label>
            <Select value={units} onValueChange={setUnits}>
              <SelectTrigger className="bg-background/50 border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="gradient-card border-white/20">
                <SelectItem value="metric">Metric (meters, km)</SelectItem>
                <SelectItem value="imperial">Imperial (yards, miles)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-background/50 border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="gradient-card border-white/20">
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Español</SelectItem>
                <SelectItem value="french">Français</SelectItem>
                <SelectItem value="german">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Smartwatch Integration */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary flex items-center space-x-2">
            <Watch className="w-5 h-5" />
            <span>Smartwatch Integration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-12 bg-gradient-to-b from-muted to-muted/50 rounded border border-white/20 flex items-center justify-center">
                  <Watch className="w-5 h-5 text-primary" />
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${
                  isWatchConnected ? 'bg-green-400' : 'bg-muted'
                }`} />
              </div>
              <div>
                <div className="font-medium text-foreground">
                  {isWatchConnected ? 'Apple Watch Series 9' : 'No Device Connected'}
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  {isWatchConnected ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span className="text-green-400">Connected</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Disconnected</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {!isWatchConnected ? (
              <Button
                className="gradient-bg text-primary-foreground"
                onClick={handleConnectWatch}
                disabled={isConnectingWatch}
                size="sm"
              >
                {isConnectingWatch ? (
                  <>
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Bluetooth className="w-3 h-3 mr-2" />
                    Connect
                  </>
                )}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleDisconnectWatch}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                size="sm"
              >
                Disconnect
              </Button>
            )}
          </div>

          {/* Watch Features */}
          {isWatchConnected && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-background/20 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <Target className="w-4 h-4 text-primary" />
                  <div>
                    <div className="font-medium text-foreground text-sm">Club Suggestions</div>
                    <div className="text-xs text-muted-foreground">AI recommendations on watch</div>
                  </div>
                </div>
                <Switch
                  checked={smartwatchSettings.clubSuggestions}
                  onCheckedChange={(checked) => handleToggleWatchSetting('clubSuggestions', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-background/20 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="flex items-center space-x-3">
                  <Zap className="w-4 h-4 text-accent" />
                  <div>
                    <div className="font-medium text-foreground text-sm">Swing Detection</div>
                    <div className="text-xs text-muted-foreground">Auto-track swings</div>
                  </div>
                </div>
                <Switch
                  checked={smartwatchSettings.swingDetection}
                  onCheckedChange={(checked) => handleToggleWatchSetting('swingDetection', checked)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audio & Notifications */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary flex items-center space-x-2">
            <Volume2 className="w-5 h-5" />
            <span>Audio & Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              {userSettings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-primary" />
              ) : (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <div className="font-medium text-foreground">Sound Effects</div>
                <div className="text-sm text-muted-foreground">App sounds and feedback</div>
              </div>
            </div>
            <Switch
              checked={userSettings.soundEnabled}
              onCheckedChange={(checked) => {
                handleSettingChange('soundEnabled', checked, 'Sound effects');
              }}
            />
          </div>

          {/* Volume Slider */}
          {userSettings.soundEnabled && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Volume</label>
              <Slider
                value={soundVolume}
                onValueChange={setSoundVolume}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground text-right">{soundVolume[0]}%</div>
            </div>
          )}

          {/* Notifications */}
          <div className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-accent" />
              <div>
                <div className="font-medium text-foreground">Push Notifications</div>
                <div className="text-sm text-muted-foreground">Challenges, reminders, updates</div>
              </div>
            </div>
            <Switch
              checked={userSettings.notificationsEnabled}
              onCheckedChange={(checked) => {
                handleSettingChange('notificationsEnabled', checked, 'Notifications');
              }}
            />
          </div>

          {/* Voice Feedback */}
          <div className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              <Mic className="w-5 h-5 text-green-400" />
              <div>
                <div className="font-medium text-foreground">Voice Feedback</div>
                <div className="text-sm text-muted-foreground">AI coaching voice responses</div>
              </div>
            </div>
            <Switch
              checked={voiceSettings.feedbackEnabled}
              onCheckedChange={(checked) => {
                updateVoiceSettings({ feedbackEnabled: checked });
                toast.success(`Voice feedback ${checked ? 'enabled' : 'disabled'}`);
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Permissions */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Privacy & Permissions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Location */}
          <div className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-400" />
              <div>
                <div className="font-medium text-foreground">Location Services</div>
                <div className="text-sm text-muted-foreground">GPS tracking for rounds</div>
              </div>
            </div>
            <Switch
              checked={userSettings.locationEnabled}
              onCheckedChange={(checked) => {
                handleSettingChange('locationEnabled', checked, 'Location services');
              }}
            />
          </div>

          {/* Camera */}
          <div className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              <Camera className="w-5 h-5 text-purple-400" />
              <div>
                <div className="font-medium text-foreground">Camera Access</div>
                <div className="text-sm text-muted-foreground">Swing analysis and recording</div>
              </div>
            </div>
            <Switch
              checked={userSettings.cameraEnabled}
              onCheckedChange={(checked) => {
                handleSettingChange('cameraEnabled', checked, 'Camera access');
              }}
            />
          </div>

          {/* Microphone */}
          <div className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              <Mic className="w-5 h-5 text-red-400" />
              <div>
                <div className="font-medium text-foreground">Microphone Access</div>
                <div className="text-sm text-muted-foreground">Voice commands and feedback</div>
              </div>
            </div>
            <Switch
              checked={userSettings.micEnabled}
              onCheckedChange={(checked) => {
                handleSettingChange('micEnabled', checked, 'Microphone access');
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data & Storage */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Data & Storage</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auto Backup */}
          <div className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-green-400" />
              <div>
                <div className="font-medium text-foreground">Auto Backup</div>
                <div className="text-sm text-muted-foreground">Sync data to cloud automatically</div>
              </div>
            </div>
            <Switch
              checked={userSettings.autoBackup}
              onCheckedChange={(checked) => {
                handleSettingChange('autoBackup', checked, 'Auto backup');
              }}
            />
          </div>

          {/* Offline Mode */}
          <div className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              <Wifi className="w-5 h-5 text-orange-400" />
              <div>
                <div className="font-medium text-foreground">Offline Mode</div>
                <div className="text-sm text-muted-foreground">Use app without internet</div>
              </div>
            </div>
            <Switch
              checked={userSettings.offlineMode}
              onCheckedChange={(checked) => {
                handleSettingChange('offlineMode', checked, 'Offline mode');
              }}
            />
          </div>

          {/* Storage Info */}
          <div className="p-3 bg-background/20 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-primary">Storage Used</span>
              <span className="text-sm text-accent">245 MB / 2 GB</span>
            </div>
            <div className="w-full bg-muted h-2 rounded-full">
              <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full" style={{width: '12%'}}></div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Videos: 180MB • Rounds: 45MB • Cache: 20MB
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary flex items-center space-x-2">
            <Battery className="w-5 h-5" />
            <span>Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Battery Optimization */}
          <div className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="flex items-center space-x-3">
              <Battery className="w-5 h-5 text-green-400" />
              <div>
                <div className="font-medium text-foreground">Battery Optimization</div>
                <div className="text-sm text-muted-foreground">Reduce background activity</div>
              </div>
            </div>
            <Switch
              checked={userSettings.batteryOptimization}
              onCheckedChange={(checked) => {
                handleSettingChange('batteryOptimization', checked, 'Battery optimization');
              }}
            />
          </div>

          {/* Performance Stats */}
          <div className="p-3 bg-background/20 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-primary">4.2GB</div>
                <div className="text-xs text-muted-foreground">Available Storage</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-400">98%</div>
                <div className="text-xs text-muted-foreground">App Performance</div>
              </div>
            </div>
          </div>

          {/* Clear Cache Button */}
          <Button 
            variant="outline" 
            className="w-full border-red-400/30 text-red-400 hover:bg-red-400/10"
            onClick={() => toast.success('Cache cleared successfully')}
          >
            Clear App Cache (20 MB)
          </Button>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Account</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full border-accent/30 text-accent hover:bg-accent/10">
            Export My Data
          </Button>
          <Button variant="outline" className="w-full border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10">
            Reset All Settings
          </Button>
          <Button variant="outline" className="w-full border-red-400/30 text-red-400 hover:bg-red-400/10">
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardContent className="p-4 text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <SettingsIcon className="w-5 h-5 text-primary" />
              <span className="font-medium text-primary">GolfPro AI</span>
            </div>
            <div className="text-sm text-muted-foreground">Version 2.1.0 (Build 421)</div>
            <div className="text-xs text-muted-foreground">© 2025 GolfPro AI. All rights reserved.</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}