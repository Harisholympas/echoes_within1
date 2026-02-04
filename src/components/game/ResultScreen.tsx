import { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { Analysis, Answer } from '@/types/game';
import { SketchEye, SketchDivider } from './SketchElements';

interface ResultScreenProps {
  playerName: string;
  answers: Answer[];
  onRestart: () => void;
}

const analyzeAnswers = (answers: Answer[]) => {
  const hiddenValues = answers
    .filter((a) => a.hiddenMeaning)
    .map((a) => a.hiddenMeaning);

  // Trust analysis
  const trustIndicators = ['deep_trust', 'feels_safe', 'open_communicative', 'lasting_bond'];
  const distrustIndicators = ['guarded', 'self_protective', 'detached', 'emotionally_distant'];
  const trustScore = hiddenValues.filter(v => trustIndicators.includes(v!)).length;
  const distrustScore = hiddenValues.filter(v => distrustIndicators.includes(v!)).length;

  // Attachment analysis
  const attachmentIndicators = ['deeply_attached', 'lasting_bond', 'deepening', 'comfort_warmth'];
  const detachmentIndicators = ['detached', 'moderate_attachment', 'temporary_meaningful', 'emotionally_distant'];
  const attachmentScore = hiddenValues.filter(v => attachmentIndicators.includes(v!)).length;

  // Emotional tone
  const positiveIndicators = ['positive_energy', 'comfort_warmth', 'feels_safe', 'deep_trust'];
  const negativeIndicators = ['anxious_uncertain', 'chaotic_intense', 'bittersweet', 'self_protective'];
  const positiveScore = hiddenValues.filter(v => positiveIndicators.includes(v!)).length;
  const negativeScore = hiddenValues.filter(v => negativeIndicators.includes(v!)).length;

  // Get scale values
  const silenceScore = answers.find(a => a.questionId === 'silence_together')?.value as number || 0;
  const importanceScore = answers.find(a => a.questionId === 'final_truth')?.value as number || 0;

  // Get all slider answers
  const sliderAnswers = answers.filter(a => typeof a.value === 'number');

  // Text responses
  const firstMemory = answers.find(a => a.questionId === 'first_memory')?.value as string || '';
  const oneWord = answers.find(a => a.questionId === 'one_word')?.value as string || '';
  const unsaid = answers.find(a => a.questionId === 'unsaid')?.value as string || '';

  return {
    trustLevel: trustScore > distrustScore ? 'high' : trustScore === distrustScore ? 'mixed' : 'guarded',
    attachment: attachmentScore >= 2 ? 'strong' : 'moderate',
    emotionalTone: positiveScore > negativeScore ? 'positive' : positiveScore === negativeScore ? 'complex' : 'conflicted',
    comfortInSilence: silenceScore >= 7 ? 'very comfortable' : silenceScore >= 4 ? 'somewhat comfortable' : 'uncomfortable',
    importance: importanceScore >= 8 ? 'very important' : importanceScore >= 5 ? 'moderately important' : 'peripheral',
    rawMemory: firstMemory,
    emotionWord: oneWord,
    unspokenThought: unsaid,
    hiddenValues,
    silenceScore,
    importanceScore,
    sliderAnswers,
  };
};

const getPoetryResult = (analysis: ReturnType<typeof analyzeAnswers>): { title: string; poem: string[] } => {
  const { trustLevel, attachment, emotionalTone, importance } = analysis;

  if (attachment === 'strong' && trustLevel === 'high' && importance === 'very important') {
    return {
      title: 'The Anchor',
      poem: [
        'Some souls arrive like anchors in the storm,',
        'Holding fast when all else drifts away.',
        'In you, a harbor takes its quiet form—',
        'The kind of presence that makes wanderers stay.',
      ],
    };
  }

  if (emotionalTone === 'conflicted' || trustLevel === 'guarded') {
    return {
      title: 'The Distant Star',
      poem: [
        'You shine from distances I cannot name,',
        'A light I watch but rarely try to hold.',
        'Perhaps the beauty lies within the frame—',
        'Some stories are more felt than they are told.',
      ],
    };
  }

  if (attachment === 'strong' && emotionalTone === 'complex') {
    return {
      title: 'The Thorn and Rose',
      poem: [
        'Beauty wrapped in edges, soft and sharp,',
        'A melody in minor keys that sings.',
        'You\'ve carved your name across my inner map—',
        'The kind of mark that only loving brings.',
      ],
    };
  }

  if (trustLevel === 'mixed') {
    return {
      title: 'The Unfinished Letter',
      poem: [
        'Between the lines of what we say and mean,',
        'There lives a conversation yet unspoken.',
        'Perhaps in time the spaces in-between',
        'Will fill with words that heal what once was broken.',
      ],
    };
  }

  return {
    title: 'The Quiet Thread',
    poem: [
      'Not every bond announces its own weight,',
      'Some threads are woven softly, sight unseen.',
      'In ordinary moments, something great—',
      'A gentle presence, steady and serene.',
    ],
  };
};

const formatSliderScoresForEmail = (sliderAnswers: Answer[]): string => {
  if (sliderAnswers.length === 0) return 'No slider scores.';

  let text = '';
  sliderAnswers.forEach((answer) => {
    const value = answer.value as number;
    const questionName = answer.questionId
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
    text += `${questionName}: ${value}/10\n`;
  });

  return text.trim();
};

const formatAllAnswersForEmail = (answers: Answer[]): string => {
  let formatted = '\n\n════════════════════════════════════════\n';
  formatted += '           ALL USER RESPONSES\n';
  formatted += '════════════════════════════════════════\n\n';

  answers.forEach((answer, index) => {
    const questionName = answer.questionId
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    formatted += `Question ${index + 1}: ${questionName}\n`;
    if (typeof answer.value === 'number') {
      formatted += `Score: ${answer.value}/10\n`;
    } else {
      formatted += `Response: ${answer.value}\n`;
    }
    if (answer.hiddenMeaning) {
      formatted += `Hidden Meaning: ${answer.hiddenMeaning}\n`;
    }
    formatted += '\n';
  });

  formatted += '════════════════════════════════════════\n';
  return formatted;
};

export const ResultScreen = ({ playerName, answers, onRestart }: ResultScreenProps) => {
  const [emailSent, setEmailSent] = useState(false);
  const [allAnswersEmailSent, setAllAnswersEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const analysis = useMemo(() => analyzeAnswers(answers), [answers]);
  const result = useMemo(() => getPoetryResult(analysis), [analysis]);

  useEffect(() => {
    emailjs.init('i2c3sfhqVpIOSV8zG');
    sendEmail();
  }, []);

  const sendEmail = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const sliderScores = formatSliderScoresForEmail(analysis.sliderAnswers);

      const fullResult = `
Player: ${playerName}
Timestamp: ${new Date().toISOString()}

════════════════════════════════════════
ANALYSIS SUMMARY
════════════════════════════════════════

Trust Level: ${analysis.trustLevel}
Attachment: ${analysis.attachment}
Emotional Tone: ${analysis.emotionalTone}
Comfort in Silence: ${analysis.comfortInSilence}
Importance: ${analysis.importance}

════════════════════════════════════════
SLIDER SCORES (POINTS GIVEN)
════════════════════════════════════════

${sliderScores}

════════════════════════════════════════
RAW RESPONSES
════════════════════════════════════════

First Memory: ${analysis.rawMemory}
One Word Feeling: ${analysis.emotionWord}
What They Never Said: ${analysis.unspokenThought}

════════════════════════════════════════
HIDDEN VALUES & MEANINGS
════════════════════════════════════════

${analysis.hiddenValues.join(', ')}

════════════════════════════════════════
POEM: ${result.title}
════════════════════════════════════════

${result.poem.join('\n')}
`;

      const templateParams = {
        to_email: 'studentaiml6@gmail.com',
        subject: `Echoes Within Result for ${playerName}`,
        message: fullResult,
      };

      await emailjs.send(
        'service_inocvwj',
        'template_2pgm3qg',
        templateParams,
        'i2c3sfhqVpIOSV8zG'
      );

      console.log('Result email sent successfully!');
      setEmailSent(true);
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendAllAnswersEmail = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const sliderScores = formatSliderScoresForEmail(analysis.sliderAnswers);
      const allAnswersText = formatAllAnswersForEmail(answers);

      const fullResult = `
Player: ${playerName}
Timestamp: ${new Date().toISOString()}

════════════════════════════════════════
ANALYSIS SUMMARY
════════════════════════════════════════

Trust Level: ${analysis.trustLevel}
Attachment: ${analysis.attachment}
Emotional Tone: ${analysis.emotionalTone}
Comfort in Silence: ${analysis.comfortInSilence}
Importance: ${analysis.importance}

════════════════════════════════════════
SLIDER SCORES (POINTS GIVEN)
════════════════════════════════════════

${sliderScores}

════════════════════════════════════════
RAW RESPONSES
════════════════════════════════════════

First Memory: ${analysis.rawMemory}
One Word Feeling: ${analysis.emotionWord}
What They Never Said: ${analysis.unspokenThought}

════════════════════════════════════════
HIDDEN VALUES & MEANINGS
════════════════════════════════════════

${analysis.hiddenValues.join(', ')}

════════════════════════════════════════
POEM: ${result.title}
════════════════════════════════════════

${result.poem.join('\n')}
${allAnswersText}
`;

      const templateParams = {
        to_email: 'studentaiml6@gmail.com',
        subject: `Echoes Within - Complete Answers for ${playerName}`,
        message: fullResult,
      };

      await emailjs.send(
        'service_inocvwj',
        'template_2pgm3qg',
        templateParams,
        'i2c3sfhqVpIOSV8zG'
      );

      console.log('Complete answers email sent!');
      setAllAnswersEmailSent(true);
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useMemo(() => {
    const fullAnalysis: Analysis = {
      playerName,
      answers,
      timestamp: new Date().toISOString(),
      trustLevel: analysis.trustLevel,
      emotionalDistance: analysis.attachment === 'strong' ? 'close' : 'moderate',
      perception: analysis.hiddenValues.join(', '),
      hiddenFeelings: `Memory: "${analysis.rawMemory}" | Feeling: "${analysis.emotionWord}" | Unsaid: "${analysis.unspokenThought}"`,
      overallInsight: `${result.title} — Trust: ${analysis.trustLevel}, Attachment: ${analysis.attachment}`,
    };

    try {
      const existingResults = JSON.parse(localStorage.getItem('voidResults') || '[]');
      existingResults.push(fullAnalysis);
      localStorage.setItem('voidResults', JSON.stringify(existingResults));
    } catch (e) {
      console.error('Error storing results:', e);
    }

    return fullAnalysis;
  }, [playerName, answers, analysis, result.title]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-center max-w-2xl"
      >
        <div className="mb-6 flex justify-center opacity-60">
          <SketchEye />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
          className="sketch-handwritten text-sm text-muted-foreground mb-2"
        >
          A reflection for {playerName}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="sketch-title text-3xl md:text-4xl mb-6"
        >
          {result.title}
        </motion.h2>

        <SketchDivider />

        {/* SLIDER SCORES ON SCREEN */}
        {analysis.sliderAnswers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Scores</h3>
            <div className="space-y-3">
              {analysis.sliderAnswers.map((answer, index) => {
                const value = answer.value as number;
                const questionName = answer.questionId
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (l) => l.toUpperCase());
                const percentage = (value / 10) * 100;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 + index * 0.2 }}
                    className="flex items-center gap-4"
                  >
                    <span className="text-sm font-medium text-gray-700 flex-1">
                      {questionName}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-700 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold text-amber-700 min-w-12">
                      {value}/10
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="sketch-card p-8 rounded-sm mb-8"
        >
          {result.poem.map((line, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2 + index * 0.3 }}
              className="sketch-text text-lg md:text-xl italic text-charcoal-light mb-2"
            >
              {line}
            </motion.p>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 3.5 }}
          className="sketch-text text-sm text-muted-foreground mb-8"
        >
          The echoes have been gathered.<br />
          What they reveal is for another to know.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.8 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-6"
        >
          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            onClick={sendEmail}
            disabled={emailSent || isLoading}
            className={`sketch-button text-lg ${emailSent || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isLoading ? '...' : emailSent ? '✓ Result Sent' : 'Send Result via Email'}
          </motion.button>

          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            onClick={sendAllAnswersEmail}
            disabled={allAnswersEmailSent || isLoading}
            className={`sketch-button text-lg ${allAnswersEmailSent || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isLoading ? '...' : allAnswersEmailSent ? '✓ All Answers Sent' : 'Send All Answers'}
          </motion.button>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRestart}
          className="sketch-button text-lg"
        >
          Begin again
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 4.5 }}
          className="mt-8 text-xs text-muted-foreground sketch-handwritten"
        >
          ~ the void keeps what it learns ~
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
