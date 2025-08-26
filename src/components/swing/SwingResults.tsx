import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { RotateCcw, TrendingUp, Target, Users, Sparkles, Award } from 'lucide-react';
import { getScoreColor, getMetricColor, formatMetricName } from '../../utils/swingAnalysis';

interface SwingResultsProps {
  analysis: any;
  comparisonData: any;
  onNewAnalysis: () => void;
}

export function SwingResults({ analysis, comparisonData, onNewAnalysis }: SwingResultsProps) {
  // Safety check - if analysis is not available, show error state
  if (!analysis) {
    return (
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardContent className="p-8 text-center">
          <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="font-medium text-primary mb-2">Analysis Unavailable</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Something went wrong with the swing analysis. Please try recording again.
          </p>
          <Button 
            className="gradient-bg text-primary-foreground"
            onClick={onNewAnalysis}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Ensure we have default values for all required properties
  const safeAnalysis = {
    club: analysis.club || 'Unknown Club',
    score: analysis.score || 0,
    improvements: analysis.improvements || ['Keep practicing to improve your swing!'],
    metrics: analysis.metrics || { impact: 0, balance: 0, rotation: 0 }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 backdrop-blur-sm">
          <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
          <TabsTrigger value="metrics" className="text-sm">Metrics</TabsTrigger>
          <TabsTrigger value="comparison" className="text-sm">Compare</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Overall Score */}
          <Card className="gradient-card backdrop-blur-sm border-white/10">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="font-medium text-primary mb-2">{safeAnalysis.club} Analysis</h3>
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(safeAnalysis.score)}`}>
                {safeAnalysis.score}/100
              </div>
              <p className="text-sm text-muted-foreground">Overall Swing Score</p>
              
              {/* Score Grade */}
              <div className="mt-4 p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
                <div className="flex items-center justify-center space-x-2">
                  <Award className="w-5 h-5 text-accent" />
                  <span className="font-medium text-accent">
                    {safeAnalysis.score >= 90 ? 'Excellent' :
                     safeAnalysis.score >= 80 ? 'Very Good' :
                     safeAnalysis.score >= 70 ? 'Good' :
                     safeAnalysis.score >= 60 ? 'Average' : 'Needs Work'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Improvements */}
          <Card className="gradient-card backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-primary flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>Key Improvements</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {safeAnalysis.improvements.map((improvement: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
                  <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-accent">{index + 1}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{improvement}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card className="gradient-card backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-primary">Detailed Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(safeAnalysis.metrics).map(([key, value]) => {
                const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{formatMetricName(key)}</span>
                      <span className={`font-bold ${getMetricColor(numValue)}`}>
                        {typeof value === 'string' ? value : `${value}/100`}
                      </span>
                    </div>
                    <Progress value={numValue} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          {comparisonData ? (
            <Card className="gradient-card backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-primary flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Progress Comparison</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
                  <div className={`text-2xl font-bold mb-1 ${
                    comparisonData.scoreChange > 0 ? 'text-green-400' : 
                    comparisonData.scoreChange < 0 ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {comparisonData.scoreChange > 0 ? '+' : ''}{comparisonData.scoreChange}
                  </div>
                  <p className="text-sm text-muted-foreground">Points vs last analysis</p>
                </div>

                {comparisonData.metricsComparison && comparisonData.metricsComparison.map((metric: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10">
                    <span className="font-medium text-foreground">{formatMetricName(metric.name)}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{metric.previous} → {metric.current}</span>
                      <Badge variant={metric.change > 0 ? 'default' : metric.change < 0 ? 'destructive' : 'secondary'} className="text-xs">
                        {metric.change > 0 ? '+' : ''}{metric.change}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card className="gradient-card backdrop-blur-sm border-white/10">
              <CardContent className="p-8 text-center">
                <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-medium text-primary mb-2">No Comparison Data</h3>
                <p className="text-sm text-muted-foreground">
                  Complete more swing analyses to see progress comparisons
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      <Button 
        className="w-full gradient-bg text-primary-foreground"
        onClick={onNewAnalysis}
        size="lg"
      >
        <RotateCcw className="w-5 h-5 mr-2" />
        Analyze Another Swing
      </Button>
    </div>
  );
}