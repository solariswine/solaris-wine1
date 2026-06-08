const products = [
  { id: 1, name: "Mariana Red", price: 1090, image: "images/mariana-red.png" },
  { id: 2, name: "Mariana White", price: 990, image: "images/mariana-white.png" },
  { id: 3, name: "Mariana Rosé", price: 990, image: "images/mariana-rose.png" },
  { id: 4, name: "Goivo Vinho Verde", price: 890, image: "images/goivo.png" }
];

let cart = [];
let selectedQty = {};

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
});

function renderProducts() {
  const grid = document.getElementById("productGrid");

  if (!grid) {
    alert("productGrid not found");
    return;
  }

  grid.className = "collection-slider";

  grid.innerHTML = products.map(product => `
    <div class="card">
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Portugal · 2024</p>
      <div class="price">${product.price.toLocaleString()} THB</div>
      <button class="primary-btn">Add To Cart</button>
    </div>
  `).join("");
}

function slideCollection(direction) {
  const slider = document.getElementById("productGrid");
  slider.scrollBy({
    left: direction * 350,
    behavior: "smooth"
  });
}
