import { VStack, HStack } from "@coinbase/cds-web/layout";
import { Text } from "@coinbase/cds-web/typography/Text";
import { SectionHeader } from "@coinbase/cds-web/section-header";

import type { DoMoreWithCashData, DoMoreItem } from "./data";
import { SecondaryIconBox } from "./shared";
import { useRegion } from "../../RegionContext";

function DoMoreCard({
  item,
  fullWidth,
}: {
  item: DoMoreItem;
  fullWidth?: boolean;
}) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        backgroundColor: "var(--color-bgAlternate)",
        borderRadius: 24,
        paddingTop: 16,
        paddingRight: 16,
        paddingBottom: 16,
        paddingLeft: 16,
        display: "flex",
        flexDirection: fullWidth ? "row" : "column",
        alignItems: fullWidth ? "center" : "stretch",
        gap: 12,
      }}
    >
      <SecondaryIconBox name={item.icon} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
        <Text font="headline" display="block">{item.title}</Text>
        <Text font="label2" color="fgMuted" display="block" style={{ whiteSpace: "pre-line" }}>{item.description}</Text>
      </div>
    </div>
  );
}

export function DoMoreSection({ data }: { data: DoMoreWithCashData }) {
  const { region } = useRegion();
  const items = data.items.filter((i) => !i.region || i.region === region);

  // Chunk into rows of 2
  const rows: DoMoreItem[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }

  return (
    <VStack gap={0} style={{ paddingTop: 16, paddingBottom: 24 }}>
      <SectionHeader
        title={
          <Text as="h3" display="block" font="title3">
            Do more with your cash
          </Text>
        }
        paddingX={3}
      />
      <VStack gap={0} style={{ paddingLeft: 24, paddingRight: 24, gap: 12 }}>
        {rows.map((row, rowIdx) => (
          <HStack key={rowIdx} gap={0} style={{ width: "100%", minWidth: 0, gap: 12 }}>
            {row.map((item) => (
              <DoMoreCard
                key={item.title}
                item={item}
                fullWidth={row.length === 1}
              />
            ))}
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}
