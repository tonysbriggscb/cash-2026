import { useFonts as useFontsExpo } from 'expo-font';

const localFonts = {
  CoinbaseIcons: require('@coinbase/cds-icons/esm/fonts/native/CoinbaseIcons.ttf'),
};

const coinbaseFonts = {
  'CoinbaseSans-Regular': require('../assets/fonts/CoinbaseSans-Regular.otf'),
  'CoinbaseSans-Medium': require('../assets/fonts/CoinbaseSans-Medium.otf'),
  'CoinbaseDisplay-Regular': require('../assets/fonts/CoinbaseDisplay-Regular.otf'),
  'CoinbaseDisplay-Medium': require('../assets/fonts/CoinbaseDisplay-Medium.otf'),
  'CoinbaseMono-Regular': require('../assets/fonts/CoinbaseMono-Regular.otf'),
  'CoinbaseMono-Medium': require('../assets/fonts/CoinbaseMono-Medium.otf'),
  'CoinbaseText-Regular': require('../assets/fonts/CoinbaseText-Regular.otf'),
  'CoinbaseText-Medium': require('../assets/fonts/CoinbaseText-Medium.otf'),
};

export function useFonts() {
  const [loadedLocal, errorLocal] = useFontsExpo(localFonts);
  const [loadedCoinbase, errorCoinbase] = useFontsExpo(coinbaseFonts);

  return [
    loadedLocal && loadedCoinbase,
    errorLocal || errorCoinbase,
  ];
}
