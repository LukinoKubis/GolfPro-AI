export interface SwingMetrics {
  impact: number;
  balance: number;
  rotation: number;
  tempo: number;
  planePath: number;
}

export interface SwingAnalysisResult {
  overallScore: number;
  metrics: SwingMetrics;
  recommendations: string[];
  comparisonData: {
    playerSwing: number[];
    proSwing: number[];
    similarity: number;
  };
}

export function analyzeSwing(
  videoData: any, // In a real app, this would be video analysis data
  club: string
): Promise<SwingAnalysisResult> {
  return new Promise((resolve) => {
    // Simulate analysis time
    setTimeout(() => {
      // Generate realistic mock analysis results
      const baseScore = Math.random() * 30 + 60; // Score between 60-90
      
      const metrics: SwingMetrics = {
        impact: Math.round(baseScore + Math.random() * 10 - 5),
        balance: Math.round(baseScore + Math.random() * 15 - 7),
        rotation: Math.round(baseScore + Math.random() * 12 - 6),
        tempo: Math.round(baseScore + Math.random() * 8 - 4),
        planePath: Math.round(baseScore + Math.random() * 10 - 5)
      };

      const overallScore = Math.round(
        (metrics.impact + metrics.balance + metrics.rotation + metrics.tempo + metrics.planePath) / 5
      );

      const recommendations = generateRecommendations(metrics, club);

      const result: SwingAnalysisResult = {
        overallScore,
        metrics,
        recommendations,
        comparisonData: {
          playerSwing: Array.from({ length: 20 }, () => Math.random() * 100),
          proSwing: Array.from({ length: 20 }, () => Math.random() * 100),
          similarity: Math.round(overallScore * 0.8 + Math.random() * 20)
        }
      };

      resolve(result);
    }, 3000); // 3 second analysis
  });
}

function generateRecommendations(metrics: SwingMetrics, club: string): string[] {
  const recommendations: string[] = [];

  if (metrics.impact < 75) {
    recommendations.push("Focus on striking the ball at impact");
  }
  
  if (metrics.balance < 70) {
    recommendations.push("Work on maintaining better balance throughout the swing");
  }
  
  if (metrics.rotation < 75) {
    recommendations.push("Improve hip and shoulder rotation");
  }
  
  if (metrics.tempo > 85) {
    recommendations.push("Slow down your tempo for better control");
  } else if (metrics.tempo < 65) {
    recommendations.push("Increase your swing tempo slightly");
  }
  
  if (metrics.planePath < 70) {
    recommendations.push("Work on your swing plane path");
  }

  // Club-specific recommendations
  if (club === 'Driver') {
    recommendations.push("Keep your head behind the ball at impact");
  } else if (club.includes('Iron')) {
    recommendations.push("Focus on ball-first contact");
  } else if (club.includes('Wedge')) {
    recommendations.push("Maintain consistent wrist angle");
  }

  // Ensure we always have at least one recommendation
  if (recommendations.length === 0) {
    recommendations.push("Great swing! Keep up the consistency");
  }

  return recommendations.slice(0, 3); // Return max 3 recommendations
}

export function calculateHandicap(scores: number[], coursePars: number[]): number {
  if (scores.length === 0) return 0;
  
  // Simple handicap calculation (differential method simplified)
  const differentials = scores.map((score, index) => {
    const par = coursePars[index] || 72;
    return ((score - par) * 113) / 120; // Simplified slope rating
  });

  // Take best 8 of last 20 rounds (or all if less than 20)
  const bestDifferentials = differentials
    .sort((a, b) => a - b)
    .slice(0, Math.min(8, Math.ceil(differentials.length * 0.4)));

  const averageDifferential = bestDifferentials.reduce((sum, diff) => sum + diff, 0) / bestDifferentials.length;
  
  return Math.max(0, Math.round(averageDifferential * 0.96 * 10) / 10);
}

