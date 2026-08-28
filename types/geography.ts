export type QuestionType = 'choice' | 'boolean' | 'map' | 'multi' | 'fill' | 'order';

export type MasteryLevel = 0 | 1 | 2 | 3 | 4;

export type MapTarget =
  | 'sichuan'
  | 'taihang'
  | 'daxingan'
  | 'qinghai-tibet'
  | 'heihe-tengchong';

export type MapAsset = {
  type: 'china' | 'mountain' | 'population-line';
  target: MapTarget;
  hint?: string;
};

export type GeographyCard = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  question: string;
  questionType: QuestionType;
  options: string[];
  correctAnswer: string | string[];
  coreFact: string;
  keyPoints: string[];
  reasoning: string[];
  memoryTip: string;
  mapAsset?: MapAsset;
  difficulty: 1 | 2 | 3;
  tags: string[];
  needsReview?: boolean;
  masteryLevel?: MasteryLevel;
  nextReviewAt?: string | null;
  wrongCount?: number;
  correctCount?: number;
  lastReviewedAt?: string | null;
};

export type CardProgress = {
  cardId: string;
  masteryLevel: MasteryLevel;
  nextReviewAt: string | null;
  wrongCount: number;
  correctCount: number;
  lastReviewedAt: string | null;
};

export type Rating = 'forgot' | 'fuzzy' | 'remembered';

export type StudyAnswer = {
  cardId: string;
  selected: string | string[];
  correct: boolean;
  autoRating: Rating;
  rating: Rating | null;
};
