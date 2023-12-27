import React from "react";
import { NavigationBar } from "@cbhq/cds-web/navigation/NavigationBar";
import { NavigationTitle } from "@cbhq/cds-web/navigation/NavigationTitle";
import { Avatar } from "@cbhq/cds-web/media/Avatar";
import { HStack } from "@cbhq/cds-web/layout";

function Navbar() {
  return (
    <NavigationBar
      end={
        <HStack>
          <Avatar alt="Sid" name="Sid" size="xl" colorScheme="gray" />
        </HStack>
      }
    >
      <NavigationTitle>TodoBase</NavigationTitle>
    </NavigationBar>
  );
}

export default Navbar;
