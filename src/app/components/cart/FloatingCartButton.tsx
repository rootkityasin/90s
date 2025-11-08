"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartContext';
import Lottie from 'lottie-react';
import animationData from '../../../../public/assets/animation/Add To Cart Success black.json';

export function FloatingCartButton() {
  const pathname = usePathname();
  if (pathname?.startsWith('/client') || pathname?.startsWith('/admin')) return null;
  const { totalQty } = useCart();
  const playerRef = React.useRef<any>(null);
  const dragOffsetRef = React.useRef({ x: 0, y: 0 });
  const dragMovedRef = React.useRef(false);
  const activePointerIdRef = React.useRef<number | null>(null);
  const mouseDragActiveRef = React.useRef(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);

  const clampPosition = React.useCallback((pos: { x: number; y: number }) => {
    if (typeof window === 'undefined') return pos;
    const padding = 12;
    const buttonSize = 72;
    const maxX = window.innerWidth - buttonSize;
    const maxY = window.innerHeight - buttonSize;
    return {
      x: Math.min(Math.max(pos.x, padding), maxX),
      y: Math.min(Math.max(pos.y, padding), maxY)
    };
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    setPosition(prev => {
      if (prev.x !== 0 || prev.y !== 0) return clampPosition(prev);
      const initial = (() => {
        const isMobile = window.innerWidth <= 640;
        return {
          x: Math.max(window.innerWidth - 92, 12),
          // On mobile start a bit lower (closer to bottom) so it sits naturally above thumb area
          y: isMobile ? Math.max(window.innerHeight - 120, 120) : Math.max(window.innerHeight - 260, 120)
        };
      })();
      return clampPosition(initial);
    });
  }, [clampPosition]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      setPosition(prev => clampPosition(prev));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [clampPosition]);

  const beginDrag = React.useCallback((clientX: number, clientY: number) => {
    dragOffsetRef.current = {
      x: clientX - position.x,
      y: clientY - position.y
    };
    dragMovedRef.current = false;
    setIsDragging(true);
  }, [position.x, position.y]);

  const continueDrag = React.useCallback((clientX: number, clientY: number) => {
    const next = clampPosition({
      x: clientX - dragOffsetRef.current.x,
      y: clientY - dragOffsetRef.current.y
    });
    if (Math.abs(next.x - position.x) > 1 || Math.abs(next.y - position.y) > 1) {
      dragMovedRef.current = true;
    }
    setPosition(next);
  }, [clampPosition, position.x, position.y]);

  const endDrag = React.useCallback(() => {
    setIsDragging(false);
    mouseDragActiveRef.current = false;
    activePointerIdRef.current = null;
  }, []);

  const handlePointerDown = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    activePointerIdRef.current = event.pointerId;
    mouseDragActiveRef.current = false;
    beginDrag(event.clientX, event.clientY);
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }, [beginDrag]);

  const handlePointerMove = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    if (activePointerIdRef.current !== null && event.pointerId !== activePointerIdRef.current) return;
    event.preventDefault();
    continueDrag(event.clientX, event.clientY);
  }, [continueDrag, isDragging]);

  const handlePointerUp = React.useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== null && event.pointerId !== activePointerIdRef.current) return;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    endDrag();
  }, [endDrag]);

  const handleMouseDown = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== null) return;
    if (event.button !== 0) return;
    mouseDragActiveRef.current = true;
    beginDrag(event.clientX, event.clientY);
    event.preventDefault();
  }, [beginDrag]);

  const handleMouseMove = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!mouseDragActiveRef.current || activePointerIdRef.current !== null) return;
    event.preventDefault();
    continueDrag(event.clientX, event.clientY);
  }, [continueDrag]);

  const handleMouseUp = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!mouseDragActiveRef.current || activePointerIdRef.current !== null) return;
    endDrag();
  }, [endDrag]);

  React.useEffect(() => {
    if (!playerRef.current) return;
    if (totalQty > 0) {
      try {
        playerRef.current.stop?.();
        playerRef.current.play?.();
      } catch {}
    }
  }, [totalQty]);

  React.useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isDragging) {
      const previous = document.body.style.cursor;
      document.body.style.cursor = 'grabbing';
      return () => {
        document.body.style.cursor = previous;
      };
    }
  }, [isDragging]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 60,
        height: 60,
  transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isDragging ? 1.14 : 1})`,
        zIndex: 1100,
        touchAction: 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
  transition: isDragging ? 'transform 0.08s ease-out' : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
  filter: isDragging ? 'saturate(1.08)' : 'none'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Link
        href="/cart"
        aria-label="Cart"
        style={{
          ...buttonStyle,
          transform: isDragging ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.12s ease, filter 0.18s ease, box-shadow 0.18s ease',
          filter: isDragging ? 'brightness(1.08) contrast(1.1)' : 'none',
          boxShadow: isDragging
            ? '0 24px 32px -18px rgba(63, 31, 15, 0.46)'
            : '0 10px 20px -16px rgba(63, 31, 15, 0.35)'
        }}
        onClick={event => {
          if (dragMovedRef.current) {
            event.preventDefault();
            dragMovedRef.current = false;
          }
        }}
      >
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Lottie
            lottieRef={playerRef}
            animationData={animationData as any}
            loop={false}
            autoplay={false}
            style={{ width: 44, height: 44 }}
            onComplete={() => {
              try {
                playerRef.current?.stop?.();
                playerRef.current?.goToAndStop?.(0, true);
              } catch {}
            }}
          />
        </div>
        <span style={badgeStyle}>{totalQty}</span>
      </Link>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  background: 'radial-gradient(circle at 35% 35%, #ffe8c8 0%, #f1b474 65%, #d3754f 100%)',
  color: '#2b1208',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 600,
  textDecoration: 'none',
  border: '2px solid #3f1f0f',
  outline: '3px solid rgba(255, 236, 212, 0.85)',
  outlineOffset: '-6px'
};
const badgeStyle: React.CSSProperties = {
  position:'absolute',
  top:-6,
  right:-6,
  background:'#3f1f0f',
  color:'#ffdda9',
  fontSize:12,
  fontWeight:700,
  borderRadius:20,
  padding:'2px 6px',
  minWidth:24,
  textAlign:'center',
  border:'2px solid #f7d9a8'
};
