import { Tabs } from 'expo-router';
import { BookOpen, Library, RotateCcw, UserRound } from 'lucide-react-native';

import { useAppTheme } from '@/components/theme';

export default function TabLayout() {
  const theme = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.muted,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.line,
          borderTopWidth: 1,
          height: 72,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarItemStyle: { paddingHorizontal: 4 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '学习',
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} strokeWidth={2.1} />,
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: '复习',
          tabBarIcon: ({ color, size }) => <RotateCcw color={color} size={size} strokeWidth={2.1} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: '知识库',
          tabBarIcon: ({ color, size }) => <Library color={color} size={size} strokeWidth={2.1} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} strokeWidth={2.1} />,
        }}
      />
    </Tabs>
  );
}
