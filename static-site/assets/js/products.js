// WristWatch.uz — product loading & rendering helpers (vanilla JS, no build step)

(function () {
  'use strict';

  function productName(p) {
    var lang = getLang();
    return p['name_' + lang] || p.name_uz || '';
  }
  window.productName = productName;

  function productDescription(p) {
    var lang = getLang();
    return p['description_' + lang] || p.description_uz || '';
  }
  window.productDescription = productDescription;

  function productCardHTML(p) {
    var name = productName(p);
    return (
      '<a class="product-card reveal" href="product.html?id=' + encodeURIComponent(p.id) + '">' +
        '<div class="product-image-wrap">' +
          '<img src="' + (p.image_url || '') + '" alt="' + escapeHTML(name) + '" loading="lazy" onerror="handleImgError(this)">' +
          '<div class="product-thumb-fallback" data-i18n="product.image_unavailable"></div>' +
          '<div class="ring"></div>' +
        '</div>' +
        '<div class="product-info">' +
          '<div>' +
            '<div class="product-name">' + escapeHTML(name) + '</div>' +
            '<div class="product-category">' + escapeHTML(p.category || '') + '</div>' +
          '</div>' +
          '<div class="product-price">' + formatPrice(p.price) + '</div>' +
        '</div>' +
      '</a>'
    );
  }
  window.productCardHTML = productCardHTML;

  function escapeHTML(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }
  window.escapeHTML = escapeHTML;

  /* ---------- Home: featured products ---------- */
  window.loadFeaturedProducts = function () {
    var container = document.getElementById('featured-products');
    if (!container) return;
    var client = getSupabaseClient();
    if (!client) return;
    client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3)
      .then(function (res) {
        var data = res.data;
        if (res.error || !data || !data.length) {
          var section = document.getElementById('featured-section');
          if (section) section.style.display = 'none';
          return;
        }
        container.innerHTML = data.map(productCardHTML).join('');
        applyI18n(container);
        initRevealIn(container);
        document.addEventListener('ww:langchange', function () {
          container.innerHTML = data.map(productCardHTML).join('');
          applyI18n(container);
        });
      });
  };

  /* ---------- Catalog: full list + filters ---------- */
  window.initCatalogPage = function () {
    var grid = document.getElementById('catalog-grid');
    var stateMsg = document.getElementById('catalog-state');
    var filterRow = document.getElementById('catalog-filters');
    if (!grid) return;

    var client = getSupabaseClient();
    if (!client) return;

    var allProducts = [];
    var activeCategory = 'all';

    function render() {
      var filtered = activeCategory === 'all'
        ? allProducts
        : allProducts.filter(function (p) { return p.category === activeCategory; });

      if (!filtered.length) {
        grid.innerHTML = '';
        stateMsg.textContent = t('catalog.empty');
        stateMsg.style.display = 'block';
        return;
      }
      stateMsg.style.display = 'none';
      grid.innerHTML = filtered.map(productCardHTML).join('');
      applyI18n(grid);
      initRevealIn(grid);
    }

    function renderFilters() {
      var categories = ['all'].concat(
        Array.from(new Set(allProducts.map(function (p) { return p.category; }).filter(Boolean)))
      );
      filterRow.innerHTML = categories.map(function (c) {
        var label = c === 'all' ? t('catalog.all') : c;
        var activeClass = c === activeCategory ? ' active' : '';
        return '<button class="filter-pill' + activeClass + '" data-category="' + escapeHTML(c) + '">' + escapeHTML(label) + '</button>';
      }).join('');
      filterRow.querySelectorAll('.filter-pill').forEach(function (btn) {
        btn.addEventListener('click', function () {
          activeCategory = btn.getAttribute('data-category');
          renderFilters();
          render();
        });
      });
    }

    stateMsg.textContent = t('catalog.loading');
    stateMsg.style.display = 'block';

    client
      .from('products')
      .select('*')
      .then(function (res) {
        if (res.error) {
          console.error(res.error);
          stateMsg.textContent = t('catalog.error');
          stateMsg.style.display = 'block';
          return;
        }
        allProducts = res.data || [];
        renderFilters();
        render();
      });

    document.addEventListener('ww:langchange', function () {
      renderFilters();
      render();
    });
  };

  /* ---------- Product detail page ---------- */
  window.initProductPage = function () {
    var loadingEl = document.getElementById('product-loading');
    var notFoundEl = document.getElementById('product-notfound');
    var contentEl = document.getElementById('product-content');
    if (!contentEl) return;

    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    var client = getSupabaseClient();

    if (!id || !client) {
      loadingEl.style.display = 'none';
      notFoundEl.style.display = 'block';
      return;
    }

    client
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      .then(function (res) {
        loadingEl.style.display = 'none';
        if (res.error || !res.data) {
          notFoundEl.style.display = 'block';
          return;
        }
        renderProduct(res.data);
        contentEl.style.display = 'block';
        loadRelated(res.data);
      });

    function renderProduct(p) {
      document.title = productName(p) + ' — WristWatch.uz';
      window._currentProduct = p;

      var descText = (productDescription(p) || '').slice(0, 155);
      var descTag = document.querySelector('meta[name="description"]');
      if (descTag && descText) descTag.setAttribute('content', descText);
      var ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', productName(p) + ' — WristWatch.uz');
      var ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc && descText) ogDesc.setAttribute('content', descText);
      var ogImg = document.querySelector('meta[property="og:image"]');
      if (p.image_url) {
        if (!ogImg) {
          ogImg = document.createElement('meta');
          ogImg.setAttribute('property', 'og:image');
          document.head.appendChild(ogImg);
        }
        ogImg.setAttribute('content', p.image_url);
      }

      document.getElementById('product-image').setAttribute('src', p.image_url || '');
      document.getElementById('product-image').setAttribute('alt', productName(p));
      document.getElementById('product-name').textContent = productName(p);
      document.getElementById('product-category').textContent = p.category || '';
      document.getElementById('product-price').textContent = formatPrice(p.price);
      document.getElementById('product-description').textContent = productDescription(p);

      renderSpecs(p);

      document.addEventListener('ww:langchange', function () {
        document.getElementById('product-name').textContent = productName(p);
        document.getElementById('product-description').textContent = productDescription(p);
        renderSpecs(p);
      });
    }

    function renderSpecs(p) {
      var specsWrap = document.getElementById('product-specs');
      var specDefs = [
        { key: 'case_material', label: 'A', i18n: 'product.spec_case' },
        { key: 'strap_material', label: 'B', i18n: 'product.spec_strap' },
        { key: 'movement', label: 'C', i18n: 'product.spec_movement' },
        { key: 'water_resistance', label: 'D', i18n: 'product.spec_water' },
        { key: 'diameter', label: 'E', i18n: 'product.spec_diameter' },
        { key: 'weight', label: 'F', i18n: 'product.spec_weight' },
      ];
      var present = specDefs.filter(function (s) { return p[s.key]; });
      var section = document.getElementById('product-specs-section');
      if (!present.length) {
        section.style.display = 'none';
        return;
      }
      section.style.display = 'block';
      specsWrap.innerHTML = present.map(function (s) {
        return (
          '<div class="spec-row">' +
            '<span class="spec-marker">' + s.label + '</span>' +
            '<div class="spec-row-body">' +
              '<span class="spec-label">' + escapeHTML(t(s.i18n)) + '</span>' +
              '<span class="spec-value">' + escapeHTML(p[s.key]) + '</span>' +
            '</div>' +
          '</div>'
        );
      }).join('');
    }

    function loadRelated(p) {
      var relatedSection = document.getElementById('related-section');
      var relatedGrid = document.getElementById('related-grid');
      if (!relatedSection || !relatedGrid) return;
      client
        .from('products')
        .select('*')
        .eq('category', p.category)
        .neq('id', p.id)
        .limit(3)
        .then(function (res) {
          var data = res.data;
          if (res.error || !data || !data.length) {
            relatedSection.style.display = 'none';
            return;
          }
          relatedGrid.innerHTML = data.map(productCardHTML).join('');
          applyI18n(relatedGrid);
          initRevealIn(relatedGrid);
        });
    }
  };

  /* ---------- Order form submission ---------- */
  window.initOrderForm = function () {
    var form = document.getElementById('order-form');
    if (!form) return;
    var statusEl = document.getElementById('order-status');
    var submitBtn = document.getElementById('order-submit');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var product = window._currentProduct;
      if (!product) return;

      var name = document.getElementById('order-name').value.trim();
      var phone = document.getElementById('order-phone').value.trim();
      if (!name || !phone) return;

      submitBtn.disabled = true;
      submitBtn.textContent = t('product.sending');
      statusEl.textContent = '';
      statusEl.className = '';

      var client = getSupabaseClient();

      client
        .from('orders')
        .insert([{
          product_id: product.id,
          product_name: productName(product),
          product_price: product.price,
          customer_name: name,
          customer_phone: phone,
          status: 'new',
        }])
        .select()
        .single()
        .then(function (res) {
          if (res.error) throw res.error;
          return fetch('/.netlify/functions/notify-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productName: productName(product),
              price: product.price,
              customerName: name,
              customerPhone: phone,
              orderId: res.data ? res.data.id : undefined,
            }),
          });
        })
        .then(function () {
          statusEl.textContent = t('product.sent');
          statusEl.className = 'form-success';
          form.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = t('product.send');
        })
        .catch(function (err) {
          console.error(err);
          statusEl.textContent = t('product.error');
          statusEl.className = 'form-error';
          submitBtn.disabled = false;
          submitBtn.textContent = t('product.send');
        });
    });
  };

  /* ---------- Re-run reveal observer for dynamically injected nodes ---------- */
  window.initRevealIn = function (root) {
    var items = root.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
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
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { observer.observe(el); });
  };
})();
