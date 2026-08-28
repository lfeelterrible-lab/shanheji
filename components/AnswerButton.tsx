import { Check, X } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppTheme, typography } from '@/components/theme';

export type AnswerFeedback = 'correct' | 'wrong' | 'neutral';

type AnswerButtonProps = {
  label: string;
  letter?: string;
  selected?: boolean;
  disabled?: boolean;
  feedback?: AnswerFeedback;
  onPress: () => void;
};

export function AnswerButton({
  label,
  letter,
  selected = false,
  disabled = false,
  feedback = 'neutral',
  onPress,
}: AnswerButtonProps) {
  const theme = useAppTheme();
  const active = selected || feedback !== 'neutral';
  const isCorrect = feedback === 'correct';
  const isWrong = feedback === 'wrong';
  const backgroundColor = isCorrect
    ? theme.successSoft
    : isWrong
      ? theme.dangerSoft
      : selected
        ? theme.accentSoft
        : theme.surface;
  const borderColor = isCorrect
    ? theme.success
    : isWrong
      ? theme.danger
      : selected
        ? theme.accent
        : theme.line;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor, borderColor, opacity: pressed ? 0.82 : disabled ? 0.68 : 1 },
      ]}
    >
      <View style={[styles.letter, { borderColor, backgroundColor: active ? borderColor : 'transparent' }]}>
        {isCorrect ? <Check size={14} color={theme.surface} strokeWidth={2.5} /> : null}
        {isWrong ? <X size={14} color={theme.surface} strokeWidth={2.5} /> : null}
        {!isCorrect && !isWrong ? <Text style={[styles.letterText, { color: selected ? theme.accent : theme.mutedStrong }]}>{letter}</Text> : null}
      </View>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 60,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  letter: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  letterText: { ...typography.caption, fontWeight: '700' },
  label: { ...typography.body, flex: 1 },
});
