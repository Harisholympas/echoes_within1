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

  const trustIndicators = ['deep_trust', 'feels_safe', 'open_communicative', 'lasting_bond'];
  const distrustIndicators = ['guarded', 'self_protective', 'detached', 'emotionally_distant'];
  const trustScore = hiddenValues.filter(v => trustIndicators.includes(v!)).length;
  const distrustScore = hiddenValues.filter(v => distrustIndicators.includes(v!)).length;

  const attachmentIndicators = ['deeply_attached', 'lasting_bond', 'deepening', 'comfort_warmth'];
  const attachmentScore = hiddenValues.filter(v => attachmentIndicators.includes(v!)).length;

  const positiveIndicators = ['positive_energy', 'comfort_warmth', 'feels_safe', 'deep_trust'];
  const negativeIndicators = ['anxious_uncertain', 'chaotic_intense', 'bittersweet', 'self_protective'];
  const positiveScore = hiddenValues.filter(v => positiveIndicators.includes(v!)).length;
  const negativeScore = hiddenValues.filter(v => negativeIndicators.includes(v!)).length;

  const silenceScore = answers.find(a => a.questionId === 'silence_together')?.value as number || 0;
  const importanceScore = answers.find(a => a.questionId === 'final_truth')?.value as number || 0;

  const allSliderAnswers = answers.filter(a => typeof a.value === 'number');

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
    allSliderAnswers,
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

// Generate HTML for slider scores
const generateSliderScoresHTML = (sliderAnswers: Answer[]): string => {
  if (sliderAnswers.length === 0) {
    return '';
  }

  let html = '<table style="width: 100%; border-collapse: collapse;">';
  
  sliderAnswers.forEach((answer) => {
    const value = answer.value as number;
    const percentage = (value / 10) * 100;
    const questionName = answer.questionId
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    html += `
      <tr style="background: #f9f9f7; border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 12px; font-weight: 600; color: #2c2c2c; width: 50%;">${questionName}</td>
        <td style="padding: 12px; text-align: right; color: #8b7355; font-weight: 700; font-size: 16px;">${value}/10</td>
      </tr>
    `;
  });

  html += '</table>';
  return html;
};

// Generate HTML for all answers
const generateAllAnswersHTML = (answers: Answer[]): string => {
  let html = '<div style="margin-top: 20px;">';
  
  answers.forEach((answer, index) => {
    const value = typeof answer.value === 'number' 
      ? `${answer.value}/10` 
      : String(answer.value);

    const questionName = answer.questionId
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    html += `
      <div style="background: #f9f9f7; padding: 12px; margin-bottom: 8px; border-left: 3px solid #8b7355; border-radius: 2px;">
        <p style="margin: 0 0 4px 0; font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Question ${index + 1}</p>
        <p style="margin: 0 0 4px 0; font-size: 12px; color: #666; font-weight: 600;"><strong>${questionName}</strong></p>
        <p style="margin: 0 0 4px 0; font-size: 13px; color: #2c2c2c;"><strong>Response:</strong> ${value}</p>
        ${answer.hiddenMeaning ? `<p style="margin: 0; font-size: 12px; color: #8b7355; font-style: italic;"><strong>Hidden Meaning:</strong> ${answer.hiddenMeaning}</p>` : ''}
      </div>
    `;
  });

  html += '</div>';
  return html;
};

export const ResultScreen = ({ playerName, answers, onRestart }: ResultScreenProps) => {
  const [emailSent, setEmailSent] = useState(false);
  const [allAnswersEmailSent, setAllAnswersEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const analysis = useMemo(() => analyzeAnswers(answers), [answers]);
  const result = useMemo(() => getPoetryResult(analysis), [analysis]);
  const sliderScoresHTML = useMemo(() => generateSliderScoresHTML(analysis.allSliderAnswers), [analysis.allSliderAnswers]);
  const allAnswersHTML = useMemo(() => generateAllAnswersHTML(answers), [answers]);

  useEffect(() => {
    emailjs.init('i2c3sfhqVpIOSV8zG');
    sendEmail();
  }, []);

  const sendEmail = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const templateParams = {
        to_email: 'studentaiml6@gmail.com',
        subject: `Echoes Within Result for ${playerName}`,
        playerName: playerName,
        timestamp: new Date().toISOString(),
        trustLevel: analysis.trustLevel,
        attachment: analysis.attachment,
        emotionalTone: analysis.emotionalTone,
        comfortInSilence: analysis.comfortInSilence,
        importance: analysis.importance,
        poemTitle: result.title,
        poemLine1: result.poem[0],
        poemLine2: result.poem[1],
        poemLine3: result.poem[2],
        poemLine4: result.poem[3],
        rawMemory: analysis.rawMemory,
        emotionWord: analysis.emotionWord,
        unspokenThought: analysis.unspokenThought,
        hiddenValues: analysis.hiddenValues.join(', '),
        sliderScoresHTML: sliderScoresHTML,
        allAnswersHTML: '',
      };

      const response = await emailjs.send(
        'service_inocvwj',
        'template_2pgm3qg',
        templateParams,
        'i2c3sfhqVpIOSV8zG'
      );

      console.log('Result email sent!', response);
      setEmailSent(true);
      alert('Your results have been sent.');
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending email');
    } finally {
      setIsLoading(false);
    }
  };

  const sendAllAnswersEmail = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const templateParams = {
        to_email: 'studentaiml6@gmail.com',
        subject: `Echoes Within - Complete Answers for ${playerName}`,
        playerName: playerName,
        timestamp: new Date().toISOString(),
        trustLevel: analysis.trustLevel,
        attachment: analysis.attachment,
        emotionalTone: analysis.emotionalTone,
        comfortInSilence: analysis.comfortInSilence,
        importance: analysis.importance,
        poemTitle: result.title,
        poemLine1: result.poem[0],
        poemLine2: result.poem[1],
        poemLine3: result.poem[2],
        poemLine4: result.poem[3],
        rawMemory: analysis.rawMemory,
        emotionWord: analysis.emotionWord,
        unspokenThought: analysis.unspokenThought,
        hiddenValues: analysis.hiddenValues.join(', '),
        sliderScoresHTML: sliderScoresHTML,
        allAnswersHTML: allAnswersHTML,
      };

      const response = await emailjs.send(
        'service_inocvwj',
        'template_2pgm3qg',
        templateParams,
        'i2c3sfhqVpIOSV8zG'
      );

      console.log('All answers email sent!', response);
      setAllAnswersEmailSent(true);
      alert('Your complete responses have been sent.');
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending email');
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
      overallInsight: `${result.title}`,
    };

    console.log('Full Analysis:', fullAnalysis);

    try {
      const existingResults = JSON.parse(localStorage.getItem('voidResults') || '[]');
      existingResults.push(fullAnalysis);
      localStorage.setItem('voidResults', JSON.stringify(existingResults));
    } catch (e) {
      console.error('Storage error:', e);
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
