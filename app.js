const products = [
  { id: 1, name: "Mariana Red", price: 890, image: "images/mariana-red.png" },
  { id: 2, name: "Mariana White", price: 750, image: "images/mariana-white.png" },
  { id: 3, name: "Mariana Rosé", price: 750, image: "images/mariana-rose.png" },
  { id: 4, name: "Goivo Vinho Verde", price: 690, image: "images/goivo.png" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedQty = {};

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cartCount").textContent = count;
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = products.map(product => {
    const qty = selectedQty[product.id] || 1;

    return `
      <div class="card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Portugal · 2024</p>
        <div class="price">${product.price.toLocaleString()} THB</div>

        <div class="product-qty">
          <button onclick="decreaseProductQty(${product.id})">−</button>
          <span>${qty}</span>
          <button onclick="increaseProductQty(${product.id})">+</button>
        </div>

        <button class="primary-btn" onclick="addToCart(${product.id})">
          Add ${qty} to Cart
        </button>
      </div>
    `;
  }).join("");
}

function increaseProductQty(id) {
  selectedQty[id] = (selectedQty[id] || 1) + 1;
  renderProducts();
}

function decreaseProductQty(id) {
  selectedQty[id] = Math.max(1, (selectedQty[id] || 1) - 1);
  renderProducts();
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const qty = selectedQty[id] || 1;
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }

  selectedQty[id] = 1;

  saveCart();
  renderProducts();
  renderCart();
  openCart();
}

function increase(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;

  saveCart();
  renderCart();
}

function decrease(id) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  if (item.qty > 1) {
    item.qty--;
  } else {
    removeItem(id);
    return;
  }

  saveCart();
  renderCart();
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const checkoutItems = document.getElementById("checkoutItems");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartItems || !checkoutItems || !cartTotal) return;

  cartItems.innerHTML = "";
  checkoutItems.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <strong>${item.name}</strong>
          <p>${item.price.toLocaleString()} THB / bottle</p>

          <div class="qty">
            <button onclick="decrease(${item.id})">−</button>
            <span>${item.qty}</span>
            <button onclick="increase(${item.id})">+</button>
          </div>

          <button class="remove" onclick="removeItem(${item.id})">Remove</button>
        </div>

        <strong>${subtotal.toLocaleString()} THB</strong>
      </div>
    `;

    checkoutItems.innerHTML += `
      <div class="summary-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <strong>${item.name}</strong>
          <p>${item.price.toLocaleString()} THB x ${item.qty}</p>
        </div>
        <strong>${subtotal.toLocaleString()} THB</strong>
      </div>
    `;
  });

  cartTotal.textContent = "Total: " + total.toLocaleString() + " THB";
  updateCartCount();
}

function openCart() {
  renderCart();
  document.getElementById("cartModal").classList.add("active");
}

function closeCart() {
  document.getElementById("cartModal").classList.remove("active");
}

function openCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  renderCart();
  closeCart();
  document.getElementById("checkoutModal").classList.add("active");
}

function closeCheckout() {
  document.getElementById("checkoutModal").classList.remove("active");
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();

  const form = document.getElementById("orderForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const status = document.getElementById("orderStatus");
    status.textContent = "Submitting order...";

    const formData = new FormData(form);
    formData.append("order", JSON.stringify(cart));

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        status.textContent = "Order submitted successfully. Thank you.";
        cart = [];
        saveCart();
        renderCart();
        form.reset();
      } else {
        status.textContent = "Order submission failed. Please try again.";
      }
    } catch (error) {
      status.textContent = "Connection error. Please try again.";
    }
  });
});
