import { Question } from '@/types/game';

export const questions: Question[] = [
  {
    id: 'first_memory',
    type: 'text',
    prompt: 'Close your eyes for a moment.',
    subtext: 'What scene plays when you think of the person who sent you here?',
  },
  {
    id: 'color',
    type: 'choice',
    prompt: 'Every soul carries a shade.',
    subtext: 'When this person crosses your mind, which color bleeds through?',
    options: [
      { id: 'a', text: 'Warm amber — like late afternoon light', hiddenValue: 'comfort_warmth' },
      { id: 'b', text: 'Deep blue — calm but unknowable depths', hiddenValue: 'mysterious_distant' },
      { id: 'c', text: 'Soft grey — familiar, steady, quiet', hiddenValue: 'stable_predictable' },
      { id: 'd', text: 'Flickering gold — bright but hard to hold', hiddenValue: 'intense_unstable' },
    ],
  },
  {
    id: 'room_scenario',
    type: 'choice',
    prompt: 'Imagine a room full of noise and strangers.',
    subtext: 'You spot them across the crowd. What happens inside you?',
    options: [
      { id: 'a', text: 'Relief washes over — finally, someone real', hiddenValue: 'feels_safe' },
      { id: 'b', text: 'A flicker of nerves — will they notice me?', hiddenValue: 'seeks_approval' },
      { id: 'c', text: 'Curiosity — I wonder what they\'re thinking', hiddenValue: 'intrigued_uncertain' },
      { id: 'd', text: 'Nothing changes — just another face', hiddenValue: 'emotionally_distant' },
    ],
  },
  {
    id: 'secret',
    type: 'choice',
    prompt: 'Secrets are heavy things.',
    subtext: 'If you had something you\'ve never told anyone, would you tell them?',
    options: [
      { id: 'a', text: 'Yes — they would hold it gently', hiddenValue: 'deep_trust' },
      { id: 'b', text: 'Maybe — but I\'d test the waters first', hiddenValue: 'cautious_trust' },
      { id: 'c', text: 'No — some doors should stay closed with them', hiddenValue: 'guarded' },
      { id: 'd', text: 'I\'m not sure — I haven\'t thought about it', hiddenValue: 'undefined_bond' },
    ],
  },
  {
    id: 'silence_together',
    type: 'scale',
    prompt: 'Picture sitting beside them in complete silence.',
    subtext: 'How does that silence feel?',
    scaleLabels: {
      left: 'Awkward, needing to fill it',
      right: 'Peaceful, nothing needed',
    },
  },
  {
    id: 'weather_mood',
    type: 'choice',
    prompt: 'Their presence is like weather.',
    subtext: 'Which forecast feels truest?',
    options: [
      { id: 'a', text: 'Sunshine breaking through clouds — uplifting', hiddenValue: 'positive_energy' },
      { id: 'b', text: 'Gentle rain — soothing but melancholic', hiddenValue: 'bittersweet' },
      { id: 'c', text: 'Unpredictable storms — exciting but exhausting', hiddenValue: 'chaotic_intense' },
      { id: 'd', text: 'Still air before a storm — uncertain tension', hiddenValue: 'anxious_uncertain' },
    ],
  },
  {
    id: 'hurt_scenario',
    type: 'choice',
    prompt: 'Even the closest souls sometimes wound each other.',
    subtext: 'If they hurt you unintentionally, what would you do?',
    options: [
      { id: 'a', text: 'Tell them directly — they deserve honesty', hiddenValue: 'open_communicative' },
      { id: 'b', text: 'Wait and see if they notice on their own', hiddenValue: 'passive_expectant' },
      { id: 'c', text: 'Let it go — it\'s not worth the disruption', hiddenValue: 'avoidant' },
      { id: 'd', text: 'Distance myself quietly — protection first', hiddenValue: 'self_protective' },
    ],
  },
  {
    id: 'one_word',
    type: 'text',
    prompt: 'Strip away all pretense.',
    subtext: 'One word to describe how they make you feel.',
  },
  {
    id: 'disappear',
    type: 'choice',
    prompt: 'Imagine waking up tomorrow and they\'re simply... gone.',
    subtext: 'No explanation. No goodbye. What rises first?',
    options: [
      { id: 'a', text: 'Panic — a hole I didn\'t know existed', hiddenValue: 'deeply_attached' },
      { id: 'b', text: 'Sadness — but life would continue', hiddenValue: 'moderate_attachment' },
      { id: 'c', text: 'Confusion — more questions than grief', hiddenValue: 'uncertain_bond' },
      { id: 'd', text: 'Acceptance — people come and go', hiddenValue: 'detached' },
    ],
  },
  {
    id: 'unsaid',
    type: 'text',
    prompt: 'There\'s always something left unspoken.',
    subtext: 'What have you never said to them, but almost did?',
  },
  {
    id: 'future',
    type: 'choice',
    prompt: 'Time moves forward, carrying everyone.',
    subtext: 'In five years, where do you see them in your life?',
    options: [
      { id: 'a', text: 'Still here — some threads don\'t break', hiddenValue: 'lasting_bond' },
      { id: 'b', text: 'Faded but remembered — like old photographs', hiddenValue: 'temporary_meaningful' },
      { id: 'c', text: 'Closer than now — we\'re still growing', hiddenValue: 'deepening' },
      { id: 'd', text: 'Honestly? I don\'t know — life is strange', hiddenValue: 'uncertain_future' },
    ],
  },
  {
    id: 'final_truth',
    type: 'scale',
    prompt: 'The heart knows things the mind refuses.',
    subtext: 'How important are they to you, truly?',
    scaleLabels: {
      left: 'A passing presence',
      right: 'Someone irreplaceable',
    },
  },
];
