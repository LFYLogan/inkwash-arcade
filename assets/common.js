/* ============================================================
   Inkwash Arcade · 共享工具
   纯浏览器端，无依赖。挂到 window.DSHG。
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
          .filter((k) => k.indexOf(NS) === 0)
          .forEach((k) => localStorage.removeItem(k));
      } catch (err) {}
    },
  };

  /* ---------- 随机 ---------- */
  const rand = {
    int(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },
    float(min, max) { return Math.random() * (max - min) + min; },
    pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
    /** 按权重取：items = [{weight, ...}] */
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

  /* ---------- 顶栏 / 页脚（三个游戏页共用） ---------- */
  function mountChrome(opts) {
    const o = opts || {};
    const bar = qs('[data-chrome="topbar"]');
    if (bar) {
      bar.innerHTML = '';
      bar.appendChild(el('div', { class: 'wrap topbar__inner' }, [
        el('a', { class: 'brand', href: './index.html', title: '回到大厅' }, [
          el('span', { class: 'brand__mark', text: '纹' }),
          el('span', { text: o.title || '墨戏三卷' }),
        ]),
        el('span', { class: 'spacer' }),
        el('span', { class: 'topbar__meta', text: o.meta || 'INKWASH ARCADE' }),
        el('a', { class: 'btn btn--ghost', href: './index.html', style: { padding: '8px 16px', fontSize: '13px' }, text: '大厅' }),
      ]));
    }
    const foot = qs('[data-chrome="footer"]');
    if (foot) {
      foot.className = 'wrap foot';
      foot.innerHTML = '';
      foot.appendChild(el('div', { text: o.footnote || '墨戏五卷 · 故事三卷、题库两卷 · 纯前端离线可玩' }));
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

  window.DSHG = { qs, qsa, el, store, rand, clamp, fmt, toast, mountChrome, swap, countTo };
})();
