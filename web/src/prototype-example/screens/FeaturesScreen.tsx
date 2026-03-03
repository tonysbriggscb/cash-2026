import { VStack, HStack } from "@coinbase/cds-web/layout";
import { Text } from "@coinbase/cds-web/typography/Text";
import { Button } from "@coinbase/cds-web/buttons/Button";
import { Icon } from "@coinbase/cds-web/icons/Icon";
import type { ScreenProps } from "../../proto-kit";

type ExampleScreen = "welcome" | "features" | "howto" | "testing" | "complete" | "cash";

const FeatureItem = ({ 
  icon, 
  title, 
  description,
}: { 
  icon: string; 
  title: string; 
  description: string;
}) => (
  <HStack gap={2} padding={3} paddingY={2} alignItems="flex-start">
    <Icon name={icon as any} size="m" color="fg" />
    <VStack gap={0.25} styles={{ root: { flex: 1 } }}>
      <Text font="headline" color="fg">
        {title}
      </Text>
      <Text font="body" color="fgMuted">
        {description}
      </Text>
    </VStack>
  </HStack>
);

/**
 * Features screen - Shows key features of the proto kit
 */
export const FeaturesScreen = ({ 
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
            overscrollBehavior: "none",
            paddingBottom: 80,
          },
        }}
      >
        {/* Header content */}
        <VStack gap={1} padding={3} paddingBottom={2}>
          <Text font="title1" color="fg">
            What's included
          </Text>
          <Text font="body" color="fgMuted">
            Everything you need to build great prototypes.
          </Text>
        </VStack>

        {/* Feature list */}
        <VStack gap={0}>
          <FeatureItem
            icon="phone"
            title="Device frame"
            description="Realistic iPhone frame with Dynamic Island and iOS status bar"
          />
          <FeatureItem
            icon="settings"
            title="Toolbar controls"
            description="Restart prototype, toggle dark mode, and switch between flows"
          />
          <FeatureItem
            icon="arrowsHorizontal"
            title="Screen transitions"
            description="Smooth push and pop navigation between screens"
          />
          <FeatureItem
            icon="grid"
            title="CDS components"
            description="Full access to the Coinbase Design System"
          />
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
        <Button onClick={() => onNavigate("howto")} block>
          How to add my prototype
        </Button>
      </VStack>
    </VStack>
  );
};
