import { describe, expect, it } from 'vitest';
import { normalizeImageList, parseListField } from './plantData';

describe('parseListField', () => {
  it('returns trimmed array for csv strings', () => {
    expect(parseListField(' leaf , stem,root ')).toEqual(['leaf', 'stem', 'root']);
  });

  it('returns parsed values for json arrays', () => {
    expect(parseListField('["leaf", " stem "]')).toEqual(['leaf', 'stem']);
  });

  it('returns empty array for empty values', () => {
    expect(parseListField('')).toEqual([]);
    expect(parseListField(null)).toEqual([]);
    expect(parseListField(undefined)).toEqual([]);
  });
});

describe('normalizeImageList', () => {
  it('merges main image and gallery images without duplicates', () => {
    expect(normalizeImageList('/main.jpg', '["/main.jpg", "/one.jpg", "/one.jpg"]')).toEqual([
      '/main.jpg',
      '/one.jpg',
    ]);
  });

  it('handles missing main image', () => {
    expect(normalizeImageList('', 'a.jpg, b.jpg')).toEqual(['a.jpg', 'b.jpg']);
  });
});