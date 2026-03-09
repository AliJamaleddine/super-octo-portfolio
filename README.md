# Tumbuktu Studio — Photography Portfolio

A premium, cinematic photography portfolio website built with vanilla HTML, CSS, and JavaScript.

**Live:** [tumbuktu.space](https://tumbuktu.space)

---

## Project Structure

```
tumbuktu-portfolio/
├── index.html            # Main portfolio page (loading + gallery)
├── loading.html          # Standalone loading screen preview
├── css/
│   └── styles.css        # Complete design system and styles
├── js/
│   ├── animations.js     # GSAP loading sequence, scroll reveal, Lenis smooth scroll
│   ├── gallery.js        # Gallery filtering, fullscreen viewer, navigation
│   └── cursor.js         # Custom cursor and magnetic image hover
├── media/
│   ├── loading-video.mp4 # Fullscreen loading background video
│   ├── images/           # Full resolution images (loaded in viewer)
│   └── thumbnails/       # Gallery thumbnails (~600–800px wide)
└── README.md
```

## Features

- **Cinematic loading screen** with background video and GSAP text reveal
- **Masonry gallery grid** with CSS Grid + JS row-span calculation — preserves natural aspect ratios
- **Two-layer image system** — thumbnails in gallery, full-res loaded on viewer open
- **Category filtering** with smooth fade/slide transitions (no page reloads)
- **Fullscreen image viewer** with keyboard, arrow, swipe, and ESC navigation
- **Custom cursor** with hover states and magnetic image pull effect
- **Smooth scrolling** via Lenis.js
- **Scroll-triggered reveals** using GSAP ScrollTrigger
- **Navigation hover preview** — blurred background image on category hover
- **Mobile-first responsive** — hamburger menu, single-column feed, swipe viewer
- **SEO ready** — meta description, OpenGraph tags

## How to Run

Simply open `index.html` in a browser. No build step required.

```bash
# Or use a local server for best results:
npx serve .
# or
python3 -m http.server 8000
```

## Adding New Photos

1. Add your thumbnail to `media/thumbnails/` (recommended: ~600–800px wide).
2. Add the full-resolution image to `media/images/` (recommended: ~2400px wide).

3. In `index.html`, add a new gallery item inside `<div id="gallery">`:

```html
<div class="gallery__item" data-category="portraits">
  <div class="gallery__img-wrap">
    <img src="media/thumbnails/your-photo-thumb.jpg"
         data-full="media/images/your-photo-full.jpg"
         alt="Description"
         loading="lazy"
         class="gallery__img">
  </div>
  <div class="gallery__caption">
    <span class="gallery__caption-title">Location — Year</span>
    <span class="gallery__caption-author">Subject</span>
  </div>
</div>
```

### Image handling

- The gallery uses **CSS Grid masonry** with JS-calculated row spans
- Each image renders at its **natural aspect ratio** — no cropping
- Landscape (3:2) photos appear wider, portrait photos appear taller
- The `data-full` attribute specifies the full-resolution image loaded in the viewer
- If `data-full` is omitted, the thumbnail `src` is used as fallback

## Adding New Categories

1. In `index.html`, add a nav link inside `<nav class="sidebar__nav">`:

```html
<li>
  <a href="#" class="nav-link"
     data-category="newcategory"
     data-preview="https://example.com/preview.jpg">
    Category Name
  </a>
</li>
```

2. Tag gallery items with `data-category="newcategory"`.

That's it — filtering works automatically based on the `data-category` attribute.

## External Dependencies (CDN)

| Library | Purpose |
|---------|---------|
| [GSAP 3.12](https://greensock.com/gsap/) | Animations & ScrollTrigger |
| [Lenis 1.1](https://lenis.darkroom.engineering/) | Smooth momentum scrolling |
| [Google Fonts](https://fonts.google.com/) | Inter + Playfair Display |

## Deploy on GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Set source to your branch (e.g., `main`) and root `/`.
4. Your site will be live at `https://<username>.github.io/<repo>/`.

To use a custom domain (`tumbuktu.space`):
1. Add a `CNAME` file with `tumbuktu.space` as its content.
2. Configure your DNS to point to GitHub Pages.

## Design System

| Token | Value |
|-------|-------|
| Background | `#0a0a0a` |
| Text | `#ffffff` |
| Text muted | `#bbbbbb` |
| Accent | `#d2a15f` |
| Headlines | Inter (300/400) |
| Captions | Playfair Display (italic) |

---

© 2026 Tumbuktu Studio
