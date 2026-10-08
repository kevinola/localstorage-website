//        
function getKey_arr(arrayKey) {
  try {
    const data = localStorage.getItem(arrayKey);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error parsing localStorage key:", arrayKey, error);
    return [];
  }
}


       
function getArray(arrayKey) {
  try {
    const data = localStorage.getItem(arrayKey);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error parsing localStorage key:", arrayKey, error);
    return [];
  }
}

//
function saveArray(arrayKey, array) {
  localStorage.setItem(arrayKey, JSON.stringify(array));
}


//
function addObj(newObj, arrayKey) {
  const array = getKey_arr(arrayKey);
  array.push(newObj);
  saveArray(arrayKey, array);
}


//
function findObj(arrayKey, proName, value) {
  const array = getKey_arr(arrayKey);
  return array.find(obj => obj[proName] === value);
}


//
function checkExistingStatus(arrayKey, proName, value) {
  const array = getKey_arr(arrayKey);
  return array.some(obj => obj[proName] === value);
}


//
function findExisting(arrayKey, proName, value) {
  const array = getKey_arr(arrayKey);
  return array.find(obj => obj[proName] === value);
}


//
function updateReportStatus(arrayKey, id, newStatus) {
  const reports = getKey_arr(arrayKey);

  const report = reports.find(report => report.id === id);

  if (report) {
    report.status = newStatus;
    saveArray(arrayKey, reports);
  }
}


//
function deleteReport(arrayKey, id) {
  const reports = getKey_arr(arrayKey);

  const updatedReports = reports.filter(report => report.id !== id);

  saveArray(arrayKey, updatedReports);
}



/* ---------- Pure JS SHA-256 (works on http and https) ---------- */

function sha256(message) {
  const bytes = new TextEncoder().encode(message);
  const len = bytes.length;
  const padded = new Uint8Array(((len + 9 + 63) >> 6) << 6);
  padded.set(bytes);
  padded[len] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(padded.length - 8, Math.floor((len * 8) / 2 ** 32));
  view.setUint32(padded.length - 4, (len * 8) >>> 0);

  // Constants from the first 64 primes
  const primes = [];
  for (let n = 2; primes.length < 64; n++) {
    if (primes.every(p => n % p)) primes.push(n);
  }
  const frac = x => Math.floor((x % 1) * 2 ** 32);
  const K = primes.map(p => frac(Math.cbrt(p)));
  let h = primes.slice(0, 8).map(p => frac(Math.sqrt(p)));

  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  const w = new Uint32Array(64);

  for (let i = 0; i < padded.length; i += 64) {
    for (let t = 0; t < 16; t++) w[t] = view.getUint32(i + t * 4);
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(w[t - 15], 7) ^ rotr(w[t - 15], 18) ^ (w[t - 15] >>> 3);
      const s1 = rotr(w[t - 2], 17) ^ rotr(w[t - 2], 19) ^ (w[t - 2] >>> 10);
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
    }

    let [a, b, c, d, e, f, g, hh] = h;
    for (let t = 0; t < 64; t++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (hh + S1 + ch + K[t] + w[t]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      hh = g; g = f; f = e;
      e = (d + t1) >>> 0;
      d = c; c = b; b = a;
      a = (t1 + t2) >>> 0;
    }
    h = h.map((v, idx) => (v + [a, b, c, d, e, f, g, hh][idx]) >>> 0);
  }

  return h.map(x => x.toString(16).padStart(8, "0")).join("");
}
// Sanity check: sha256("abc") =
// ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad








/* ---------- Image helpers (shrink files over 2 MB) ---------- */

const MAX_BYTES = 2 * 1024 * 1024; // lower to 300 * 1024 if localStorage fills up

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}



async function processImage(file) {
  if (!file) return "";
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");

  const original = await fileToDataURL(file);
  if (file.size <= MAX_BYTES) return original; // small enough, keep as is

  const img = await loadImage(original);
  let scale = Math.min(1, 1200 / Math.max(img.width, img.height));
  let quality = 0.8;
  let result = original;

  for (let i = 0; i < 8; i++) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff"; // avoids black background on transparent PNGs
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    result = canvas.toDataURL("image/jpeg", quality);
    if (result.length * 0.75 <= MAX_BYTES) break; // base64 -> approx bytes

    scale *= 0.8;
    quality = Math.max(0.5, quality - 0.1);
  }
  return result;
}




/*

//        
function getKey_arr(arrayKey) {
  try {
    const data = localStorage.getItem(arrayKey);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error parsing localStorage key:", arrayKey, error);
    return [];
  }
}


//
function saveArray(arrayKey, array) {
  localStorage.setItem(arrayKey, JSON.stringify(array));
}


//
function addObj(newObj, arrayKey) {
  const array = getKey_arr(arrayKey);
  array.push(newObj);
  saveArray(arrayKey, array);
}


//
function findObj(arrayKey, proName, value) {
  const array = getKey_arr(arrayKey);
  return array.find(obj => obj[proName] === value);
}


//
function checkExistingStatus(arrayKey, proName, value) {
  const array = getKey_arr(arrayKey);
  return array.some(obj => obj[proName] === value);
}


//
function findExisting(arrayKey, proName, value) {
  const array = getKey_arr(arrayKey);
  return array.find(obj => obj[proName] === value);
}


//
function updateReportStatus(arrayKey, id, newStatus) {
  const reports = getKey_arr(arrayKey);

  const report = reports.find(report => report.id === id);

  if (report) {
    report.status = newStatus;
    saveArray(arrayKey, reports);
  }
}


//
function deleteReport(arrayKey, id) {
  const reports = getKey_arr(arrayKey);

  const updatedReports = reports.filter(report => report.id !== id);

  saveArray(arrayKey, updatedReports);
}


*/