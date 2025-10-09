import { Divider, HStack, VStack } from "@coinbase/cds-web/layout";
import  { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { ListCell } from "@coinbase/cds-web/cells/ListCell";
import { Chip } from "@coinbase/cds-web/chips/Chip";
import { Checkbox } from "@coinbase/cds-web/controls/Checkbox";
import { Pressable } from "@coinbase/cds-web/system";
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
    return [...filteredTodos].sort((a, b) =>
      a.completed === b.completed ? 0 : a.completed ? 1 : -1
    );
  }, [filteredTodos]);

  return (
    <VStack background={"bg"} height={"100vh"}>
      {sortedTodos?.map((todo) => (
        <VStack key={todo.id}>
          <ListCell
            title={todo.text}
            description={
              <HStack paddingTop={1} gap={1}>
                {[...todo.labels].sort().map((label) => (
                  <Pressable
                    key={label}
                    background="transparent"
                    onClick={() => dispatch(setSelectedLabel(label))}
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
