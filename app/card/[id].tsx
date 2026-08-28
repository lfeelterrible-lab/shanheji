import { ArrowLeft } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KnowledgeCard } from '@/components/KnowledgeCard';
import { useAppTheme, typography } from '@/components/theme';
import { cardWithProgress, getCard } from '@/lib/geography';
import { useStudyStore } from '@/store/useStudyStore';

export default function CardDetailScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const progress = useStudyStore((state) => state.progress);
  const card = id ? getCard(id) : undefined;

  if (!card) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
        <View style={styles.empty}>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>找不到这张卡</Text>
          <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: theme.text }]}>
            <Text style={[styles.backButtonText, { color: theme.bg }]}>返回</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const merged = cardWithProgress(card, progress);
  return (
    <SafeAreaView edges={['top', 'bottom']} style={[styles.safe, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backRow}>
          <ArrowLeft size={18} color={theme.text} />
          <Text style={[styles.backText, { color: theme.text }]}>返回</Text>
        </Pressable>
        <KnowledgeCard card={merged} showRating={false} onContinue={() => router.back()} continueLabel="返回知识库" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 10, paddingBottom: 40 },
  backRow: { height: 38, flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 18 },
  backText: { ...typography.caption, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18 },
  emptyTitle: { ...typography.heading },
  backButton: { height: 50, minWidth: 120, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  backButtonText: { ...typography.bodyStrong },
});
