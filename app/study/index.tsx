import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KnowledgeCard } from '@/components/KnowledgeCard';
import { ProgressBar } from '@/components/ProgressBar';
import { StudyCard } from '@/components/StudyCard';
import { useAppTheme, typography } from '@/components/theme';
import { getCard } from '@/lib/geography';
import { useStudyStore, type SessionMode } from '@/store/useStudyStore';
import type { Rating } from '@/types/geography';

export default function StudyScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const selectedMode: SessionMode = params.mode === 'review' ? 'review' : 'learn';
  const session = useStudyStore((state) => state.session);
  const startSession = useStudyStore((state) => state.startSession);
  const answerCard = useStudyStore((state) => state.answerCard);
  const rateCard = useStudyStore((state) => state.rateCard);
  const advanceSession = useStudyStore((state) => state.advanceSession);
  const [selection, setSelection] = useState<string | string[] | null>(null);

  useEffect(() => {
    if (!session || (!session.completed && session.mode !== selectedMode)) {
      startSession(selectedMode);
    }
  }, [selectedMode, session, startSession]);

  useEffect(() => {
    setSelection(session?.answer?.selected ?? null);
  }, [session?.currentIndex, session?.answer?.selected]);

  const currentCard = useMemo(() => {
    if (!session || session.completed) return undefined;
    return getCard(session.queue[session.currentIndex]);
  }, [session]);

  const handleSelect = async (value: string | string[]) => {
    if (!currentCard || session?.answer) return;
    setSelection(value);
    const correct = answerCard(currentCard.id, value);
    try {
      await Haptics.notificationAsync(
        correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error,
      );
    } catch {
      // Haptics are optional on simulators and web.
    }
  };

  const handleToggle = (value: string) => {
    if (session?.answer) return;
    const current = Array.isArray(selection) ? selection : [];
    setSelection(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const handleSubmit = () => {
    if (!Array.isArray(selection) || selection.length === 0) return;
    void handleSelect(selection);
  };

  const handleRate = (rating: Rating) => {
    if (!session?.answer) return;
    rateCard(session.answer.cardId, rating);
    void Haptics.selectionAsync().catch(() => undefined);
  };

  if (!session || !currentCard && !session.completed) {
    return <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} />;
  }

  if (session.completed) {
    return <CompletionScreen session={session} onHome={() => router.back()} onAgain={() => startSession(selectedMode)} />;
  }
  if (!currentCard) {
    return <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} />;
  }

  const answered = Boolean(session.answer);
  const queueCount = Math.max(session.initialCount, session.queue.length);
  const shownNumber = Math.min(queueCount, session.currentIndex + 1);
  const progressValue = Math.min(1, shownNumber / Math.max(1, queueCount));

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.safe, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable accessibilityLabel="退出学习" accessibilityRole="button" onPress={() => router.back()} style={styles.closeButton}>
            <X size={20} color={theme.text} />
          </Pressable>
          <View style={styles.progressCopy}>
            <Text style={[styles.mode, { color: theme.muted }]}>{session.mode === 'review' ? '复习' : '今日新学'}</Text>
            <Text style={[styles.number, { color: theme.text }]}>{shownNumber} / {session.initialCount}</Text>
          </View>
          <View style={styles.topSpacer} />
        </View>
        <ProgressBar value={progressValue} color={theme.accent} />

        {!answered ? (
          <View style={styles.questionArea}>
            <StudyCard
              card={currentCard}
              selected={selection}
              answered={false}
              answerCorrect={null}
              onSelect={(value) => void handleSelect(value)}
              onToggle={handleToggle}
              onSubmit={handleSubmit}
            />
            <Text style={[styles.footerHint, { color: theme.muted }]}>不确定？先猜。答案会在下一步解释。</Text>
          </View>
        ) : (
          <View style={styles.knowledgeArea}>
            <KnowledgeCard
              card={currentCard}
              answerCorrect={session.answer?.correct ?? null}
              onRate={handleRate}
              onContinue={() => {
                setSelection(null);
                advanceSession();
              }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function CompletionScreen({
  session,
  onHome,
  onAgain,
}: {
  session: NonNullable<ReturnType<typeof useStudyStore.getState>['session']>;
  onHome: () => void;
  onAgain: () => void;
}) {
  const theme = useAppTheme();
  if (!session) return null;
  const attempted = session.correctCount + session.wrongCount;
  const accuracy = attempted ? Math.round((session.correctCount / attempted) * 100) : 0;

  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View style={styles.completeContent}>
        <Text style={[styles.completeKicker, { color: theme.accent }]}>这一组完成</Text>
        <Text style={[styles.completeTitle, { color: theme.text }]}>今天的山河，{`\n`}先走到这里。</Text>
        <View style={[styles.completeRule, { backgroundColor: theme.line }]} />
        <View style={styles.completeStats}>
          <View>
            <Text style={[styles.completeNumber, { color: theme.text }]}>{session.initialCount}</Text>
            <Text style={[styles.completeLabel, { color: theme.muted }]}>张卡片</Text>
          </View>
          <View>
            <Text style={[styles.completeNumber, { color: theme.text }]}>{accuracy}%</Text>
            <Text style={[styles.completeLabel, { color: theme.muted }]}>本组正确率</Text>
          </View>
        </View>
        <Text style={[styles.completeHint, { color: theme.mutedStrong }]}>答错的卡片已经重新放回学习队列。{`\n`}下次打开，它们还会等你。</Text>
        <View style={styles.completeActions}>
          <Pressable accessibilityRole="button" onPress={onHome} style={({ pressed }) => [styles.primaryAction, { backgroundColor: theme.text, opacity: pressed ? 0.82 : 1 }]}>
            <Text style={[styles.primaryActionText, { color: theme.bg }]}>回到今天</Text>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={onAgain} style={({ pressed }) => [styles.secondaryAction, { borderColor: theme.line, opacity: pressed ? 0.72 : 1 }]}>
            <Text style={[styles.secondaryActionText, { color: theme.text }]}>再学一组</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 8, paddingBottom: 42 },
  topBar: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  closeButton: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  progressCopy: { alignItems: 'center', gap: 2 },
  mode: { ...typography.caption },
  number: { ...typography.bodyStrong, fontSize: 13 },
  topSpacer: { width: 38 },
  questionArea: { marginTop: 43, gap: 25 },
  knowledgeArea: { marginTop: 31 },
  footerHint: { ...typography.caption, textAlign: 'center' },
  completeContent: { flex: 1, paddingHorizontal: 30, paddingTop: 90 },
  completeKicker: { ...typography.label },
  completeTitle: { ...typography.display, marginTop: 14 },
  completeRule: { height: 1, marginTop: 34 },
  completeStats: { flexDirection: 'row', gap: 56, marginTop: 31 },
  completeNumber: { fontSize: 35, lineHeight: 40, fontWeight: '700' },
  completeLabel: { ...typography.caption, marginTop: 4 },
  completeHint: { ...typography.body, marginTop: 39 },
  completeActions: { gap: 11, marginTop: 45 },
  primaryAction: { height: 56, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  primaryActionText: { ...typography.bodyStrong },
  secondaryAction: { height: 56, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  secondaryActionText: { ...typography.bodyStrong },
});
