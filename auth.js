const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const authOverlay = document.querySelector(".auth-overlay");
const authMessage = document.getElementById("auth-message");




/* ---------- Session Storage ---------- */

// TOKEN geneator
function generateToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes); // works on http, unlike crypto.randomUUID()
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

// LOGIN 
function loginUser(user) {
  const token = generateToken();
  sessionStorage.setItem("session", JSON.stringify({ email: user.email, token }));
/* ---------------- LOGOUT BUTTON ---------------------- */

const logout = document.getElementById("logout-btn");
logout.addEventListener("click", () => logout());
}

// user in session
function getCurrentUser() {
  try {
    const session = JSON.parse(sessionStorage.getItem("session"));
    if (!session) return null;
    return findExisting("users", "email", session.email) || null;
  } catch {
    return null;
  }
}

// logout
function logout() {
  sessionStorage.removeItem("session");
}







/* ---------- Sign-up handler ---------- */

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("signup-password-confirm").value;

  if (password !== confirmPassword) {
    authMessage.classList.add('is-error')
    authMessage.textContent = "Passwords do not match!";
    return;
  }

  const email = document.getElementById("signup-email").value;

  if (findExisting("users", "email", email)) {
    authMessage.classList.add('is-error'); 
    authMessage.textContent = "Email already exists.";
    return;
  }

  let avatar = "";
  try {
    avatar = await processImage(document.getElementById("signup-avatar").files[0]);
  } catch (err) {
    authMessage.classList.add('is-error')
    authMessage.textContent = err.message;
    return;
  }

  const signupData = {
    name: document.getElementById("signup-name").value,
    email: email,
    password: sha256(password), // hashed, no await needed
    phone: document.getElementById("signup-phone").value,
    state: document.getElementById("signup-state").value,
    lga: document.getElementById("signup-lga").value,
    street: document.getElementById("signup-street").value,
    img: avatar,
    lastSeenAlerts: new Date().toISOString(),
  };

  try {
    addObj(signupData, "users");
  } catch (err) {
    authMessage.classList.add('is-error')
    authMessage.textContent = "Storage is full. Try a smaller image.";
    return;
  }

  authOverlay.classList.add("hidden");
  renderFeedView();
  renderProfileView();
  updateAlertsBadge();
  signupForm.reset();
  authMessage.textContent = "";
});







/* ---------- Login handler ---------- */

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  //const authMessage = document.getElementById("auth-message");

  //find user in localstorage
  const user = findExisting("users", "email", email);

  // if user get result and password get result
  if (user && user.password === sha256(password)) {
    loginUser(user);
    renderProfileView(); // render profile view after successful login
    renderFeedView();
    updateAlertsBadge(); // check for new post
    authOverlay.classList.add("hidden");
    loginForm.reset();
    authMessage.textContent = "";
  } else {
    authMessage.classList.add('is-error')
    authMessage.textContent = "Invalid email or password.";
  }
});






/* ---------- Restore login state on page load ---------- */

const currentUser = getCurrentUser();
if (currentUser) {
  authOverlay.classList.add("hidden");
  renderProfileView(); // render profile view if user is logged in
  renderFeedView();
  updateAlertsBadge();
} else {
  authOverlay.classList.remove("hidden");
  alert("login please");

  //check if any users exist in the database
  usersKeyState();
  if(getArray("users").length > 0) showAuthTab("login");
  else showAuthTab("signup");
  
}





/* ---------- Block login when there are no users ---------- */

function usersKeyState() {
  const existing = loginForm.querySelector(".message");
  const noUsers = getArray("users").length === 0;

  if (noUsers && !existing) {
    const overlay = document.createElement("div");
    overlay.className = "message";
    overlay.textContent = "No user in the localStorage, be the first to sign up";
    loginForm.appendChild(overlay);
  } else if (!noUsers && existing) {
    existing.remove();
  }
}
