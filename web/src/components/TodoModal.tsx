import { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "@coinbase/cds-web/overlays/modal/Modal";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Button } from "@coinbase/cds-web/buttons";
import { ModalBody } from "@coinbase/cds-web/overlays/modal/ModalBody";
import { ModalFooter } from "@coinbase/cds-web/overlays/modal/ModalFooter";
import { addTodo, setIsTodoModalOpen } from "../store/slice";
import { HStack, VStack } from "@coinbase/cds-web/layout";
import { TextInput } from "@coinbase/cds-web/controls/TextInput";
import { InputChip } from "@coinbase/cds-web/chips/InputChip";
import { v4 as uuidv4 } from "uuid";

function TodoModal() {
  // refs
  const todoRef = useRef<HTMLInputElement>(null);
  const labelRef = useRef<HTMLInputElement>(null);

  // state
  const [formState, setFormState] = useState<{
    todo: string;
    label: string;
    labels: string[];
  }>({
    todo: "",
    label: "",
    labels: [],
  });

  // redux
  const isTodoModalOpen = useAppSelector(
    (state) => state.slice.isTodoModalOpen
  );
  const dispatch = useAppDispatch();

  // handlers
  const handleModelClose = useCallback(() => {
    dispatch(setIsTodoModalOpen(false));
  }, []);

  const handleSave = useCallback(() => {
    console.log("save");
    dispatch(
      addTodo({
        id: uuidv4(),
        text: formState.todo,
        completed: false,
        labels: formState.labels,
      })
    );
    dispatch(setIsTodoModalOpen(false));
  }, [formState]);

  // effects
  useEffect(() => {
    if (!isTodoModalOpen) return;
    todoRef.current?.focus();
  }, [isTodoModalOpen]);

  useEffect(() => {
    if (!isTodoModalOpen) return;
    setFormState({
      todo: "",
      label: "",
      labels: [],
    }); // reset form state
  }, [isTodoModalOpen]);

  return (
    <Modal visible={isTodoModalOpen} onRequestClose={handleModelClose}>
      <ModalBody>
        <form onSubmit={handleSave} action={undefined}>
          <VStack gap={1}>
            <TextInput
              label="Todo"
              placeholder="Enter your todo here..."
              value={formState.todo}
              onChange={(e) => {
                setFormState({ ...formState, todo: e.target.value });
              }}
              ref={todoRef}
            />
            <TextInput
              ref={labelRef}
              label="Labels"
              placeholder="work, personal, etc."
              value={formState.label}
              onChange={(e) => {
                setFormState({ ...formState, label: e.target.value });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent form submission
                  setFormState({
                    ...formState,
                    labels: [...formState.labels, formState.label],
                    label: "",
                  });
                  labelRef.current?.focus();
                }
              }}
            />
            <HStack gap={1}>
              {formState.labels.map((label) => (
                <InputChip
                  key={label}
                  onClick={() =>
                    setFormState({
                      ...formState,
                      labels: formState.labels.filter((l) => l !== label),
                    })
                  }
                  value={label}
                />
              ))}
            </HStack>
          </VStack>
        </form>
      </ModalBody>
      <ModalFooter
        primaryAction={<Button onClick={handleSave}>Save</Button>}
        secondaryAction={
          <Button variant="secondary" onClick={handleModelClose}>
            Cancel
          </Button>
        }
      />
    </Modal>
  );
}

export default TodoModal;
