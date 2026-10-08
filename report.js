

document.getElementById('choose-gps-location')?.addEventListener('click', () => setReportLocationMode('gps'));
document.getElementById('choose-manual-location')?.addEventListener('click', () => setReportLocationMode('manual'));

function setReportLocationMode(mode, preserveCoordinates = false) {
  reportLocationMode = mode;
  // 
  const useGps = mode === 'gps';
  document.getElementById('gps-location-panel')?.classList.toggle('hidden', !useGps);
  document.getElementById('manual-location-hint')?.classList.toggle('hidden', useGps);
  document.getElementById('choose-gps-location')?.classList.toggle('active', useGps);
  document.getElementById('choose-manual-location')?.classList.toggle('active', !useGps);
  document.getElementById('choose-gps-location')?.setAttribute('aria-pressed', String(useGps));
  document.getElementById('choose-manual-location')?.setAttribute('aria-pressed', String(!useGps));
  document.getElementById('gps-location-panel')?.classList.toggle('hidden', !useGps);

  ['report-state', 'report-lga', 'report-street'].forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.readOnly = useGps;
      input.required = true;
    }
  })
}



/* ---------- Report submission ---------- */

const reportForm = document.getElementById("report-form");
const reportStatus = document.getElementById("report-submit-status");
const reportSignInBtn = document.getElementById("report-sign-in-btn");

reportForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const user = getCurrentUser();
  if (!user) {
    reportStatus.style.color = "red";
    reportStatus.textContent = "Please sign in to submit a report.";
    reportSignInBtn.classList.remove("hidden");
    return;
  }

  /*/ "6.5244, 3.3792" -> numbers
  const coords = document.getElementById("report-coords").value.split(",");
  const lat = parseFloat(coords[0]);
  const lng = parseFloat(coords[1]);

  if (isNaN(lat) || isNaN(lng)) {
    reportStatus.style.color = "red";
    reportStatus.textContent = "Please set the incident location first.";
    return;
  }*/

  /*/ Optional photo (videos are too big for localStorage)
  const mediaFile = document.getElementById("report-media").files[0];
  let image = "";

  if (mediaFile && mediaFile.type.startsWith("video/")) {
    reportStatus.style.color = "red";
    reportStatus.textContent = "Videos can't be saved yet. Please attach a photo.";
    return;
  }

  try {
    image = await processImage(mediaFile);
  } catch (err) {
    reportStatus.style.color = "red";
    reportStatus.textContent = err.message;
    return;
  }*/

  const reportData = {
    id: Date.now(),
    userEmail: user.email,
    userName: user.name,
    category: document.getElementById("report-category").value,
    // create a category lovalstorage KEY later
    title: document.getElementById("report-title").value,
    state: document.getElementById("report-state").value,
    lga: document.getElementById("report-lga").value,
    street: document.getElementById("report-street").value,
    //lat: lat,
    //lng: lng,
    description: document.getElementById("report-description").value,
    status: "Pending",
    verified: 0,
    date: new Date().toISOString(),
  };

  try {
    addObj(reportData, "reports");
  } catch (err) {
    reportStatus.style.color = "red";
    reportStatus.textContent = "Storage is full. Try a smaller photo.";
    return;
  }

  reportForm.reset();
  //document.getElementById("media-preview-container").innerHTML = "";
  reportSignInBtn.classList.add("hidden");
  reportStatus.style.color = "green";
  reportStatus.textContent = "Report submitted successfully!";

  renderFeedView();
  renderProfileView(); // updates the count and "Your Submitted Reports"
});

// "Sign In to Report" button opens the auth modal
reportSignInBtn.addEventListener("click", () => {
  authOverlay.classList.remove("hidden");
});



