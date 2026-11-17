/* ============================================================
   Inkwash Arcade · 共享工具
   纯浏览器端，无依赖。挂到 window.DSHG。
   含：DOM 助手、本地存储、随机、toast、顶栏/页脚、皮肤切换。
   ============================================================ */
(function () {
  'use strict';

  const qs = (sel, root) => (root || document).querySelector(sel);
  const qsa = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  /** 建元素：el('div', {class:'x', onclick:fn}, '文本' | child | [child]) */
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v === undefined || v === null || v === false) continue;
        if (k === 'class') node.className = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k === 'text') node.textContent = v;
        else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
        else if (k === 'dataset' && typeof v === 'object') Object.assign(node.dataset, v);
        else node.setAttribute(k, v);
      }
    }
    const list = children === undefined ? [] : (Array.isArray(children) ? children : [children]);
    for (const c of list) {
      if (c === null || c === undefined || c === false) continue;
      node.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    }
    return node;
  }

  /* ---------- 本地存储（带命名空间，失败静默） ---------- */
  const NS = 'inkwash.';
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(NS + key);
        if (raw === null) return fallback;
        return JSON.parse(raw);
      } catch (err) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(NS + key, JSON.stringify(value)); return true; } catch (err) { return false; }
    },
    del(key) { try { localStorage.removeItem(NS + key); } catch (err) {} },
    clearAll() {
      try {
        Object.keys(localStorage)
          .filter((k) => k.indexOf(NS) === 0 && k !== NS + 'theme')
          .forEach((k) => localStorage.removeItem(k));
      } catch (err) {}
    },
  };

  /* ---------- 皮肤 ---------- */
  const THEMES = [
    { id: 'ink', name: '墨夜', note: '默认', swatch: '#0b0f16', meta: '#0b0f16' },
    { id: 'paper', name: '素笺', note: '暖白', swatch: '#f7f2e7', meta: '#f7f2e7' },
    { id: 'jade', name: '青岚', note: '冷白', swatch: '#eef4f1', meta: '#eef4f1' },
    { id: 'dusk', name: '暮蓝', note: '柔暗', swatch: '#202c3c', meta: '#202c3c' },
  ];

  function currentTheme() {
    const fromDom = document.documentElement.dataset.theme;
    if (fromDom) return fromDom;
    try { return localStorage.getItem(NS + 'theme') || 'ink'; } catch (err) { return 'ink'; }
  }

  function applyTheme(id) {
    const theme = THEMES.find((t) => t.id === id) || THEMES[0];
    document.documentElement.dataset.theme = theme.id;
    try { localStorage.setItem(NS + 'theme', theme.id); } catch (err) {}
    const meta = qs('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme.meta);
    document.dispatchEvent(new CustomEvent('inkwash:theme', { detail: theme.id }));
    return theme.id;
  }

  function themeSwitcher() {
    const wrap = el('div', { class: 'theme-switch' });
    const btn = el('button', {
      class: 'theme-switch__btn', type: 'button',
      'aria-haspopup': 'true', 'aria-expanded': 'false', title: '切换皮肤',
    }, [
      el('span', { class: 'theme-switch__dot', 'aria-hidden': 'true' }),
      el('span', { class: 'theme-switch__label', text: '皮肤' }),
    ]);
    const menu = el('div', { class: 'theme-switch__menu', role: 'menu' });

    function paint() {
      const cur = currentTheme();
      const item = THEMES.find((t) => t.id === cur) || THEMES[0];
      btn.querySelector('.theme-switch__dot').style.background = item.swatch;
      qsa('.theme-switch__item', menu).forEach((b) => {
        b.setAttribute('aria-checked', String(b.dataset.theme === cur));
      });
      menu.querySelectorAll('.theme-switch__mark').forEach((m) => {
        m.textContent = m.dataset.for === cur ? '在用' : '';
      });
    }

    for (const t of THEMES) {
      const item = el('button', {
        class: 'theme-switch__item', type: 'button', role: 'menuitemradio',
        'aria-checked': 'false', dataset: { theme: t.id },
        onclick: () => { applyTheme(t.id); paint(); close(); },
      }, [
        el('span', { class: 'theme-switch__swatch', 'aria-hidden': 'true', style: { background: t.swatch } }),
        el('span', { text: t.name }),
        el('span', { class: 'theme-switch__mark', dataset: { for: t.id }, text: '' }),
      ]);
      if (t.note) item.setAttribute('title', t.note);
      menu.appendChild(item);
    }

    function open() { wrap.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); paint(); }
    function close() { wrap.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); }
    function toggle() { wrap.classList.contains('is-open') ? close() : open(); }

    btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    document.addEventListener('click', (e) => { if (!wrap.contains(e.target)) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    wrap.appendChild(btn);
    wrap.appendChild(menu);
    paint();
    return wrap;
  }

  document.addEventListener('inkwash:theme', () => {
    const sw = qs('.theme-switch');
    if (sw) sw.querySelectorAll('.theme-switch__item').forEach((b) => {
      b.setAttribute('aria-checked', String(b.dataset.theme === currentTheme()));
      const mark = b.querySelector('.theme-switch__mark');
      if (mark) mark.textContent = b.dataset.theme === currentTheme() ? '在用' : '';
    });
  });

  /* ---------- 随机 ---------- */
  const rand = {
    int(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },
    float(min, max) { return Math.random() * (max - min) + min; },
    pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
    weighted(items, weightOf) {
      const w = weightOf || ((it) => it.weight || 1);
      let total = 0;
      for (const it of items) total += Math.max(0, w(it));
      if (total <= 0) return items[0];
      let roll = Math.random() * total;
      for (const it of items) {
        roll -= Math.max(0, w(it));
        if (roll <= 0) return it;
      }
      return items[items.length - 1];
    },
    chance(p) { return Math.random() < p; },
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
  };

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const fmt = (n) => Number(n).toLocaleString('zh-CN');

  /* ---------- 提示 ---------- */
  let toastHost = null;
  function toast(message, ms) {
    if (!toastHost) {
      toastHost = el('div', { class: 'toast-host' });
      document.body.appendChild(toastHost);
    }
    const node = el('div', { class: 'toast', text: message });
    toastHost.appendChild(node);
    const life = ms || 1800;
    setTimeout(() => {
      node.classList.add('is-out');
      setTimeout(() => node.remove(), 320);
    }, life);
    return node;
  }

  /* ---------- 顶栏 / 页脚（五个页面共用） ---------- */
  const AUTHOR = '馒头';

  function mountChrome(opts) {
    const o = opts || {};
    const bar = qs('[data-chrome="topbar"]');
    if (bar) {
      bar.innerHTML = '';
      bar.appendChild(el('div', { class: 'wrap topbar__inner' }, [
        el('a', { class: 'brand', href: './index.html', title: '回到大厅' }, [
          el('span', { class: 'brand__mark', text: '纹' }),
          el('span', { text: o.title || '墨戏五卷' }),
        ]),
        el('span', { class: 'spacer' }),
        el('span', { class: 'topbar__meta', text: o.meta || 'INKWASH ARCADE' }),
        themeSwitcher(),
        el('a', { class: 'btn btn--ghost', href: './index.html', style: { padding: '8px 16px', fontSize: '13px' }, text: '大厅' }),
      ]));
    }

    const foot = qs('[data-chrome="footer"]');
    if (foot) {
      foot.className = 'wrap foot';
      foot.innerHTML = '';
      foot.appendChild(el('div', { class: 'foot__line', text: o.footnote || '墨戏五卷 · 故事三卷、题库两卷 · 纯前端离线可玩' }));
      foot.appendChild(el('div', { class: 'foot__author' }, [
        el('span', { class: 'foot__seal', 'aria-hidden': 'true', text: '馒' }),
        el('span', { text: '作者 ' }),
        el('b', { text: AUTHOR }),
        el('span', { text: ' · © 2026 保留所有权利' }),
      ]));
    }
  }

  /* ---------- 纯 CSS 过渡切屏 ---------- */
  function swap(node, next) {
    node.classList.add('is-out');
    setTimeout(() => {
      node.replaceWith(next);
      next.classList.add('screen');
    }, 200);
  }

  /* ---------- 数字滚动 ---------- */
  function countTo(node, from, to, ms, formatter) {
    const dur = ms || 700;
    const f = formatter || ((v) => Math.round(v));
    const t0 = performance.now();
    function step(t) {
      const p = clamp((t - t0) / dur, 0, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      node.textContent = f(from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  window.DSHG = {
    qs, qsa, el, store, rand, clamp, fmt, toast, mountChrome, swap, countTo,
    theme: { list: THEMES, current: currentTheme, apply: applyTheme },
  };
})();