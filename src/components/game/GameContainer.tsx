import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GameState, Answer } from '@/types/game';
import { questions } from '@/data/questions';
import { IntroScreen } from './IntroScreen';
import { NameEntry } from './NameEntry';
import { QuestionScreen } from './QuestionScreen';
import { CutsceneScreen } from './CutsceneScreen';
import { LoadingScreen } from './LoadingScreen';
import { ResultScreen } from './ResultScreen';

const CUTSCENE_INTERVALS = [4, 8]; // Show cutscene after questions 4 and 8

export const GameContainer = () => {
  const [gameState, setGameState] = useState<GameState>({
    playerName: '',
    currentPhase: 'intro',
    currentQuestionIndex: 0,
    answers: [],
  });

  const [cutscenePhase, setCutscenePhase] = useState(0);

  const handleStart = useCallback(() => {
    setGameState((prev) => ({ ...prev, currentPhase: 'name' }));
  }, []);

  const handleNameSubmit = useCallback((name: string) => {
    setGameState((prev) => ({
      ...prev,
      playerName: name,
      currentPhase: 'questions',
    }));
  }, []);

  const handleAnswer = useCallback((answer: Answer) => {
    setGameState((prev) => {
      const newAnswers = [...prev.answers, answer];
      const nextIndex = prev.currentQuestionIndex + 1;

      // Check if we should show a cutscene
      if (CUTSCENE_INTERVALS.includes(nextIndex) && nextIndex < questions.length) {
        setCutscenePhase((p) => p + 1);
        return {
          ...prev,
          answers: newAnswers,
          currentQuestionIndex: nextIndex,
          currentPhase: 'cutscene',
        };
      }

      // Check if we're done with questions
      if (nextIndex >= questions.length) {
        return {
          ...prev,
          answers: newAnswers,
          currentPhase: 'loading',
        };
      }

      return {
        ...prev,
        answers: newAnswers,
        currentQuestionIndex: nextIndex,
      };
    });
  }, []);

  const handleCutsceneComplete = useCallback(() => {
    setGameState((prev) => ({ ...prev, currentPhase: 'questions' }));
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setGameState((prev) => ({ ...prev, currentPhase: 'result' }));
  }, []);

  const handleRestart = useCallback(() => {
    setGameState({
      playerName: '',
      currentPhase: 'intro',
      currentQuestionIndex: 0,
      answers: [],
    });
    setCutscenePhase(0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {gameState.currentPhase === 'intro' && (
          <IntroScreen key="intro" onStart={handleStart} />
        )}

        {gameState.currentPhase === 'name' && (
          <NameEntry key="name" onSubmit={handleNameSubmit} />
        )}

        {gameState.currentPhase === 'questions' && (
          <QuestionScreen
            key={`question-${gameState.currentQuestionIndex}`}
            question={questions[gameState.currentQuestionIndex]}
            questionNumber={gameState.currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
          />
        )}

        {gameState.currentPhase === 'cutscene' && (
          <CutsceneScreen
            key={`cutscene-${cutscenePhase}`}
            phase={cutscenePhase}
            onComplete={handleCutsceneComplete}
          />
        )}

        {gameState.currentPhase === 'loading' && (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        )}

        {gameState.currentPhase === 'result' && (
          <ResultScreen
            key="result"
            playerName={gameState.playerName}
            answers={gameState.answers}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
