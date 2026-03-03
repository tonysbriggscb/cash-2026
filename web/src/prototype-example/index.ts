/**
 * Example Prototype Configuration
 * 
 * This shows how to set up screens for the Proto Kit.
 * Replace these screens with your own prototype content.
 */

import type { ScreenConfig, FlowConfig, BottomTabConfig, TrayConfig } from "../proto-kit";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { FeaturesScreen } from "./screens/FeaturesScreen";
import { HowToScreen } from "./screens/HowToScreen";
import { TestingScreen } from "./screens/TestingScreen";
import { CompleteScreen } from "./screens/CompleteScreen";
import { CashScreen } from "./screens/CashScreen";
import { AvailableToTradeScreen } from "./screens/cash/AvailableToTradeScreen";
import { InUseScreen } from "./screens/cash/InUseScreen";
import { DepositTray } from "./screens/cash/DepositTray";
import { WithdrawTray } from "./screens/cash/WithdrawTray";
import { DepositInputScreen } from "./screens/cash/DepositInputScreen";
import { CoinbaseHome } from "./screens/home/CoinbaseHome";
import { HomeTopNav } from "./screens/home/HomeTopNav";

// Define your screen types
export type ExampleScreen =
  | "welcome"
  | "features"
  | "howto"
  | "testing"
  | "complete"
  | "home"
  | "cash"
  | "availableToTrade"
  | "inUse"
  | "depositInput";

// Configure each screen with its component and header
export const screens: Record<ExampleScreen, ScreenConfig<ExampleScreen>> = {
  home: {
    component: CoinbaseHome,
    headerComponent: HomeTopNav,
  },
  welcome: {
    component: WelcomeScreen,
    header: {
      left: "back",
      center: "stepper",
      right: "close",
      invisible: true,
    },
  },
  features: {
    component: FeaturesScreen,
    header: {
      left: "back",
      center: "stepper",
      right: "close",
    },
  },
  howto: {
    component: HowToScreen,
    header: {
      left: "back",
      center: "stepper",
      right: "close",
    },
  },
  testing: {
    component: TestingScreen,
    header: {
      left: "back",
      center: "stepper",
      right: "close",
    },
  },
  complete: {
    component: CompleteScreen,
    header: {
      left: null,
      center: "stepper",
      right: "close",
    },
  },
  cash: {
    component: CashScreen,
    header: {
      left: "back",
      center: "stepper",
      right: null,
    },
    actionButtons: {
      left: { label: "Transfer" },
      right: { label: "Deposit", trayId: "deposit" },
    },
  },
  availableToTrade: {
    component: AvailableToTradeScreen,
    header: {
      left: "back",
      center: "stepper",
      right: null,
    },
    actionButtons: {
      left: { label: "Transfer" },
      right: { label: "Deposit", trayId: "deposit" },
    },
  },
  inUse: {
    component: InUseScreen,
    header: {
      left: "back",
      center: "stepper",
      right: null,
    },
    actionButtons: {
      left: { label: "Transfer" },
      right: { label: "Deposit", trayId: "deposit" },
    },
  },
  depositInput: {
    component: DepositInputScreen,
    header: {
      left: "back",
      center: "Deposit",
      right: null,
    },
    hideTabBar: true,
  },
};

// Bottom tab bar — matches CDS mobile TabNavigation tabs
export const bottomTabBar: { tabs: BottomTabConfig<ExampleScreen>[] } = {
  tabs: [
    {
      id: "home",
      screen: "home",
      label: "Home",
      icon: "home",
      actionButtons: {
        left: { label: "Transfer" },
        right: { label: "Buy & sell" },
      },
    },
    { id: "trade", screen: "home", label: "Trade", icon: "trading", actionable: false },
    { id: "pay", screen: "home", label: "Pay", icon: "arrowsVertical", actionable: false },
    { id: "transactions", screen: "home", label: "Transactions", icon: "invoice", actionable: false },
  ],
};

// Define the screen order for navigation direction
export const screenOrder: ExampleScreen[] = [
  "welcome",
  "features",
  "howto",
  "testing",
  "complete",
  "home",
  "cash",
  "availableToTrade",
  "inUse",
  "depositInput",
];

// Initial screen
export const initialScreen: ExampleScreen = "home";

// No initial history — "home" is the root screen
export const initialHistory: ExampleScreen[] = [];

// Total steps for the stepper (optional)
export const totalSteps = 6;

// Map screens to step numbers
export const getStepForScreen = (screen: ExampleScreen): number => {
  switch (screen) {
    case "welcome": return 0;
    case "features": return 1;
    case "howto": return 2;
    case "testing": return 3;
    case "complete": return 4;
    case "home": return 5;
    case "cash": return 5;
    case "availableToTrade": return 5;
    case "inUse": return 5;
    case "depositInput": return 5;
    default: return 0;
  }
};

// Trays (bottom sheets)
export const trays: TrayConfig[] = [
  { id: "deposit", component: DepositTray },
  { id: "withdraw", component: WithdrawTray },
];

// Available flows (optional - add more flows here if needed)
export const flows: FlowConfig[] = [
  { id: "main", name: "Main flow" },
  { id: "alternate", name: "Example flow" },
];
