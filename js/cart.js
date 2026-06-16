document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1800);
  }

  const addButtons = document.querySelectorAll(".add-btn");

  addButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productCard = this.closest(".product-card");
      const sellerCard = this.closest(".seller-card");
      let item;

      if (productCard) {
        item = {
          name: productCard.querySelector("h3").innerText,
          price: parseInt(productCard.querySelector(".price").innerText, 10),
          image: productCard.querySelector("img").src,
          qty: parseInt(productCard.querySelector(".qty span").innerText, 10) || 1,
        };
      } else if (sellerCard) {
        item = {
          name: sellerCard.querySelector("h3").innerText,
          price: parseInt(sellerCard.querySelector(".card-price span").innerText, 10),
          image: sellerCard.querySelector("img").src,
          qty: 1,
        };
      }

      if (!item) return;

      const existingItem = cart.find((cartItem) => cartItem.name === item.name);
      if (existingItem) {
        existingItem.qty += item.qty;
      } else {
        cart.push(item);
      }

      saveCart();
      showToast(`${item.name} added to cart`);
      renderCart();
    });
  });

  const orderDetails = document.querySelector(".orderDetails");
  const totalPrice = document.querySelector(".total-price");
  const checkoutLink = document.querySelector(".checkout-link");

  function renderCart() {
    if (!orderDetails) return;

    orderDetails.innerHTML = "";

    if (cart.length === 0) {
      orderDetails.innerHTML = "<p class='empty-cart'>Your cart is empty</p>";
      if (totalPrice) totalPrice.innerHTML = "";
      if (checkoutLink) checkoutLink.style.display = "none";
      return;
    }

    if (checkoutLink) checkoutLink.style.display = "block";

    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.qty;

      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");

      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-img" />
        <div class="info">
          <h3>${item.name}</h3>
          <p class="item-total">${item.price * item.qty} EGP</p>
            <div class="qty-control" aria-label="Quantity controls">
              <button type="button" class="qty-btn decrease" data-index="${index}">-</button>
              <span>${item.qty}</span>
              <button type="button" class="qty-btn increase" data-index="${index}">+</button>
            </div>
        </div>
      `;

      orderDetails.appendChild(itemDiv);
    });

    if (totalPrice) {
      totalPrice.innerHTML = `Total: ${total} EGP`;
    }
  }

  if (orderDetails) {
    orderDetails.addEventListener("click", (e) => {
      const index = Number(e.target.dataset.index);

      if (e.target.classList.contains("increase")) {
        cart[index].qty += 1;
        saveCart();
        renderCart();
      }

      if (e.target.classList.contains("decrease")) {
        cart[index].qty -= 1;
        if (cart[index].qty <= 0) {
          cart.splice(index, 1);
        }
        saveCart();
        renderCart();
      }
    });
  }

  renderCart();
});
