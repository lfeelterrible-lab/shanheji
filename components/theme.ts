import { useColorScheme } from 'react-native';

import { useStudyStore } from '@/store/useStudyStore';

export type AppTheme = {
  isDark: boolean;
  mode: 'system' | 'light' | 'dark';
  bg: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  muted: string;
  mutedStrong: string;
  line: string;
  accent: string;
  accentSoft: string;
  success: string;
  successSoft: string;
  danger: string;
  dangerSoft: string;
  tabBar: string;
  mapFill: string;
  mapLine: string;
};

const lightTheme: AppTheme = {
  isDark: false, mode: 'light', bg: '#F7F6F2', surface: '#FFFEFB', surfaceElevated: '#FFFFFF', text: '#18201D', muted: '#7A817D', mutedStrong: '#56605B', line: '#E5E3DC', accent: '#B54A37', accentSoft: '#F3E1DB', success: '#2E745D', successSoft: '#E2F0E8', danger: '#B55243', dangerSoft: '#F5E2DE', tabBar: '#FBFAF7', mapFill: '#ECE9E1', mapLine: '#C8C7C0',
};

const darkTheme: AppTheme = {
  ...lightTheme, isDark: true, mode: 'dark', bg: '#1B1E1C', surface: '#242825', surfaceElevated: '#2B302C', text: '#F5F0E7', muted: '#A0A9A2', mutedStrong: '#C2C9C3', line: '#3B423D', accent: '#D47A63', accentSoft: '#3D2B28', success: '#79BE9C', successSoft: '#263B31', danger: '#DF907D', dangerSoft: '#432E2A', tabBar: '#202420', mapFill: '#303631', mapLine: '#58615A',
};

export function useAppTheme(): AppTheme {
  const mode = useStudyStore((state) => state.themeMode);
  const system = useColorScheme();
  const selected = mode === 'system' ? system ?? 'light' : mode;
  return selected === 'dark' ? { ...darkTheme, mode } : { ...lightTheme, mode };
}

export const typography = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: '700' as const, letterSpacing: -1.1 },
  title: { fontSize: 25, lineHeight: 31, fontWeight: '700' as const, letterSpacing: -0.5 },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '700' as const, letterSpacing: -0.2 },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' as const },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: '600' as const },
  label: { fontSize: 12, lineHeight: 16, fontWeight: '700' as const, letterSpacing: 1.2 },
  caption: { fontSize: 13, lineHeight: 19, fontWeight: '500' as const },
};
