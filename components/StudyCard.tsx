import { CheckCircle2, CircleHelp, ListChecks } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { AnswerButton, type AnswerFeedback } from '@/components/AnswerButton';
import { GeographyMapCard } from '@/components/GeographyMapCard';
import { useAppTheme, typography } from '@/components/theme';
import type { GeographyCard } from '@/types/geography';

type StudyCardProps = {
  card: GeographyCard;
  selected: string | string[] | null;
  answered: boolean;
  answerCorrect: boolean | null;
  onSelect: (value: string) => void;
  onToggle: (value: string) => void;
  onSubmit: () => void;
};

function selectedValues(selected: string | string[] | null): string[] {
  return selected ? (Array.isArray(selected) ? selected : [selected]) : [];
}

export function StudyCard({
  card,
  selected,
  answered,
  answerCorrect,
  onSelect,
  onToggle,
  onSubmit,
}: StudyCardProps) {
  const theme = useAppTheme();
  const selectedList = selectedValues(selected);
  const isMulti = card.questionType === 'multi';
  const mapState = answered ? (answerCorrect ? 'correct' : 'wrong') : 'neutral';

  const feedbackFor = (option: string): AnswerFeedback => {
    if (!answered) return 'neutral';
    const correct = Array.isArray(card.correctAnswer)
      ? card.correctAnswer.includes(option)
      : card.correctAnswer === option;
    const chosen = selectedList.includes(option);
    if (correct) return 'correct';
    if (chosen) return 'wrong';
    return 'neutral';
  };

  return (
    <Animated.View entering={FadeInDown.duration(260)} style={styles.wrap}>
      <View style={styles.questionMeta}>
        <View style={[styles.metaIcon, { backgroundColor: theme.accentSoft }]}>
          {isMulti ? <ListChecks size={15} color={theme.accent} /> : <CircleHelp size={15} color={theme.accent} />}
        </View>
        <Text style={[styles.category, { color: theme.muted }]}>{card.subtitle}</Text>
        {isMulti ? <Text style={[styles.multiLabel, { color: theme.accent }]}>可多选</Text> : null}
      </View>
      <Text style={[styles.title, { color: theme.text }]}>{card.title}</Text>
      <Text style={[styles.question, { color: theme.text }]}>{card.question}</Text>

      {card.questionType === 'map' && card.mapAsset ? (
        <GeographyMapCard target={card.mapAsset.target} state={mapState} onSelect={onSelect} />
      ) : (
        <View style={styles.options}>
          {card.options.map((option, index) => (
            <AnswerButton
              key={option}
              label={option}
              letter={String.fromCharCode(65 + index)}
              selected={selectedList.includes(option)}
              disabled={answered}
              feedback={feedbackFor(option)}
              onPress={() => (isMulti ? onToggle(option) : onSelect(option))}
            />
          ))}
          {isMulti ? (
            <AnswerButton
              label="确认选择"
              letter="→"
              selected={false}
              disabled={answered || selectedList.length === 0}
              feedback="neutral"
              onPress={onSubmit}
            />
          ) : null}
        </View>
      )}

      {answered ? (
        <View style={[styles.answerNote, { backgroundColor: answerCorrect ? theme.successSoft : theme.dangerSoft }]}>
          {answerCorrect ? <CheckCircle2 size={17} color={theme.success} /> : <CircleHelp size={17} color={theme.danger} />}
          <Text style={[styles.answerText, { color: answerCorrect ? theme.success : theme.danger }]}>
            {answerCorrect ? '答对了，下一步看看为什么。' : '这张会稍后再出现，先把原因记住。'}
          </Text>
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  questionMeta: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  metaIcon: { width: 28, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  category: { ...typography.caption, flex: 1 },
  multiLabel: { ...typography.caption, fontWeight: '700' },
  title: { ...typography.title, marginTop: 4 },
  question: { ...typography.body, marginTop: 3, marginBottom: 7 },
  options: { gap: 10 },
  answerNote: { minHeight: 44, borderRadius: 13, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 9 },
  answerText: { ...typography.caption, fontWeight: '700', flex: 1 },
});
