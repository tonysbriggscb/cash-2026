import { useCallback, useEffect, useRef, useState } from "react";
import { VStack } from "@coinbase/cds-web/layout";
import { Text } from "@coinbase/cds-web/typography/Text";
import { SectionHeader } from "@coinbase/cds-web/section-header";

import { useRegion } from "../../RegionContext";
import { REWARDS_SCALE, type RewardsData } from "./data";
import { RewardsListCell } from "./shared";
import { useRewardsTicker } from "./RewardsTickerContext";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DIGIT_HEIGHT = 41; /* title2 line-height scaled up 15% (36 * 1.15) */

function splitReward(units: number) {
  const whole = Math.floor(units / REWARDS_SCALE);
  const frac = String(units % REWARDS_SCALE).padStart(9, "0");
  const fracDigits = whole >= 100 ? 8 : 9;
  return {
    whole,
    staticPart: frac.slice(0, fracDigits - 1),
    lastDigit: Number(frac[fracDigits - 1]),
  };
}

// ---------------------------------------------------------------------------
// RewardsTicker
// ---------------------------------------------------------------------------

function RewardsTicker({
  startUnits,
  stepUnits,
  currencySymbol,
  paused = false,
  rewardUnits: externalRewardUnits,
  setRewardUnits: externalSetRewardUnits,
}: {
  startUnits: number;
  stepUnits: number;
  /** Currency symbol shown before the big number (e.g. £ or $) */
  currencySymbol: string;
  /** When true the ticker is frozen — no new ticks are scheduled */
  paused?: boolean;
  rewardUnits?: number;
  setRewardUnits?: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [internalUnits, setInternalUnits] = useState(startUnits);
  const rewardUnits = externalRewardUnits ?? internalUnits;
  const setRewardUnits = externalSetRewardUnits ?? setInternalUnits;

  const initialUnits = externalRewardUnits ?? startUnits;
  const initialLastDigit = splitReward(initialUnits).lastDigit;

  const [lastDigitY, setLastDigitY] = useState(() => initialLastDigit * DIGIT_HEIGHT * -1);
  const [waveOffsets, setWaveOffsets] = useState<number[]>([]);

  const currentDigitRef = useRef(initialLastDigit);
  const currentIndexRef = useRef(initialLastDigit);
  const tickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track whether we should animate (skip on first render)
  const didMountRef = useRef(false);

  // ── spin the last digit ──────────────────────────────────────────────────
  const spinToDigit = useCallback((nextDigit: number, animate: boolean) => {
    if (!animate) {
      currentDigitRef.current = nextDigit;
      currentIndexRef.current = nextDigit % 10;
      setLastDigitY(currentIndexRef.current * DIGIT_HEIGHT * -1);
      return;
    }

    const steps = (nextDigit - currentDigitRef.current + 10) % 10;
    if (steps === 0) return;

    const endIndex = currentIndexRef.current + steps;
    setLastDigitY(endIndex * DIGIT_HEIGHT * -1);

    currentDigitRef.current = nextDigit;
    // Don't wrap — keep the running position accumulating so the column
    // always scrolls in the same direction (never jumps back up).
    currentIndexRef.current = endIndex;
  }, []);

  // ── wave ripple across static chars on 9 → 0 rollover ───────────────────
  const runWave = useCallback((charCount: number) => {
    for (let i = 0; i < charCount; i++) {
      const delay = i * 60;
      setTimeout(() => {
        setWaveOffsets((prev) => {
          const next = [...prev];
          next[i] = -6;
          return next;
        });
        setTimeout(() => {
          setWaveOffsets((prev) => {
            const next = [...prev];
            next[i] = 0;
            return next;
          });
        }, 180);
      }, delay);
    }
  }, []);

  // ── tick ─────────────────────────────────────────────────────────────────
  const clearTick = useCallback(() => {
    if (tickTimerRef.current) {
      clearTimeout(tickTimerRef.current);
      tickTimerRef.current = null;
    }
  }, []);

  const scheduleTick = useCallback(() => {
    clearTick();
    const delay = 1000;
    tickTimerRef.current = setTimeout(() => {
      setRewardUnits((prev) => {
        const next = prev + stepUnits;
        const prevSplit = splitReward(prev);
        const nextSplit = splitReward(next);
        const rollover = prevSplit.lastDigit === 9 && nextSplit.lastDigit === 0;

        spinToDigit(nextSplit.lastDigit, true);

        if (rollover) {
          const charCount = String(nextSplit.whole).length + 1 + nextSplit.staticPart.length;
          runWave(charCount);
        }

        return next;
      });
      scheduleTick();
    }, delay);
  }, [clearTick, stepUnits, spinToDigit, runWave]);

  // ── mount / unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    const { lastDigit } = splitReward(rewardUnits);
    spinToDigit(lastDigit, false);
    didMountRef.current = true;
    if (!paused) scheduleTick();
    return () => clearTick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── pause / resume ────────────────────────────────────────────────────────
  useEffect(() => {
    if (paused) {
      clearTick();
    } else {
      scheduleTick();
    }
  }, [paused, clearTick, scheduleTick]);

  // ── derive display parts ──────────────────────────────────────────────────
  const { whole, staticPart } = splitReward(rewardUnits);
  const valuePrefix = `${whole}.`;
  const totalChars = valuePrefix.length + staticPart.length;

  // Ensure waveOffsets array is long enough
  const offsets = Array.from({ length: totalChars }, (_, i) => waveOffsets[i] ?? 0);

  // ── digit column — enough rows for a long session without wrapping ────────
  // 100 rows = 10 full cycles; at one tick/second this lasts ~100 seconds
  // before currentIndexRef would overflow, which is plenty for a demo.
  const digitColumn = Array.from({ length: 100 }, (_, i) => i % 10);

  const charStyle: React.CSSProperties = {
    color: "var(--color-fgPositive)",
    fontSize: "calc(1.15 * var(--fontSize-title2))",
    lineHeight: "calc(1.15 * var(--lineHeight-title2))",
    fontWeight: "var(--fontWeight-title2)",
    display: "inline-block",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        lineHeight: `${DIGIT_HEIGHT}px`,
        height: DIGIT_HEIGHT,
        overflow: "hidden",
      }}
    >
      <span style={charStyle}>{currencySymbol}</span>
      {/* Whole + decimal point — each char gets its own wave offset */}
      {Array.from(valuePrefix).map((char, i) => (
        <span
          key={i}
          style={{
            ...charStyle,
            transform: `translateY(${offsets[i]}px)`,
            transition: offsets[i] !== 0 ? "transform 0.18s ease-out" : "transform 0.18s ease-in",
          }}
        >
          {char}
        </span>
      ))}

      {/* Static fractional digits — each gets wave offset */}
      {Array.from(staticPart).map((char, i) => {
        const idx = valuePrefix.length + i;
        return (
          <span
            key={idx}
            style={{
              ...charStyle,
              color: "var(--color-fgPositive)",
              opacity: 0.5,
              transform: `translateY(${offsets[idx] ?? 0}px)`,
              transition: (offsets[idx] ?? 0) !== 0 ? "transform 0.18s ease-out" : "transform 0.18s ease-in",
            }}
          >
            {char}
          </span>
        );
      })}

      {/* Last digit — slot machine spin; each row fixed height and centered so digit aligns with static digits */}
      <div
        style={{
          overflow: "hidden",
          height: DIGIT_HEIGHT,
          width: 21,
        }}
      >
        <div
          style={{
            transform: `translateY(${lastDigitY}px)`,
            transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {digitColumn.map((d, i) => (
            <span
              key={i}
              style={{
                ...charStyle,
                opacity: 0.5,
                display: "flex",
                alignItems: "center",
                height: DIGIT_HEIGHT,
                lineHeight: `${DIGIT_HEIGHT}px`,
                minHeight: DIGIT_HEIGHT,
              }}
            >
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RewardsSection
// ---------------------------------------------------------------------------

export function RewardsSection({ data }: { data: RewardsData }) {
  const { region } = useRegion();
  const currencySymbol = region === "UK" ? "£" : "$";
  const tickerContext = useRewardsTicker();
  const totalUnits = tickerContext?.rewardUnits ?? data.startUnits;
  const hasEarningItems = data.items.some((i) => (i.variant ?? "new-user") === "existing-user");

  return (
    <VStack gap={0} style={{ paddingTop: 16, paddingBottom: 16 }}>
      <SectionHeader
        title={
          <Text as="h3" display="block" font="title3">
            Cash Rewards
          </Text>
        }
        paddingX={3}
        balance={
          <RewardsTicker
            startUnits={data.startUnits}
            stepUnits={data.stepUnits}
            currencySymbol={currencySymbol}
            paused={!hasEarningItems}
            rewardUnits={tickerContext?.rewardUnits}
            setRewardUnits={tickerContext?.setRewardUnits}
          />
        }
      />
      <VStack gap={0} className="cash-rewards-list" style={{ gap: 8 }}>
        {data.items.map((item) => {
          const isGBPSavingsInUS = region === "US" && item.title === "GBP Savings";
          const displayItem = isGBPSavingsInUS
            ? { ...item, title: "Lending", buttonLabel: "Lend", icon: "percentage" as const }
            : { ...item };

          // "existing-user" items show a live earned amount (+£X.XX) instead of a button.
          const itemVariant = displayItem.variant ?? "new-user";
          let earnedEnd: React.ReactNode | undefined;
          if (itemVariant === "existing-user") {
            const fraction = displayItem.earnedFraction ?? 1 / data.items.length;
            const earned = (totalUnits * fraction) / REWARDS_SCALE;
            const formatted = new Intl.NumberFormat(region === "US" ? "en-US" : "en-GB", {
              style: "currency",
              currency: region === "UK" ? "GBP" : "USD",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(earned);
            earnedEnd = (
              <Text font="body" color="fgMuted">
                +{formatted}
              </Text>
            );
          }

          return (
            <RewardsListCell
              key={displayItem.title}
              item={{
                ...displayItem,
                description: displayItem.rate,
              }}
              endVariant={itemVariant === "existing-user" ? "detail" : (displayItem.endVariant ?? "button")}
              end={earnedEnd}
            />
          );
        })}
      </VStack>
    </VStack>
  );
}
