
import { describe, it, expect } from 'vitest';
import { filterItems } from './search';

describe('filterItems', () => {
    const items = [
        { id: 1, name: 'Lionel Messi', team: 'Argentina' },
        { id: 2, name: 'Cristiano Ronaldo', team: 'Portugal' },
        { id: 3, name: 'Kylian Mbappe', team: 'France' },
    ];

    it('returns all items if query is empty', () => {
        expect(filterItems(items, '', ['name'])).toEqual(items);
    });

    it('filters items based on a single key', () => {
        const result = filterItems(items, 'Messi', ['name']);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Lionel Messi');
    });

    it('filters items based on multiple keys', () => {
        const result = filterItems(items, 'Argentina', ['name', 'team']);
        expect(result).toHaveLength(1);
        expect(result[0].team).toBe('Argentina');
    });

    it('is case insensitive', () => {
        const result = filterItems(items, 'messi', ['name']);
        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Lionel Messi');
    });

    it('returns empty array if no matches found', () => {
        const result = filterItems(items, 'Neymar', ['name']);
        expect(result).toHaveLength(0);
    });
});
