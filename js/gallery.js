/* ============================================
   TUMBUKTU STUDIO — Gallery, Filtering & Viewer
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

  // Store original gallery HTML for filtering
  var allItems = [];

  function cacheItems() {
    allItems = Array.from(galleryEl.querySelectorAll('.gallery__item'));
  }

  // --- Category Filtering ---
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
        // Clear gallery items from viewer
        viewerItems = [];
      });
      return;
    }

    // Show gallery, hide about
    aboutEl.style.display = 'none';
    galleryEl.style.display = '';

    window.TumbuktuAnimations.transitionGallery(function () {
      // Show/hide items
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

      // Update viewer items list
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

    // Logo click -> show all
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

    // Use full-res image (replace w=800 with w=1600 for viewer)
    var src = img.getAttribute('src').replace('w=800', 'w=1600');
    viewerImg.setAttribute('src', src);
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
    // Click image to open viewer
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

    // Close button
    viewer.querySelector('.viewer__close').addEventListener('click', closeViewer);

    // Backdrop click
    viewer.querySelector('.viewer__backdrop').addEventListener('click', closeViewer);

    // Arrows
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

    // Touch/swipe support for viewer
    var touchStartX = 0;
    var touchEndX = 0;

    viewer.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewer.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextImage();
        } else {
          prevImage();
        }
      }
    }, { passive: true });
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', function () {
    cacheItems();
    updateViewerItems();
    initNavigation();
    initViewer();
  });
})();
