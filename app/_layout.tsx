import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useAppTheme } from '@/components/theme';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const theme = useAppTheme();

  return (
    <ThemeProvider value={theme.isDark ? DarkTheme : DefaultTheme}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="study" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="card/[id]" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </ThemeProvider>
  );
}
