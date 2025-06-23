// ─── CONFIGURABLE RANGES ────────────────────────────────────
const HUE_MIN = 0;    // degrees
const HUE_MAX = 360;

const SATURATION_MIN = 25; // %
const SATURATION_MAX = 60; // %

const LIGHTNESS_MIN = 70;  // %
const LIGHTNESS_MAX = 90;  // %

// ─── TYPES ───────────────────────────────────────────────────
/**
 * Optionally override HSL channel ranges.
 */
export interface ColorOptions {
  /** Hue range in degrees (0-360) */
  hue?: { min: number; max: number };
  /** Saturation range in percent (0-100) */
  saturation?: { min: number; max: number };
  /** Lightness range in percent (0-100) */
  lightness?: { min: number; max: number };
}

// ─── HASH + PRNG HELPERS ────────────────────────────────────
function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(a: number): () => number {
  return (): number => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── HSL → HEX CONVERTER ─────────────────────────────────────
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number): number => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number): number =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const to255 = (x: number): string =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${to255(f(0))}${to255(f(8))}${to255(f(4))}`;
}

// ─── RANGE VALIDATION ───────────────────────────────────────
function validateRange(
	value: number,
	min: number,
	max: number
): number {
	if (value < min || value > max) {
		throw new RangeError(`Value ${value} out of range [${min}, ${max}]`);
	}
	return value;
}

// ─── MAIN FUNCTION ──────────────────────────────────────────
/**
 * Generates a reproducible pastel-friendly hex color from a given string salt.
 *
 * @param salt - The input string used as the seed for color generation.
 * @param options - Optional overrides for hue, saturation, and lightness ranges.
 * @returns A hex color string in the format '#rrggbb'.
 */
export function getRandomColor(
  salt: any,
  options: ColorOptions = {}
): string {
	const stringSalt = typeof salt === 'string' ? salt : JSON.stringify(salt);

  // three independent seeds so H, S, L vary differently
  const hueRand = mulberry32(xmur3(`${stringSalt}__hue`)());
  const satRand = mulberry32(xmur3(`${stringSalt}__sat`)());
  const lightRand = mulberry32(xmur3(`${stringSalt}__lit`)());

  const hueMin = validateRange(options.hue?.min ?? HUE_MIN, 0, 360);
  const hueMax =  validateRange(options.hue?.max ?? HUE_MAX, hueMin, 360);
  const saturationMin = validateRange(options.saturation?.min ?? SATURATION_MIN, 0, 100);
  const saturationMax = validateRange(options.saturation?.max ?? SATURATION_MAX, saturationMin, 100);
  const lightnessMin = validateRange(options.lightness?.min ?? LIGHTNESS_MIN, 0, 100);
  const lightnessMax = validateRange(options.lightness?.max ?? LIGHTNESS_MAX, lightnessMin, 100);

  const hue = Math.floor(hueRand() * (hueMax - hueMin)) + hueMin;
  const saturation =
    Math.floor(satRand() * (saturationMax - saturationMin)) + saturationMin;
  const lightness =
    Math.floor(lightRand() * (lightnessMax - lightnessMin)) + lightnessMin;

  return hslToHex(hue, saturation, lightness);
}
