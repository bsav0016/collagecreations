import { describe, expect, it, vi } from 'vitest';
import { pickResizer, resizer } from './resizer';

const api = () => ({ imageFileResizer: vi.fn() });

describe('pickResizer', () => {
    it('accepts the resizer object itself', () => {
        const direct = api();
        expect(pickResizer(direct)).toBe(direct);
    });

    it('accepts the whole CommonJS export, which holds it under default (what Vite 8 builds hand over)', () => {
        const inner = api();
        expect(pickResizer({ default: inner })).toBe(inner);
    });

    it('prefers the object that has the function when both could be meant', () => {
        const direct = api();
        expect(pickResizer({ ...direct, default: api() })).toMatchObject({ imageFileResizer: direct.imageFileResizer });
    });

    it('fails with a clear message when there is no resizer', () => {
        for (const bad of [undefined, null, {}, { default: {} }, { default: { imageFileResizer: 'no' } }, 'x', 7]) {
            expect(() => pickResizer(bad)).toThrow('The image resizer could not be loaded');
        }
    });
});

describe('resizer', () => {
    it('gives the real package function in the test environment', () => {
        expect(typeof resizer().imageFileResizer).toBe('function');
    });
});
