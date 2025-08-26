import { WeatherWidget } from './home/WeatherWidget';
import { QuickStatsGrid } from './home/QuickStatsGrid';
import { QuickActionsGrid } from './home/QuickActionsGrid';
import { WeeklyChallengesWidget } from './home/WeeklyChallengesWidget';
import { CurrentRoundWidget } from './home/CurrentRoundWidget';
import { RecentActivityWidget } from './home/RecentActivityWidget';
import { useAppContext } from '../contexts/AppContext';

interface HomeScreenProps {
  onNavigate: (screen: string, params?: any) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { 
    setCurrentScreen, 
    currentWeather,
    weeklyChallenges,
    currentRound,
    currentHole,
    playerStats,
    roundHistory,
    swingAnalyses
  } = useAppContext();

  const handleNavigate = (screen: string, params?: any) => {
    setCurrentScreen(screen);
  };

  // Get recent activity data
  const recentRound = roundHistory?.[0];
  const recentAnalysis = swingAnalyses?.[0];

  return (
    <div className="p-4 pb-20 space-y-4 scroll-container overflow-y-auto max-h-screen">
      {/* Weather Widget - Simplified */}
      <WeatherWidget weather={currentWeather} />

      {/* Quick Stats Overview */}
      <QuickStatsGrid 
        playerStats={playerStats}
        roundCount={roundHistory?.length || 0}
        onNavigate={handleNavigate} 
      />

      {/* Quick Actions Grid */}
      <QuickActionsGrid onNavigate={handleNavigate} />

      {/* Current Round Status - Only show if there's an active round */}
      {currentRound && (
        <CurrentRoundWidget 
          currentRound={currentRound}
          currentHole={currentHole}
          onNavigate={handleNavigate} 
        />
      )}

      {/* Weekly Challenges */}
      <WeeklyChallengesWidget 
        activeChallenges={weeklyChallenges || []} 
        onNavigate={handleNavigate} 
      />

      {/* Recent Activity - Only show if there's activity */}
      {(recentRound || recentAnalysis) && (
        <RecentActivityWidget 
          recentRound={recentRound}
          recentAnalysis={recentAnalysis}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}