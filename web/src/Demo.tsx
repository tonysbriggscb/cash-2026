import { HStack, VStack } from "@coinbase/cds-web/layout";
import { Provider } from "react-redux";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import store from "./store/store";
import { useAppSelector } from "./store/hooks";
import Todolist from "./components/Todolist";
import TodoModal from "./components/TodoModal";

import { ThemeProvider } from "@coinbase/cds-web/system/ThemeProvider";
import { defaultTheme } from "@coinbase/cds-web/themes/defaultTheme";

const WrappedDemo = () => {
  const colorScheme = useAppSelector((state) => state.slice.theme);
  return (
    <ThemeProvider activeColorScheme={colorScheme} theme={defaultTheme}>
      <HStack height="100vh" width="100%">
        <Sidebar />
        <VStack overflow="clip" width="100%">
          <Navbar />
          <Todolist />
        </VStack>
      </HStack>
      <TodoModal />
    </ThemeProvider>
  );
};

export const Demo = () => (
  <Provider store={store}>
    <WrappedDemo />
  </Provider>
);
