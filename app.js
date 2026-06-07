const products = [
  { id: 1, name: "Mariana Red", price: 890, image: "images/mariana-red.png" },
  { id: 2, name: "Mariana White", price: 750, image: "images/mariana-white.png" },
  { id: 3, name: "Mariana Rosé", price: 750, image: "images/mariana-rose.png" },
  { id: 4, name: "Goivo Vinho Verde", price: 690, image: "images/goivo.png" },

  { id: 5, name: "Vale da Mata Red", price: 0, image: "images/vale-da-mata-red.png" },
  { id: 6, name: "Vale da Mata White", price: 0, image: "images/vale-da-mata-white.png" },
  { id: 7, name: "Raio de Luz Red", price: 0, image: "images/raio-de-luz-red.png" },
  { id: 8, name: "Raio de Luz White", price: 0, image: "images/raio-de-luz-white.png" },
  { id: 9, name: "Herdade do Rocim Red", price: 0, image: "images/rocim-red.png" },
  { id: 10, name: "Herdade do Rocim White", price: 0, image: "images/rocim-white.png" },
  { id: 11, name: "Herdade do Rocim Reserva Red", price: 0, image: "images/rocim-reserva-red.png" },
  { id: 12, name: "Herdade do Rocim Alicante Bouschet", price: 0, image: "images/alicante-bouschet.png" }
];

let cart = [];
let selectedQty = {};

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();

  const form = document.getElementById("orderForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const status = document.getElementById("orderStatus");

    status.textContent = "Submitting order...";

    const successSummary = document.getElementById("successSummary");
    successSummary.innerHTML = generateOrderSummaryHTML();

    const formData = new FormData(form);
    formData.append("order", JSON.stringify(cart));

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        form.reset();
        closeCheckout();

        document.getElementById("successModal").classList.add("active");

        cart = [];
        renderCart();
        status.textContent = "";
      } else {
        status.textContent = "Order submission failed.";
      }
    } catch (error) {
      status.textContent = "Connection error.";
    }
  });
});

function renderProducts() {
  const grid = document.getElementById("productGrid");

  if (!grid) return;

  grid.className = "collection-wrap";

  grid.innerHTML = `
    <button class="slider-btn left" onclick="slideCollection(-1)">‹</button>
    <div id="wineSlider" class="slider"></div>
    <button class="slider-btn right" onclick="slideCollection(1)">›</button>
  `;

  const slider = document.getElementById("wineSlider");

  products.forEach(product => {
    const qty = selectedQty[product.id] || 1;
    const priceText = product.price > 0
      ? `${product.price.toLocaleString()} THB`
      : "Price TBC";

    slider.innerHTML += `
      <div class="card">
        <img src="${product.image}" alt="${product.name}">

        <h3>${product.name}</h3>

        <p>Portugal · 2024</p>

        <div class="price">${priceText}</div>

        <div class="product-qty">
          <button onclick="decreaseProductQty(${product.id})">−</button>
          <span>${qty}</span>
          <button onclick="increaseProductQty(${product.id})">+</button>
        </div>

        <button class="primary-btn" onclick="addToCart(${product.id})">
          Add ${qty} To Cart
        </button>
      </div>
    `;
  });
}

function slideCollection(direction) {
  const slider = document.getElementById("wineSlider");

  if (!slider) return;

  slider.scrollBy({
    left: direction * 330,
    behavior: "smooth"
  });
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

  renderProducts();
  renderCart();
  openCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const checkoutItems = document.getElementById("checkoutItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutTotal = document.getElementById("checkoutTotal");
  const cartCount = document.getElementById("cartCount");

  if (!cartItems) return;

  cartItems.innerHTML = "";

  if (checkoutItems) {
    checkoutItems.innerHTML = "";
  }

  let total = 0;
  let count = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.qty;

    total += subtotal;
    count += item.qty;

    const priceText = item.price > 0
      ? `${item.price.toLocaleString()} THB`
      : "Price TBC";

    const subtotalText = item.price > 0
      ? `${subtotal.toLocaleString()} THB`
      : "Price TBC";

    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">

        <div>
          <strong>${item.name}</strong>
          <p>${priceText}</p>

          <div class="qty">
            <button onclick="decrease(${item.id})">−</button>
            <span>${item.qty}</span>
            <button onclick="increase(${item.id})">+</button>
          </div>

          <button class="remove" onclick="removeItem(${item.id})">
            Remove
          </button>
        </div>

        <strong>${subtotalText}</strong>
      </div>
    `;

    if (checkoutItems) {
      checkoutItems.innerHTML += `
        <div class="summary-item">
          <img src="${item.image}" alt="${item.name}">

          <div>
            <strong>${item.name}</strong><br>
            Qty: ${item.qty}
          </div>

          <strong>${subtotalText}</strong>
        </div>
      `;
    }
  });

  if (cartTotal) {
    cartTotal.textContent = `Total: ${total.toLocaleString()} THB`;
  }

  if (checkoutTotal) {
    checkoutTotal.textContent = `Total: ${total.toLocaleString()} THB`;
  }

  if (cartCount) {
    cartCount.textContent = count;
  }
}

function generateOrderSummaryHTML() {
  let total = 0;

  let html = "<h3>Order Summary</h3>";

  cart.forEach(item => {
    const subtotal = item.price * item.qty;

    total += subtotal;

    html += `
      <p>
        <strong>${item.name}</strong><br>
        Qty: ${item.qty}<br>
        ${item.price > 0 ? `${subtotal.toLocaleString()} THB` : "Price TBC"}
      </p>
    `;
  });

  html += `<h3>Total: ${total.toLocaleString()} THB</h3>`;

  return html;
}

function increase(id) {
  const item = cart.find(i => i.id === id);

  if (item) {
    item.qty++;
  }

  renderCart();
}

function decrease(id) {
  const item = cart.find(i => i.id === id);

  if (!item) return;

  if (item.qty > 1) {
    item.qty--;
  } else {
    removeItem(id);
  }

  renderCart();
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function openCart() {
  renderCart();
  document.getElementById("cartModal").classList.add("active");
}

function closeCart() {
  document.getElementById("cartModal").classList.remove("active");
}

function returnToCollection() {
  closeCart();
  window.location.href = "#collection";
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

function closeSuccess() {
  document.getElementById("successModal").classList.remove("active");
}

function goHome() {
  closeSuccess();

  window.location.href = "#home";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
