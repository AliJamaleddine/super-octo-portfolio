/* ============================================
   TUMBUKTU STUDIO — Gallery Engine
   Reads from window.GALLERY_DATA (gallery-data.js)
   Renders: infinite slideshow (All Work) + masonry grid (categories)
   ============================================ */

(function () {
  'use strict';

  var data = window.GALLERY_DATA || {};
  var categories = ['portraits', 'travel', 'night', 'diary', 'video'];

  // --- Build flat list of all images with category tag ---
  var allImages = [];
  categories.forEach(function (cat) {
    (data[cat] || []).forEach(function (img) {
      allImages.push(Object.assign({ category: cat }, img));
    });
  });

  // --- State ---
  var currentCategory = 'all';
  var viewerOpen = false;
  var viewerItems = [];   // array of { full, alt, title, author }
  var viewerIndex = 0;

  // --- DOM refs ---
  var slideshowEl = document.getElementById('slideshow');
  var trackEl = document.getElementById('slideshow-track');
  var slideshowCurrent = document.getElementById('slideshow-current');
  var slideshowTotal = document.getElementById('slideshow-total');
  var galleryEl = document.getElementById('gallery');
  var aboutEl = document.getElementById('about-section');
  var viewer = document.getElementById('viewer');
  var viewerImg = document.getElementById('viewer-img');
  var viewerCaptionTitle = document.getElementById('viewer-caption-title');
  var viewerCaptionAuthor = document.getElementById('viewer-caption-author');
  var viewerCurrentEl = document.getElementById('viewer-current');
  var viewerTotalEl = document.getElementById('viewer-total');

  // ============================================
  // SLIDESHOW — Infinite horizontal for "All Work"
  // ============================================

  var slideIndex = 0;
  var slideCount = 0;
  var isAnimating = false;
  var slideshowActive = true;

  function buildSlideshow() {
    trackEl.innerHTML = '';
    if (allImages.length === 0) return;

    slideCount = allImages.length;

    // Build 3 sets for seamless looping: [clone-last-set] [originals] [clone-first-set]
    var sets = [allImages, allImages, allImages];
    sets.forEach(function (set, setIdx) {
      set.forEach(function (img, i) {
        var slide = createSlide(img, setIdx * slideCount + i);
        trackEl.appendChild(slide);
      });
    });

    slideIndex = 0;
    updateSlideshowPosition(false);
    updateSlideshowCounter();
    preloadNearby();
  }

  function createSlide(img, idx) {
    var el = document.createElement('div');
    el.className = 'slideshow__slide';
    el.setAttribute('data-idx', idx);

    el.innerHTML =
      '<div class="slideshow__img-wrap">' +
        '<img src="' + img.thumb + '" data-full="' + img.full + '" alt="' + img.alt + '" class="slideshow__img" loading="lazy">' +
      '</div>' +
      '<div class="slideshow__caption">' +
        '<span class="slideshow__caption-title">' + img.title + '</span>' +
        '<span class="slideshow__caption-author">' + img.author + '</span>' +
      '</div>';

    // Click to open viewer
    el.querySelector('.slideshow__img-wrap').addEventListener('click', function () {
      var realIdx = idx % slideCount;
      openViewerFromSlideshow(realIdx);
    });

    return el;
  }

  function updateSlideshowPosition(animate) {
    // Position so the current slide is centered
    // Each slide is a vw-based width, calculated via CSS
    var offset = (slideIndex + slideCount) ; // offset into the middle set
    var translateX = -offset * getSlideWidth();
    // Center the active slide
    var centering = (window.innerWidth - getSidebarWidth() - getSlidePixelWidth()) / 2;

    if (animate) {
      trackEl.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    } else {
      trackEl.style.transition = 'none';
    }
    trackEl.style.transform = 'translateX(' + (centering - offset * getSlidePixelWidth() - offset * getSlideGap()) + 'px)';

    // Update active class for scale effect
    var slides = trackEl.querySelectorAll('.slideshow__slide');
    slides.forEach(function (s, i) {
      var realI = i - slideCount; // relative to middle set
      s.classList.toggle('slideshow__slide--active', realI === slideIndex);
    });
  }

  function getSlidePixelWidth() {
    if (window.innerWidth <= 768) return window.innerWidth * 0.85;
    return Math.min(window.innerWidth * 0.55, 900);
  }

  function getSlideGap() {
    return window.innerWidth <= 768 ? 16 : 32;
  }

  function getSidebarWidth() {
    if (window.innerWidth <= 768) return 0;
    return 260;
  }

  function getSlideWidth() {
    return getSlidePixelWidth() + getSlideGap();
  }

  function goToSlide(newIndex, animate) {
    if (isAnimating) return;
    slideIndex = newIndex;

    // Wrap around seamlessly
    if (slideIndex >= slideCount) {
      // Jump to equivalent in first set after animation
      if (animate) {
        isAnimating = true;
        updateSlideshowPosition(true);
        setTimeout(function () {
          slideIndex = slideIndex - slideCount;
          updateSlideshowPosition(false);
          isAnimating = false;
        }, 720);
      } else {
        slideIndex = slideIndex - slideCount;
        updateSlideshowPosition(false);
      }
    } else if (slideIndex < 0) {
      if (animate) {
        isAnimating = true;
        updateSlideshowPosition(true);
        setTimeout(function () {
          slideIndex = slideIndex + slideCount;
          updateSlideshowPosition(false);
          isAnimating = false;
        }, 720);
      } else {
        slideIndex = slideIndex + slideCount;
        updateSlideshowPosition(false);
      }
    } else {
      if (animate) {
        isAnimating = true;
        updateSlideshowPosition(true);
        setTimeout(function () { isAnimating = false; }, 720);
      } else {
        updateSlideshowPosition(false);
      }
    }

    updateSlideshowCounter();
    preloadNearby();
  }

  function nextSlide() { goToSlide(slideIndex + 1, true); }
  function prevSlide() { goToSlide(slideIndex - 1, true); }

  function updateSlideshowCounter() {
    var displayIdx = ((slideIndex % slideCount) + slideCount) % slideCount;
    slideshowCurrent.textContent = displayIdx + 1;
    slideshowTotal.textContent = slideCount;
  }

  function preloadNearby() {
    // Preload next 2 and previous 1 full-res images
    [-1, 1, 2].forEach(function (offset) {
      var idx = ((slideIndex + offset) % slideCount + slideCount) % slideCount;
      var img = allImages[idx];
      if (img && img.full) {
        var preload = new Image();
        preload.src = img.full;
      }
    });
  }

  // Slideshow scroll/wheel handler
  var wheelAccum = 0;
  var wheelTimer;
  function onSlideshowWheel(e) {
    if (!slideshowActive) return;
    e.preventDefault();

    // Use deltaX or deltaY (whichever is larger)
    var delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    wheelAccum += delta;

    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(function () { wheelAccum = 0; }, 200);

    if (Math.abs(wheelAccum) > 50) {
      if (wheelAccum > 0) nextSlide(); else prevSlide();
      wheelAccum = 0;
    }
  }

  // Touch support for slideshow
  var touchStartX = 0;
  function onSlideshowTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }
  function onSlideshowTouchEnd(e) {
    var diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? nextSlide() : prevSlide();
    }
  }

  function enableSlideshow() {
    slideshowActive = true;
    slideshowEl.style.display = '';
    galleryEl.style.display = 'none';
    aboutEl.style.display = 'none';
    document.querySelector('.main').addEventListener('wheel', onSlideshowWheel, { passive: false });
    slideshowEl.addEventListener('touchstart', onSlideshowTouchStart, { passive: true });
    slideshowEl.addEventListener('touchend', onSlideshowTouchEnd, { passive: true });
    updateSlideshowPosition(false);
  }

  function disableSlideshow() {
    slideshowActive = false;
    slideshowEl.style.display = 'none';
    document.querySelector('.main').removeEventListener('wheel', onSlideshowWheel);
    slideshowEl.removeEventListener('touchstart', onSlideshowTouchStart);
    slideshowEl.removeEventListener('touchend', onSlideshowTouchEnd);
  }

  // Resize handler
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (slideshowActive) updateSlideshowPosition(false);
      if (currentCategory !== 'all' && currentCategory !== 'about') layoutMasonry();
    }, 150);
  });

  // ============================================
  // MASONRY GRID — Category views
  // ============================================

  var ROW_HEIGHT = 4;
  var GAP = 24;

  function buildGallery(category) {
    galleryEl.innerHTML = '';
    var images = data[category] || [];

    images.forEach(function (img, i) {
      var item = document.createElement('div');
      item.className = 'gallery__item';
      item.setAttribute('data-category', category);
      item.innerHTML =
        '<div class="gallery__img-wrap">' +
          '<img src="' + img.thumb + '" data-full="' + img.full + '" alt="' + img.alt + '" loading="lazy" class="gallery__img">' +
        '</div>' +
        '<div class="gallery__caption">' +
          '<span class="gallery__caption-title">' + img.title + '</span>' +
          '<span class="gallery__caption-author">' + img.author + '</span>' +
        '</div>';
      galleryEl.appendChild(item);
    });

    // Set up viewer items for this category
    viewerItems = images;

    // Masonry layout
    requestAnimationFrame(layoutMasonry);

    // Listen for image loads to recalculate spans
    galleryEl.querySelectorAll('.gallery__img').forEach(function (imgEl) {
      imgEl.addEventListener('load', function () {
        var item = imgEl.closest('.gallery__item');
        if (item) setRowSpan(item, imgEl);
      }, { once: true });
    });
  }

  function layoutMasonry() {
    if (window.innerWidth <= 768) return;

    galleryEl.querySelectorAll('.gallery__item').forEach(function (item) {
      if (item.style.display === 'none') return;
      var img = item.querySelector('.gallery__img');
      if (!img) return;
      if (img.naturalWidth && img.naturalHeight) {
        setRowSpan(item, img);
      }
    });
  }

  function setRowSpan(item, img) {
    var colWidth = item.getBoundingClientRect().width;
    if (colWidth === 0) return;
    var ratio = img.naturalHeight / img.naturalWidth;
    var imgHeight = colWidth * ratio;
    var captionHeight = 28;
    var totalHeight = imgHeight + captionHeight;
    var span = Math.ceil((totalHeight + GAP) / ROW_HEIGHT);
    item.style.gridRowEnd = 'span ' + span;
  }

  // ============================================
  // CATEGORY SWITCHING
  // ============================================

  function filterCategory(category) {
    if (category === currentCategory) return;
    currentCategory = category;

    // Update nav active state
    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-category') === category);
    });

    if (category === 'all') {
      // Show slideshow
      window.TumbuktuAnimations.transitionGallery(function () {
        disableSlideshow();
        enableSlideshow();
      });
      return;
    }

    if (category === 'about') {
      window.TumbuktuAnimations.transitionGallery(function () {
        disableSlideshow();
        galleryEl.style.display = 'none';
        aboutEl.style.display = 'block';
        viewerItems = [];
      });
      return;
    }

    // Category masonry view
    window.TumbuktuAnimations.transitionGallery(function () {
      disableSlideshow();
      aboutEl.style.display = 'none';
      galleryEl.style.display = '';
      buildGallery(category);
    });
  }

  function initNavigation() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('.nav-link');
      if (!link) return;
      e.preventDefault();
      filterCategory(link.getAttribute('data-category'));
    });

    var logo = document.querySelector('.sidebar__logo');
    if (logo) {
      logo.addEventListener('click', function (e) {
        e.preventDefault();
        filterCategory('all');
      });
    }
  }

  // ============================================
  // FULLSCREEN VIEWER
  // ============================================

  function openViewerFromSlideshow(idx) {
    viewerItems = allImages;
    viewerIndex = idx;
    openViewer();
  }

  function openViewer() {
    if (viewerItems.length === 0) return;
    viewerOpen = true;
    showCurrentImage();
    viewer.classList.add('viewer--open');
    document.body.style.overflow = 'hidden';
  }

  function closeViewer() {
    viewerOpen = false;
    viewer.classList.remove('viewer--open');
    document.body.style.overflow = '';
  }

  function showCurrentImage() {
    var img = viewerItems[viewerIndex];
    if (!img) return;
    viewerImg.setAttribute('src', img.full);
    viewerImg.setAttribute('alt', img.alt);
    viewerCaptionTitle.textContent = img.title || '';
    viewerCaptionAuthor.textContent = img.author || '';
    viewerCurrentEl.textContent = viewerIndex + 1;
    viewerTotalEl.textContent = viewerItems.length;
  }

  function nextImage() {
    viewerIndex = (viewerIndex + 1) % viewerItems.length;
    transitionViewerImage();
  }

  function prevImage() {
    viewerIndex = (viewerIndex - 1 + viewerItems.length) % viewerItems.length;
    transitionViewerImage();
  }

  function transitionViewerImage() {
    viewerImg.style.opacity = '0';
    viewerImg.style.transform = 'scale(0.95)';
    setTimeout(function () {
      showCurrentImage();
      viewerImg.style.opacity = '1';
      viewerImg.style.transform = 'scale(1)';
    }, 200);
  }

  function initViewer() {
    // Gallery grid clicks
    galleryEl.addEventListener('click', function (e) {
      var imgWrap = e.target.closest('.gallery__img-wrap');
      if (!imgWrap) return;
      var item = imgWrap.closest('.gallery__item');
      var items = Array.from(galleryEl.querySelectorAll('.gallery__item'));
      var idx = items.indexOf(item);
      if (idx !== -1) {
        viewerIndex = idx;
        openViewer();
      }
    });

    viewer.querySelector('.viewer__close').addEventListener('click', closeViewer);
    viewer.querySelector('.viewer__backdrop').addEventListener('click', closeViewer);

    viewer.querySelector('.viewer__arrow--prev').addEventListener('click', function (e) {
      e.stopPropagation();
      prevImage();
    });
    viewer.querySelector('.viewer__arrow--next').addEventListener('click', function (e) {
      e.stopPropagation();
      nextImage();
    });

    // Keyboard — works for both slideshow and viewer
    document.addEventListener('keydown', function (e) {
      if (viewerOpen) {
        if (e.key === 'Escape') closeViewer();
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextImage();
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevImage();
        return;
      }
      // Slideshow keyboard nav
      if (slideshowActive) {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
      }
    });

    // Viewer touch/swipe
    var vTouchX = 0;
    viewer.addEventListener('touchstart', function (e) {
      vTouchX = e.changedTouches[0].screenX;
    }, { passive: true });
    viewer.addEventListener('touchend', function (e) {
      var diff = vTouchX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? nextImage() : prevImage();
      }
    }, { passive: true });
  }

  // ============================================
  // EXPOSE & INIT
  // ============================================

  window.TumbuktuGallery = {
    layoutMasonry: layoutMasonry,
    enableSlideshow: enableSlideshow
  };

  document.addEventListener('DOMContentLoaded', function () {
    buildSlideshow();
    enableSlideshow();
    initNavigation();
    initViewer();
  });
})();
