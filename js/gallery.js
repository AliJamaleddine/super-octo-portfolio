/* ============================================
   TUMBUKTU STUDIO — Gallery Engine
   Reads from window.GALLERY_DATA (gallery-data.js)
   Renders: infinite slideshow (All Work) + masonry grid (categories)
   Supports: images and video items
   ============================================ */

(function () {
  'use strict';

  var data = window.GALLERY_DATA || {};
  var categories = ['portraits', 'travel', 'night', 'diary', 'video'];
  var isMobile = function () { return window.innerWidth <= 768; };

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
  var viewerItems = [];
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
  var viewerVideo = document.getElementById('viewer-video');
  var viewerCaptionTitle = document.getElementById('viewer-caption-title');
  var viewerCaptionAuthor = document.getElementById('viewer-caption-author');
  var viewerCurrentEl = document.getElementById('viewer-current');
  var viewerTotalEl = document.getElementById('viewer-total');

  // ============================================
  // LAZY LOADING with IntersectionObserver
  // ============================================

  var lazyObserver;
  if ('IntersectionObserver' in window) {
    lazyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          if (el.dataset.src) {
            el.src = el.dataset.src;
            el.removeAttribute('data-src');
            el.addEventListener('load', function () {
              el.classList.add('loaded');
            }, { once: true });
          }
          lazyObserver.unobserve(el);
        }
      });
    }, {
      rootMargin: '200px 0px'
    });
  }

  function lazyLoad(imgEl) {
    if (lazyObserver) {
      lazyObserver.observe(imgEl);
    } else {
      if (imgEl.dataset.src) {
        imgEl.src = imgEl.dataset.src;
        imgEl.removeAttribute('data-src');
      }
    }
  }

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

    // Build 3 sets for seamless looping
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

    var isVideo = img.type === 'video';

    if (isVideo) {
      el.innerHTML =
        '<div class="slideshow__img-wrap slideshow__video-wrap">' +
          '<video src="' + img.src + '" class="slideshow__img slideshow__video" muted loop playsinline preload="metadata"></video>' +
          '<div class="slideshow__play-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg></div>' +
        '</div>' +
        '<div class="slideshow__caption">' +
          '<span class="slideshow__caption-title">' + img.title + '</span>' +
          '<span class="slideshow__caption-author">' + img.author + '</span>' +
        '</div>';
    } else {
      el.innerHTML =
        '<div class="slideshow__img-wrap">' +
          '<img data-src="' + img.thumb + '" data-full="' + img.full + '" alt="' + img.alt + '" class="slideshow__img" decoding="async">' +
        '</div>' +
        '<div class="slideshow__caption">' +
          '<span class="slideshow__caption-title">' + img.title + '</span>' +
          '<span class="slideshow__caption-author">' + img.author + '</span>' +
        '</div>';

      var imgEl = el.querySelector('.slideshow__img');
      lazyLoad(imgEl);
    }

    // Click/tap to open viewer
    el.querySelector('.slideshow__img-wrap').addEventListener('click', function () {
      var realIdx = idx % slideCount;
      openViewerFromSlideshow(realIdx);
    });

    return el;
  }

  // --- Position calculation ---

  function getSlidePixelWidth() {
    if (window.innerWidth <= 480) return window.innerWidth * 0.94;
    if (window.innerWidth <= 768) return window.innerWidth * 0.90;
    return Math.min(window.innerWidth * 0.55, 900);
  }

  function getSlideGap() {
    if (window.innerWidth <= 768) return 12;
    return 32;
  }

  function getSidebarWidth() {
    if (window.innerWidth <= 768) return 0;
    return 260;
  }

  function getSlideWidth() {
    return getSlidePixelWidth() + getSlideGap();
  }

  function calcTranslateX(index, extraPx) {
    var offset = index + slideCount;
    var centering = (window.innerWidth - getSidebarWidth() - getSlidePixelWidth()) / 2;
    return centering - offset * getSlidePixelWidth() - offset * getSlideGap() + (extraPx || 0);
  }

  function updateSlideshowPosition(animate, extraPx) {
    if (animate) {
      trackEl.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    } else {
      trackEl.style.transition = 'none';
    }
    trackEl.style.transform = 'translateX(' + calcTranslateX(slideIndex, extraPx) + 'px)';

    var slides = trackEl.querySelectorAll('.slideshow__slide');
    slides.forEach(function (s, i) {
      var realI = i - slideCount;
      s.classList.toggle('slideshow__slide--active', realI === slideIndex);

      // Auto-play video when active
      var video = s.querySelector('video');
      if (video) {
        if (realI === slideIndex) {
          video.play().catch(function () {});
        } else {
          video.pause();
        }
      }
    });
  }

  function goToSlide(newIndex, animate) {
    if (isAnimating) return;
    slideIndex = newIndex;

    if (slideIndex >= slideCount) {
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
    [-1, 1, 2].forEach(function (offset) {
      var idx = ((slideIndex + offset) % slideCount + slideCount) % slideCount;
      var img = allImages[idx];
      if (img && img.full && img.type !== 'video') {
        var preload = new Image();
        preload.src = img.full;
      }
    });
  }

  // --- Desktop: wheel navigation ---
  var wheelAccum = 0;
  var wheelTimer;
  function onSlideshowWheel(e) {
    if (!slideshowActive) return;
    e.preventDefault();

    var delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    wheelAccum += delta;

    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(function () { wheelAccum = 0; }, 200);

    if (Math.abs(wheelAccum) > 50) {
      if (wheelAccum > 0) nextSlide(); else prevSlide();
      wheelAccum = 0;
    }
  }

  // --- Mobile: discrete swipe detection (no drag, just next/prev) ---
  var mobileTouch = {
    startX: 0,
    startTime: 0,
    swiped: false
  };

  function onMobileTouchStart(e) {
    if (!slideshowActive || isAnimating) return;
    mobileTouch.startX = e.changedTouches[0].clientX;
    mobileTouch.startTime = Date.now();
    mobileTouch.swiped = false;
  }

  function onMobileTouchMove(e) {
    // Block all scrolling (vertical + horizontal) on the slideshow
    if (slideshowActive) e.preventDefault();
  }

  function onMobileTouchEnd(e) {
    if (!slideshowActive || isAnimating) return;
    var dx = e.changedTouches[0].clientX - mobileTouch.startX;
    var elapsed = Date.now() - mobileTouch.startTime;
    var velocity = Math.abs(dx) / elapsed;

    // Trigger next/prev on sufficient swipe distance OR quick flick
    var threshold = 40;
    var isFlick = velocity > 0.3 && Math.abs(dx) > 20;

    if (Math.abs(dx) > threshold || isFlick) {
      mobileTouch.swiped = true;
      if (dx < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Desktop: simple touch fallback (for trackpads on touch-capable desktops)
  var desktopTouchStartX = 0;
  function onDesktopTouchStart(e) {
    desktopTouchStartX = e.changedTouches[0].screenX;
  }
  function onDesktopTouchEnd(e) {
    var diff = desktopTouchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? nextSlide() : prevSlide();
    }
  }

  function enableSlideshow() {
    slideshowActive = true;
    slideshowEl.style.display = '';
    galleryEl.style.display = 'none';
    aboutEl.style.display = 'none';

    // Desktop: wheel
    document.querySelector('.main').addEventListener('wheel', onSlideshowWheel, { passive: false });

    if (isMobile()) {
      // Mobile: discrete swipe → next/prev (no drag, no scroll)
      slideshowEl.addEventListener('touchstart', onMobileTouchStart, { passive: true });
      slideshowEl.addEventListener('touchmove', onMobileTouchMove, { passive: false });
      slideshowEl.addEventListener('touchend', onMobileTouchEnd, { passive: true });
    } else {
      // Desktop: simple swipe
      slideshowEl.addEventListener('touchstart', onDesktopTouchStart, { passive: true });
      slideshowEl.addEventListener('touchend', onDesktopTouchEnd, { passive: true });
    }

    updateSlideshowPosition(false);
  }

  function disableSlideshow() {
    slideshowActive = false;
    slideshowEl.style.display = 'none';
    document.querySelector('.main').removeEventListener('wheel', onSlideshowWheel);

    // Remove all touch listeners
    slideshowEl.removeEventListener('touchstart', onMobileTouchStart);
    slideshowEl.removeEventListener('touchmove', onMobileTouchMove);
    slideshowEl.removeEventListener('touchend', onMobileTouchEnd);
    slideshowEl.removeEventListener('touchstart', onDesktopTouchStart);
    slideshowEl.removeEventListener('touchend', onDesktopTouchEnd);

    trackEl.querySelectorAll('video').forEach(function (v) { v.pause(); });
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

      var isVideo = img.type === 'video';

      if (isVideo) {
        item.innerHTML =
          '<div class="gallery__img-wrap gallery__video-wrap">' +
            '<video src="' + img.src + '" class="gallery__img gallery__video" muted loop playsinline preload="metadata"></video>' +
            '<div class="gallery__play-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg></div>' +
          '</div>' +
          '<div class="gallery__caption">' +
            '<span class="gallery__caption-title">' + img.title + '</span>' +
            '<span class="gallery__caption-author">' + img.author + '</span>' +
          '</div>';

        var videoEl = item.querySelector('video');

        if (isMobile()) {
          // Mobile: tap to play/pause
          item.querySelector('.gallery__img-wrap').addEventListener('click', function (e) {
            e.stopPropagation();
            var playIcon = item.querySelector('.gallery__play-icon');
            if (videoEl.paused) {
              videoEl.play().catch(function () {});
              if (playIcon) playIcon.style.opacity = '0';
            } else {
              videoEl.pause();
              if (playIcon) playIcon.style.opacity = '0.7';
            }
          });
        } else {
          // Desktop: hover to play
          item.addEventListener('mouseenter', function () {
            videoEl.play().catch(function () {});
          });
          item.addEventListener('mouseleave', function () {
            videoEl.pause();
            videoEl.currentTime = 0;
          });
        }
      } else {
        item.innerHTML =
          '<div class="gallery__img-wrap">' +
            '<img data-src="' + img.thumb + '" data-full="' + img.full + '" alt="' + img.alt + '" class="gallery__img" decoding="async">' +
          '</div>' +
          '<div class="gallery__caption">' +
            '<span class="gallery__caption-title">' + img.title + '</span>' +
            '<span class="gallery__caption-author">' + img.author + '</span>' +
          '</div>';

        var imgEl = item.querySelector('.gallery__img');
        lazyLoad(imgEl);
      }

      galleryEl.appendChild(item);
    });

    viewerItems = images;
    requestAnimationFrame(layoutMasonry);

    galleryEl.querySelectorAll('.gallery__img').forEach(function (imgEl) {
      if (imgEl.tagName === 'IMG') {
        imgEl.addEventListener('load', function () {
          var item = imgEl.closest('.gallery__item');
          if (item) setRowSpan(item, imgEl);
        }, { once: true });
      }
    });
  }

  function layoutMasonry() {
    if (window.innerWidth <= 768) return;

    galleryEl.querySelectorAll('.gallery__item').forEach(function (item) {
      if (item.style.display === 'none') return;
      var img = item.querySelector('.gallery__img');
      if (!img || img.tagName !== 'IMG') return;
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

    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-category') === category);
    });

    if (category === 'all') {
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
  // FULLSCREEN VIEWER (images + video)
  // ============================================

  function openViewerFromSlideshow(idx) {
    // On mobile, ignore taps that were actually swipes
    if (isMobile() && mobileTouch.swiped) return;
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
    if (viewerVideo) {
      viewerVideo.pause();
      viewerVideo.style.display = 'none';
    }
    if (viewerImg) {
      viewerImg.style.display = '';
    }
  }

  function showCurrentImage() {
    var img = viewerItems[viewerIndex];
    if (!img) return;

    if (img.type === 'video' && img.src) {
      viewerImg.style.display = 'none';
      viewerVideo.style.display = 'block';
      viewerVideo.src = img.src;
      viewerVideo.play().catch(function () {});
    } else {
      if (viewerVideo) {
        viewerVideo.pause();
        viewerVideo.style.display = 'none';
      }
      viewerImg.style.display = '';
      viewerImg.setAttribute('src', img.full);
      viewerImg.setAttribute('alt', img.alt);
    }

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
    if (viewerVideo) viewerVideo.pause();

    var activeEl = viewerItems[viewerIndex] && viewerItems[viewerIndex].type === 'video' ? viewerVideo : viewerImg;
    activeEl.style.opacity = '0';
    activeEl.style.transform = 'scale(0.95)';
    setTimeout(function () {
      showCurrentImage();
      activeEl = viewerItems[viewerIndex] && viewerItems[viewerIndex].type === 'video' ? viewerVideo : viewerImg;
      activeEl.style.opacity = '1';
      activeEl.style.transform = 'scale(1)';
    }, 200);
  }

  function initViewer() {
    // Gallery grid clicks (for non-video items; video tap-to-play handled separately on mobile)
    galleryEl.addEventListener('click', function (e) {
      var imgWrap = e.target.closest('.gallery__img-wrap');
      if (!imgWrap) return;
      // On mobile, don't open viewer for videos (tap plays inline)
      if (isMobile() && imgWrap.classList.contains('gallery__video-wrap')) return;
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

    // Keyboard
    document.addEventListener('keydown', function (e) {
      if (viewerOpen) {
        if (e.key === 'Escape') closeViewer();
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextImage();
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevImage();
        return;
      }
      if (slideshowActive) {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
      }
    });

    // Viewer touch/swipe
    var vTouchStartX = 0;
    var vTouchStartY = 0;
    var vIsHorizontal = null;

    viewer.addEventListener('touchstart', function (e) {
      vTouchStartX = e.changedTouches[0].clientX;
      vTouchStartY = e.changedTouches[0].clientY;
      vIsHorizontal = null;
    }, { passive: true });

    viewer.addEventListener('touchmove', function (e) {
      if (vIsHorizontal === null) {
        var dx = Math.abs(e.changedTouches[0].clientX - vTouchStartX);
        var dy = Math.abs(e.changedTouches[0].clientY - vTouchStartY);
        if (dx > 8 || dy > 8) {
          vIsHorizontal = dx > dy;
        }
      }
      if (vIsHorizontal) e.preventDefault();
    }, { passive: false });

    viewer.addEventListener('touchend', function (e) {
      if (vIsHorizontal !== true) return;
      var diff = vTouchStartX - e.changedTouches[0].clientX;
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
