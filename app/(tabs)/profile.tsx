import { BarChart3, Database, Monitor, Moon, ShieldCheck, Sun } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppMark } from '@/components/AppMark';
import { useAppTheme, typography } from '@/components/theme';
import { geographyCards, overallMastery } from '@/lib/geography';
import { selectAccuracy, useStudyStore, type ThemeMode } from '@/store/useStudyStore';

const themeOptions: { value: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { value: 'system', label: '跟随系统', Icon: Monitor },
  { value: 'light', label: '浅色', Icon: Sun },
  { value: 'dark', label: '深色', Icon: Moon },
];

export default function ProfileScreen() {
  const theme = useAppTheme();
  const themeMode = useStudyStore((state) => state.themeMode);
  const setThemeMode = useStudyStore((state) => state.setThemeMode);
  const progress = useStudyStore((state) => state.progress);
  const streak = useStudyStore((state) => state.streak);
  const accuracy = useStudyStore(selectAccuracy);
  const mastery = overallMastery(progress);
  const studied = Object.values(progress).filter((item) => item.lastReviewedAt).length;

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AppMark compact />
          <Text style={[styles.headerTitle, { color: theme.muted }]}>我的</Text>
        </View>

        <View style={styles.identity}>
          <View style={[styles.avatar, { backgroundColor: theme.text }]}>
            <Text style={[styles.avatarText, { color: theme.bg }]}>山</Text>
          </View>
          <View style={styles.identityCopy}>
            <Text style={[styles.name, { color: theme.text }]}>我的山河进度</Text>
            <Text style={[styles.identitySub, { color: theme.muted }]}>离线学习 · 数据只保存在本机</Text>
          </View>
        </View>

        <View style={[styles.stats, { borderTopColor: theme.line, borderBottomColor: theme.line }]}>
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: theme.text }]}>{streak}</Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>连续天数</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.line }]} />
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: theme.text }]}>{accuracy}%</Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>答题正确率</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.line }]} />
          <View style={styles.stat}>
            <Text style={[styles.statNumber, { color: theme.text }]}>{mastery}%</Text>
            <Text style={[styles.statLabel, { color: theme.muted }]}>总体掌握</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>学习数据</Text>
          <View style={styles.infoList}>
            <InfoRow Icon={BarChart3} label="已接触知识卡" value={`${studied} / ${geographyCards.length}`} theme={theme} />
            <InfoRow Icon={ShieldCheck} label="本地复习算法" value="已开启" theme={theme} />
            <InfoRow Icon={Database} label="数据存储" value="设备本地" theme={theme} last />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>外观</Text>
          <View style={[styles.themePicker, { borderColor: theme.line, backgroundColor: theme.surface }]}>
            {themeOptions.map(({ value, label, Icon }) => {
              const active = themeMode === value;
              return (
                <Pressable
                  key={value}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => setThemeMode(value)}
                  style={({ pressed }) => [styles.themeOption, { backgroundColor: active ? theme.text : 'transparent', opacity: pressed ? 0.76 : 1 }]}
                >
                  <Icon size={16} color={active ? theme.bg : theme.muted} />
                  <Text style={[styles.themeLabel, { color: active ? theme.bg : theme.mutedStrong }]}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerName, { color: theme.text }]}>山河记</Text>
          <Text style={[styles.footerText, { color: theme.muted }]}>GeoCard China · 本地优先的中国地理学习卡</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({
  Icon,
  label,
  value,
  theme,
  last = false,
}: {
  Icon: typeof BarChart3;
  label: string;
  value: string;
  theme: ReturnType<typeof useAppTheme>;
  last?: boolean;
}) {
  return (
    <View style={[styles.infoRow, !last && { borderBottomColor: theme.line, borderBottomWidth: 1 }]}>
      <Icon size={17} color={theme.muted} />
      <Text style={[styles.infoLabel, { color: theme.mutedStrong }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { ...typography.caption },
  identity: { flexDirection: 'row', alignItems: 'center', marginTop: 49, gap: 14 },
  avatar: { width: 56, height: 56, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 25, fontWeight: '700' },
  identityCopy: { gap: 4 },
  name: { ...typography.heading },
  identitySub: { ...typography.caption },
  stats: { minHeight: 95, borderTopWidth: 1, borderBottomWidth: 1, marginTop: 34, flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center', gap: 5 },
  statNumber: { fontSize: 25, lineHeight: 30, fontWeight: '700' },
  statLabel: { ...typography.caption, fontSize: 11 },
  statDivider: { width: 1, height: 34 },
  section: { marginTop: 43, gap: 13 },
  sectionTitle: { ...typography.heading },
  infoList: { borderTopWidth: 1, borderTopColor: 'transparent' },
  infoRow: { minHeight: 55, flexDirection: 'row', alignItems: 'center', gap: 11 },
  infoLabel: { ...typography.body, flex: 1 },
  infoValue: { ...typography.caption },
  themePicker: { borderWidth: 1, borderRadius: 15, padding: 4, flexDirection: 'row', gap: 3 },
  themeOption: { flex: 1, minHeight: 44, borderRadius: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  themeLabel: { ...typography.caption, fontSize: 11 },
  footer: { marginTop: 54, gap: 5 },
  footerName: { ...typography.bodyStrong },
  footerText: { ...typography.caption },
});
