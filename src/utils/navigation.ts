export interface NavigationState {
  screen: string;
  params?: any;
}

export interface NavigationManager {
  navigateTo: (screen: string, params?: any) => void;
  navigateBack: () => void;
  getCurrentScreen: () => string;
  canGoBack: () => boolean;
}

export function createNavigationManager(
  setActiveScreen: (screen: string) => void
): NavigationManager {
  const navigationHistory: NavigationState[] = [{ screen: 'home' }];
  let currentIndex = 0;

  const navigateTo = (screen: string, params?: any) => {
    // Add new screen to history
    const newState = { screen, params };
    navigationHistory.splice(currentIndex + 1, navigationHistory.length - currentIndex - 1, newState);
    currentIndex = navigationHistory.length - 1;
    setActiveScreen(screen);
  };

  const navigateBack = () => {
    if (currentIndex > 0) {
      currentIndex--;
      const previousState = navigationHistory[currentIndex];
      setActiveScreen(previousState.screen);
    }
  };

  const getCurrentScreen = () => {
    return navigationHistory[currentIndex]?.screen || 'home';
  };

  const canGoBack = () => {
    return currentIndex > 0;
  };

  return {
    navigateTo,
    navigateBack,
    getCurrentScreen,
    canGoBack
  };
}