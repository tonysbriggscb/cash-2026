import { VStack } from "@coinbase/cds-web/layout";
import { Text } from "@coinbase/cds-web/typography/Text";
import { Button } from "@coinbase/cds-web/buttons/Button";
import { LogoMark } from "@coinbase/cds-web/icons/LogoMark";

interface FlowDemoScreenProps {
  onSwitchToMain: () => void;
}

/**
 * Demo screen shown when alternate flow is selected
 * Explains how flows can be used in prototypes
 */
export const FlowDemoScreen = ({ onSwitchToMain }: FlowDemoScreenProps) => {
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
      {/* Main content - positioned from top to match WelcomeScreen */}
      <VStack 
        gap={3} 
        padding={3} 
        alignItems="center"
        styles={{ root: { flex: 1, paddingTop: 140, paddingBottom: 80 } }}
      >
        <LogoMark size={32} />
        
        <VStack gap={1} alignItems="center">
          <Text font="title1" color="fg" textAlign="center">
            This is a different flow
          </Text>
          <Text font="body" color="fgMuted" textAlign="center">
            Use flows to test different user journeys, A/B variants, or edge cases in your prototype.
          </Text>
        </VStack>
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
        <Button onClick={onSwitchToMain} block>
          Switch to main flow
        </Button>
      </VStack>
    </VStack>
  );
};
