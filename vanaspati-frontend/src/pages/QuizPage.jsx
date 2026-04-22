import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { fetchQuizQuestions, submitQuizResult } from '../api/quiz';
import styles from './QuizPage.module.css';

const FALLBACK_QUESTIONS = [
  {
    id: 'fq1',
    questionText: 'How would you describe your body frame?',
    optionA: 'Thin, light, and difficult to gain weight',
    optionB: 'Medium, athletic, and well-proportioned',
    optionC: 'Larger, heavier, and tendency to gain weight',
    doshaA: 'Vata',
    doshaB: 'Pitta',
    doshaC: 'Kapha',
  },
  {
    id: 'fq2',
    questionText: 'How do you handle stressful situations?',
    optionA: 'Become anxious, worried, or fearful',
    optionB: 'Become irritable, frustrated, or angry',
    optionC: 'Become withdrawn, stubborn, or slow to respond',
    doshaA: 'Vata',
    doshaB: 'Pitta',
    doshaC: 'Kapha',
  },
  {
    id: 'fq3',
    questionText: 'How is your digestion usually?',
    optionA: 'Irregular, bloating, variable appetite',
    optionB: 'Strong digestion, sharp hunger, can get irritable if meals are late',
    optionC: 'Slow but steady, can skip meals easily',
    doshaA: 'Vata',
    doshaB: 'Pitta',
    doshaC: 'Kapha',
  },
  {
    id: 'fq4',
    questionText: 'How is your sleep pattern?',
    optionA: 'Light sleeper, difficulty falling asleep, restless mind',
    optionB: 'Moderate sleep, may wake up in the night',
    optionC: 'Deep, heavy sleeper, hard to wake up in the morning',
    doshaA: 'Vata',
    doshaB: 'Pitta',
    doshaC: 'Kapha',
  },
  {
    id: 'fq5',
    questionText: 'How would you describe your skin?',
    optionA: 'Dry, rough, cool to the touch',
    optionB: 'Warm, oily in T-zone, sensitive, prone to rashes',
    optionC: 'Thick, moist, smooth, pale or cool',
    doshaA: 'Vata',
    doshaB: 'Pitta',
    doshaC: 'Kapha',
  },
  {
    id: 'fq6',
    questionText: 'How do you prefer the weather?',
    optionA: 'Prefer warmth, dislike cold and wind',
    optionB: 'Prefer cool weather, dislike heat and humidity',
    optionC: 'Prefer warmth and dry weather, dislike cold and damp',
    doshaA: 'Vata',
    doshaB: 'Pitta',
    doshaC: 'Kapha',
  },
];

const DOSHA_INFO = {
  Vata: {
    description: 'Vata types are creative, flexible, and quick-thinking, but can be prone to anxiety and irregularity. Focus on warmth, routine, and grounding herbs like Ashwagandha and Shatavari.',
    color: '#6b90c4',
    herbs: ['Ashwagandha', 'Shatavari', 'Brahmi', 'Haritaki'],
  },
  Pitta: {
    description: 'Pitta types are focused, determined, and natural leaders, but can be prone to irritability and inflammation. Focus on cooling foods and herbs like Shatavari, Amalaki, and Brahmi.',
    color: '#c46b6b',
    herbs: ['Amalaki', 'Shatavari', 'Brahmi', 'Neem'],
  },
  Kapha: {
    description: 'Kapha types are calm, loving, and stable, but can be prone to sluggishness and weight gain. Focus on light, warm, and stimulating herbs like Ginger, Tulsi, and Trikatu.',
    color: '#6bc49a',
    herbs: ['Ginger', 'Tulsi', 'Trikatu', 'Guggulu'],
  },
};

