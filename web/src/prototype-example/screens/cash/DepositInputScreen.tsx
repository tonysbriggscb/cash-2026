import { useState, useCallback, useRef, useLayoutEffect } from "react";
import { VStack, HStack } from "@coinbase/cds-web/layout";
import { Text } from "@coinbase/cds-web/typography/Text";
import { Button } from "@coinbase/cds-web/buttons/Button";
import { Icon } from "@coinbase/cds-web/icons/Icon";
import { useRegion } from "../../RegionContext";
import { GBP_TO_USD } from "./shared";

const DAILY_LIMIT_USD = 199_500;
const DAILY_LIMIT_GBP = Math.round(DAILY_LIMIT_USD / GBP_TO_USD);

function formatDisplayAmount(amount: number, decimalPlaces: number): string {
  if (amount === 0 && decimalPlaces === 0) return "0";
  const value = amount / Math.pow(10, decimalPlaces);
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
}

const NUMPAD_KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "backspace"],
] as const;

// CSS keyframes injected once for the shake animation
const SHAKE_STYLE = `
  @keyframes depositShake {
    0%   { transform: translateX(0); }
    20%  { transform: translateX(-6px); }
    40%  { transform: translateX(6px); }
    60%  { transform: translateX(-4px); }
    80%  { transform: translateX(4px); }
    100% { transform: translateX(0); }
  }
  .deposit-shake {
    animation: depositShake 0.35s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }
`;

export function DepositInputScreen() {
  const { region } = useRegion();
  const [amount, setAmount] = useState(0);
  const [hasDecimal, setHasDecimal] = useState(false);
  const [decimalPlaces, setDecimalPlaces] = useState(0);
  const [shaking, setShaking] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const amountRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(80);

  const currencyLabel = region === "US" ? "USD" : "GBP";
  const dailyLimit = region === "US" ? DAILY_LIMIT_USD : DAILY_LIMIT_GBP;
  const limitFormatted =
    region === "US"
      ? `$${DAILY_LIMIT_USD.toLocaleString("en-US")}`
      : `£${DAILY_LIMIT_GBP.toLocaleString("en-GB")}`;

  const displayValue = formatDisplayAmount(amount, decimalPlaces);
  const numericValue = amount / Math.pow(10, decimalPlaces);
  const hasAmount = numericValue > 0;

  // Shrink font to fit the available width
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth - 32;
    const textLength = (displayValue + " " + currencyLabel).length;
    const ideal = Math.floor(containerWidth / (textLength * 0.50));
    setFontSize(Math.min(96, Math.max(24, ideal)));
  }, [displayValue, currencyLabel]);

  const triggerShake = useCallback(() => {
    setShaking(false);
    // Force a reflow so re-adding the class restarts the animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setShaking(true));
    });
    // Clear after animation completes
    setTimeout(() => setShaking(false), 400);
  }, []);

  const handleKey = useCallback(
    (key: string) => {
      if (key === "backspace") {
        if (hasDecimal && decimalPlaces > 0) {
          setDecimalPlaces((p) => p - 1);
          setAmount((a) => Math.floor(a / 10));
        } else if (hasDecimal && decimalPlaces === 0) {
          setHasDecimal(false);
        } else if (amount > 0) {
          setAmount((a) => Math.floor(a / 10));
        }
        return;
      }
      if (key === ".") {
        if (!hasDecimal) setHasDecimal(true);
        return;
      }
      const digit = parseInt(key, 10);
      if (isNaN(digit)) return;

      let nextAmount: number;
      let nextDecimalPlaces: number;

      if (hasDecimal) {
        if (decimalPlaces >= 2) return;
        nextDecimalPlaces = decimalPlaces + 1;
        nextAmount = amount * 10 + digit;
      } else {
        nextDecimalPlaces = decimalPlaces;
        nextAmount = amount * 10 + digit;
      }

      const nextValue = nextAmount / Math.pow(10, nextDecimalPlaces);
      if (nextValue > dailyLimit) {
        triggerShake();
        return;
      }

      setAmount(nextAmount);
      if (hasDecimal) setDecimalPlaces(nextDecimalPlaces);
    },
    [amount, hasDecimal, decimalPlaces, dailyLimit, triggerShake]
  );

  const depositMaximum = useCallback(() => {
    const limit = region === "US" ? DAILY_LIMIT_USD : DAILY_LIMIT_GBP;
    setAmount(limit * 100);
    setHasDecimal(true);
    setDecimalPlaces(2);
  }, [region]);

  return (
    <VStack
      gap={0}
      style={{ flex: 1, minHeight: 0, padding: "24px 24px 0" }}
    >
      <style>{SHAKE_STYLE}</style>

      {/* Amount display — grows to fill available space, content centred within it */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 8,
          minHeight: 100,
        }}
      >
        <div ref={amountRef} className={shaking ? "deposit-shake" : ""} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Text
            font="display"
            color="fg"
            as="span"
            style={{ fontSize, lineHeight: 1.1, fontFamily: "var(--font-family-display)" }}
          >
            {displayValue}
          </Text>
          <Text
            font="display"
            color="fgMuted"
            as="span"
            style={{ fontSize, lineHeight: 1.1, fontFamily: "var(--font-family-display)" }}
          >
            {currencyLabel}
          </Text>
        </div>
      </div>

      {/* Numpad + daily limit + CTA pinned at the bottom */}
      <VStack gap={0} style={{ flex: 1, minHeight: 0, paddingBottom: 24, justifyContent: "flex-end" }}>
        {/* Daily limit — always muted, centred, 16px above CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 16 }}>
          <Text font="label2" color="fgMuted">
            {limitFormatted} daily limit
          </Text>
          <Icon name="info" size="xs" color="fgMuted" />
        </div>

        {hasAmount ? (
          <Button variant="primary" block onClick={() => {}} style={{ marginBottom: 16 }}>
            Review
          </Button>
        ) : (
          <Button variant="secondary" compact block onClick={depositMaximum} style={{ marginBottom: 16 }}>
            Deposit maximum
          </Button>
        )}

        {NUMPAD_KEYS.map((row, rowIndex) => (
          <HStack key={rowIndex} gap={0} style={{ justifyContent: "space-around", marginBottom: 4 }}>
            {row.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleKey(key)}
                style={{
                  width: 96,
                  height: 56,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  background: "transparent",
                  color: "var(--color-fg)",
                  fontSize: 28,
                  fontFamily: "var(--font-family-body)",
                  cursor: "pointer",
                  borderRadius: 12,
                }}
                aria-label={key === "backspace" ? "Delete" : key}
              >
                {key === "backspace" ? (
                  <Icon name="backArrow" size="m" color="fg" />
                ) : (
                  key
                )}
              </button>
            ))}
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}
