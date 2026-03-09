# Tumbuktu Studio — Photography Portfolio

A premium, cinematic photography portfolio built with vanilla HTML, CSS, and JavaScript.

**Live:** [tumbuktu.space](https://tumbuktu.space)

---

## Project Structure

```
tumbuktu-portfolio/
├── index.html              # Main page (loader + sidebar + slideshow + gallery + viewer)
├── css/
│   └── styles.css          # Complete design system
├── js/
│   ├── gallery-data.js     # Image data — edit this file to add/remove photos
│   ├── gallery.js          # Slideshow, masonry grid, filtering, viewer
│   ├── animations.js       # GSAP loading, scroll reveals, Lenis, video sound
│   └── cursor.js           # Custom cursor and magnetic hover
├── media/
│   ├── loading-video.mp4   # Fullscreen intro video (with sound)
│   ├── images/             # Full-resolution images (loaded in viewer)
│   │   ├── portraits/
│   │   ├── travel/
│   │   ├── night/
│   │   ├── diary/
│   │   └── video/
│   └── thumbnails/         # Gallery thumbnails (~600–800px wide)
│       ├── portraits/
│       ├── travel/
│       ├── night/
│       ├── diary/
│       └── video/
└── README.md
```

## How It Works

### Two views

| View | Trigger | Layout |
|------|---------|--------|
| **All Work** | Default / logo click / "All Work" nav | Infinite horizontal slideshow |
| **Category** | Click a category (Portraits, Travel, etc.) | Masonry grid |

**All Work** presents every image as a cinematic horizontal slideshow that loops infinitely. Scroll wheel, trackpad, arrow keys, and swipe all control navigation.

**Category views** show a masonry grid where each image renders at its natural aspect ratio — no cropping. Landscape (3:2) photos appear wider, portrait photos taller.

### Intro video sound

The loading video plays with sound. If the browser blocks autoplay with audio, it starts muted and fades sound in on the first user interaction (click, scroll, or touch).

---

## Adding New Photos

### 1. Prepare your files

| File | Location | Size guideline |
|------|----------|----------------|
| Thumbnail | `media/thumbnails/<category>/` | ~600–800px wide, quality 75 |
| Full resolution | `media/images/<category>/` | ~2400px wide, quality 90 |

Categories: `portraits`, `travel`, `night`, `diary`, `video`

### 2. Edit `js/gallery-data.js`

Add an entry to the matching category array:

```js
{
  thumb:  'media/thumbnails/portraits/new-photo.jpg',
  full:   'media/images/portraits/new-photo.jpg',
  alt:    'Description of the image',
  title:  'City — Year',
  author: 'Subject Name'
}
```

That's it. The gallery reads from this file automatically. No need to edit `index.html`.

### 3. External URLs

You can also use external URLs (Unsplash, CDN, etc.) instead of local paths:

```js
{
  thumb:  'https://images.unsplash.com/photo-xxx?w=600&q=75',
  full:   'https://images.unsplash.com/photo-xxx?w=2400&q=90',
  alt:    'Description',
  title:  'Location — Year',
  author: 'Name'
}
```

---

## Adding a New Category

1. Add a new nav link in `index.html` inside `<nav class="sidebar__nav">`:

```html
<li>
  <a href="#" class="nav-link"
     data-category="newcategory"
     data-preview="media/thumbnails/newcategory/preview.jpg">
    Category Name
  </a>
</li>
```

2. Add the category array in `js/gallery-data.js`:

```js
newcategory: [
  { thumb: '...', full: '...', alt: '...', title: '...', author: '...' }
]
```

3. Add `'newcategory'` to the `categories` array at the top of `js/gallery.js`.

4. Create the folders: `media/images/newcategory/` and `media/thumbnails/newcategory/`.

---

## Features

- **Cinematic loading screen** with background video, GSAP text reveal, and audio fade-in
- **Infinite horizontal slideshow** for All Work — loops seamlessly, scroll/swipe/keyboard controlled
- **Photo counter** showing current position in slideshow
- **Masonry gallery grid** for category views — preserves natural aspect ratios
- **Dynamic rendering** from `gallery-data.js` — no hardcoded image tags
- **Two-layer image system** — thumbnails in gallery, full-res on viewer open
- **Fullscreen viewer** with keyboard, arrow, swipe, and ESC navigation
- **Custom cursor** with hover states and magnetic pull
- **Smooth scrolling** via Lenis.js
- **Scroll-triggered reveals** using GSAP ScrollTrigger
- **Navigation hover preview** — blurred background image on category hover
- **Mobile responsive** — hamburger menu, touch swipe, single-column feed
- **SEO ready** — meta description, OpenGraph tags

## External Dependencies (CDN)

| Library | Purpose |
|---------|---------|
| [GSAP 3.12](https://greensock.com/gsap/) | Animations & ScrollTrigger |
| [Lenis 1.1](https://lenis.darkroom.engineering/) | Smooth momentum scrolling |
| [Google Fonts](https://fonts.google.com/) | Inter + Playfair Display |

## How to Run

Open `index.html` in a browser. No build step required.

```bash
# For best results use a local server:
npx serve .
# or
python3 -m http.server 8000
```

## Deploy on GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Set source to your branch and root `/`.
4. Your site will be live at `https://<username>.github.io/<repo>/`.

For a custom domain (`tumbuktu.space`):
1. Add a `CNAME` file containing `tumbuktu.space`.
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
