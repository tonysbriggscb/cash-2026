import { useState, useEffect, useCallback } from "react";
import type { ScreenConfig, ScreenProps } from "./types";

type AnimationPhase = "idle" | "start" | "animating";
type Direction = "forward" | "back";

interface UseScreenNavigatorOptions<TScreen extends string> {
  screens: Record<TScreen, ScreenConfig<TScreen>>;
  screenOrder: TScreen[];
  initialScreen: TScreen;
  onScreenChange?: (screen: TScreen) => void;
}

interface UseScreenNavigatorReturn<TScreen extends string> {
  currentScreen: TScreen;
  displayedScreen: TScreen;
  animationPhase: AnimationPhase;
  direction: Direction;
  navigate: (screen: TScreen) => void;
  restart: () => void;
  isAtStart: boolean;
  getTransform: (isNew: boolean) => string;
}

/**
 * Hook to manage screen navigation with transitions
 */
export function useScreenNavigator<TScreen extends string>({
  screens,
  screenOrder,
  initialScreen,
  onScreenChange,
}: UseScreenNavigatorOptions<TScreen>): UseScreenNavigatorReturn<TScreen> {
  const [currentScreen, setCurrentScreen] = useState<TScreen>(initialScreen);
  const [displayedScreen, setDisplayedScreen] = useState<TScreen>(initialScreen);
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("idle");
  const [direction, setDirection] = useState<Direction>("forward");

  const navigate = useCallback(
    (newScreen: TScreen) => {
      if (animationPhase !== "idle" || newScreen === currentScreen) return;

      const currentIndex = screenOrder.indexOf(currentScreen);
      const newIndex = screenOrder.indexOf(newScreen);
      const dir = newIndex > currentIndex ? "forward" : "back";

      setDirection(dir);
      setCurrentScreen(newScreen);
      setAnimationPhase("start");
      onScreenChange?.(newScreen);
    },
    [animationPhase, currentScreen, screenOrder, onScreenChange]
  );

  const restart = useCallback(() => {
    setCurrentScreen(initialScreen);
    setDisplayedScreen(initialScreen);
    setAnimationPhase("idle");
    setDirection("forward");
    onScreenChange?.(initialScreen);
  }, [initialScreen, onScreenChange]);

  // Handle animation phases
  useEffect(() => {
    if (animationPhase === "start") {
      // Use requestAnimationFrame to ensure the browser has painted the initial state
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimationPhase("animating");
        });
      });
    } else if (animationPhase === "animating") {
      const timer = setTimeout(() => {
        setDisplayedScreen(currentScreen);
        setAnimationPhase("idle");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [animationPhase, currentScreen]);

  // Calculate transform values based on animation state
  const getTransform = useCallback(
    (isNew: boolean) => {
      if (animationPhase === "idle") {
        return "translateX(0)";
      }

      if (isNew) {
        // New screen
        if (animationPhase === "start") {
          return direction === "forward" ? "translateX(100%)" : "translateX(-100%)";
        }
        return "translateX(0)";
      } else {
        // Old screen
        if (animationPhase === "start") {
          return "translateX(0)";
        }
        return direction === "forward" ? "translateX(-100%)" : "translateX(100%)";
      }
    },
    [animationPhase, direction]
  );

  const isAtStart = currentScreen === initialScreen;

  return {
    currentScreen,
    displayedScreen,
    animationPhase,
    direction,
    navigate,
    restart,
    isAtStart,
    getTransform,
  };
}

interface ScreenNavigatorProps<TScreen extends string> {
  screens: Record<TScreen, ScreenConfig<TScreen>>;
  currentScreen: TScreen;
  displayedScreen: TScreen;
  animationPhase: AnimationPhase;
  getTransform: (isNew: boolean) => string;
  navigate: (screen: TScreen) => void;
  onShowWorkInProgress: () => void;
  onOpenTray?: (trayId: string) => void;
  /** Optional background style for specific screens */
  getScreenBackground?: (screen: TScreen) => string;
}

/**
 * Component that renders screens with transition animations
 */
export function ScreenNavigator<TScreen extends string>({
  screens,
  currentScreen,
  displayedScreen,
  animationPhase,
  getTransform,
  navigate,
  onShowWorkInProgress,
  onOpenTray,
  getScreenBackground,
}: ScreenNavigatorProps<TScreen>) {
  const activeScreen = animationPhase === "idle" ? displayedScreen : currentScreen;

  const renderScreen = (screen: TScreen) => {
    const config = screens[screen];
    if (!config) return null;

    const Component = config.component;
    const props: ScreenProps<TScreen> = {
      onNavigate: navigate,
      onShowWorkInProgress,
      onOpenTray,
    };

    return <Component {...props} />;
  };

  const getBackground = (screen: TScreen) => {
    if (getScreenBackground) {
      return getScreenBackground(screen);
    }
    return "var(--color-bg)";
  };

  return (
    <div className="screen-container" style={{ flex: 1 }}>
      {/* Old screen (only during animation) */}
      {animationPhase !== "idle" && (
        <div
          className="screen"
          style={{
            transform: getTransform(false),
            transition:
              animationPhase === "animating"
                ? "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                : "none",
            backgroundColor: getBackground(displayedScreen),
          }}
        >
          {renderScreen(displayedScreen)}
        </div>
      )}
      {/* Current/new screen */}
      <div
        className="screen"
        style={{
          transform: getTransform(true),
          transition:
            animationPhase === "animating"
              ? "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              : "none",
          backgroundColor: getBackground(activeScreen),
        }}
      >
        {renderScreen(activeScreen)}
      </div>
    </div>
  );
}
