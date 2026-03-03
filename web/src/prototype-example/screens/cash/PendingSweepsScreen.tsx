import { VStack } from "@coinbase/cds-web/layout";
import { Text } from "@coinbase/cds-web/typography/Text";

import { defaultOverviewData } from "./data";
import { CashListCell, formatBalance, SECTION_HEADER_HEIGHT } from "./shared";
import { useRegion } from "../../RegionContext";

const pendingAmount =
  defaultOverviewData.breakdown.find((i) => i.label === "Pending sweeps")?.amount ?? 300;

function USDIcon() {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: "var(--color-bgPrimary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        fontWeight: 600,
        color: "var(--color-fgInverse)",
        flexShrink: 0,
      }}
    >
      $
    </div>
  );
}

function SectionLabel({ title }: { title: string }) {
  return (
    <Text
      font="caption"
      color="fgMuted"
      style={{
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 24,
        paddingBottom: 8,
        textTransform: "uppercase",
        display: "block",
      }}
    >
      {title}
    </Text>
  );
}

interface SweepItem {
  section: string;
  title: string;
  subtitle: string;
  amount: string;
}

const SWEEP_ITEMS: SweepItem[] = [
  {
    section: "Derivatives",
    title: "Derivative to USD",
    subtitle: "6am EST next biz day",
    amount: "+$100.00",
  },
  {
    section: "Predictions",
    title: "Prediction to USD",
    subtitle: "6am EST next biz day",
    amount: "+$100.00",
  },
  {
    section: "Stocks",
    title: "Equities to USD",
    subtitle: "6am EST next biz day",
    amount: "+$100.00",
  },
];

export function PendingSweepsScreen() {
  const { region } = useRegion();
  const totalFormatted = formatBalance(pendingAmount, region);

  return (
    <VStack
      gap={0}
      style={{ flex: 1, minHeight: 0, overflow: "auto", paddingBottom: 60 }}
    >
      {/* Header */}
      <VStack
        gap={0}
        style={{
          paddingTop: 14,
          paddingBottom: 16,
          paddingLeft: 24,
          paddingRight: 24,
          height: SECTION_HEADER_HEIGHT,
          flexShrink: 0,
        }}
      >
        <Text as="h1" font="title3" color="fg" style={{ marginBottom: 2 }}>
          Pending sweeps
        </Text>
        <Text font="title2" color="fg">
          {totalFormatted}
        </Text>
      </VStack>

      {/* Description */}
      <Text
        font="body"
        color="fgMuted"
        style={{ paddingLeft: 24, paddingRight: 24, marginTop: 16, marginBottom: 4 }}
      >
        The amount of money that is currently being swept back into your cash balance.
      </Text>

      {/* Sections */}
      {SWEEP_ITEMS.map((item) => (
        <div key={item.title}>
          <SectionLabel title={item.section} />
          <CashListCell
            media={<USDIcon />}
            title={item.title}
            description={item.subtitle}
            detail={
              <Text font="headline" color="fgPositive">
                {item.amount}
              </Text>
            }
            multiline
          />
        </div>
      ))}
    </VStack>
  );
}
