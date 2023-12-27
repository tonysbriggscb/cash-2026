import React, { useState } from "react";
import { Sidebar as CDSSidebar } from "@cbhq/cds-web/navigation/Sidebar";
import { SidebarItem } from "@cbhq/cds-web/navigation/SidebarItem";
import { LogoMark } from "@cbhq/cds-web/icons/LogoMark";
import { useToggler } from "@cbhq/cds-common";
import { Divider, VStack } from "@cbhq/cds-web/layout";
import { NavIconName } from "@cbhq/cds-icons/index";

function Sidebar() {
  const [isCollapsed, toggleCollapsed] = useToggler(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sidebarItems = [
    { title: "All", icon: "newsfeed" },
    { title: "Important", icon: "trading" },
  ];
  const handleItemPress = (index: number) => {
    setActiveIndex(index);
  };
  return (
    <CDSSidebar collapsed={isCollapsed} logo={<LogoMark />}>
      <VStack gap={2}>
        <VStack>
          {sidebarItems.map((props, index) => (
            <SidebarItem
              key={`sidebar-item--${props.title}`}
              active={index === activeIndex}
              onPress={() => handleItemPress(index)}
              tooltipContent={props.title}
              {...props}
              icon={props.icon as NavIconName}
            />
          ))}
        </VStack>
        {/* <Divider />
        <VStack>
          {sidebarItems.map((props, index) => (
            <SidebarItem
              key={`sidebar-item--${props.title}`}
              active={index === activeIndex}
              onPress={() => handleItemPress(index)}
              tooltipContent={props.title}
              {...props}
              icon={props.icon as NavIconName}
            />
          ))}
        </VStack> */}
      </VStack>
    </CDSSidebar>
  );
}

export default Sidebar;
