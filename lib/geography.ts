import rawCards from '@/data/china-geography.json';
import { isDue } from '@/lib/scheduler';
import type { CardProgress, GeographyCard, MasteryLevel } from '@/types/geography';

export const geographyCards = rawCards as GeographyCard[];

export const chapterMeta = [
  { id: 'position', label: '中国位置与疆域', shortLabel: '位置', tone: '#6B7C88' },
  { id: 'terrain', label: '中国地形', shortLabel: '地形', tone: '#A8654A' },
  { id: 'climate', label: '中国气候', shortLabel: '气候', tone: '#778C75' },
  { id: 'rivers', label: '中国河流', shortLabel: '河流', tone: '#5C7F8B' },
  { id: 'agriculture', label: '中国农业', shortLabel: '农业', tone: '#A58A54' },
  { id: 'population', label: '人口与城市', shortLabel: '人口', tone: '#8B6D7A' },
  { id: 'industry', label: '工业交通', shortLabel: '工业', tone: '#7E7569' },
  { id: 'regions', label: '区域地理', shortLabel: '区域', tone: '#6D806F' },
] as const;

export function getCard(cardId: string): GeographyCard | undefined {
  return geographyCards.find((card) => card.id === cardId);
}

export function createInitialProgress(): Record<string, CardProgress> {
  return Object.fromEntries(geographyCards.map((card, index) => {
    const isNew = index < 10;
    const isDueCard = index >= 10 && index < 36;
    const level = isNew ? 0 : ((index % 4) + 1) as MasteryLevel;
    return [card.id, {
      cardId: card.id,
      masteryLevel: level,
      nextReviewAt: isNew ? null : isDueCard ? new Date(Date.now() - (index % 3 + 1) * 86_400_000).toISOString() : new Date(Date.now() + 86_400_000).toISOString(),
      wrongCount: index % 11 === 0 ? 2 : index % 7 === 0 ? 1 : 0,
      correctCount: isNew ? 0 : 2 + (index % 5),
      lastReviewedAt: isNew ? null : new Date(Date.now() - (index % 8 + 1) * 86_400_000).toISOString(),
    } satisfies CardProgress];
  }));
}

export function cardsDueCount(progress: Record<string, CardProgress>, category?: string): number {
  return geographyCards.filter((card) => {
    if (category && card.category !== category) return false;
    return isDue(progress[card.id]?.nextReviewAt ?? null);
  }).length;
}

export function chapterProgress(category: string, progress: Record<string, CardProgress>) {
  const cards = geographyCards.filter((card) => card.category === category);
  const mastered = cards.filter((card) => (progress[card.id]?.masteryLevel ?? 0) >= 3).length;
  return { total: cards.length, mastered, percent: cards.length ? Math.round((mastered / cards.length) * 100) : 0 };
}

export function overallMastery(progress: Record<string, CardProgress>): number {
  const points = geographyCards.reduce((sum, card) => sum + (progress[card.id]?.masteryLevel ?? 0), 0);
  return geographyCards.length ? Math.round((points / (geographyCards.length * 4)) * 100) : 0;
}

export function cardWithProgress(card: GeographyCard, progress: Record<string, CardProgress>): GeographyCard {
  const current = progress[card.id];
  return { ...card, masteryLevel: current?.masteryLevel ?? 0, nextReviewAt: current?.nextReviewAt ?? null, wrongCount: current?.wrongCount ?? 0, correctCount: current?.correctCount ?? 0, lastReviewedAt: current?.lastReviewedAt ?? null };
}
