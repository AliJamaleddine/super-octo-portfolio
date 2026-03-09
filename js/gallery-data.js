/* ============================================
   TUMBUKTU STUDIO — Gallery Image Data
   ============================================

   HOW TO ADD NEW PHOTOS:

   1. Place your thumbnail in:  media/thumbnails/<category>/filename.jpg
      (recommended: ~600–800px wide, quality 75)

   2. Place the full-res in:    media/images/<category>/filename.jpg
      (recommended: ~2400px wide, quality 90)

   3. Add an entry to the matching array below.

   Categories: portraits, travel, night, diary, video

   Each entry requires:
     thumb  — path to gallery thumbnail
     full   — path to full-resolution image
     alt    — accessible description
     title  — location + year shown in caption
     author — subject or series name shown in caption

   The gallery reads from this file automatically.
   No need to edit index.html.
   ============================================ */

window.GALLERY_DATA = {

  portraits: [
    {
      thumb:  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=75',
      full:   'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=2400&q=90',
      alt:    'Portrait in natural light',
      title:  'Lagos — 2024',
      author: 'Amara'
    },
    {
      thumb:  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=75',
      full:   'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=2400&q=90',
      alt:    'Studio portrait',
      title:  'London — 2024',
      author: 'Zara'
    },
    {
      thumb:  'https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=600&q=75',
      full:   'https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=2400&q=90',
      alt:    'Portrait outdoors',
      title:  'Rio — 2024',
      author: 'Matheus'
    },
    {
      thumb:  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=75',
      full:   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=2400&q=90',
      alt:    'Male portrait',
      title:  'Accra — 2024',
      author: 'Kwame'
    }
  ],

  travel: [
    {
      thumb:  'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&q=75',
      full:   'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=2400&q=90',
      alt:    'Ocean sunset',
      title:  'Bali — 2024',
      author: 'Horizon'
    },
    {
      thumb:  'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=75',
      full:   'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=2400&q=90',
      alt:    'Desert landscape',
      title:  'Sahara — 2023',
      author: 'Dunes'
    },
    {
      thumb:  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=75',
      full:   'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=2400&q=90',
      alt:    'Forest light',
      title:  'Kyoto — 2023',
      author: 'Bamboo'
    },
    {
      thumb:  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=75',
      full:   'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=2400&q=90',
      alt:    'Mountain lake',
      title:  'Patagonia — 2023',
      author: 'Glaciar'
    }
  ],

  night: [
    {
      thumb:  'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=600&q=75',
      full:   'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=2400&q=90',
      alt:    'City at night',
      title:  'Tokyo — 2024',
      author: 'Neon'
    },
    {
      thumb:  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=75',
      full:   'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=2400&q=90',
      alt:    'Night mountains',
      title:  'Alps — 2023',
      author: 'Starfield'
    },
    {
      thumb:  'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&q=75',
      full:   'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=2400&q=90',
      alt:    'Golden hour',
      title:  'Marrakech — 2024',
      author: 'Glow'
    }
  ],

  diary: [
    {
      thumb:  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=75',
      full:   'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=2400&q=90',
      alt:    'Concert moment',
      title:  'Berlin — 2023',
      author: 'Echoes'
    },
    {
      thumb:  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=75',
      full:   'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=2400&q=90',
      alt:    'Candid diary',
      title:  'NYC — 2024',
      author: 'Streets'
    },
    {
      thumb:  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=75',
      full:   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=2400&q=90',
      alt:    'Candid moment',
      title:  'Lisbon — 2023',
      author: 'Maria'
    }
  ],

  video: [
    {
      thumb:  'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&q=75',
      full:   'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=2400&q=90',
      alt:    'Film production',
      title:  'Lagos — 2024',
      author: 'BTS'
    }
  ]

};
