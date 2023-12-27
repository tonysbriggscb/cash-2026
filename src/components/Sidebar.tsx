import React, { useMemo, useState } from "react";
import { Sidebar as CDSSidebar } from "@cbhq/cds-web/navigation/Sidebar";
import { SidebarItem } from "@cbhq/cds-web/navigation/SidebarItem";
import { LogoMark } from "@cbhq/cds-web/icons/LogoMark";
import { useToggler } from "@cbhq/cds-common";
import { Divider, VStack } from "@cbhq/cds-web/layout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSelectedLabel } from "../store/slice";
import { IconButton } from "@cbhq/cds-web/buttons";

function Sidebar() {
  // redux
  const todos = useAppSelector((state) => state.slice.todos);
  const selectedLabel = useAppSelector((state) => state.slice.selectedLabel);
  const dispatch = useAppDispatch();

  const [isCollapsed, toggleCollapsed] = useToggler(false);
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
      collapsed={isCollapsed}
      logo={<LogoMark />}
      renderEnd={(isCollapsed) => (
        <IconButton
          name="add"
          accessibilityLabel="Add new todo"
          variant="primary"
          onPress={console.log}
        />
      )}
    >
      <SidebarItem
        active={selectedLabel === null}
        title="All"
        icon="newsfeed"
        onPress={() => dispatch(setSelectedLabel(null))}
      />
      <Divider spacingVertical={1} />
      <VStack>
        {Array.from(uniqueLabels).map((label) => (
          <SidebarItem
            title={label as string}
            icon="pay"
            key={`sidebar-item--${label}`}
            active={label === selectedLabel}
            onPress={() => dispatch(setSelectedLabel(label))}
            tooltipContent={label as string}
          />
        ))}
      </VStack>
    </CDSSidebar>
  );
}

export default Sidebar;
