/**
 * TOC track bar + animated thumb for Mintlify "On this page".
 * Wraps #table-of-contents-content in a track and moves a thumb to the active section.
 */
(function () {
  function init() {
    var toc = document.getElementById('table-of-contents-content');
    if (!toc || toc.dataset.tocTrack === 'done') return;

    var parent = toc.parentElement;
    if (!parent) return;

    var wrapper = document.createElement('div');
    wrapper.className = 'toc-track-wrapper';

    var track = document.createElement('div');
    track.className = 'toc-track';
    track.setAttribute('aria-hidden', 'true');

    var thumb = document.createElement('div');
    thumb.className = 'toc-thumb';
    thumb.setAttribute('aria-hidden', 'true');

    wrapper.appendChild(track);
    wrapper.appendChild(thumb);
    parent.insertBefore(wrapper, toc);
    wrapper.appendChild(toc);

    toc.dataset.tocTrack = 'done';

    function updateThumb() {
      var active = toc.querySelector('.toc-item a.border-primary, .toc-item a.text-primary');
      if (!active) {
        var first = toc.querySelector('.toc-item a');
        if (first) active = first;
      }
      var li = active ? active.closest('.toc-item') : null;
      if (!li) {
        thumb.style.top = '0';
        thumb.style.height = '0';
        return;
      }
      var ulTop = toc.offsetTop;
      thumb.style.top = (ulTop + li.offsetTop) + 'px';
      thumb.style.height = li.offsetHeight + 'px';
    }

    updateThumb();

    var observer = new MutationObserver(function () {
      updateThumb();
    });
    observer.observe(toc, { attributes: true, attributeFilter: ['class'], subtree: true });

    window.addEventListener('scroll', function () {
      requestAnimationFrame(updateThumb);
    }, { passive: true });
    window.addEventListener('resize', updateThumb);
  }

  function tryInit() {
    var toc = document.getElementById('table-of-contents-content');
    if (toc && !toc.dataset.tocTrack) init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      tryInit();
      setTimeout(tryInit, 500);
    });
  } else {
    tryInit();
    setTimeout(tryInit, 500);
  }

  /* Re-run when navigating without full refresh (SPA) */
  var navTimer;
  var navObserver = new MutationObserver(function (mutations) {
    for (var i = 0; i < mutations.length; i++) {
      if (mutations[i].addedNodes.length) {
        clearTimeout(navTimer);
        navTimer = setTimeout(tryInit, 150);
        break;
      }
    }
  });
  navObserver.observe(document.body, { childList: true, subtree: true });
})();
