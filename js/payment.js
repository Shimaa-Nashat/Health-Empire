document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const itemsContainer = document.querySelector(".items");
  const subtotalEl = document.querySelector(".subtotal p");
  const shippingEl = document.querySelector(".shipping p");
  const totalEl = document.querySelector(".total p");
  const form = document.querySelector(".payment-form");

  const cardNumber = document.querySelector("#card-number");
  const expiryDate = document.querySelector("#expiry-date");
  const cvv = document.querySelector("#cvv");

  function setError(input, errorId, message) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = message;
    input.classList.add("payment-invalid");
    input.classList.remove("payment-valid");
    return false;
  }

  function setSuccess(input, errorId) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = "";
    input.classList.add("payment-valid");
    input.classList.remove("payment-invalid");
    return true;
  }

  function validateCardNumber() {
    const digits = cardNumber.value.replace(/\D/g, "");

    if (!digits) {
      return setError(cardNumber, "card-number-error", "Card number is required");
    }
    if (!/^4\d{15}$/.test(digits)) {
      return setError(cardNumber, "card-number-error", "Visa number must start with 4 and contain 16 digits");
    }

    return setSuccess(cardNumber, "card-number-error");
  }

  function validateExpiryDate() {
    const value = expiryDate.value.trim();

    if (!value) {
      return setError(expiryDate, "expiry-date-error", "Expiry date is required");
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
      return setError(expiryDate, "expiry-date-error", "Use MM/YY format");
    }

    const [month, year] = value.split("/").map(Number);
    const expiry = new Date(2000 + year, month);
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth());

    if (expiry <= currentMonth) {
      return setError(expiryDate, "expiry-date-error", "Card is expired");
    }

    return setSuccess(expiryDate, "expiry-date-error");
  }

  function validateCvv() {
    const value = cvv.value.trim();

    if (!value) {
      return setError(cvv, "cvv-error", "CVV is required");
    }
    if (!/^\d{3}$/.test(value)) {
      return setError(cvv, "cvv-error", "CVV must be 3 digits");
    }

    return setSuccess(cvv, "cvv-error");
  }

  function formatCardNumber() {
    const digits = cardNumber.value.replace(/\D/g, "").slice(0, 16);
    cardNumber.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  }

  function formatExpiryDate() {
    const digits = expiryDate.value.replace(/\D/g, "").slice(0, 4);
    expiryDate.value =
      digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  }

  function renderPayment() {
    if (!itemsContainer) return;

    itemsContainer.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item) => {
      subtotal += item.price * item.qty;

      const div = document.createElement("div");
      div.classList.add("cart-item");

      div.innerHTML = `
        <img src="${item.image}" class="cart-img" alt="${item.name}" />
        <div class="item-info">
          <h4>${item.name}</h4>
          <p>${item.qty} x ${item.price} EGP</p>
        </div>
      `;

      itemsContainer.appendChild(div);
    });

    const shipping = subtotal > 0 ? 50 : 0;
    const total = subtotal + shipping;

    subtotalEl.textContent = `Subtotal: ${subtotal} EGP`;
    shippingEl.textContent = `Shipping: ${shipping} EGP`;
    totalEl.textContent = `Total: ${total} EGP`;
  }

  renderPayment();

  cardNumber.addEventListener("input", () => {
    formatCardNumber();
    validateCardNumber();
  });
  expiryDate.addEventListener("input", () => {
    formatExpiryDate();
    validateExpiryDate();
  });
  cvv.addEventListener("input", validateCvv);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const isPaymentValid =
      validateCardNumber() &&
      validateExpiryDate() &&
      validateCvv();

    if (!isPaymentValid) return;

    alert("Payment successful! Your order has been placed.");
    localStorage.setItem("checkoutCart", JSON.stringify(cart));
    localStorage.removeItem("cart");
    cart = [];
    form.reset();
    window.location.href = "track.html";
  });
});
