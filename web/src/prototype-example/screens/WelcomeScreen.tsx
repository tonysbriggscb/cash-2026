import { VStack } from "@coinbase/cds-web/layout";
import { Text } from "@coinbase/cds-web/typography/Text";
import { Button } from "@coinbase/cds-web/buttons/Button";
import { LogoMark } from "@coinbase/cds-web/icons/LogoMark";
import type { ScreenProps } from "../../proto-kit";

type ExampleScreen = "welcome" | "features" | "howto" | "testing" | "complete";

/**
 * Welcome screen - First screen of the example prototype
 */
export const WelcomeScreen = ({ 
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
      {/* Main content - positioned from top */}
      <VStack 
        gap={3} 
        padding={3} 
        alignItems="center"
        styles={{ root: { flex: 1, paddingTop: 140, paddingBottom: 80 } }}
      >
        <LogoMark size={32} />
        
        <VStack gap={1} alignItems="center">
          <Text font="title1" color="fg" textAlign="center">
            Welcome to Test Kit
          </Text>
          <Text font="body" color="fgMuted" textAlign="center">
            Build interactive CDS prototypes and test with your users.
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
        <Button onClick={() => onNavigate("features")} block>
          What's included
        </Button>
      </VStack>
    </VStack>
  );
};
