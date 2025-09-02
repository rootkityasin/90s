"use client";
import React from 'react';

export function Logo({ size=46 }: { size?: number }) {
  const s = size;
  return (
    <svg
      width={s * 2.6}
      height={s}
      viewBox="0 0 260 100"
      role="img"
      aria-label="90s Legacy"
      style={{ display:'block' }}
    >
      <title>90s Legacy</title>
      {/* Stylized 9 */}
      <g fill="currentColor">
        <circle cx="48" cy="50" r="46" fill="currentColor" />
        <circle cx="48" cy="50" r="28" fill="#000" />
        <circle cx="48" cy="50" r="16" fill="currentColor" />
        <circle cx="48" cy="50" r="8" fill="#000" />
        <rect x="82" y="18" width="18" height="82" rx="9" fill="currentColor" transform="rotate(25 91 59)" />
      </g>
      {/* Large circle for 0 */}
      <g fill="currentColor">
        <circle cx="150" cy="54" r="54" />
        <rect x="96" y="46" width="108" height="16" rx="8" fill="#000" />
        <rect x="96" y="46" width="108" height="16" rx="8" fill="#000" />
      </g>
      {/* Stylized 's' block */}
      <g transform="translate(210,38)" fill="currentColor">
        <rect x="0" y="0" width="32" height="24" rx="4" />
        <rect x="0" y="32" width="32" height="24" rx="4" />
        <rect x="0" y="0" width="32" height="56" rx="6" fill="none" stroke="#000" strokeWidth="0" />
        <rect x="0" y="0" width="32" height="24" rx="4" fill="#000" />
        <rect x="0" y="32" width="32" height="24" rx="4" fill="#000" />
        <path d="M0 24 L32 0 V24 Z" fill="currentColor" />
        <path d="M0 32 L32 56 V32 Z" fill="currentColor" />
        <path d="M0 24 L32 0 V24 Z" fill="#000" fillOpacity="0.15" />
        <path d="M0 32 L32 56 V32 Z" fill="#000" fillOpacity="0.15" />
      </g>
    </svg>
  );
}
