export const SCREENS = {
  HOME: 'home',
  ANALYZER: 'analyzer',
  CADDIE: 'caddie',
  COACH: 'coach',
  STATS: 'stats',
  PROFILE: 'profile',
  ADD_FRIEND: 'add-friend',
  FRIENDS_LEADERBOARD: 'friends-leaderboard',
  SOCIAL_HUB: 'social-hub',
  MESSAGES: 'messages',
  VOICE_ASSISTANT: 'voice-assistant',
  RANGE_MODE: 'range-mode',
  WEEKLY_CHALLENGES: 'weekly-challenges',
  HEATMAP_VISUALIZATION: 'heatmap-visualization',
  SMARTWATCH_SETTINGS: 'smartwatch-settings',
  TOURNAMENT_MODE: 'tournament-mode',
  FEEDBACK: 'feedback',
  SETTINGS: 'settings',
  ROUND_HISTORY: 'round-history'
} as const;

export type Screen = typeof SCREENS[keyof typeof SCREENS];

export const getUserProfileScreen = (userId: string) => `user-profile-${userId}`;

export const isUserProfileScreen = (screen: string) => screen.startsWith('user-profile-');

export const extractUserIdFromScreen = (screen: string): string | null => {
  if (isUserProfileScreen(screen)) {
    return screen.replace('user-profile-', '');
  }
  return null;
};

// Screen categories for better organization
export const SCREEN_CATEGORIES = {
  MAIN: [SCREENS.HOME, SCREENS.ANALYZER, SCREENS.CADDIE, SCREENS.COACH],
  SOCIAL: [SCREENS.SOCIAL_HUB, SCREENS.ADD_FRIEND, SCREENS.FRIENDS_LEADERBOARD, SCREENS.MESSAGES],
  PRACTICE: [SCREENS.RANGE_MODE, SCREENS.WEEKLY_CHALLENGES],
  ANALYTICS: [SCREENS.STATS, SCREENS.HEATMAP_VISUALIZATION, SCREENS.ROUND_HISTORY],
  SETTINGS: [SCREENS.PROFILE, SCREENS.SMARTWATCH_SETTINGS, SCREENS.SETTINGS],
  TOURNAMENTS: [SCREENS.TOURNAMENT_MODE],
  FEEDBACK: [SCREENS.FEEDBACK]
} as const;

// Navigation paths that should be accessible
export const NAVIGATION_PATHS = {
  // From Profile
  PROFILE_TO_SETTINGS: [SCREENS.PROFILE, SCREENS.SETTINGS],
  PROFILE_TO_HISTORY: [SCREENS.PROFILE, SCREENS.ROUND_HISTORY],
  PROFILE_TO_STATS: [SCREENS.PROFILE, SCREENS.STATS],
  PROFILE_TO_SMARTWATCH: [SCREENS.PROFILE, SCREENS.SMARTWATCH_SETTINGS],
  
  // From Social Hub
  SOCIAL_TO_FRIENDS: [SCREENS.SOCIAL_HUB, SCREENS.ADD_FRIEND],
  SOCIAL_TO_LEADERBOARD: [SCREENS.SOCIAL_HUB, SCREENS.FRIENDS_LEADERBOARD],
  SOCIAL_TO_MESSAGES: [SCREENS.SOCIAL_HUB, SCREENS.MESSAGES],
  
  // From Stats  
  STATS_TO_HEATMAP: [SCREENS.STATS, SCREENS.HEATMAP_VISUALIZATION],
  
  // Tournament flows
  TOURNAMENT_FLOW: [SCREENS.SOCIAL_HUB, SCREENS.TOURNAMENT_MODE]
} as const;