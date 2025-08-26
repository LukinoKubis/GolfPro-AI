import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { MapPin, Target, Zap } from 'lucide-react';

interface Shot {
  id: number;
  x: number;
  y: number;
  club: string;
  distance: number;
  result: 'fairway' | 'rough' | 'green' | 'water' | 'sand';
}

interface HoleMapProps {
  holeNumber: number;
  par: number;
  distance: number;
  shots: Shot[];
  onAddShot?: (x: number, y: number) => void;
  readonly?: boolean;
}

export function HoleMap({ holeNumber, par, distance, shots, onAddShot, readonly = false }: HoleMapProps) {
  const [selectedShot, setSelectedShot] = useState<number | null>(null);

  const handleMapClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (readonly || !onAddShot) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    onAddShot(x, y);
  };

  const getShotColor = (result: string) => {
    switch (result) {
      case 'fairway': return '#4ade80';
      case 'green': return '#22c55e';
      case 'rough': return '#eab308';
      case 'water': return '#3b82f6';
      case 'sand': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <Card className="w-full gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-primary">
          <span>Hole {holeNumber}</span>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="border-primary/30 text-primary">Par {par}</Badge>
            <Badge variant="secondary" className="bg-secondary/50">{distance}y</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Map SVG */}
        <div className="relative bg-gradient-to-b from-[var(--golf-rough)] to-[var(--golf-fairway)] rounded-lg overflow-hidden border border-white/10">
          <svg
            width="100%"
            height="300"
            viewBox="0 0 100 100"
            className="cursor-pointer"
            onClick={handleMapClick}
          >
            {/* Tee Box */}
            <rect x="5" y="85" width="10" height="8" fill="var(--golf-green)" rx="2" />
            <text x="10" y="91" textAnchor="middle" className="fill-white text-xs">Tee</text>
            
            {/* Fairway */}
            <path
              d="M 15 89 Q 50 70 85 30"
              stroke="var(--golf-fairway)"
              strokeWidth="25"
              fill="none"
              opacity="0.8"
            />
            
            {/* Green */}
            <ellipse cx="85" cy="25" rx="12" ry="8" fill="var(--golf-green)" />
            
            {/* Pin */}
            <circle cx="85" cy="25" r="1" fill="#ef4444" />
            <line x1="85" y1="25" x2="85" y2="20" stroke="#ef4444" strokeWidth="0.5" />
            {/* Flag triangle */}
            <path d="M85,20 L89,18 L85,16 Z" fill="#ef4444" />
            
            {/* Water Hazard */}
            <ellipse cx="35" cy="50" rx="8" ry="5" fill="var(--golf-water)" opacity="0.7" />
            
            {/* Sand Bunkers */}
            <ellipse cx="70" cy="35" rx="6" ry="4" fill="var(--golf-sand)" />
            <ellipse cx="75" cy="40" rx="4" ry="3" fill="var(--golf-sand)" />
            
            {/* Shots */}
            {shots.map((shot, index) => (
              <g key={shot.id}>
                {/* Shot trail line */}
                {index > 0 && (
                  <line
                    x1={shots[index - 1].x}
                    y1={shots[index - 1].y}
                    x2={shot.x}
                    y2={shot.y}
                    stroke="white"
                    strokeWidth="0.5"
                    strokeDasharray="2,1"
                    opacity="0.6"
                  />
                )}
                
                {/* Shot marker */}
                <circle
                  cx={shot.x}
                  cy={shot.y}
                  r="2"
                  fill={getShotColor(shot.result)}
                  stroke="white"
                  strokeWidth="0.5"
                  className={`cursor-pointer transition-all ${
                    selectedShot === shot.id ? 'scale-150' : 'hover:scale-125'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedShot(selectedShot === shot.id ? null : shot.id);
                  }}
                />
                
                {/* Shot number */}
                <text
                  x={shot.x}
                  y={shot.y + 0.5}
                  textAnchor="middle"
                  className="fill-white text-xs font-bold pointer-events-none"
                >
                  {index + 1}
                </text>
              </g>
            ))}
            
            {/* Distance markers */}
            <g className="text-xs fill-white opacity-60">
              <text x="30" y="95" textAnchor="middle">100y</text>
              <text x="55" y="95" textAnchor="middle">150y</text>
              <text x="80" y="95" textAnchor="middle">200y</text>
            </g>
          </svg>
          
          {/* Legend */}
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg p-2 text-xs border border-white/10">
            <div className="flex items-center space-x-1 mb-1">
              <div className="w-3 h-3 bg-[var(--golf-fairway)] rounded"></div>
              <span className="text-white">Fairway</span>
            </div>
            <div className="flex items-center space-x-1 mb-1">
              <div className="w-3 h-3 bg-[var(--golf-green)] rounded"></div>
              <span className="text-white">Green</span>
            </div>
            <div className="flex items-center space-x-1 mb-1">
              <div className="w-3 h-3 bg-[var(--golf-water)] rounded"></div>
              <span className="text-white">Water</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-[var(--golf-sand)] rounded"></div>
              <span className="text-white">Sand</span>
            </div>
          </div>
        </div>

        {/* Shot Details */}
        {selectedShot && (
          <div className="mt-4 p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
            {shots
              .filter(shot => shot.id === selectedShot)
              .map(shot => (
                <div key={shot.id} className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-primary">Shot {shots.findIndex(s => s.id === shot.id) + 1}</span>
                    <p className="text-sm text-muted-foreground">{shot.club} • {shot.distance}y</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="capitalize border-accent/30 text-accent"
                    style={{ borderColor: getShotColor(shot.result), color: getShotColor(shot.result) }}
                  >
                    {shot.result}
                  </Badge>
                </div>
              ))}
          </div>
        )}

        {!readonly && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">Tap on the map to mark your shot position</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}