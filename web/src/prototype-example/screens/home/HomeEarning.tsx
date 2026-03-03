import { Button } from "@coinbase/cds-web/buttons/Button";
import { Text } from "@coinbase/cds-web/typography/Text";
import { Icon } from "@coinbase/cds-web/icons/Icon";

// ---------------------------------------------------------------------------
// Mock data — adjust to configure the component
// ---------------------------------------------------------------------------

const LIFETIME_EARNINGS = "$590.23";
const EARNING_PERCENT = 33; // % of cash that is earning
const EARNING_BALANCE = "$2,980.09";
const EARNING_RATE = "15.1%";

// ---------------------------------------------------------------------------
// Circular progress
// ---------------------------------------------------------------------------

const SIZE = 155;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADIUS = 60;
const STROKE_WIDTH = 12;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function CircleProgress({ percent }: { percent: number }) {
  const filled = CIRCUMFERENCE * (percent / 100);
  const offset = CIRCUMFERENCE - filled;

  return (
    <div style={{ position: "relative", width: SIZE, height: SIZE, flexShrink: 0 }}>
      <svg width={SIZE} height={SIZE} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx={CX}
          cy={CY}
          r={RADIUS}
          fill="none"
          stroke="var(--color-bgSecondary)"
          strokeWidth={STROKE_WIDTH}
        />
        {/* Fill */}
        <circle
          cx={CX}
          cy={CY}
          r={RADIUS}
          fill="none"
          stroke="rgb(var(--blue60))"
          strokeWidth={STROKE_WIDTH}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
        />
      </svg>

      {/* Centre label */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Text font="headline" color="fg">
          {percent}%
        </Text>
        <Text font="label2" color="fgMuted">
          Earning
        </Text>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat row
// ---------------------------------------------------------------------------

function Stat({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Text font="label2" color="fgMuted">
        {label}
      </Text>
      <Text
        font="headline"
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </Text>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HomeEarning
// ---------------------------------------------------------------------------

interface HomeEarningProps {
  onNavigate?: (screen: string) => void;
}

export const HomeEarning = ({ onNavigate }: HomeEarningProps) => {
  return (
    <div>
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "24px 24px 16px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Text as="h2" font="title3">
            Earn
          </Text>
          <span style={{ display: "flex", gap: 4 }}>
            <Text font="label2" color="fgPositive">{LIFETIME_EARNINGS}</Text>
            <Text font="label2" color="fgMuted">lifetime earnings</Text>
          </span>
        </div>
        <button
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
          aria-label="View earnings"
        >
          <Icon name="forwardArrow" size="s" dangerouslySetColor="var(--color-fg)" />
        </button>
      </div>

      {/* Chart + stats */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 32,
          padding: "0 24px 16px",
        }}
      >
        <CircleProgress percent={EARNING_PERCENT} />

        <div style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1 }}>
          <Stat label="Earning balance" value={EARNING_BALANCE} />
          <Stat
            label="Earning rate"
            value={EARNING_RATE}
            valueColor="var(--color-fgPositive)"
          />
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "0 24px 24px" }}>
        <Button variant="secondary" compact width="100%" onClick={() => onNavigate?.("cash")}>
          Earn more
        </Button>
      </div>
    </div>
  );
};
