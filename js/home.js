const mainImg = document.getElementById("main-img");
const images = document.getElementsByClassName("header-img");
const headerContent = document.querySelector(".header-content");
const toast = document.getElementById("toast");
const addBtn = document.getElementsByClassName("add-btn");
const sellerCards = document.querySelectorAll(".seller-card");

let productName = "";
let qty = 1;

for (let i = 0; i < images.length; i++) {
    images[i].addEventListener("click", function () {
        mainImg.src = this.src;

        if (window.innerWidth > 1300) {
            if (
                this.src.includes("headerImage1.png") ||
                this.src.includes("headerImage2.png")
            ) {
                mainImg.style.width = "120%";
                mainImg.style.top = "";
            } else if (
                this.src.includes("headerImage3.png") ||
                this.src.includes("headerImage4.png")
            ) {
                mainImg.style.width = "115%";
                mainImg.style.top = "16%";
            }
        } else {
            mainImg.style.width = "";
            mainImg.style.top = "";
        }
    });
}

/* =========================
   TOAST NOTIFICATION
   رسالة صغيرة بتظهر لما يحصل حدث زي إضافة للسلة
========================= */
function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}

for (let i = 0; i < addBtn.length; i++) {
    addBtn[i].addEventListener("click", function () {
        const card = this.closest(".seller-card");
        if (!card) return;

        const productName = card.querySelector("h3").textContent;
        const qty = 1;

        showToast(`${productName} added to cart 🛒`);
    });
}