// Missing utility functions that SwingResults.tsx is trying to import
export function getScoreColor(score: number): string {
  if (score >= 85) return 'text-green-400';
  if (score >= 70) return 'text-yellow-400';
  if (score >= 55) return 'text-orange-400';
  return 'text-red-400';
}

export function getMetricColor(value: number): string {
  if (value >= 85) return 'text-green-400';
  if (value >= 70) return 'text-yellow-400';
  if (value >= 55) return 'text-orange-400';
  return 'text-red-400';
}

export function formatMetricName(metricKey: string): string {
  const metricNames: { [key: string]: string } = {
    impact: 'Impact Position',
    balance: 'Balance',
    rotation: 'Body Rotation',
    tempo: 'Swing Tempo',
    planePath: 'Swing Plane'
  };
  
  return metricNames[metricKey] || metricKey.charAt(0).toUpperCase() + metricKey.slice(1);
}

// Additional utility functions for swing analysis
export function getSwingGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'C+';
  if (score >= 65) return 'C';
  if (score >= 60) return 'D+';
  if (score >= 55) return 'D';
  return 'F';
}

export function getScoreDescription(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 85) return 'Very Good';
  if (score >= 80) return 'Good';
  if (score >= 75) return 'Above Average';
  if (score >= 70) return 'Average';
  if (score >= 65) return 'Below Average';
  if (score >= 60) return 'Needs Work';
  if (score >= 55) return 'Poor';
  return 'Needs Major Improvement';
}

export function getProgressBarColor(value: number): string {
  if (value >= 85) return 'bg-green-400';
  if (value >= 70) return 'bg-yellow-400';
  if (value >= 55) return 'bg-orange-400';
  return 'bg-red-400';
}

export function calculateImprovementSuggestions(
  currentMetrics: SwingMetrics,
  previousMetrics?: SwingMetrics
): string[] {
  const suggestions: string[] = [];
  
  if (previousMetrics) {
    // Compare with previous analysis
    if (currentMetrics.impact < previousMetrics.impact - 5) {
      suggestions.push("Impact position has declined - focus on ball-first contact");
    }
    if (currentMetrics.balance < previousMetrics.balance - 5) {
      suggestions.push("Balance needs attention - practice slow motion swings");
    }
    if (currentMetrics.rotation < previousMetrics.rotation - 5) {
      suggestions.push("Work on hip rotation drills");
    }
  }
  
  // General improvement suggestions based on current metrics
  const weakestMetric = Object.entries(currentMetrics)
    .sort(([,a], [,b]) => a - b)[0];
  
  switch (weakestMetric[0]) {
    case 'impact':
      suggestions.unshift("Focus on impact position - try the 'ball-first' drill");
      break;
    case 'balance':
      suggestions.unshift("Practice balance drills - try the one-foot finish");
      break;
    case 'rotation':
      suggestions.unshift("Work on body rotation - try the cross-arm drill");
      break;
    case 'tempo':
      suggestions.unshift("Practice tempo with a metronome or counting");
      break;
    case 'planePath':
      suggestions.unshift("Work on swing plane - try the wall drill");
      break;
  }
  
  return suggestions.slice(0, 3);
}

export function generateSwingComparison(
  playerMetrics: SwingMetrics,
  proMetrics: SwingMetrics = {
    impact: 92,
    balance: 88,
    rotation: 90,
    tempo: 85,
    planePath: 87
  }
): { [key: string]: { player: number; pro: number; difference: number } } {
  const comparison: { [key: string]: { player: number; pro: number; difference: number } } = {};
  
  Object.keys(playerMetrics).forEach(key => {
    const metricKey = key as keyof SwingMetrics;
    comparison[key] = {
      player: playerMetrics[metricKey],
      pro: proMetrics[metricKey],
      difference: playerMetrics[metricKey] - proMetrics[metricKey]
    };
  });
  
  return comparison;
}