/**
 * CDS Proto Kit
 * 
 * A reusable prototype framework for Coinbase designers
 * Built with CDS (Coinbase Design System) components
 * 
 * @example
 * ```tsx
 * import { ProtoKit, ScreenProps, ScreenConfig } from './proto-kit';
 * 
 * const HomeScreen = ({ onNavigate, onShowWorkInProgress }: ScreenProps) => (
 *   <VStack padding={3}>
 *     <Text font="title1">Welcome</Text>
 *     <Button onClick={() => onNavigate("detail")}>Next</Button>
 *   </VStack>
 * );
 * 
 * const screens = {
 *   home: { component: HomeScreen, header: { right: "close" } },
 *   detail: { component: DetailScreen, header: { left: "back" } },
 * };
 * 
 * export const App = () => (
 *   <ProtoKit
 *     screens={screens}
 *     screenOrder={["home", "detail"]}
 *     initialScreen="home"
 *   />
 * );
 * ```
 */

// Main component
export { ProtoKit } from "./ProtoKit";

// Individual components (for advanced customization)
export { IOSStatusBar } from "./IOSStatusBar";
export { DeviceFrame, useViewport } from "./DeviceFrame";
export { PrototypeToolbar } from "./PrototypeToolbar";
export { ScreenNavigator, useScreenNavigator } from "./ScreenNavigator";
export { WorkInProgressModal } from "./WorkInProgressModal";

// Styles (for manual injection if needed)
export { protoKitStyles } from "./styles";

// Settings utilities
export { 
  parseSettingsFromUrl, 
  generateTesterUrl, 
  hasTestSettings,
} from "./settings";
export type { PrototypeSettings } from "./settings";

// Types
export type {
  ScreenConfig,
  ScreenProps,
  HeaderConfig,
  HeaderIcon,
  HeaderCenter,
  FlowConfig,
  TrayConfig,
  TrayProps,
  ProtoKitConfig,
} from "./types";

// Constants
export { DEVICE_WIDTH, DEVICE_HEIGHT } from "./types";
