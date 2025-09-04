"use client";
import React from 'react';

type ZoomImageProps = {
  src: string;
  alt: string;
  height?: number;
  aspectRatio?: string; // e.g. '3/4'
  radius?: number;
  zoomScale?: number;
  className?: string;
  style?: React.CSSProperties;
};

// Hover to zoom image. Moves focal point based on cursor position.
// Disabled automatically on touch / coarse pointers.
export function ZoomImage({ src, alt, height = 160, aspectRatio, radius = 8, zoomScale = 2.2, className, style }: ZoomImageProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [origin, setOrigin] = React.useState('center center');
  const [hover, setHover] = React.useState(false);
  const isCoarse = typeof window !== 'undefined' && matchMedia('(pointer:coarse)').matches;

  function onMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: radius,
    height,
    ...(aspectRatio ? { aspectRatio } : {}),
    background: '#111',
    cursor: isCoarse ? 'default' : 'zoom-in',
    ...style
  };

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: hover ? 'transform .15s ease-out' : 'transform .6s cubic-bezier(.22,.68,0,1)',
    transformOrigin: origin,
    transform: hover && !isCoarse ? `scale(${zoomScale})` : 'scale(1)'
  };

  return (
    <div
      ref={ref}
      className={className}
      style={containerStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={onMove}
    >
      {/* plain img for now (could migrate to next/image) */}
      <img src={src} alt={alt} style={imgStyle} draggable={false} />
    </div>
  );
}
