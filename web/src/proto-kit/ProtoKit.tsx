import { useState, useEffect, useMemo, useRef } from "react";
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
} from "./types";
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
  totalSteps = 0,
  getStepForScreen,
  renderHeader: customRenderHeader,
  renderAlternateFlow,
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
  const screenContentRef = useRef<HTMLDivElement>(null);
  
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
    restart,
    isAtStart,
    getTransform,
  } = useScreenNavigator({
    screens,
    screenOrder,
    initialScreen,
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
  const restartPrototype = () => {
    restart();
    setActiveTray(null);
    setWorkInProgressModalVisible(false);
    setToastHiding(false);
    setShowToast(true);
  };

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
  }, [isAtStart, isMobile, addNote, setScopeForNote, currentScreen]);

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

  // Render header based on config
  const renderHeader = (screen: TScreen) => {
    const config = getHeaderConfig(screen);
    
    if (customRenderHeader) {
      return customRenderHeader(screen, config);
    }

    const step = getCurrentStep(screen);
    const isInvisible = config.invisible === true;

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 16px",
          minHeight: 44,
          opacity: isInvisible ? 0 : 1,
          pointerEvents: isInvisible ? "none" : "auto",
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
              onClick={() => {
                const currentIndex = screenOrder.indexOf(screen);
                if (currentIndex > 0) {
                  navigate(screenOrder[currentIndex - 1]);
                }
              }}
            />
          )}
        </div>

        {/* Center */}
        <div style={{ flex: 1, padding: "0 8px" }}>
          {config.center === "stepper" && totalSteps > 0 && (
            <ProgressStepper currentStep={step} totalSteps={totalSteps} />
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
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Fixed Header - iOS Status Bar + App Header */}
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

        {/* App Header */}
        <div key={`header-${activeScreen}`}>{renderHeader(activeScreen)}</div>
      </div>

      {/* Animated screen container */}
      <ScreenNavigator
        screens={screens}
        currentScreen={currentScreen}
        displayedScreen={displayedScreen}
        animationPhase={animationPhase}
        getTransform={getTransform}
        navigate={navigate}
        onShowWorkInProgress={showWorkInProgress}
        onOpenTray={openTray}
      />

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
            onNavigate={(screen) => navigate(screen as TScreen)}
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
