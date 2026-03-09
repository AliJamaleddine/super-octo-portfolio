/* ============================================
   TUMBUKTU STUDIO — Custom Cursor & Magnetic Hover
   ============================================ */

(function () {
  'use strict';

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) return;

  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let cx = mx;
  let cy = my;
  const speed = 0.15;

  // Track mouse position
  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
  });

  // Cursor animation loop
  function animate() {
    cx += (mx - cx) * speed;
    cy += (my - cy) * speed;
    cursor.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px, 0)';
    requestAnimationFrame(animate);
  }
  animate();

  // Hover state for interactive elements
  var hoverTargets = 'a, button, .gallery__img-wrap';

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('cursor--hover');
    }
  });

  document.addEventListener('mouseout', function (e) {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('cursor--hover');
    }
  });

  // Click feedback
  document.addEventListener('mousedown', function () {
    cursor.classList.add('cursor--click');
  });
  document.addEventListener('mouseup', function () {
    cursor.classList.remove('cursor--click');
  });

  // --- Magnetic Image Hover ---
  var galleryItems = [];

  function initMagnetic() {
    galleryItems = Array.from(document.querySelectorAll('.gallery__img-wrap'));
  }

  document.addEventListener('mousemove', function (e) {
    for (var i = 0; i < galleryItems.length; i++) {
      var wrap = galleryItems[i];
      var rect = wrap.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;
      var distX = e.clientX - centerX;
      var distY = e.clientY - centerY;
      var dist = Math.sqrt(distX * distX + distY * distY);
      var threshold = Math.max(rect.width, rect.height) * 0.6;

      if (dist < threshold) {
        var pull = (1 - dist / threshold) * 6;
        wrap.style.transform = 'translate(' + (distX * pull / threshold) + 'px, ' + (distY * pull / threshold) + 'px)';
      } else {
        wrap.style.transform = '';
      }
    }
  });

  // Re-init magnetic targets when gallery updates
  window.TumbuktuCursor = { initMagnetic: initMagnetic };

  // Initial setup
  document.addEventListener('DOMContentLoaded', initMagnetic);
})();
