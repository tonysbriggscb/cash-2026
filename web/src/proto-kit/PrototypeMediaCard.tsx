import React from "react";
import { Icon } from "@coinbase/cds-web/icons/Icon";
import { MediaCard } from "@coinbase/cds-web/cards";

/**
 * Item shape for PrototypeMediaCard. Use this type when passing data to the card.
 */
export interface PrototypeMediaCardItem {
  title: string;
  description: string;
  /** CDS icon name (e.g. "percentage", "card", "deposit") */
  icon: string;
}

function WhiteCircleIcon({ name }: { name: string }) {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        flexShrink: 0,
        borderRadius: "50%",
        backgroundColor: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon name={name as any} color="fg" size="s" />
    </div>
  );
}

export interface PrototypeMediaCardProps {
  /** Card content: title, description, icon name */
  item: PrototypeMediaCardItem;
  /** 'stacked' = icon above title/description; 'horizontal' = icon beside title/description (e.g. single card in a row) */
  layout?: "stacked" | "horizontal";
  /** Optional root styles (e.g. flex: 1, minWidth: 0 for grid layouts) */
  styles?: { root?: React.CSSProperties };
}

/**
 * Reusable media card for prototypes. Uses CDS MediaCard with a white circular icon,
 * headline title, and label2 description. Use in Do more sections, feature grids, etc.
 */
export function PrototypeMediaCard({
  item,
  layout = "stacked",
  styles: customStyles = {},
}: PrototypeMediaCardProps) {
  const icon = <WhiteCircleIcon name={item.icon} />;
  const horizontal = layout === "horizontal";

  if (horizontal) {
    return (
      <MediaCard
        title={item.title}
        description={item.description}
        thumbnail={null}
        media={icon}
        mediaPlacement="start"
        renderAsPressable={false}
        styles={{
          root: { flex: 1, minWidth: 0, ...customStyles.root },
          layoutContainer: { alignItems: "center" },
          contentContainer: { flex: 1, minWidth: 0 },
          textContainer: { width: "100%", minWidth: 0 },
          mediaContainer: {
            flexBasis: "auto",
            flexGrow: 0,
            paddingLeft: 16,
          },
        }}
      />
    );
  }

  return (
    <MediaCard
      title={item.title}
      description={item.description}
      thumbnail={icon}
      renderAsPressable={false}
      styles={{
        root: { flex: 1, minWidth: 0, ...customStyles.root },
        contentContainer: { flex: "1 1 100%", width: "100%", minWidth: 0 },
        textContainer: { width: "100%", minWidth: 0 },
      }}
    />
  );
}
