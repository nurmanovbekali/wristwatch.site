// WristWatch.uz — shared app behavior (no build step, plain JS)

(function () {
  'use strict';

  /* ---------- Language ---------- */
  var SUPPORTED_LANGS = ['uz', 'ru', 'en'];
  var STORAGE_KEY = 'ww_lang';

  function getLang() {
    var saved = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED_LANGS.indexOf(saved) !== -1 ? saved : 'uz';
  }

  function t(key) {
    var lang = getLang();
    var dict = window.I18N[lang] || window.I18N.uz;
    return dict[key] != null ? dict[key] : (window.I18N.uz[key] || key);
  }
  window.t = t;
  window.getLang = getLang;

  function applyI18n(root) {
    var scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var value = t(key);
      if (el.hasAttribute('data-i18n-attr')) {
        el.setAttribute(el.getAttribute('data-i18n-attr'), value);
      } else {
        // Preserve line breaks written as \n in the dictionary
        el.innerHTML = value.split('\n').join('<br>');
      }
    });
    scope.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    document.documentElement.lang = getLang();
  }
  window.applyI18n = applyI18n;

  function setLang(lang) {
    if (SUPPORTED_LANGS.indexOf(lang) === -1) return;
    localStorage.setItem(STORAGE_KEY, lang);
    applyI18n(document);
    document.querySelectorAll('.lang-dropdown button').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    var current = document.getElementById('lang-current');
    if (current) current.textContent = lang.toUpperCase();
    // Let pages react to language change (e.g. re-render dynamic product lists)
    document.dispatchEvent(new CustomEvent('ww:langchange', { detail: { lang: lang } }));
  }
  window.setLang = setLang;

  /* ---------- Theme (dark / light) ---------- */
  var THEME_KEY = 'ww_theme';
  var THEME_ICON = '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg><svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/></svg>';

  function getTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.setAttribute('aria-label', theme === 'light' ? 'Dark mode' : 'Light mode');
    });
  }

  function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  }
  window.setTheme = setTheme;

  function initTheme() {
    // Apply immediately (this call happens on DOMContentLoaded, so there
    // may be a brief flash on first paint — acceptable for now; a future
    // phase can move theme detection into an inline <head> snippet).
    applyTheme(getTheme());

    var navbarInner = document.querySelector('.navbar-inner');
    var navToggle = document.querySelector('.navbar-inner .nav-toggle');
    if (navbarInner && !document.querySelector('.theme-toggle')) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'theme-toggle';
      btn.innerHTML = THEME_ICON;
      btn.addEventListener('click', function () {
        setTheme(getTheme() === 'light' ? 'dark' : 'light');
      });
      // Placed in navbar-inner directly (not inside .nav-links) so it stays
      // visible on mobile too, where .nav-links is hidden until 860px.
      if (navToggle) {
        navbarInner.insertBefore(btn, navToggle);
      } else {
        navbarInner.appendChild(btn);
      }
    }
  }

  /* ---------- Navbar ---------- */
  function initNavbar() {
    var navbar = document.querySelector('.navbar');
    if (navbar) {
      var onScroll = function () {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    var toggle = document.querySelector('.nav-toggle');
    var mobileMenu = document.querySelector('.mobile-menu');
    if (toggle && mobileMenu) {
      toggle.addEventListener('click', function () {
        toggle.classList.toggle('open');
        mobileMenu.classList.toggle('open');
      });
      mobileMenu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          toggle.classList.remove('open');
          mobileMenu.classList.remove('open');
        });
      });
    }

    // Mark active nav link based on current page
    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  /* ---------- Language switcher dropdown ---------- */
  function initLangSwitcher() {
    var wrap = document.querySelector('.lang-switcher');
    if (!wrap) return;
    var btn = wrap.querySelector('.lang-btn');
    var dropdown = wrap.querySelector('.lang-dropdown');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    dropdown.querySelectorAll('button').forEach(function (option) {
      option.addEventListener('click', function () {
        setLang(option.getAttribute('data-lang'));
        dropdown.classList.remove('open');
      });
    });
    document.addEventListener('click', function () {
      dropdown.classList.remove('open');
    });
    var current = document.getElementById('lang-current');
    if (current) current.textContent = getLang().toUpperCase();
    dropdown.querySelectorAll('button').forEach(function (btn2) {
      btn2.classList.toggle('active', btn2.getAttribute('data-lang') === getLang());
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!items.length || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Animated counters ---------- */
  function initCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;
    var animate = function (el) {
      var raw = el.getAttribute('data-counter');
      var match = raw.match(/[0-9]+/);
      if (!match) { el.textContent = raw; return; }
      var target = parseInt(match[0], 10);
      var prefix = raw.slice(0, match.index);
      var suffix = raw.slice(match.index + match[0].length);
      var start = null;
      var duration = 1600;
      function tick(ts) {
        if (!start) start = ts;
        var p = Math.min(1, (ts - start) / duration);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = prefix + Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) {
      counters.forEach(animate);
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Hero kinetic word parallax (lightweight) ---------- */
  function initParallax() {
    var word = document.querySelector('.hero-kinetic-word span');
    if (!word) return;
    var ticking = false;
    function update() {
      var y = window.scrollY || 0;
      word.style.transform = 'translateY(' + (y * -0.15) + 'px)';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ---------- Hero title word-by-word reveal ---------- */
  function initHeroWords() {
    var el = document.querySelector('[data-word-reveal]');
    if (!el) return;
    var text = t(el.getAttribute('data-word-reveal'));
    var lines = text.split('\n');
    var html = '';
    var index = 0;
    lines.forEach(function (line) {
      html += '<span style="display:block;overflow:hidden;padding-bottom:4px;">';
      line.split(' ').forEach(function (word, i, arr) {
        var delay = (0.25 + index * 0.07).toFixed(2);
        index++;
        html += '<span class="word" style="animation-delay:' + delay + 's">' + word + (i < arr.length - 1 ? '&nbsp;' : '') + '</span>';
      });
      html += '</span>';
    });
    el.innerHTML = html;
  }
  document.addEventListener('ww:langchange', initHeroWords);

  /* ---------- Product image fallback ---------- */
  window.handleImgError = function (imgEl) {
    imgEl.style.display = 'none';
    var fallback = imgEl.nextElementSibling;
    if (fallback && fallback.classList.contains('product-thumb-fallback')) {
      fallback.style.display = 'flex';
    }
  };

  /* ---------- Price formatting ---------- */
  window.formatPrice = function (price) {
    if (price == null) return '';
    var n = Number(price);
    if (isNaN(n)) return '';
    return n.toLocaleString('uz-UZ') + " so'm";
  };

  /* ---------- Respect prefers-reduced-motion for autoplay video ---------- */
  function initMotionPreference() {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) return;
    document.querySelectorAll('video[autoplay]').forEach(function (v) {
      v.removeAttribute('autoplay');
      v.pause();
      v.removeAttribute('loop');
    });
  }

  /* ---------- Init on DOM ready ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initMotionPreference();
    applyI18n(document);
    initNavbar();
    initLangSwitcher();
    initReveal();
    initCounters();
    initParallax();
    initHeroWords();
  });
})();
