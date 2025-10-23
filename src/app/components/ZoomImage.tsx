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
  noZoom?: boolean; // if true, disable hover zoom
};

// Hover to zoom image. Moves focal point based on cursor position.
// Disabled automatically on touch / coarse pointers.
export function ZoomImage({ src, alt, height = 160, aspectRatio, radius = 8, zoomScale = 2.2, className, style, noZoom }: ZoomImageProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [origin, setOrigin] = React.useState('center center');
  const [hover, setHover] = React.useState(false);
  const isCoarseRef = React.useRef(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      isCoarseRef.current = matchMedia('(pointer:coarse)').matches;
    }
  }, []);

  function updateOrigin(clientX: number, clientY: number) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    updateOrigin(e.clientX, e.clientY);
  }

  function onTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    updateOrigin(touch.clientX, touch.clientY);
  }

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: radius,
    height,
    ...(aspectRatio ? { aspectRatio } : {}),
    background: '#111',
    cursor: isCoarseRef.current ? 'default' : 'zoom-in',
    ...style
  };

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: hover ? 'transform .15s ease-out' : 'transform .6s cubic-bezier(.22,.68,0,1)',
    transformOrigin: origin,
    transform: hover && !noZoom ? `scale(${zoomScale})` : 'scale(1)'
  };

  return (
    <div
      ref={ref}
      className={className}
      style={containerStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={noZoom ? undefined : onMouseMove}
      onTouchStart={noZoom ? undefined : (event) => {
        setHover(true);
        if (event.touches.length > 0) {
          const touch = event.touches[0];
          updateOrigin(touch.clientX, touch.clientY);
        }
      }}
      onTouchEnd={noZoom ? undefined : () => setHover(false)}
      onTouchCancel={noZoom ? undefined : () => setHover(false)}
      onTouchMove={noZoom ? undefined : onTouchMove}
    >
      {/* plain img for now (could migrate to next/image) */}
      <img src={src} alt={alt} style={imgStyle} draggable={false} />
    </div>
  );
}
