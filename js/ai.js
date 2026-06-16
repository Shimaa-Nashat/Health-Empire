document.addEventListener("DOMContentLoaded", () => {
  const fab = document.getElementById("ai-fab");
  const modal = document.getElementById("chat-modal");
  const closeBtn = document.getElementById("close-chat");
  const messages = document.getElementById("messages");
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");

  if (!fab || !modal || !closeBtn || !messages || !input || !sendBtn) {
    return;
  }

  const quickQuestions = [
    "Suggest a healthy meal",
    "How many calories?",
    "Protein meal",
    "Track my order",
  ];

  const pageName = location.pathname.split("/").pop().toLowerCase();

  fab.setAttribute("aria-label", "Open NutriBot assistant");
  closeBtn.setAttribute("aria-label", "Close NutriBot assistant");
  modal.setAttribute("aria-hidden", "true");

  function addMessage(text, type) {
    const msg = document.createElement("div");
    msg.className = `msg ${type}`;
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  function addQuickReplies() {
    if (modal.querySelector(".quick-replies")) return;

    const quickReplies = document.createElement("div");
    quickReplies.className = "quick-replies";

    quickQuestions.forEach((question) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.textContent = question;
      chip.addEventListener("click", () => {
        input.value = question;
        sendMessage();
      });
      quickReplies.appendChild(chip);
    });

    messages.after(quickReplies);
  }

  function openChat() {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    fab.classList.add("active");
    input.focus();
  }

  function closeChat() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    fab.classList.remove("active");
  }

  function toggleChat() {
    if (modal.classList.contains("active")) {
      closeChat();
    } else {
      openChat();
    }
  }

  function getPageReply() {
    if (pageName.includes("menu")) {
      return "You are on the menu page. Try searching by meal name or category, then add your meal to the cart.";
    }
    if (pageName.includes("cart")) {
      return "You can review quantities in the cart, then continue to checkout when everything looks right.";
    }
    if (pageName.includes("doctor")) {
      return "Doctors can help with nutrition, health conditions, and safe diet planning.";
    }
    if (pageName.includes("coach")) {
      return "Coaches can help with training plans, consistency, and fitness goals.";
    }
    if (pageName.includes("track")) {
      return "Use the tracking page to check order status, driver info, and estimated delivery time.";
    }
    if (pageName.includes("payment")) {
      return "On payment, review your details carefully before completing checkout.";
    }
    return "I can help you pick meals, understand calories, and plan healthier choices.";
  }

  function getReply(userText) {
    const text = userText.toLowerCase();

    if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
      return "Hi! I am NutriBot. Ask me about meals, calories, protein, coaches, doctors, or orders.";
    }
    if (text.includes("meal") || text.includes("food") || text.includes("diet")) {
      return "A balanced meal should include protein, smart carbs, vegetables, and a moderate healthy fat source.";
    }
    if (text.includes("calorie") || text.includes("kcal")) {
      return "For fat loss, keep calories slightly below your daily needs. Avoid crash diets; steady progress works better.";
    }
    if (text.includes("protein") || text.includes("muscle")) {
      return "For muscle goals, choose protein-rich meals, train consistently, drink water, and sleep well.";
    }
    if (text.includes("weight") || text.includes("lose")) {
      return "Start with smaller portions, more vegetables, enough protein, and regular movement. Keep it realistic.";
    }
    if (text.includes("cart") || text.includes("checkout")) {
      return "Open the cart to review your meals and quantities before checkout.";
    }
    if (text.includes("doctor")) {
      return "Visit the Doctors page if you need medical or nutrition guidance before changing your diet.";
    }
    if (text.includes("coach") || text.includes("workout")) {
      return "Visit the Coaches page for training help and fitness planning.";
    }
    if (text.includes("track") || text.includes("order") || text.includes("delivery")) {
      return "Go to the tracking page to follow your order status and estimated arrival.";
    }
    if (text.includes("page") || text.includes("help")) {
      return getPageReply();
    }

    return "I can help with healthy meals, calories, protein, weight goals, doctors, coaches, cart, and order tracking.";
  }

  function showTyping(replyText) {
    const typing = document.createElement("div");
    typing.className = "msg bot typing";
    typing.textContent = "NutriBot is typing...";
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;

    setTimeout(() => {
      typing.remove();
      addMessage(replyText, "bot");
    }, 500);
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";
    showTyping(getReply(text));
    input.focus();
  }

  fab.addEventListener("click", toggleChat);
  closeBtn.addEventListener("click", closeChat);
  sendBtn.addEventListener("click", sendMessage);

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeChat();
    }
  });

  const header = modal.querySelector(".chat-header");
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  if (header) {
    header.addEventListener("mousedown", (e) => {
      if (window.innerWidth <= 640) return;

      isDragging = true;
      const rect = modal.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      header.style.cursor = "grabbing";
    });
  }

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const maxX = window.innerWidth - modal.offsetWidth - 12;
    const maxY = window.innerHeight - modal.offsetHeight - 12;
    const newX = clamp(e.clientX - offsetX, 12, maxX);
    const newY = clamp(e.clientY - offsetY, 12, maxY);

    modal.style.left = `${newX}px`;
    modal.style.top = `${newY}px`;
    modal.style.right = "auto";
    modal.style.bottom = "auto";
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    if (header) header.style.cursor = "grab";
  });

  window.addEventListener("resize", () => {
    modal.removeAttribute("style");
  });

  addQuickReplies();
  addMessage("Hi! I am NutriBot. Ask me about meals, calories, fitness, or your order.", "bot");
});
