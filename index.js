// ==============================
// Vrimela Blooms - Starter JS
// ==============================

// Helpers
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ---- CART (localStorage) ----
const CART_KEY = "vrimela_cart";

function getCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const countEl = $("#cartCount");
    if (!countEl) return;

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    countEl.textContent = String(totalQty);
}

function addToCart(item) {
    const cart = getCart();
    const found = cart.find((x) => x.name === item.name);

    if (found) {
        found.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }

    saveCart(cart);
    updateCartCount();
    showToast(`${item.name} added to cart`);
}

// ---- TOAST (small popup message) ----
function showToast(message) {
    let toast = $("#toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.style.position = "fixed";
        toast.style.bottom = "18px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.padding = "12px 16px";
        toast.style.borderRadius = "14px";
        toast.style.background = "rgba(20,20,20,0.92)";
        toast.style.color = "#fff";
        toast.style.fontSize = "14px";
        toast.style.zIndex = "9999";
        toast.style.opacity = "0";
        toast.style.transition = "opacity 200ms ease";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = "1";

    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
        toast.style.opacity = "0";
    }, 1600);
}

// ---- ADD TO CART BUTTONS ----
function wireAddToCartButtons() {
    const buttons = $$(".add-to-cart");
    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const name = btn.dataset.name || "Bouquet";
            const price = Number(btn.dataset.price || "0");

            addToCart({ name, price });
        });
    });
}

// ---- NEWSLETTER FORM (optional) ----
// If you have <form id="newsletterForm"> with <input id="email">
function wireNewsletterForm() {
    const form = $("#newsletterForm");
    const email = $("#email");

    if (!form || !email) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const value = email.value.trim();
        if (!value || !value.includes("@")) {
            showToast("Please enter a valid email");
            return;
        }

        email.value = "";
        showToast("Thanks for joining! 💐");
    });
}

// ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
// If your nav links are like <a href="#best">Best Sellers</a>
function enableSmoothScroll() {
    $$('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (e) => {
            const id = link.getAttribute("href");
            const target = $(id);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
}

// ---- INIT ----
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    wireAddToCartButtons();
    wireNewsletterForm();
    enableSmoothScroll();
});