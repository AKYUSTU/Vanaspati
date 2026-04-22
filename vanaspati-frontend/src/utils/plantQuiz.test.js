import { describe, expect, it } from 'vitest';
import { buildPlantQuizQuestions } from './plantQuiz';

const basePlants = [
  { id: 1, commonName: 'Tulsi', scientificName: 'Ocimum tenuiflorum', mainImageUrl: '/tulsi.jpg' },
  { id: 2, commonName: 'Neem', scientificName: 'Azadirachta indica', mainImageUrl: '/neem.jpg' },
  { id: 3, commonName: 'Brahmi', scientificName: 'Bacopa monnieri', mainImageUrl: '/brahmi.jpg' },
  { id: 4, commonName: 'Amla', scientificName: 'Phyllanthus emblica', mainImageUrl: '/amla.jpg' },
  { id: 5, commonName: 'Ashwagandha', scientificName: 'Withania somnifera', mainImageUrl: '/ashwagandha.jpg' },
];

describe('buildPlantQuizQuestions', () => {
  it('returns no questions when fewer than four distinct plants exist', () => {
    const questions = buildPlantQuizQuestions(basePlants.slice(0, 3), 5);
    expect(questions).toEqual([]);
  });

  it('builds questions with 4 options including the answer', () => {
    const questions = buildPlantQuizQuestions(basePlants, 3);

    expect(questions.length).toBeGreaterThan(0);
    expect(questions.length).toBeLessThanOrEqual(3);

    questions.forEach((question) => {
      expect(question.options).toHaveLength(4);
      expect(question.options).toContain(question.answer);
      expect(new Set(question.options).size).toBe(4);
      expect(question.prompt.length).toBeGreaterThan(0);
      expect(question.image.length).toBeGreaterThan(0);
    });
  });
});