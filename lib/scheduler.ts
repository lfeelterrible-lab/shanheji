import type { MasteryLevel, Rating } from '@/types/geography';

export const REVIEW_INTERVALS = [3, 7, 14, 30] as const;
export const MASTERY_LABELS = ['新知识', '学习中', '熟悉', '掌握', '长期记忆'] as const;

export function startOfDay(date: Date = new Date()): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function isDue(nextReviewAt: string | null, now: Date = new Date()): boolean {
  if (!nextReviewAt) return false;
  return startOfDay(new Date(nextReviewAt)).getTime() <= startOfDay(now).getTime();
}

export function scheduleReview(currentLevel: MasteryLevel, rating: Rating, now: Date = new Date()): { masteryLevel: MasteryLevel; nextReviewAt: string | null } {
  if (rating === 'forgot') return { masteryLevel: 0, nextReviewAt: startOfDay(now).toISOString() };
  if (rating === 'fuzzy') {
    return { masteryLevel: Math.max(1, Math.min(4, currentLevel)) as MasteryLevel, nextReviewAt: startOfDay(addDays(now, 1)).toISOString() };
  }
  const nextLevel = Math.min(4, currentLevel + 1) as MasteryLevel;
  const interval = REVIEW_INTERVALS[Math.min(REVIEW_INTERVALS.length - 1, nextLevel - 1)];
  return { masteryLevel: nextLevel, nextReviewAt: startOfDay(addDays(now, interval)).toISOString() };
}

export function formatReviewDate(nextReviewAt: string | null): string {
  if (!nextReviewAt) return '长期记忆';
  const diff = Math.round((startOfDay(new Date(nextReviewAt)).getTime() - startOfDay().getTime()) / 86_400_000);
  if (diff <= 0) return '今天';
  if (diff === 1) return '明天';
  return `${diff} 天后`;
}

export function dayKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function previousDayKey(date: Date = new Date()): string {
  return dayKey(addDays(date, -1));
}
