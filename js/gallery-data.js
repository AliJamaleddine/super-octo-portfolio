/* ============================================
   TUMBUKTU STUDIO — Gallery Image Data
   ============================================

   HOW TO ADD NEW PHOTOS:

   1. Place your image in:  pics/filename.jpg

   2. Add an entry to the matching array below.

   Categories: portraits, travel, night, diary, video

   Each entry requires:
     thumb  — path to image (same file, browser handles sizing)
     full   — path to full-resolution image
     alt    — accessible description
     title  — location + year shown in caption
     author — subject or series name shown in caption

   For video entries, add:
     type   — 'video'
     src    — path to the video file

   The gallery reads from this file automatically.
   No need to edit index.html.
   ============================================ */

window.GALLERY_DATA = {

  portraits: [
    {
      thumb:  'pics/000074650009.JPG',
      full:   'pics/000074650009.JPG',
      alt:    'Portrait on film',
      title:  '2025',
      author: 'Film I'
    },
    {
      thumb:  'pics/000074650013.JPG',
      full:   'pics/000074650013.JPG',
      alt:    'Portrait on film',
      title:  '2025',
      author: 'Film II'
    },
    {
      thumb:  'pics/000074650015.JPG',
      full:   'pics/000074650015.JPG',
      alt:    'Portrait on film',
      title:  '2025',
      author: 'Film III'
    },
    {
      thumb:  'pics/000074650016.JPG',
      full:   'pics/000074650016.JPG',
      alt:    'Portrait on film',
      title:  '2025',
      author: 'Film IV'
    },
    {
      thumb:  'pics/000074650024.JPG',
      full:   'pics/000074650024.JPG',
      alt:    'Portrait on film',
      title:  '2025',
      author: 'Film V'
    },
    {
      thumb:  'pics/000074650025.JPG',
      full:   'pics/000074650025.JPG',
      alt:    'Portrait on film',
      title:  '2025',
      author: 'Film VI'
    }
  ],

  travel: [
    {
      thumb:  'pics/000048220005.jpg',
      full:   'pics/000048220005.jpg',
      alt:    'Travel photograph',
      title:  '2025',
      author: 'Journey I'
    },
    {
      thumb:  'pics/000048220010.jpg',
      full:   'pics/000048220010.jpg',
      alt:    'Travel photograph',
      title:  '2025',
      author: 'Journey II'
    },
    {
      thumb:  'pics/000048220014.jpg',
      full:   'pics/000048220014.jpg',
      alt:    'Travel photograph',
      title:  '2025',
      author: 'Journey III'
    },
    {
      thumb:  'pics/000048220036.jpg',
      full:   'pics/000048220036.jpg',
      alt:    'Travel photograph',
      title:  '2025',
      author: 'Journey IV'
    }
  ],

  night: [
    {
      thumb:  'pics/000074660006.JPG',
      full:   'pics/000074660006.JPG',
      alt:    'Night photograph',
      title:  '2025',
      author: 'Night I'
    },
    {
      thumb:  'pics/000074660017.JPG',
      full:   'pics/000074660017.JPG',
      alt:    'Night photograph',
      title:  '2025',
      author: 'Night II'
    },
    {
      thumb:  'pics/000074660018.JPG',
      full:   'pics/000074660018.JPG',
      alt:    'Night photograph',
      title:  '2025',
      author: 'Night III'
    },
    {
      thumb:  'pics/000074660022.JPG',
      full:   'pics/000074660022.JPG',
      alt:    'Night photograph',
      title:  '2025',
      author: 'Night IV'
    }
  ],

  diary: [
    {
      thumb:  'pics/000061030033.jpg',
      full:   'pics/000061030033.jpg',
      alt:    'Diary moment',
      title:  '2025',
      author: 'Diary I'
    },
    {
      thumb:  'pics/000061030042 copie.jpg',
      full:   'pics/000061030042 copie.jpg',
      alt:    'Diary moment',
      title:  '2025',
      author: 'Diary II'
    },
    {
      thumb:  'pics/000073510009.jpg',
      full:   'pics/000073510009.jpg',
      alt:    'Diary moment',
      title:  '2025',
      author: 'Diary III'
    },
    {
      thumb:  'pics/1752100091936.739.JPG',
      full:   'pics/1752100091936.739.JPG',
      alt:    'Diary moment',
      title:  '2026',
      author: 'Diary IV'
    },
    {
      thumb:  'pics/P6290934.JPG',
      full:   'pics/P6290934.JPG',
      alt:    'Diary moment',
      title:  '2025',
      author: 'Diary V'
    }
  ],

  video: [
    {
      type:   'video',
      src:    'pics/GX010905.MP4',
      thumb:  'pics/000074650009.JPG',
      full:   'pics/000074650009.JPG',
      alt:    'Video — GoPro footage',
      title:  '2025',
      author: 'GoPro'
    },
    {
      type:   'video',
      src:    'pics/hf_20260309_193238_1f824481-169c-4d37-9c75-c6ae95d9d4eb.mp4',
      thumb:  'pics/000074660006.JPG',
      full:   'pics/000074660006.JPG',
      alt:    'Video — Short film',
      title:  '2026',
      author: 'Short Film'
    }
  ]

};
