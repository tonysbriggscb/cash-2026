/**
 * Example Prototype Configuration
 * 
 * This shows how to set up screens for the Proto Kit.
 * Replace these screens with your own prototype content.
 */

import type { ScreenConfig, FlowConfig } from "../proto-kit";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { FeaturesScreen } from "./screens/FeaturesScreen";
import { HowToScreen } from "./screens/HowToScreen";
import { TestingScreen } from "./screens/TestingScreen";
import { CompleteScreen } from "./screens/CompleteScreen";

// Define your screen types
export type ExampleScreen = "welcome" | "features" | "howto" | "testing" | "complete";

// Configure each screen with its component and header
export const screens: Record<ExampleScreen, ScreenConfig<ExampleScreen>> = {
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
};

// Define the screen order for navigation direction
export const screenOrder: ExampleScreen[] = ["welcome", "features", "howto", "testing", "complete"];

// Initial screen
export const initialScreen: ExampleScreen = "welcome";

// Total steps for the stepper (optional)
export const totalSteps = 5;

// Map screens to step numbers
export const getStepForScreen = (screen: ExampleScreen): number => {
  switch (screen) {
    case "welcome": return 0;
    case "features": return 1;
    case "howto": return 2;
    case "testing": return 3;
    case "complete": return 4;
    default: return 0;
  }
};

// Available flows (optional - add more flows here if needed)
export const flows: FlowConfig[] = [
  { id: "main", name: "Main flow" },
  { id: "alternate", name: "Example flow" },
];
