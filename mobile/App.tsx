import React, { memo, useState } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import type { ColorScheme } from '@coinbase/cds-common/core/theme';
import { useTheme } from '@coinbase/cds-mobile/hooks/useTheme';
import { PortalProvider } from '@coinbase/cds-mobile/overlays/PortalProvider';
import { StatusBar } from '@coinbase/cds-mobile/system/StatusBar';
import { ThemeProvider } from '@coinbase/cds-mobile/system/ThemeProvider';
import { coinbaseTheme } from '@coinbase/cds-mobile/themes/coinbaseTheme';
import * as SplashScreen from 'expo-splash-screen';

import { useFonts } from './hooks/useFonts';
import { BlankScreen } from './BlankScreen';

// This code allows the use of toLocaleString() on Android
if (Platform.OS === 'android') {
  require('intl');
  require('intl/locale-data/jsonp/en-US');
}

const CdsSafeAreaProvider: React.FC<React.PropsWithChildren<unknown>> = memo(({ children }) => {
  const theme = useTheme();
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: theme.color.bg }}>
      {children}
    </SafeAreaProvider>
  );
});

const App = memo(() => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const [fontsLoaded] = useFonts();

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider activeColorScheme={colorScheme} theme={coinbaseTheme}>
      <CdsSafeAreaProvider>
        <PortalProvider>
          <StatusBar />
          <BlankScreen />
        </PortalProvider>
      </CdsSafeAreaProvider>
    </ThemeProvider>
  );
});

export default App;