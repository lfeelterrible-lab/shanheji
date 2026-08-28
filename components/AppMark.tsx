import { Mountain } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme, typography } from '@/components/theme';

export function AppMark({ compact = false }: { compact?: boolean }) {
  const theme = useAppTheme();
  return (
    <View style={styles.row}>
      <View style={[styles.mark, { backgroundColor: theme.accentSoft }]}>
        <Mountain size={compact ? 15 : 18} color={theme.accent} strokeWidth={2.2} />
      </View>
      <View>
        <Text style={[styles.name, { color: theme.text, fontSize: compact ? 15 : 17 }]}>山河记</Text>
        {!compact ? <Text style={[styles.internal, { color: theme.muted }]}>GEOCARD CHINA</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  name: { ...typography.bodyStrong, letterSpacing: 0.2 },
  internal: { ...typography.label, fontSize: 8, lineHeight: 11, letterSpacing: 1.5, marginTop: 1 },
});
