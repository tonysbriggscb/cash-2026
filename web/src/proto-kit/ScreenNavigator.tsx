import { useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import type { ScreenConfig, ScreenProps } from "./types";

type AnimationPhase = "idle" | "start" | "animating";
type Direction = "forward" | "back";

interface UseScreenNavigatorOptions<TScreen extends string> {
  screens: Record<TScreen, ScreenConfig<TScreen>>;
  screenOrder: TScreen[];
  initialScreen: TScreen;
  onScreenChange?: (screen: TScreen) => void;
  /** Initial history so the first screen can show back (e.g. when starting on "cash", pass ["complete"]) */
  initialHistory?: TScreen[];
}

interface UseScreenNavigatorReturn<TScreen extends string> {
  currentScreen: TScreen;
  displayedScreen: TScreen;
  animationPhase: AnimationPhase;
  direction: Direction;
  navigate: (screen: TScreen) => void;
  goBack: () => void;
  canGoBack: boolean;
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
  initialHistory = [],
}: UseScreenNavigatorOptions<TScreen>): UseScreenNavigatorReturn<TScreen> {
  const [currentScreen, setCurrentScreen] = useState<TScreen>(initialScreen);
  const [displayedScreen, setDisplayedScreen] = useState<TScreen>(initialScreen);
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("idle");
  const [direction, setDirection] = useState<Direction>("forward");
  const [history, setHistory] = useState<TScreen[]>(initialHistory);

  const navigate = useCallback(
    (newScreen: TScreen) => {
      if (animationPhase !== "idle" || newScreen === currentScreen) return;

      setHistory((h) => [...h, currentScreen]);

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

  const goBack = useCallback(() => {
    if (animationPhase !== "idle" || history.length === 0) return;

    const previousScreen = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setDirection("back");
    setCurrentScreen(previousScreen);
    setAnimationPhase("start");
    onScreenChange?.(previousScreen);
  }, [animationPhase, history.length, onScreenChange]);

  const restart = useCallback(() => {
    setCurrentScreen(initialScreen);
    setDisplayedScreen(initialScreen);
    setAnimationPhase("idle");
    setDirection("forward");
    setHistory([]);
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
      // Must be >= the CSS transition duration (0.35s) so the animation fully
      // completes before the state resets. A 20ms buffer avoids a visible snap
      // on the last frame of the transition.
      const timer = setTimeout(() => {
        setDisplayedScreen(currentScreen);
        setAnimationPhase("idle");
      }, 370);
      return () => clearTimeout(timer);
    }
  }, [animationPhase, currentScreen]);

  // Calculate transform values based on animation state.
  // Forward: new screen slides in from right (100%→0), old screen nudges left (0→-30%) — iOS push style.
  // Back: reverse of the above.
  const getTransform = useCallback(
    (isNew: boolean) => {
      if (animationPhase === "idle") {
        return "translateX(0)";
      }

      if (isNew) {
        if (animationPhase === "start") {
          return direction === "forward" ? "translateX(100%)" : "translateX(-30%)";
        }
        return "translateX(0)";
      } else {
        if (animationPhase === "start") {
          return "translateX(0)";
        }
        return direction === "forward" ? "translateX(-30%)" : "translateX(100%)";
      }
    },
    [animationPhase, direction]
  );

  const isAtStart = currentScreen === initialScreen;
  const canGoBack = history.length > 0;

  return {
    currentScreen,
    displayedScreen,
    animationPhase,
    direction,
    navigate,
    goBack,
    canGoBack,
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
  direction: Direction;
  navigate: (screen: TScreen) => void;
  onShowWorkInProgress: () => void;
  onOpenTray?: (trayId: string) => void;
  /** Optional background style for specific screens */
  getScreenBackground?: (screen: TScreen) => string;
  /** Renders the nav header for a given screen — included inside the animated div so it slides with content */
  renderHeaderForScreen?: (screen: TScreen) => ReactNode;
  /** Renders CTA buttons for a given screen — inside the slot so they slide with the screen transition */
  renderCTAForScreen?: (screen: TScreen) => ReactNode;
  /** Renders the bottom tab bar for a given screen — inside the slot so it slides with the screen transition */
  renderTabBarForScreen?: (screen: TScreen) => ReactNode;
}

/**
 * Component that renders screens with transition animations.
 *
 * Uses a ping-pong slot system: two divs (A and B) are always in the DOM and
 * alternate which one is "front" (active) after each transition. This means
 * a previously-visited screen is never unmounted when navigating away from it,
 * so its mount animations (e.g. the sparkline fade-in) can't replay mid-transition.
 */
export function ScreenNavigator<TScreen extends string>({
  screens,
  currentScreen,
  displayedScreen,
  animationPhase,
  direction,
  navigate,
  onShowWorkInProgress,
  onOpenTray,
  getScreenBackground,
  renderHeaderForScreen,
  renderCTAForScreen,
  renderTabBarForScreen,
}: ScreenNavigatorProps<TScreen>) {
  const easing = "ease-out";
  const dur = "0.22s";
  const transStr = `transform ${dur} ${easing}`;
  const shadowCss = "-4px 0 16px rgba(0,0,0,0.18)";

  // --- Ping-pong slots ---
  // Slot A starts as "front" (active). After each animation they swap roles.
  // The back slot keeps the previous screen mounted, preventing remounts.
  const [slotA, setSlotA] = useState<TScreen>(currentScreen);
  const [slotB, setSlotB] = useState<TScreen>(currentScreen);

  // Use a ref so the useEffect always reads the latest value without needing
  // it in the dependency array (which would cause spurious re-runs).
  const frontIsARef = useRef(true);

  type SlotStyle = { transform: string; transition: boolean; z: number; shadow: boolean };
  const [styleA, setStyleA] = useState<SlotStyle>({ transform: "translateX(0)", transition: false, z: 2, shadow: false });
  const [styleB, setStyleB] = useState<SlotStyle>({ transform: "translateX(0)", transition: false, z: 1, shadow: false });

  useEffect(() => {
    if (animationPhase === "start") {
      const fwd = direction === "forward";
      const entry = fwd ? "translateX(100%)" : "translateX(-30%)";

      if (frontIsARef.current) {
        // A is front (departing), B is back (arriving)
        setSlotB(currentScreen);
        // No shadow yet — adding it here would cause an instant visual snap before the animation begins
        setStyleA({ transform: "translateX(0)", transition: false, z: fwd ? 1 : 2, shadow: false });
        setStyleB({ transform: entry,            transition: false, z: fwd ? 2 : 1, shadow: false });
      } else {
        // B is front (departing), A is back (arriving)
        setSlotA(currentScreen);
        setStyleB({ transform: "translateX(0)", transition: false, z: fwd ? 1 : 2, shadow: false });
        setStyleA({ transform: entry,            transition: false, z: fwd ? 2 : 1, shadow: false });
      }
    } else if (animationPhase === "animating") {
      const fwd = direction === "forward";
      const exit = fwd ? "translateX(-30%)" : "translateX(100%)";
      if (frontIsARef.current) {
        // Shadow added here — it fades in alongside the transform rather than snapping before animation
        setStyleA(p => ({ ...p, transform: exit,            transition: true, shadow: !fwd }));
        setStyleB(p => ({ ...p, transform: "translateX(0)", transition: true, shadow: fwd }));
      } else {
        setStyleB(p => ({ ...p, transform: exit,            transition: true, shadow: !fwd }));
        setStyleA(p => ({ ...p, transform: "translateX(0)", transition: true, shadow: fwd }));
      }
    } else {
      // idle — animation complete: flip which slot is front
      frontIsARef.current = !frontIsARef.current;
      const aIsFront = frontIsARef.current;
      setStyleA(p => ({ ...p, transition: false, shadow: false, z: aIsFront ? 2 : 1 }));
      setStyleB(p => ({ ...p, transition: false, shadow: false, z: aIsFront ? 1 : 2 }));
    }
  }, [animationPhase]); // eslint-disable-line react-hooks/exhaustive-deps
  // direction and currentScreen are intentionally omitted — they change atomically
  // with animationPhase and are read from the closure that fires for that phase.

  const renderSlot = (screen: TScreen): ReactNode => {
    const config = screens[screen];
    if (!config) return null;
    const Component = config.component;
    const props: ScreenProps<TScreen> = { onNavigate: navigate, onShowWorkInProgress, onOpenTray };
    return <Component {...props} />;
  };

  const getBg = (screen: TScreen) => getScreenBackground?.(screen) ?? "var(--color-bg)";

  const slotDiv = (screen: TScreen, style: SlotStyle, key: string) => (
    <div
      key={key}
      className="screen"
      style={{
        transform: style.transform,
        transition: style.transition ? transStr : "none",
        zIndex: style.z,
        boxShadow: style.shadow ? shadowCss : "none",
        backgroundColor: getBg(screen),
        // Only hint the GPU layer during active transitions. If we apply
        // will-change: transform permanently, WebKit rasterises a composited
        // bitmap of the screen at creation time (scroll position = 0). When the
        // animation later starts on a screen that has been scrolled, the stale
        // bitmap causes a visual jump back to the top. By setting it only here —
        // at the moment transition: true is applied — the compositor captures the
        // actual current scroll position and animates from there correctly.
        willChange: style.transition ? "transform" : "auto",
      }}
    >
      {renderHeaderForScreen?.(screen)}
      {/* Content + CTA are co-located in a flex-grow wrapper so the CTA's
          position: absolute; bottom: 0 anchors to the content area, not the
          full slot height (which now includes the tab bar below). */}
      <div style={{ flex: 1, position: "relative", minHeight: 0, display: "flex", flexDirection: "column" }}>
        {renderSlot(screen)}
        {renderCTAForScreen?.(screen)}
      </div>
      {renderTabBarForScreen?.(screen)}
    </div>
  );

  return (
    <div className="screen-container" style={{ flex: 1, overflow: "hidden" }}>
      {slotDiv(slotA, styleA, "slot-a")}
      {slotDiv(slotB, styleB, "slot-b")}
    </div>
  );
}
