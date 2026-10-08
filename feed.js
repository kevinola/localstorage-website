/* ---------- Feed ---------- */

const CATEGORY_LABELS = {
  security: "Crime",
  infrastructure: "Hazard",
  sanitation: "Sanitation",
  power: "Power",
  other: "Other",
};

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + " min ago";
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + " hr ago";
  const days = Math.floor(hours / 24);
  if (days < 7) return days + (days === 1 ? " day ago" : " days ago");
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function renderFeedView(category = "all") {
  const list = document.getElementById("reports-list");
  list.innerHTML = "";

  // newest first, optionally filtered
  const reports = getArray("reports")
    .filter(r => category === "all" || r.category === category)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (reports.length === 0) {
    const empty = document.createElement("p");
    empty.className = "profile-subtext";
    empty.textContent = "No reports yet. Be the first to report an incident.";
    list.appendChild(empty);
    return;
  }

  reports.forEach(report => {
    const author = findExisting("users", "email", report.userEmail);
    const authorName = report.userName || "Anonymous";
    const avatar = (author && author.img) ||
      "https://ui-avatars.com/api/?name=" + encodeURIComponent(authorName) + "&background=random";

    // report photo, or a map of the location if there's no photo
    const image = report.img ||
      "https://staticmap.openstreetmap.de/staticmap.php?center=" + report.lat + "," + report.lng +
      "&zoom=15&size=400x400&maptype=mapnik&markers=" + report.lat + "," + report.lng + ",red-pushpin";

    const card = document.createElement("div");
    card.className = "report-card-modern";
    card.addEventListener("click", () => {
      openDetail(image, report.title, report.description, authorName);
    });

    const content = document.createElement("div");
    content.className = "report-content";

    // header row: avatar, name, category badge
    const header = document.createElement("div");
    header.className = "report-header-row";

    const img = document.createElement("img"); 
    img.className = "author-avatar";
    img.src = avatar;
    img.alt = "Avatar";

    const name = document.createElement("span");
    name.className = "author-name";
    name.textContent = authorName;

    const badge = document.createElement("span");
    badge.className = "category-badge cat-" + report.category;
    badge.textContent = CATEGORY_LABELS[report.category] || "Other";

    header.append(img, name, badge);

    // title
    const title = document.createElement("h3");
    title.className = "report-title";
    title.textContent = report.title;

    // meta row: verified, location, time
    const meta = document.createElement("div");
    meta.className = "report-meta";

    const left = document.createElement("div");
    left.style.cssText = "display:flex; align-items:center; gap:12px;";

    const verified = document.createElement("span");
    verified.style.cssText = "color: #16A34A; display:flex; align-items:center; gap:4px;";
    verified.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>';
    verified.append(" " + (report.verified || 0) + " Verified");

    const location = document.createElement("span");
    location.textContent = report.state + ", " + report.lga;

    left.append(verified, location);

    const time = document.createElement("span");
    time.textContent = timeAgo(report.date);

    meta.append(left, time);

    content.append(header, title, meta);
    card.appendChild(content);
    list.appendChild(card);
  });
}
