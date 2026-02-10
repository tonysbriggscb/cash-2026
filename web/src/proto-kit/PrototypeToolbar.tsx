import { useState, useEffect, useRef } from "react";
import { useTheme } from "@coinbase/cds-web/hooks/useTheme";
import { HStack, VStack } from "@coinbase/cds-web/layout";
import { IconButton } from "@coinbase/cds-web/buttons/IconButton";
import { SelectChip } from "@coinbase/cds-web/chips/SelectChip";
import { SelectOption } from "@coinbase/cds-web/controls/SelectOption";
import { Collapsible } from "@coinbase/cds-web/collapsible/Collapsible";
import type { FlowConfig } from "./types";

interface PrototypeToolbarProps {
  /** Callback when restart button is clicked */
  onRestart: () => void;
  /** Current flow ID */
  currentFlow: string;
  /** Callback when flow is changed */
  onFlowChange: (flow: string) => void;
  /** Whether prototype is at the start (disables restart) */
  isAtStart: boolean;
  /** Whether dark mode is active */
  isDarkMode: boolean;
  /** Callback to toggle dark mode */
  onToggleDarkMode: () => void;
  /** Available flows to select from */
  flows?: FlowConfig[];
  /** Entrance animation styles */
  entranceStyles?: React.CSSProperties;
}

type TooltipType = "toggle" | "restart" | "darkmode" | null;

interface TooltipPosition {
  left: number;
  top: number;
  width: number;
}

/**
 * Tooltip component rendered at fixed position
 */
