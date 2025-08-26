import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Target, TrendingUp, RotateCcw, MapPin, Zap,
  ChevronLeft, BarChart3, Activity
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

interface HeatmapVisualizationProps {
  onBack: () => void;
}

export function HeatmapVisualization({ onBack }: HeatmapVisualizationProps) {
  const [selectedClub, setSelectedClub] = useState('Driver');
  const [activeTab, setActiveTab] = useState<'approach' | 'drive'>('approach');

  const { heatmapData, addHeatmapData } = useAppContext();

  const clubData = heatmapData.find(data => data.club === selectedClub);
  const shots = clubData?.shots || [];

  const getHeatmapColor = (result: string) => {
    switch (result) {
      case 'hit':
        return 'bg-golf-green';
      case 'miss-left':
        return 'bg-red-500';
      case 'miss-right':
        return 'bg-blue-500';
      case 'short':
        return 'bg-yellow-500';
      case 'long':
        return 'bg-purple-500';
      default:
        return 'bg-muted';
    }
  };

  const getResultCount = (result: string) => {
    return shots.filter(shot => shot.result === result).length;
  };

  const getAccuracyPercentage = () => {
    if (shots.length === 0) return 0;
    const hits = getResultCount('hit');
    return Math.round((hits / shots.length) * 100);
  };

  // Generate mock heatmap data for visualization
  const generateMockData = () => {
    const results = ['hit', 'miss-left', 'miss-right', 'short', 'long'];
    for (let i = 0; i < 15; i++) {
      const mockShot = {
        x: Math.random() * 100,
        y: Math.random() * 100,
        result: results[Math.floor(Math.random() * results.length)] as any
      };
      addHeatmapData(selectedClub, mockShot);
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
          <h1 className="text-xl font-medium">Shot Pattern Analysis</h1>
          <p className="text-sm text-muted-foreground">Visualize your shot dispersion patterns</p>
        </div>
      </div>

      {/* Club Selection */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Select value={selectedClub} onValueChange={setSelectedClub}>
              <SelectTrigger className="w-40 bg-background/50 border-white/20 backdrop-blur-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="gradient-card border-white/20 backdrop-blur-sm">
                <SelectItem value="Driver">Driver</SelectItem>
                <SelectItem value="3-Wood">3-Wood</SelectItem>
                <SelectItem value="7-Iron">7-Iron</SelectItem>
                <SelectItem value="Wedge">Wedge</SelectItem>
                <SelectItem value="Putter">Putter</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={generateMockData}
              className="border-accent/30 text-accent"
            >
              <Activity className="w-4 h-4 mr-2" />
              Generate Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Heatmap Tabs */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Shot Pattern Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50 backdrop-blur-sm">
              <TabsTrigger 
                value="approach"
                className={activeTab === 'approach' ? 'gradient-bg text-primary-foreground' : ''}
              >
                <Target className="w-4 h-4 mr-2" />
                Approach Shots
              </TabsTrigger>
              <TabsTrigger 
                value="drive"
                className={activeTab === 'drive' ? 'gradient-bg text-primary-foreground' : ''}
              >
                <Zap className="w-4 h-4 mr-2" />
                Drive Pattern
              </TabsTrigger>
            </TabsList>

            <TabsContent value="approach" className="space-y-4">
              {/* Green/Target Heatmap */}
              <div className="relative">
                <div className="w-full h-64 bg-golf-green/20 rounded-lg border-2 border-golf-green/30 relative overflow-hidden">
                  {/* Target circle */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-golf-green border-2 border-golf-green/50 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  
                  {/* Shot markers */}
                  {shots.map((shot, index) => (
                    <div
                      key={index}
                      className={`absolute w-3 h-3 rounded-full border border-white/30 ${getHeatmapColor(shot.result)}`}
                      style={{
                        left: `${shot.x}%`,
                        top: `${shot.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  ))}
                </div>
                
                <div className="mt-4 text-center">
                  <Badge className="bg-golf-green/20 text-golf-green border-golf-green/30">
                    <Target className="w-3 h-3 mr-1" />
                    {getAccuracyPercentage()}% accuracy to target
                  </Badge>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="drive" className="space-y-4">
              {/* Fairway Heatmap */}
              <div className="relative">
                <div className="w-full h-64 bg-golf-fairway/20 rounded-lg border-2 border-golf-fairway/30 relative overflow-hidden">
                  {/* Fairway boundaries */}
                  <div className="absolute inset-x-0 top-0 h-full">
                    <div className="h-full w-full bg-gradient-to-r from-golf-rough/30 via-golf-fairway/30 to-golf-rough/30" />
                    <div className="absolute left-1/4 top-0 w-px h-full bg-white/30" />
                    <div className="absolute right-1/4 top-0 w-px h-full bg-white/30" />
                  </div>
                  
                  {/* Shot markers */}
                  {shots.map((shot, index) => (
                    <div
                      key={index}
                      className={`absolute w-3 h-3 rounded-full border border-white/30 ${getHeatmapColor(shot.result)}`}
                      style={{
                        left: `${shot.x}%`,
                        top: `${shot.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  ))}
                </div>
                
                <div className="mt-4 flex justify-center space-x-4">
                  <Badge className="bg-golf-fairway/20 text-golf-fairway border-golf-fairway/30">
                    <MapPin className="w-3 h-3 mr-1" />
                    Fairway hits: {Math.round(getAccuracyPercentage() * 0.7)}%
                  </Badge>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Pattern Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-golf-green border border-white/30" />
              <span className="text-sm">Hit ({getResultCount('hit')})</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-red-500 border border-white/30" />
              <span className="text-sm">Miss Left ({getResultCount('miss-left')})</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-blue-500 border border-white/30" />
              <span className="text-sm">Miss Right ({getResultCount('miss-right')})</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-yellow-500 border border-white/30" />
              <span className="text-sm">Short ({getResultCount('short')})</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded-full bg-purple-500 border border-white/30" />
              <span className="text-sm">Long ({getResultCount('long')})</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Summary */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Pattern Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10 text-center">
              <div className="text-2xl font-bold text-primary">{shots.length}</div>
              <div className="text-xs text-muted-foreground">Total Shots</div>
            </div>
            <div className="p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10 text-center">
              <div className="text-2xl font-bold text-golf-green">{getAccuracyPercentage()}%</div>
              <div className="text-xs text-muted-foreground">Accuracy</div>
            </div>
          </div>
          
          {shots.length > 5 && (
            <div className="p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-primary mb-1">Pattern Insights</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {getResultCount('miss-left') > getResultCount('miss-right') && (
                      <li>• You tend to miss left - work on alignment</li>
                    )}
                    {getResultCount('miss-right') > getResultCount('miss-left') && (
                      <li>• You tend to miss right - check grip pressure</li>
                    )}
                    {getAccuracyPercentage() > 70 && (
                      <li>• Great consistency! Keep up the good work</li>
                    )}
                    {getAccuracyPercentage() < 50 && (
                      <li>• Focus on fundamentals and tempo</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}