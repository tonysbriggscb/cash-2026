import { Button } from "@cbhq/cds-mobile/buttons";
import { VStack } from "@cbhq/cds-mobile/layout";
import { Text } from "@cbhq/cds-mobile/typography/Text";

export const Demo = () => (
  <VStack gap={1} justifyContent="center" height="100%" padding={2}>
    <Text font="headline">
      CDS Mobile Integration
    </Text>
    <Text font="label1">
      Test out mobile CDS components here!
    </Text>
    <Button onPress={() => console.log("Primary button pressed!")}>
      Primary Button
    </Button>
    <Button
      variant="secondary"
      onPress={() => console.log("Secondary button pressed!")}
    >
      Secondary Button
    </Button>
  </VStack>
);
