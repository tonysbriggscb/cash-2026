import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { MediaQueryProvider } from "@coinbase/cds-web/system/MediaQueryProvider";
import { PortalProvider } from "@coinbase/cds-web/overlays/PortalProvider";
import { ThemeProvider } from "@coinbase/cds-web/system/ThemeProvider";
import { defaultTheme } from "@coinbase/cds-web/themes/defaultTheme";
import { HStack, VStack, Box } from "@coinbase/cds-web/layout";
import { IconButton } from "@coinbase/cds-web/buttons/IconButton";
import "@coinbase/cds-web/globalStyles";

import type { 
  ProtoKitConfig, 
  ScreenConfig, 
  HeaderConfig, 
  FlowConfig,
  TrayProps,
  BottomTabConfig,
} from "./types";
import { Icon } from "@coinbase/cds-web/icons/Icon";
import { Text } from "@coinbase/cds-web/typography/Text";
import { DEVICE_WIDTH, DEVICE_HEIGHT } from "./types";
import { protoKitStyles } from "./styles";
import { IOSStatusBar } from "./IOSStatusBar";
import { DeviceFrame, useViewport } from "./DeviceFrame";
import { PrototypeToolbar } from "./PrototypeToolbar";
import { useScreenNavigator, ScreenNavigator } from "./ScreenNavigator";
import { WorkInProgressModal } from "./WorkInProgressModal";
import { CanvasNotes } from "./CanvasNotes";
import { useCanvasNotes } from "./useCanvasNotes";
import { TapHint } from "./TapHint";
import { parseSettingsFromUrl } from "./settings";

interface ProtoKitProps<TScreen extends string> extends ProtoKitConfig<TScreen> {
  /** Custom theme (defaults to CDS defaultTheme) */
  theme?: typeof defaultTheme;
  /** Whether the kit is entering (for entrance animation) */
  isEntering?: boolean;
}

/**
 * Fixed bottom tab bar matching the CDS mobile TabNavigation visual design.
 * Uses CDS Icon and Text primitives so icon rendering and theming are consistent.
 */
/** Resolved left/right button config used for display and comparison */
function BottomTabBar<TScreen extends string>({
  tabs,
  activeTabId,
  showActionButtons,
  onNavigate,
}: {
  tabs: BottomTabConfig<TScreen>[];
  activeTabId: string;
  showActionButtons: boolean;
  onNavigate: (screen: TScreen, tabId: string) => void;
}) {
  return (
    <div className="proto-kit-bottom-tab-bar" style={{ flexShrink: 0 }}>
      {/* Tab icons row + home indicator — solid bg so scroll content doesn't bleed through */}
      <div
        style={{
          backgroundColor: "var(--color-bg)",
          borderTop: "1px solid",
          // Hide the divider when CTAs are up — the gradient inside the screen slot
          // acts as the visual separator. Show it when CTAs are hidden (scrolled away).
          borderTopColor: showActionButtons ? "transparent" : "var(--color-bgLine)",
          transition: "border-top-color 0.2s ease-in-out",
        }}
      >
        <div
          style={{
            display: "flex",
            paddingTop: 16,
            paddingBottom: 8,
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          {tabs.map((tab) => {
            const actionable = tab.actionable !== false;
            const isActive = actionable && tab.id === activeTabId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={actionable ? () => onNavigate(tab.screen, tab.id) : undefined}
                aria-current={isActive ? "page" : undefined}
                aria-label={tab.label}
                aria-disabled={!actionable}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  minWidth: 0,
                  background: "none",
                  border: "none",
                  cursor: actionable ? "pointer" : "default",
                  paddingTop: 0,
                  paddingBottom: 4,
                  paddingLeft: 0,
                  paddingRight: 0,
                  gap: 4,
                  ...(!actionable && { pointerEvents: "none" }),
                }}
              >
                <Icon
                  name={tab.icon as any}
                  size="m"
                  active={isActive}
                  color={isActive ? "fgPrimary" : "fg"}
                />
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 500,
                    lineHeight: 1,
                    color: isActive ? "var(--color-fgPrimary)" : "var(--color-fg)",
                  }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* iPhone home indicator — 16px padding between tabs and pill, 8px below pill */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: 16,
          paddingBottom: 8,
          backgroundColor: "var(--color-bg)",
        }}
      >
        <div
          style={{
            width: 134,
            height: 5,
            borderRadius: 3,
            backgroundColor: "var(--color-fg)",
          }}
        />
      </div>
    </div>
  );
}

