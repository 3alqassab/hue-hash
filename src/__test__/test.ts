import { getRandomColor } from '..';

describe('getRandomColor', () => {
  it('returns a valid 6-digit hex string for string salts', () => {
    const hex = getRandomColor('test-key');
    expect(typeof hex).toBe('string');
    expect(hex).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('is deterministic for the same string salt', () => {
    const a = getRandomColor('consistent-salt');
    const b = getRandomColor('consistent-salt');
    expect(a).toBe(b);
  });

  it('produces different colors for different string salts', () => {
    const a = getRandomColor('salt-one');
    const b = getRandomColor('salt-two');
    expect(a).not.toBe(b);
  });

  it('override options with fixed H/S/L yields constant color', () => {
    const opts = {
      hue: { min: 0, max: 0 },
      saturation: { min: 50, max: 50 },
      lightness: { min: 50, max: 50 },
    };
    expect(getRandomColor('a', opts)).toBe('#bf4040');
    expect(getRandomColor('b', opts)).toBe('#bf4040');
  });


  it('accepts number salts', () => {
    const hex1 = getRandomColor(12345);
    const hex2 = getRandomColor(12345);
    const hex3 = getRandomColor(54321);
    expect(hex1).toMatch(/^#[0-9a-f]{6}$/);
    expect(hex1).toBe(hex2);
    expect(hex3).not.toBe(hex1);
  });

  it('accepts boolean salts', () => {
    const hexTrue1 = getRandomColor(true);
    const hexTrue2 = getRandomColor(true);
    const hexFalse = getRandomColor(false);
    expect(hexTrue1).toMatch(/^#[0-9a-f]{6}$/);
    expect(hexTrue1).toBe(hexTrue2);
    expect(hexTrue1).not.toBe(hexFalse);
  });

  it('accepts object salts (stringified)', () => {
    const obj = { foo: 'bar' };
    const hex1 = getRandomColor(obj);
    const hex2 = getRandomColor({ foo: 'bar' });
    const hex3 = getRandomColor({ foo: 'baz' });
    expect(hex1).toMatch(/^#[0-9a-f]{6}$/);
    expect(hex1).toBe(hex2);
    expect(hex1).not.toBe(hex3);
  });

  it('accepts null and undefined salts', () => {
    const hexNull1 = getRandomColor(null);
    const hexNull2 = getRandomColor(null);
    const hexUndef1 = getRandomColor(undefined);
    const hexUndef2 = getRandomColor(undefined);
    expect(hexNull1).toMatch(/^#[0-9a-f]{6}$/);
    expect(hexNull1).toBe(hexNull2);
    expect(hexUndef1).toMatch(/^#[0-9a-f]{6}$/);
    expect(hexUndef1).toBe(hexUndef2);
    // null vs undefined should be different seeds
    expect(hexNull1).not.toBe(hexUndef1);
  });

  it('respects min/max bounds for hue, saturation, and lightness', () => {
    // hue between 300 and 360, full saturation and lightness
    const opts1 = { hue: { min: 300, max: 360 }, saturation: { min: 100, max: 100 }, lightness: { min: 100, max: 100 } };
    const hex1 = getRandomColor('foo', opts1);
    // since sat=100,l=100, the result should be white regardless of hue
    expect(hex1).toBe('#ffffff');

    // saturation zero = gray scale
    const opts2 = { hue: { min: 0, max: 360 }, saturation: { min: 0, max: 0 }, lightness: { min: 25, max: 25 } };
    const hex2 = getRandomColor('bar', opts2);
    // gray at 25% lightness ≈ #404040
    expect(hex2.toLowerCase()).toBe('#404040');
  });

  it('throws on invalid option ranges', () => {
    // min greater than max should be considered invalid
    const badOpts = { hue: { min: 100, max: 0 }, saturation: { min: 0, max: 100 }, lightness: { min: 0, max: 100 } };
    expect(() => getRandomColor('bad', badOpts)).toThrow();
  });
});
