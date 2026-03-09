/* ============================================
   TUMBUKTU STUDIO — Animations (GSAP + Lenis)
   ============================================ */

(function () {
  'use strict';

  // --- Lenis Smooth Scroll ---
  var lenis;

  function initLenis() {
    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // --- Loading Screen Animation ---
  function playLoadingSequence() {
    var tl = gsap.timeline({
      onComplete: revealSite
    });

    tl.to('.loader__title-main', {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    })
    .to('.loader__title-sub', {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3')
    .to('.loader__tagline', {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.2')
    .to({}, { duration: 1.5 }) // pause to admire
    .to('.loader__content', {
      opacity: 0,
      y: -30,
      duration: 0.6,
      ease: 'power2.in'
    })
    .to('.loader__video', {
      opacity: 0,
      scale: 1.1,
      duration: 0.8,
      ease: 'power2.in'
    }, '-=0.4')
    .to('.loader', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    }, '-=0.3');
  }

  // --- Reveal Site After Loader ---
  function revealSite() {
    var loader = document.getElementById('loader');
    loader.style.pointerEvents = 'none';
    loader.style.display = 'none';

    var site = document.getElementById('site');
    gsap.to(site, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: function () {
        if (window.TumbuktuGallery) {
          window.TumbuktuGallery.layoutMasonry();
        }
        revealGalleryItems(true);
        initScrollReveals();
      }
    });
  }

  // --- Gallery Item Reveal (mask animation on initial load) ---
  function revealGalleryItems(isInitial) {
    var items = document.querySelectorAll('.gallery__item:not(.revealed)');
    var visibleItems = [];

    for (var i = 0; i < items.length; i++) {
      var rect = items[i].getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) {
        visibleItems.push(items[i]);
      }
    }

    visibleItems.forEach(function (item, idx) {
      var delay = isInitial ? idx * 0.08 : idx * 0.05;
      gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: delay,
        ease: 'power3.out',
        onStart: function () {
          item.classList.add('revealed');
          if (isInitial) {
            item.classList.add('mask-reveal');
          }
        }
      });
    });
  }

  // --- Scroll Reveal for images entering viewport ---
  function initScrollReveals() {
    var items = document.querySelectorAll('.gallery__item');

    items.forEach(function (item) {
      if (item.classList.contains('revealed')) return;

      ScrollTrigger.create({
        trigger: item,
        start: 'top 90%',
        once: true,
        onEnter: function () {
          gsap.to(item, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            onStart: function () {
              item.classList.add('revealed');
            }
          });
        }
      });
    });
  }

  // --- Nav Image Preview (background) ---
  function initNavPreview() {
    var preview = document.getElementById('nav-preview');
    var navLinks = document.querySelectorAll('.nav-link[data-preview]');

    navLinks.forEach(function (link) {
      link.addEventListener('mouseenter', function () {
        var src = this.getAttribute('data-preview');
        if (src) {
          preview.style.backgroundImage = 'url(' + src + ')';
          preview.classList.add('nav-preview--active');
        }
      });

      link.addEventListener('mouseleave', function () {
        preview.classList.remove('nav-preview--active');
      });
    });
  }

  // --- Page Transition (category switch) ---
  window.TumbuktuAnimations = {
    transitionGallery: function (callback) {
      var gallery = document.getElementById('gallery');
      gallery.classList.add('gallery--fading');

      setTimeout(function () {
        if (callback) callback();

        gallery.classList.remove('gallery--fading');
        gallery.classList.add('gallery--entering');

        // Force reflow
        void gallery.offsetHeight;

        gallery.classList.remove('gallery--entering');
        gallery.classList.add('gallery--visible');

        // Reveal new items and recalculate masonry
        setTimeout(function () {
          if (window.TumbuktuGallery) {
            window.TumbuktuGallery.layoutMasonry();
          }
          revealGalleryItems(false);
          initScrollReveals();
          ScrollTrigger.refresh();
          if (window.TumbuktuCursor) {
            window.TumbuktuCursor.initMagnetic();
          }
        }, 50);

        setTimeout(function () {
          gallery.classList.remove('gallery--visible');
        }, 600);
      }, 380);
    }
  };

  // --- Mobile Menu ---
  function initMobileMenu() {
    var toggle = document.getElementById('menu-toggle');
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('mobile-overlay');

    function openMenu() {
      toggle.classList.add('menu-toggle--active');
      sidebar.classList.add('sidebar--open');
      overlay.classList.add('mobile-overlay--visible');
    }

    function closeMenu() {
      toggle.classList.remove('menu-toggle--active');
      sidebar.classList.remove('sidebar--open');
      overlay.classList.remove('mobile-overlay--visible');
    }

    toggle.addEventListener('click', function () {
      if (sidebar.classList.contains('sidebar--open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    overlay.addEventListener('click', closeMenu);

    // Close on nav link click (mobile)
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          closeMenu();
        }
      });
    });
  }

  // --- Init Everything ---
  document.addEventListener('DOMContentLoaded', function () {
    initLenis();
    playLoadingSequence();
    initNavPreview();
    initMobileMenu();
  });
})();
