import { useMemo } from "react";
import { Sidebar as CDSSidebar } from "@coinbase/cds-web/navigation/Sidebar";
import { SidebarItem } from "@coinbase/cds-web/navigation/SidebarItem";
import { LogoMark } from "@coinbase/cds-web/icons/LogoMark";
import { Divider, VStack } from "@coinbase/cds-web/layout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setIsTodoModalOpen, setSelectedLabel } from "../store/slice";
import { IconButton } from "@coinbase/cds-web/buttons";

function Sidebar() {
  // redux
  const todos = useAppSelector((state) => state.slice.todos);
  const selectedLabel = useAppSelector((state) => state.slice.selectedLabel);
  const dispatch = useAppDispatch();
  const uniqueLabels = useMemo(() => {
    const labels = new Set();
    todos.forEach((todo) => {
      todo.labels.forEach((label) => {
        labels.add(label);
      });
    });
    return labels;
  }, [todos]);
  return (
    <CDSSidebar
      collapsed={false}
      logo={<LogoMark />}
      renderEnd={() => (
        <IconButton
          name="add"
          accessibilityLabel="Add new todo"
          variant="primary"
          onClick={() => dispatch(setIsTodoModalOpen(true))}
          active
        />
      )}
    >
      <SidebarItem
        active={selectedLabel === null}
        title="All"
        icon="newsFeed"
        onClick={() => dispatch(setSelectedLabel(null))}
      />
      <Divider />
      <VStack>
        {Array.from(uniqueLabels).map((label) => (
          <SidebarItem
            title={label as string}
            icon="tag"
            key={`sidebar-item--${label}`}
            active={label === selectedLabel}
            onClick={() => dispatch(setSelectedLabel(label))}
            tooltipContent={label as string}
          />
        ))}
      </VStack>
    </CDSSidebar>
  );
}

export default Sidebar;
