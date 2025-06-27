import { PortalProvider } from "@cbhq/cds-web/overlays/PortalProvider";

import { HStack, VStack } from "@cbhq/cds-web/layout";

import "@cbhq/cds-web/globalStyles";

// Minimal theme configuration for v8 alpha.8
import { Provider } from "react-redux";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import store from "./store/store";
import { useAppSelector } from "./store/hooks";
import Todolist from "./components/Todolist";
import TodoModal from "./components/TodoModal";

import { ThemeProvider } from "@cbhq/cds-web/system/ThemeProvider";
import { coinbaseTheme } from "@cbhq/cds-web/themes/coinbaseTheme";

export const WrappedApp = () => {
  const colorScheme = useAppSelector((state) => state.slice.theme);
  return (
    <ThemeProvider activeColorScheme={colorScheme} theme={coinbaseTheme}>
      <HStack height={"100vh"} width={"100%"}>
        <Sidebar />
        <VStack overflow="clip" width={"100%"}>
          <Navbar />
          <Todolist />
        </VStack>
      </HStack>
      <TodoModal />
    </ThemeProvider>
  );
};

export const App = () => (
  <Provider store={store}>
    <PortalProvider>
      <WrappedApp />
    </PortalProvider>
  </Provider>
);
