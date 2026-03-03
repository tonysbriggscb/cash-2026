import { VStack } from "@coinbase/cds-web/layout";
import { Text } from "@coinbase/cds-web/typography/Text";
import { Button } from "@coinbase/cds-web/buttons/Button";
import { SpotSquare } from "@coinbase/cds-web/illustrations/SpotSquare";
import type { ScreenProps } from "../../proto-kit";

type ExampleScreen = "welcome" | "features" | "howto" | "testing" | "complete" | "cash";

/**
 * Complete screen - Final screen of the example prototype
 */
export const CompleteScreen = ({ 
  onNavigate,
}: ScreenProps<ExampleScreen>) => {
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
      {/* Main content - centered */}
      <VStack 
        gap={3} 
        padding={3} 
        alignItems="center" 
        justifyContent="center"
        styles={{ root: { flex: 1, paddingBottom: 80 } }}
      >
        <SpotSquare name="checkmark" />
        
        <VStack gap={1} alignItems="center">
          <Text font="title1" color="fg" textAlign="center">
            You're all set!
          </Text>
          <Text font="body" color="fgMuted" textAlign="center">
            Start building your prototype by editing the screens folder.
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
        <Button onClick={() => onNavigate("welcome")} block>
          Start over
        </Button>
      </VStack>
    </VStack>
  );
};
