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
  fit?: 'cover' | 'contain'; // how the image should fit inside container
  background?: string; // container background color
};

// Hover to zoom image. Moves focal point based on cursor position.
// Disabled automatically on touch / coarse pointers.
export function ZoomImage({ src, alt, height = 160, aspectRatio, radius = 8, zoomScale = 2.2, className, style, noZoom, fit = 'cover', background = '#111' }: ZoomImageProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [origin, setOrigin] = React.useState('center center');
  const [hover, setHover] = React.useState(false);
  const [scale, setScale] = React.useState(1);
  const [isPinching, setIsPinching] = React.useState(false);
  const isCoarseRef = React.useRef(false);
  const lastTapRef = React.useRef(0);
  const pinchDistanceRef = React.useRef<number | null>(null);
  const pinchStartScaleRef = React.useRef(1);

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

  function handleDoubleTap(clientX: number, clientY: number) {
    if (!ref.current) return;
    updateOrigin(clientX, clientY);
    setScale(prev => (prev > 1 ? 1 : zoomScale));
  }

  function distance(touches: React.TouchList) {
    if (touches.length < 2) return 0;
    const a = touches.item(0);
    const b = touches.item(1);
    if (!a || !b) return 0;
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  function midpoint(touches: React.TouchList) {
    if (!ref.current || touches.length < 2) return null;
    const a = touches.item(0);
    const b = touches.item(1);
    if (!a || !b) return null;
    const x = (a.clientX + b.clientX) / 2;
    const y = (a.clientY + b.clientY) / 2;
    return { x, y };
  }

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    updateOrigin(e.clientX, e.clientY);
  }

  function onTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    if (noZoom) return;
    if (e.touches.length === 0) return;

    if (e.touches.length >= 2 && pinchDistanceRef.current) {
      e.preventDefault();
      const dist = distance(e.touches);
      if (!dist) return;
      const ratio = dist / pinchDistanceRef.current;
      const nextScale = Math.min(Math.max(1, pinchStartScaleRef.current * ratio), zoomScale * 1.5);
      setScale(nextScale);
  const mid = midpoint(e.touches);
  if (mid) updateOrigin(mid.x, mid.y);
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      updateOrigin(touch.clientX, touch.clientY);
    }
  }

  const touchActionValue = isCoarseRef.current && !noZoom ? (scale > 1 ? 'none' : 'pan-y') : undefined;

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: radius,
    height,
    ...(aspectRatio ? { aspectRatio } : {}),
    background,
    cursor: isCoarseRef.current ? 'default' : 'zoom-in',
    touchAction: touchActionValue,
    ...style
  };

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: fit,
    display: 'block',
    transition: isPinching ? 'none' : hover && !isCoarseRef.current && !noZoom ? 'transform .15s ease-out' : 'transform .45s cubic-bezier(.22,.68,0,1)',
    transformOrigin: origin,
    transform: !noZoom && !isCoarseRef.current && hover ? `scale(${zoomScale})` : `scale(${scale})`
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
        if (event.touches.length === 0) return;
        setHover(true);

        if (event.touches.length >= 2) {
          setIsPinching(true);
          pinchDistanceRef.current = distance(event.touches);
          pinchStartScaleRef.current = scale;
          const mid = midpoint(event.touches);
          if (mid) updateOrigin(mid.x, mid.y);
        } else {
          const now = Date.now();
          const touch = event.touches[0];
          if (now - lastTapRef.current < 280) {
            event.preventDefault();
            handleDoubleTap(touch.clientX, touch.clientY);
          } else {
            updateOrigin(touch.clientX, touch.clientY);
          }
          lastTapRef.current = now;
        }
      }}
      onTouchEnd={noZoom ? undefined : (event) => {
        if (event.touches.length < 2) {
          setIsPinching(false);
          pinchDistanceRef.current = null;
        }
        if (event.touches.length === 0) {
          setHover(false);
          if (scale < 1.05) setScale(1);
        }
      }}
      onTouchCancel={noZoom ? undefined : () => {
        setIsPinching(false);
        pinchDistanceRef.current = null;
        setHover(false);
        setScale(1);
      }}
      onTouchMove={noZoom ? undefined : onTouchMove}
    >
      {/* plain img for now (could migrate to next/image) */}
      <img src={src} alt={alt} style={imgStyle} draggable={false} />
    </div>
  );
}
