(function () {
  "use strict";

  const C = window.CONFIG;
  const MENU = window.MENU;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const productos = new Map();
  MENU.forEach((cat) => cat.productos.forEach((p) => productos.set(p.id, p)));

  const money = (n) => C.moneda + " " + n.toLocaleString("es-AR");
  const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-");

  const store = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* sin storage */ }
    },
  };

  // ---------- Marca ----------
  $$("[data-nombre]").forEach((el) => (el.textContent = C.nombre));
  $$("[data-horario]").forEach((el) => (el.textContent = C.horario));
  $$("[data-logo]").forEach((img) => {
    img.alt = C.nombre;
    img.onerror = () => (img.hidden = true);
    img.src = C.logo;
  });
  document.title = C.nombre;

  // ---------- Splash con video ----------
  const splash = $("#splash");
  const video = $("#splash-video");
  let entered = false;

  function enterApp() {
    if (entered) return;
    entered = true;
    $("#app").hidden = false;
    updateCartUI();
    splash.classList.add("is-leaving");
    setTimeout(() => { splash.hidden = true; video.pause(); }, 500);
    try { sessionStorage.setItem("introVisto", "1"); } catch {}
  }

  function noVideo() {
    splash.classList.add("splash--no-video");
    video.hidden = true;
  }

  let introVisto = false;
  try { introVisto = sessionStorage.getItem("introVisto") === "1"; } catch {}

  if (introVisto) {
    splash.hidden = true;
    entered = true;
    $("#app").hidden = false;
  } else {
    video.addEventListener("error", noVideo);
    video.addEventListener("ended", enterApp);
    video.src = C.video;
    const p = video.play();
    if (p && p.catch) p.catch(() => { /* autoplay bloqueado: queda el botón */ });
  }
  $("#splash-enter").addEventListener("click", enterApp);
  $("#splash-skip").addEventListener("click", enterApp);

  // ---------- Menú ----------
  const cart = store.get("carrito", {});
  Object.keys(cart).forEach((id) => { if (!productos.has(id)) delete cart[id]; });

  function renderCats() {
    $("#cats").innerHTML = MENU.map(
      (c, i) => `<button class="chip${i === 0 ? " is-active" : ""}" data-target="cat-${slug(c.categoria)}">${c.categoria}</button>`
    ).join("");
  }

  function qtyControl(id) {
    const n = cart[id] || 0;
    if (!n) return `<div class="qty"><button data-add="${id}" aria-label="Agregar">+</button></div>`;
    return `<div class="qty">
      <button class="minus" data-sub="${id}" aria-label="Quitar uno">−</button>
      <span>${n}</span>
      <button data-add="${id}" aria-label="Agregar uno">+</button>
    </div>`;
  }

  function renderMenu(filtro = "") {
    const q = filtro.trim().toLowerCase();
    const html = MENU.map((cat) => {
      const items = cat.productos.filter(
        (p) => !q || (p.nombre + " " + (p.descripcion || "")).toLowerCase().includes(q)
      );
      if (!items.length) return "";
      return `<section class="menu-section" id="cat-${slug(cat.categoria)}">
        <h2>${cat.categoria}</h2>
        ${items.map((p) => `
          <article class="card">
            ${p.imagen
              ? `<img class="card__img" src="${p.imagen}" alt="${p.nombre}" loading="lazy" />`
              : `<div class="card__img" aria-hidden="true">${p.emoji || "🍴"}</div>`}
            <div class="card__body">
              <h3 class="card__name">${p.nombre}</h3>
              ${p.descripcion ? `<p class="card__desc">${p.descripcion}</p>` : ""}
              <span class="card__price">${money(p.precio)}</span>
            </div>
            <div data-qty="${p.id}">${qtyControl(p.id)}</div>
          </article>`).join("")}
      </section>`;
    }).join("");
    $("#menu").innerHTML = html || `<p class="empty">No encontramos nada con “${filtro}” 😕</p>`;
  }

  $("#cats").addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    const target = document.getElementById(btn.dataset.target);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  // Resalta la categoría visible
  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          $$(".chip").forEach((c) => c.classList.toggle("is-active", c.dataset.target === en.target.id));
          const active = $(".chip.is-active");
          if (active) active.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
        });
      }, { rootMargin: "-70px 0px -70% 0px" })
    : null;
  function observeSections() {
    if (!observer) return;
    observer.disconnect();
    $$(".menu-section").forEach((s) => observer.observe(s));
  }

  $("#search").addEventListener("input", (e) => { renderMenu(e.target.value); observeSections(); });

  // ---------- Carrito ----------
  function change(id, delta) {
    cart[id] = (cart[id] || 0) + delta;
    if (cart[id] <= 0) delete cart[id];
    store.set("carrito", cart);
    $$(`[data-qty="${id}"]`).forEach((el) => (el.innerHTML = qtyControl(id)));
    if (delta > 0) toast(`Agregaste ${productos.get(id).nombre}`);
    updateCartUI();
  }

  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    const sub = e.target.closest("[data-sub]");
    if (add) change(add.dataset.add, 1);
    if (sub) change(sub.dataset.sub, -1);
  });

  const isDelivery = () => $('input[name="entrega"]:checked').value === "delivery";

  function totals() {
    const unidades = Object.values(cart).reduce((a, b) => a + b, 0);
    const subtotal = Object.entries(cart).reduce((s, [id, n]) => s + productos.get(id).precio * n, 0);
    const envio = isDelivery() && unidades ? C.costoEnvio : 0;
    return { unidades, subtotal, envio, total: subtotal + envio };
  }

  function updateCartUI() {
    const t = totals();
    $("#cart-count").textContent = t.unidades;
    $("#cart-fab-total").textContent = money(t.subtotal);
    $("#cart-fab").hidden = !t.unidades || !entered;

    $("#cart-items").innerHTML = t.unidades
      ? Object.entries(cart).map(([id, n]) => {
          const p = productos.get(id);
          return `<div class="cart-line">
            <span class="cart-line__name">${p.nombre}</span>
            <div data-qty="${id}">${qtyControl(id)}</div>
            <span class="cart-line__price">${money(p.precio * n)}</span>
          </div>`;
        }).join("")
      : `<p class="empty">Tu pedido está vacío.<br/>Agregá algo rico 😋</p>`;

    $("#checkout").hidden = !t.unidades;
    $$("[data-delivery-only]").forEach((el) => (el.hidden = !isDelivery()));
    $("#t-sub").textContent = money(t.subtotal);
    $("#t-envio").textContent = money(t.envio);
    $("#t-total").textContent = money(t.total);
  }

  // ---------- Bottom sheet ----------
  const sheet = $("#sheet");
  const backdrop = $("#sheet-backdrop");
  function openSheet() {
    updateCartUI();
    backdrop.hidden = false;
    sheet.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => sheet.classList.add("is-open"));
    document.body.style.overflow = "hidden";
  }
  function closeSheet() {
    sheet.classList.remove("is-open");
    sheet.setAttribute("aria-hidden", "true");
    backdrop.hidden = true;
    document.body.style.overflow = "";
  }
  $("#cart-fab").addEventListener("click", openSheet);
  $("#sheet-close").addEventListener("click", closeSheet);
  backdrop.addEventListener("click", closeSheet);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSheet(); });

  // ---------- Checkout por WhatsApp ----------
  const form = $("#checkout");
  $("#pago").innerHTML = C.mediosDePago.map((m) => `<option>${m}</option>`).join("");

  const datos = store.get("cliente", {});
  ["nombre", "telefono", "direccion"].forEach((k) => { if (datos[k]) form.elements[k].value = datos[k]; });

  form.addEventListener("change", (e) => { if (e.target.name === "entrega") updateCartUI(); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const f = form.elements;
    const t = totals();
    const err = $("#form-error");
    const nombre = f.nombre.value.trim();
    const telefono = f.telefono.value.trim();
    const direccion = f.direccion.value.trim();

    if (!nombre || !telefono) return (err.textContent = "Completá tu nombre y teléfono.");
    if (isDelivery() && !direccion) return (err.textContent = "Completá la dirección de entrega.");
    if (t.subtotal < C.pedidoMinimo) return (err.textContent = `El pedido mínimo es ${money(C.pedidoMinimo)}.`);
    err.textContent = "";

    store.set("cliente", { nombre, telefono, direccion });

    const lineas = Object.entries(cart).map(([id, n]) => {
      const p = productos.get(id);
      return `• ${n} x ${p.nombre} — ${money(p.precio * n)}`;
    });
    const msg = [
      `*Nuevo pedido — ${C.nombre}*`,
      "",
      ...lineas,
      "",
      `Subtotal: ${money(t.subtotal)}`,
      isDelivery() ? `Envío: ${money(t.envio)}` : null,
      `*Total: ${money(t.total)}*`,
      "",
      `👤 ${nombre}`,
      `📞 ${telefono}`,
      isDelivery() ? `🛵 Delivery a: ${direccion}` : "🏠 Retiro en el local",
      `💳 Pago: ${f.pago.value}`,
      f.notas.value.trim() ? `📝 ${f.notas.value.trim()}` : null,
    ].filter((l) => l !== null).join("\n");

    window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  });

  // ---------- Toast ----------
  let toastTimer;
  function toast(text) {
    const el = $("#toast");
    el.textContent = text;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 1400);
  }

  // ---------- Init ----------
  renderCats();
  renderMenu();
  observeSections();
  updateCartUI();
})();
