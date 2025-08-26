import { Home, Video, Target, BookOpen, Users, User } from 'lucide-react';
import { SCREENS } from '../constants/navigation';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NAV_ITEMS = [
  {
    id: SCREENS.HOME,
    label: 'Home',
    icon: Home
  },
  {
    id: SCREENS.ANALYZER,
    label: 'Analyzer',
    icon: Video
  },
  {
    id: SCREENS.CADDIE,
    label: 'Caddie',
    icon: Target
  },
  {
    id: SCREENS.COACH,
    label: 'Coach',
    icon: BookOpen
  },
  {
    id: SCREENS.SOCIAL_HUB,
    label: 'Social',
    icon: Users
  },
  {
    id: SCREENS.PROFILE,
    label: 'Profile',
    icon: User
  }
];

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  // Map some screens to their main tab
  const getActiveTab = (currentTab: string) => {
    // Profile and stats screens should show no active tab since they're accessed through floating actions
    if (currentTab === SCREENS.PROFILE || currentTab === SCREENS.STATS) {
      return '';
    }
    
    // Social-related screens should highlight Social tab
    if ([
      SCREENS.SOCIAL_HUB, 
      SCREENS.ADD_FRIEND, 
      SCREENS.FRIENDS_LEADERBOARD,
      'messages'
    ].includes(currentTab)) {
      return SCREENS.SOCIAL_HUB;
    }
    
    // User profile screens should highlight Social tab
    if (currentTab.startsWith('user-profile-')) {
      return SCREENS.SOCIAL_HUB;
    }
    
    return currentTab;
  };

  const activeTabNormalized = getActiveTab(activeTab);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-white/10 z-50">
      <div className="flex items-center justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTabNormalized === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              <span className={`text-xs ${isActive ? 'text-primary font-medium' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}