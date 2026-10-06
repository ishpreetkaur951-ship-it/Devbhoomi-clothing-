/* =============================================
   DEV BHOOMI CLOTHING — script.js
   ============================================= */

/* ---- Product Data ---- */
const products = [
  // Trending
  { id:1, name:"Ivory Linen Kurta", category:"Men", price:3499, originalPrice:null, badge:"New", img:"https://images.unsplash.com/photo-1594938298603-f8d9a1b0e9e8?w=600&q=80", desc:"A breathable ivory linen kurta with hand-embroidered collar detailing. Perfect for festive occasions.", tags:["trending"] },
  { id:2, name:"Midnight Wrap Dress", category:"Women", price:4299, originalPrice:5499, badge:"Sale", img:"https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80", desc:"A stunning midnight blue wrap dress with cascading fabric. Effortlessly elegant for evenings.", tags:["trending"] },
  { id:3, name:"Block Print Co-ord Set", category:"Women", price:5199, originalPrice:null, badge:"New", img:"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80", desc:"Hand block-printed co-ord set in natural dyes. A tribute to India's artisan heritage.", tags:["trending"] },
  { id:4, name:"Structured Linen Blazer", category:"Men", price:6999, originalPrice:8499, badge:"Sale", img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", desc:"A tailored linen blazer with subtle checks. Impeccable structure meets understated luxury.", tags:["trending"] },
  // Men
  { id:5, name:"Cotton Nehru Jacket", category:"Men", price:4599, originalPrice:null, badge:"New", img:"https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80", desc:"A heritage-inspired Nehru jacket in fine cotton. A wardrobe cornerstone for the modern Indian man.", tags:["men"] },
  { id:6, name:"Cream Churidar Set", category:"Men", price:5899, originalPrice:null, badge:null, img:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80", desc:"Classic cream churidar with a beautifully embroidered kurta. Timeless festive elegance.", tags:["men"] },
  { id:7, name:"Indigo Bandhgala Suit", category:"Men", price:11999, originalPrice:14999, badge:"Sale", img:"https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80", desc:"A bespoke-inspired indigo bandhgala suit for the discerning gentleman.", tags:["men"] },
  { id:8, name:"Linen Trousers", category:"Men", price:2999, originalPrice:null, badge:null, img:"https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80", desc:"Relaxed linen trousers in warm sand. The foundation of a refined summer wardrobe.", tags:["men"] },
  // Women
  { id:9, name:"Floral Anarkali Kurta", category:"Women", price:6499, originalPrice:null, badge:"New", img:"https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80", desc:"A flowing Anarkali kurta in hand-painted floral motifs. Grace in every movement.", tags:["women"] },
  { id:10, name:"Chikankari Kurti", category:"Women", price:3799, originalPrice:4599, badge:"Sale", img:"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&q=80", desc:"Delicate Lucknowi Chikankari embroidery on fine cotton. A love letter to Indian craft.", tags:["women"] },
  { id:11, name:"Silk Saree Blouse Set", category:"Women", price:8999, originalPrice:null, badge:"New", img:"https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80", desc:"Pure silk saree with a contemporary blouse. Traditional luxury reimagined for today.", tags:["women"] },
  { id:12, name:"Palazzo & Kaftan Set", category:"Women", price:4999, originalPrice:null, badge:null, img:"https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=80", desc:"Breezy palazzo trousers with a kaftan top. Effortless bohemian luxury for warm evenings.", tags:["women"] },
];

/* ---- State ---- */
let cart = JSON.parse(localStorage.getItem("db_cart")) || [];
let currentSlide = 0;
let slideInterval;
let selectedSize = null;
let quickViewProduct = null;

/* ---- Loader ---- */
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loader").classList.add("hidden");
  }, 2000);
});

/* ---- Init ---- */
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartCount();
  initSlider();
  initReveal();
  initDarkMode();
  initNavScroll();
});

/* ---- Render Products ---- */
function renderProducts() {
  const trending = products.filter(p => p.tags.includes("trending"));
  const men = products.filter(p => p.tags.includes("men"));
  const women = products.filter(p => p.tags.includes("women"));

  document.getElementById("trendingGrid").innerHTML = trending.map(productCard).join("");
  document.getElementById("menGrid").innerHTML = men.map(productCard).join("");
  document.getElementById("womenGrid").innerHTML = women.map(productCard).join("");
}

