// Sequential single-hue ramp (blue, light -> dark) from the dataviz skill's
// reference palette, used to encode scoreline probability magnitude.

const LIGHT_STOPS: [number, string][] = [
  [0, '#cde2fb'],
  [0.15, '#b7d3f6'],
  [0.3, '#9ec5f4'],
  [0.45, '#86b6ef'],
  [0.55, '#6da7ec'],
  [0.65, '#5598e7'],
  [0.75, '#3987e5'],
  [0.82, '#2a78d6'],
  [0.88, '#256abf'],
  [0.93, '#1c5cab'],
  [0.97, '#184f95'],
  [1, '#104281'],
];

const DARK_STOPS: [number, string][] = [
  [0, '#184f95'],
  [0.15, '#1c5cab'],
  [0.3, '#256abf'],
  [0.45, '#2a78d6'],
  [0.55, '#3987e5'],
  [0.65, '#5598e7'],
  [0.75, '#6da7ec'],
  [0.85, '#86b6ef'],
  [1, '#9ec5f4'],
];

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  const c = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

function interpolate(stops: [number, string][], t: number): string {
  const clamped = Math.max(0, Math.min(1, t));
  for (let i = 0; i < stops.length - 1; i++) {
    const [t0, c0] = stops[i];
    const [t1, c1] = stops[i + 1];
    if (clamped >= t0 && clamped <= t1) {
      const localT = t1 === t0 ? 0 : (clamped - t0) / (t1 - t0);
      const rgb0 = hexToRgb(c0);
      const rgb1 = hexToRgb(c1);
      const mixed: [number, number, number] = [
        rgb0[0] + (rgb1[0] - rgb0[0]) * localT,
        rgb0[1] + (rgb1[1] - rgb0[1]) * localT,
        rgb0[2] + (rgb1[2] - rgb0[2]) * localT,
      ];
      return rgbToHex(mixed);
    }
  }
  return stops[stops.length - 1][1];
}

export function sequentialBlue(t: number, mode: 'light' | 'dark'): string {
  return interpolate(mode === 'dark' ? DARK_STOPS : LIGHT_STOPS, t);
}

/** Relative luminance (sRGB) -> pick white or ink text so it clears contrast. */
export function readableTextOn(hex: string): string {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 0.45 ? '#ffffff' : '#0b0b0b';
}
