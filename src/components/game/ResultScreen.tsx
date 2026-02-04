import { useMemo } from 'react';
import { motion } from 'framer-motion';
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
  const silenceScore = answers.find(a => a.questionId === 'silence_together')?.value as number || 5;
  const importanceScore = answers.find(a => a.questionId === 'final_truth')?.value as number || 5;

  // Text responses (the gold)
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

export const ResultScreen = ({ playerName, answers, onRestart }: ResultScreenProps) => {
  const analysis = useMemo(() => analyzeAnswers(answers), [answers]);
  const result = useMemo(() => getPoetryResult(analysis), [analysis]);

  // Silently prepare full analysis
  useMemo(() => {
    const fullAnalysis: Analysis = {
      playerName,
      answers,
      timestamp: new Date().toISOString(),
      trustLevel: analysis.trustLevel,
      emotionalDistance: analysis.attachment === 'strong' ? 'close' : 'moderate',
      perception: analysis.hiddenValues.join(', '),
      hiddenFeelings: `Memory: "${analysis.rawMemory}" | Feeling: "${analysis.emotionWord}" | Unsaid: "${analysis.unspokenThought}"`,
      overallInsight: `${result.title} — Trust: ${analysis.trustLevel}, Attachment: ${analysis.attachment}, Tone: ${analysis.emotionalTone}, Importance: ${analysis.importance}, Comfort in silence: ${analysis.comfortInSilence}`,
    };

    // Log detailed analysis
    console.log('╔══════════════════════════════════════════╗');
    console.log('║       HIDDEN ANALYSIS REPORT             ║');
    console.log('╠══════════════════════════════════════════╣');
    console.log(`║ Player: ${playerName}`);
    console.log(`║ Trust Level: ${analysis.trustLevel}`);
    console.log(`║ Attachment: ${analysis.attachment}`);
    console.log(`║ Emotional Tone: ${analysis.emotionalTone}`);
    console.log(`║ Importance to them: ${analysis.importance}`);
    console.log(`║ Comfort in silence: ${analysis.comfortInSilence}`);
    console.log('╠══════════════════════════════════════════╣');
    console.log('║ RAW RESPONSES (THE GOLD):');
    console.log(`║ First Memory: "${analysis.rawMemory}"`);
    console.log(`║ One Word Feeling: "${analysis.emotionWord}"`);
    console.log(`║ What they never said: "${analysis.unspokenThought}"`);
    console.log('╠══════════════════════════════════════════╣');
    console.log('║ All hidden meanings:', analysis.hiddenValues);
    console.log('╚══════════════════════════════════════════╝');

    // Store for retrieval
    const existingResults = JSON.parse(localStorage.getItem('voidResults') || '[]');
    existingResults.push(fullAnalysis);
    localStorage.setItem('voidResults', JSON.stringify(existingResults));

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
        className="text-center max-w-lg"
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
