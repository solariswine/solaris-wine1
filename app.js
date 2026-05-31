const STORE_WHATSAPP = "66961644422";
const STORE_LINE_LINK = "https://line.me/R/ti/p/@solariswine";

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartCount = document.getElementById("cartCount");

  if (cartCount) {
    cartCount.innerText = count;
  }
}

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  saveCart();
  renderCart();
  openCart();
}

function increaseQty(index) {
  cart[index].qty += 1;
  saveCart();
  renderCart();
}

function decreaseQty(index) {
  cart[index].qty -= 1;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartItems || !cartTotal) return;

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
    cartTotal.innerText = "0";
    return;
  }

  let html = "";
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    html += `
      <div class="cart-item">
        <strong>${item.name}</strong>
        <div>${item.price.toLocaleString()} THB / bottle</div>
        <div class="qty-row">
          <button onclick="decreaseQty(${index})">−</button>
          <span>${item.qty}</span>
          <button onclick="increaseQty(${index})">+</button>
          <span>= ${subtotal.toLocaleString()} THB</span>
        </div>
        <button onclick="removeItem(${index})" class="remove-btn">Remove</button>
      </div>
    `;
  });

  cartItems.innerHTML = html;
  cartTotal.innerText = total.toLocaleString();
}

function openCart() {
  const drawer = document.getElementById("cartDrawer");
  if (drawer) {
    drawer.style.display = "flex";
  }
}

function closeCart() {
  const drawer = document.getElementById("cartDrawer");
  if (drawer) {
    drawer.style.display = "none";
  }
}

function goCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  window.location.href = "checkout.html";
}

function renderCheckout() {
  const checkoutItems = document.getElementById("checkoutItems");
  const checkoutTotal = document.getElementById("checkoutTotal");

  if (!checkoutItems || !checkoutTotal) return;

  if (cart.length === 0) {
    checkoutItems.innerHTML = "<p>Your cart is empty. Please return to shop.</p>";
    checkoutTotal.innerText = "0";
    return;
  }

  let html = "";
  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    html += `
      <div class="cart-item">
        <strong>${item.name}</strong><br>
        ${item.price.toLocaleString()} THB x ${item.qty}
        = ${subtotal.toLocaleString()} THB
      </div>
    `;
  });

  checkoutItems.innerHTML = html;
  checkoutTotal.innerText = total.toLocaleString();
  generateOrder();
}

function generateOrderNo() {
  const now = new Date();

  const date =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const random = Math.floor(1000 + Math.random() * 9000);

  return `SW-${date}-${random}`;
}

function buildOrderMessage() {
  const name = document.getElementById("customerName")?.value || "";
  const phone = document.getElementById("customerPhone")?.value || "";
  const lineId = document.getElementById("customerLine")?.value || "";
  const whatsapp = document.getElementById("customerWhatsapp")?.value || "";
  const address = document.getElementById("customerAddress")?.value || "";
  const note = document.getElementById("customerNote")?.value || "";

  let itemsText = "";
  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    itemsText += `• ${item.name} x ${item.qty} = ${subtotal.toLocaleString()} THB\n`;
  });

  return `🍷 Solaris Wine Order

Order No: ${generateOrderNo()}

Customer Details:
Name: ${name}
Phone: ${phone}
LINE ID: ${lineId}
WhatsApp: ${whatsapp}

Delivery Address:
${address}

Order:
${itemsText}
Total Amount: ${total.toLocaleString()} THB

Note:
${note}

Please confirm availability and send payment link / QR code.`;
}

function generateOrder() {
  const messageBox = document.getElementById("orderMessage");
  if (!messageBox) return;

  messageBox.value = buildOrderMessage();
}

function copyOrder() {
  generateOrder();

  const messageBox = document.getElementById("orderMessage");
  if (!messageBox) return;

  messageBox.select();
  messageBox.setSelectionRange(0, 99999);

  navigator.clipboard.writeText(messageBox.value)
    .then(() => {
      alert("Order summary copied. Please paste it in LINE or WhatsApp.");
    })
    .catch(() => {
      document.execCommand("copy");
      alert("Order summary copied.");
    });
}

function sendLine() {
  generateOrder();
  copyOrder();

  setTimeout(() => {
    window.open(STORE_LINE_LINK, "_blank");
  }, 300);
}

function sendWhatsApp() {
  generateOrder();

  const messageBox = document.getElementById("orderMessage");
  if (!messageBox) return;

  const message = encodeURIComponent(messageBox.value);
  window.open(`https://wa.me/${STORE_WHATSAPP}?text=${message}`, "_blank");
}

updateCartCount();
renderCart();
