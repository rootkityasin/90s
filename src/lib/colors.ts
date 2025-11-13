type RGB = [number, number, number];

export type NamedColor = {
  name: string;
  hex: string;
  rgb: RGB;
};

const RAW_COLOR_DEFINITIONS: Array<{ name: string; hex: string }> = [
  { name: 'Black', hex: '#000000' },
  { name: 'Charcoal', hex: '#2F4F4F' },
  { name: 'Graphite', hex: '#3B3F46' },
  { name: 'Slate', hex: '#708090' },
  { name: 'Storm', hex: '#6B7280' },
  { name: 'Smoke', hex: '#B0B0B0' },
  { name: 'Light Gray', hex: '#D3D3D3' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Ivory', hex: '#FFFFF0' },
  { name: 'Cream', hex: '#FFFDD0' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Sand', hex: '#C2B280' },
  { name: 'Camel', hex: '#C19A6B' },
  { name: 'Tan', hex: '#D2B48C' },
  { name: 'Khaki', hex: '#C3B091' },
  { name: 'Brown', hex: '#8B4513' },
  { name: 'Chocolate', hex: '#5C3317' },
  { name: 'Copper', hex: '#B87333' },
  { name: 'Rust', hex: '#B7410E' },
  { name: 'Burgundy', hex: '#800020' },
  { name: 'Maroon', hex: '#800000' },
  { name: 'Wine', hex: '#722F37' },
  { name: 'Red', hex: '#B22222' },
  { name: 'Scarlet', hex: '#FF2400' },
  { name: 'Coral', hex: '#FF7F50' },
  { name: 'Peach', hex: '#FFDAB9' },
  { name: 'Orange', hex: '#FF8C00' },
  { name: 'Amber', hex: '#FFBF00' },
  { name: 'Gold', hex: '#DAA520' },
  { name: 'Mustard', hex: '#D4A017' },
  { name: 'Yellow', hex: '#FFD700' },
  { name: 'Olive', hex: '#808000' },
  { name: 'Lime', hex: '#32CD32' },
  { name: 'Chartreuse', hex: '#7FFF00' },
  { name: 'Green', hex: '#008000' },
  { name: 'Forest Green', hex: '#228B22' },
  { name: 'Emerald', hex: '#2E8B57' },
  { name: 'Jade', hex: '#00A86B' },
  { name: 'Mint', hex: '#98FF98' },
  { name: 'Seafoam', hex: '#7FFFD4' },
  { name: 'Teal', hex: '#008080' },
  { name: 'Turquoise', hex: '#40E0D0' },
  { name: 'Aqua', hex: '#00FFFF' },
  { name: 'Cyan', hex: '#00B7EB' },
  { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Denim', hex: '#2A5C99' },
  { name: 'Steel Blue', hex: '#4682B4' },
  { name: 'Blue', hex: '#1E90FF' },
  { name: 'Royal Blue', hex: '#4169E1' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Indigo', hex: '#4B0082' },
  { name: 'Periwinkle', hex: '#CCCCFF' },
  { name: 'Lavender', hex: '#E6E6FA' },
  { name: 'Lilac', hex: '#C8A2C8' },
  { name: 'Purple', hex: '#800080' },
  { name: 'Plum', hex: '#8E4585' },
  { name: 'Magenta', hex: '#FF00FF' },
  { name: 'Fuchsia', hex: '#FF77FF' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Blush', hex: '#F9C6C9' },
  { name: 'Rose', hex: '#FF007F' },
  { name: 'Berry', hex: '#8A0253' }
];

function normalizeColorName(name: string): string {
  return name.trim().toLowerCase();
}

function hexToRgb(hex: string): RGB | null {
  const value = hex.replace('#', '');
  if (value.length !== 6) return null;
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return [r, g, b];
}

const NAMED_COLORS: NamedColor[] = RAW_COLOR_DEFINITIONS
  .map((entry) => {
    const rgb = hexToRgb(entry.hex);
    if (!rgb) return null;
    return { ...entry, rgb } as NamedColor;
  })
  .filter((entry): entry is NamedColor => Boolean(entry));

export const COLOR_NAME_OPTIONS = NAMED_COLORS.map((entry) => entry.name);

export function colorNameToHex(name: string): string | undefined {
  const normalized = normalizeColorName(name);
  const found = NAMED_COLORS.find((entry) => normalizeColorName(entry.name) === normalized);
  return found?.hex;
}

export function findNearestColor(hex: string): { name: string; hex: string } {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return { name: 'Custom', hex };
  }
  let closest: NamedColor = NAMED_COLORS[0];
  let smallestDistance = Number.POSITIVE_INFINITY;
  for (const entry of NAMED_COLORS) {
    const distance = Math.pow(entry.rgb[0] - rgb[0], 2) +
      Math.pow(entry.rgb[1] - rgb[1], 2) +
      Math.pow(entry.rgb[2] - rgb[2], 2);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      closest = entry;
    }
  }
  return { name: closest.name, hex };
}

export function getAllColorNames(): string[] {
  return [...COLOR_NAME_OPTIONS];
}
