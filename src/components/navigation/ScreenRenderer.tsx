import { HomeScreen } from '../HomeScreen';
import { SwingAnalyzer } from '../SwingAnalyzer';
import { SmartCaddie } from '../SmartCaddie';
import { VirtualCoach } from '../VirtualCoach';
import { StatsAnalyzer } from '../StatsAnalyzer';
import { Profile } from '../Profile';
import { OtherUserProfile } from '../social/OtherUserProfile';
import { AddFriend } from '../social/AddFriend';
import { FriendsLeaderboard } from '../social/FriendsLeaderboard';
import { SocialHub } from '../social/SocialHub';
import { Messages } from '../social/Messages';
import { RangeMode } from '../practice/RangeMode';
import { WeeklyChallenges } from '../challenges/WeeklyChallenges';
import { HeatmapVisualization } from '../stats/HeatmapVisualization';
import { SmartwatchSettings } from '../settings/SmartwatchSettings';
import { TournamentMode } from '../tournament/TournamentMode';
import { FeedbackModal } from '../feedback/FeedbackModal';
import { Settings } from '../settings/Settings';
import { RoundHistory } from '../history/RoundHistory';
import { SCREENS, isUserProfileScreen, extractUserIdFromScreen } from '../../constants/navigation';
import { useAppContext } from '../../contexts/AppContext';
import { useState, useEffect } from 'react';

interface ScreenRendererProps {
  activeScreen: string;
  onNavigate: (screen: string, params?: any) => void;
}

export function ScreenRenderer({ activeScreen, onNavigate }: ScreenRendererProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const { setCurrentScreen, navigateBack } = useAppContext();

  // Handle feedback screen
  useEffect(() => {
    if (activeScreen === SCREENS.FEEDBACK) {
      setShowFeedback(true);
    }
  }, [activeScreen]);

  const handleCloseFeedback = () => {
    setShowFeedback(false);
    navigateBack(); // Return to previous screen
  };

  const handleNavigateToScreen = (screen: string, params?: any) => {
    setCurrentScreen(screen);
  };

  const handleBack = () => {
    navigateBack();
  };

  // Handle user profile screens
  if (isUserProfileScreen(activeScreen)) {
    const userId = extractUserIdFromScreen(activeScreen);
    if (userId) {
      return <OtherUserProfile userId={userId} onBack={handleBack} />;
    }
  }

  // Handle feedback modal
  if (activeScreen === SCREENS.FEEDBACK) {
    return (
      <>
        <HomeScreen onNavigate={handleNavigateToScreen} />
        <FeedbackModal isOpen={showFeedback} onClose={handleCloseFeedback} />
      </>
    );
  }

  // Handle main screens
  switch (activeScreen) {
    case SCREENS.ANALYZER:
      return <SwingAnalyzer onBack={handleBack} />;
    case SCREENS.CADDIE:
      return <SmartCaddie onBack={handleBack} />;
    case SCREENS.COACH:
      return <VirtualCoach onBack={handleBack} />;
    case SCREENS.STATS:
      return <StatsAnalyzer onBack={handleBack} />;
    case SCREENS.PROFILE:
      return <Profile onBack={handleBack} />;
    case SCREENS.ADD_FRIEND:
      return <AddFriend onBack={handleBack} />;
    case SCREENS.FRIENDS_LEADERBOARD:
      return <FriendsLeaderboard onBack={handleBack} />;
    case SCREENS.SOCIAL_HUB:
      return <SocialHub onBack={handleBack} />;
    case SCREENS.MESSAGES:
      return <Messages onBack={handleBack} />;
    case SCREENS.RANGE_MODE:
      return <RangeMode onBack={handleBack} />;
    case SCREENS.WEEKLY_CHALLENGES:
      return <WeeklyChallenges onBack={handleBack} />;
    case SCREENS.HEATMAP_VISUALIZATION:
      return <HeatmapVisualization onBack={handleBack} />;
    case SCREENS.SMARTWATCH_SETTINGS:
      return <SmartwatchSettings onBack={handleBack} />;
    case SCREENS.TOURNAMENT_MODE:
      return <TournamentMode onBack={handleBack} />;
    case SCREENS.SETTINGS:
      return <Settings onBack={handleBack} />;
    case 'round-history':
      return <RoundHistory onBack={handleBack} onNavigate={handleNavigateToScreen} />;
    default:
      return <HomeScreen onNavigate={handleNavigateToScreen} />;
  }
}