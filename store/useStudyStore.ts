import { create } from 'zustand';

import { createInitialProgress, geographyCards } from '@/lib/geography';
import { dayKey, isDue, previousDayKey, scheduleReview } from '@/lib/scheduler';
import { readStorage, writeStorage } from '@/lib/storage';
import type { CardProgress, Rating, StudyAnswer } from '@/types/geography';

export type ThemeMode = 'system' | 'light' | 'dark';
export type SessionMode = 'learn' | 'review';

export type StudySession = {
  mode: SessionMode;
  queue: string[];
  initialCount: number;
  currentIndex: number;
  correctCount: number;
  wrongCount: number;
  answer: StudyAnswer | null;
  completed: boolean;
};

type StoredState = {
  progress: Record<string, CardProgress>;
  streak: number;
  lastStudyDate: string | null;
  activityByDate: Record<string, number>;
  themeMode: ThemeMode;
};

export type StudyStore = StoredState & {
  session: StudySession | null;
  startSession: (mode: SessionMode) => void;
  answerCard: (cardId: string, selected: string | string[]) => boolean;
  rateCard: (cardId: string, rating: Rating) => void;
  advanceSession: () => void;
  setThemeMode: (mode: ThemeMode) => void;
};

const STORAGE_KEY = 'shanheji-progress-v1';
const SETTINGS_KEY = 'shanheji-settings-v1';
const stored = readStorage<Partial<StoredState>>(STORAGE_KEY, {});
const storedSettings = readStorage<Partial<Pick<StoredState, 'themeMode'>>>(SETTINGS_KEY, {});

const initialState: StoredState = {
  progress: stored.progress ?? createInitialProgress(),
  streak: stored.streak ?? 12,
  lastStudyDate: stored.lastStudyDate ?? previousDayKey(),
  activityByDate: stored.activityByDate ?? {},
  themeMode: storedSettings.themeMode ?? stored.themeMode ?? 'system',
};

function persist(state: StudyStore): void {
  const { progress, streak, lastStudyDate, activityByDate } = state;
  writeStorage(STORAGE_KEY, { progress, streak, lastStudyDate, activityByDate });
  writeStorage(SETTINGS_KEY, { themeMode: state.themeMode });
}

function answerIsCorrect(cardId: string, selected: string | string[]): boolean {
  const card = geographyCards.find((item) => item.id === cardId);
  if (!card) return false;
  if (Array.isArray(card.correctAnswer)) {
    if (!Array.isArray(selected)) return false;
    return selected.length === card.correctAnswer.length && selected.every((value) => card.correctAnswer.includes(value));
  }
  return selected === card.correctAnswer;
}

function markActiveDay(state: StudyStore): Pick<StoredState, 'streak' | 'lastStudyDate' | 'activityByDate'> {
  const today = dayKey();
  const activityByDate = { ...state.activityByDate, [today]: (state.activityByDate[today] ?? 0) + 1 };
  const streak = state.lastStudyDate === today ? state.streak : state.lastStudyDate === previousDayKey() ? state.streak + 1 : 1;
  return { streak, lastStudyDate: today, activityByDate };
}

export const useStudyStore = create<StudyStore>((set, get) => ({
  ...initialState,
  session: null,
  startSession: (mode) => {
    const { progress } = get();
    const newCards = geographyCards.filter((card) => {
      const item = progress[card.id];
      return !item?.lastReviewedAt && (item?.masteryLevel ?? 0) === 0;
    });
    const dueCards = geographyCards.filter((card) => isDue(progress[card.id]?.nextReviewAt ?? null));
    const fallback = geographyCards.filter((card) => (progress[card.id]?.masteryLevel ?? 0) < 4);
    const selected = mode === 'learn' ? [...newCards, ...dueCards.filter((card) => !newCards.some((item) => item.id === card.id)), ...fallback] : [...dueCards, ...newCards, ...fallback];
    const queue = Array.from(new Map(selected.map((card) => [card.id, card.id])).values()).slice(0, mode === 'learn' ? 10 : 20);
    set({ session: { mode, queue: queue.length ? queue : geographyCards.slice(0, 10).map((card) => card.id), initialCount: queue.length || Math.min(10, geographyCards.length), currentIndex: 0, correctCount: 0, wrongCount: 0, answer: null, completed: false } });
  },
  answerCard: (cardId, selected) => {
    const session = get().session;
    if (!session || session.completed || session.answer) return false;
    const correct = answerIsCorrect(cardId, selected);
    set({ session: { ...session, queue: correct ? session.queue : [...session.queue, cardId], correctCount: session.correctCount + (correct ? 1 : 0), wrongCount: session.wrongCount + (correct ? 0 : 1), answer: { cardId, selected, correct, autoRating: correct ? 'remembered' : 'forgot', rating: null } } });
    return correct;
  },
  rateCard: (cardId, rating) => {
    const current = get().progress[cardId];
    if (!current) return;
    const scheduled = scheduleReview(current.masteryLevel, rating);
    const progress = { ...get().progress, [cardId]: { ...current, ...scheduled, wrongCount: current.wrongCount + (rating === 'forgot' ? 1 : 0), correctCount: current.correctCount + (rating === 'remembered' ? 1 : 0), lastReviewedAt: new Date().toISOString() } };
    const session = get().session;
    const nextSession = session?.answer?.cardId === cardId ? { ...session, answer: { ...session.answer, rating } } : session;
    set({ progress, session: nextSession });
    persist({ ...get(), progress, session: nextSession } as StudyStore);
  },
  advanceSession: () => {
    const current = get().session;
    if (!current || current.completed) return;
    if (current.answer && !current.answer.rating) get().rateCard(current.answer.cardId, current.answer.autoRating);
    const afterRating = get().session;
    if (!afterRating) return;
    const nextIndex = afterRating.currentIndex + 1;
    if (nextIndex >= afterRating.queue.length) {
      const activity = markActiveDay(get());
      const completedSession = { ...afterRating, completed: true, answer: null };
      set({ ...activity, session: completedSession });
      persist({ ...get(), ...activity, session: completedSession } as StudyStore);
      return;
    }
    set({ session: { ...afterRating, currentIndex: nextIndex, answer: null } });
  },
  setThemeMode: (themeMode) => {
    set({ themeMode });
    writeStorage(SETTINGS_KEY, { themeMode });
  },
}));

export function selectDueCount(state: StudyStore): number {
  return geographyCards.filter((card) => isDue(state.progress[card.id]?.nextReviewAt ?? null)).length;
}

export function selectTodayNewCount(state: StudyStore): number {
  const activeCards = geographyCards.filter((card) => (state.progress[card.id]?.masteryLevel ?? 0) < 4).length;
  return Math.min(10, Math.max(0, activeCards));
}

export function selectAccuracy(state: StudyStore): number {
  const values = Object.values(state.progress);
  const attempted = values.reduce((sum, value) => sum + value.correctCount + value.wrongCount, 0);
  const correct = values.reduce((sum, value) => sum + value.correctCount, 0);
  return attempted ? Math.round((correct / attempted) * 100) : 0;
}

export function selectRecentlyForgotten(state: StudyStore): string[] {
  return Object.values(state.progress).filter((item) => item.wrongCount > 0).sort((a, b) => b.wrongCount - a.wrongCount).slice(0, 4).map((item) => item.cardId);
}
