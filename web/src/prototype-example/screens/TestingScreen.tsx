import { VStack, HStack } from "@coinbase/cds-web/layout";
import { Text } from "@coinbase/cds-web/typography/Text";
import { Button } from "@coinbase/cds-web/buttons/Button";
import type { ScreenProps } from "../../proto-kit";

type ExampleScreen = "welcome" | "features" | "howto" | "testing" | "complete";

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

/**
 * Testing screen - Explains how to deploy and test with users
 */
export const TestingScreen = ({ 
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
      {/* Scrollable content */}
      <VStack
        gap={0}
        styles={{
          root: {
            flex: 1,
            overflow: "auto",
            WebkitOverflowScrolling: "touch",
            paddingBottom: 80,
          },
        }}
      >
        {/* Header content */}
        <VStack gap={1} padding={3} paddingBottom={2}>
          <Text font="title1" color="fg">
            Test with users
          </Text>
          <Text font="body" color="fgMuted">
            Deploy your prototype to share with testers.
          </Text>
        </VStack>

        {/* Deploy instructions */}
        <VStack gap={2} padding={3} paddingTop={2}>
          <VStack gap={1.5}>
            <StepItem number={1} text="Ask Cursor to run 'vercel' in the terminal" />
            <StepItem number={2} text="Follow the prompts to link your Vercel account" />
            <StepItem number={3} text="Copy the preview URL and share with testers" />
          </VStack>

          <Text font="body" color="fgMuted">
            Each time you deploy, you'll get a unique URL. For a permanent link, ask Cursor to run 'vercel --prod'.
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
        <Button onClick={() => onNavigate("complete")} block>
          Got it
        </Button>
      </VStack>
    </VStack>
  );
};
