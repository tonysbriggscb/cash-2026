import { VStack } from "@coinbase/cds-web/layout";
import { Text } from "@coinbase/cds-web/typography/Text";
import { SectionHeader } from "@coinbase/cds-web/section-header";
import { ListCell } from "@coinbase/cds-web/cells";

import { useRegion } from "../../RegionContext";
import type { OverviewBreakdownItem, OverviewData } from "./data";
import { getCashDisplayTotal } from "./data";
import { formatBalance, SECTION_HEADER_HEIGHT } from "./shared";

type ExampleScreen = "welcome" | "features" | "howto" | "testing" | "complete" | "cash" | "availableToTrade" | "inUse";

function SegmentedBar({ items }: { items: OverviewBreakdownItem[] }) {
  const visibleItems = items.filter((i) => i.amount > 0);
  const total = visibleItems.reduce((s, i) => s + i.amount, 0) || 1;
  return (
    <div style={{ display: "flex", height: 6, borderRadius: 3, overflow: "hidden", gap: 2 }}>
      {visibleItems.map((item) => (
        <div
          key={item.label}
          style={{
            flex: item.amount / total,
            backgroundColor: item.color,
            borderRadius: 3,
            minWidth: 4,
          }}
        />
      ))}
    </div>
  );
}

const PENDING_SWEEPS_LABEL = "Pending sweeps";

export function OverviewSection({
  data,
  onNavigate,
}: {
  data: OverviewData;
  onNavigate?: (screen: ExampleScreen) => void;
}) {
  const { region } = useRegion();
  const breakdown =
    region === "UK"
      ? data.breakdown.filter((i) => i.label !== PENDING_SWEEPS_LABEL)
      : data.breakdown;
  const totalBalance = getCashDisplayTotal(region);
  return (
    <VStack gap={0} style={{ paddingTop: 14, paddingBottom: 16 }}>
      <div className="overview-section-header" style={{ height: SECTION_HEADER_HEIGHT, flexShrink: 0 }}>
        <SectionHeader
          title={
            <Text as="h3" display="block" font="title1">
              {data.title}
            </Text>
          }
          paddingX={3}
          paddingY={0}
          balance={
            <Text font="title2" color="fg">
              {formatBalance(totalBalance, region)}
            </Text>
          }
        />
      </div>

      <VStack
        id="overview"
        gap={0}
        styles={{
          root: {
            flex: 1,
            gap: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: 0,
            marginBottom: 0,
          },
        }}
      >
        <div style={{ marginTop: 16 }}>
          <VStack
            paddingX={3}
            styles={{
              root: {
                boxSizing: "border-box",
                paddingTop: 0,
                paddingBottom: 0,
                margin: 0,
              },
            }}
          >
            <SegmentedBar items={breakdown} />
          </VStack>
        </div>

        <div className="overview-breakdown-block" style={{ marginTop: 16, paddingTop: 0, paddingBottom: 0 }}>
          {breakdown.map((item) => {
            const isAvailableToTrade = item.label === "Available to trade";
            const isInUse = item.label === "In use";
            const cell = (
              <ListCell
                title={item.label}
                detail={formatBalance(item.amount, region)}
                spacingVariant="condensed"
                media={
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      flexShrink: 0,
                      borderRadius: "50%",
                      backgroundColor: item.color,
                    }}
                  />
                }
                styles={{
                  root: { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 },
                  contentContainer: { paddingTop: 4, paddingBottom: 4 },
                }}
              />
            );
            if (isAvailableToTrade && onNavigate) {
              return (
                <div
                  key={item.label}
                  className="overview-breakdown-cell"
                  role="button"
                  tabIndex={0}
                  onClick={() => onNavigate("availableToTrade")}
                  onKeyDown={(e) => e.key === "Enter" && onNavigate("availableToTrade")}
                  style={{ cursor: "pointer" }}
                >
                  {cell}
                </div>
              );
            }
            if (isInUse && onNavigate) {
              return (
                <div
                  key={item.label}
                  className="overview-breakdown-cell"
                  role="button"
                  tabIndex={0}
                  onClick={() => onNavigate("inUse")}
                  onKeyDown={(e) => e.key === "Enter" && onNavigate("inUse")}
                  style={{ cursor: "pointer" }}
                >
                  {cell}
                </div>
              );
            }
            return (
              <div key={item.label} className="overview-breakdown-cell">
                {cell}
              </div>
            );
          })}
        </div>
      </VStack>
    </VStack>
  );
}
