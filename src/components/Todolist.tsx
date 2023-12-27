import { Divider, HStack, VStack } from "@cbhq/cds-web/layout";
import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { ListCell } from "@cbhq/cds-web/cells/ListCell";
import { Chip } from "@cbhq/cds-web/chips/Chip";
import { useToggler } from "@cbhq/cds-common";
import { Checkbox } from "@cbhq/cds-web/controls/Checkbox";
import { Pressable } from "@cbhq/cds-web/system";
import { setSelectedLabel, toggleTodoComplete } from "../store/slice";

function Todolist() {
  // redux
  const todos = useAppSelector((state) => state.slice.todos);
  const selectedLabel = useAppSelector((state) => state.slice.selectedLabel);
  const dispatch = useAppDispatch();

  // render
  const filteredTodos = useMemo(() => {
    if (!selectedLabel) {
      return todos;
    }
    return todos.filter((todo) => todo.labels.includes(selectedLabel));
  }, [todos, selectedLabel]);

  const sortedTodos = useMemo(() => {
    return [...filteredTodos].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
  }, [filteredTodos]);

  const [isChecked, { toggle }] = useToggler();
  return (
    <VStack>
      {sortedTodos?.map((todo) => (
        <VStack>
          <ListCell
            title={todo.text}
            description={
              <HStack spacingTop={1} gap={1}>
                {[...todo.labels].sort().map((label) => (
                  <Pressable
                    backgroundColor="transparent"
                    onPress={() => dispatch(setSelectedLabel(label))}
                  >
                    <Chip>{label}</Chip>
                  </Pressable>
                ))}
              </HStack>
            }
            action={
              <Checkbox
                value="hyped"
                onChange={() => dispatch(toggleTodoComplete(todo.id))}
                checked={todo.completed}
              />
            }
          />
          <Divider />
        </VStack>
      ))}
    </VStack>
  );
}

export default Todolist;
