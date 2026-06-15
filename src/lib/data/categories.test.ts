import { describe, it, expect } from 'vitest';
import { categories } from './categories';

describe('categories data', () => {
  it('has the 9 expected categories in order', () => {
    expect(categories.map((c) => c.id)).toEqual([
      'yeux', 'respirer', 'tete', 'peau', 'mains',
      'secours', 'audition', 'legal', 'hydratation'
    ]);
  });

  it('every category has a title and at least one item', () => {
    for (const c of categories) {
      expect(c.title.length).toBeGreaterThan(0);
      expect(c.items.length).toBeGreaterThan(0);
    }
  });

  it('every item has a name, spec, and example', () => {
    for (const c of categories) {
      for (const item of c.items) {
        expect(item.name.length).toBeGreaterThan(0);
        expect(item.spec.length).toBeGreaterThan(0);
        expect(item.example.length).toBeGreaterThan(0);
      }
    }
  });
});
