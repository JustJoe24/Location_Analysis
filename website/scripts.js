/* ===== State ===== */
let map;
let markersLayer;
let allLocations = [];
let markersById = new Map();
let activeCardId = null;

const numberFmt = new Intl.NumberFormat("en-US");

/* ===== Map setup ===== */
function initializeMap() {
  map = L.map("map").setView([40.75, -73.97], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
}

function getScoreBand(score) {
  if (score >= 0.66) return "high";
  if (score >= 0.33) return "medium";
  return "low";
}

const BAND_COLORS = {
  high: "#16a34a",
  medium: "#f59e0b",
  low: "#dc2626",
};

function locationId(location) {
  return `${location.start_station_name}|${location.start_station_id}`;
}

function createRankMarker(location, rank) {
  const score = Number(location.food_cart_score);
  const band = getScoreBand(score);

  const icon = L.divIcon({
    className: "",
    html: `<div class="rank-marker ${band}" style="background:${BAND_COLORS[band]}">${rank}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const marker = L.marker(
    [Number(location.start_lat), Number(location.start_lng)],
    { icon, title: location.start_station_name }
  );

  marker.bindPopup(`
    <div class="popup-title">${rank}. ${escapeHtml(location.start_station_name)}</div>
    <dl class="popup-stats">
      <dt>Score</dt><dd>${score.toFixed(3)}</dd>
      <dt>Total trips</dt><dd>${numberFmt.format(location.total_trips)}</dd>
      <dt>Lunch-hour trips</dt><dd>${numberFmt.format(location.lunch_hour_trips)}</dd>
      <dt>Weekday trips</dt><dd>${numberFmt.format(location.weekday_trips)}</dd>
      <dt>Casual trips</dt><dd>${numberFmt.format(location.casual_trips)}</dd>
    </dl>
  `);

  marker.on("click", () => setActiveCard(locationId(location), false));

  return marker;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = String(text);
  return div.innerHTML;
}

/* ===== Sidebar list ===== */
function updateLocationList(locations) {
  const list = document.getElementById("locationList");
  const heading = document.getElementById("resultsHeading");
  list.innerHTML = "";
  activeCardId = null;

  heading.textContent =
    locations.length === 0
      ? "Locations"
      : `Locations (${numberFmt.format(locations.length)} shown)`;

  if (locations.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML =
      "<strong>No stations match the current filters.</strong>" +
      "Try lowering the minimum lunch-hour trips.";
    list.appendChild(empty);
    return;
  }

  locations.forEach((location, index) => {
    const rank = index + 1;
    const score = Number(location.food_cart_score);
    const band = getScoreBand(score);

    const card = document.createElement("button");
    card.type = "button";
    card.className = "location-card";
    card.dataset.id = locationId(location);

    card.innerHTML = `
      <span class="rank-badge ${band}" style="background:${BAND_COLORS[band]}">${rank}</span>
      <h3>${escapeHtml(location.start_station_name)}</h3>
      <span class="card-stats">
        <span>Score <strong>${score.toFixed(3)}</strong></span>
        <span>Trips <strong>${numberFmt.format(location.total_trips)}</strong></span>
        <span>Lunch <strong>${numberFmt.format(location.lunch_hour_trips)}</strong></span>
      </span>
    `;

    card.addEventListener("click", () => {
      const marker = markersById.get(locationId(location));
      if (marker) {
        map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 14), { duration: 0.6 });
        marker.openPopup();
      }
      setActiveCard(locationId(location), true);
    });

    list.appendChild(card);
  });
}

function setActiveCard(id, scrolledFromList) {
  activeCardId = id;
  document.querySelectorAll(".location-card").forEach((card) => {
    const isActive = card.dataset.id === id;
    card.classList.toggle("active", isActive);
    if (isActive && !scrolledFromList) {
      card.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  });
}

/* ===== Filtering & rendering ===== */
function filterAndRenderLocations() {
  const viewMode = document.getElementById("viewMode").value;
  const topN = Number(document.getElementById("topN").value);
  const minLunchTrips = Number(document.getElementById("minLunchTrips").value);

  document.getElementById("minLunchTripsValue").textContent =
    numberFmt.format(minLunchTrips);

  let filtered = allLocations.filter(
    (location) => Number(location.lunch_hour_trips) >= minLunchTrips
  );

  if (viewMode === "bottom") {
    filtered.sort((a, b) => Number(a.food_cart_score) - Number(b.food_cart_score));
  } else {
    filtered.sort((a, b) => Number(b.food_cart_score) - Number(a.food_cart_score));
  }
  filtered = filtered.slice(0, topN);

  markersLayer.clearLayers();
  markersById = new Map();

  filtered.forEach((location, index) => {
    const marker = createRankMarker(location, index + 1);
    markersById.set(locationId(location), marker);
    marker.addTo(markersLayer);
  });

  updateLocationList(filtered);
}

/* ===== Dataset switching ===== */
function setDataset(locations, name, tripsTotal) {
  allLocations = locations.filter(
    (location) =>
      location.start_lat &&
      location.start_lng &&
      location.food_cart_score !== null &&
      location.food_cart_score !== undefined
  );

  document.getElementById("datasetName").textContent = name;

  const meta = [`${numberFmt.format(allLocations.length)} stations`];
  if (tripsTotal) meta.push(`${numberFmt.format(tripsTotal)} trips`);
  document.getElementById("datasetMeta").textContent = meta.join(" · ");

  // Fit the lunch-trip slider to this dataset's range
  const slider = document.getElementById("minLunchTrips");
  const maxLunch = allLocations.reduce(
    (max, l) => Math.max(max, Number(l.lunch_hour_trips) || 0),
    0
  );
  slider.max = Math.max(100, Math.ceil(maxLunch / 100) * 100);
  slider.step = Math.max(10, Math.round(slider.max / 50 / 10) * 10);
  slider.value = 0;

  filterAndRenderLocations();

  // Recenter on the new data
  if (allLocations.length > 0) {
    const lats = allLocations.map((l) => Number(l.start_lat));
    const lngs = allLocations.map((l) => Number(l.start_lng));
    map.fitBounds(
      [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)],
      ],
      { padding: [40, 40], maxZoom: 13 }
    );
  }
}

function showMapStatus(text) {
  const status = document.getElementById("mapStatus");
  status.textContent = text;
  status.hidden = false;
}

function hideMapStatus() {
  document.getElementById("mapStatus").hidden = true;
}

/* ===== Default (demo) data ===== */
async function loadDefaultData() {
  showMapStatus("Loading demo data…");
  try {
    const response = await fetch("data/scored_food_cart_locations.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const locations = await response.json();
    const tripsTotal = locations.reduce(
      (sum, l) => sum + (Number(l.total_trips) || 0),
      0
    );
    setDataset(locations, "NYC Citi Bike · March 2026", tripsTotal);
    hideMapStatus();
  } catch (err) {
    showMapStatus("Could not load the demo dataset. Refresh to try again.");
    console.error("Demo data failed to load:", err);
  }
  document.getElementById("resetDataBtn").hidden = true;
}

/* ===== Client-side analysis pipeline =====
   Mirrors the Python pipeline: clean_data.py → analyze_station_activity.py
   → score_locations.py, aggregating while streaming so large files never
   sit in memory. */

const REQUIRED_COLUMNS = [
  "started_at",
  "ended_at",
  "start_station_name",
  "start_lat",
  "start_lng",
  "member_casual",
];

// "YYYY-MM-DD HH:MM:SS(.mmm)" → epoch ms (treated as UTC; both timestamps
// share a timezone so durations and hours stay correct)
function parseTimestamp(s) {
  if (!s || s.length < 19) return NaN;
  const y = +s.slice(0, 4);
  const mo = +s.slice(5, 7);
  const d = +s.slice(8, 10);
  const h = +s.slice(11, 13);
  const mi = +s.slice(14, 16);
  const se = +s.slice(17, 19);
  if (!y || !mo || !d || Number.isNaN(h) || Number.isNaN(mi) || Number.isNaN(se)) {
    return NaN;
  }
  const ms = s.length >= 23 ? +s.slice(20, 23) || 0 : 0;
  return Date.UTC(y, mo - 1, d, h, mi, se, ms);
}

function aggregateRow(row, stations) {
  const name = row.start_station_name;
  const lat = Number(row.start_lat);
  const lng = Number(row.start_lng);
  if (!name || !lat || !lng) return 0;

  const start = parseTimestamp(row.started_at);
  const end = parseTimestamp(row.ended_at);
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;

  const durationMin = (end - start) / 60000;
  if (durationMin <= 0 || durationMin > 180) return 0;

  const key = `${name}|${row.start_station_id || ""}`;
  let s = stations.get(key);
  if (!s) {
    s = {
      start_station_name: name,
      start_station_id: row.start_station_id || "",
      start_lat: lat,
      start_lng: lng,
      total_trips: 0,
      lunch_hour_trips: 0,
      weekday_trips: 0,
      weekend_trips: 0,
      casual_trips: 0,
      member_trips: 0,
    };
    stations.set(key, s);
  }

  s.total_trips += 1;

  const hour = +row.started_at.slice(11, 13);
  if (hour >= 11 && hour <= 14) s.lunch_hour_trips += 1;

  // Epoch days since Thu Jan 1 1970 → 0=Sun … 6=Sat
  const dayOfWeek = (Math.floor(start / 86400000) + 4) % 7;
  if (dayOfWeek === 0 || dayOfWeek === 6) s.weekend_trips += 1;
  else s.weekday_trips += 1;

  if (row.member_casual === "casual") s.casual_trips += 1;
  else s.member_trips += 1;

  return 1;
}

// Mirrors score_locations.py: normalize each signal to its max, then weight
function scoreStations(stations) {
  const list = Array.from(stations.values()).filter((s) => s.total_trips > 0);
  if (list.length === 0) return [];

  let maxTotal = 0, maxLunch = 0, maxLunchShare = 0, maxWeekday = 0, maxCasual = 0;
  list.forEach((s) => {
    s.lunch_hour_share = s.lunch_hour_trips / s.total_trips;
    maxTotal = Math.max(maxTotal, s.total_trips);
    maxLunch = Math.max(maxLunch, s.lunch_hour_trips);
    maxLunchShare = Math.max(maxLunchShare, s.lunch_hour_share);
    maxWeekday = Math.max(maxWeekday, s.weekday_trips);
    maxCasual = Math.max(maxCasual, s.casual_trips);
  });

  list.forEach((s) => {
    s.food_cart_score =
      0.35 * (maxLunch ? s.lunch_hour_trips / maxLunch : 0) +
      0.25 * (maxTotal ? s.total_trips / maxTotal : 0) +
      0.2 * (maxWeekday ? s.weekday_trips / maxWeekday : 0) +
      0.1 * (maxLunchShare ? s.lunch_hour_share / maxLunchShare : 0) +
      0.1 * (maxCasual ? s.casual_trips / maxCasual : 0);
  });

  return list;
}

/* ===== Upload handling ===== */
function setUploadError(text) {
  const el = document.getElementById("uploadError");
  el.textContent = text || "";
  el.hidden = !text;
}

function setProgress(fraction, text) {
  const wrap = document.getElementById("uploadProgress");
  wrap.hidden = false;
  document.getElementById("progressFill").style.width =
    `${Math.min(100, Math.round(fraction * 100))}%`;
  document.getElementById("progressText").textContent = text;
}

function hideProgress() {
  document.getElementById("uploadProgress").hidden = true;
}

function parseFile(file, stations, counters, bytesBefore, totalBytes) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      chunk: (results, parser) => {
        if (!counters.columnsChecked) {
          counters.columnsChecked = true;
          const fields = results.meta.fields || [];
          const missing = REQUIRED_COLUMNS.filter((c) => !fields.includes(c));
          if (missing.length > 0) {
            // Reject BEFORE abort: abort() synchronously fires complete(),
            // which would otherwise resolve this promise first
            reject(
              new Error(
                `"${file.name}" is missing required columns: ${missing.join(", ")}. ` +
                  "Expected Citi Bike trip-data format."
              )
            );
            parser.abort();
            return;
          }
        }

        results.data.forEach((row) => {
          counters.rowsRead += 1;
          counters.rowsKept += aggregateRow(row, stations);
        });

        const bytesDone = bytesBefore + (results.meta.cursor || 0);
        setProgress(
          bytesDone / totalBytes,
          `Analyzing ${file.name} — ${numberFmt.format(counters.rowsRead)} trips read`
        );
      },
      complete: () => resolve(),
      error: (err) => reject(new Error(`Could not read "${file.name}": ${err.message}`)),
    });
  });
}

async function handleUpload(fileList) {
  const files = Array.from(fileList);
  if (files.length === 0) return;

  if (typeof Papa === "undefined") {
    setUploadError(
      "The CSV parser could not be loaded. Check your internet connection and refresh."
    );
    return;
  }

  setUploadError("");
  const stations = new Map();
  const counters = { rowsRead: 0, rowsKept: 0, columnsChecked: false };
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  let bytesBefore = 0;

  try {
    for (const file of files) {
      counters.columnsChecked = false;
      await parseFile(file, stations, counters, bytesBefore, totalBytes);
      bytesBefore += file.size;
    }

    const scored = scoreStations(stations);
    if (scored.length === 0) {
      throw new Error(
        "No usable trips found. Check that the file contains Citi Bike–format trip data."
      );
    }

    const label =
      files.length === 1 ? files[0].name : `${files.length} uploaded files`;
    setDataset(scored, label, counters.rowsKept);
    document.getElementById("resetDataBtn").hidden = false;
    setProgress(
      1,
      `Done — ${numberFmt.format(counters.rowsKept)} trips across ` +
        `${numberFmt.format(scored.length)} stations`
    );
    setTimeout(hideProgress, 4000);
  } catch (err) {
    hideProgress();
    setUploadError(err.message);
  }
}

/* ===== Wire-up ===== */
document.addEventListener("DOMContentLoaded", () => {
  initializeMap();
  loadDefaultData();

  document.getElementById("viewMode").addEventListener("change", filterAndRenderLocations);
  document.getElementById("topN").addEventListener("change", filterAndRenderLocations);
  document.getElementById("minLunchTrips").addEventListener("input", filterAndRenderLocations);

  document.getElementById("csvUpload").addEventListener("change", (event) => {
    handleUpload(event.target.files);
    event.target.value = "";
  });

  document.getElementById("resetDataBtn").addEventListener("click", () => {
    hideProgress();
    setUploadError("");
    loadDefaultData();
  });
});
