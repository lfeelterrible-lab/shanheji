import { ChevronDown } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme, typography } from '@/components/theme';

export function ReasoningChain({ items }: { items: string[] }) {
  const theme = useAppTheme();
  return (
    <View style={styles.wrap}>
      {items.map((item, index) => (
        <View key={`${item}-${index}`} style={styles.item}>
          <View style={styles.rail}>
            <View style={[styles.dot, { backgroundColor: index === items.length - 1 ? theme.accent : theme.line }]} />
            {index < items.length - 1 ? <View style={[styles.line, { backgroundColor: theme.line }]} /> : null}
          </View>
          <Text style={[styles.text, { color: theme.text }]}>{item}</Text>
          {index < items.length - 1 ? <ChevronDown size={14} color={theme.muted} style={styles.chevron} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: 2 },
  item: { minHeight: 40, flexDirection: 'row', alignItems: 'center' },
  rail: { width: 18, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  dot: { width: 7, height: 7, borderRadius: 4, zIndex: 1 },
  line: { position: 'absolute', width: 1, top: 0, bottom: 0 },
  text: { ...typography.body, flex: 1 },
  chevron: { marginLeft: 7 },
});
