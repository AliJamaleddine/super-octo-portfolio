/* ============================================
   TUMBUKTU STUDIO — Gallery, Masonry, Filtering & Viewer
   ============================================ */

(function () {
  'use strict';

  // --- State ---
  var currentCategory = 'all';
  var viewerOpen = false;
  var viewerItems = [];
  var viewerIndex = 0;

  // --- Elements ---
  var galleryEl = document.getElementById('gallery');
  var aboutEl = document.getElementById('about-section');
  var viewer = document.getElementById('viewer');
  var viewerImg = document.getElementById('viewer-img');
  var viewerCaptionTitle = document.getElementById('viewer-caption-title');
  var viewerCaptionAuthor = document.getElementById('viewer-caption-author');
  var viewerCurrent = document.getElementById('viewer-current');
  var viewerTotal = document.getElementById('viewer-total');

  var allItems = [];

  function cacheItems() {
    allItems = Array.from(galleryEl.querySelectorAll('.gallery__item'));
  }

  // ============================================
  // MASONRY LAYOUT — Calculate grid-row span
  // based on natural image aspect ratio
  // ============================================

  var ROW_HEIGHT = 4; // must match grid-auto-rows in CSS
  var GAP = 24;       // vertical gap in px (1.5rem = 24px)

  function layoutMasonry() {
    // On mobile (single column) skip span calculations
    if (window.innerWidth <= 768) return;

    var items = galleryEl.querySelectorAll('.gallery__item');
    items.forEach(function (item) {
      if (item.style.display === 'none') return;

      var img = item.querySelector('.gallery__img');
      if (!img) return;

      // Use naturalWidth/Height if loaded, otherwise wait
      if (img.naturalWidth && img.naturalHeight) {
        setRowSpan(item, img);
      } else {
        img.addEventListener('load', function () {
          setRowSpan(item, img);
        }, { once: true });
      }
    });
  }

  function setRowSpan(item, img) {
    // Get the actual column width this item occupies
    var colWidth = item.getBoundingClientRect().width;
    if (colWidth === 0) return;

    // Calculate the height the image will render at given column width
    var ratio = img.naturalHeight / img.naturalWidth;
    var imgHeight = colWidth * ratio;

    // Add caption height (~28px)
    var captionHeight = 28;
    var totalHeight = imgHeight + captionHeight;

    // Convert to row spans
    var span = Math.ceil((totalHeight + GAP) / (ROW_HEIGHT + 0));
    item.style.gridRowEnd = 'span ' + span;
  }

  // Recalculate on resize (debounced)
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layoutMasonry, 150);
  });

  // ============================================
  // CATEGORY FILTERING
  // ============================================

  function filterCategory(category) {
    if (category === currentCategory) return;
    currentCategory = category;

    // Update active nav link
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-category') === category);
    });

    // Handle about section
    if (category === 'about') {
      window.TumbuktuAnimations.transitionGallery(function () {
        galleryEl.style.display = 'none';
        aboutEl.style.display = 'block';
        viewerItems = [];
      });
      return;
    }

    // Show gallery, hide about
    aboutEl.style.display = 'none';
    galleryEl.style.display = '';

    window.TumbuktuAnimations.transitionGallery(function () {
      allItems.forEach(function (item) {
        var itemCat = item.getAttribute('data-category');
        if (category === 'all' || itemCat === category) {
          item.style.display = '';
          item.classList.remove('revealed');
          item.style.opacity = '0';
          item.style.transform = 'translateY(40px)';
        } else {
          item.style.display = 'none';
        }
      });

      // Recalculate masonry after filter
      requestAnimationFrame(layoutMasonry);
      updateViewerItems();
    });
  }

  // --- Update viewer items based on visible gallery items ---
  function updateViewerItems() {
    viewerItems = allItems.filter(function (item) {
      return item.style.display !== 'none';
    });
  }

  // --- Nav Click Handlers ---
  function initNavigation() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('.nav-link');
      if (!link) return;
      e.preventDefault();
      var cat = link.getAttribute('data-category');
      filterCategory(cat);
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
  // FULLSCREEN VIEWER — loads full-res via data-full
  // ============================================

  function openViewer(index) {
    updateViewerItems();
    if (viewerItems.length === 0) return;

    viewerIndex = index;
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
    var item = viewerItems[viewerIndex];
    if (!item) return;

    var img = item.querySelector('.gallery__img');
    var captionTitle = item.querySelector('.gallery__caption-title');
    var captionAuthor = item.querySelector('.gallery__caption-author');

    // Use data-full for full resolution; fall back to src
    var fullSrc = img.getAttribute('data-full') || img.getAttribute('src');
    viewerImg.setAttribute('src', fullSrc);
    viewerImg.setAttribute('alt', img.getAttribute('alt'));
    viewerCaptionTitle.textContent = captionTitle ? captionTitle.textContent : '';
    viewerCaptionAuthor.textContent = captionAuthor ? captionAuthor.textContent : '';
    viewerCurrent.textContent = viewerIndex + 1;
    viewerTotal.textContent = viewerItems.length;
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

  // --- Viewer Event Listeners ---
  function initViewer() {
    galleryEl.addEventListener('click', function (e) {
      var imgWrap = e.target.closest('.gallery__img-wrap');
      if (!imgWrap) return;

      var item = imgWrap.closest('.gallery__item');
      updateViewerItems();
      var idx = viewerItems.indexOf(item);
      if (idx !== -1) {
        openViewer(idx);
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

    // Keyboard
    document.addEventListener('keydown', function (e) {
      if (!viewerOpen) return;
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextImage();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevImage();
    });

    // Touch/swipe
    var touchStartX = 0;

    viewer.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewer.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? nextImage() : prevImage();
      }
    }, { passive: true });
  }

  // ============================================
  // INIT
  // ============================================

  // Expose layoutMasonry so animations.js can call it after transitions
  window.TumbuktuGallery = {
    layoutMasonry: layoutMasonry
  };

  document.addEventListener('DOMContentLoaded', function () {
    cacheItems();
    updateViewerItems();
    initNavigation();
    initViewer();

    // Initial masonry layout once images start loading
    layoutMasonry();

    // Re-layout as images finish loading (handles lazy-loaded images)
    galleryEl.addEventListener('load', function (e) {
      if (e.target.tagName === 'IMG') {
        var item = e.target.closest('.gallery__item');
        if (item) setRowSpan(item, e.target);
      }
    }, true);
  });
})();
