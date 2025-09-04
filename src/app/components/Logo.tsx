"use client";
import React from 'react';

export function Logo({ size=46, withBackground=false, color='#000' }: { size?: number; withBackground?: boolean; color?: string }) {
  const s = size;
  const svg = (
    <svg
      width={s * 2.6}
      height={s}
      viewBox="0 0 260 100"
      role="img"
      aria-label="90s Legacy"
      style={{ display:'block', color }}
    >
      <title>90s Legacy</title>
      <g fill={color}>
        <circle cx="48" cy="50" r="46" />
        {/* Inner details flattened to solid silhouette */}
        <rect x="82" y="18" width="18" height="82" rx="9" transform="rotate(25 91 59)" />
      </g>
      <g fill={color}>
        <circle cx="150" cy="54" r="54" />
        <rect x="96" y="46" width="108" height="16" rx="8" />
      </g>
      <g transform="translate(210,38)" fill={color}>
        <rect x="0" y="0" width="32" height="24" rx="4" />
        <rect x="0" y="32" width="32" height="24" rx="4" />
        <path d="M0 24 L32 0 V24 Z" />
        <path d="M0 32 L32 56 V32 Z" />
      </g>
    </svg>
  );
  if (!withBackground) return svg;
  return (
    <span
      className="logo-mark"
      style={{
        display:'inline-flex',
        alignItems:'center',
        justifyContent:'center',
        background:'#fff',
        color: color,
        borderRadius:10,
        padding:'4px 8px',
        boxShadow:'0 4px 10px -4px rgba(0,0,0,.25)',
        height:s+8,
      }}
    >
      {svg}
    </span>
  );
}
