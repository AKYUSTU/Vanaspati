import { describe, expect, it } from 'vitest';
import {
  addPlantSelection,
  canAddPlant,
  formatCompareValue,
  getAvailableMatches,
  removePlantSelection,
} from './compareSelection';

describe('compare selection helpers', () => {
  it('enforces max compare limit', () => {
    expect(canAddPlant([1, 2], 3)).toBe(true);
    expect(canAddPlant([1, 2, 3], 3)).toBe(false);
  });

  it('adds unique plant ids only', () => {
    expect(addPlantSelection([1], 2, 3)).toEqual([1, 2]);
    expect(addPlantSelection([1], 1, 3)).toEqual([1]);
  });

  it('does not add when limit is reached', () => {
    expect(addPlantSelection([1, 2, 3], 4, 3)).toEqual([1, 2, 3]);
  });

  it('removes selected ids', () => {
    expect(removePlantSelection([1, 2, 3], 2)).toEqual([1, 3]);
  });

  it('filters selected items out of search results', () => {
    const matches = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ];
    expect(getAvailableMatches(matches, [2], 8).map((item) => item.id)).toEqual([1, 3]);
  });

  it('formats compare values safely', () => {
    expect(formatCompareValue('leaf,stem')).toBe('leaf, stem');
    expect(formatCompareValue('')).toBe('Not specified');
    expect(formatCompareValue(12)).toBe('12');
  });
});