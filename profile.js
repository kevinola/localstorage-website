

function renderProfileView() {
    const user = getCurrentUser();
    if (!user) return;

    // User info (textContent keeps user-typed text from running as HTML)
    if (user.img) document.getElementById("profile-avatar-display").src = user.img;
    document.getElementById("profile-name").textContent = user.name || "Anonymous Citizen";
    document.getElementById("profile-email").textContent = "Email: " + (user.email || "Not set");
    document.getElementById("profile-phone").textContent = "Phone: " + (user.phone || "Not set");
    document.getElementById("profile-state").textContent = "State: " + (user.state || "Not set");
    document.getElementById("profile-lga").textContent = "LGA: " + (user.lga || "Not set");
    document.getElementById("profile-street").textContent = "Street: " + (user.street || "Not set");

    // This user's reports
    const myReports = getArray("reports").filter(r => r.userEmail === user.email);
    //coming soon ------ const totalVotes = myReports.reduce((sum, r) => sum + (r.verified || 0), 0);

    //state report count
    document.getElementById("stat-reports-count").textContent = myReports.length;
    // coming soon ---- document.getElementById("stat-confirmations-count").textContent = totalVotes;

    const list = document.getElementById("user-reports-list");
    list.innerHTML = "";

    if (myReports.length === 0) {
    const empty = document.createElement("p");
    empty.className = "profile-subtext";
    empty.textContent = "You haven't submitted any reports yet.";
    list.appendChild(empty);
    return;
  }

  myReports.forEach(report => {
    const status = report.status || "Pending";
    const date = new Date(report.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const card = document.createElement("div");
    card.className = "my-report-card";
    card.addEventListener("click", () => {
      openDetail(report.img, report.title, report.description, "You");
    });

    const info = document.createElement("div");
    info.className = "my-report-info";

    const header = document.createElement("div");
    header.className = "my-report-header";

    const badge = document.createElement("span");
    badge.className = "status-badge status-" + status.toLowerCase();
    badge.textContent = status;

    const time = document.createElement("span");
    time.className = "my-report-time";
    time.textContent = date;

    header.append(badge, time);

    const title = document.createElement("h4");
    title.className = "my-report-title";
    title.textContent = report.title;

    const stats = document.createElement("div");
    stats.className = "my-report-stats";
    stats.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>';
    stats.append(" " + (report.verified || 0) + " Verified");

    info.append(header, title, stats);
    card.appendChild(info);
    list.appendChild(card);
  });
}

// Log Out button
document.getElementById("logout-btn").addEventListener("click", () => {
  logout();
  authOverlay.classList.remove("hidden");
});