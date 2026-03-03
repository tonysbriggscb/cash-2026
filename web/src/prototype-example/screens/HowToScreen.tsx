import { useState, useCallback } from "react";
import { VStack, HStack, Box } from "@coinbase/cds-web/layout";
import { Text } from "@coinbase/cds-web/typography/Text";
import { Button } from "@coinbase/cds-web/buttons/Button";
import { IconButton } from "@coinbase/cds-web/buttons/IconButton";
import { Banner } from "@coinbase/cds-web/banner/Banner";
import { SegmentedTabs } from "@coinbase/cds-web/tabs/SegmentedTabs";
import type { ScreenProps } from "../../proto-kit";

type ExampleScreen = "welcome" | "features" | "howto" | "testing" | "complete" | "cash";
type TabId = "fresh" | "existing";
type TabValue = { id: TabId; label: string };

const CLONE_COMMAND = "git clone https://github.cbhq.net/ben-webb/test-kit.git";

const tabs: TabValue[] = [
  { id: "fresh", label: "Start fresh" },
  { id: "existing", label: "Import existing" },
];

const StepItem = ({ 
  number,
  text,
}: { 
  number: number;
  text: string;
}) => (
  <HStack gap={1.5} alignItems="flex-start">
    <Text font="body" color="fgMuted" styles={{ root: { width: 20, flexShrink: 0 } }}>
      {number}.
    </Text>
    <Text font="body" color="fg" styles={{ root: { flex: 1 } }}>
      {text}
    </Text>
  </HStack>
);

const CopiedToast = ({ visible }: { visible: boolean }) => (
  <Box
    styles={{
      root: {
        position: "absolute",
        bottom: 80,
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "var(--color-bgInverse)",
        color: "var(--color-fgInverse)",
        padding: "8px 16px",
        borderRadius: 100,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease",
        pointerEvents: "none",
        zIndex: 100,
      },
    }}
  >
    <Text font="label2" color="fgInverse">
      Copied to clipboard
    </Text>
  </Box>
);

const CloneBanner = ({ onCopy, copied }: { onCopy: () => void; copied: boolean }) => {
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(CLONE_COMMAND);
    onCopy();
  }, [onCopy]);

  return (
    <Banner
      startIcon="gitHubLogo"
      variant="informational"
      styleVariant="contextual"
      borderRadius={200}
      title="Clone in Cursor or terminal"
      showDismiss={false}
    >
      <HStack gap={1} alignItems="center" justifyContent="space-between">
        <Text 
          font="label2" 
          color="fg"
          styles={{ 
            root: { 
              fontFamily: "monospace",
              wordBreak: "break-all",
              textTransform: "none",
            } 
          }}
        >
          {CLONE_COMMAND}
        </Text>
        <IconButton
          name={copied ? "checkmark" : "copy"}
          variant="secondary"
          compact
          transparent
          accessibilityLabel={copied ? "Copied" : "Copy clone command"}
          onClick={handleCopy}
        />
      </HStack>
    </Banner>
  );
};

const StartFreshContent = ({ onCopy, copied }: { onCopy: () => void; copied: boolean }) => (
  <VStack gap={2} padding={3} paddingTop={2}>
    <CloneBanner onCopy={onCopy} copied={copied} />
    
    <VStack gap={1.5}>
      <StepItem number={1} text="Paste the command above into Cursor chat or terminal" />
      <StepItem number={2} text="Open the cloned folder in Cursor" />
      <StepItem number={3} text="Ask Cursor to edit screens in src/prototype/screens/" />
      <StepItem number={4} text="Ask Cursor to run 'yarn dev' to preview" />
    </VStack>
  </VStack>
);

const ImportExistingContent = () => (
  <VStack gap={2} padding={3} paddingTop={2}>
    <Text font="body" color="fgMuted">
      Already have a CDS prototype in Cursor? Ask Cursor to add the Test Kit:
    </Text>
    <VStack gap={1.5}>
      <StepItem number={1} text="Open your existing prototype in Cursor" />
      <StepItem number={2} text="Ask Cursor to 'add the Test Kit wrapper from github.cbhq.net/ben-webb/test-kit'" />
      <StepItem number={3} text="Ask Cursor to run 'yarn dev' to preview" />
    </VStack>
    <Text font="body" color="fgMuted">
      Cursor will copy the proto-kit folder and configure it for you.
    </Text>
  </VStack>
);

/**
 * HowTo screen - Explains how to add prototypes
 */
export const HowToScreen = ({ 
  onNavigate, 
}: ScreenProps<ExampleScreen>) => {
  const [activeTab, setActiveTab] = useState<TabValue>(tabs[0]);
  const [showToast, setShowToast] = useState(false);
  
  const handleTabChange = useCallback((tab: TabValue | null) => {
    if (tab) setActiveTab(tab);
  }, []);

  const handleCopy = useCallback(() => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }, []);

  return (
    <VStack 
      gap={0} 
      styles={{ 
        root: { 
          flex: 1, 
          position: "relative", 
          overflow: "hidden",
        } 
      }}
    >
      {/* Scrollable content */}
      <VStack
        gap={0}
        styles={{
          root: {
            flex: 1,
            overflow: "auto",
            overscrollBehavior: "none",
            paddingBottom: 80,
          },
        }}
      >
        {/* Header content */}
        <VStack gap={1} padding={3} paddingBottom={2}>
          <Text font="title1" color="fg">
            Add your prototype
          </Text>
          <Text font="body" color="fgMuted">
            Choose how you'd like to get started.
          </Text>
        </VStack>

        {/* Tabs */}
        <VStack paddingX={3} paddingBottom={2}>
          <SegmentedTabs
            accessibilityLabel="Choose setup method"
            activeTab={activeTab}
            onChange={handleTabChange}
            tabs={tabs}
          />
        </VStack>

        {/* Tab content */}
        {activeTab.id === "fresh" ? (
          <StartFreshContent onCopy={handleCopy} copied={showToast} />
        ) : (
          <ImportExistingContent />
        )}
      </VStack>

      {/* Footer CTA - absolute positioned at bottom */}
      <VStack 
        padding={3} 
        background="bg"
        styles={{ 
          root: { 
            position: "absolute", 
            bottom: 0, 
            left: 0, 
            right: 0,
          } 
        }}
      >
        <Button onClick={() => onNavigate("testing")} block>
          How to test with users
        </Button>
      </VStack>

      {/* Toast */}
      <CopiedToast visible={showToast} />
    </VStack>
  );
};
