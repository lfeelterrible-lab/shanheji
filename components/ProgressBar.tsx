import { StyleSheet, View } from 'react-native';
import type { DimensionValue } from 'react-native';

import { useAppTheme } from '@/components/theme';

export function ProgressBar({ value, color }: { value: number; color?: string }) {
  const theme = useAppTheme();
  const width: DimensionValue = `${Math.max(0, Math.min(1, value)) * 100}%`;
  return (
    <View style={[styles.track, { backgroundColor: theme.line }]}>
      <View style={[styles.fill, { width, backgroundColor: color ?? theme.accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 6, borderRadius: 99, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 99 },
});
