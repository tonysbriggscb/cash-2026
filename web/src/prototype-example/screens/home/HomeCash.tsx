import { Button } from "@coinbase/cds-web/buttons/Button";
import { Text } from "@coinbase/cds-web/typography/Text";
import { Icon } from "@coinbase/cds-web/icons/Icon";
import { defaultOverviewData, getCashDisplayTotal } from "../cash/data";
import type { OverviewBreakdownItem } from "../cash/data";
import { formatBalance } from "../cash/shared";
import { useRegion } from "../../RegionContext";
import { HomeListCell } from "./shared";

const PENDING_SWEEPS_LABEL = "Pending sweeps";

const LABEL_TO_SCREEN: Record<string, string> = {
  "Available to trade": "availableToTrade",
  "In use": "inUse",
  "Pending sweeps": "cash",
};

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

interface HomeCashProps {
  onNavigate?: (screen: string) => void;
}

export const HomeCash = ({ onNavigate }: HomeCashProps) => {
  const { region } = useRegion();
  const breakdown =
    region === "UK"
      ? defaultOverviewData.breakdown.filter((i) => i.label !== PENDING_SWEEPS_LABEL)
      : defaultOverviewData.breakdown;

  return (
    <div>
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 24px 16px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Text as="h2" font="title3">
            {defaultOverviewData.title}
          </Text>
          <Text font="title4" color="fgMuted">
            {formatBalance(getCashDisplayTotal(region), region)}
          </Text>
        </div>
        <button
          onClick={() => onNavigate?.("cash")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 20,
            background: "var(--color-bgSecondary)",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
          }}
          aria-label="View cash"
        >
          <Icon name="forwardArrow" size="s" dangerouslySetColor="var(--color-fg)" />
        </button>
      </div>

      {/* Segmented progress bar */}
      <div style={{ padding: "0 24px 16px" }}>
        <SegmentedBar items={breakdown} />
      </div>

      {/* Breakdown line items */}
      {breakdown.map((item) => (
        <HomeListCell
          key={item.label}
          title={item.label}
          detail={formatBalance(item.amount, region)}
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
          onClick={() => onNavigate?.(LABEL_TO_SCREEN[item.label] ?? "cash")}
        />
      ))}

      <div style={{ padding: "16px 24px 24px" }}>
        <Button variant="secondary" compact width="100%" onClick={() => onNavigate?.("depositInput")}>
          Deposit
        </Button>
      </div>
    </div>
  );
};
