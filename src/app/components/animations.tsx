"use client";
import React from 'react';
import { motion, Variants } from 'framer-motion';

// Generic variants
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: .55, ease: [0.22,0.68,0,1], delay: i * 0.08 } })
};

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

export function FadeUpDiv({ children, index = 0, className, style }: { children: React.ReactNode; index?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <motion.div className={className} style={style} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }} custom={index}>
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return <motion.div className={className} variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true }}>{children}</motion.div>;
}

export function GentleScale({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return <motion.div className={className} initial={{ opacity:0, scale:.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:.6, delay, ease:[0.22,0.68,0,1] }}>{children}</motion.div>;
}

export function AnimatedNumber({ value }: { value: number }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  React.useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const start = 0; const end = value; const dur = 900; const t0 = performance.now();
    function tick(t:number){
      const k = Math.min(1, (t - t0)/dur);
      const eased = 1 - Math.pow(1-k, 3);
      el.textContent = Math.round(start + (end-start)*eased).toString();
      if (k < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [value]);
  return <span ref={ref}>0</span>;
}
