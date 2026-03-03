import { useState } from "react";
import { Divider } from "@coinbase/cds-web/layout";
import type { ScreenProps } from "../../../proto-kit";
import { HomeBalance } from "./HomeBalance";
import { HomeChart } from "./HomeChart";
import { HomeHoldings } from "./HomeHoldings";
import { HomeCrypto } from "./HomeCrypto";
import { HomeCash } from "./HomeCash";
import { HomeWatchlist } from "./HomeWatchlist";
import type { TimePeriod } from "./constants/mock-portfolio";

// Module-level state persists across remounts (e.g. during push-transition animation)
// so the chart never animates open/closed unexpectedly when the component re-mounts.
let _chartExpanded = true;
let _period: TimePeriod = "All";

export const CoinbaseHome = ({ onNavigate }: ScreenProps) => {
  const [period, setPeriod] = useState<TimePeriod>(_period);
  const [chartExpanded, setChartExpanded] = useState(_chartExpanded);

  const handlePeriodChange = (p: TimePeriod) => {
    _period = p;
    setPeriod(p);
  };

  const handleToggleChart = () => {
    _chartExpanded = !_chartExpanded;
    setChartExpanded(_chartExpanded);
  };

  return (
    <div
      className="home-screen"
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--color-bg)",
      }}
    >
      <div
        style={{
          flex: 1,
          overflow: "auto",
          overscrollBehavior: "none",
        }}
      >
        <HomeBalance
          period={period}
          chartExpanded={chartExpanded}
          onToggleChart={handleToggleChart}
        />
        <div className={`chart-collapse${chartExpanded ? "" : " collapsed"}`}>
          <div className="chart-collapse-inner">
            <HomeChart period={period} onPeriodChange={handlePeriodChange} />
          </div>
        </div>
        <HomeHoldings onNavigate={onNavigate} />
        <Divider />
        <HomeWatchlist />
        <Divider />
        <HomeCrypto period={period} />
        <Divider />
        <HomeCash onNavigate={onNavigate} />
        <div style={{ height: 60 }} />
      </div>
    </div>
  );
};
