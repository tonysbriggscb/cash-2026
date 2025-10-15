import { Button } from "@coinbase/cds-mobile/buttons";
import { VStack } from "@coinbase/cds-mobile/layout";
import { Text } from "@coinbase/cds-mobile/typography/Text";

export const Demo = () => (
  <VStack gap={1} justifyContent="center" alignItems="flex-start" height="100%" padding={2}>
    <Text font="headline">CDS Mobile Integration</Text>
    <Text font="label1">Test out mobile CDS components here!</Text>
    <Button startIcon="arrowRight" onPress={() => console.log("Primary button pressed!")}>
      Primary Button
    </Button>
    <Button
      startIcon="arrowLeft"
      variant="secondary"
      onPress={() => console.log("Secondary button pressed!")}
    >
      Secondary Button
    </Button>
  </VStack>
);
