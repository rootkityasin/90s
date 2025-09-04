# Assets Directory

Organized static assets used by the site.

Structure:
- logos/: SVG or raster brand marks, wordmarks.
- products/: Product imagery grouped by category (e.g. cargos/, chinos/, tshirt/, hoodies/, trouser/ ...).
- textures/: Background textures (paper, hero backgrounds, overlays).

Migration Notes:
Original textures lived in /public/textures. They can be moved into /public/assets/textures and references updated in CSS/components:
  /textures/paper.webp  -> /assets/textures/paper.webp
  /textures/home-hero.jpg -> /assets/textures/home-hero.jpg

After moving, update any import or CSS url() usages accordingly.

Best Practices:
- Keep filenames lowercase, kebab-case.
- Prefer WEBP or AVIF for photos; fallback JPEG if quality artifacts.
- For logos, prefer inline SVG in components for color theming; store source here.
- Keep widths reasonable (e.g. <1600px) for hero; generate responsive variants later.
