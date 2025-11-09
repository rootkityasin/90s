// Proper display names for categories and subcategories (first letter capitalized, rest lowercase)
const categoryDisplayNames: Record<string, string> = {
  // Main categories
  'cargos': 'Cargo Pants',
  'cargo': 'Cargo Pants',
  'cargo pants': 'Cargo Pants',
  'chinos': 'Chinos',
  'chhinos': 'Chinos', // Handle typo
  'tshirt': 'T-Shirt',
  't-shirt': 'T-Shirt',
  'tee': 'T-Shirt',
  'hoodies': 'Hoodies',
  'hoodie': 'Hoodies',
  'sweatshirt': 'Sweat Shirt',
  'sweat shirt': 'Sweat Shirt',
  'trouser': 'Trouser',
  'trousers': 'Trouser',
  
  // Common subcategories
  'solid': 'Solid',
  'print': 'Print',
  'printed': 'Print',
  'graphic': 'Graphic',
  'plain': 'Plain',
  'stripe': 'Stripe',
  'striped': 'Stripe',
  'oversized': 'Oversized',
  'slim': 'Slim',
  'regular': 'Regular',
  'fit': 'Fit'
};

function toTitleCase(value: string): string {
  return value
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/\B\w/g, (char) => char.toLowerCase());
}

function formatPart(part: string): string {
  const trimmed = part.trim();
  const lower = trimmed.toLowerCase();
  
  // Check if we have a display name mapping
  if (categoryDisplayNames[lower]) {
    return categoryDisplayNames[lower];
  }
  
  // Fallback to title case
  return toTitleCase(trimmed);
}

export function formatCategoryLabel(category?: string | null, subCategory?: string | null): string {
  const parts = [category, subCategory]
    .filter((part): part is string => Boolean(part && part.trim()))
    .map((part) => formatPart(part));

  return parts.join(' • ');
}
