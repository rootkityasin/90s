Place optimized texture images here.
Current mix (paper in WebP, hero in JPEG):
- paper.webp        (site-wide paper texture)
- paper@2x.webp     (optional hi-res fallback – usually not needed; prefer single good asset)
- home-hero.jpeg    (distinct hero panel texture for landing hero)
 - home-hero.jpg     (distinct hero panel texture for landing hero)
If you add/replace home-hero.jpg it will automatically layer over the hero panel via .panel.hero-texture::before. Use .hero-texture-debug class temporarily if you need to confirm it loads. Ensure extension (.jpg) matches the CSS.

You can swap formats (WebP/JPEG/AVIF) – just update paths in globals.css.
Keep individual files ideally <400KB (under 250KB preferred); aim for ~65 quality JPEG or WebP q=80 visually lossless.

If you add/replace home-hero.jpeg it will automatically layer over the hero panel via .panel.hero-texture::before (already referenced). If you prefer .jpg just rename both file & CSS.
