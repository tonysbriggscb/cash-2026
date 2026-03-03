import { VStack } from "@coinbase/cds-web/layout";
import { Text } from "@coinbase/cds-web/typography/Text";
import { SectionHeader } from "@coinbase/cds-web/section-header";
import { Accordion } from "@coinbase/cds-web/accordion/Accordion";
import { AccordionItem } from "@coinbase/cds-web/accordion/AccordionItem";

import { useRegion } from "../../RegionContext";
import type { TransactionsData } from "./data";
import { CashListCell, CryptoIcon, descriptionLabel2, formatBalance } from "./shared";

export function TransactionsSection({ data }: { data: TransactionsData }) {
  const { region } = useRegion();
  const openOrderCount = data.openOrders.length;

  const formatHistoryDetail = (item: (typeof data.history)[number]) => {
    if (item.amountGBP != null && item.isCredit != null) {
      const prefix = item.isCredit ? "+" : "-";
      return `${prefix}${formatBalance(Math.abs(item.amountGBP), region)}`;
    }
    return item.detail;
  };

  return (
    <VStack gap={0} style={{ paddingTop: 16, paddingBottom: 16 }}>
      <SectionHeader
        title={
          <Text as="h3" display="block" font="title3">
            Transactions
          </Text>
        }
        paddingX={3}
      />

      {/* Open orders — self-contained block; adjust paddingBottom to control gap to History */}
      <div style={{ paddingBottom: 24 }}>
        <VStack gap={0} className="cash-open-orders-accordion">
          <Accordion defaultActiveKey="open-orders">
            <AccordionItem
              itemKey="open-orders"
              title={`Open orders (${openOrderCount})`}
            >
              {data.openOrders.map((order, index) => (
                <div
                  key={order.title}
                  className={
                    index === 0
                      ? "open-orders-first-row"
                      : index === data.openOrders.length - 1
                        ? "open-orders-last-row"
                        : undefined
                  }
                  style={{ width: "100%" }}
                >
                  <CashListCell
                    title={order.title}
                    description={order.description}
                    detail={order.detail}
                    multiline
                    subdetailNode={
                      <Text font="label2" display="block" textAlign="end" color="fgMuted">
                        {order.subdetail}
                      </Text>
                    }
                    media={<CryptoIcon symbol={order.cryptoSymbol as any} />}
                  />
                </div>
              ))}
            </AccordionItem>
          </Accordion>
        </VStack>
      </div>

      {/* History */}
      <div>
        <Text
          as="h4"
          display="block"
          font="label1"
          color="fg"
          style={{ marginTop: 0, marginBottom: 8, paddingLeft: 24, paddingRight: 24 }}
        >
          History
        </Text>

        <VStack gap={0}>
          {data.history.map((item) => (
            <CashListCell
              key={item.title + item.date}
              title={item.title}
              description={item.date}
              detail={formatHistoryDetail(item)}
              multiline
              subdetailNode={
                <Text font="label2" display="block" textAlign="end" color="fgMuted">
                  {item.relativeTime}
                </Text>
              }
              media={<CryptoIcon symbol={item.cryptoSymbol as any} />}
              styles={{ description: descriptionLabel2 }}
            />
          ))}
        </VStack>
      </div>
    </VStack>
  );
}
