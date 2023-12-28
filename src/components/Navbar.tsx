import React, { useCallback } from "react";
import { NavigationBar } from "@cbhq/cds-web/navigation/NavigationBar";
import { NavigationTitle } from "@cbhq/cds-web/navigation/NavigationTitle";
import { Avatar } from "@cbhq/cds-web/media/Avatar";
import { HStack } from "@cbhq/cds-web/layout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Switch } from "@cbhq/cds-web/controls/Switch";
import { setTheme } from "../store/slice";
import { NavigationIcon } from "@cbhq/cds-web/icons/NavigationIcon";
import { Pressable } from "@cbhq/cds-web/system";

function Navbar() {
  // redux
  const theme = useAppSelector((state) => state.slice.theme);
  const dispatch = useAppDispatch();

  // handlers
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setTheme(e.target.checked ? "dark" : "light"));
    },
    [dispatch]
  );

  return (
    <NavigationBar
      end={
        <HStack
          alignContent="center"
          alignItems="center"
          alignSelf="center"
          gap={1}
        >
          <HStack>
            <Switch onChange={handleChange} checked={theme === "dark"}>
              {/* Dark Mode */}
              <NavigationIcon name={"moon"} />
            </Switch>
          </HStack>
          {/* <Avatar alt="Sid" name="Sid" size="xl" colorScheme="gray" /> */}
          <Pressable onPress={() => {}} backgroundColor="background">
            <NavigationIcon name={"hammer"} />
          </Pressable>
        </HStack>
      }
    >
      <NavigationTitle>TodoBase</NavigationTitle>
    </NavigationBar>
  );
}

export default Navbar;
