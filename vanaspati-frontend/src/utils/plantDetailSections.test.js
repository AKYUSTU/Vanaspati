import { describe, expect, it } from 'vitest';
import { buildPlantDetailSections, shouldShowMedicinalUses } from './plantDetailSections';

describe('shouldShowMedicinalUses', () => {
  it('returns true when parsed arrays contain values', () => {
    expect(shouldShowMedicinalUses(['leaf'], [], {})).toBe(true);
    expect(shouldShowMedicinalUses([], ['respiratory'], {})).toBe(true);
  });

  it('returns true when fallback raw fields exist', () => {
    expect(shouldShowMedicinalUses([], [], { partsUsed: 'leaf' })).toBe(true);
    expect(shouldShowMedicinalUses([], [], { bodyParts: 'respiratory' })).toBe(true);
  });

  it('returns false when no medicinal info exists', () => {
    expect(shouldShowMedicinalUses([], [], {})).toBe(false);
  });
});

describe('buildPlantDetailSections', () => {
  it('includes optional sections when data is available', () => {
    const result = buildPlantDetailSections(
      { morphology: 'desc', activeCompounds: 'x', identifyingFeatures: 'y' },
      ['leaf'],
      ['respiratory'],
      true,
      true
    );
    const ids = result.map((section) => section.id);

    expect(ids).toContain('botanical-description');
    expect(ids).toContain('medicinal-uses');
    expect(ids).toContain('phytochemistry');
    expect(ids).toContain('research-studies');
    expect(ids).toContain('precautions');
    expect(ids).toContain('gallery');
  });

  it('excludes optional sections when data is missing', () => {
    const result = buildPlantDetailSections({}, [], [], false, false);
    const ids = result.map((section) => section.id);

    expect(ids).not.toContain('botanical-description');
    expect(ids).not.toContain('medicinal-uses');
    expect(ids).not.toContain('phytochemistry');
    expect(ids).not.toContain('research-studies');
    expect(ids).not.toContain('precautions');
    expect(ids).not.toContain('gallery');
    expect(ids).toContain('overview');
    expect(ids).toContain('traditional-recipes');
  });
});