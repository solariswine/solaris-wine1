const products = [
  { id: 1, name: "Mariana Red 2024", price: 1090, image: "images/mariana-red.png" },
  { id: 2, name: "Mariana White 2024", price: 990, image: "images/mariana-white.png" },
  { id: 3, name: "Mariana Rosé 2024", price: 990, image: "images/mariana-rose.png" },
  { id: 4, name: "Goivo Vinho Verde 2024", price: 890, image: "images/goivo.png" },
  { id: 5, name: "Vale da Mata Red 2024", price: 1190, image: "images/vale-da-mata-red.png" },
  { id: 6, name: "Vale da Mata White 2024", price: 1050, image: "images/vale-da-mata-white.png" },
  { id: 7, name: "Raio de Luz Red 2024", price: 1190, image: "images/raio-de-luz-red.png" },
  { id: 8, name: "Raio de Luz White 2024", price: 1050, image: "images/raio-de-luz-white.png" },
  { id: 9, name: "Herdade do Rocim Red 2024", price: 1290, image: "images/rocim-red.png" },
  { id: 10, name: "Herdade do Rocim White 2024", price: 1150, image: "images/rocim-white.png" },
  { id: 11, name: "Herdade do Rocim Reserva Red 2023", price: 1490, image: "images/rocim-reserva-red.png" },
  { id: 12, name: "Herdade do Rocim Alicante Bouschet 2023", price: 1390, image: "images/alicante-bouschet.png" }
];

let selectedQty = {};
let cart = [];

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();

  const form = document.getElementById("orderForm");
  if (form) form.addEventListener("submit", submitOrder);
});

