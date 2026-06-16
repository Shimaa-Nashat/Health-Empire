// ============================================================
// CONSTANTS
// ============================================================
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;

// ============================================================
// HASHING (Web Crypto API - SHA-256)
// ============================================================
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ============================================================
// TOKEN GENERATOR (for password reset)
// ============================================================
function generateToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ============================================================
// STORAGE HELPERS
// ============================================================
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function saveUser(user) {
  localStorage.setItem("currentUser", JSON.stringify({ username: user.username, email: user.email }));
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// ============================================================
// UI TOGGLE
// ============================================================
const currentYear = document.getElementById("current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();

const container = document.getElementById("container");

function goSignup(e) {
  document.title = "Health Empire - Sign Up";
  e && e.preventDefault();
  container.classList.add("active");
}

function goLogin(e) {
  document.title = "Health Empire - Login";
  e && e.preventDefault();
  container.classList.remove("active");
}

document.getElementById("signup").addEventListener("click", goSignup);
document.getElementById("login").addEventListener("click", goLogin);
document.getElementById("go-signup").addEventListener("click", goSignup);
document.getElementById("go-login").addEventListener("click", goLogin);

// ============================================================
// VALIDATION
// ============================================================
function validateField(input, errorId, pattern, emptyMsg, errorMsg) {
  const value = input.value.trim();
  const errorEl = document.getElementById(errorId);

  if (value === "") {
    errorEl.textContent = emptyMsg;
    input.classList.add("error-border");
    input.classList.remove("success-border");
    return false;
  }

  if (!pattern.test(value)) {
    errorEl.textContent = errorMsg;
    input.classList.add("error-border");
    input.classList.remove("success-border");
    return false;
  }

  errorEl.textContent = "";
  input.classList.add("success-border");
  input.classList.remove("error-border");
  return true;
}

// ============================================================
// INPUT REFERENCES
// ============================================================
const loginUsername = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const signupUsername = document.getElementById("signup-username");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const forgotPassword = document.getElementById("forgot-password");
const resetModal = document.getElementById("reset-modal");
const resetClose = document.getElementById("reset-close");
const resetForm = document.getElementById("reset-form");
const resetEmail = document.getElementById("reset-email");

// ============================================================
// LIVE VALIDATION LISTENERS
// ============================================================
loginUsername.addEventListener("input", () =>
  validateField(loginUsername, "login-username-error", usernamePattern, "", "Username must be 3-20 chars (letters, numbers, _)")
);
loginPassword.addEventListener("input", () =>
  validateField(loginPassword, "login-password-error", passwordPattern, "", "Password must be 6+ chars with a number")
);
signupUsername.addEventListener("input", () =>
  validateField(signupUsername, "signup-username-error", usernamePattern, "", "Username must be 3-20 chars (letters, numbers, _)")
);
signupEmail.addEventListener("input", () =>
  validateField(signupEmail, "signup-email-error", emailPattern, "", "Invalid email address")
);
signupPassword.addEventListener("input", () =>
  validateField(signupPassword, "signup-password-error", passwordPattern, "", "Password must be 6+ chars with a number")
);

// ============================================================
// LOGIN
// ============================================================
document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const isUsernameValid = validateField(loginUsername, "login-username-error", usernamePattern, "Username is required", "Username must be 3-20 chars");
  const isPasswordValid = validateField(loginPassword, "login-password-error", passwordPattern, "Password is required", "Password must be 6+ chars with a number");

  if (!isUsernameValid || !isPasswordValid) return;

  const hashedInput = await hashPassword(loginPassword.value.trim());

  const user = getUsers().find(
    (u) =>
      u.username.toLowerCase() === loginUsername.value.trim().toLowerCase() &&
      u.password === hashedInput
  );

  if (!user) {
    document.getElementById("login-password-error").textContent = "Wrong username or password";
    loginUsername.classList.add("error-border");
    loginPassword.classList.add("error-border");
    return;
  }

  saveUser(user);
  alert("Logged in successfully!");
  window.location.href = "index.html";
});

// ============================================================
// SIGNUP
// ============================================================
document.getElementById("signup-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const isUsernameValid = validateField(signupUsername, "signup-username-error", usernamePattern, "Username is required", "Username must be 3-20 chars");
  const isEmailValid = validateField(signupEmail, "signup-email-error", emailPattern, "Email is required", "Invalid email address");
  const isPasswordValid = validateField(signupPassword, "signup-password-error", passwordPattern, "Password is required", "Password must be 6+ chars with a number");

  if (!isUsernameValid || !isEmailValid || !isPasswordValid) return;

  const users = getUsers();
  const username = signupUsername.value.trim();
  const email = signupEmail.value.trim();

  const userExists = users.some(
    (u) =>
      u.username.toLowerCase() === username.toLowerCase() ||
      u.email.toLowerCase() === email.toLowerCase()
  );

  if (userExists) {
    document.getElementById("signup-email-error").textContent = "This username or email already exists";
    signupEmail.classList.add("error-border");
    return;
  }

  const hashedPassword = await hashPassword(signupPassword.value.trim());

  users.push({ username, email, password: hashedPassword });
  saveUsers(users);

  alert("Account created successfully! Please log in.");
  document.getElementById("signup-form").reset();
  [signupUsername, signupEmail, signupPassword].forEach((input) =>
    input.classList.remove("success-border", "error-border")
  );
  goLogin();
});

// ============================================================
// PASSWORD RESET (token-based)
// ============================================================
function closeResetModal() {
  resetModal.classList.remove("active");
  resetModal.setAttribute("aria-hidden", "true");
}

forgotPassword.addEventListener("click", () => {
  resetModal.classList.add("active");
  resetModal.setAttribute("aria-hidden", "false");
  resetEmail.focus();
});

resetClose.addEventListener("click", closeResetModal);

resetModal.addEventListener("click", (e) => {
  if (e.target === resetModal) closeResetModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && resetModal.classList.contains("active")) closeResetModal();
});

resetForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const isEmailValid = validateField(resetEmail, "reset-email-error", emailPattern, "Email is required", "Invalid email address");
  if (!isEmailValid) return;

  const users = getUsers();
  const email = resetEmail.value.trim().toLowerCase();
  const userIndex = users.findIndex((u) => u.email.toLowerCase() === email);

  if (userIndex === -1) {
    document.getElementById("reset-email-error").textContent = "No account found with this email";
    resetEmail.classList.add("error-border");
    resetEmail.classList.remove("success-border");
    return;
  }

  const token = generateToken();
  const resetData = { email, token, expiresAt: Date.now() + 15 * 60 * 1000 };
  localStorage.setItem("resetToken", JSON.stringify(resetData));

  const fakeResetLink = `${window.location.origin}/reset-password.html?token=${token}`;
  console.log("🔑 Password Reset Link (simulated):", fakeResetLink);

  alert("Password reset link generated!\nCheck the browser Console (F12) for the reset link.");

  resetForm.reset();
  resetEmail.classList.remove("success-border", "error-border");
  closeResetModal();
});

