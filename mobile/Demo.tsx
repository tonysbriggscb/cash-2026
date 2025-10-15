import { View, ScrollView } from 'react-native';
import { Button } from "@coinbase/cds-mobile/buttons";
import { VStack, HStack } from "@coinbase/cds-mobile/layout";
import { Text } from "@coinbase/cds-mobile/typography/Text";
import { IconButton } from "@coinbase/cds-mobile/buttons";
import { NavBarIconButton } from "@coinbase/cds-mobile/navigation/NavBarIconButton";
import { Card } from "@coinbase/cds-mobile/cards";
import { TopNavBar } from '@coinbase/cds-mobile/navigation/TopNavBar';
import { NavigationTitle } from '@coinbase/cds-mobile/navigation/NavigationTitle';
import { useState } from 'react';
import { BottomTabBar, type TabItem } from './components/BottomTabBar';

const TABS: TabItem[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'assets', label: 'Assets', icon: 'wallet' },
  { id: 'trade', label: 'Trade', icon: 'chartLine' },
  { id: 'profile', label: 'Profile', icon: 'profile' },
];

export const Demo = () => {
  const [activeTab, setActiveTab] = useState('home');
  
  const handleAction = (action: string) => {
    console.log(`${action} action triggered`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <ScrollView>
            <VStack gap={3} padding={4}>
              <Card>
                <VStack gap={4} padding={4}>
                  <Text font="headline">Quick Actions</Text>
                  <HStack gap={2} justifyContent="space-around">
                    <VStack alignItems="center" gap={1}>
                      <IconButton
                        name="arrowUp"
                        accessibilityLabel="Send"
                        variant="primary"
                        onPress={() => handleAction("send")}
                      />
                      <Text font="label2">Send</Text>
                    </VStack>
                    <VStack alignItems="center" gap={1}>
                      <IconButton
                        name="arrowDown"
                        accessibilityLabel="Receive"
                        variant="primary"
                        onPress={() => handleAction("receive")}
                      />
                      <Text font="label2">Receive</Text>
                    </VStack>
                    <VStack alignItems="center" gap={1}>
                      <IconButton
                        name="add"
                        accessibilityLabel="Buy"
                        variant="primary"
                        onPress={() => handleAction("buy")}
                      />
                      <Text font="label2">Buy</Text>
                    </VStack>
                  </HStack>
                </VStack>
              </Card>

              <Card>
                <VStack gap={3} padding={4}>
                  <Text font="headline">Recent Activity</Text>
                  <VStack gap={2}>
                    {[1, 2, 3].map((i) => (
                      <HStack key={i} justifyContent="space-between" alignItems="center">
                        <HStack gap={2} alignItems="center">
                          <IconButton
                            name={i % 2 === 0 ? "arrowUp" : "arrowDown"}
                            accessibilityLabel="Transaction"
                            variant="tertiary"
                            compact
                          />
                          <VStack>
                            <Text font="label1">{i % 2 === 0 ? 'Sent BTC' : 'Received ETH'}</Text>
                            <Text font="label2" color="fgMuted">2 hours ago</Text>
                          </VStack>
                        </HStack>
                        <Text font="label1" color={i % 2 === 0 ? "fgNegative" : "fgPositive"}>
                          {i % 2 === 0 ? '-0.1 BTC' : '+2.5 ETH'}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </VStack>
              </Card>
            </VStack>
          </ScrollView>
        );
      case 'assets':
        return (
          <VStack padding={4}>
            <Text>Assets Content</Text>
          </VStack>
        );
      default:
        return (
          <VStack padding={4}>
            <Text>Coming Soon</Text>
          </VStack>
        );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TopNavBar
        start={<NavBarIconButton name="menu" accessibilityLabel="Menu" />}
        end={
          <HStack>
            <NavBarIconButton name="qrCode" accessibilityLabel="Scan" />
            <NavBarIconButton name="bell" accessibilityLabel="Notifications" />
          </HStack>
        }
      >
        <NavigationTitle>Coinbase</NavigationTitle>
      </TopNavBar>

      {renderContent()}

      <BottomTabBar
        tabs={TABS}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
    </View>
  );
};
