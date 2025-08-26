import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Minus, Plus, CheckCircle, Flag, Target, 
  TrendingUp, Award, RotateCcw
} from 'lucide-react';

interface Hole {
  holeNumber: number;
  par: number;
  strokes: number;
  putts: number;
  shots: any[];
  completed: boolean;
}

interface CurrentRound {
  id: string;
  courseName: string;
  startTime: Date;
  holes: Hole[];
  completed: boolean;
}

interface ScorecardProps {
  currentRound: CurrentRound;
  currentHole: number;
  onUpdateScore: (holeNumber: number, updates: Partial<Hole>) => void;
}

export function Scorecard({ currentRound, currentHole, onUpdateScore }: ScorecardProps) {
  const [editingHole, setEditingHole] = useState<number | null>(null);
  const [tempStrokes, setTempStrokes] = useState<number>(0);
  const [tempPutts, setTempPutts] = useState<number>(0);

  const handleEditHole = (holeNumber: number) => {
    const hole = currentRound.holes[holeNumber - 1];
    setEditingHole(holeNumber);
    setTempStrokes(hole.strokes);
    setTempPutts(hole.putts);
  };

  const handleSaveEdit = () => {
    if (editingHole) {
      onUpdateScore(editingHole, {
        strokes: tempStrokes,
        putts: tempPutts,
        completed: tempStrokes > 0
      });
      setEditingHole(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingHole(null);
  };

  const calculateTotal = () => {
    return currentRound.holes.reduce((sum, hole) => sum + hole.strokes, 0);
  };

  const calculateTotalPar = () => {
    return currentRound.holes.reduce((sum, hole) => sum + hole.par, 0);
  };

  const calculateScore = () => {
    const total = calculateTotal();
    const par = calculateTotalPar();
    return total - par;
  };

  const getScoreColor = (strokes: number, par: number) => {
    const diff = strokes - par;
    if (strokes === 0) return 'text-muted-foreground';
    if (diff <= -2) return 'text-purple-400'; // Eagle or better
    if (diff === -1) return 'text-green-400'; // Birdie
    if (diff === 0) return 'text-blue-400'; // Par
    if (diff === 1) return 'text-yellow-400'; // Bogey
    if (diff === 2) return 'text-orange-400'; // Double bogey
    return 'text-red-400'; // Triple bogey or worse
  };

  const getScoreText = (strokes: number, par: number) => {
    const diff = strokes - par;
    if (strokes === 0) return '';
    if (diff <= -3) return 'Albatross';
    if (diff === -2) return 'Eagle';
    if (diff === -1) return 'Birdie';
    if (diff === 0) return 'Par';
    if (diff === 1) return 'Bogey';
    if (diff === 2) return 'Double';
    if (diff === 3) return 'Triple';
    return `+${diff}`;
  };

  // Split holes into front 9 and back 9
  const frontNine = currentRound.holes.slice(0, 9);
  const backNine = currentRound.holes.slice(9, 18);

  const ScoreRow = ({ holes, title }: { holes: Hole[], title: string }) => (
    <div className="space-y-2">
      <h4 className="font-medium text-primary text-sm">{title}</h4>
      <div className="grid grid-cols-10 gap-1 text-xs">
        {/* Header Row */}
        <div className="font-medium text-muted-foreground p-2 text-center">Hole</div>
        {holes.map((hole) => (
          <div key={hole.holeNumber} className="font-medium text-muted-foreground p-2 text-center">
            {hole.holeNumber}
          </div>
        ))}
        
        {/* Par Row */}
        <div className="font-medium text-primary p-2 text-center bg-background/30 rounded">Par</div>
        {holes.map((hole) => (
          <div key={`par-${hole.holeNumber}`} className="font-medium text-primary p-2 text-center bg-background/30 rounded">
            {hole.par}
          </div>
        ))}
        
        {/* Score Row */}
        <div className="font-medium text-accent p-2 text-center bg-background/40 rounded">Score</div>
        {holes.map((hole) => (
          <div 
            key={`score-${hole.holeNumber}`} 
            className={`font-bold p-2 text-center bg-background/40 rounded cursor-pointer transition-colors hover:bg-background/60 ${
              hole.holeNumber === currentHole ? 'ring-2 ring-primary' : ''
            } ${getScoreColor(hole.strokes, hole.par)}`}
            onClick={() => handleEditHole(hole.holeNumber)}
          >
            {editingHole === hole.holeNumber ? (
              <div className="flex flex-col space-y-1">
                <Input
                  type="number"
                  value={tempStrokes}
                  onChange={(e) => setTempStrokes(parseInt(e.target.value) || 0)}
                  className="w-8 h-6 p-0 text-center text-xs bg-background border-primary"
                  min="0"
                  max="15"
                />
              </div>
            ) : (
              hole.strokes || (hole.holeNumber === currentHole ? '•' : '-')
            )}
          </div>
        ))}
        
        {/* Putts Row */}
        <div className="font-medium text-green-400 p-2 text-center bg-background/20 rounded">Putts</div>
        {holes.map((hole) => (
          <div 
            key={`putts-${hole.holeNumber}`} 
            className="text-green-400 p-2 text-center bg-background/20 rounded text-xs"
          >
            {editingHole === hole.holeNumber ? (
              <Input
                type="number"
                value={tempPutts}
                onChange={(e) => setTempPutts(parseInt(e.target.value) || 0)}
                className="w-8 h-6 p-0 text-center text-xs bg-background border-green-400"
                min="0"
                max="10"
              />
            ) : (
              hole.putts || '-'
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Scorecard Header */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-primary flex items-center space-x-2">
              <Flag className="w-5 h-5" />
              <span>Scorecard</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge className="bg-primary/20 text-primary border-primary/30">
                Playing Hole {currentHole}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Course Info */}
          <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
            <div>
              <h3 className="font-medium text-foreground">{currentRound.courseName}</h3>
              <p className="text-sm text-muted-foreground">
                Started {currentRound.startTime.toLocaleDateString()} at {currentRound.startTime.toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-accent">{calculateTotal()}</div>
              <div className="text-xs text-muted-foreground">Total Score</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-background/20 rounded-lg">
              <div className={`font-bold ${calculateScore() <= 0 ? 'text-green-400' : calculateScore() <= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                {calculateScore() > 0 ? `+${calculateScore()}` : calculateScore()}
              </div>
              <div className="text-xs text-muted-foreground">vs Par</div>
            </div>
            <div className="text-center p-3 bg-background/20 rounded-lg">
              <div className="font-bold text-green-400">
                {currentRound.holes.reduce((sum, hole) => sum + hole.putts, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Putts</div>
            </div>
            <div className="text-center p-3 bg-background/20 rounded-lg">
              <div className="font-bold text-primary">
                {currentRound.holes.filter(hole => hole.completed).length}
              </div>
              <div className="text-xs text-muted-foreground">Holes Done</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Controls */}
      {editingHole && (
        <Card className="gradient-card backdrop-blur-sm border-primary/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-primary">Editing Hole {editingHole}</h4>
                <p className="text-sm text-muted-foreground">
                  Par {currentRound.holes[editingHole - 1].par} • Tap scorecard to change values
                </p>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button size="sm" className="gradient-bg text-primary-foreground" onClick={handleSaveEdit}>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Traditional Golf Scorecard */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-primary text-base">Traditional Scorecard</CardTitle>
          <p className="text-sm text-muted-foreground">Tap any score to edit • Current hole highlighted</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Front Nine */}
          <ScoreRow holes={frontNine} title="Front Nine" />
          
          {/* Back Nine */}
          {backNine.length > 0 && (
            <ScoreRow holes={backNine} title="Back Nine" />
          )}
          
          {/* Totals */}
          <div className="border-t border-white/10 pt-4">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-background/30 rounded-lg">
                <div className="font-bold text-primary">{calculateTotalPar()}</div>
                <div className="text-xs text-muted-foreground">Total Par</div>
              </div>
              <div className="p-3 bg-background/30 rounded-lg">
                <div className="font-bold text-accent">{calculateTotal()}</div>
                <div className="text-xs text-muted-foreground">Total Score</div>
              </div>
              <div className="p-3 bg-background/30 rounded-lg">
                <div className={`font-bold ${calculateScore() <= 0 ? 'text-green-400' : calculateScore() <= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {calculateScore() > 0 ? `+${calculateScore()}` : calculateScore()}
                </div>
                <div className="text-xs text-muted-foreground">Net Score</div>
              </div>
              <div className="p-3 bg-background/30 rounded-lg">
                <div className="font-bold text-green-400">
                  {currentRound.holes.reduce((sum, hole) => sum + hole.putts, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Total Putts</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Hole Quick Entry */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-primary text-base">Hole {currentHole} Quick Entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Strokes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Strokes</label>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const current = currentRound.holes[currentHole - 1].strokes;
                    if (current > 0) {
                      onUpdateScore(currentHole, { strokes: current - 1 });
                    }
                  }}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="w-12 text-center font-bold text-accent">
                  {currentRound.holes[currentHole - 1].strokes || 0}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const current = currentRound.holes[currentHole - 1].strokes;
                    onUpdateScore(currentHole, { strokes: current + 1 });
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Putts */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">Putts</label>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const current = currentRound.holes[currentHole - 1].putts;
                    if (current > 0) {
                      onUpdateScore(currentHole, { putts: current - 1 });
                    }
                  }}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="w-12 text-center font-bold text-green-400">
                  {currentRound.holes[currentHole - 1].putts || 0}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const current = currentRound.holes[currentHole - 1].putts;
                    onUpdateScore(currentHole, { putts: current + 1 });
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Score Buttons */}
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((score) => {
              const par = currentRound.holes[currentHole - 1].par;
              return (
                <Button
                  key={score}
                  size="sm"
                  variant="outline"
                  className={`text-xs ${getScoreColor(par + score - 3, par)}`}
                  onClick={() => onUpdateScore(currentHole, { strokes: par + score - 3, completed: true })}
                >
                  {getScoreText(par + score - 3, par) || `${par + score - 3}`}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}