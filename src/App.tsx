import { PortalProvider } from "@cbhq/cds-web/overlays/PortalProvider";
import {
  DevicePreferencesProvider,
  FeatureFlagProvider,
} from "@cbhq/cds-web/system";
import { ThemeProvider } from "@cbhq/cds-web/system/ThemeProvider";
import { HStack, VStack } from "@cbhq/cds-web/layout";

import "@cbhq/cds-web/globalStyles";
import { Provider } from "react-redux";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import store from "./store/store";
import { useAppSelector } from "./store/hooks";
import Todolist from "./components/Todolist";

export const WrappedApp = () => {
  const count = useAppSelector((state) => state.slice.theme);
  return (
    <ThemeProvider scale="xLarge" spectrum="light">
      <HStack height={"100vh"} width={"100%"}>
        <Sidebar />
        <VStack overflow="clip" width={"100%"}>
          <Navbar />
          <Todolist />
        </VStack>
      </HStack>
    </ThemeProvider>
  );
};

export const App = () => (
  <Provider store={store}>
    <FeatureFlagProvider frontier>
      <DevicePreferencesProvider>
        <PortalProvider>
          <WrappedApp />
        </PortalProvider>
      </DevicePreferencesProvider>
    </FeatureFlagProvider>
  </Provider>
);
