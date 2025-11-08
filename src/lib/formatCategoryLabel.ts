function toTitleCase(value: string): string {
  return value
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\B\w/g, (char) => char.toLowerCase());
}

const corrections: Record<string, string> = {
  chhinos: 'chinos'
};

function normalizePart(part: string): string {
  const trimmed = part.trim();
  const lower = trimmed.toLowerCase();
  const corrected = corrections[lower] || lower;
  return corrected;
}

export function formatCategoryLabel(category?: string | null, subCategory?: string | null): string {
  const parts = [category, subCategory]
    .filter((part): part is string => Boolean(part && part.trim()))
    .map((part) => toTitleCase(normalizePart(part)));

  return parts.join(' • ');
}
