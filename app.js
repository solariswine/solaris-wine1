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
});

function money(amount) {
  return "฿" + amount.toLocaleString();
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

  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `<p style="color:#9e8e6b;">Your cart is empty.</p>`;
  }

  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    count += item.qty;

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

  if (cartTotal) cartTotal.textContent = money(total);
  if (cartGrandTotal) cartGrandTotal.textContent = money(total);
  if (cartCount) cartCount.textContent = count;
  if (cartItemLabel) cartItemLabel.textContent = count;
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

function slideCollection(direction) {
  const slider = document.getElementById("productGrid");
  if (!slider) return;

  slider.scrollBy({
    left: direction * 350,
    behavior: "smooth"
  });
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
    alert("checkoutModal not found in index.html");
    return;
  }

  checkoutModal.classList.add("active");
}
function openCart() {
  renderCart();
  document.getElementById("cartModal").classList.add("active");
}

function closeCart() {
  document.getElementById("cartModal").classList.remove("active");
}

/* ใส่ตรงนี้ */

function openCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  closeCart();

  const checkoutModal = document.getElementById("checkoutModal");

  if (!checkoutModal) {
    alert("checkoutModal not found");
    return;
  }

  checkoutModal.classList.add("active");
}

function closeCheckout() {
  const checkoutModal = document.getElementById("checkoutModal");

  if (checkoutModal) {
    checkoutModal.classList.remove("active");
  }
}
