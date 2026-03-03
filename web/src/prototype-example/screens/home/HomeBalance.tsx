import { useState, useEffect, useMemo } from "react";
import { RollingNumber } from "@coinbase/cds-web/numbers/RollingNumber";
import { Text } from "@coinbase/cds-web/typography/Text";
import { Icon } from "@coinbase/cds-web/icons/Icon";
import { Sparkline } from "@coinbase/cds-web-visualization";
import { useSparklinePath } from "@coinbase/cds-common/visualizations/useSparklinePath";
import {
  PORTFOLIO,
  PERIOD_CHANGES,
  CHART_DATA,
} from "./constants/mock-portfolio";
import type { TimePeriod } from "./constants/mock-portfolio";
import { defaultCashTotal } from "../cash/data";
import { GBP_TO_USD } from "../cash/shared";
import { useRegion } from "../../RegionContext";

function jitter(base: number, range: number) {
  return base + (Math.random() - 0.5) * 2 * range;
}

const SPARKLINE_WIDTH = 100;
const SPARKLINE_HEIGHT = 40;

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const path = useSparklinePath({ data, width: SPARKLINE_WIDTH, height: SPARKLINE_HEIGHT });
  return (
    <Sparkline
      path={path}
      color={color}
      width={SPARKLINE_WIDTH}
      height={SPARKLINE_HEIGHT}
    />
  );
}

interface HomeBalanceProps {
  period: TimePeriod;
  chartExpanded: boolean;
  onToggleChart?: () => void;
}

export const HomeBalance = ({
  period,
  chartExpanded,
  onToggleChart,
}: HomeBalanceProps) => {
  const { region } = useRegion();
  const currency = region === "US" ? "USD" : "GBP";
  const fxRate = region === "US" ? GBP_TO_USD : 1;

  const [cryptoBalance, setCryptoBalance] = useState(PORTFOLIO.balance);
  const balance = (cryptoBalance + defaultCashTotal) * fxRate;

  useEffect(() => {
    const id = setInterval(() => {
      setCryptoBalance(jitter(PORTFOLIO.balance, 8));
    }, 10_000);
    return () => clearInterval(id);
  }, []);

  const baseChange = PERIOD_CHANGES[period];
  const drift = cryptoBalance - PORTFOLIO.balance;
  const change = (baseChange.change + drift) * fxRate;
  const startValue = balance - change;
  const changePercent = startValue !== 0 ? (change / startValue) * 100 : 0;
  const isNegative = change < 0;

  const trendColor = isNegative ? "fgNegative" : "fgPositive";

  const changePrefix = useMemo(
    () => (
      <Icon
        color={trendColor}
        name={isNegative ? "diagonalDownArrow" : "diagonalUpArrow"}
        size="xs"
      />
    ),
    [isNegative, trendColor]
  );

  const changeSuffix = useMemo(
    () => `(${Math.abs(changePercent).toFixed(2)}%)`,
    [changePercent]
  );

  return (
    <div
      onClick={!chartExpanded ? onToggleChart : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px 12px",
        cursor: !chartExpanded ? "pointer" : undefined,
      }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <RollingNumber
          value={balance}
          format={{ style: "currency", currency }}
          as="div"
          font="title1"
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginTop: -4,
          }}
        >
          <RollingNumber
            color={trendColor}
            font="body"
            format={{
              style: "currency",
              currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }}
            prefix={changePrefix}
            suffix={changeSuffix}
            styles={{
              prefix: { paddingRight: "var(--space-0_5)" },
              suffix: { paddingLeft: "var(--space-0_5)" },
            }}
            value={Math.abs(change)}
          />
          <Text as="span" color="fgMuted">
            {period}
          </Text>
          <Icon
            name="caretRight"
            size="xs"
            dangerouslySetColor="var(--color-fgMuted)"
          />
        </div>
      </div>

      {chartExpanded ? (
        <button
          onClick={onToggleChart}
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
          aria-label="Collapse chart"
        >
          <Icon name="caretUp" size="s" dangerouslySetColor="var(--color-fg)" />
        </button>
      ) : (
        <div style={{ width: SPARKLINE_WIDTH, height: SPARKLINE_HEIGHT, flexShrink: 0 }}>
          <MiniSparkline
            data={CHART_DATA[period]}
            color="var(--color-fgPrimary)"
          />
        </div>
      )}
    </div>
  );
};
