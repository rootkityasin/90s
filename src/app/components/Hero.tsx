"use client";
import React from 'react';
import { motion } from 'framer-motion';

const container = { hidden:{ opacity:0 }, show:{ opacity:1, transition:{ staggerChildren:0.12, delayChildren:0.1 } } };
const item = { hidden:{ opacity:0, y:30, filter:'blur(6px)' }, show:{ opacity:1, y:0, filter:'blur(0)', transition:{ duration:0.7, ease:[0.22,0.68,0,1] } } };

const heroLead = {
  label:'MEN +',
  price:'Tk 800',
  title:'Workwear Season',
  ctaLabel:'Shop Now',
  ctaHref:'/retail?category=cargos',
  image:'/photoshoot/temp.jpg',
  alt:'Workwear season look in camel jacket'
};

const categorySpotlights = [
  {
    title:'Shirts',
    sub:'Explore',
    href:'/retail?category=tshirt',
    image:'/assets/products/tshirt/07bea6acb69e74424a03a4680f68e12c.jpg',
    alt:'Checked overshirt with white tee'
  },
  {
    title:'Denim Looks',
    sub:'Explore',
    href:'/retail?category=trouser',
    image:'/assets/products/trouser/6214e2a2443ee78105b3e0ad6d07bf60.jpg',
    alt:'Denim trousers close up'
  },
  {
    title:'Outerwear',
    sub:'Explore',
    href:'/retail?category=hoodies',
    image:'/assets/products/hoodies/baa7eed5a7a9e55d8307a2b838791f3a.jpg',
    alt:'Black bomber jacket look'
  },
  {
    title:'Tailored',
    sub:'Explore',
    href:'/retail?category=trouser',
    image:'/assets/products/trouser/f3a8e4d13f23763b2d08f038412392d2.jpg',
    alt:'Tailored trousers in black'
  }
];

const categoryNavigation = [
  { label:'Jackets & Coats', sub:'Explore', href:'/retail?category=hoodies' },
  { label:'Trousers', sub:'Explore', href:'/retail?category=trouser' },
  { label:'New In', sub:'Explore', href:'/retail?category=tshirt' },
  { label:'View All', sub:'', href:'/retail' }
];

const newInTiles = [
  { image:'/assets/products/tshirt/solid/0e2b28283b60dc0389aa6d49a05bd4c0.jpg', alt:'Sand crew sweat', href:'/retail?category=tshirt' },
  { image:'/assets/products/hoodies/559b7d9643bdbe8c7a96d76158466766.jpg', alt:'Black hoodie with logo', href:'/retail?category=hoodies' },
  { image:'/assets/products/tshirt/23aa776e9c8368e3fccfb0baeb685d06.jpg', alt:'Bright orange varsity tee', href:'/retail?category=tshirt' },
  { image:'/assets/products/hoodies/085c003a42f5a21f827cbc4080c612a6.jpg', alt:'Fleece zip jacket', href:'/retail?category=hoodies' },
  { image:'/assets/products/cargos/55c3234eff59dac330b33e74724c84fd.jpg', alt:'Puffer vest in brown', href:'/retail?category=cargos' },
  { image:'/assets/products/tshirt/solid/d69b45df33eaf21a533615e382ccda3c.jpg', alt:'Cream fisherman knit', href:'/retail?category=tshirt' },
  { image:'/assets/products/tshirt/39c44ec28011cc11717728a461825af0.jpg', alt:'Plaid shirt in camel', href:'/retail?category=tshirt' },
  { image:'/assets/products/trouser/83fd5a90a581f697d8e829dc7544f8ce.jpg', alt:'Chocolate wool coat', href:'/retail?category=trouser' },
  { image:'/assets/products/tshirt/0be797d2a46327eff36b93e8a6e6e9ab.jpg', alt:'Black knit polo', href:'/retail?category=tshirt' },
  { image:'/assets/products/trouser/7feb410b92183d9964c5c38ec8c799df.jpg', alt:'Olive suit set', href:'/retail?category=trouser' },
  { image:'/assets/products/trouser/cfdfd11e5769d0d4630d8c557e5e1ced.jpg', alt:'Tailored trousers in brown', href:'/retail?category=trouser' },
  { image:'/assets/products/tshirt/0fb834700dc7fc3174915a276e0a1eef.jpg', alt:'Beige zip jacket', href:'/retail?category=tshirt' }
];

