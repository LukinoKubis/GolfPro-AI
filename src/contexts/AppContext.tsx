import { createContext, useContext, useState, ReactNode } from 'react';

// Define all interfaces and types
interface User {
  id: string;
  displayName: string;
  username: string;
  avatar: string;
  handicap: number;
  location?: string;
  joinDate: Date;
  isOnline: boolean;
  xpPoints: number;
  stats: {
    averageScore: number;
    bestScore: number;
    roundsPlayed: number;
    drivingDistance: number;
    drivingAccuracy: number;
    swingsAnalyzed?: number;
  };
}

interface PlayerStats {
  handicap: number;
  averageScore: number;
  bestScore: number;
  drivingDistance: number;
  drivingAccuracy: number;
  greenInRegulation: number;
  fairwaysHit: number;
  puttingAverage: number;
  averageDistances: { [club: string]: number };
  accuracy: { [club: string]: number };
}

interface Round {
  id: string;
  date: Date;
  courseName: string;
  totalScore: number;
  holes: number;
  handicap: number;
}

interface SwingAnalysis {
  id: string;
  timestamp: Date;
  club: string;
  score: number;
  improvements: string[];
  metrics: {
    impact: number;
    balance: number;
    rotation: number;
  };
}

interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  xpReward: number;
  completed: boolean;
  type: 'fairways' | 'score' | 'putts' | 'rounds';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  unlockedAt: Date;
}

interface Friend {
  id: string;
  user: User;
  status: 'pending' | 'accepted' | 'blocked';
  addedAt: Date;
}

interface Tournament {
  id: string;
  name: string;
  course: string;
  date: Date;
  isPublic: boolean;
  createdBy: string;
  joinCode?: string;
  players: User[];
  scores: { [playerId: string]: number };
  completed: boolean;
}

interface VoiceSettings {
  feedbackEnabled: boolean;
  volume: number;
  voiceSpeed: number;
}

interface SmartwatchSettings {
  enabled: boolean;
  clubSuggestions: boolean;
  swingDetection: boolean;
}

interface UserSettings {
  theme: 'light' | 'dark';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  locationEnabled: boolean;
  cameraEnabled: boolean;
  micEnabled: boolean;
  autoBackup: boolean;
  offlineMode: boolean;
  batteryOptimization: boolean;
  units: 'metric' | 'imperial';
  language: string;
}

interface HeatmapShot {
  x: number;
  y: number;
  result: 'hit' | 'miss-left' | 'miss-right' | 'short' | 'long';
}

interface HeatmapData {
  club: string;
  shots: HeatmapShot[];
}

interface Weather {
  temperature: number;
  windSpeed: number;
  windDirection: string;
  humidity: number;
}

interface Shot {
  id: string;
  holeNumber: number;
  club: string;
  distance: number;
  accuracy: string;
  x: number;
  y: number;
}

interface Hole {
  holeNumber: number;
  par: number;
  strokes: number;
  putts: number;
  shots: Shot[];
  completed: boolean;
}

interface CurrentRound {
  id: string;
  courseName: string;
  startTime: Date;
  holes: Hole[];
  completed: boolean;
}

interface RangeSession {
  id: string;
  club: string;
  date: Date;
  totalShots: number;
  averageDistance: number;
  bestDistance: number;
  dispersion: number;
  shots: Array<{
    distance: number;
    dispersion: number;
  }>;
}

interface GameInvitation {
  id: string;
  from: User;
  course: string;
  date: Date;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
}

interface AppContextType {
  // Current screen management
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  navigationHistory: string[];
  navigateBack: () => void;
  canGoBack: () => boolean;
  
  // User data
  currentUser: User;
  playerStats: PlayerStats;
  roundHistory: Round[];
  swingAnalyses: SwingAnalysis[];
  achievements: Achievement[];
  
  // User management
  allUsers: User[];
  getUserById: (userId: string) => User | undefined;
  searchUsers: (query: string) => User[];
  
