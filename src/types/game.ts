export interface Question {
  id: string;
  type: 'choice' | 'text' | 'scale';
  prompt: string;
  subtext?: string;
  options?: {
    id: string;
    text: string;
    hiddenValue: string;
  }[];
  scaleLabels?: {
    left: string;
    right: string;
  };
}

export interface Answer {
  questionId: string;
  value: string | number;
  hiddenMeaning?: string;
}

export interface GameState {
  playerName: string;
  currentPhase: 'intro' | 'name' | 'questions' | 'cutscene' | 'loading' | 'result';
  currentQuestionIndex: number;
  answers: Answer[];
}

export interface Analysis {
  playerName: string;
  trustLevel: string;
  emotionalDistance: string;
  perception: string;
  hiddenFeelings: string;
  overallInsight: string;
  answers: Answer[];
  timestamp: string;
}
