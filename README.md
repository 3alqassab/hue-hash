**Hue-Hash**

A tiny, zero-dependency npm package that turns any input into a reproducible pastel-friendly hex color based on HSL. By hashing your "salt" and feeding it into three independent PRNG streams, it guarantees consistent, softly muted colors perfect for tags, avatars, charts, and more.

---

## Features

* 🎨 **Consistent Results**: The same input and options always yield the same color.
* 🌈 **Adjustable Palette**: Global or per-call ranges for hue, saturation, and lightness define your pastel spectrum.
* ⚙️ **Customizable**: Override defaults per-call via the `options` argument or tweak globals in source.
* ⚡️ **Zero Dependencies**: Pure TypeScript/JavaScript implementation with no external libraries.

---

## Installation

```bash
npm install hue-hash
# or
yarn add hue-hash
```

---

## Usage

```ts
import { getRandomColor } from 'hue-hash';

// Basic usage with defaults:
const invoiceId = 'F5000071923';
const color = getRandomColor(invoiceId);
console.log(color); // e.g. "#c5d8f1"

// Override ranges per-call using object syntax:
const custom = getRandomColor('order-123', {
  hue: { min: 180, max: 240 },         // restrict hue to blues
  saturation: { min: 30, max: 80 },    // wider saturation band
  lightness: { min: 60, max: 90 },     // deeper pastels
});
```

---

## Configuration

Hue-Hash exposes default global constants at the top of the source. You can adjust these or pass an `options` object directly to `getRandomColor`:

```ts
// Default global ranges (in source):
const HUE_MIN        =   0;   // Hue start (degrees)
const HUE_MAX        = 360;   // Hue end (degrees)

const SATURATION_MIN =  25;   // Saturation start (%)
const SATURATION_MAX =  60;   // Saturation end (%)

const LIGHTNESS_MIN  =  70;   // Lightness start (%)
const LIGHTNESS_MAX  =  90;   // Lightness end (%)
```

Or override any subset using the following object-based keys:

* **hue**: `{ min: number, max: number }` — e.g. `{ min: 0, max: 360 }` covers the full wheel or narrower to focus on certain hues.
* **saturation**: `{ min: number, max: number }` — control how muted vs. vivid the colors are.
* **lightness**: `{ min: number, max: number }` — control how dark vs. light the shades appear.

---

## API

```ts
getRandomColor(
  salt: string,
  options?: Partial<{
    hue: { min: number; max: number };
    saturation: { min: number; max: number };
    lightness: { min: number; max: number };
  }>
): string
```

Generate a reproducible hex color from any input, with optional object-based overrides.

* **Parameters**:

  * `salt` (*any*) — The input to hash for color generation.
  * `options` (*object*, optional) — Partial overrides for `hue`, `saturation`, and `lightness`, each as `{ min, max }`.
* **Returns**: A hex color string in the format `#rrggbb`.

---

## Example

```ts
import { getRandomColor } from 'hue-hash';

// Focus on green-yellow colors:
const greenish = getRandomColor('user-42', {
  hue: { min: 60, max: 120 },
  saturation: { min: 40, max: 70 },
  lightness: { min: 70, max: 90 },
});

// Only override hue, keep defaults for others:
const pinkish = getRandomColor('user-43', {
  hue: { min: 300, max: 360 },
});
```

Use these per-call objects to fine-tune each batch of colors as needed.

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "feat: add ..."`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

---

## License

MIT © Ali AlQassab