  // Social features
  friends: Friend[];
  addFriend: (username: string) => Promise<boolean>;
  removeFriend: (userId: string) => void;
  sendGameInvitation: (userIds: string[], course: string, date: Date, message: string) => void;
  gameInvitations: GameInvitation[];
  
  // Tournament features
  tournaments: Tournament[];
  createTournament: (tournament: Partial<Tournament>) => void;
  joinTournament: (tournamentId: string) => void;
  
  // Game state
  currentRound?: CurrentRound;
  currentHole: number;
  currentWeather: Weather;
  startNewRound: (courseName: string) => void;
  completeRound: () => void;
  updateHoleScore: (holeNumber: number, updates: Partial<Hole>) => void;
  addShot: (shot: Omit<Shot, 'id'>) => void;
  getHoleShots: (holeNumber: number) => Shot[];
  
  // Range sessions
  rangeSessions: RangeSession[];
  startRangeSession: (club: string) => string;
  addRangeShot: (sessionId: string, distance: number, dispersion: number) => void;
  endRangeSession: (sessionId: string) => void;
  updatePlayerStats: (updates: Partial<PlayerStats>) => void;
  
  // Challenges and achievements
  weeklyChallenges: WeeklyChallenge[];
  completeChallenge: (challengeId: string) => void;
  
  // Settings
  voiceSettings: VoiceSettings;
  updateVoiceSettings: (settings: Partial<VoiceSettings>) => void;
  smartwatchSettings: SmartwatchSettings;
  updateSmartwatchSettings: (settings: Partial<SmartwatchSettings>) => void;
  userSettings: UserSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  
  // Heatmap data
  heatmapData: HeatmapData[];
  addHeatmapData: (club: string, shot: HeatmapShot) => void;
  
  // Actions
  addSwingAnalysis: (analysis: Partial<SwingAnalysis>) => void;
  addRound: (round: Partial<Round>) => void;
  submitFeedback: (rating: number, comment: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Screen management with navigation history
  const [currentScreen, setCurrentScreenState] = useState('home');
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['home']);

  const setCurrentScreen = (screen: string) => {
    setNavigationHistory(prev => [...prev, screen]);
    setCurrentScreenState(screen);
  };

