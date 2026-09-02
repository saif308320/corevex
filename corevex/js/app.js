(function () {
  const KEY = "corevex_cart_v1";
  const PRODUCTS = {
    "pro-15": { id: "pro-15", name: "Corevex Pro 15", base: 2299, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80" },
    "forge-17": { id: "forge-17", name: "Corevex Forge 17", base: 2799, img: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80" },
    "pulse-14": { id: "pulse-14", name: "Corevex Pulse 14", base: 1899, img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80" },
    "apex-16": { id: "apex-16", name: "Corevex Apex 16", base: 2499, img: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80" },
    "studio-x": { id: "studio-x", name: "Corevex Studio X", base: 2599, img: "https://images.unsplash.com/photo-1517059224940-d4af9eec41e5?auto=format&fit=crop&w=1200&q=80" },
    "field-13": { id: "field-13", name: "Corevex Field 13", base: 1699, img: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?auto=format&fit=crop&w=1200&q=80" }
  };
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  const save = (c) => localStorage.setItem(KEY, JSON.stringify(c));
  const money = (n) => "$" + n.toLocaleString("en-US");
  const count = () => load().reduce((s, i) => s + i.qty, 0);
  const total = () => load().reduce((s, i) => s + i.price * i.qty, 0);
  function add(item) {
    const cart = load();
    const key = item.id + "|" + (item.config || "");
    const f = cart.find((x) => x.key === key);
    if (f) f.qty += item.qty || 1;
    else cart.push({ key, id: item.id, name: item.name, config: item.config || "Base", price: item.price, img: item.img, qty: item.qty || 1 });
    save(cart); render();
  }
  function updateQty(key, qty) { save(load().map((i) => i.key === key ? { ...i, qty: Math.max(1, qty) } : i)); render(); if (window.renderCartPage) window.renderCartPage(); }
  function remove(key) { save(load().filter((i) => i.key !== key)); render(); if (window.renderCartPage) window.renderCartPage(); }
  function clear() { save([]); render(); }
  function openDrawer() { document.getElementById("drawer")?.classList.add("on"); document.getElementById("drawerBg")?.classList.add("on"); }
  function closeDrawer() { document.getElementById("drawer")?.classList.remove("on"); document.getElementById("drawerBg")?.classList.remove("on"); }
  function render() {
    document.querySelectorAll("[data-cart-count]").forEach((e) => e.textContent = count());
    const b = document.getElementById("drawerBody");
    if (b) {
      const c = load();
      b.innerHTML = c.length ? c.map((i) => `<div style="display:grid;grid-template-columns:72px 1fr auto;gap:10px;margin-bottom:14px"><img src="${i.img}" alt="${i.name}" style="width:72px;height:54px;object-fit:cover;border-radius:8px"><div><strong>${i.name}</strong><div style="color:var(--muted);font-size:12px">${i.config}</div>${money(i.price)} × ${i.qty}</div><button class="btn btn-g" data-rm="${i.key}">x</button></div>`).join("") : "<p style='color:var(--muted)'>Your cart is empty.</p>";
      b.querySelectorAll("[data-rm]").forEach((x) => x.onclick = () => remove(x.dataset.rm));
    }
    const t = document.getElementById("drawerTotal");
    if (t) t.textContent = money(total());
  }
  window.CVX = { PRODUCTS, load, add, updateQty, remove, clear, money, count, total, render, openDrawer, closeDrawer };
  document.addEventListener("DOMContentLoaded", () => {
    render();
    document.getElementById("menuToggle")?.addEventListener("click", () => document.getElementById("menu")?.classList.toggle("open"));
    document.querySelectorAll("[data-open-cart]").forEach((b) => b.onclick = openDrawer);
    document.getElementById("drawerBg")?.addEventListener("click", closeDrawer);
    document.getElementById("drawerClose")?.addEventListener("click", closeDrawer);
    document.querySelectorAll("[data-add]").forEach((btn) => {
      btn.onclick = () => {
        const p = PRODUCTS[btn.getAttribute("data-add")];
        if (!p) return;
        add({ id: p.id, name: p.name, price: p.base, img: p.img, qty: 1, config: "Base" });
        openDrawer();
      };
    });
  });
})();
