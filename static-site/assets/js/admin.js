// WristWatch.uz — Admin panel logic (vanilla JS, Supabase Auth + CRUD)

(function () {
  'use strict';

  var client;
  var currentTab = 'dashboard';

  document.addEventListener('DOMContentLoaded', function () {
    client = getSupabaseClient();
    if (!client) return;
    checkSession();
    bindLoginForm();
    bindNav();
    bindLogout();
    bindProductForm();
  });

  /* ---------- Auth ---------- */
  function checkSession() {
    client.auth.getSession().then(function (res) {
      var session = res.data && res.data.session;
      if (session) {
        showApp();
      } else {
        showLogin();
      }
    });
    client.auth.onAuthStateChange(function (event, session) {
      if (session) showApp();
      else showLogin();
    });
  }

  function showLogin() {
    document.getElementById('admin-login-wrap').classList.remove('admin-hidden');
    document.getElementById('admin-app').classList.add('admin-hidden');
  }

  function showApp() {
    document.getElementById('admin-login-wrap').classList.add('admin-hidden');
    document.getElementById('admin-app').classList.remove('admin-hidden');
    switchTab('dashboard');
  }

  function bindLoginForm() {
    var form = document.getElementById('admin-login-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = document.getElementById('admin-email').value.trim();
      var password = document.getElementById('admin-password').value;
      var errorEl = document.getElementById('admin-login-error');
      var btn = document.getElementById('admin-login-submit');
      errorEl.textContent = '';
      btn.disabled = true;
      btn.textContent = '...';

      client.auth.signInWithPassword({ email: email, password: password }).then(function (res) {
        btn.disabled = false;
        btn.textContent = 'Kirish';
        if (res.error) {
          errorEl.textContent = "Email yoki parol noto'g'ri.";
          return;
        }
        showApp();
      });
    });
  }

  function bindLogout() {
    var btn = document.getElementById('admin-logout-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      client.auth.signOut();
    });
  }

  /* ---------- Tabs ---------- */
  function bindNav() {
    document.querySelectorAll('.admin-nav button[data-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchTab(btn.getAttribute('data-tab'));
      });
    });
  }

  function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.admin-nav button[data-tab]').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });
    document.querySelectorAll('.admin-tab-panel').forEach(function (panel) {
      panel.classList.toggle('admin-hidden', panel.getAttribute('data-panel') !== tab);
    });
    if (tab === 'dashboard') loadDashboard();
    if (tab === 'products') loadProducts();
    if (tab === 'orders') loadOrders();
  }

  /* ---------- Dashboard ---------- */
  function loadDashboard() {
    var el = document.getElementById('stat-total-products');
    var elNew = document.getElementById('stat-new-orders');
    var elWeek = document.getElementById('stat-week-orders');
    var elTotal = document.getElementById('stat-total-orders');

    client.from('products').select('id', { count: 'exact', head: true }).then(function (res) {
      el.textContent = res.count != null ? res.count : '—';
    });

    client.from('orders').select('*').then(function (res) {
      if (res.error || !res.data) {
        elNew.textContent = elWeek.textContent = elTotal.textContent = '—';
        return;
      }
      var orders = res.data;
      var weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      elTotal.textContent = orders.length;
      elNew.textContent = orders.filter(function (o) { return o.status === 'new'; }).length;
      elWeek.textContent = orders.filter(function (o) { return new Date(o.created_at).getTime() > weekAgo; }).length;
    });
  }

  /* ---------- Products ---------- */
  var productsCache = [];

  function loadProducts() {
    var list = document.getElementById('admin-products-list');
    var errorEl = document.getElementById('admin-products-error');
    list.innerHTML = '<p class="state-msg" style="color:rgba(11,12,13,0.4)">Yuklanmoqda...</p>';
    client.from('products').select('*').order('created_at', { ascending: false }).then(function (res) {
      if (res.error) {
        errorEl.textContent = "Ma'lumotlarni yuklashda xatolik yuz berdi.";
        list.innerHTML = '';
        return;
      }
      errorEl.textContent = '';
      productsCache = res.data || [];
      renderProducts();
    });
  }

  function renderProducts() {
    var list = document.getElementById('admin-products-list');
    if (!productsCache.length) {
      list.innerHTML = '<p class="state-msg" style="color:rgba(11,12,13,0.4)">Hozircha mahsulot yo\'q.</p>';
      return;
    }
    list.innerHTML = productsCache.map(function (p) {
      return (
        '<div class="admin-table-row">' +
          '<img class="admin-thumb" src="' + (p.image_url || '') + '" alt="" onerror="this.style.visibility=\'hidden\'">' +
          '<div style="flex:1;min-width:0">' +
            '<div style="font-weight:500">' + escapeHTML(p.name_uz || '') + '</div>' +
            '<div style="font-size:0.8rem;color:rgba(11,12,13,0.5)">' + escapeHTML(p.category || '') + ' · ' + formatPrice(p.price) + '</div>' +
          '</div>' +
          '<button class="admin-btn admin-btn-outline" data-edit="' + p.id + '">Tahrirlash</button>' +
          '<button class="admin-btn admin-btn-danger" data-delete="' + p.id + '">O\'chirish</button>' +
        '</div>'
      );
    }).join('');

    list.querySelectorAll('[data-edit]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openProductModal(productsCache.find(function (p) { return p.id === btn.getAttribute('data-edit'); }));
      });
    });
    list.querySelectorAll('[data-delete]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (!confirm("Bu mahsulotni o'chirishga ishonchingiz komilmi?")) return;
        client.from('products').delete().eq('id', btn.getAttribute('data-delete')).then(function (res) {
          if (res.error) {
            alert("O'chirishda xatolik yuz berdi.");
            return;
          }
          loadProducts();
        });
      });
    });

    document.getElementById('admin-add-product-btn').onclick = function () { openProductModal(null); };
  }

  function openProductModal(product) {
    var modal = document.getElementById('product-modal');
    var form = document.getElementById('product-form');
    form.reset();
    document.getElementById('product-modal-title').textContent = product ? 'Mahsulotni tahrirlash' : "Yangi mahsulot qo'shish";
    document.getElementById('product-form-error').textContent = '';
    form.dataset.editingId = product ? product.id : '';

    var fields = ['name_uz', 'name_ru', 'name_en', 'description_uz', 'description_ru', 'description_en',
      'category', 'price', 'image_url', 'case_material', 'strap_material', 'movement', 'water_resistance', 'diameter', 'weight'];
    fields.forEach(function (f) {
      var el = document.getElementById('pf-' + f);
      if (el) el.value = product && product[f] != null ? product[f] : '';
    });
    document.getElementById('pf-in_stock').checked = product ? !!product.in_stock : true;

    modal.classList.add('open');
  }

  function closeProductModal() {
    document.getElementById('product-modal').classList.remove('open');
  }

  function bindProductForm() {
    var form = document.getElementById('product-form');
    if (!form) return;
    document.getElementById('product-modal-close').addEventListener('click', closeProductModal);
    document.getElementById('product-modal').addEventListener('click', function (e) {
      if (e.target.id === 'product-modal') closeProductModal();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var errorEl = document.getElementById('product-form-error');
      var submitBtn = document.getElementById('pf-submit');
      errorEl.textContent = '';

      var payload = {
        name_uz: val('pf-name_uz'), name_ru: val('pf-name_ru'), name_en: val('pf-name_en'),
        description_uz: val('pf-description_uz'), description_ru: val('pf-description_ru'), description_en: val('pf-description_en'),
        category: val('pf-category'), price: Number(val('pf-price')) || 0, image_url: val('pf-image_url'),
        case_material: val('pf-case_material'), strap_material: val('pf-strap_material'), movement: val('pf-movement'),
        water_resistance: val('pf-water_resistance'), diameter: val('pf-diameter'), weight: val('pf-weight'),
        in_stock: document.getElementById('pf-in_stock').checked,
      };

      var editingId = form.dataset.editingId;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saqlanmoqda...';

      var query = editingId
        ? client.from('products').update(payload).eq('id', editingId)
        : client.from('products').insert([payload]);

      query.then(function (res) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Saqlash';
        if (res.error) {
          errorEl.textContent = 'Saqlashda xatolik yuz berdi. Qaytadan urinib ko\'ring.';
          return;
        }
        closeProductModal();
        loadProducts();
      });
    });
  }

  function val(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  /* ---------- Orders ---------- */
  function loadOrders() {
    var list = document.getElementById('admin-orders-list');
    var errorEl = document.getElementById('admin-orders-error');
    list.innerHTML = '<p class="state-msg" style="color:rgba(11,12,13,0.4)">Yuklanmoqda...</p>';
    client.from('orders').select('*').order('created_at', { ascending: false }).then(function (res) {
      if (res.error) {
        errorEl.textContent = "Ma'lumotlarni yuklashda xatolik yuz berdi.";
        list.innerHTML = '';
        return;
      }
      errorEl.textContent = '';
      renderOrders(res.data || []);
    });
  }

  function renderOrders(orders) {
    var list = document.getElementById('admin-orders-list');
    if (!orders.length) {
      list.innerHTML = '<p class="state-msg" style="color:rgba(11,12,13,0.4)">Hozircha buyurtma yo\'q.</p>';
      return;
    }
    list.innerHTML = orders.map(function (o) {
      var date = new Date(o.created_at).toLocaleString('uz-UZ');
      var badgeClass = o.status === 'done' ? 'admin-badge-done' : 'admin-badge-new';
      var badgeText = o.status === 'done' ? 'Bajarilgan' : 'Yangi';
      return (
        '<div class="admin-table-row">' +
          '<div style="flex:1;min-width:0">' +
            '<div style="font-weight:500">' + escapeHTML(o.product_name || '') + ' — ' + formatPrice(o.product_price) + '</div>' +
            '<div style="font-size:0.8rem;color:rgba(11,12,13,0.5)">' + escapeHTML(o.customer_name || '') + ' · ' + escapeHTML(o.customer_phone || '') + ' · ' + date + '</div>' +
          '</div>' +
          '<span class="admin-badge ' + badgeClass + '">' + badgeText + '</span>' +
          '<button class="admin-btn admin-btn-outline" data-toggle="' + o.id + '" data-status="' + o.status + '">' +
            (o.status === 'new' ? 'Bajarildi deb belgilash' : "Qayta ochish") +
          '</button>' +
        '</div>'
      );
    }).join('');

    list.querySelectorAll('[data-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var next = btn.getAttribute('data-status') === 'new' ? 'done' : 'new';
        client.from('orders').update({ status: next }).eq('id', btn.getAttribute('data-toggle')).then(function (res) {
          if (res.error) {
            alert('Yangilashda xatolik yuz berdi.');
            return;
          }
          loadOrders();
        });
      });
    });
  }
})();
