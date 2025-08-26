import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ChevronLeft, Play, Pause, CheckCircle, Lock, Star, 
  BookOpen, Target, Trophy, Clock, Award, Zap,
  Video, User, TrendingUp, BarChart3, ArrowRight,
  PlayCircle, PauseCircle, RotateCcw, Volume2
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { toast } from 'sonner';
import { RangeMode } from './practice/RangeMode';

interface VirtualCoachProps {
  onBack: () => void;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: 'Driving' | 'Iron Play' | 'Short Game' | 'Putting' | 'Mental Game';
  videoUrl?: string;
  completed: boolean;
  locked: boolean;
  xpReward: number;
}

interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  progress: number;
  estimatedWeeks: number;
  category: string;
}

export function VirtualCoach({ onBack }: VirtualCoachProps) {
  const [activeTab, setActiveTab] = useState<'programs' | 'lessons' | 'progress'>('programs');
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [showPracticeMode, setShowPracticeMode] = useState(false);

  const { 
    currentUser, 
    playerStats, 
    achievements
  } = useAppContext();

  // Mock training programs
  const trainingPrograms: TrainingProgram[] = [
    {
      id: '1',
      title: 'Complete Beginner Golf Course',
      description: 'Master the fundamentals of golf from grip to swing',
      progress: 65,
      estimatedWeeks: 8,
      category: 'Full Course',
      lessons: [
        {
          id: '1-1',
          title: 'Golf Basics: Grip and Stance',
          description: 'Learn the proper grip and stance fundamentals',
          duration: 15,
          difficulty: 'Beginner',
          category: 'Driving',
          completed: true,
          locked: false,
          xpReward: 50
        },
        {
          id: '1-2', 
          title: 'The Golf Swing: Backswing',
          description: 'Understanding the backswing mechanics',
          duration: 20,
          difficulty: 'Beginner',
          category: 'Driving',
          completed: true,
          locked: false,
          xpReward: 75
        },
        {
          id: '1-3',
          title: 'Downswing and Follow Through',
          description: 'Master the downswing and follow through',
          duration: 18,
          difficulty: 'Beginner',
          category: 'Driving',
          completed: false,
          locked: false,
          xpReward: 75
        },
        {
          id: '1-4',
          title: 'Iron Play Fundamentals',
          description: 'Learn to hit crisp iron shots',
          duration: 25,
          difficulty: 'Intermediate',
          category: 'Iron Play',
          completed: false,
          locked: true,
          xpReward: 100
        }
      ]
    },
    {
      id: '2',
      title: 'Short Game Mastery',
      description: 'Develop your chipping, pitching, and putting skills',
      progress: 25,
      estimatedWeeks: 6,
      category: 'Short Game',
      lessons: [
        {
          id: '2-1',
          title: 'Chipping Fundamentals',
          description: 'Master basic chipping technique',
          duration: 12,
          difficulty: 'Beginner',
          category: 'Short Game',
          completed: true,
          locked: false,
          xpReward: 60
        },
        {
          id: '2-2',
          title: 'Pitching with Control',
          description: 'Learn distance control in pitching',
          duration: 16,
          difficulty: 'Intermediate',
          category: 'Short Game',
          completed: false,
          locked: false,
          xpReward: 80
        }
      ]
    },
    {
      id: '3',
      title: 'Advanced Scoring Strategies',
      description: 'Lower your scores with strategic course management',
      progress: 0,
      estimatedWeeks: 4,
      category: 'Mental Game',
      lessons: [
        {
          id: '3-1',
          title: 'Course Management Basics',
          description: 'Strategic thinking on the golf course',
          duration: 20,
          difficulty: 'Advanced',
          category: 'Mental Game',
          completed: false,
          locked: false,
          xpReward: 120
        }
      ]
    }
  ];

  const handleProgramSelect = (program: TrainingProgram) => {
    setSelectedProgram(program);
    toast.success(`Selected "${program.title}" program`);
  };

  const handleLessonSelect = (lesson: Lesson) => {
    if (lesson.locked) {
      toast.error('Complete previous lessons to unlock this one');
      return;
    }
    setSelectedLesson(lesson);
    setVideoProgress(0);
    toast.success(`Starting lesson: "${lesson.title}"`);
  };

  const handleVideoPlayPause = () => {
    setIsVideoPlaying(!isVideoPlaying);
    if (!isVideoPlaying) {
      // Simulate video progress
      const interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsVideoPlaying(false);
            return 100;
          }
          return prev + 2;
        });
      }, 200);
    }
  };

  const handleLessonComplete = (lesson: Lesson) => {
    toast.success(`Lesson completed! +${lesson.xpReward} XP earned`);
    setSelectedLesson(null);
    // In a real app, this would update the lesson completion status
  };

  const handleRestartVideo = () => {
    setVideoProgress(0);
    setIsVideoPlaying(false);
  };

  const handlePracticeModeOpen = () => {
    setShowPracticeMode(true);
    toast.success('Opening Practice Range mode');
  };

  const handlePracticeModeBack = () => {
    setShowPracticeMode(false);
  };

  // If practice mode is active, show RangeMode component
  if (showPracticeMode) {
    return <RangeMode onBack={handlePracticeModeBack} />;
  }

  if (selectedLesson) {
    return (
      <div className="p-4 pb-20 space-y-6 scroll-container overflow-y-auto max-h-screen">
        {/* Lesson Header */}
        <div className="flex items-center space-x-3">
          <Button variant={"ghost" as any} size={"sm" as any} onClick={() => setSelectedLesson(null)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-medium">{selectedLesson.title}</h1>
            <p className="text-sm text-muted-foreground">{selectedLesson.description}</p>
          </div>
          <Badge className={`${
            selectedLesson.difficulty === 'Beginner' ? 'bg-green-400/20 text-green-400 border-green-400/30' :
            selectedLesson.difficulty === 'Intermediate' ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30' :
            'bg-red-400/20 text-red-400 border-red-400/30'
          }`}>
            {selectedLesson.difficulty}
          </Badge>
        </div>

        {/* Video Player */}
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg flex items-center justify-center">
              {/* Mock video area */}
              <div className="text-center">
                <div className="w-20 h-20 bg-background/50 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                  {isVideoPlaying ? (
                    <PauseCircle className="w-12 h-12 text-primary" />
                  ) : (
                    <PlayCircle className="w-12 h-12 text-primary" />
                  )}
                </div>
                <p className="text-primary font-medium">
                  {isVideoPlaying ? 'Playing...' : 'Tap to Play Lesson Video'}
                </p>
              </div>
              
              {/* Video overlay */}
              <div className="absolute inset-0 bg-black/20 rounded-t-lg cursor-pointer" onClick={handleVideoPlayPause} />
            </div>
            
            {/* Video Controls */}
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-accent">{Math.round(videoProgress)}%</span>
                </div>
                <Progress value={videoProgress} className="h-2" />
              </div>
              
              <div className="flex items-center justify-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRestartVideo}
                  className="border-muted-foreground/30"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restart
                </Button>
                
                <Button
                  className="gradient-bg text-primary-foreground"
                  onClick={handleVideoPlayPause}
                >
                  {isVideoPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="border-accent/30 text-accent"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Audio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lesson Details */}
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-primary flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Lesson Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-background/30 backdrop-blur-sm rounded-lg">
                <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-sm font-medium">{selectedLesson.duration} min</div>
                <div className="text-xs text-muted-foreground">Duration</div>
              </div>
              <div className="p-3 bg-background/30 backdrop-blur-sm rounded-lg">
                <Target className="w-5 h-5 mx-auto mb-1 text-accent" />
                <div className="text-sm font-medium">{selectedLesson.category}</div>
                <div className="text-xs text-muted-foreground">Category</div>
              </div>
              <div className="p-3 bg-background/30 backdrop-blur-sm rounded-lg">
                <Award className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
                <div className="text-sm font-medium">+{selectedLesson.xpReward}</div>
                <div className="text-xs text-muted-foreground">XP Reward</div>
              </div>
            </div>

            {videoProgress >= 90 && (
              <Button
                className="w-full gradient-bg text-primary-foreground"
                onClick={() => handleLessonComplete(selectedLesson)}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Complete
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Key Points */}
        <Card className="gradient-card backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-primary">Key Learning Points</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                <span>Proper grip is fundamental to all golf shots</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                <span>Stance should be shoulder-width apart for stability</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                <span>Keep your head steady throughout the swing</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                <span>Practice consistently for muscle memory development</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 space-y-6 scroll-container overflow-y-auto max-h-screen">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-medium">Virtual Golf Coach</h1>
          <p className="text-sm text-muted-foreground">Personalized training programs and lessons</p>
        </div>
      </div>

      {/* User Progress Overview */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Welcome back, {currentUser.displayName}!</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Current handicap: {playerStats.handicap} • Level: {Math.floor(achievements.reduce((sum, a) => sum + a.xpReward, 0) / 1000) + 1}
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400">{achievements.length} achievements</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4 text-accent" />
                  <span className="text-accent">2 programs active</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="space-y-0">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 backdrop-blur-sm rounded-none rounded-t-lg">
              <TabsTrigger 
                value="programs"
                className={activeTab === 'programs' ? 'gradient-bg text-primary-foreground' : ''}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Programs
              </TabsTrigger>
              <TabsTrigger 
                value="lessons"
                className={activeTab === 'lessons' ? 'gradient-bg text-primary-foreground' : ''}
              >
                <Video className="w-4 h-4 mr-2" />
                Lessons
              </TabsTrigger>
              <TabsTrigger 
                value="progress"
                className={activeTab === 'progress' ? 'gradient-bg text-primary-foreground' : ''}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Progress
              </TabsTrigger>
            </TabsList>

            {/* Training Programs Tab */}
            <TabsContent value="programs" className="p-6 space-y-4">
              {trainingPrograms.map((program) => (
                <div key={program.id} className="p-4 bg-background/30 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">{program.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{program.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{program.estimatedWeeks} weeks</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{program.lessons.length} lessons</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {program.category}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="gradient-bg text-primary-foreground"
                      onClick={() => handleProgramSelect(program)}
                    >
                      {program.progress > 0 ? 'Continue' : 'Start'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="text-accent">{program.progress}%</span>
                    </div>
                    <Progress value={program.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* Individual Lessons Tab */}
            <TabsContent value="lessons" className="p-6 space-y-4">
              {selectedProgram ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-primary">{selectedProgram.title}</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedProgram(null)}
                    >
                      View All Programs
                    </Button>
                  </div>
                  
                  {selectedProgram.lessons.map((lesson, index) => (
                    <div key={lesson.id} className={`p-4 rounded-lg border transition-colors ${
                      lesson.locked 
                        ? 'bg-background/20 border-white/10 opacity-60' 
                        : 'bg-background/30 border-white/10 hover:border-white/20 cursor-pointer'
                    }`}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          lesson.completed ? 'bg-green-400 text-white' :
                          lesson.locked ? 'bg-muted text-muted-foreground' :
                          'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                        }`}>
                          {lesson.completed ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : lesson.locked ? (
                            <Lock className="w-5 h-5" />
                          ) : (
                            <span className="font-bold">{index + 1}</span>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{lesson.title}</h4>
                          <p className="text-sm text-muted-foreground mb-1">{lesson.description}</p>
                          <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{lesson.duration} min</span>
                            </div>
                            <Badge className={`text-xs ${
                              lesson.difficulty === 'Beginner' ? 'bg-green-400/20 text-green-400 border-green-400/30' :
                              lesson.difficulty === 'Intermediate' ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30' :
                              'bg-red-400/20 text-red-400 border-red-400/30'
                            }`}>
                              {lesson.difficulty}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-400" />
                              <span className="text-yellow-400">+{lesson.xpReward} XP</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          variant={lesson.completed ? "outline" : "default" as any}
                          className={lesson.completed ? "border-green-400/30 text-green-400" : "gradient-bg text-primary-foreground"}
                          onClick={() => handleLessonSelect(lesson)}
                          disabled={lesson.locked}
                        >
                          {lesson.completed ? 'Review' : 'Start'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground mb-4">Select a training program to view lessons</p>
                  <Button 
                    className="gradient-bg text-primary-foreground"
                    onClick={() => setActiveTab('programs')}
                  >
                    Browse Programs
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress" className="p-6 space-y-6">
              {/* Overall Progress */}
              <div className="space-y-4">
                <h3 className="font-medium text-primary">Learning Progress</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-background/30 backdrop-blur-sm rounded-lg text-center">
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-400" />
                    <div className="text-lg font-bold text-green-400">
                      {trainingPrograms.reduce((sum, p) => sum + p.lessons.filter(l => l.completed).length, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Lessons Completed</div>
                  </div>
                  
                  <div className="p-4 bg-background/30 backdrop-blur-sm rounded-lg text-center">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="text-lg font-bold text-primary">
                      {trainingPrograms.reduce((sum, p) => sum + p.lessons.filter(l => l.completed).reduce((s, l) => s + l.duration, 0), 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Minutes Learned</div>
                  </div>
                </div>
              </div>

              {/* Program Progress */}
              <div className="space-y-3">
                <h3 className="font-medium text-primary">Program Progress</h3>
                {trainingPrograms.map((program) => (
                  <div key={program.id} className="p-3 bg-background/20 backdrop-blur-sm rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{program.title}</span>
                      <span className="text-sm text-accent">{program.progress}%</span>
                    </div>
                    <Progress value={program.progress} className="h-2" />
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <Card className="gradient-card backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-primary">Your Golf Journey</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent mb-1">
                      {Math.floor(achievements.reduce((sum, a) => sum + a.xpReward, 0) / 1000) + 1}
                    </div>
                    <div className="text-sm text-muted-foreground">Current Level</div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div>
                      <div className="font-bold text-primary">{playerStats.handicap}</div>
                      <div className="text-muted-foreground">Handicap</div>
                    </div>
                    <div>
                      <div className="font-bold text-green-400">{playerStats.bestScore}</div>
                      <div className="text-muted-foreground">Best Score</div>
                    </div>
                    <div>
                      <div className="font-bold text-yellow-400">{achievements.length}</div>
                      <div className="text-muted-foreground">Achievements</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recommended Actions */}
      <Card className="gradient-card backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-primary flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Recommended for You</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start bg-background/30 border-white/20 backdrop-blur-sm hover:bg-background/50"
            onClick={handlePracticeModeOpen}
          >
            <Target className="w-5 h-5 mr-3 text-accent" />
            <div className="text-left flex-1">
              <div className="font-medium">Practice on Range</div>
              <div className="text-sm text-muted-foreground">Work on your swing fundamentals</div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start bg-background/30 border-white/20 backdrop-blur-sm hover:bg-background/50"
            onClick={() => toast.info('Feature coming soon!')}
          >
            <Video className="w-5 h-5 mr-3 text-primary" />
            <div className="text-left flex-1">
              <div className="font-medium">Record Practice Session</div>
              <div className="text-sm text-muted-foreground">Get AI feedback on your technique</div>
            </div>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start bg-background/30 border-white/20 backdrop-blur-sm hover:bg-background/50"
            onClick={() => toast.info('Feature coming soon!')}
          >
            <BarChart3 className="w-5 h-5 mr-3 text-green-400" />
            <div className="text-left flex-1">
              <div className="font-medium">Review Your Stats</div>
              <div className="text-sm text-muted-foreground">Track improvement over time</div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}