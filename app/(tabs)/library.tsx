import { ArrowLeft, BookOpen, Search, SlidersHorizontal } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppMark } from '@/components/AppMark';
import { ProgressBar } from '@/components/ProgressBar';
import { useAppTheme, typography } from '@/components/theme';
import { chapterMeta, chapterProgress, geographyCards } from '@/lib/geography';
import { MASTERY_LABELS } from '@/lib/scheduler';
import { useStudyStore } from '@/store/useStudyStore';

export default function LibraryScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const progress = useStudyStore((state) => state.progress);
  const [query, setQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const chapter = chapterMeta.find((item) => item.id === selectedChapter);

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return geographyCards.filter((card) =>
      [card.title, card.subtitle, card.coreFact, ...card.tags].join(' ').toLowerCase().includes(normalized),
    );
  }, [query]);

  const chapterCards = selectedChapter ? geographyCards.filter((card) => card.category === selectedChapter) : [];

  const openCard = (id: string) => router.push({ pathname: '/card/[id]', params: { id } });

  const renderCardRow = (cardId: string) => {
    const card = geographyCards.find((item) => item.id === cardId);
    if (!card) return null;
    const current = progress[card.id];
    const level = current?.masteryLevel ?? 0;
    return (
      <Pressable
        key={card.id}
        accessibilityRole="button"
        onPress={() => openCard(card.id)}
        style={({ pressed }) => [styles.cardRow, { borderBottomColor: theme.line, opacity: pressed ? 0.72 : 1 }]}
      >
        <View style={[styles.cardDot, { backgroundColor: level >= 3 ? theme.success : level > 0 ? theme.accent : theme.line }]} />
        <View style={styles.cardCopy}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>{card.title}</Text>
          <Text style={[styles.cardSub, { color: theme.muted }]}>{card.subtitle}</Text>
        </View>
        <Text style={[styles.cardLevel, { color: theme.muted }]}>{MASTERY_LABELS[level]}</Text>
        <Text style={[styles.chevron, { color: theme.muted }]}>›</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AppMark compact />
          <SlidersHorizontal size={19} color={theme.muted} />
        </View>

        <View style={styles.hero}>
          <Text style={[styles.eyebrow, { color: theme.accent }]}>知识库</Text>
          <Text style={[styles.title, { color: theme.text }]}>中国地理</Text>
          <Text style={[styles.sub, { color: theme.muted }]}>按章节回看，或搜索一张卡。</Text>
        </View>

        <View style={[styles.search, { borderColor: theme.line, backgroundColor: theme.surface }]}>
          <Search size={18} color={theme.muted} />
          <TextInput
            accessibilityLabel="搜索知识卡"
            value={query}
            onChangeText={setQuery}
            placeholder="搜索秦岭、黄河、太行山…"
            placeholderTextColor={theme.muted}
            style={[styles.searchInput, { color: theme.text }]}
            returnKeyType="search"
          />
        </View>

        {query.trim() ? (
          <View style={styles.resultsSection}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>搜索结果 · {searchResults.length}</Text>
            {searchResults.length ? searchResults.map((card) => renderCardRow(card.id)) : (
              <View style={styles.empty}>
                <BookOpen size={22} color={theme.muted} />
                <Text style={[styles.emptyText, { color: theme.muted }]}>还没有找到这张卡。</Text>
              </View>
            )}
          </View>
        ) : selectedChapter && chapter ? (
          <View style={styles.resultsSection}>
            <Pressable accessibilityRole="button" onPress={() => setSelectedChapter(null)} style={styles.backRow}>
              <ArrowLeft size={18} color={theme.accent} />
              <Text style={[styles.backText, { color: theme.accent }]}>全部章节</Text>
            </Pressable>
            <View style={styles.chapterHero}>
              <View>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>{chapter.label}</Text>
                <Text style={[styles.chapterCount, { color: theme.muted }]}>{chapterCards.length} 张知识卡</Text>
              </View>
              <Text style={[styles.chapterPercent, { color: chapter.tone }]}>{chapterProgress(chapter.id, progress).percent}%</Text>
            </View>
            <ProgressBar value={chapterProgress(chapter.id, progress).percent / 100} color={chapter.tone} />
            <View style={styles.chapterCardList}>{chapterCards.map((card) => renderCardRow(card.id))}</View>
          </View>
        ) : (
          <View style={styles.chapterSection}>
            <View style={styles.sectionHeading}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>章节</Text>
              <Text style={[styles.sectionHint, { color: theme.muted }]}>{geographyCards.length} 张卡</Text>
            </View>
            <View style={styles.chapterList}>
              {chapterMeta.map((item) => {
                const summary = chapterProgress(item.id, progress);
                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    onPress={() => setSelectedChapter(item.id)}
                    style={({ pressed }) => [styles.chapterRow, { borderBottomColor: theme.line, opacity: pressed ? 0.72 : 1 }]}
                  >
                    <View style={[styles.chapterMark, { backgroundColor: item.tone }]} />
                    <View style={styles.chapterCopy}>
                      <Text style={[styles.chapterName, { color: theme.text }]}>{item.label}</Text>
                      <Text style={[styles.chapterMeta, { color: theme.muted }]}>{summary.mastered} / {summary.total} 已掌握</Text>
                    </View>
                    <View style={styles.chapterBar}><ProgressBar value={summary.percent / 100} color={item.tone} /></View>
                    <Text style={[styles.chapterNumber, { color: theme.muted }]}>{summary.total}</Text>
                    <Text style={[styles.chevron, { color: theme.muted }]}>›</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 36 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  hero: { marginTop: 46, marginBottom: 25 },
  eyebrow: { ...typography.label, marginBottom: 10 },
  title: { ...typography.display, fontSize: 31 },
  sub: { ...typography.body, marginTop: 5 },
  search: { height: 50, borderRadius: 15, borderWidth: 1, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 9 },
  searchInput: { ...typography.body, flex: 1, paddingVertical: 0 },
  chapterSection: { marginTop: 43 },
  resultsSection: { marginTop: 31 },
  sectionHeading: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 13 },
  sectionTitle: { ...typography.heading },
  sectionHint: { ...typography.caption },
  chapterList: { borderTopWidth: 1, borderTopColor: 'transparent' },
  chapterRow: { minHeight: 78, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 11 },
  chapterMark: { width: 7, height: 34, borderRadius: 4 },
  chapterCopy: { flex: 1, gap: 4 },
  chapterName: { ...typography.bodyStrong },
  chapterMeta: { ...typography.caption },
  chapterBar: { width: 48 },
  chapterNumber: { ...typography.caption, width: 22, textAlign: 'right' },
  chevron: { fontSize: 27, lineHeight: 27, fontWeight: '300' },
  empty: { minHeight: 130, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyText: { ...typography.body },
  backRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 22 },
  backText: { ...typography.caption, fontWeight: '700' },
  chapterHero: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 },
  chapterCount: { ...typography.caption, marginTop: 5 },
  chapterPercent: { fontSize: 26, lineHeight: 31, fontWeight: '700' },
  chapterCardList: { marginTop: 14 },
  cardRow: { minHeight: 68, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardDot: { width: 7, height: 7, borderRadius: 4 },
  cardCopy: { flex: 1, gap: 3 },
  cardTitle: { ...typography.bodyStrong },
  cardSub: { ...typography.caption },
  cardLevel: { ...typography.caption, fontSize: 11 },
});
