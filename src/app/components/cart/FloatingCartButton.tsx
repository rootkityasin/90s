"use client";
import React from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';
import Lottie from 'lottie-react';
import animationData from '../../../../public/assets/animation/Add To Cart Success black.json';

export function FloatingCartButton() {
  const { totalQty } = useCart();
  const playerRef = React.useRef<any>(null);
  React.useEffect(()=>{
    if (!playerRef.current) return;
    if (totalQty > 0) {
      try {
        playerRef.current.stop?.();
        playerRef.current.play?.();
      } catch {}
    }
  },[totalQty]);
  return (
    <Link href="/cart" aria-label="Cart" style={wrapperStyle}>
      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Lottie
          lottieRef={playerRef}
          animationData={animationData as any}
          loop={false}
          autoplay={false}
          style={{ width:44, height:44 }}
          onComplete={() => {
            try {
              // Return to initial frame (frame 0) and stay there
              playerRef.current?.stop?.();
              playerRef.current?.goToAndStop?.(0, true);
            } catch {}
          }}
        />
      </div>
      <span style={badgeStyle}>{totalQty}</span>
    </Link>
  );
}

const wrapperStyle: React.CSSProperties = {
  position:'fixed',
  right:'1.2rem',
  bottom:'1.2rem',
  width:60,
  height:60,
  borderRadius:'50%',
  background:'linear-gradient(145deg,#111 0%, #222 60%)',
  color:'#fff',
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  fontWeight:600,
  textDecoration:'none',
  boxShadow:'0 8px 24px -8px rgba(0,0,0,.55), 0 4px 10px -4px rgba(0,0,0,.4)',
  zIndex:1000,
  backdropFilter:'blur(4px)',
  border:'1px solid #333'
};
const badgeStyle: React.CSSProperties = {
  position:'absolute',
  top:-6,
  right:-6,
  background:'var(--color-accent-2)',
  color:'#000',
  fontSize:12,
  fontWeight:700,
  borderRadius:20,
  padding:'2px 6px',
  minWidth:24,
  textAlign:'center',
  boxShadow:'0 2px 6px -2px rgba(0,0,0,.45)'
};
