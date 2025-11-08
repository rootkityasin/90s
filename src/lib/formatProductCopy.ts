import type { Product } from './types';
import { formatCategoryLabel } from './formatCategoryLabel';

const bulletSeparators = /[•·\u2022]+/g;

function normaliseWhitespace(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/\s*([,;:])\s*/g, '$1 ')
    .replace(/\s*([.?!])\s*/g, '$1 ')
    .trim();
}

function splitFragments(raw?: string | null): string[] {
  if (!raw) return [];
  return raw
    .replace(/\r\n?/g, '\n')
    .split(/\n+/)
    .flatMap((line) => line.split(bulletSeparators))
    .map((fragment) => fragment.replace(/^[-–—]+\s*/, '').trim())
    .filter(Boolean);
}

function capitaliseFirstAlpha(value: string): string {
  const index = value.search(/[A-Za-z]/);
  if (index === -1) return value;
  return (
    value.slice(0, index) +
    value.charAt(index).toUpperCase() +
    value.slice(index + 1)
  );
}

function ensureSentence(value: string): string {
  const trimmed = normaliseWhitespace(value);
  if (!trimmed) return '';
  const capitalised = capitaliseFirstAlpha(trimmed);
  return /[.!?]$/.test(capitalised) ? capitalised : `${capitalised}.`;
}

function fallbackDescription(title: string, category: string): string[] {
  const descriptorSource = title?.trim() || formatCategoryLabel(category) || 'Signature piece';
  const cleanDescriptor = descriptorSource.replace(/^[Tt]he\s+/, '');
  const descriptor = cleanDescriptor
    .split(/\s+/)
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ''))
    .filter(Boolean)
    .join(' ');

  return [
    `The ${descriptor || 'Signature Piece'} is tailored with clean lines and modern proportions for a polished everyday silhouette.`,
    'Premium fabrication and considered finishing deliver lasting comfort from day to night.',
    'Style it with wardrobe staples to elevate both casual and refined looks.'
  ];
}

const FABRIC_FALLBACK_SENTENCES = [
  'Fabric: Premium cotton blend with natural stretch for breathable comfort.',
  'Pre-laundered for a soft, broken-in hand feel.',
  'Colorfast finishing preserves the tone wear after wear.'
];

export function ensureProfessionalDescription(title: string, category: string, description?: string | null): string {
  const fragments = splitFragments(description);
  const sentences = fragments
    .map(ensureSentence)
    .filter(Boolean);

  const source = sentences.length ? sentences : fallbackDescription(title, category);
  return source.map(ensureSentence).join(' ');
}

export function ensureProfessionalFabricDetails(fabricDetails?: string | null): string {
  const fragments = splitFragments(fabricDetails);
  let sentences = fragments.map((fragment, index) => {
    let text = fragment;
    if (index === 0 && !/^fabric\b/i.test(text)) {
      text = `Fabric: ${text}`;
    }
    return ensureSentence(text);
  }).filter(Boolean);

  if (!sentences.length) {
    sentences = FABRIC_FALLBACK_SENTENCES.map(ensureSentence);
  }

  const [first, ...rest] = sentences;
  const normalisedFirst = /^Fabric:/i.test(first) ? first.replace(/^Fabric:/i, 'Fabric:').trim() : `Fabric: ${first}`;
  return [ensureSentence(normalisedFirst), ...rest.map(ensureSentence)].join(' ');
}

export function polishProductCopy<P extends { title: string; category: string; description?: string | null; fabricDetails?: string | null }>(
  product: P
): P & { description: string; fabricDetails: string } {
  return {
    ...product,
    description: ensureProfessionalDescription(product.title, product.category, product.description),
    fabricDetails: ensureProfessionalFabricDetails(product.fabricDetails)
  };
}
