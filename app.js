const products = [
  {
    id: 1,
    name: "Mariana Red",
    price: 890,
    image: "images/mariana-red.png"
  },
  {
    id: 2,
    name: "Mariana White",
    price: 750,
    image: "images/mariana-white.png"
  },
  {
    id: 3,
    name: "Mariana Rosé",
    price: 750,
    image: "images/mariana-rose.png"
  },
  {
    id: 4,
    name: "Goivo Vinho Verde",
    price: 690,
    image: "images/goivo.png"
  }
];

let cart = [];

function addToCart(id) {
  const product = products.find(p => p.id === id);

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      ...product,
      qty: 1
    });
  }

  renderCart();
}

function increase(id) {
  const item = cart.find(i => i.id === id);
  item.qty++;
  renderCart();
}

function decrease(id) {
  const item = cart.find(i => i.id === id);

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

function renderCart() {

  const cartItems = document.getElementById("cartItems");
  const checkoutItems = document.getElementById("checkoutItems");
  const totalElement = document.getElementById("cartTotal");

  if (!cartItems) return;

  cartItems.innerHTML = "";
  checkoutItems.innerHTML = "";

  let total = 0;

  cart.forEach(item => {

    total += item.price * item.qty;

    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}">
        <div>
          <strong>${item.name}</strong>
          <div>฿${item.price}</div>

          <div class="qty">
            <button onclick="decrease(${item.id})">-</button>
            <span>${item.qty}</span>
            <button onclick="increase(${item.id})">+</button>
          </div>

          <button class="remove"
          onclick="removeItem(${item.id})">
          Remove
          </button>
        </div>

        <strong>
          ฿${(item.price * item.qty).toLocaleString()}
        </strong>
      </div>
    `;

    checkoutItems.innerHTML += `
      <div class="summary-item">
        <img src="${item.image}">
        <div>
          ${item.name}
          <br>
          Qty: ${item.qty}
        </div>

        <strong>
        ฿${(item.price * item.qty).toLocaleString()}
        </strong>
      </div>
    `;
  });

  totalElement.innerHTML =
    "Total : ฿" + total.toLocaleString();
}

function openCart() {
  document
    .getElementById("cartModal")
    .classList.add("active");
}

function closeCart() {
  document
    .getElementById("cartModal")
    .classList.remove("active");
}

function openCheckout() {

  if(cart.length === 0){
    alert("Your cart is empty");
    return;
  }

  document
    .getElementById("checkoutModal")
    .classList.add("active");
}

function closeCheckout() {
  document
    .getElementById("checkoutModal")
    .classList.remove("active");
}

document.addEventListener("DOMContentLoaded", () => {

  const form =
    document.getElementById("orderForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const status =
      document.getElementById("orderStatus");

    status.innerHTML =
      "Submitting order...";

    const formData = new FormData(form);

    formData.append(
      "order",
      JSON.stringify(cart)
    );

    try {

      const response = await fetch(
        "/api/order",
        {
          method: "POST",
          body: formData
        }
      );

      if(response.ok){

        status.innerHTML =
          "Order submitted successfully.";

        cart = [];
        renderCart();

        form.reset();

      } else {

        status.innerHTML =
          "Error submitting order.";

      }

    } catch(error){

      status.innerHTML =
        "Connection error.";

    }

  });

});
