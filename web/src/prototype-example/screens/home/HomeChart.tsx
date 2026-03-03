import { useMemo, useCallback } from "react";
import { LineChart, PeriodSelector } from "@coinbase/cds-web-visualization";
import { CHART_DATA, TIME_PERIODS } from "./constants/mock-portfolio";
import type { TimePeriod } from "./constants/mock-portfolio";

const PERIOD_TABS = TIME_PERIODS.map((p) => ({ id: p, label: p }));

interface HomeChartProps {
  period: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

export const HomeChart = ({ period, onPeriodChange }: HomeChartProps) => {
  const activeTab = useMemo(() => ({ id: period, label: period }), [period]);
  const data = CHART_DATA[period];

  const handleChange = useCallback(
    (tab: { id: string } | null) => {
      if (tab) onPeriodChange(tab.id as TimePeriod);
    },
    [onPeriodChange]
  );

  return (
    <div>
      <LineChart
        showArea
        areaType="dotted"
        curve="monotone"
        height={160}
        width="100%"
        inset={0}
        series={[
          {
            id: "portfolio",
            data,
            color: "var(--color-fgPrimary)",
          },
        ]}
      />
      <div style={{ padding: "16px 24px 8px" }}>
        <PeriodSelector
          tabs={PERIOD_TABS}
          activeTab={activeTab}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
