import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPlants } from '../api/plants';
import { buildPlantQuizQuestions } from '../utils/plantQuiz';
import { getFallbackPlants } from '../utils/plantFallbacks';
import styles from './PlantQuizPage.module.css';

export default function PlantQuizPage() {
  const { data } = useQuery({
    queryKey: ['plant-quiz-catalog'],
    queryFn: () => getPlants({ page: 0, size: 40, sort: 'commonName' }),
    staleTime: 60_000,
  });

  const quizCatalog = useMemo(() => {
    const liveCatalog = data?.content || [];
    return liveCatalog.length >= 4 ? liveCatalog : getFallbackPlants(10);
  }, [data]);

  const quiz = useMemo(
    () => buildPlantQuizQuestions(quizCatalog, 5),
    [quizCatalog]
  );

  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answered, setAnswered] = useState(false);

  if (quiz.length === 0) {
    return (
      <main className={styles.page}>
        <section className={styles.resultCard}>
          <p className={styles.eyebrow}>Plant quiz</p>
          <h1>Quiz unavailable</h1>
          <p className={styles.summaryCopy}>At least 4 plants with distinct names are required to generate a live quiz.</p>
        </section>
      </main>
    );
  }

  const current = quiz[step];
  const finished = step >= quiz.length;

  const summary = !finished
    ? null
    : score === quiz.length
      ? {
          title: 'Excellent recall',
          copy: 'You matched every plant correctly.',
        }
      : score >= 2
        ? {
            title: 'Strong result',
            copy: 'You know the core identities well and missed only a small detail.',
          }
        : {
            title: 'Good start',
            copy: 'A second pass through the plant catalog will make the associations stick.',
          };

  if (finished) {
    return (
      <main className={styles.page}>
        <section className={styles.resultCard}>
          <p className={styles.eyebrow}>Plant quiz</p>
          <h1>Quiz Complete</h1>
          <p className={styles.score}>Your score: {score} / {quiz.length}</p>
          <p className={styles.summaryTitle}>{summary.title}</p>
          <p className={styles.summaryCopy}>{summary.copy}</p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={() => {
                setStep(0);
                setScore(0);
                setPicked(null);
                setAnswered(false);
              }}
            >
              Retry quiz
            </button>
          </div>
        </section>
      </main>
    );
  }

  const handlePick = (option) => {
    if (answered) {
      return;
    }

    setPicked(option);
    setAnswered(true);

    if (option === current.answer) {
      setScore((value) => value + 1);
    }
  };

  const handleNext = () => {
    setStep((value) => value + 1);
    setPicked(null);
    setAnswered(false);
  };

  return (
    <main className={styles.page}>
      <section className={styles.quizCard}>
        <div className={styles.topRow}>
          <div>
            <p className={styles.eyebrow}>Plant quiz</p>
            <h1>Guess the Herb</h1>
          </div>
          <div className={styles.progress}>{step + 1} / {quiz.length}</div>
        </div>

        <div className={styles.imageFrame}>
          <img src={current.image} alt="Quiz plant" className={styles.image} />
        </div>

        <h2 className={styles.prompt}>{current.prompt}</h2>
        <p className={styles.hint}>Hint: {current.hint}</p>

        <div className={styles.options}>
          {current.options.map((option) => {
            const isCorrect = answered && option === current.answer;
            const isWrong = answered && picked === option && option !== current.answer;

            return (
              <button
                key={option}
                type="button"
                className={`${styles.optionBtn} ${isCorrect ? styles.correct : ''} ${isWrong ? styles.wrong : ''}`}
                onClick={() => handlePick(option)}
                disabled={answered}
              >
                {option}
              </button>
            );
          })}
        </div>

        {answered ? (
          <div className={styles.feedbackRow}>
            <p className={styles.feedback}>{picked === current.answer ? 'Correct answer.' : `Correct answer: ${current.answer}.`}</p>
            <button type="button" className={styles.primaryBtn} onClick={handleNext}>
              {step === quiz.length - 1 ? 'Finish quiz' : 'Next question'}
            </button>
          </div>
        ) : null}
      </section>
    </main>
  );
}
