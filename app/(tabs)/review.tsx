import { AlertCircle, ArrowUpRight, RotateCcw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppMark } from '@/components/AppMark';
import { useAppTheme, typography } from '@/components/theme';
import { chapterMeta, getCard } from '@/lib/geography';
import { isDue } from '@/lib/scheduler';
import { selectDueCount, useStudyStore } from '@/store/useStudyStore';

export default function ReviewScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const progress = useStudyStore((state) => state.progress);
  const dueCount = useStudyStore(selectDueCount);
  const hardCardIds = Object.values(progress)
    .filter((item) => item.wrongCount > 0)
    .sort((a, b) => b.wrongCount - a.wrongCount)
    .slice(0, 4)
    .map((item) => item.cardId);

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AppMark compact />
          <RotateCcw size={19} color={theme.muted} />
        </View>

        <View style={styles.hero}>
          <Text style={[styles.eyebrow, { color: theme.accent }]}>复习</Text>
          <Text style={[styles.title, { color: theme.text }]}>今天待复习</Text>
          <View style={styles.countLine}>
            <Text style={[styles.count, { color: theme.text }]}>{dueCount}</Text>
            <Text style={[styles.countUnit, { color: theme.muted }]}>张</Text>
          </View>
          <Text style={[styles.sub, { color: theme.muted }]}>把快要忘记的内容，刚好捞回来。</Text>
        </View>

        <View style={[styles.breakdown, { borderTopColor: theme.line, borderBottomColor: theme.line }]}>
          {chapterMeta.slice(1, 6).map((chapter) => {
            const count = Object.values(progress).filter((item) => {
              const card = getCard(item.cardId);
              return card?.category === chapter.id && isDue(item.nextReviewAt);
            }).length;
            return (
              <View key={chapter.id} style={styles.breakdownRow}>
                <View style={styles.breakdownLabel}>
                  <View style={[styles.dot, { backgroundColor: chapter.tone }]} />
                  <Text style={[styles.breakdownText, { color: theme.mutedStrong }]}>{chapter.shortLabel}</Text>
                </View>
                <Text style={[styles.breakdownCount, { color: theme.text }]}>{count}</Text>
              </View>
            );
          })}
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push({ pathname: '/study', params: { mode: 'review' } })}
          style={({ pressed }) => [styles.start, { backgroundColor: theme.text, opacity: pressed ? 0.84 : 1 }]}
        >
          <Text style={[styles.startText, { color: theme.bg }]}>开始复习</Text>
          <ArrowUpRight size={20} color={theme.bg} />
        </Pressable>

        <View style={styles.hardSection}>
          <View style={styles.sectionHeading}>
            <View>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>最近总忘</Text>
              <Text style={[styles.sectionSub, { color: theme.muted }]}>先复习这些卡片，效率更高。</Text>
            </View>
            <AlertCircle size={19} color={theme.accent} />
          </View>
          <View style={styles.hardList}>
            {hardCardIds.map((id) => {
              const card = getCard(id);
              if (!card) return null;
              return (
                <Pressable
                  key={id}
                  accessibilityRole="button"
                  onPress={() => router.push({ pathname: '/card/[id]', params: { id } })}
                  style={({ pressed }) => [styles.hardRow, { borderBottomColor: theme.line, opacity: pressed ? 0.7 : 1 }]}
                >
                  <View style={styles.hardCopy}>
                    <Text style={[styles.hardTitle, { color: theme.text }]}>{card.title}</Text>
                    <Text style={[styles.hardSubtitle, { color: theme.muted }]}>{card.subtitle}</Text>
                  </View>
                  <Text style={[styles.chevron, { color: theme.muted }]}>›</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 36 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  hero: { marginTop: 49, marginBottom: 32 },
  eyebrow: { ...typography.label, marginBottom: 11 },
  title: { ...typography.display, fontSize: 31 },
  countLine: { flexDirection: 'row', alignItems: 'baseline', gap: 5, marginTop: 8 },
  count: { fontSize: 58, lineHeight: 64, fontWeight: '700', letterSpacing: -2 },
  countUnit: { ...typography.body },
  sub: { ...typography.body, marginTop: 5 },
  breakdown: { borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: 6 },
  breakdownRow: { height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  breakdownLabel: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  breakdownText: { ...typography.body },
  breakdownCount: { ...typography.bodyStrong },
  start: { height: 57, borderRadius: 17, marginTop: 25, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  startText: { ...typography.bodyStrong, fontSize: 17 },
  hardSection: { marginTop: 50 },
  sectionHeading: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  sectionTitle: { ...typography.heading },
  sectionSub: { ...typography.caption, marginTop: 3 },
  hardList: { marginTop: 18 },
  hardRow: { minHeight: 66, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center' },
  hardCopy: { flex: 1, gap: 3 },
  hardTitle: { ...typography.bodyStrong },
  hardSubtitle: { ...typography.caption },
  chevron: { fontSize: 28, lineHeight: 28, fontWeight: '300' },
});
