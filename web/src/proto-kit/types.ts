import { ReactNode, ComponentType } from "react";

/**
 * Header configuration for a screen
 */
export type HeaderIcon = "back" | "close" | null;
export type HeaderCenter = "stepper" | null;

export interface HeaderConfig {
  left?: HeaderIcon;
  center?: HeaderCenter;
  right?: HeaderIcon;
  /** Make the entire header invisible but still take up space */
  invisible?: boolean;
}

/**
 * Screen configuration
 */
export interface ScreenConfig<TScreen extends string = string> {
  /** The screen component to render */
  component: ComponentType<ScreenProps<TScreen>>;
  /** Header configuration for this screen */
  header?: HeaderConfig;
}

/**
 * Props passed to each screen component
 */
export interface ScreenProps<TScreen extends string = string> {
  /** Navigate to another screen */
  onNavigate: (screen: TScreen) => void;
  /** Show the "work in progress" modal for unbuilt features */
  onShowWorkInProgress: () => void;
  /** Open a custom tray/bottom sheet */
  onOpenTray?: (trayId: string) => void;
}

/**
 * Flow configuration for the toolbar dropdown
 */
export interface FlowConfig {
  id: string;
  name: string;
  disabled?: boolean;
}

/**
 * Tray/bottom sheet configuration
 */
export interface TrayConfig {
  id: string;
  component: ComponentType<TrayProps>;
}

/**
 * Props passed to tray components
 */
export interface TrayProps {
  visible: boolean;
  onClose: () => void;
  onNavigate?: (screen: string) => void;
}

/**
 * Main ProtoKit configuration
 */
export interface ProtoKitConfig<TScreen extends string = string> {
  /** Map of screen IDs to their configurations */
  screens: Record<TScreen, ScreenConfig<TScreen>>;
  /** Ordered list of screens for navigation direction calculation */
  screenOrder: TScreen[];
  /** Initial screen to display */
  initialScreen: TScreen;
  /** Available flows for the toolbar dropdown */
  flows?: FlowConfig[];
  /** Custom trays/bottom sheets */
  trays?: TrayConfig[];
  /** Custom header component (optional) */
  renderHeader?: (screen: TScreen, config: HeaderConfig) => ReactNode;
  /** Total steps for stepper (if using stepper in header) */
  totalSteps?: number;
  /** Function to get current step for a screen */
  getStepForScreen?: (screen: TScreen) => number;
  /** Render alternate flow content (shown when non-primary flow selected) */
  renderAlternateFlow?: (flowId: string, onSwitchToMain: () => void) => ReactNode;
}

/**
 * Device dimensions
 */
export const DEVICE_WIDTH = 375;
export const DEVICE_HEIGHT = 812;
