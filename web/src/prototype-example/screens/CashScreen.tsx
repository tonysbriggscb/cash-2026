import { VStack, Divider } from "@coinbase/cds-web/layout";
import type { ScreenProps } from "../../proto-kit";

import {
  defaultOverviewData,
  defaultRewardsData,
  defaultAutomationsData,
  defaultDoMoreWithCashData,
  defaultTransactionsData,
} from "./cash/data";
import { OverviewSection } from "./cash/OverviewSection";
import { RewardsSection } from "./cash/RewardsSection";
import { AutomationsSection } from "./cash/AutomationsSection";
import { DoMoreSection } from "./cash/DoMoreSection";
import { TransactionsSection } from "./cash/TransactionsSection";

type ExampleScreen =
  | "welcome"
  | "features"
  | "howto"
  | "testing"
  | "complete"
  | "cash"
  | "availableToTrade"
  | "inUse";

export const CashScreen = ({ onNavigate }: ScreenProps<ExampleScreen>) => {
  return (
    <VStack
      gap={0}
      style={{
        flex: 1,
        minHeight: 0,
      overflow: "auto",
      overscrollBehavior: "none",
      paddingBottom: 60,
    }}
    >
      <OverviewSection data={defaultOverviewData} onNavigate={onNavigate} />
      <Divider direction="horizontal" />
      <RewardsSection data={defaultRewardsData} />
      <Divider direction="horizontal" />
      <AutomationsSection data={defaultAutomationsData} />
      <Divider direction="horizontal" />
      <DoMoreSection data={defaultDoMoreWithCashData} />
      <Divider direction="horizontal" />
      <TransactionsSection data={defaultTransactionsData} />
    </VStack>
  );
};
