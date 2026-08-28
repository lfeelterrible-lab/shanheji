import { BookOpenCheck, Lightbulb, Sparkles } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { ReasoningChain } from '@/components/ReasoningChain';
import { useAppTheme, typography } from '@/components/theme';
import type { Rating } from '@/types/geography';
import type { GeographyCard } from '@/types/geography';

type KnowledgeCardProps = {
  card: GeographyCard;
  answerCorrect?: boolean | null;
  onRate?: (rating: Rating) => void;
  onContinue: () => void;
  showRating?: boolean;
  continueLabel?: string;
};

const ratingCopy: { rating: Rating; label: string; hint: string }[] = [
  { rating: 'forgot', label: '忘了', hint: '今天再来' },
  { rating: 'fuzzy', label: '模糊', hint: '明天复习' },
  { rating: 'remembered', label: '记得', hint: '按间隔推进' },
];

export function KnowledgeCard({
  card,
  answerCorrect = null,
  onRate,
  onContinue,
  showRating = true,
  continueLabel = '下一张',
}: KnowledgeCardProps) {
  const theme = useAppTheme();
  return (
    <Animated.View entering={FadeInDown.duration(260)} style={styles.wrap}>
      {answerCorrect !== null ? (
        <View style={[styles.feedback, { backgroundColor: answerCorrect ? theme.successSoft : theme.dangerSoft }]}>
          <Sparkles size={16} color={answerCorrect ? theme.success : theme.danger} />
          <Text style={[styles.feedbackText, { color: answerCorrect ? theme.success : theme.danger }]}>
            {answerCorrect ? '正确 · 这张卡开始进入复习间隔' : '记错了 · 已放回本组稍后复习'}
          </Text>
        </View>
      ) : null}

      <View style={styles.cardHeader}>
        <Text style={[styles.eyebrow, { color: theme.accent }]}>{card.category.toUpperCase()}</Text>
        <Text style={[styles.title, { color: theme.text }]}>{card.title}</Text>
        <Text style={[styles.subtitle, { color: theme.mutedStrong }]}>{card.subtitle}</Text>
      </View>

      <View style={[styles.section, { borderColor: theme.line }]}>
        <Text style={[styles.sectionLabel, { color: theme.muted }]}>核心</Text>
        <Text style={[styles.core, { color: theme.text }]}>{card.coreFact}</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: theme.muted }]}>记住</Text>
        <View style={styles.points}>
          {card.keyPoints.map((point) => (
            <View key={point} style={styles.pointRow}>
              <View style={[styles.pointDot, { backgroundColor: theme.accent }]} />
              <Text style={[styles.point, { color: theme.text }]}>{point}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.reasoningSection, { backgroundColor: theme.surface }]}>
        <View style={styles.reasoningHeader}>
          <BookOpenCheck size={17} color={theme.accent} />
          <Text style={[styles.sectionLabel, { color: theme.muted }]}>为什么？</Text>
        </View>
        <ReasoningChain items={card.reasoning} />
      </View>

      <View style={[styles.tip, { backgroundColor: theme.accentSoft }]}>
        <Lightbulb size={17} color={theme.accent} />
        <View style={styles.tipCopy}>
          <Text style={[styles.tipLabel, { color: theme.accent }]}>记忆提示</Text>
          <Text style={[styles.tipText, { color: theme.text }]}>{card.memoryTip}</Text>
        </View>
      </View>

      {showRating && onRate ? (
        <View style={styles.ratingBlock}>
          <Text style={[styles.sectionLabel, { color: theme.muted }]}>这张卡，你现在记得吗？</Text>
          <View style={styles.ratingRow}>
            {ratingCopy.map((item) => (
              <Pressable
                key={item.rating}
                accessibilityRole="button"
                onPress={() => onRate(item.rating)}
                style={({ pressed }) => [styles.ratingButton, { borderColor: theme.line, backgroundColor: theme.surfaceElevated, opacity: pressed ? 0.78 : 1 }]}
              >
                <Text style={[styles.ratingLabel, { color: theme.text }]}>{item.label}</Text>
                <Text style={[styles.ratingHint, { color: theme.muted }]}>{item.hint}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <Pressable
        accessibilityRole="button"
        onPress={onContinue}
        style={({ pressed }) => [styles.continue, { backgroundColor: theme.text, opacity: pressed ? 0.84 : 1 }]}
      >
        <Text style={[styles.continueText, { color: theme.bg }]}>{continueLabel}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 18 },
  feedback: { minHeight: 42, borderRadius: 13, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 9 },
  feedbackText: { ...typography.caption, fontWeight: '700' },
  cardHeader: { paddingTop: 2 },
  eyebrow: { ...typography.label, marginBottom: 8 },
  title: { ...typography.display },
  subtitle: { ...typography.body, marginTop: 5 },
  section: { borderTopWidth: 1, paddingTop: 15, gap: 10 },
  sectionLabel: { ...typography.label, fontSize: 11, letterSpacing: 1.6 },
  core: { ...typography.heading, lineHeight: 30 },
  points: { gap: 9 },
  pointRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  pointDot: { width: 6, height: 6, borderRadius: 3, marginTop: 8 },
  point: { ...typography.body, flex: 1 },
  reasoningSection: { borderRadius: 16, padding: 15, gap: 10 },
  reasoningHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tip: { borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  tipCopy: { flex: 1, gap: 3 },
  tipLabel: { ...typography.label, fontSize: 10, letterSpacing: 1.3 },
  tipText: { ...typography.caption, lineHeight: 20 },
  ratingBlock: { gap: 10 },
  ratingRow: { flexDirection: 'row', gap: 8 },
  ratingButton: { flex: 1, minHeight: 58, borderRadius: 14, borderWidth: 1, paddingVertical: 9, alignItems: 'center', justifyContent: 'center', gap: 3 },
  ratingLabel: { ...typography.bodyStrong, fontSize: 14 },
  ratingHint: { ...typography.caption, fontSize: 11 },
  continue: { height: 56, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  continueText: { ...typography.bodyStrong },
});
