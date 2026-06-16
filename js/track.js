    /* Animate timeline progress bar on load */
    document.addEventListener("DOMContentLoaded", () => {
      
    });

    document.addEventListener("DOMContentLoaded", () => {
  const order = JSON.parse(localStorage.getItem("checkoutCart")) || [];
  const mealSummary = document.querySelector(".meal-summary");

  if (!mealSummary) return;

  mealSummary.innerHTML = "";

  if (order.length === 0) {
    mealSummary.innerHTML = "<p>No order found</p>";
    return;
  }

  order.forEach((item) => {
    mealSummary.innerHTML += `
      <div class="meal-item">
        <img src="${item.image}" class="cart-img" alt="${item.name}" />

        <div>
          <p class="meal-name">${item.name}</p>
          <p class="meal-desc">${item.qty} × ${item.price} EGP</p>
          <p class="meal-price">EGP ${item.price * item.qty}</p>
        </div>
      </div>
    `;
  });
});