const Tooltip = ({ 
  content, 
  shortcut,
  position,
  visible,
}: { 
  content: string; 
  shortcut?: string;
  position: TooltipPosition;
  visible: boolean;
}) => {
  if (!visible) return null;
  
  return (
    <div
      className="toolbar-tooltip-animate"
      style={{
        position: "fixed",
        left: position.left,
        top: position.top,
        width: position.width,
        pointerEvents: "none",
        zIndex: 10000,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--color-bgInverse)",
          color: "var(--color-fgInverse)",
          padding: "6px 12px",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 500,
          display: "flex",
          gap: 8,
          alignItems: "center",
          whiteSpace: "nowrap",
        }}
      >
        <span>{content}</span>
        {shortcut && (
          <span
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 11,
            }}
          >
            {shortcut}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Prototype Toolbar component
 * Provides controls for restart, dark mode toggle, and flow selection
 */
export const PrototypeToolbar = ({
  onRestart,
  currentFlow,
  onFlowChange,
  isAtStart,
  isDarkMode,
  onToggleDarkMode,
  flows = [{ id: "main", name: "Main flow", disabled: false }],
  entranceStyles,
}: PrototypeToolbarProps) => {
  const theme = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<TooltipType>(null);
  const [tooltipVisible, setTooltipVisible] = useState<TooltipType>(null);
  const [isRestartAnimating, setIsRestartAnimating] = useState(false);
  
  // Refs for button positions
  const toggleRef = useRef<HTMLDivElement>(null);
  const restartRef = useRef<HTMLDivElement>(null);
  const darkmodeRef = useRef<HTMLDivElement>(null);
  
  const [tooltipPositions, setTooltipPositions] = useState<Record<TooltipType, TooltipPosition>>({
    toggle: { left: 0, top: 0, width: 0 },
    restart: { left: 0, top: 0, width: 0 },
    darkmode: { left: 0, top: 0, width: 0 },
    null: { left: 0, top: 0, width: 0 },
  });

  // Update tooltip positions when hovered
  useEffect(() => {
    if (hoveredButton) {
      const ref = 
        hoveredButton === "toggle" ? toggleRef :
        hoveredButton === "restart" ? restartRef :
        hoveredButton === "darkmode" ? darkmodeRef : null;
      
      if (ref?.current) {
        const rect = ref.current.getBoundingClientRect();
        setTooltipPositions(prev => ({
          ...prev,
          [hoveredButton]: {
            left: rect.left,
            top: rect.bottom + 8,
            width: rect.width,
          }
        }));
      }
    }
  }, [hoveredButton]);

  // Delayed tooltip visibility for smooth UX
  useEffect(() => {
    if (hoveredButton) {
      const timer = setTimeout(() => setTooltipVisible(hoveredButton), 400);
      return () => clearTimeout(timer);
    } else {
      setTooltipVisible(null);
    }
  }, [hoveredButton]);

  // ESC key to collapse toolbar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  return (
    <>
      {/* Tooltips rendered outside the toolbar */}
      <Tooltip
        content="Hide"
        shortcut="ESC"
        position={tooltipPositions.toggle}
        visible={tooltipVisible === "toggle" && isExpanded}
      />
      <Tooltip
        content="Restart proto"
        shortcut="R"
        position={tooltipPositions.restart}
        visible={tooltipVisible === "restart" && !isAtStart}
      />
      <Tooltip
        content={isDarkMode ? "Light mode" : "Dark mode"}
        position={tooltipPositions.darkmode}
        visible={tooltipVisible === "darkmode"}
      />

      <div
        className="toolbar-container"
        style={{
          position: "fixed",
          top: 32,
          left: 32,
          zIndex: 9999,
          ...entranceStyles,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isExpanded ? 2 : 0,
            padding: 4,
            backgroundColor: "var(--color-bg)",
            borderRadius: 100,
            border: "1px solid var(--color-bgLine)",
            boxShadow: isDarkMode
              ? "0px 8px 12px rgba(0, 0, 0, 0.3)"
              : "0px 8px 12px rgba(91, 97, 110, 0.12)",
            transition: "gap 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Toggle button - menu when collapsed, close when expanded */}
          <div
            ref={toggleRef}
            style={{ position: "relative", display: "inline-flex" }}
            onMouseEnter={() => setHoveredButton("toggle")}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <IconButton
              name={isExpanded ? "close" : "statusDot"}
              variant="secondary"
              compact
              transparent
              accessibilityLabel={isExpanded ? "Hide toolbar" : "Expand toolbar"}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          </div>

          {/* Expandable buttons container */}
          <Collapsible collapsed={!isExpanded} direction="horizontal">
            <HStack alignItems="center" gap={0.25}>
              {/* Restart button */}
              <div
                ref={restartRef}
                style={{
                  position: "relative",
                  display: "inline-flex",
                  opacity: isAtStart ? 0.4 : 1,
                }}
                onMouseEnter={() => !isAtStart && setHoveredButton("restart")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <div
                  className={isRestartAnimating ? "restart-icon-animate" : ""}
                  onAnimationEnd={() => setIsRestartAnimating(false)}
                >
                  <IconButton
                    name="undo"
                    variant="secondary"
                    compact
                    transparent
                    disabled={isAtStart}
                    accessibilityLabel="Restart prototype"
                    onClick={
                      isAtStart
                        ? undefined
                        : () => {
                            setIsRestartAnimating(true);
                            onRestart();
                          }
                    }
                  />
                </div>
              </div>

              {/* Dark mode toggle button */}
              <div
                ref={darkmodeRef}
                style={{ position: "relative", display: "inline-flex" }}
                onMouseEnter={() => setHoveredButton("darkmode")}
                onMouseLeave={() => setHoveredButton(null)}
              >
                <IconButton
                  name={isDarkMode ? "moon" : "light"}
                  variant="secondary"
                  compact
                  transparent
                  accessibilityLabel={
                    isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                  }
                  onClick={onToggleDarkMode}
                />
              </div>

              {/* Flows SelectChip */}
              {flows.length > 1 && (
                <SelectChip
                  value={currentFlow}
                  valueLabel={flows.find((f) => f.id === currentFlow)?.name}
                  onChange={(newValue) => {
                    const flow = flows.find((f) => f.id === newValue);
                    if (flow && !flow.disabled) {
                      onFlowChange(newValue);
                    }
                  }}
                  transparentWhileInactive
                  paddingX={0}
                  font="label1"
                  height={40}
                  background="bgSecondary"
                  minWidth={120}
                  content={
                    <VStack>
                      {flows.map((flow) => (
                        <SelectOption
                          key={flow.id}
                          title={flow.name}
                          value={flow.id}
                          disabled={flow.disabled}
                          font="label1"
                        />
                      ))}
                    </VStack>
                  }
                />
              )}
            </HStack>
          </Collapsible>
        </div>
      </div>
    </>
  );
};
