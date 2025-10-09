import React, { useCallback } from "react";
import { NavigationBar } from "@coinbase/cds-web/navigation/NavigationBar";
import { NavigationTitle } from "@coinbase/cds-web/navigation/NavigationTitle";
import { HStack } from "@coinbase/cds-web/layout";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { Switch } from "@coinbase/cds-web/controls/Switch";
import { setTheme } from "../store/slice";
import { Icon } from "@coinbase/cds-web/icons/Icon";

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
              <Icon name={"moon"} color="fg" />
            </Switch>
          </HStack>
        </HStack>
      }
    >
      <NavigationTitle>TodoBase</NavigationTitle>
    </NavigationBar>
  );
}

export default Navbar;