/**
 * Progress Stepper component for multi-step flows
 */
const ProgressStepper = ({ 
  currentStep, 
  totalSteps 
}: { 
  currentStep: number; 
  totalSteps: number;
}) => (
  <HStack gap={0.5} styles={{ root: { width: "100%" } }}>
    {Array.from({ length: totalSteps }).map((_, index) => {
      const isComplete = index < currentStep;
      const isCurrent = index === currentStep;
      return (
        <Box
          key={index}
          styles={{
            root: {
              flex: 1,
              height: 4,
              borderRadius: 1000,
              backgroundColor: isComplete
                ? "var(--color-bgPrimary)"
                : isCurrent
                ? "var(--color-bgPrimaryWash)"
                : "var(--color-bgLine)",
            },
          }}
        />
      );
    })}
  </HStack>
);

/**
 * Internal content component that handles all the prototype logic
 */
function ProtoKitContent<TScreen extends string>({
  screens,
  screenOrder,
  initialScreen,
  flows = [],
  trays = [],
  bottomTabBar,
  totalSteps = 0,
  getStepForScreen,
  renderHeader: customRenderHeader,
  renderAlternateFlow,
  renderToolbarExtra,
  renderDepositLabel,
  initialHistory,
  isDarkMode,
  onToggleDarkMode,
  isEntering = true,
}: ProtoKitConfig<TScreen> & { isDarkMode: boolean; onToggleDarkMode: () => void; isEntering?: boolean }) {
  const { isMobile, scale } = useViewport();
  
  // Parse URL settings for tester mode (do this first so we can use it for initial state)
  const urlSettings = useMemo(() => parseSettingsFromUrl(), []);

  // Canvas notes for designer annotations (desktop only)
  const { notes, addNote, updateNote, removeNote, moveNote, setScopeForNote } = useCanvasNotes();

  // Tap hint overlay for guiding users to the correct button
  const [showHints, setShowHints] = useState(() => urlSettings.showHints);
  // Track the active tab independently — defaults to first tab so it starts highlighted
  const [activeTabId, setActiveTabId] = useState(() => bottomTabBar?.tabs[0]?.id ?? "");
  // Action buttons above the tab bar — hide on scroll down, show on scroll up
  const [showActionButtons, setShowActionButtons] = useState(true);
  const lastScrollTopRef = useRef(0);
  const screenContentRef = useRef<HTMLDivElement>(null);
  const alternateContentRef = useRef<HTMLDivElement>(null);
  
  // Use flow from URL if specified, otherwise default to first flow
  const [currentFlow, setCurrentFlow] = useState(() => {
    if (urlSettings.flow && flows.some(f => f.id === urlSettings.flow)) {
      return urlSettings.flow;
    }
    return flows[0]?.id ?? "main";
  });
  const [workInProgressModalVisible, setWorkInProgressModalVisible] = useState(false);
  const [activeTray, setActiveTray] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastHiding, setToastHiding] = useState(false);

  const {
    currentScreen,
    displayedScreen,
    animationPhase,
    direction,
    navigate,
    goBack,
    canGoBack,
    restart,
    isAtStart,
  } = useScreenNavigator({
    screens,
    screenOrder,
    initialScreen,
    initialHistory,
  });

  // Handler for elements that don't have interactions yet
  // Only show modal if modals are enabled in settings
  const showWorkInProgress = () => {
    if (urlSettings.showModals) {
      setWorkInProgressModalVisible(true);
    }
  };

  // Handler for opening trays
  const openTray = (trayId: string) => setActiveTray(trayId);
  const closeTray = () => setActiveTray(null);

  // Handler for restarting prototype
  const restartPrototype = useCallback(() => {
    restart();
    setActiveTray(null);
    setWorkInProgressModalVisible(false);
    setToastHiding(false);
    setShowToast(true);
  }, [restart]);

  // Keyboard shortcuts: R to restart, N to add permanent note, Shift+N to add screen-scoped note
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if ((e.key === "r" || e.key === "R") && !isAtStart) {
        restartPrototype();
      }
      if ((e.key === "n" || e.key === "N") && !isMobile) {
        const noteId = addNote(currentScreen);
        if (e.shiftKey && noteId) {
          setScopeForNote(noteId, "screen", currentScreen);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAtStart, isMobile, addNote, setScopeForNote, currentScreen, restartPrototype]);

  // Scroll direction detection — hide action buttons on scroll down, show on scroll up.
  // Button position is controlled via --cta-ty CSS custom property (direct DOM update)
  // rather than React state, so scroll events don't cause ScreenNavigator re-renders
  // that would interrupt in-flight CSS transitions.
  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const currentTop = target.scrollTop ?? 0;
      const delta = currentTop - lastScrollTopRef.current;

      // Always show CTAs when the user is within 30px of the bottom — they
      // can't scroll further so the buttons should re-appear automatically.
      const distanceFromBottom = target.scrollHeight - target.clientHeight - currentTop;
      const nearBottom = distanceFromBottom <= 30;

      if (nearBottom || delta < -4) {
        setShowActionButtons(true);
        screenContentRef.current?.style.setProperty("--cta-ty", "0px");
      } else if (delta > 4) {
        setShowActionButtons(false);
        screenContentRef.current?.style.setProperty("--cta-ty", "60px");
      }
      lastScrollTopRef.current = currentTop;
    };

    const el = screenContentRef.current;
    if (el) {
      // capture:true catches scroll events from any scrollable descendant
      el.addEventListener("scroll", handleScroll, { capture: true });
      return () => el.removeEventListener("scroll", handleScroll, { capture: true });
    }
  }, []);

  // Reset CTA button position and scroll tracking at the start of each navigation.
  // We avoid setting React state here (only do direct DOM updates) so this effect
  // doesn't trigger a ProtoKitContent re-render while ScreenNavigator is also
  // setting up its slot transforms — keeping the two operations in separate
  // render/commit cycles prevents the layout recalculation from competing with
  // the CSS transition setup.
  useEffect(() => {
    if (animationPhase === "start") {
      screenContentRef.current?.style.setProperty("--cta-ty", "0px");
      lastScrollTopRef.current = 0;
    } else if (animationPhase === "idle") {
      // After the animation lands, snap the border state back to "buttons visible"
      // without interfering with the in-flight CSS transition.
      setShowActionButtons(true);
    }
  }, [animationPhase]);

  // Auto-hide toast
  useEffect(() => {
    if (showToast && !toastHiding) {
      const timer = setTimeout(() => {
        setToastHiding(true);
        setTimeout(() => {
          setShowToast(false);
          setToastHiding(false);
        }, 300);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast, toastHiding]);

  // Get header config for a screen
  const getHeaderConfig = (screen: TScreen): HeaderConfig => {
    return screens[screen]?.header ?? {};
  };

  // Get current step for stepper
  const getCurrentStep = (screen: TScreen): number => {
    if (getStepForScreen) {
      return getStepForScreen(screen);
    }
    return screenOrder.indexOf(screen);
  };

  // Render CTA action buttons inside each screen slot so they slide with the transition.
  //
  // Intentionally does NOT capture showActionButtons from React state — button visibility
  // is driven by the CSS custom property --cta-ty set directly on the scroll container,
  // so scroll events never cause ScreenNavigator to re-render (which would interrupt
  // in-flight CSS transitions).
  const renderCTA = useCallback((screen: TScreen) => {
    if (!bottomTabBar || bottomTabBar.tabs.length === 0) return null;
    if (screens[screen]?.hideTabBar) return null;

    // Screen-level config takes priority; fall back to the matching tab's config
    // (e.g. the "home" tab owns "Transfer / Buy & sell" but the screen itself has none).
    let actionButtons = screens[screen]?.actionButtons;
    if (!actionButtons) {
      const tab = bottomTabBar.tabs.find(
        (t) => (t.screen as string) === (screen as string)
      );
      actionButtons = tab?.actionButtons;
    }
    if (!actionButtons) return null;

    const leftBtn = actionButtons.left ?? { label: "Withdraw", trayId: "withdraw" };
    const rightBtn = actionButtons.right ?? { label: null as string | null };
    const depositLabelNode = renderDepositLabel?.();
    const rightLabel: React.ReactNode = rightBtn.label ?? depositLabelNode ?? "Deposit";

    return (
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 104,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to bottom, rgba(255,255,255,0) 0%, var(--color-bg) 82.692%)`,
            pointerEvents: "none",
            transform: "translateY(var(--cta-ty, 0px))",
            transition: "transform 0.3s ease 0ms",
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            gap: 8,
            paddingLeft: 16,
            paddingRight: 16,
            pointerEvents: "auto",
          }}
        >
          <button
            type="button"
            onClick={() => leftBtn.trayId ? openTray(leftBtn.trayId) : undefined}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 100,
              border: "none",
              cursor: "pointer",
              backgroundColor: "rgb(var(--blue5))",
              color: "var(--color-fgPrimary)",
              fontSize: "1rem",
              fontWeight: 500,
              lineHeight: "1.5rem",
              fontFamily: "inherit",
              // Driven by --cta-ty CSS custom property on the scroll container,
              // not React state — avoids re-rendering slots on every scroll tick.
              transform: "translateY(var(--cta-ty, 0px))",
              transition: "transform 0.3s ease 0ms",
            }}
          >
            {leftBtn.label}
          </button>
          <button
            type="button"
            onClick={() => rightBtn.trayId ? openTray(rightBtn.trayId) : undefined}
            style={{
              flex: 1,
              height: 36,
              borderRadius: 100,
              border: "none",
              cursor: "pointer",
              backgroundColor: "var(--color-bgPrimary)",
              color: "var(--color-fgInverse)",
              fontSize: "1rem",
              fontWeight: 500,
              lineHeight: "1.5rem",
              fontFamily: "inherit",
              transform: "translateY(var(--cta-ty, 0px))",
              transition: "transform 0.3s ease 30ms",
            }}
          >
            {rightLabel}
          </button>
        </div>
      </div>
    );
  }, [bottomTabBar, screens, openTray, renderDepositLabel]);

  // Render header based on config
  const renderHeader = (screen: TScreen) => {
    const config = getHeaderConfig(screen);
    const screenConfig = screens[screen];

    if (customRenderHeader) {
      return customRenderHeader(screen, config);
    }

    // Custom header component (e.g. HomeTopNav) — renders in place of the default nav bar
    if (screenConfig?.headerComponent) {
      const HeaderComponent = screenConfig.headerComponent;
      return <HeaderComponent />;
    }

    const step = getCurrentStep(screen);

    if (config.invisible === true) return null;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 16px",
          minHeight: 44,
        }}
      >
        {/* Left */}
        <div style={{ width: 40 }}>
          {config.left === "back" && (
            <IconButton
              name="backArrow"
              variant="secondary"
              compact
              transparent
              accessibilityLabel="Go back"
              // Only wire up the action when there's somewhere to go back to.
              // Always rendering the button (even when invisible during a transition)
              // keeps the header height constant, preventing a layout jump at
              // the moment canGoBack flips (which coincides with the slide start).
              onClick={config.backDisabled || !canGoBack ? undefined : goBack}
            />
          )}
        </div>

        {/* Center */}
        <div style={{ flex: 1, padding: "0 8px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          {config.center === "stepper" && totalSteps > 0 && (
            <ProgressStepper currentStep={step} totalSteps={totalSteps} />
          )}
          {config.center !== "stepper" && config.center != null && (
            <Text font="label1" color="fg">{config.center}</Text>
          )}
        </div>

        {/* Right */}
        <div style={{ width: 40 }}>
          {config.right === "close" && (
            <IconButton
              name="close"
              variant="secondary"
              compact
              transparent
              accessibilityLabel="Close"
              onClick={() => navigate(initialScreen)}
            />
          )}
        </div>
      </div>
    );
  };

  const activeScreen = animationPhase === "idle" ? displayedScreen : currentScreen;

  // Check if showing an alternate flow
  const primaryFlowId = flows[0]?.id ?? "main";
  const isAlternateFlow = currentFlow !== primaryFlowId;
  const switchToMainFlow = () => setCurrentFlow(primaryFlowId);

  // Alternate flow content (if applicable)
  if (isAlternateFlow && renderAlternateFlow) {
    const alternateContent = (
      <div
        ref={alternateContentRef}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Fixed Header - iOS Status Bar + Invisible Header spacer */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            backgroundColor: "var(--color-bg)",
            flexShrink: 0,
          }}
        >
          {/* iOS Status Bar - only on desktop */}
          {!isMobile && <IOSStatusBar />}
          
          {/* Invisible header spacer - matches main flow header height */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 16px",
              minHeight: 44,
              opacity: 0,
              pointerEvents: "none",
            }}
          />
        </div>
        
        {/* Alternate flow content - wrapped same as main flow screens */}
        <div className="screen-container" style={{ flex: 1 }}>
          <div
            className="screen"
            style={{
              backgroundColor: "var(--color-bg)",
            }}
          >
            {renderAlternateFlow(currentFlow, switchToMainFlow)}
          </div>
        </div>

        {/* Tap hint overlay for alternate flow */}
        <TapHint
          active={showHints}
          containerRef={alternateContentRef}
          currentScreen={currentFlow}
        />
      </div>
    );

    // Toast component for alternate flow
    const toast = showToast && (
      <div
        className={toastHiding ? "toast-hiding" : "toast"}
        style={{
          position: "fixed",
          top: 24,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "var(--color-bgInverse)",
          color: "var(--color-fgInverse)",
          padding: "12px 24px",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 500,
          zIndex: 9999,
          pointerEvents: "none",
        }}
      >
        Prototype restarted
      </div>
    );

    // CDS expressive motion curve
    const expressiveEasing = "cubic-bezier(0.4, 0, 0, 1)";
    const entranceStyles = {
      opacity: isEntering ? 1 : 0,
      transform: isEntering ? "scale(1)" : "scale(0.9)",
      transition: `opacity 0.5s ${expressiveEasing}, transform 0.5s ${expressiveEasing}`,
    };

    if (isMobile) {
      return (
        <>
          {toast}
          <div
            style={{
              width: "100%",
              height: "100vh",
              overflow: "hidden",
              backgroundColor: "var(--color-bg)",
            }}
          >
            {alternateContent}
          </div>
        </>
      );
    }

    return (
      <>
        {toast}
        {urlSettings.showToolbar && (
          <PrototypeToolbar
            onRestart={restartPrototype}
            currentFlow={currentFlow}
            onFlowChange={setCurrentFlow}
            isAtStart={true}
            isDarkMode={isDarkMode}
            onToggleDarkMode={onToggleDarkMode}
            flows={flows.length > 0 ? flows : undefined}
            entranceStyles={entranceStyles}
            onAddNote={() => addNote(currentFlow)}
            hintsEnabled={showHints}
            onToggleHints={() => setShowHints((prev) => !prev)}
            extraContent={renderToolbarExtra?.()}
          />
        )}
        <CanvasNotes
          notes={notes}
          currentScreen={currentFlow}
          onUpdate={updateNote}
          onRemove={removeNote}
          onMove={moveNote}
          onSetScope={setScopeForNote}
        />
        <div style={entranceStyles}>
          <DeviceFrame scale={scale}>{alternateContent}</DeviceFrame>
        </div>
      </>
    );
  }

  // Screen content
  const screenContent = (
    <div
      ref={screenContentRef}
      style={{
        "--cta-ty": "0px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      } as React.CSSProperties}
    >
      {/* iOS Status Bar only — the app header now lives inside each animated screen div */}
      {!isMobile && (
        <div style={{ position: "relative", zIndex: 10, backgroundColor: "var(--color-bg)", flexShrink: 0 }}>
          <IOSStatusBar />
        </div>
      )}

      {/* Animated screen container — each slide includes its own header */}
      <ScreenNavigator
        screens={screens}
        currentScreen={currentScreen}
        displayedScreen={displayedScreen}
        animationPhase={animationPhase}
        direction={direction}
        navigate={navigate}
        onShowWorkInProgress={showWorkInProgress}
        onOpenTray={openTray}
        renderHeaderForScreen={renderHeader}
        renderCTAForScreen={renderCTA}
      />

      {/* Bottom tab bar — hidden on screens with hideTabBar: true */}
      {bottomTabBar && bottomTabBar.tabs.length > 0 && !screens[currentScreen]?.hideTabBar && (
        <BottomTabBar
          tabs={bottomTabBar.tabs}
          activeTabId={activeTabId}
          showActionButtons={showActionButtons}
          onNavigate={(screen, tabId) => {
            setActiveTabId(tabId);
            navigate(screen);
          }}
        />
      )}

      {/* Tap hint overlay */}
      <TapHint
        active={showHints}
        containerRef={screenContentRef}
        currentScreen={currentScreen}
      />

      {/* Render active tray */}
      {trays.map((tray) => {
        const TrayComponent = tray.component;
        return (
          <TrayComponent
            key={tray.id}
            visible={activeTray === tray.id}
            onClose={closeTray}
            onNavigate={(screen) => {
              closeTray();
              navigate(screen as TScreen);
            }}
          />
        );
      })}

      {/* Work In Progress Modal */}
      <WorkInProgressModal
        visible={workInProgressModalVisible}
        onClose={() => setWorkInProgressModalVisible(false)}
      />
    </div>
  );

  // Toast component
  const toast = showToast && (
    <div
      className={toastHiding ? "toast-hiding" : "toast"}
      style={{
        position: "fixed",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "var(--color-bgInverse)",
        color: "var(--color-fgInverse)",
        padding: "12px 24px",
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 500,
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      Prototype restarted
    </div>
  );

  // Mobile: Full screen, no frame
  if (isMobile) {
    return (
      <>
        {toast}
        <div
          style={{
            width: "100%",
            height: "100vh",
            overflow: "hidden",
            backgroundColor: "var(--color-bg)",
          }}
        >
          {screenContent}
        </div>
      </>
    );
  }

  // CDS expressive motion curve
  const expressiveEasing = "cubic-bezier(0.4, 0, 0, 1)";
  const entranceStyles = {
    opacity: isEntering ? 1 : 0,
    transform: isEntering ? "scale(1)" : "scale(0.9)",
    transition: `opacity 0.5s ${expressiveEasing}, transform 0.5s ${expressiveEasing}`,
  };

  // Desktop: Device frame with toolbar
  return (
    <>
      {toast}
      {urlSettings.showToolbar && (
        <PrototypeToolbar
          onRestart={restartPrototype}
          currentFlow={currentFlow}
          onFlowChange={setCurrentFlow}
          isAtStart={isAtStart}
          isDarkMode={isDarkMode}
          onToggleDarkMode={onToggleDarkMode}
          flows={flows.length > 0 ? flows : undefined}
          entranceStyles={entranceStyles}
          onAddNote={() => addNote(currentScreen)}
          hintsEnabled={showHints}
          onToggleHints={() => setShowHints((prev) => !prev)}
          extraContent={renderToolbarExtra?.()}
        />
      )}
      <CanvasNotes
        notes={notes}
        currentScreen={currentScreen}
        onUpdate={updateNote}
        onRemove={removeNote}
        onMove={moveNote}
        onSetScope={setScopeForNote}
      />
      <div style={entranceStyles}>
        <DeviceFrame scale={scale}>{screenContent}</DeviceFrame>
      </div>
    </>
  );
}

/**
 * ProtoKit - Main wrapper component for CDS prototypes
 * 
 * Provides:
 * - Device frame with proper iPhone dimensions
 * - iOS status bar with Dynamic Island
 * - Toolbar with restart, dark mode, and flow selection
 * - Screen navigation with transitions
 * - Work in progress modal
 * - Toast notifications
 * 
 * @example
 * ```tsx
 * <ProtoKit
 *   screens={{
 *     home: { component: HomeScreen, header: { left: null, right: "close" } },
 *     detail: { component: DetailScreen, header: { left: "back", right: null } },
 *   }}
 *   screenOrder={["home", "detail"]}
 *   initialScreen="home"
 *   flows={[{ id: "main", name: "Main flow" }]}
 * />
 * ```
 */
export function ProtoKit<TScreen extends string>({
  theme = defaultTheme,
  isEntering = true,
  ...config
}: ProtoKitProps<TScreen>) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <MediaQueryProvider>
      <PortalProvider>
        <ThemeProvider
          theme={theme}
          activeColorScheme={isDarkMode ? "dark" : "light"}
        >
          <div className="proto-kit">
            <style>{protoKitStyles}</style>
            <ProtoKitContent
              {...config}
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              isEntering={isEntering}
            />
          </div>
        </ThemeProvider>
      </PortalProvider>
    </MediaQueryProvider>
  );
}
