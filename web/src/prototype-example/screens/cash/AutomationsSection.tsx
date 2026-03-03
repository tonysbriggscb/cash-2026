import { useState } from "react";
import { VStack } from "@coinbase/cds-web/layout";
import { Text } from "@coinbase/cds-web/typography/Text";
import { SectionHeader } from "@coinbase/cds-web/section-header";
import { Switch } from "@coinbase/cds-web/controls/Switch";

import { useRegion } from "../../RegionContext";
import type { AutomationsData, AutomationItem } from "./data";
import { AutomationListCell } from "./shared";

const HIDE_IN_UK_TITLES = ["Hold cash as USDC", "Direct deposit"];

function ToggleItem({ item }: { item: AutomationItem }) {
  const [checked, setChecked] = useState(item.toggleDefaultChecked ?? true);
  return (
    <AutomationListCell
      item={item}
      renderAsPressable={false}
      end={
        <Switch
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          accessibilityLabel={item.title}
        />
      }
    />
  );
}

export function AutomationsSection({ data }: { data: AutomationsData }) {
  const { region } = useRegion();
  const items =
    region === "UK"
      ? data.items.filter((item) => !HIDE_IN_UK_TITLES.includes(item.title))
      : data.items;

  return (
    <VStack gap={0} style={{ paddingTop: 16, paddingBottom: 16 }}>
      <SectionHeader
        title={
          <Text as="h3" display="block" font="title3">
            Automations
          </Text>
        }
        paddingX={3}
      />
      <VStack gap={0}>
        {items.map((item) =>
          item.endType === "toggle" ? (
            <ToggleItem key={item.title} item={item} />
          ) : (
            <AutomationListCell key={item.title} item={item} />
          )
        )}
      </VStack>
    </VStack>
  );
}