const secondaryHero = {
  price:'Rs.2,999.00',
  title:'New Autumn Arrivals',
  ctaLabel:'Shop Now',
  ctaHref:'/retail?category=hoodies',
  image:'/assets/products/hoodies/6dc994232a421c0a26d8194ccbfc3ec2.jpg',
  alt:'Gray knit over shirt collar'
};

const editorialStory = {
  season:'Festive 2025',
  ctaLabel:'Shop Now',
  ctaHref:'/retail?category=trouser',
  heading:"Men's Clothing",
  copy:'Check out all the freshest styles your closet has been waiting for.',
  image:'/assets/products/chinos/ef2da17b3d7d84a0ee6cbb0ac7e1d6cb.jpg',
  alt:'Model in neutral suit on staircase'
};

const homeCardTheme = {
  surface:'linear-gradient(165deg, rgba(255, 231, 203, 0.96) 0%, rgba(255, 214, 176, 0.82) 100%)',
  border:'rgba(96, 70, 42, 0.18)',
  text:'#183a31',
  heading:'#0e251e',
  subtext:'rgba(24, 58, 49, 0.62)',
  shadow:'0 32px 58px -34px rgba(16, 45, 36, 0.48)'
};

const spotlightStyles = {
  container:{} as React.CSSProperties
};

const newInStyles = {
  container:{
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    padding:'1.6rem 1.1rem',
    background:homeCardTheme.surface,
    borderRadius:24,
    border:`1px solid ${homeCardTheme.border}`,
    textDecoration:'none',
    color:homeCardTheme.text,
    boxShadow:'0 28px 48px -36px rgba(16, 45, 36, 0.42)',
    transition:'transform .3s ease, box-shadow .3s ease'
  } as React.CSSProperties,
  image:{
    width:'100%',
    height:180,
    objectFit:'cover',
    borderRadius:16,
    background:'rgba(255,255,255,0.82)',
    boxShadow:'0 18px 36px -28px rgba(16, 45, 36, 0.4)',
    border:'1px solid rgba(96, 70, 42, 0.08)'
  } as React.CSSProperties,
  caption:{
    marginTop:'1rem',
    fontSize:'0.68rem',
    letterSpacing:'0.18em',
    textTransform:'uppercase',
    textAlign:'center',
    color:homeCardTheme.heading
  } as React.CSSProperties
};

const heroLeadStyles = {
  wrapper:{
    width:'100vw',
    maxWidth:'none',
    position:'relative',
    borderRadius:0,
    overflow:'hidden',
    display:'block',
    lineHeight:0,
    boxShadow:'none',
    margin:'-1rem calc(50% - 50vw) 0',
    height:'calc(100vh - 64px)',
    minHeight:520
  } as React.CSSProperties,
  image:{ width:'100%', height:'100%', display:'block', objectFit:'cover' } as React.CSSProperties,
  label:{
    position:'absolute',
    top:26,
    left:30,
    fontSize:'0.72rem',
    letterSpacing:'0.3em',
    textTransform:'uppercase',
    color:'#1878ff'
  } as React.CSSProperties,
  price:{
    position:'absolute',
    top:'20%',
    right:30,
    padding:'0.32rem 0.76rem 0.32rem 1.45rem',
    background:'#fff',
    border:'1px solid rgba(0,0,0,0.26)',
    fontSize:'0.82rem',
    letterSpacing:'0.12em',
    textTransform:'uppercase',
    borderRadius:2,
    color:'#111',
    fontWeight:500,
    display:'inline-flex',
    alignItems:'center'
  } as React.CSSProperties,
  pricePointer:{
    position:'absolute',
    left:'-14px',
    top:'50%',
    width:16,
    height:16,
    border:'1px solid rgba(0,0,0,0.75)',
    background:'#000',
    transform:'translateY(-50%) rotate(45deg)',
    display:'flex',
    alignItems:'center',
    justifyContent:'center'
  } as React.CSSProperties,
  footer:{
    position:'absolute',
    bottom:0,
    left:0,
    right:0,
    display:'flex',
    justifyContent:'space-between',
    alignItems:'center',
    gap:'1rem',
    padding:'1rem 1.8rem 1.05rem',
    background:'rgba(255,255,255,0.94)',
    backdropFilter:'blur(8px)',
    fontSize:'0.9rem',
    letterSpacing:'0.12em',
    textTransform:'uppercase',
    color:'#111',
    borderTop:'1px solid rgba(0,0,0,0.12)'
  } as React.CSSProperties,
  cta:{
    fontSize:'0.72rem',
    letterSpacing:'0.22em',
    textTransform:'uppercase',
    textDecoration:'underline',
    color:'#111'
  } as React.CSSProperties
};

