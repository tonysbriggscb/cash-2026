import { useState, useCallback, useEffect, useRef } from "react";
import { VStack, HStack } from "@coinbase/cds-web/layout";
import { Text } from "@coinbase/cds-web/typography/Text";
import { Button } from "@coinbase/cds-web/buttons/Button";
import { Switch } from "@coinbase/cds-web/controls/Switch";
import { generateTesterUrl } from "./settings";

interface SettingsPanelProps {
  visible: boolean;
  onClose: () => void;
  /** Position for the panel (fixed positioning) */
  position?: { top: number; left: number };
  /** Current flow ID to include in tester URL */
  currentFlow?: string;
  /** Whether tap hints are currently enabled (live state) */
  hintsEnabled?: boolean;
  /** Callback to toggle tap hints on/off */
  onToggleHints?: () => void;
}

/**
 * Settings row component
 */
const SettingRow = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <HStack
    justifyContent="space-between"
    alignItems="center"
    paddingX={3}
    paddingY={1}
  >
    <Text font="label1" color="fg">
      {label}
    </Text>
    <Switch
      checked={checked}
      onChange={onChange}
      accessibilityLabel={label}
    />
  </HStack>
);

/**
 * Settings panel for configuring tester URL options
 */
export const SettingsPanel = ({ visible, onClose, position, currentFlow, hintsEnabled = false, onToggleHints }: SettingsPanelProps) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [showModals, setShowModals] = useState(false);
  const [skipSplash, setSkipSplash] = useState(true);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleCopyLink = useCallback(() => {
    const url = generateTesterUrl({
      showToolbar,
      showModals,
      skipSplash,
      showHints: hintsEnabled,
      flow: currentFlow,
    });
    
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback: silently fail if clipboard is unavailable
    });
  }, [showToolbar, showModals, skipSplash, hintsEnabled, currentFlow]);

  // Click outside detection
  useEffect(() => {
    if (!visible) return;

    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside the panel
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        // Don't close if clicking on the settings button itself (it has its own toggle)
        const target = event.target as HTMLElement;
        if (target.closest('[aria-label="Tester settings"]')) {
          return;
        }
        onClose();
      }
    };

    // Add listener with a small delay to avoid immediate close
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 10);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
      <div
        ref={panelRef}
        className="settings-panel-animate"
        style={{
          position: "fixed",
          top: position?.top ?? 80,
          left: position?.left ?? 32,
          backgroundColor: "var(--color-bg)",
          borderRadius: 16,
          border: "1px solid var(--color-bgLine)",
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.12)",
          width: 280,
          overflow: "hidden",
          zIndex: 10001,
        }}
      >
        {/* Header */}
        <VStack paddingX={3} paddingTop={2} paddingBottom={1}>
          <Text font="caption" color="fgMuted">
            TESTER SETTINGS
          </Text>
        </VStack>

        {/* Settings list */}
        <VStack gap={0}>
          <SettingRow
            label="Prototype toolbar"
            checked={showToolbar}
            onChange={() => setShowToolbar(!showToolbar)}
          />
          <SettingRow
            label="Placeholder modals"
            checked={showModals}
            onChange={() => setShowModals(!showModals)}
          />
          <SettingRow
            label="Skip splash screen"
            checked={skipSplash}
            onChange={() => setSkipSplash(!skipSplash)}
          />
          <SettingRow
            label="Tap hints"
            checked={hintsEnabled}
            onChange={() => onToggleHints?.()}
          />
        </VStack>

        {/* Copy button */}
        <VStack padding={2}>
          <Button
            onClick={handleCopyLink}
            block
            compact
          >
            {copied ? "Link copied!" : "Copy tester link"}
          </Button>
        </VStack>
      </div>
  );
};
