import { describe, expect, it } from 'vitest';
import {
  buildBotanicalFallbackImage,
  createFallbackPlantsPage,
  getFallbackHerbOfDay,
  getFallbackPlants,
  getFallbackPlantsByBodyPart,
  getPlantDisplayImage,
} from './plantFallbacks';

describe('plantFallbacks', () => {
  it('builds a data uri for fallback images', () => {
    const image = buildBotanicalFallbackImage('Tulsi');
    expect(image.startsWith('data:image/svg+xml;charset=UTF-8,')).toBe(true);
  });

  it('returns curated plants for a body part', () => {
    const plants = getFallbackPlantsByBodyPart('JOINTS');
    expect(plants.length).toBeGreaterThan(0);
    expect(plants.some((plant) => plant.bodyParts.includes('JOINTS'))).toBe(true);
  });

  it('returns a deterministic herb of the day for a date', () => {
    const herb = getFallbackHerbOfDay(new Date('2026-04-18T00:00:00Z'));
    expect(herb.commonName).toBeTruthy();
    expect(herb.mainImageUrl.startsWith('data:image/svg+xml;charset=UTF-8,')).toBe(true);
  });

  it('provides a fallback page shape', () => {
    const page = createFallbackPlantsPage(4);
    expect(page.content).toHaveLength(4);
    expect(page.totalElements).toBe(4);
  });

  it('uses a fallback image when plant image is missing', () => {
    const image = getPlantDisplayImage({ commonName: 'Brahmi' });
    expect(image.startsWith('data:image/svg+xml;charset=UTF-8,')).toBe(true);
  });

  it('returns the requested number of fallback plants', () => {
    expect(getFallbackPlants(3)).toHaveLength(3);
  });
});