export function Hero() {
  const categoryGridStyles = React.useMemo(() => ({
    width:'100%',
    maxWidth:'min(920px, 94vw)',
    display:'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap:0,
  overflow:'hidden',
    marginTop:'1.6rem',
    marginLeft:'auto',
    marginRight:'auto',
    borderRadius:26,
    boxShadow:'0 32px 56px -36px rgba(0,0,0,0.4)',
    border:'1px solid rgba(0,0,0,0.08)'
  }), []);
  return (
    <motion.section
      variants={container}
      initial="hidden"
      animate="show"
      style={{
        width:'100%',
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        gap:0,
        padding:'0 0 5rem'
      }}
    >
      <motion.a
        variants={item}
        href={heroLead.ctaHref}
        whileHover={{ opacity:0.92 }}
        style={heroLeadStyles.wrapper}
      >
        <img
          src={heroLead.image}
          alt={heroLead.alt}
          style={heroLeadStyles.image}
        />
        <span style={heroLeadStyles.label}>{heroLead.label}</span>
        <span style={heroLeadStyles.price}>
          <span style={heroLeadStyles.pricePointer}>
            <span
              style={{
                width:6,
                height:6,
                background:'#fff',
                display:'block',
                transform:'rotate(-45deg)'
              }}
            />
          </span>
          <strong style={{ fontWeight:500 }}>{heroLead.price}</strong>
        </span>
  <footer style={heroLeadStyles.footer}>
          <span>{heroLead.title}</span>
          <span style={heroLeadStyles.cta}>{heroLead.ctaLabel}</span>
        </footer>
      </motion.a>

      <motion.section variants={item} style={categoryGridStyles}>
        {categorySpotlights.map((card, idx) => (
          <motion.a
            key={card.title}
            href={card.href}
            whileHover={{ opacity:0.9 }}
            style={{
              display:'block',
              textDecoration:'none',
              color:'#000',
              background:'#fafafa',
              position:'relative',
              margin:0,
              padding:0,
              lineHeight:0,
              borderRight: (idx % 2 === 0) ? '1px solid #e5e5e5' : 'none',
              borderBottom: idx < 2 ? '1px solid #e5e5e5' : 'none'
            }}
          >
            <img
              src={card.image}
              alt={card.alt}
              style={{
                width:'100%',
                height:'clamp(220px, 38vw, 360px)',
                objectFit:'cover',
                display:'block',
                margin:0,
                padding:0,
                border:'none'
              }}
            />
            <div style={{ padding:'0.9rem 0.8rem', background:'#fafafa', lineHeight:'normal', borderTop:'1px solid #e5e5e5' }}>
              <h3 style={{ margin:0, padding:0, fontSize:'0.68rem', letterSpacing:'0.01em', fontWeight:400, color:'#000', textTransform:'uppercase', lineHeight:1.3 }}>{card.title}</h3>
              <span style={{ display:'block', fontSize:'0.68rem', letterSpacing:'0.01em', marginTop:'0.2rem', padding:0, color:'#000', textDecoration:'underline', lineHeight:1.3 }}>{card.sub}</span>
            </div>
          </motion.a>
        ))}
      </motion.section>

      <motion.figure
        variants={item}
        style={{
          width:'100%',
          maxWidth:'min(1120px, 94vw)',
          position:'relative',
          borderRadius:28,
          overflow:'hidden',
          background:'#f4f4f4',
          boxShadow:'0 38px 68px -42px rgba(0,0,0,0.35)'
        }}
      >
        <img
          src={secondaryHero.image}
          alt={secondaryHero.alt}
          style={{ width:'100%', height:'auto', display:'block', objectFit:'cover' }}
        />
        <span
          style={{
            position:'absolute',
            top:'18%',
            right:32,
            padding:'0.5rem 1rem',
            background:'rgba(255,255,255,0.94)',
            border:'1px solid rgba(0,0,0,0.1)',
            fontSize:'0.82rem',
            letterSpacing:'0.12em',
            textTransform:'uppercase',
            borderRadius:6,
            color:'#111'
          }}
        >
          {secondaryHero.price}
        </span>
        <motion.footer
          variants={item}
          style={{
            position:'absolute',
            bottom:0,
            left:0,
            right:0,
            display:'flex',
            justifyContent:'space-between',
            alignItems:'center',
            gap:'1rem',
            padding:'1.2rem 1.8rem',
            background:'rgba(255,255,255,0.95)',
            fontSize:'0.95rem',
            letterSpacing:'0.12em',
            textTransform:'uppercase',
            color:'#111'
          }}
        >
          <span>{secondaryHero.title}</span>
          <motion.a
            href={secondaryHero.ctaHref}
            whileHover={{ opacity:0.7 }}
            style={{
              fontSize:'0.74rem',
              letterSpacing:'0.24em',
              textTransform:'uppercase',
              textDecoration:'none',
              color:'#111'
            }}
          >
            {secondaryHero.ctaLabel}
          </motion.a>
        </motion.footer>
      </motion.figure>

      <motion.nav
        variants={item}
        style={{
          width:'100%',
          maxWidth:'min(1120px, 94vw)',
          display:'flex',
          justifyContent:'space-between',
          flexWrap:'wrap',
          gap:'1.4rem',
          padding:'1rem 0.4rem'
        }}
      >
        {categoryNavigation.map((link) => (
          <motion.a
            key={link.label}
            href={link.href}
            whileHover={{ opacity:0.65 }}
            style={{
              textDecoration:'none',
              color:'#111',
              fontSize:'0.9rem',
              letterSpacing:'0.1em',
              textTransform:'uppercase',
              fontWeight:600
            }}
          >
            {link.label}
            {link.sub && (
              <span style={{ display:'block', fontSize:'0.7rem', letterSpacing:'0.1em', opacity:0.7, fontWeight:400 }}>{link.sub}</span>
            )}
          </motion.a>
        ))}
      </motion.nav>

      <motion.section
        variants={item}
        style={{
          width:'100%',
          maxWidth:'min(1120px, 94vw)',
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))',
          gap:'1.2rem',
          padding:'1rem 0'
        }}
      >
        {newInTiles.map((product) => (
          <motion.a
            key={product.image}
            href={product.href}
            whileHover={{ translateY:-6, scale:1.01, boxShadow:'0 36px 62px -40px rgba(16,45,36,0.45)' }}
            style={newInStyles.container}
          >
            <img
              src={product.image}
              alt={product.alt}
              style={newInStyles.image}
            />
            <span style={newInStyles.caption}>
              {product.alt}
            </span>
          </motion.a>
        ))}
      </motion.section>

      <motion.section
        variants={item}
        style={{
          width:'100%',
          maxWidth:'min(1120px, 94vw)',
          display:'grid',
          gridTemplateColumns:'minmax(0, 1.2fr) minmax(0, 0.8fr)',
          gap:'2.4rem',
          alignItems:'center'
        }}
      >
        <motion.figure
          variants={item}
          style={{
            position:'relative',
            borderRadius:28,
            overflow:'hidden',
            background:'#f4f4f4',
            boxShadow:'0 38px 68px -42px rgba(0,0,0,0.35)'
          }}
        >
          <img
            src={editorialStory.image}
            alt={editorialStory.alt}
            style={{ width:'100%', height:'auto', display:'block', objectFit:'cover' }}
          />
          <div
            style={{
              position:'absolute',
              bottom:20,
              left:20,
              width:52,
              height:52,
              borderRadius:'50%',
              background:'rgba(17,17,17,0.75)',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              color:'#fff',
              fontSize:'0.72rem',
              letterSpacing:'0.18em',
              textTransform:'uppercase'
            }}
          >
            {'>'}
          </div>
        </motion.figure>
        <motion.div
          variants={item}
          style={{
            display:'flex',
            flexDirection:'column',
            gap:'1rem',
            color:'#111'
          }}
        >
          <span style={{ fontSize:'0.74rem', letterSpacing:'0.28em', textTransform:'uppercase' }}>{editorialStory.season}</span>
          <h2 style={{ margin:0, fontSize:'2rem', letterSpacing:'0.02em' }}>{editorialStory.heading}</h2>
          <p style={{ margin:0, fontSize:'1rem', lineHeight:1.6 }}>{editorialStory.copy}</p>
          <motion.a
            href={editorialStory.ctaHref}
            whileHover={{ opacity:0.7 }}
            style={{
              fontSize:'0.74rem',
              letterSpacing:'0.24em',
              textTransform:'uppercase',
              textDecoration:'none',
              color:'#111'
            }}
          >
            {editorialStory.ctaLabel}
          </motion.a>
        </motion.div>
      </motion.section>
    </motion.section>
  );
}
