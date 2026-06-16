document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     عناصر الصفحة الأساسية
     هنا بنمسك كل العناصر اللي هنحتاجها في التفاعل
  ========================= */
  const searchInput = document.getElementById("searchInput");
  const categoryButtons = document.querySelectorAll(".categories .card");
  const products = document.querySelectorAll(".product-card");
  const toast = document.getElementById("toast");

  /* الفئة الحالية اللي المستخدم مختارها */
  let activeCategory = "all";

  /* =========================
     TOAST NOTIFICATION
     رسالة صغيرة بتظهر لما يحصل حدث (زي إضافة للسلة)
  ========================= */
  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }

  /* =========================
     FILTER SYSTEM
     مسؤول عن:
     - البحث
     - الفلترة حسب الكاتيجوري
  ========================= */
  function applyFilters() {
    const searchValue = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";

    const noResultsMsg = document.getElementById("noResults");

    let foundAny = false; // بنستخدمها نعرف فيه نتائج ولا لأ

    products.forEach((card) => {

      const titleEl = card.querySelector("h3");
      if (!titleEl) return;

      const title = titleEl.textContent.toLowerCase();

      // هل المنتج مطابق للبحث؟
      const matchesSearch = title.includes(searchValue);

      // هل المنتج داخل التصنيف المختار؟
      const matchesCategory =
        activeCategory === "all" ||
        card.classList.contains(activeCategory);

      if (matchesSearch && matchesCategory) {
        card.classList.remove("hidden");
        card.style.display = "flex";
        foundAny = true;
      } else {
        card.classList.add("hidden");
        card.style.display = "none";
      }
    });

    /* لو مفيش نتائج نظهر رسالة No Results */
    if (noResultsMsg) {
      if (foundAny) {
        noResultsMsg.style.display = "none";
      } else {
        noResultsMsg.style.display = "block";
      }
    }
  }

  /* =========================
     SEARCH INPUT
     كل مرة المستخدم يكتب حاجة بنعمل فلترة مباشرة
  ========================= */
  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  /* =========================
     CATEGORY FILTER
     تغيير التصنيف (فطار - غدا - عشا - إلخ)
  ========================= */
  categoryButtons.forEach(btn => {

    btn.addEventListener("click", () => {

      // نشيل الـ active من كل الكاتيجوريز
      categoryButtons.forEach(b => b.classList.remove("active"));

      // نضيف active للزرار اللي اتضغط عليه
      btn.classList.add("active");

      const text = btn.textContent.trim().toLowerCase();

      // تحديد الفئة الحالية حسب النص
      if (text === "all") activeCategory = "all";
      else if (text === "desserts") activeCategory = "dessert";
      else if (text === "snacks") activeCategory = "snack";
      else activeCategory = text;

      applyFilters();
    });
  });

  /* =========================
     QUANTITY + ADD TO CART
     التحكم في:
     - زيادة / تقليل الكمية
     - إضافة للسلة
  ========================= */
  products.forEach(card => {

    const qtyButtons = card.querySelectorAll(".qty button");
    const minusBtn = qtyButtons[0];
    const plusBtn = qtyButtons[1];
    const qtySpan = card.querySelector(".qty span");
    const addBtn = card.querySelector(".add-btn");
    const titleEl = card.querySelector("h3");

    if (!minusBtn || !plusBtn || !qtySpan || !addBtn || !titleEl) return;

    const productName = titleEl.textContent;

    let qty = parseInt(qtySpan.textContent) || 1;

    /* تحديث شكل الزرار والكمية */
    function updateUI() {
      qtySpan.textContent = qty;

      if (qty > 1) {
        addBtn.classList.add("active");
        addBtn.textContent = `Added (${qty})`;
      } else {
        addBtn.classList.remove("active");
        addBtn.textContent = "Add to Cart";
      }
    }

    /* زيادة الكمية */
    plusBtn.addEventListener("click", () => {
      qty++;
      updateUI();

      // تأثير بسيط عند الضغط
      plusBtn.style.transform = "scale(0.9)";
      setTimeout(() => {
        plusBtn.style.transform = "scale(1)";
      }, 100);
    });

    /* تقليل الكمية */
    minusBtn.addEventListener("click", () => {
      if (qty > 1) {
        qty--;
        updateUI();

        minusBtn.style.transform = "scale(0.9)";
        setTimeout(() => {
          minusBtn.style.transform = "scale(1)";
        }, 100);
      }
    });

    /* إضافة للسلة */
    addBtn.addEventListener("click", () => {
      // إظهار رسالة تأكيد
      showToast(`${productName} added to cart 🛒`);

      // تغيير شكل الزرار بعد الإضافة
      addBtn.classList.add("active");
      addBtn.textContent = `Added (${qty})`;

      // أنيميشن بسيط للزرار
      addBtn.style.transform = "scale(0.95)";
      setTimeout(() => {
        addBtn.style.transform = "scale(1)";
      }, 150);
    });

  });

  /* =========================
     INIT - بداية تشغيل الصفحة
     بنخلي أول زرار (All) هو المختار افتراضيًا
  ========================= */
  if (categoryButtons.length > 0) {
    categoryButtons[0].classList.add("active");
  }

  applyFilters();

});