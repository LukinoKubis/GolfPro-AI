export const LISTENING_DURATION = 3000; // 3 seconds
export const PROCESSING_DURATION = 2000; // 2 seconds

export const VOICE_COMMANDS = {
  DISTANCE: ['distance', 'how far', 'yardage', 'range'],
  CLUB: ['club', 'switch', 'change club', 'recommend'],
  WEATHER: ['weather', 'wind', 'conditions', 'temperature'],
  RECORD: ['record', 'start recording', 'analyze swing'],
  STATS: ['stats', 'statistics', 'performance', 'handicap'],
  SCORE: ['score', 'scorecard', 'current score'],
  HELP: ['help', 'commands', 'what can you do']
} as const;

interface Weather {
  temperature: number;
  windSpeed: number;
  windDirection: string;
  humidity: number;
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

export const VOICE_RESPONSES = {
  'distance': (weather: Weather, stats: PlayerStats) => 
    `Based on current conditions, the pin is approximately 165 yards away. With ${weather.windSpeed} mph ${weather.windDirection} wind, I recommend your 7-iron.`,
  
  'how far': (weather: Weather, stats: PlayerStats) => 
    `The distance to the pin is 165 yards. Considering the ${weather.windDirection} wind at ${weather.windSpeed} mph, you might want to club up.`,
  
  'club': (weather: Weather, stats: PlayerStats) => 
    `For this shot, I recommend your 7-iron. Your average distance is ${stats.averageDistances['7-Iron'] || 145} yards, which should be perfect with current conditions.`,
  
  'weather': (weather: Weather, stats: PlayerStats) => 
    `Current conditions: ${weather.temperature}°F with ${weather.windSpeed} mph winds from the ${weather.windDirection}. Humidity is ${weather.humidity}%.`,
  
  'record': (weather: Weather, stats: PlayerStats) => 
    `Starting swing recording now. Make sure you're in position and ready to swing.`,
  
  'stats': (weather: Weather, stats: PlayerStats) => 
    `Your current handicap is ${stats.handicap}. Average score: ${stats.averageScore}. Best round: ${stats.bestScore}.`,
  
  'score': (weather: Weather, stats: PlayerStats) => 
    `You're currently 2 over par through 8 holes. Keep up the good work!`,
  
  'help': (weather: Weather, stats: PlayerStats) => 
    `I can help with distances, club recommendations, weather updates, swing recording, and statistics. Just ask me naturally!`
};

export const VOICE_SUGGESTIONS = [
  "How far to the pin?",
  "What club should I use?",
  "Check weather conditions",
  "Record my swing",
  "Show my stats",
  "What's my current score?",
  "Start a new round",
  "Switch to 8-iron",
  "Save this shot",
  "End round"
];

export const QUICK_COMMANDS = [
  {
    id: 'distance',
    label: 'Distance',
    command: 'How far to pin?',
    icon: 'Target'
  },
  {
    id: 'club',
    label: 'Club',
    command: 'Recommend a club',
    icon: 'Zap'
  },
  {
    id: 'weather',
    label: 'Weather',
    command: 'Check conditions',
    icon: 'Cloud'
  },
  {
    id: 'record',
    label: 'Record',
    command: 'Record swing',
    icon: 'Video'
  }
];

export const VOICE_FEEDBACK_SETTINGS = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
  QUIET_MODE: 'quiet'
} as const;

export type VoiceFeedbackMode = typeof VOICE_FEEDBACK_SETTINGS[keyof typeof VOICE_FEEDBACK_SETTINGS];