function productCard(p) {
  const badgeHtml = p.badge
    ? `<span class="product-badge ${p.badge === "Sale" ? "sale" : ""}">${p.badge}</span>`
    : "";
  const priceHtml = p.originalPrice
    ? `<span class="original">₹${p.originalPrice.toLocaleString("en-IN")}</span><span class="sale-price">₹${p.price.toLocaleString("en-IN")}</span>`
    : `₹${p.price.toLocaleString("en-IN")}`;

  return `
    <div class="product-card" data-id="${p.id}">
      <div class="product-img">
        ${badgeHtml}
        <img src="${p.img}" alt="${p.name}" loading="lazy"/>
        <div class="product-actions">
          <button class="btn-quick" onclick="openQuickView(${p.id})">Quick View</button>
          <button class="btn-cart-small" onclick="addToCart(${p.id},event)">Add to Cart</button>
        </div>
      </div>
      <div class="product-info">
        <p class="product-category">${p.category}</p>
        <p class="product-name">${p.name}</p>
        <p class="product-price">${priceHtml}</p>
      </div>
    </div>`;
}

/* ---- Cart Logic ---- */
function addToCart(id, e) {
  if (e) e.stopPropagation();
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  updateCartCount();
  showToast(`${product.name} added to cart`);
  animateCartIcon();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  updateCartCount();
  renderCartDrawer();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else { saveCart(); renderCartDrawer(); updateCartCount(); }
}

function saveCart() {
  localStorage.setItem("db_cart", JSON.stringify(cart));
}

function updateCartCount() {
  const total = cart.reduce((sum, i) => sum + i.qty, 0);
  document.getElementById("cartCount").textContent = total;
}

function animateCartIcon() {
  const count = document.getElementById("cartCount");
  count.classList.add("bump");
  setTimeout(() => count.classList.remove("bump"), 300);
}

