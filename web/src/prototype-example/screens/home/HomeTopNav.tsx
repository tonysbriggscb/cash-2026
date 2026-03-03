import { useState } from "react";
import { Icon } from "@coinbase/cds-web/icons/Icon";
import { SearchInput } from "@coinbase/cds-web/controls/SearchInput";

const HamburgerIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: 24, height: 24, flexShrink: 0 }}
  >
    <rect x="3" y="6" width="18" height="2" rx="1" fill="currentColor" />
    <rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor" />
    <rect x="3" y="16" width="18" height="2" rx="1" fill="currentColor" />
  </svg>
);

interface HomeTopNavProps {
  onHamburgerPress?: () => void;
  onNotificationsPress?: () => void;
}

export const HomeTopNav = ({
  onHamburgerPress,
  onNotificationsPress,
}: HomeTopNavProps) => {
  const [query, setQuery] = useState("");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: 56,
        padding: "8px 16px",
        gap: 8,
        flexShrink: 0,
        zIndex: 10,
        backgroundColor: "var(--color-bg)",
      }}
    >
      <button
        onClick={onHamburgerPress}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          flexShrink: 0,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
        aria-label="Menu"
      >
        <span style={{ color: "var(--color-fg)", display: "flex" }}>
          <HamburgerIcon />
        </span>
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <SearchInput
          value={query}
          onChangeText={setQuery}
          onClear={() => setQuery("")}
          placeholder="Search"
          compact
          accessibilityLabel="Search"
        />
      </div>
      <button
        onClick={onNotificationsPress}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 40,
          height: 40,
          flexShrink: 0,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
        aria-label="Notifications"
      >
        <Icon name="bell" size="m" dangerouslySetColor="var(--color-fg)" />
      </button>
    </div>
  );
};
