import React from 'react';
import { Pressable } from 'react-native';
import { HStack, VStack } from '@coinbase/cds-mobile/layout';
import { IconButton } from '@coinbase/cds-mobile/buttons';
import { Text } from '@coinbase/cds-mobile/typography/Text';
import { Card } from '@coinbase/cds-mobile/cards';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconName } from '@coinbase/cds-icons';

export type TabItem = {
  id: string;
  label: string;
  icon: IconName;
};

type BottomTabBarProps = {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
};

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  tabs,
  activeTab,
  onTabPress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Card
      style={{
        paddingBottom: insets.bottom,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0, 0, 0, 0.1)',
      }}
    >
      <HStack justifyContent="space-around" padding={2}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => onTabPress(tab.id)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : activeTab === tab.id ? 1 : 0.5,
            })}
          >
            <VStack gap={1} alignItems="center">
              <IconButton
                name={tab.icon}
                accessibilityLabel={tab.label}
                variant={activeTab === tab.id ? "primary" : "tertiary"}
                compact
              />
              <Text
                font="label2"
                color={activeTab === tab.id ? "fgPrimary" : "fgMuted"}
              >
                {tab.label}
              </Text>
            </VStack>
          </Pressable>
        ))}
      </HStack>
    </Card>
  );
};
