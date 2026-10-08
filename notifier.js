/* ---------- Alerts ---------- */

// Save changes to one user in the "users" array
// (skip this if your storage.js already has an update helper)
function updateUser(email, changes) {
  const users = getArray("users");
  const user = users.find(u => u.email === email);
  if (!user) return;
  Object.assign(user, changes);
  saveArray("users", users);
}

function getUnreadReports(user) {
  const lastSeen = new Date(user.lastSeenAlerts || 0);
  return getArray("reports").filter(r => new Date(r.date) > lastSeen);
}

// Red number on the Alerts tab
function updateAlertsBadge() {
  const badge = document.querySelector('.nav-btn[onclick*="notifications-view"] .badge');
  if (!badge) return;

  const user = getCurrentUser();
  const count = user ? getUnreadReports(user).length : 0;

  badge.textContent = count;
  badge.style.display = count > 0 ? "" : "none";
}

function renderAlertsView() {
  const user = getCurrentUser();
  if (!user) return;

  const list = document.getElementById("alerts-list");
  list.innerHTML = "";

  const lastSeen = new Date(user.lastSeenAlerts || 0);
  const reports = getArray("reports")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (reports.length === 0) {
    const empty = document.createElement("p");
    empty.className = "profile-subtext";
    empty.textContent = "No alerts yet.";
    list.appendChild(empty);
    return;
  }

  reports.forEach(report => {
    const isUnread = new Date(report.date) > lastSeen;
    const isMine = report.userEmail === user.email;
    const authorName = report.userName || "Anonymous";
    const author = findExisting("users", "email", report.userEmail);
    const avatar = (author && author.img) ||
      "https://ui-avatars.com/api/?name=" + encodeURIComponent(authorName) + "&background=random&color=fff";

    const card = document.createElement("div");
    card.className = "notification-card" + (isUnread ? " unread" : "");

    const img = document.createElement("img");
    img.className = "notif-avatar";
    img.src = avatar;
    img.alt = "Avatar";

    const content = document.createElement("div");
    content.className = "notif-content";

    const text = document.createElement("p");
    text.className = "notif-text";

    const who = document.createElement("strong");
    who.textContent = isMine ? "You" : authorName;

    const where = document.createElement("strong");
    where.textContent = report.lga;

    const label = CATEGORY_LABELS[report.category] || "Other";
    text.append(who, " from ", where, " " + (isMine ? "posted" : "has posted") + " a new " + label + " report.");

    const time = document.createElement("span");
    time.className = "notif-time";
    time.textContent = timeAgo(report.date);

    content.append(text, time);
    card.append(img, content);

    if (isUnread) {
      const dot = document.createElement("div");
      dot.className = "unread-dot";
      card.appendChild(dot);
    }

    list.appendChild(card);
  });

  // Everything shown counts as seen now (cards above keep their unread look this time)
  updateUser(user.email, { lastSeenAlerts: new Date().toISOString() });
  updateAlertsBadge();
}

// Render when the Alerts tab is opened
document.querySelector('.nav-btn[onclick*="notifications-view"]')
  .addEventListener("click", renderAlertsView);