/* ---- Cart Drawer ---- */
function renderCartDrawer() {
  const el = document.getElementById("cartItems");
  const footer = document.getElementById("cartFooter");

  if (cart.length === 0) {
    el.innerHTML = `<div class="cart-empty">Your cart is empty</div>`;
    footer.innerHTML = "";
    return;
  }

  el.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}"/>
      <div>
        <p class="ci-name">${item.name}</p>
        <p class="ci-price">₹${item.price.toLocaleString("en-IN")}</p>
        <div class="ci-qty">
          <button onclick="changeQty(${item.id},-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id},1)">+</button>
        </div>
      </div>
      <span class="ci-remove" onclick="removeFromCart(${item.id})">✕</span>
    </div>`).join("");

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  footer.innerHTML = `
    <div class="cart-total">
      <span>Total</span>
      <span>₹${total.toLocaleString("en-IN")}</span>
    </div>
    <button class="btn-primary" style="width:100%;text-align:center" onclick="showToast('Checkout coming soon!')">Proceed to Checkout</button>`;
}

document.getElementById("cartToggle").addEventListener("click", () => {
  renderCartDrawer();
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("show");
  document.body.style.overflow = "hidden";
});

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("show");
  document.body.style.overflow = "";
}

/* ---- Quick View Modal ---- */
function openQuickView(id) {
  const p = products.find(p => p.id === id);
  if (!p) return;
  quickViewProduct = p;

  const priceHtml = p.originalPrice
    ? `<span class="original" style="text-decoration:line-through;margin-right:.5rem;color:var(--muted)">₹${p.originalPrice.toLocaleString("en-IN")}</span><span style="color:var(--accent)">₹${p.price.toLocaleString("en-IN")}</span>`
    : `₹${p.price.toLocaleString("en-IN")}`;

  document.getElementById("modalBody").innerHTML = `
    <div class="modal-img">
      <img src="${p.img}" alt="${p.name}"/>
    </div>
    <div class="modal-info">
      <p class="modal-cat">${p.category}</p>
      <h2 class="modal-name">${p.name}</h2>
      <p class="modal-price">${priceHtml}</p>
      <p class="modal-desc">${p.desc}</p>
      <p style="font-size:.68rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:.75rem;color:var(--muted)">Select Size</p>
      <div class="modal-sizes">
        ${["XS","S","M","L","XL","XXL"].map(s =>
          `<button class="size-btn" onclick="selectSize('${s}',this)">${s}</button>`
        ).join("")}
      </div>
      <button class="btn-primary" style="width:100%" onclick="addToCart(${p.id});closeModal()">Add to Cart</button>
    </div>`;

  document.getElementById("productModal").classList.add("open");
  document.getElementById("modalOverlay").classList.add("show");
  document.body.style.overflow = "hidden";
}

function selectSize(s, btn) {
  document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  selectedSize = s;
}

function closeModal() {
  document.getElementById("productModal").classList.remove("open");
  document.getElementById("modalOverlay").classList.remove("show");
  document.body.style.overflow = "";
}

/* ---- Hero Slider ---- */
function initSlider() {
  slideInterval = setInterval(() => advanceSlide(), 5000);
}

function advanceSlide() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".dot");
  slides[currentSlide].classList.remove("active");
  dots[currentSlide].classList.remove("active");
  currentSlide = (currentSlide + 1) % slides.length;
  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");
}

function goSlide(index) {
  clearInterval(slideInterval);
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".dot");
  slides[currentSlide].classList.remove("active");
  dots[currentSlide].classList.remove("active");
  currentSlide = index;
  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");
  slideInterval = setInterval(() => advanceSlide(), 5000);
}

/* ---- Dark Mode ---- */
function initDarkMode() {
  const saved = localStorage.getItem("db_theme");
  if (saved === "dark") applyDark();

  document.getElementById("darkToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("db_theme", isDark ? "dark" : "light");
    document.getElementById("moonIcon").style.display = isDark ? "none" : "";
    document.getElementById("sunIcon").style.display = isDark ? "" : "none";
  });
}

function applyDark() {
  document.body.classList.add("dark-mode");
  document.getElementById("moonIcon").style.display = "none";
  document.getElementById("sunIcon").style.display = "";
}

/* ---- Navbar Scroll ---- */
function initNavScroll() {
  window.addEventListener("scroll", () => {
    const nav = document.getElementById("navbar");
    nav.classList.toggle("scrolled", window.scrollY > 50);
    document.getElementById("backTop").classList.toggle("show", window.scrollY > 500);
  });
}

/* ---- Mobile Menu ---- */
document.getElementById("hamburger").addEventListener("click", () => {
  const open = document.getElementById("navLinks").classList.toggle("open");
  document.getElementById("hamburger").classList.toggle("open", open);
  document.getElementById("navOverlay").classList.toggle("show", open);
});

function closeMenu() {
  document.getElementById("navLinks").classList.remove("open");
  document.getElementById("hamburger").classList.remove("open");
  document.getElementById("navOverlay").classList.remove("show");
}

/* Close menu on nav link click */
document.querySelectorAll(".nav-links a").forEach(a => {
  a.addEventListener("click", closeMenu);
});

/* ---- Search ---- */
document.getElementById("searchToggle").addEventListener("click", () => {
  document.getElementById("searchBar").classList.toggle("open");
  if (document.getElementById("searchBar").classList.contains("open")) {
    document.getElementById("searchInput").focus();
  }
});

function closeSearch() {
  document.getElementById("searchBar").classList.remove("open");
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeSearch(); closeCart(); closeModal(); }
});

/* ---- Scroll Reveal ---- */
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

/* ---- Toast ---- */
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2800);
}

/* ---- Newsletter ---- */
function subscribeNewsletter(e) {
  e.preventDefault();
  showToast("Welcome to the inner circle! ✨");
  e.target.reset();
}

/* ---- Contact ---- */
function submitContact(e) {
  e.preventDefault();
  showToast("Message sent! We'll be in touch soon.");
  e.target.reset();
}

/* ---- Back to Top ---- */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ---- Search Filter (live) ---- */
document.getElementById("searchInput").addEventListener("input", function () {
  const query = this.value.toLowerCase().trim();
  if (!query) {
    renderProducts();
    return;
  }
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query)
  );
  const html = filtered.length
    ? filtered.map(productCard).join("")
    : `<p style="color:var(--muted);font-size:.9rem;grid-column:1/-1">No products found for "${query}"</p>`;

  document.getElementById("trendingGrid").innerHTML = html;
  document.getElementById("menGrid").innerHTML = "";
  document.getElementById("womenGrid").innerHTML = "";
});