  const navigateBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Remove current screen
      const previousScreen = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentScreenState(previousScreen);
    }
  };

  const canGoBack = () => {
    return navigationHistory.length > 1;
  };

  // Create comprehensive mock users database
  const mockUsers: User[] = [
    {
      id: 'user1',
      displayName: 'Alex Johnson',
      username: 'alexgolf',
      avatar: '/avatars/alex.jpg',
      handicap: 12.5,
      location: 'California, USA',
      joinDate: new Date('2023-01-15'),
      isOnline: true,
      xpPoints: 2450,
      stats: {
        averageScore: 84.2,
        bestScore: 78,
        roundsPlayed: 47,
        drivingDistance: 245,
        drivingAccuracy: 68,
        swingsAnalyzed: 125
      }
    },
    {
      id: 'friend1',
      displayName: 'Sarah Wilson',
      username: 'sarahgolf',
      avatar: '/avatars/sarah.jpg',
      handicap: 8.2,
      location: 'New York, USA',
      joinDate: new Date('2023-02-10'),
      isOnline: false,
      xpPoints: 3200,
      stats: {
        averageScore: 79.5,
        bestScore: 72,
        roundsPlayed: 52,
        drivingDistance: 220,
        drivingAccuracy: 75,
        swingsAnalyzed: 98
      }
    },
    {
      id: 'friend2',
      displayName: 'Mike Chen',
      username: 'mikeputts',
      avatar: '/avatars/mike.jpg',
      handicap: 15.1,
      location: 'Texas, USA',
      joinDate: new Date('2023-03-05'),
      isOnline: true,
      xpPoints: 1850,
      stats: {
        averageScore: 88.7,
        bestScore: 81,
        roundsPlayed: 33,
        drivingDistance: 265,
        drivingAccuracy: 62,
        swingsAnalyzed: 67
      }
    },
    {
      id: 'user4',
      displayName: 'Emma Rodriguez',
      username: 'emmagolf',
      avatar: '/avatars/emma.jpg',
      handicap: 6.8,
      location: 'Florida, USA',
      joinDate: new Date('2022-11-20'),
      isOnline: true,
      xpPoints: 4100,
      stats: {
        averageScore: 76.3,
        bestScore: 69,
        roundsPlayed: 78,
        drivingDistance: 195,
        drivingAccuracy: 82,
        swingsAnalyzed: 156
      }
    },
    {
      id: 'user5',
      displayName: 'David Thompson',
      username: 'davidt_golf',
      avatar: '/avatars/david.jpg',
      handicap: 18.2,
      location: 'Colorado, USA',
      joinDate: new Date('2023-04-12'),
      isOnline: false,
      xpPoints: 1200,
      stats: {
        averageScore: 92.1,
        bestScore: 85,
        roundsPlayed: 25,
        drivingDistance: 240,
        drivingAccuracy: 58,
        swingsAnalyzed: 45
      }
    },
    {
      id: 'user6',
      displayName: 'Lisa Chang',
      username: 'lisachang_pro',
      avatar: '/avatars/lisa.jpg',
      handicap: 3.4,
      location: 'California, USA',
      joinDate: new Date('2022-08-03'),
      isOnline: true,
      xpPoints: 5800,
      stats: {
        averageScore: 72.8,
        bestScore: 67,
        roundsPlayed: 95,
        drivingDistance: 210,
        drivingAccuracy: 88,
        swingsAnalyzed: 200
      }
    }
  ];

  const mockUser = mockUsers[0];

  const mockPlayerStats: PlayerStats = {
    handicap: 12.5,
    averageScore: 84.2,
    bestScore: 78,
    drivingDistance: 245,
    drivingAccuracy: 68,
    greenInRegulation: 58,
    fairwaysHit: 64,
    puttingAverage: 1.8,
    averageDistances: {
      'Driver': 245,
      '3-Wood': 215,
      '5-Wood': 195,
      '3-Iron': 175,
      '4-Iron': 165,
      '5-Iron': 160,
      '6-Iron': 150,
      '7-Iron': 145,
      '8-Iron': 135,
      '9-Iron': 125,
      'PW': 105,
      'SW': 85,
      'LW': 65,
      'Putter': 0
    },
    accuracy: {
      'Driver': 68,
      '3-Wood': 72,
      '5-Wood': 75,
      '3-Iron': 70,
      '4-Iron': 72,
      '5-Iron': 75,
      '6-Iron': 78,
      '7-Iron': 82,
      '8-Iron': 85,
      '9-Iron': 85,
      'PW': 88,
      'SW': 90,
      'LW': 85,
      'Putter': 95
    }
  };

  // Initialize all arrays and state
  const [roundHistory] = useState<Round[]>([
    {
      id: '1',
      date: new Date('2024-03-15'),
      courseName: 'Pebble Beach Golf Links',
      totalScore: 78,
      holes: 18,
      handicap: 12.2
    },
    {
      id: '2',
      date: new Date('2024-03-10'),
      courseName: 'Augusta National',
      totalScore: 82,
      holes: 18,
      handicap: 12.8
    },
    {
      id: '3',
      date: new Date('2024-03-05'),
      courseName: 'St. Andrews Old Course',
      totalScore: 85,
      holes: 18,
      handicap: 13.1
    }
  ]);

  const [swingAnalyses, setSwingAnalyses] = useState<SwingAnalysis[]>([
    {
      id: '1',
      timestamp: new Date(),
      club: '7-Iron',
      score: 85,
      improvements: ['Work on hip rotation', 'Maintain better balance'],
      metrics: { impact: 88, balance: 82, rotation: 85 }
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 86400000),
      club: 'Driver',
      score: 72,
      improvements: ['Focus on tempo', 'Keep head steady'],
      metrics: { impact: 75, balance: 70, rotation: 72 }
    }
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'First Birdie',
      description: 'Score your first birdie!',
      xpReward: 100,
      unlockedAt: new Date('2024-03-01')
    },
    {
      id: '2',
      title: 'Swing Analyzer Pro',
      description: 'Complete 10 swing analyses',
      xpReward: 250,
      unlockedAt: new Date('2024-03-10')
    }
  ]);

  const [friends, setFriends] = useState<Friend[]>([
    {
      id: '1',
      user: mockUsers[1],
      status: 'accepted',
      addedAt: new Date('2024-02-15')
    },
    {
      id: '2',
      user: mockUsers[2],
      status: 'accepted',
      addedAt: new Date('2024-02-20')
    },
    {
      id: '3',
      user: mockUsers[3],
      status: 'accepted',
      addedAt: new Date('2024-03-01')
    }
  ]);

  const [tournaments] = useState<Tournament[]>([
    {
      id: '1',
      name: 'Spring Championship',
      course: 'Pebble Beach',
      date: new Date('2024-04-15'),
      isPublic: true,
      createdBy: 'user1',
      players: [mockUser],
      scores: {},
      completed: false
    }
  ]);

  const [weeklyChallenges, setWeeklyChallenges] = useState<WeeklyChallenge[]>([
    {
      id: '1',
      title: 'Hit 5/7 fairways this week',
      description: 'Improve your driving accuracy',
      target: 7,
      current: 4,
      xpReward: 150,
      completed: false,
      type: 'fairways'
    },
    {
      id: '2',
      title: 'Play 3 rounds this week',
      description: 'Stay active on the course',
      target: 3,
      current: 1,
      xpReward: 200,
      completed: false,
      type: 'rounds'
    }
  ]);

  // Game state
  const [currentRound, setCurrentRound] = useState<CurrentRound | undefined>(undefined);
  const [currentHole, setCurrentHole] = useState(1);

  // Range sessions
  const [rangeSessions, setRangeSessions] = useState<RangeSession[]>([]);
  const [playerStats, setPlayerStats] = useState(mockPlayerStats);

  // Game invitations
  const [gameInvitations, setGameInvitations] = useState<GameInvitation[]>([]);

  // Settings with proper initialization
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    feedbackEnabled: true,
    volume: 75,
    voiceSpeed: 1.0
  });

  const [smartwatchSettings, setSmartwatchSettings] = useState<SmartwatchSettings>({
    enabled: false,
    clubSuggestions: false,
    swingDetection: false
  });

  const [userSettings, setUserSettings] = useState<UserSettings>({
    theme: 'dark',
    soundEnabled: true,
    notificationsEnabled: true,
    locationEnabled: true,
    cameraEnabled: true,
    micEnabled: true,
    autoBackup: true,
    offlineMode: false,
    batteryOptimization: true,
    units: 'imperial',
    language: 'english'
  });

  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);

  const currentWeather: Weather = {
    temperature: 72,
    windSpeed: 8,
    windDirection: 'SW',
    humidity: 65
  };

  // User management functions
  const getUserById = (userId: string): User | undefined => {
    return mockUsers.find(user => user.id === userId);
  };

  const searchUsers = (query: string): User[] => {
    const lowerQuery = query.toLowerCase();
    return mockUsers.filter(user => 
      user.displayName.toLowerCase().includes(lowerQuery) ||
      user.username.toLowerCase().includes(lowerQuery)
    );
  };

  // Social functions
  const addFriend = async (username: string): Promise<boolean> => {
    const user = mockUsers.find(u => u.username === username);
    if (user && !friends.find(f => f.user.id === user.id)) {
      const newFriend: Friend = {
        id: Date.now().toString(),
        user,
        status: 'pending',
        addedAt: new Date()
      };
      setFriends(prev => [...prev, newFriend]);
      return true;
    }
    return false;
  };

  const removeFriend = (userId: string) => {
    setFriends(prev => prev.filter(f => f.user.id !== userId));
  };

  const sendGameInvitation = (userIds: string[], course: string, date: Date, message: string) => {
    userIds.forEach(userId => {
      const user = getUserById(userId);
      if (user) {
        const invitation: GameInvitation = {
          id: Date.now().toString() + userId,
          from: mockUser,
          course,
          date,
          message,
          status: 'pending'
        };
        setGameInvitations(prev => [...prev, invitation]);
      }
    });
  };

  // Round management functions
  const startNewRound = (courseName: string) => {
    const newRound: CurrentRound = {
      id: Date.now().toString(),
      courseName,
      startTime: new Date(),
      completed: false,
      holes: Array.from({ length: 18 }, (_, i) => ({
        holeNumber: i + 1,
        par: [4, 3, 5, 4, 4, 3, 4, 5, 4, 4, 3, 5, 4, 4, 3, 4, 5, 4][i],
        strokes: 0,
        putts: 0,
        shots: [],
        completed: false
      }))
    };
    setCurrentRound(newRound);
    setCurrentHole(1);
  };

  const completeRound = () => {
    if (currentRound) {
      const totalScore = currentRound.holes.reduce((sum, hole) => sum + hole.strokes, 0);
      const newRoundRecord: Round = {
        id: currentRound.id,
        date: new Date(),
        courseName: currentRound.courseName,
        totalScore,
        holes: 18,
        handicap: playerStats.handicap
      };
      // In a real app, this would be added to round history
      setCurrentRound(undefined);
      setCurrentHole(1);
    }
  };

  const updateHoleScore = (holeNumber: number, updates: Partial<Hole>) => {
    if (currentRound) {
      setCurrentRound(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          holes: prev.holes.map(hole => 
            hole.holeNumber === holeNumber 
              ? { ...hole, ...updates }
              : hole
          )
        };
      });
    }
  };

  const addShot = (shot: Omit<Shot, 'id'>) => {
    const newShot: Shot = {
      ...shot,
      id: Date.now().toString()
    };
    
    if (currentRound) {
      setCurrentRound(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          holes: prev.holes.map(hole => 
            hole.holeNumber === shot.holeNumber 
              ? { ...hole, shots: [...hole.shots, newShot] }
              : hole
          )
        };
      });
    }
  };

  const getHoleShots = (holeNumber: number): Shot[] => {
    if (!currentRound) return [];
    const hole = currentRound.holes.find(h => h.holeNumber === holeNumber);
    return hole?.shots || [];
  };

  // Range session functions
  const startRangeSession = (club: string): string => {
    const sessionId = Date.now().toString();
    const newSession: RangeSession = {
      id: sessionId,
      club,
      date: new Date(),
      totalShots: 0,
      averageDistance: 0,
      bestDistance: 0,
      dispersion: 0,
      shots: []
    };
    setRangeSessions(prev => [newSession, ...prev]);
    return sessionId;
  };

  const addRangeShot = (sessionId: string, distance: number, dispersion: number) => {
    setRangeSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        const newShots = [...session.shots, { distance, dispersion }];
        const avgDistance = Math.round(newShots.reduce((sum, shot) => sum + shot.distance, 0) / newShots.length);
        const bestDistance = Math.max(...newShots.map(shot => shot.distance));
        const avgDispersion = Math.round(newShots.reduce((sum, shot) => sum + shot.dispersion, 0) / newShots.length);
        
        return {
          ...session,
          shots: newShots,
          totalShots: newShots.length,
          averageDistance: avgDistance,
          bestDistance,
          dispersion: avgDispersion
        };
      }
      return session;
    }));
  };

  const endRangeSession = (sessionId: string) => {
    // Mark session as completed - in a real app this might save to backend
  };

  const updatePlayerStats = (updates: Partial<PlayerStats>) => {
    setPlayerStats(prev => ({ ...prev, ...updates }));
  };

  // Other functions
  const addSwingAnalysis = (analysis: Partial<SwingAnalysis>) => {
    const newAnalysis: SwingAnalysis = {
      id: Date.now().toString(),
      timestamp: new Date(),
      club: analysis.club || 'Unknown',
      score: analysis.score || 0,
      improvements: analysis.improvements || [],
      metrics: analysis.metrics || { impact: 0, balance: 0, rotation: 0 }
    };
    setSwingAnalyses(prev => [newAnalysis, ...prev]);
  };

  const addRound = (round: Partial<Round>) => {
    const newRound: Round = {
      id: Date.now().toString(),
      date: new Date(),
      courseName: round.courseName || 'Unknown Course',
      totalScore: round.totalScore || 0,
      holes: round.holes || 18,
      handicap: round.handicap || playerStats.handicap
    };
    console.log('Adding round:', newRound);
  };

  const createTournament = (tournament: Partial<Tournament>) => {
    const newTournament: Tournament = {
      id: Date.now().toString(),
      name: tournament.name || 'Unnamed Tournament',
      course: tournament.course || 'Unknown Course',
      date: tournament.date || new Date(),
      isPublic: tournament.isPublic || false,
      createdBy: tournament.createdBy || mockUser.id,
      joinCode: tournament.joinCode,
      players: [mockUser],
      scores: {},
      completed: false
    };
    console.log('Creating tournament:', newTournament);
  };

  const joinTournament = (tournamentId: string) => {
    console.log('Joining tournament:', tournamentId);
  };

  const completeChallenge = (challengeId: string) => {
    setWeeklyChallenges(prev => 
      prev.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, completed: true, current: challenge.target }
          : challenge
      )
    );
  };

  const updateVoiceSettings = (settings: Partial<VoiceSettings>) => {
    setVoiceSettings(prev => ({ ...prev, ...settings }));
  };

  const updateSmartwatchSettings = (settings: Partial<SmartwatchSettings>) => {
    setSmartwatchSettings(prev => ({ ...prev, ...settings }));
  };

  const updateUserSettings = (settings: Partial<UserSettings>) => {
    setUserSettings(prev => ({ ...prev, ...settings }));
  };

  const addHeatmapData = (club: string, shot: HeatmapShot) => {
    setHeatmapData(prev => {
      const existingClubData = prev.find(data => data.club === club);
      if (existingClubData) {
        return prev.map(data => 
          data.club === club 
            ? { ...data, shots: [...data.shots, shot] }
            : data
        );
      } else {
        return [...prev, { club, shots: [shot] }];
      }
    });
  };

  const submitFeedback = (rating: number, comment: string) => {
    console.log('Feedback submitted:', { rating, comment });
  };

  const value: AppContextType = {
    // Screen management
    currentScreen,
    setCurrentScreen,
    navigationHistory,
    navigateBack,
    canGoBack,
    
    // User data
    currentUser: mockUser,
    playerStats,
    roundHistory: roundHistory || [],
    swingAnalyses: swingAnalyses || [],
    achievements: achievements || [],
    
    // User management
    allUsers: mockUsers,
    getUserById,
    searchUsers,
    
    // Social features
    friends: friends || [],
    addFriend,
    removeFriend,
    sendGameInvitation,
    gameInvitations: gameInvitations || [],
    
    // Tournament features
    tournaments: tournaments || [],
    createTournament,
    joinTournament,
    
    // Game state
    currentRound,
    currentHole,
    currentWeather,
    startNewRound,
    completeRound,
    updateHoleScore,
    addShot,
    getHoleShots,
    
    // Range sessions
    rangeSessions: rangeSessions || [],
    startRangeSession,
    addRangeShot,
    endRangeSession,
    updatePlayerStats,
    
    // Challenges and achievements
    weeklyChallenges: weeklyChallenges || [],
    completeChallenge,
    
    // Settings
    voiceSettings,
    updateVoiceSettings,
    smartwatchSettings,
    updateSmartwatchSettings,
    userSettings,
    updateUserSettings,
    
    // Heatmap data
    heatmapData: heatmapData || [],
    addHeatmapData,
    
    // Actions
    addSwingAnalysis,
    addRound,
    submitFeedback
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}