export default function QuizPage() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizDone, setQuizDone] = useState(false);
  const [nickname, setNickname] = useState('');

  const { data: liveQuestions = [], isLoading } = useQuery({
    queryKey: ['quiz-questions'],
    queryFn: fetchQuizQuestions,
    retry: 1,
  });

  const questions = liveQuestions.length > 0 ? liveQuestions : FALLBACK_QUESTIONS;

  const submitMutation = useMutation({
    mutationFn: (payload) => submitQuizResult(payload.score, payload.total, payload.nickname),
    onSuccess: () => setQuizDone(true),
    onError: () => setQuizDone(true), // still show result even if backend is down
  });

  const handleAnswer = (optionKey, dosha) => {
    const updatedAnswers = {
      ...answers,
      [questionIndex]: { option: optionKey, dosha },
    };
    setAnswers(updatedAnswers);

    if (questionIndex < questions.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else {
      const doshaCount = {};
      Object.values(updatedAnswers).forEach(({ dosha: d }) => {
        doshaCount[d] = (doshaCount[d] || 0) + 1;
      });
      const totalScore = Object.values(doshaCount).reduce((a, b) => a + b, 0);
      submitMutation.mutate({
        score: totalScore,
        total: questions.length,
        nickname: nickname || 'Quiz Player',
      });
    }
  };

  const { doshaResult, dominantDosha } = useMemo(() => {
    const doshaCount = {};
    Object.values(answers).forEach(({ dosha }) => {
      doshaCount[dosha] = (doshaCount[dosha] || 0) + 1;
    });
    const result = [
      { dosha: 'Vata', value: doshaCount['Vata'] || 0 },
      { dosha: 'Pitta', value: doshaCount['Pitta'] || 0 },
      { dosha: 'Kapha', value: doshaCount['Kapha'] || 0 },
    ];
    const dominant = result.reduce((a, b) => (a.value >= b.value ? a : b)).dosha;
    return { doshaResult: result, dominantDosha: dominant };
  }, [answers]);

  if (isLoading) {
    return (
      <main className={styles.quizContainer}>
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Loading quiz questions...</p>
        </div>
      </main>
    );
  }

  if (quizDone) {
    const info = DOSHA_INFO[dominantDosha];
    return (
      <main className={styles.quizContainer}>
        <div className={styles.resultSection}>
          <p className={styles.eyebrow}>Your Ayurvedic Constitution</p>
          <h1>Your Dosha: <span style={{ color: info?.color }}>{dominantDosha}</span></h1>
          <p className={styles.doshaDesc}>{info?.description}</p>

          <div className={styles.radarContainer}>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={doshaResult}>
                <PolarGrid />
                <PolarAngleAxis dataKey="dosha" />
                <Radar dataKey="value" stroke={info?.color || '#4a8c5c'} fill={info?.color || '#4a8c5c'} fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {info?.herbs?.length > 0 && (
            <div className={styles.herbsSection}>
              <h3>Recommended Herbs for {dominantDosha}</h3>
              <div className={styles.herbPills}>
                {info.herbs.map((herb) => (
                  <span key={herb} className={styles.herbPill}>{herb}</span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.nicknameSection}>
            <input
              type="text"
              placeholder="Enter your nickname (optional)"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className={styles.nicknameInput}
            />
            <button
              onClick={() => {
                setQuizDone(false);
                setQuestionIndex(0);
                setAnswers({});
                setNickname('');
              }}
              className={styles.retakeBtn}
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </main>
    );
  }

  const currentQuestion = questions[questionIndex];
  if (!currentQuestion) return null;

  return (
    <main className={styles.quizContainer}>
      <div className={styles.quizHeader}>
        <p className={styles.eyebrow}>Dosha Discovery Quiz</p>
        <h1>Find Your Ayurvedic Type</h1>
        <p>Answer honestly based on your natural tendencies, not what you aspire to be.</p>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ '--progress-width': `${((questionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className={styles.questionSection}>
        <h2 className={styles.questionCounter}>
          Question {questionIndex + 1} of {questions.length}
        </h2>

        <h3 className={styles.questionText}>{currentQuestion.questionText}</h3>

        <div className={styles.optionsGrid}>
          {['A', 'B', 'C'].map((letter) => {
            const optionKey = `option${letter}`;
            const doshaKey = `dosha${letter}`;
            const option = currentQuestion[optionKey];
            const dosha = currentQuestion[doshaKey];
            if (!option) return null;
            const isSelected = answers[questionIndex]?.option === optionKey;

            return (
              <button
                key={letter}
                className={`${styles.optionBtn} ${isSelected ? styles.selected : ''}`}
                onClick={() => handleAnswer(optionKey, dosha)}
              >
                <span className={styles.optionLetter}>{letter}</span>
                <span className={styles.optionText}>{option}</span>
              </button>
            );
          })}
        </div>
      </div>

      {liveQuestions.length === 0 && (
        <p className={styles.fallbackNote}>Using curated offline questions — backend is unavailable.</p>
      )}
    </main>
  );
}
