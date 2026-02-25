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

    var ignoreScrollUntil = 0;

    function setActiveLink(link) {
      var links = toc.querySelectorAll('.toc-item a[href^="#"]');
      var activeList = ['font-medium', 'text-primary', 'dark:text-primary-light', 'border-primary', 'dark:border-primary-light', 'hover:border-primary', 'dark:hover:border-primary-light'];
      var inactiveList = ['text-gray-500', 'hover:text-gray-900', 'dark:text-gray-400', 'dark:hover:text-gray-300'];
      for (var i = 0; i < links.length; i++) {
        var a = links[i];
        if (a === link) {
          inactiveList.forEach(function (c) { a.classList.remove(c); });
          activeList.forEach(function (c) { a.classList.add(c); });
        } else {
          activeList.forEach(function (c) { a.classList.remove(c); });
          inactiveList.forEach(function (c) { a.classList.add(c); });
        }
      }
    }

    function getIdFromHref(a) {
      var href = a.getAttribute('href') || '';
      var i = href.indexOf('#');
      return i >= 0 ? href.slice(i + 1) : '';
    }

    function getActiveFromScroll() {
      var links = toc.querySelectorAll('.toc-item a[href*="#"]');
      if (!links.length) return null;
      var threshold = 180;
      var activeLink = null;
      var bestTop = -Infinity;
      for (var i = 0; i < links.length; i++) {
        var id = getIdFromHref(links[i]);
        if (!id) continue;
        var el = document.getElementById(id);
        if (!el) continue;
        var top = el.getBoundingClientRect().top;
        if (top <= threshold && top > bestTop) {
          bestTop = top;
          activeLink = links[i];
        }
      }
      if (activeLink) return activeLink;
      return links[0];
    }

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

    function onScroll(fromClick) {
      if (!fromClick && Date.now() < ignoreScrollUntil) return;
      var activeLink = fromClick ? null : getActiveFromScroll();
      if (activeLink) setActiveLink(activeLink);
      updateThumb();
    }

    onScroll(false);

    /* Update active state when a TOC link is clicked (capture so we run first) */
    function onTocClick(e) {
      var a = e.target.closest('a[href*="#"]');
      if (!a || !toc.contains(a)) return;
      var href = a.getAttribute('href') || '';
      var hashIdx = href.indexOf('#');
      if (hashIdx === -1 || !href.slice(hashIdx + 1)) return;
      ignoreScrollUntil = Date.now() + 400;
      setActiveLink(a);
      updateThumb();
      setTimeout(function () { ignoreScrollUntil = 0; }, 400);
    }
    toc.addEventListener('click', onTocClick, true);

    /* When hash changes (click or back/forward), highlight the matching TOC link */
    window.addEventListener('hashchange', function () {
      var id = (window.location.hash || '').slice(1);
      if (!id) return;
      var links = toc.querySelectorAll('.toc-item a[href*="#"]');
      for (var i = 0; i < links.length; i++) {
        if (getIdFromHref(links[i]) === id) {
          ignoreScrollUntil = Date.now() + 400;
          setActiveLink(links[i]);
          updateThumb();
          setTimeout(function () { ignoreScrollUntil = 0; }, 400);
          break;
        }
      }
    });

    window.addEventListener('scroll', function () {
      requestAnimationFrame(function () { onScroll(false); });
    }, { passive: true });
    window.addEventListener('resize', onScroll);
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
