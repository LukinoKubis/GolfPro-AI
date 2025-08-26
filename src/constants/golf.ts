export const GOLF_CLUBS = [
  'Driver', '3-Wood', '5-Wood', '3-Iron', '4-Iron', '5-Iron', 
  '6-Iron', '7-Iron', '8-Iron', '9-Iron', 'PW', 'SW', 'LW', 'Putter'
] as const;

export const SWING_METRICS = [
  'backswingTempo',
  'downswingTempo', 
  'impact',
  'followThrough',
  'balance',
  'rotation'
] as const;

export const RECORDING_TIPS = [
  'Position phone at waist height, 6 feet away',
  'Ensure good lighting and clear view of your swing',
  'Take a full swing, not just practice swings',
  'Recording will automatically stop after 5 seconds'
];

export const SCORE_THRESHOLDS = {
  EXCELLENT: 90,
  GOOD: 80,
  AVERAGE: 70,
  NEEDS_WORK: 0
} as const;

export const METRIC_THRESHOLDS = {
  EXCELLENT: 85,
  GOOD: 75,
  AVERAGE: 65,
  NEEDS_WORK: 0
} as const;