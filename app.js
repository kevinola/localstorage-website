       bindNavigation();
       renderFeedView();

/*-------------------/ Binds navigation event listeners ----------------------*/
function bindNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn[data-target]');

  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      switchTab(button.dataset.target);
    });
  });
}

function switchTab(targetId) {
  if (!targetId) return;

  document.body.classList.toggle('map-active', targetId === 'map-view');

  document.querySelectorAll('.view').forEach((section) => {
    section.classList.toggle('active-view', section.id === targetId);
  });

  document.querySelectorAll('.nav-btn[data-target]').forEach((button) => {
    button.classList.toggle('active', button.dataset.target === targetId);
  });

  if (targetId === 'map-view' && typeof initMapView === 'function') {
    //initMapView(); // initiate map view when the map tab is clicked
  }

  //if (targetId === 'report-view' && typeof initReportLocationMap === 'function') {
    //initReportLocationMap(); // initiate report location map when the report tab is clicked
  //}

  if (targetId === 'notifications-view' && typeof markAlertsRead === 'function') {
    renderAlertsView(); // mark alerts as read when the notifications tab is clicked
  }

  if (targetId === 'feed-view' && typeof renderFeedView === 'function') {
    renderFeedView();
  }

  if (targetId === 'profile-view' && typeof renderProfileView === 'function') {
    renderProfileView();
  }
}





/* ---------- Category filter buttons ---------- */
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderFeedView(btn.dataset.category);
  });
});






/* ---------- feed list detail div ---------- */
function openDetail(imageUrl, title, body, author) {
  document.getElementById('detail-hero').style.backgroundImage = `url('${imageUrl}')`;
  document.getElementById('detail-title').innerText = title;
  document.getElementById('detail-body').innerText = body;
  document.getElementById('detail-author').innerText = author;
  document.getElementById('detail-avatar').src = `https://ui-avatars.com/api/?name=${author.replace(' ', '+')}&background=random`;
  
  document.getElementById('detail-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDetail() {
    document.getElementById('detail-overlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}






/* ---------- Login / Sign-up tabs ---------- */

const showLoginBtn = document.getElementById("show-login-btn");
const showSignupBtn = document.getElementById("show-signup-btn");
const authHeading = document.getElementById("auth-heading");

showLoginBtn.addEventListener("click", () => showAuthTab("login"));
showSignupBtn.addEventListener("click", () => showAuthTab("signup"));


function showAuthTab(mode) {
  const isLogin = mode === "login";

  authHeading.textContent = isLogin ? "Login" : "Create Account";

  loginForm.classList.toggle("hidden", !isLogin);
  signupForm.classList.toggle("hidden", isLogin);

  showLoginBtn.classList.toggle("active", isLogin);
  showSignupBtn.classList.toggle("active", !isLogin);

  document.getElementById("auth-message").textContent = ""; // clear old errors

  //if (isLogin) updateLoginState(); // show the "no users" blur if needed
}



