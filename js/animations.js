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

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // ============================================
  // INTRO VIDEO SOUND — fade in on interaction
  // ============================================

  function initVideoSound() {
    var video = document.getElementById('loader-video');
    if (!video) return;

    // Video starts muted (HTML attribute) for guaranteed autoplay.
    // On first user interaction, unmute and fade sound in.
    video.volume = 0;

    var unmuted = false;
    var unmute = function () {
      if (unmuted) return;
      unmuted = true;
      video.muted = false;
      video.volume = 0;
      fadeVolumeIn(video);
      document.removeEventListener('click', unmute);
      document.removeEventListener('touchstart', unmute);
      document.removeEventListener('wheel', unmute);
    };

    document.addEventListener('click', unmute);
    document.addEventListener('touchstart', unmute);
    document.addEventListener('wheel', unmute);
  }

  function fadeVolumeIn(video) {
    var target = 0.35;  // subtle background volume
    var duration = 1500; // 1.5 seconds
    var steps = 30;
    var stepTime = duration / steps;
    var increment = target / steps;
    var current = 0;

    var interval = setInterval(function () {
      current += increment;
      if (current >= target) {
        video.volume = target;
        clearInterval(interval);
      } else {
        video.volume = current;
      }
    }, stepTime);
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

    // Fade out video audio
    var video = document.getElementById('loader-video');
    if (video) {
      gsap.to(video, { volume: 0, duration: 0.5, onComplete: function () {
        video.pause();
      }});
    }

    var site = document.getElementById('site');
    gsap.to(site, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: function () {
        if (window.TumbuktuGallery) {
          window.TumbuktuGallery.enableSlideshow();
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

  // --- Nav Image Preview (background — desktop only) ---
  function initNavPreview() {
    // Skip on touch/mobile devices — hover preview doesn't make sense
    if (window.innerWidth <= 768) return;

    var preview = document.getElementById('nav-preview');
    var navLinks = document.querySelectorAll('.nav-link[data-preview]');

    navLinks.forEach(function (link) {
      link.addEventListener('mouseenter', function () {
        if (window.innerWidth <= 768) return;
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
      var main = document.querySelector('.main');
      gsap.to(main, {
        opacity: 0,
        y: 20,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: function () {
          if (callback) callback();

          gsap.to(main, {
            opacity: 1,
            y: 0,
            duration: 0.45,
            delay: 0.05,
            ease: 'power3.out',
            onComplete: function () {
              revealGalleryItems(false);
              initScrollReveals();
              ScrollTrigger.refresh();
              if (window.TumbuktuGallery) {
                window.TumbuktuGallery.layoutMasonry();
              }
              if (window.TumbuktuCursor) {
                window.TumbuktuCursor.initMagnetic();
              }
            }
          });
        }
      });
    }
  };

  // --- Mobile Menu ---
  function initMobileMenu() {
    var toggle = document.getElementById('menu-toggle');
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('mobile-overlay');
    var savedScrollY = 0;

    function openMenu() {
      // Save scroll position before locking body
      savedScrollY = window.scrollY;
      toggle.classList.add('menu-toggle--active');
      sidebar.classList.add('sidebar--open');
      overlay.classList.add('mobile-overlay--visible');
      document.body.classList.add('menu-open');
      document.body.style.top = '-' + savedScrollY + 'px';
    }

    function closeMenu() {
      toggle.classList.remove('menu-toggle--active');
      sidebar.classList.remove('sidebar--open');
      overlay.classList.remove('mobile-overlay--visible');
      document.body.classList.remove('menu-open');
      document.body.style.top = '';
      // Restore scroll position
      window.scrollTo(0, savedScrollY);
    }

    toggle.addEventListener('click', function () {
      if (sidebar.classList.contains('sidebar--open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    overlay.addEventListener('click', closeMenu);

    // Close menu when a nav link is tapped
    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          closeMenu();
        }
      });
    });

    // Close menu when logo is tapped on mobile
    var logo = document.querySelector('.sidebar__logo');
    if (logo) {
      logo.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          closeMenu();
        }
      });
    }
  }

  // --- Init Everything ---
  document.addEventListener('DOMContentLoaded', function () {
    initLenis();
    initVideoSound();
    playLoadingSequence();
    initNavPreview();
    initMobileMenu();
  });
})();
