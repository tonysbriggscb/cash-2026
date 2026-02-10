import { VStack } from "@coinbase/cds-web/layout";
import { Text } from "@coinbase/cds-web/typography/Text";
import { Button } from "@coinbase/cds-web/buttons/Button";
import { SpotSquare } from "@coinbase/cds-web/illustrations/SpotSquare";
import { Modal } from "@coinbase/cds-web/overlays/modal/Modal";
import { ModalHeader } from "@coinbase/cds-web/overlays/modal/ModalHeader";
import { ModalBody } from "@coinbase/cds-web/overlays/modal/ModalBody";
import { ModalFooter } from "@coinbase/cds-web/overlays/modal/ModalFooter";

interface WorkInProgressModalProps {
  visible: boolean;
  onClose: () => void;
  /** Custom title (default: "Still working on it") */
  title?: string;
  /** Custom message (default: "This isn't available in the prototype yet.") */
  message?: string;
  /** Custom button text (default: "Got it") */
  buttonText?: string;
}

/**
 * Modal shown when users interact with unbuilt prototype features
 * Provides a consistent way to communicate work-in-progress state
 */
export const WorkInProgressModal = ({
  visible,
  onClose,
  title = "Still working on it",
  message = "This isn't available in the prototype yet.",
  buttonText = "Got it",
}: WorkInProgressModalProps) => {
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      hideDividers
      maxWidth={400}
    >
      <ModalHeader title="" closeAccessibilityLabel="Close" />
      <ModalBody>
        <VStack gap={3} alignItems="center" paddingY={2}>
          <SpotSquare name="frameEmpty" />
          <VStack gap={1} alignItems="center">
            <Text font="title2" color="fg" textAlign="center">
              {title}
            </Text>
            <Text font="body" color="fgMuted" textAlign="center">
              {message}
            </Text>
          </VStack>
        </VStack>
      </ModalBody>
      <ModalFooter
        justifyContent="center"
        primaryAction={<Button onClick={onClose}>{buttonText}</Button>}
      />
    </Modal>
  );
};
