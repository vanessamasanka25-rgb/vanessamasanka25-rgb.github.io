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
    if (totalQty === 0) {

        countEl.textContent = "";
    } else {

        countEl.textContent = totalQty;
    }
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

$$(".add - to - cart").forEach((button) => {
    button.addEventListener("click", () => {
        const product = button.closest(".product");
        const sizeSelect = product.querySelector(".size-select");

        const item = {
            name: button.dataset.name,
            size: sizeSelect ? sizeSelect.value : "Standard"
        };

        addToCart(item);

    });
});

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
            const product = btn.closest(".product");
            const sizeSelect = product.querySelector(".size-select");

            const name = btn.dataset.name || "Bouquet";
            const price = Number(btn.dataset.price || "0");
            const size = sizeSelect ? sizeSelect.value : "Standard";

            addToCart({ name, price });

            window.location.href = "cart.html";
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

const cartModal = document.getElementById("cartModal");
const closeCartModal = document.getElementById("closeCartModal");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const modalImage = document.getElementById("modalImage");
const modalSize = document.getElementById("modalSize");
const modalQty = document.getElementById("modalQty");
const confirmAddToCart = document.getElementById("confirmAddToCart");

let selectedProduct = null;

document.querySelectorAll(".quick-cart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        selectedProduct = {
            name: btn.dataset.name,
            price: Number(btn.dataset.price),
            image: btn.dataset.image
        };

        modalTitle.textContent = selectedProduct.name;
        modalPrice.textContent = `From $${selectedProduct.price}`;
        modalImage.src = selectedProduct.image;
        modalImage.alt = selectedProduct.name;
        modalQty.value = 1;

        cartModal.classList.add("active");
    });
});

closeCartModal.addEventListener("click", () => {
    cartModal.classList.remove("active");
});

cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) {
        cartModal.classList.remove("active");
    }
});

confirmAddToCart.addEventListener("click", () => {
    if (!selectedProduct) return;

    const item = {
        name: selectedProduct.name,
        price: selectedProduct.price,
        size: modalSize.value,
        qty: Number(modalQty.value)
    };

    addToCart(item);
    cartModal.classList.remove("active");
    window.location.href = "cart.html";
});
// ---- INIT ----
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    wireAddToCartButtons();
    wireNewsletterForm();
    enableSmoothScroll();
});

const CART_KEY = "vrimela_cart";

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function renderCart() {
    const cart = getCart();
    const cartContainer = document.getElementById("cartItems");
    const totalEl = document.getElementById("cartTotal");

    if (!cartContainer) return;

    cartContainer.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        const itemTotal = item.price * item.qty;
        total += itemTotal;

        const div = document.createElement("div");

        div.className = "cart-item";

        div.innerHTML = `
      <div class="cart-item-row">

        <div>
          <h3>${item.name}</h3>
          <p>${item.size}</p>
        </div>

        <div>
          $${item.price} × ${item.qty}
        </div>

        <button onclick="removeItem(${index})">
          Remove
        </button>

      </div>
    `;

        cartContainer.appendChild(div);

    });

    totalEl.textContent = total.toFixed(2);
}

function removeItem(index) {
    const cart = getCart();

    cart.splice(index, 1);

    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    renderCart();
}

renderCart();