function money(amount) {
  return "฿" + amount.toLocaleString();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.className = "collection-slider";
  grid.innerHTML = "";

  products.forEach(product => {
    const qty = selectedQty[product.id] || 1;

    grid.innerHTML += `
      <div class="card">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Portugal</p>
        <div class="price">${money(product.price)}</div>

        <div class="product-qty">
          <button onclick="decreaseProductQty(${product.id})">−</button>
          <span>${qty}</span>
          <button onclick="increaseProductQty(${product.id})">+</button>
        </div>

        <button class="primary-btn full" onclick="addToCart(${product.id})">
          Add ${qty} To Cart
        </button>
      </div>
    `;
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
  const cartTotal = document.getElementById("cartTotal");
  const cartGrandTotal = document.getElementById("cartGrandTotal");
  const cartCount = document.getElementById("cartCount");
  const cartItemLabel = document.getElementById("cartItemLabel");

  if (!cartItems) return;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `<p style="color:#9e8e6b;">Your cart is empty.</p>`;
  }

  cart.forEach(item => {
    const subtotal = item.price * item.qty;

    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">

        <div>
          <strong>${item.name}</strong>
          <p>${money(item.price)} / bottle</p>

          <div class="qty">
            <button onclick="decreaseCartQty(${item.id})">−</button>
            <span>${item.qty}</span>
            <button onclick="increaseCartQty(${item.id})">+</button>
          </div>

          <button class="remove" onclick="removeFromCart(${item.id})">
            Remove
          </button>
        </div>

        <strong>${money(subtotal)}</strong>
      </div>
    `;
  });

  const total = getCartTotal();
  const count = getCartCount();

  if (cartTotal) cartTotal.textContent = money(total);
  if (cartGrandTotal) cartGrandTotal.textContent = money(total);
  if (cartCount) cartCount.textContent = count;
  if (cartItemLabel) cartItemLabel.textContent = count;

  renderCheckoutSummary();
}

function renderCheckoutSummary() {
  const total = getCartTotal();
  const totalText = money(total);

  const ids = [
    "checkoutTotalDetails",
    "checkoutTotalPayment",
    "checkoutTotalFinal",
    "cartTotal",
    "cartGrandTotal"
  ];

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = totalText;
  });

  const html = cart.map(item => {
    const subtotal = item.price * item.qty;

    return `
      <div class="summary-item">
        <div style="display:flex; align-items:center; gap:14px;">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <strong>${item.name}</strong><br>
            <small>${item.qty} bottle(s)</small>
          </div>
        </div>
        <strong>${money(subtotal)}</strong>
      </div>
    `;
  }).join("");

  const detailsBox = document.getElementById("checkoutItemsDetails");
  const paymentBox = document.getElementById("checkoutItemsPayment");

  if (detailsBox) detailsBox.innerHTML = html;
  if (paymentBox) paymentBox.innerHTML = html;
}

function increaseCartQty(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  renderCart();
}

function decreaseCartQty(id) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  if (item.qty > 1) {
    item.qty--;
  } else {
    removeFromCart(id);
    return;
  }

  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function clearCart() {
  cart = [];
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

  closeCart();
  renderCheckoutSummary();
  goToDetailsStep();

  const checkoutModal = document.getElementById("checkoutModal");

  if (!checkoutModal) {
    alert("checkoutModal not found");
    return;
  }

  checkoutModal.classList.add("active");
}

function closeCheckout() {
  const checkoutModal = document.getElementById("checkoutModal");
  if (checkoutModal) checkoutModal.classList.remove("active");
}

function goToDetailsStep() {
  const stepDetails = document.getElementById("checkoutStepDetails");
  const stepPayment = document.getElementById("checkoutStepPayment");

  if (stepDetails) stepDetails.classList.add("active");
  if (stepPayment) stepPayment.classList.remove("active");

  const dot1 = document.getElementById("stepDot1");
  const dot2 = document.getElementById("stepDot2");
  const dot3 = document.getElementById("stepDot3");

  if (dot1) dot1.classList.add("active");
  if (dot2) dot2.classList.remove("active");
  if (dot3) dot3.classList.remove("active");

  renderCheckoutSummary();
}

function goToPaymentStep() {
  const form = document.getElementById("orderForm");

  const name = form.elements["name"].value.trim();
  const phone = form.elements["phone"].value.trim();
  const email = form.elements["email"].value.trim();
  const address = form.elements["address"].value.trim();

  if (!name || !phone || !email || !address) {
    alert("Please complete name, phone, email and delivery address.");
    return;
  }

  document.getElementById("checkoutStepDetails").classList.remove("active");
  document.getElementById("checkoutStepPayment").classList.add("active");

  document.getElementById("stepDot1").classList.add("active");
  document.getElementById("stepDot2").classList.add("active");
  document.getElementById("stepDot3").classList.remove("active");

  renderCheckoutSummary();
}

function generateOrderReference() {
  const now = new Date();

  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const random = Math.floor(1000 + Math.random() * 9000);

  return `SW-${date}-${random}`;
}

function generateSuccessSummaryHTML() {
  const total = getCartTotal();

  const list = cart.map(item => {
    const subtotal = item.price * item.qty;

    return `
      <div class="summary-item">
        <div style="display:flex; align-items:center; gap:14px;">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <strong>${item.name}</strong><br>
            <small>${item.qty} bottle(s)</small>
          </div>
        </div>
        <strong>${money(subtotal)}</strong>
      </div>
    `;
  }).join("");

  return `
    <h3>Order Summary</h3>
    ${list}
    <div class="summary-total">
      <span>Total</span>
      <strong>${money(total)}</strong>
    </div>
  `;
}

async function submitOrder(e) {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  const status = document.getElementById("orderStatus");
  status.textContent = "Submitting order...";

  const form = document.getElementById("orderForm");
  const formData = new FormData(form);

  const orderRef = generateOrderReference();

  document.getElementById("successOrderRef").textContent = orderRef;
  document.getElementById("successSummary").innerHTML = generateSuccessSummaryHTML();

  formData.append("order", JSON.stringify(cart));
  formData.append("orderRef", orderRef);

  try {
    const response = await fetch("/api/order", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      status.textContent = "Order submission failed.";
      return;
    }

    closeCheckout();
    document.getElementById("successModal").classList.add("active");

    cart = [];
    selectedQty = {};
    form.reset();
    renderProducts();
    renderCart();
    status.textContent = "";

  } catch (error) {
    console.error(error);
    status.textContent = "Connection error.";
  }
}

function closeSuccess() {
  const successModal = document.getElementById("successModal");
  if (successModal) successModal.classList.remove("active");
}

function goHome() {
  closeSuccess();
  window.location.href = "#home";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function slideCollection(direction) {
  const slider = document.getElementById("productGrid");
  if (!slider) return;

  slider.scrollBy({
    left: direction * 350,
    behavior: "smooth"
  });
}
