import { Button } from "@coinbase/cds-web/buttons/Button";
import { Text } from "@coinbase/cds-web/typography/Text";
import { Icon } from "@coinbase/cds-web/icons/Icon";
import cb1CardImg from "../../assets/cb1-card.png";

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

function IconCircle({ name }: { name: string }) {
  return (
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon name={name as any} size="s" dangerouslySetColor="var(--color-fg)" />
    </div>
  );
}

// Small square tile (used in the 2-column row)
function SmallTile({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "var(--color-bgSecondary)",
        borderRadius: 24,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        minWidth: 0,
      }}
    >
      <IconCircle name={icon} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Text font="headline" color="fg">
          {title}
        </Text>
        <Text font="label2" color="fgMuted">
          {description}
        </Text>
      </div>
    </div>
  );
}

// Full-width horizontal tile
function WideTile({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-bgSecondary)",
        borderRadius: 24,
        padding: 16,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <IconCircle name={icon} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 0 }}>
        <Text font="headline" color="fg">
          {title}
        </Text>
        <Text font="label2" color="fgMuted">
          {description}
        </Text>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Coinbase One Card (dark hero card)
// ---------------------------------------------------------------------------

function RewardCard() {
  return (
    <div
      style={{
        borderRadius: 32,
        background: "linear-gradient(180deg, #0a0b0d 0%, #22252a 100%)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: 370,
      }}
    >
      {/* Card image area */}
      <img
        src={cb1CardImg}
        alt="Coinbase One Card"
        style={{
          width: "100%",
          height: 190,
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
          flexShrink: 0,
        }}
      />

      {/* Card text */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "16px 16px 16px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <Text font="title1" style={{ color: "white", textAlign: "center" }}>
            Coinbase One Card
          </Text>
          <Text font="body" style={{ color: "#8a919e", textAlign: "center", whiteSpace: "pre-line" }}>
            Win up to $100k Bitcoin{"\n"}every month.
          </Text>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "0 16px 16px", width: "100%", boxSizing: "border-box" }}>
        <Button variant="secondary" compact width="100%">
          Get yours now
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// HomeRecommended
// ---------------------------------------------------------------------------

export const HomeRecommended = () => {
  return (
    <div>
      {/* Section header */}
      <div style={{ padding: "24px 24px 16px" }}>
        <Text as="h2" font="title3">
          Recommended for you
        </Text>
      </div>

      <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Dark hero card */}
        <RewardCard />

        {/* 2-column row */}
        <div style={{ display: "flex", gap: 12 }}>
          <SmallTile icon="percentage" title="Borrow" description="Borrow against your bitcoin" />
          <SmallTile icon="perpetualSwap" title="Lend" description="Earn by lending your USDC" />
        </div>

        {/* Full-width tiles */}
        <WideTile icon="coinbaseOne" title="Coinbase One" description="Zero trading fees, boosted staking rewards, and more" />
        <WideTile icon="chartBar" title="Set up savings goals" description="Save towards long-term expenses" />
        <WideTile icon="refresh" title="Manage roundups" description="Auto-save when you spend" />
      </div>
    </div>
  );
};
