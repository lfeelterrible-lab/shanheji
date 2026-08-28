import { ArrowUpRight, Clock3, Flame } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppMark } from '@/components/AppMark';
import { ProgressBar } from '@/components/ProgressBar';
import { useAppTheme, typography } from '@/components/theme';
import { chapterMeta, chapterProgress, overallMastery } from '@/lib/geography';
import { selectDueCount, selectTodayNewCount, useStudyStore } from '@/store/useStudyStore';

export default function TodayScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const progress = useStudyStore((state) => state.progress);
  const streak = useStudyStore((state) => state.streak);
  const dueCount = useStudyStore(selectDueCount);
  const newCount = useStudyStore(selectTodayNewCount);
  const mastery = overallMastery(progress);
  const dateLabel = new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <AppMark />
          <Text style={[styles.date, { color: theme.muted }]}>{dateLabel}</Text>
        </View>

        <View style={styles.intro}>
          <Text style={[styles.eyebrow, { color: theme.accent }]}>今天</Text>
          <Text style={[styles.title, { color: theme.text }]}>把中国地理，{`\n`}一张一张记进脑子里。</Text>
        </View>

        <View style={[styles.metrics, { borderTopColor: theme.line, borderBottomColor: theme.line }]}>
          <View style={styles.metric}>
            <Text style={[styles.metricNumber, { color: theme.text }]}>{newCount || 10}</Text>
            <Text style={[styles.metricLabel, { color: theme.muted }]}>新知识</Text>
          </View>
          <View style={[styles.metricDivider, { backgroundColor: theme.line }]} />
          <View style={styles.metric}>
            <Text style={[styles.metricNumber, { color: theme.text }]}>{dueCount}</Text>
            <Text style={[styles.metricLabel, { color: theme.muted }]}>待复习</Text>
          </View>
          <View style={[styles.metricDivider, { backgroundColor: theme.line }]} />
          <View style={styles.metric}>
            <Text style={[styles.metricNumber, { color: theme.text }]}>15</Text>
            <Text style={[styles.metricLabel, { color: theme.muted }]}>分钟</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/study')}
          style={({ pressed }) => [styles.startButton, { backgroundColor: theme.text, opacity: pressed ? 0.84 : 1 }]}
        >
          <Text style={[styles.startText, { color: theme.bg }]}>开始学习</Text>
          <ArrowUpRight size={20} color={theme.bg} strokeWidth={2.2} />
        </Pressable>

        <View style={styles.streakRow}>
          <View style={[styles.flame, { backgroundColor: theme.accentSoft }]}>
            <Flame size={20} color={theme.accent} fill={theme.accentSoft} strokeWidth={2.2} />
          </View>
          <View style={styles.streakCopy}>
            <Text style={[styles.streakTitle, { color: theme.text }]}>连续学习 {streak} 天</Text>
            <Text style={[styles.streakHint, { color: theme.muted }]}>保持今天的节奏，慢慢变熟。</Text>
          </View>
          <Clock3 size={18} color={theme.muted} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeading}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>本周掌握</Text>
            <Text style={[styles.sectionValue, { color: theme.accent }]}>{mastery}%</Text>
          </View>
          <ProgressBar value={mastery / 100} color={theme.accent} />
          <View style={styles.chapterList}>
            {chapterMeta.slice(1, 4).map((chapter) => {
              const summary = chapterProgress(chapter.id, progress);
              return (
                <View key={chapter.id} style={styles.chapterRow}>
                  <View style={styles.chapterLabel}>
                    <View style={[styles.tone, { backgroundColor: chapter.tone }]} />
                    <Text style={[styles.chapterName, { color: theme.mutedStrong }]}>{chapter.label}</Text>
                  </View>
                  <View style={styles.chapterProgress}>
                    <ProgressBar value={summary.percent / 100} color={chapter.tone} />
                  </View>
                  <Text style={[styles.chapterPercent, { color: theme.muted }]}>{summary.percent}%</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={[styles.quote, { borderLeftColor: theme.accent }]}>
          <Text style={[styles.quoteText, { color: theme.mutedStrong }]}>“地理不是背地点，{`\n`}是理解地点为什么在那里。”</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 34 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  date: { ...typography.caption },
  intro: { marginTop: 46, marginBottom: 32 },
  eyebrow: { ...typography.label, marginBottom: 12 },
  title: { ...typography.display, fontSize: 31, lineHeight: 40 },
  metrics: { minHeight: 94, borderTopWidth: 1, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  metric: { flex: 1, alignItems: 'center', gap: 4 },
  metricNumber: { fontSize: 27, lineHeight: 32, fontWeight: '700', letterSpacing: -0.5 },
  metricLabel: { ...typography.caption },
  metricDivider: { width: 1, height: 36 },
  startButton: { height: 58, borderRadius: 17, marginTop: 25, paddingHorizontal: 19, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  startText: { ...typography.bodyStrong, fontSize: 17 },
  streakRow: { flexDirection: 'row', alignItems: 'center', marginTop: 27, gap: 12 },
  flame: { width: 42, height: 42, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  streakCopy: { flex: 1, gap: 2 },
  streakTitle: { ...typography.bodyStrong },
  streakHint: { ...typography.caption },
  section: { marginTop: 46, gap: 14 },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  sectionTitle: { ...typography.heading },
  sectionValue: { ...typography.bodyStrong },
  chapterList: { gap: 13, marginTop: 2 },
  chapterRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  chapterLabel: { width: 112, flexDirection: 'row', alignItems: 'center', gap: 8 },
  tone: { width: 6, height: 6, borderRadius: 3 },
  chapterName: { ...typography.caption },
  chapterProgress: { flex: 1 },
  chapterPercent: { ...typography.caption, width: 34, textAlign: 'right' },
  quote: { borderLeftWidth: 2, paddingLeft: 15, marginTop: 46, marginBottom: 15 },
  quoteText: { ...typography.body, fontStyle: 'italic' },
});
