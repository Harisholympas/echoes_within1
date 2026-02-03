import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, Answer } from '@/types/game';
import { SketchDivider } from './SketchElements';

interface QuestionScreenProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: Answer) => void;
}

export const QuestionScreen = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: QuestionScreenProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [textValue, setTextValue] = useState('');
  const [scaleValue, setScaleValue] = useState(5);

  const handleSubmit = () => {
    let answer: Answer;

    if (question.type === 'choice') {
      const selected = question.options?.find((o) => o.id === selectedOption);
      answer = {
        questionId: question.id,
        value: selectedOption || '',
        hiddenMeaning: selected?.hiddenValue,
      };
    } else if (question.type === 'text') {
      answer = {
        questionId: question.id,
        value: textValue,
      };
    } else {
      answer = {
        questionId: question.id,
        value: scaleValue,
      };
    }

    onAnswer(answer);
    setSelectedOption(null);
    setTextValue('');
    setScaleValue(5);
  };

  const canProceed =
    (question.type === 'choice' && selectedOption) ||
    (question.type === 'text' && textValue.trim()) ||
    question.type === 'scale';

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
    >
      <div className="max-w-lg w-full">
        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          className="text-center mb-8"
        >
          <span className="sketch-handwritten text-sm text-muted-foreground">
            {questionNumber} of {totalQuestions}
          </span>
          <div className="mt-2 h-0.5 bg-charcoal/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-charcoal/30"
              initial={{ width: 0 }}
              animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="sketch-title text-2xl md:text-3xl mb-4">
            {question.prompt}
          </h2>
          {question.subtext && (
            <p className="sketch-text text-lg text-charcoal-light italic">
              {question.subtext}
            </p>
          )}
        </motion.div>

        <SketchDivider />

        {/* Answer options */}
        <AnimatePresence mode="wait">
          {question.type === 'choice' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              {question.options?.map((option, index) => (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  onClick={() => setSelectedOption(option.id)}
                  className={`sketch-option w-full text-left rounded-sm ${
                    selectedOption === option.id ? 'selected' : ''
                  }`}
                >
                  <span className="sketch-text text-base md:text-lg">
                    {option.text}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}

          {question.type === 'text' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <textarea
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder="Let the words flow..."
                className="w-full h-32 bg-transparent border border-charcoal/20 rounded-sm p-4 sketch-handwritten text-lg resize-none focus:outline-none focus:border-charcoal/40 transition-colors"
              />
            </motion.div>
          )}

          {question.type === 'scale' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <div className="flex justify-between text-sm text-muted-foreground mb-4 sketch-handwritten">
                <span>{question.scaleLabels?.left}</span>
                <span>{question.scaleLabels?.right}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={scaleValue}
                onChange={(e) => setScaleValue(Number(e.target.value))}
                className="w-full h-2 bg-charcoal/10 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-5
                  [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-charcoal/60
                  [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-parchment
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:hover:scale-110"
              />
              <div className="text-center mt-4">
                <span className="sketch-handwritten text-2xl text-charcoal">
                  {scaleValue}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <motion.button
            onClick={handleSubmit}
            disabled={!canProceed}
            whileHover={{ scale: canProceed ? 1.02 : 1 }}
            whileTap={{ scale: canProceed ? 0.98 : 1 }}
            className={`sketch-button text-lg ${
              !canProceed ? 'opacity-30 cursor-not-allowed' : ''
            }`}
          >
            Continue
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};
