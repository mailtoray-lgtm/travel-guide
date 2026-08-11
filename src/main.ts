import "./styles.css";
import {
  contentPendingCityGuide,
  durationOptions,
  estimateDailyBurden,
  relaxedSelfDriveRules,
  themeOptions,
  type CompilerInput,
} from "./platform";

type RouteStop = {
  Order: string;
  Map_Name: string;
  Location: string;
  Country: string;
  Recommended_Nights: string;
  Route_Theme: string;
  Approx_Miles_From_Previous: string;
  Drive_Class: string;
  Autumn_Priority: string;
  Flex_Nights: string;
  Autumn_Target_Window: string;
  Why_This_Stop: string;
  Google_Directions_URL: string;
  lat?: number;
  lng?: number;
};

type Attraction = {
  Stop_Order: string;
  Base: string;
  Map_Name: string;
  Location: string;
  Priority: string;
  Recommended_Time: string;
  Best_Time: string;
  How_To_Experience_CN: string;
  What_To_Look_For_CN: string;
  Story_Theme_CN: string;
  Autumn_Focus_CN: string;
  Practical_Tip_CN: string;
  Source_URL: string;
  Google_Maps_Search_URL: string;
};

type GeoPoint = {
  type: "Feature";
  properties: { name: string; leg?: string; day?: string; description?: string };
  geometry: { type: "Point"; coordinates: [number, number] };
};

const trip = {
  title: "Europe Autumn Grand Tour",
  subtitle: "3D Virtual Road Trip Across Europe",
  myMaps:
    "https://www.google.com/maps/d/u/0/embed?mid=1msDendyXwmU4o2SLgb1RbBBB7nJCBa4&ehbc=2E312F",
  myMapsOpen:
    "https://www.google.com/maps/d/edit?mid=1msDendyXwmU4o2SLgb1RbBBB7nJCBa4",
};

const assetBase = import.meta.env.BASE_URL;

const driveSections = [
  { name: "03 DRIVE 1", from: "Amsterdam", to: "Lillehammer", opensAt: "Amsterdam" },
  { name: "04 DRIVE 2", from: "Lillehammer", to: "Warsaw", opensAt: "Lillehammer" },
  { name: "05 DRIVE 3", from: "Warsaw", to: "Grindelwald", opensAt: "Warsaw" },
  { name: "06 DRIVE 4", from: "Grindelwald", to: "Porto", opensAt: "Grindelwald" },
  { name: "07 DRIVE 5", from: "Porto", to: "Port of Barcelona", opensAt: "Porto" },
  { name: "08 DRIVE 6", from: "Civitavecchia", to: "Shkodër", opensAt: "Rome" },
  { name: "09 DRIVE 7", from: "Shkodër", to: "Belgrade", opensAt: "Shkodër" },
  { name: "10 DRIVE 8", from: "Belgrade", to: "Amsterdam Schiphol", opensAt: "Belgrade" },
];

const app = document.querySelector<HTMLDivElement>("#app")!;
let routeStops: RouteStop[] = [];
let attractions: Attraction[] = [];
let selectedStop = 0;
let selectedPriority = "All";
let language: "cn" | "en" = "cn";
let visualMode: "daylight" | "night" = "daylight";
let planner: CompilerInput = {
  duration: "full",
  visitorProfile: "first_time",
  pace: "relaxed",
  drivingPreference: "relaxed_self_drive",
  theme: "Autumn Colors",
};
let routeProgress = 0;
let playing = true;
let reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quote = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && quote && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quote = !quote;
    } else if (char === "," && !quote) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quote) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  const headers = rows.shift() ?? [];
  return rows.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])),
  );
}

function googleMapsSearch(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function googleEarthSearch(query: string) {
  return `https://earth.google.com/web/search/${encodeURIComponent(query)}`;
}

function googleStreetView(query: string) {
  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${encodeURIComponent(query)}`;
}

function googleStreetViewCoords(lat: number, lng: number) {
  return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`;
}

function safeUrl(value: string, fallback: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : fallback;
  } catch {
    return fallback;
  }
}

function html(value: string | number | undefined) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function withCoordinates(stops: RouteStop[], points: GeoPoint[]) {
  const byName = new Map<string, [number, number]>();
  points.forEach((point) => {
    const clean = point.properties.name.replace(/^Leg \d+:\s*/, "").split(",")[0].trim();
    byName.set(clean.toLowerCase(), point.geometry.coordinates);
  });
  return stops.map((stop, index) => {
    const coord = byName.get(stop.Map_Name.toLowerCase()) ?? fallbackCoordinate(stop.Map_Name, index);
    return { ...stop, lng: coord[0], lat: coord[1] };
  });
}

function fallbackCoordinate(name: string, index: number): [number, number] {
  const known: Record<string, [number, number]> = {
    Giethoorn: [6.083, 52.74],
    Lübeck: [10.687, 53.866],
    Flåm: [7.114, 60.861],
    Geiranger: [7.207, 62.101],
    Lillehammer: [10.466, 61.115],
    Karlstad: [13.511, 59.402],
    Jönköping: [14.161, 57.782],
    Helsingborg: [12.694, 56.046],
    Odense: [10.388, 55.403],
    Schwerin: [11.413, 53.635],
    Poznań: [16.925, 52.406],
    Olomouc: [17.251, 49.594],
    "Český Krumlov": [14.315, 48.812],
    Hallstatt: [13.649, 47.562],
    Salzburg: [13.055, 47.81],
    Ortisei: [11.674, 46.576],
    "St. Moritz": [9.839, 46.498],
    Grindelwald: [8.041, 46.624],
    "Chamonix-Mont-Blanc": [6.869, 45.923],
    Annecy: [6.129, 45.899],
    Avignon: [4.805, 43.949],
    Collioure: [3.083, 42.526],
    Zaragoza: [-0.889, 41.648],
    Salamanca: [-5.664, 40.97],
    Évora: [-7.913, 38.571],
    Granada: [-3.599, 37.178],
    Alicante: [-0.481, 38.345],
    Valencia: [-0.376, 39.469],
    "Port of Barcelona": [2.173, 41.353],
    "Port of Civitavecchia": [11.795, 42.094],
    Venice: [12.315, 45.44],
    Ljubljana: [14.505, 46.056],
    "Plitvice Lakes National Park": [15.582, 44.865],
    Split: [16.44, 43.508],
    Dubrovnik: [18.094, 42.651],
    Kotor: [18.771, 42.424],
    Shkodër: [19.512, 42.069],
    Gjirokastër: [20.138, 40.075],
    Ioannina: [20.851, 39.665],
    Patras: [21.735, 38.246],
    Athens: [23.728, 37.984],
    Delphi: [22.501, 38.482],
    Meteora: [21.63, 39.721],
    Skopje: [21.431, 41.998],
    Niš: [21.896, 43.321],
    Belgrade: [20.457, 44.817],
    "Novi Sad": [19.833, 45.267],
    Linz: [14.286, 48.306],
    Regensburg: [12.102, 49.013],
    Würzburg: [9.953, 49.792],
    Bacharach: [7.769, 50.057],
    Cologne: [6.96, 50.938],
    "Amsterdam Airport Schiphol": [4.763, 52.31],
  };
  if (known[name]) return known[name];
  return [4 + index * 0.22, 52 - index * 0.04];
}

function project(lng: number, lat: number, w: number, h: number) {
  const minLng = -10;
  const maxLng = 26;
  const minLat = 36;
  const maxLat = 64;
  const x = ((lng - minLng) / (maxLng - minLng)) * w;
  const y = h - ((lat - minLat) / (maxLat - minLat)) * h;
  return { x, y };
}

function renderCanvas() {
  const canvas = document.querySelector<HTMLCanvasElement>("#route-canvas");
  if (!canvas || !routeStops.length) return;
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, rect.width, rect.height);

  const grd = ctx.createLinearGradient(0, 0, rect.width, rect.height);
  grd.addColorStop(0, "#17324d");
  grd.addColorStop(0.55, "#23556a");
  grd.addColorStop(1, "#6a8d6d");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, rect.width, rect.height);

  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.strokeStyle = "#d7e7db";
  for (let i = 0; i < 18; i += 1) {
    ctx.beginPath();
    ctx.moveTo(0, i * 38 + 10);
    ctx.lineTo(rect.width, i * 28 - 40);
    ctx.stroke();
  }
  for (let i = 0; i < 20; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * 58 - 100, 0);
    ctx.lineTo(i * 42 + 40, rect.height);
    ctx.stroke();
  }
  ctx.restore();

  const pts = routeStops.map((s) => project(s.lng!, s.lat!, rect.width, rect.height));
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(8, 22, 38, .55)";
  ctx.lineWidth = 10;
  drawPath(ctx, pts);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 5;
  drawPath(ctx, pts);
  ctx.strokeStyle = "#2d8cff";
  ctx.lineWidth = 3;
  drawPath(ctx, pts);

  const max = Math.max(1, Math.floor(routeProgress * (pts.length - 1)));
  ctx.strokeStyle = "#ffcf5a";
  ctx.lineWidth = 6;
  drawPath(ctx, pts.slice(0, max + 1));

  pts.forEach((pt, index) => {
    const selected = index === selectedStop;
    ctx.beginPath();
    ctx.fillStyle = selected ? "#ff7a1a" : "#1fb67a";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = selected ? 4 : 2;
    ctx.arc(pt.x, pt.y, selected ? 8 : 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  const target = pts[selectedStop];
  if (target) {
    ctx.beginPath();
    ctx.strokeStyle = "#ffcf5a";
    ctx.lineWidth = 2;
    ctx.arc(target.x, target.y, 18 + Math.sin(Date.now() / 260) * 4, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawPath(ctx: CanvasRenderingContext2D, pts: { x: number; y: number }[]) {
  if (!pts.length) return;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  pts.slice(1).forEach((pt) => ctx.lineTo(pt.x, pt.y));
  ctx.stroke();
}

function stopAttractions() {
  const stop = routeStops[selectedStop];
  const list = attractions.filter((a) => Number(a.Stop_Order) === Number(stop.Order));
  return selectedPriority === "All" ? list : list.filter((a) => a.Priority === selectedPriority);
}

function bridgeStopReason(stop: RouteStop) {
  const nights = Number(stop.Recommended_Nights || 0);
  const miles = Number(stop.Approx_Miles_From_Previous || 0);
  const hasLocalAttractions = attractions.some((a) => Number(a.Stop_Order) === Number(stop.Order));
  if (nights <= 1 && miles >= 120) {
    return {
      route_function: "Route protection / relaxed self-drive pacing",
      why_stop_exists:
        "This stop keeps the road trip comfortable instead of turning the day into a bus-tour transfer.",
      worth_sightseeing: hasLocalAttractions ? "Local guide items exist." : "CONTENT_PENDING",
      best_60_minute_experience: hasLocalAttractions ? "Use the highest-priority nearby guide item." : "CONTENT_PENDING",
      skip_if_tired: "Dinner, sleep, and continue without guilt.",
    };
  }
  return {
    route_function: stop.Route_Theme || "Destination base",
    why_stop_exists: stop.Why_This_Stop || "CONTENT_PENDING",
    worth_sightseeing: hasLocalAttractions ? "Yes, use the attraction guide below." : "CONTENT_PENDING",
    best_60_minute_experience: hasLocalAttractions ? "Pick one nearby priority attraction." : "CONTENT_PENDING",
    skip_if_tired: "Protect rest when arrival is late or weather is poor.",
  };
}

function driveStartIndex(from: string) {
  const normalizedFrom = from.toLowerCase();
  const index = routeStops.findIndex(
    (stop) =>
      stop.Map_Name.toLowerCase() === normalizedFrom ||
      stop.Map_Name.toLowerCase().includes(normalizedFrom) ||
      stop.Location.toLowerCase().includes(normalizedFrom),
  );
  return Math.max(0, index);
}

function driveEndIndex(to: string) {
  const normalizedTo = to.toLowerCase();
  const index = routeStops.findIndex(
    (stop) =>
      stop.Map_Name.toLowerCase() === normalizedTo ||
      stop.Map_Name.toLowerCase().includes(normalizedTo) ||
      stop.Location.toLowerCase().includes(normalizedTo),
  );
  return index >= 0 ? index : routeStops.length - 1;
}

function setStop(index: number) {
  selectedStop = Math.max(0, Math.min(routeStops.length - 1, index));
  routeProgress = selectedStop / Math.max(1, routeStops.length - 1);
}

function speak() {
  const stop = routeStops[selectedStop];
  const text =
    language === "cn"
      ? `${stop.Map_Name}。${stop.Why_This_Stop} 秋季窗口：${stop.Autumn_Target_Window}。`
      : `${stop.Map_Name}. ${stop.Country}. Autumn window: ${stop.Autumn_Target_Window}. ${stop.Route_Theme}.`;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === "cn" ? "zh-CN" : "en-US";
  window.speechSynthesis.speak(utterance);
}

function render() {
  const stop = routeStops[selectedStop];
  const localAttractions = stopAttractions();
  const cityGuide = contentPendingCityGuide(stop.Map_Name);
  const whyStop = bridgeStopReason(stop);
  const dailyBurden = estimateDailyBurden({
    driveMiles: Number(stop.Approx_Miles_From_Previous || 0),
    hotelChange: selectedStop > 0,
    ferry: stop.Map_Name.toLowerCase().includes("ferry") || stop.Location.toLowerCase().includes("port"),
    majorAttractions: Math.min(2, localAttractions.length),
    walkingHours: localAttractions.length ? 2.5 : 1,
  });
  const priorities = ["All", ...Array.from(new Set(attractions.map((a) => a.Priority))).filter(Boolean)];
  const stopMapsUrl = googleMapsSearch(stop.Location);
  const stopEarthUrl = googleEarthSearch(stop.Location);
  const stopStreetViewUrl =
    typeof stop.lat === "number" && typeof stop.lng === "number"
      ? googleStreetViewCoords(stop.lat, stop.lng)
      : googleStreetView(stop.Location);
  app.innerHTML = `
    <main class="${visualMode === "night" ? "night-mode" : "daylight-mode"}">
      <section class="hero">
        <div class="hero__copy">
          <p class="eyebrow">PUBLIC TRAVEL GUIDE PLATFORM</p>
          <h1>${html(trip.title)}</h1>
          <p>${html(trip.subtitle)}</p>
          <div class="hero__actions">
            <a class="button primary" href="${trip.myMapsOpen}" target="_blank" rel="noreferrer">Open My Maps</a>
            <a class="button" href="${stopEarthUrl}" target="_blank" rel="noreferrer">Google Earth 3D</a>
          </div>
        </div>
        <canvas id="route-canvas" aria-label="3D route fly-through canvas"></canvas>
      </section>

      <section class="toolbar" aria-label="Trip controls">
        <button id="prev-stop" class="icon-btn" title="Previous stop">‹</button>
        <input id="route-progress" type="range" min="0" max="${routeStops.length - 1}" value="${selectedStop}" />
        <button id="next-stop" class="icon-btn" title="Next stop">›</button>
        <button id="play" class="button">${playing ? "Pause flight" : "Play flight"}</button>
        <button id="mode" class="button">${visualMode === "daylight" ? "Night mode" : "Daylight"}</button>
        <button id="lang" class="button">${language === "cn" ? "中文" : "English"}</button>
        <button id="narrate" class="button">Narration</button>
      </section>

      <section class="planner" aria-label="Trip compiler controls">
        <label>Duration
          <select id="duration">
            ${durationOptions
              .map(([value, label]) => `<option value="${value}" ${planner.duration === value ? "selected" : ""}>${label}</option>`)
              .join("")}
          </select>
        </label>
        <label>Visitor
          <select id="visitor-profile">
            <option value="first_time" ${planner.visitorProfile === "first_time" ? "selected" : ""}>First Time</option>
            <option value="return_visitor" ${planner.visitorProfile === "return_visitor" ? "selected" : ""}>Return Visitor</option>
          </select>
        </label>
        <label>Pace
          <select id="pace">
            <option value="relaxed" ${planner.pace === "relaxed" ? "selected" : ""}>Relaxed</option>
            <option value="balanced" ${planner.pace === "balanced" ? "selected" : ""}>Balanced</option>
            <option value="see_more" ${planner.pace === "see_more" ? "selected" : ""}>See More</option>
          </select>
        </label>
        <label>Drive
          <select id="drive-profile">
            <option value="relaxed_self_drive" ${planner.drivingPreference === "relaxed_self_drive" ? "selected" : ""}>Relaxed Self-Drive</option>
            <option value="comfortable_road_trip" ${planner.drivingPreference === "comfortable_road_trip" ? "selected" : ""}>Comfortable Road Trip</option>
            <option value="fast_mover" ${planner.drivingPreference === "fast_mover" ? "selected" : ""}>Fast Mover</option>
          </select>
        </label>
        <label>Theme
          <select id="theme">
            ${themeOptions.map((theme) => `<option value="${html(theme)}" ${planner.theme === theme ? "selected" : ""}>${html(theme)}</option>`).join("")}
          </select>
        </label>
      </section>

      <section class="layout">
        <aside class="stops" aria-label="Route stops">
          ${driveSections
            .map(
              ({ name, from, to, opensAt }) => {
                const start = driveStartIndex(opensAt);
                const end = driveEndIndex(to);
                const active = selectedStop >= start && selectedStop <= end;
                return `
                  <button class="drive-chip ${active ? "active" : ""}" data-drive="${start}">
                    <strong>${html(name)}</strong>
                    <span>${html(from)} → ${html(to)}</span>
                  </button>
                `;
              },
            )
            .join("")}
          <div class="stop-list">
            ${routeStops
              .map(
                (s, index) => `
                  <button class="stop-row ${index === selectedStop ? "active" : ""}" data-stop="${index}">
                    <span>${html(s.Order.padStart(2, "0"))}</span>
                    <strong>${html(s.Map_Name)}</strong>
                    <small>${html(s.Country)} · ${html(s.Autumn_Priority)}</small>
                  </button>
                `,
              )
              .join("")}
          </div>
        </aside>

        <section class="guide">
          <div class="guide__header">
            <div>
              <p class="eyebrow">STOP ${html(stop.Order)} · ${html(stop.Country)}</p>
              <h2>${html(stop.Map_Name)}</h2>
            </div>
            <div class="guide__links">
              <a href="${stopMapsUrl}" target="_blank" rel="noreferrer">Maps</a>
              <a href="${stopEarthUrl}" target="_blank" rel="noreferrer">Earth</a>
              <a href="${stopStreetViewUrl}" target="_blank" rel="noreferrer">Street View</a>
            </div>
          </div>
          <div class="facts">
            <span>${html(stop.Recommended_Nights || "0")} nights</span>
            <span>${html(stop.Drive_Class)}</span>
            <span>${html(stop.Approx_Miles_From_Previous)} mi from previous</span>
            <span>${html(stop.Autumn_Target_Window)}</span>
          </div>
          <p class="lead">${html(
            language === "cn"
              ? stop.Why_This_Stop
              : `${stop.Route_Theme}. This stop anchors the route in ${stop.Country} and sets up the next drive segment.`,
          )}</p>

          <section class="info-grid">
            <article class="info-panel">
              <p class="eyebrow">WHY THIS STOP EXISTS</p>
              <h3>${html(whyStop.route_function)}</h3>
              <dl>
                <dt>Why stop</dt>
                <dd>${html(whyStop.why_stop_exists)}</dd>
                <dt>60-minute plan</dt>
                <dd>${html(whyStop.best_60_minute_experience)}</dd>
                <dt>Skip rule</dt>
                <dd>${html(whyStop.skip_if_tired)}</dd>
              </dl>
            </article>
            <article class="info-panel">
              <p class="eyebrow">RELAXED SELF-DRIVE</p>
              <h3>Daily burden ${dailyBurden.burden_score}/100</h3>
              <dl>
                <dt>Drive</dt>
                <dd>${dailyBurden.drive_miles} mi · ${dailyBurden.drive_hours} hr estimate</dd>
                <dt>Hotel change</dt>
                <dd>${dailyBurden.hotel_change ? "Yes" : "No"} · attractions planned: ${dailyBurden.major_attractions}</dd>
                <dt>Rule</dt>
                <dd>${html(relaxedSelfDriveRules[0])}</dd>
              </dl>
            </article>
          </section>

          <section class="duration-ladder">
            <div class="section-heading">
              <div>
                <p class="eyebrow">CITY DURATION LADDER</p>
                <h3>${html(cityGuide.name)} first-time plans</h3>
              </div>
              <span class="status-pill">${cityGuide.status}</span>
            </div>
            <div class="ladder-grid">
              ${Object.entries(cityGuide.first_time_duration_guides)
                .map(
                  ([key, guide]) => `
                    <article class="ladder-card">
                      <strong>${html(key.replaceAll("_", " "))}</strong>
                      <span>${html(guide.pace)}</span>
                      <p>${html(guide.notes)}</p>
                      <small>${html(guide.schedule[0]?.time_range ?? "CONTENT_PENDING")}</small>
                    </article>
                  `,
                )
                .join("")}
            </div>
          </section>

          <section class="compiler-panel">
            <p class="eyebrow">TRIP COMPILER ENGINE</p>
            <h3>${planner.duration === "full" ? "Full Grand Tour" : `${planner.duration.replace("_plus", "+")} days`} · ${html(planner.theme)}</h3>
            <p>
              Compiler skeleton is active. Approved city-duration packs will become the building blocks here;
              missing packs stay marked CONTENT_PENDING instead of being invented.
            </p>
          </section>

          <div class="map-embed">
            <div>
              <p class="eyebrow">EXTERNAL MAPS</p>
              <h3>Continue in Google</h3>
              <p>
                The public guide keeps the route and attraction data available here, with direct handoff
                links for Google's map, Earth, and Street View experiences.
              </p>
              <div class="hero__actions">
                <a class="button primary" href="${trip.myMapsOpen}" target="_blank" rel="noreferrer">Open My Maps</a>
                <a class="button" href="${stopMapsUrl}" target="_blank" rel="noreferrer">Open Maps</a>
                <a class="button" href="${stopEarthUrl}" target="_blank" rel="noreferrer">Open Earth</a>
                <a class="button" href="${stopStreetViewUrl}" target="_blank" rel="noreferrer">Street View</a>
              </div>
            </div>
          </div>

          <div class="attraction-tools">
            <h3>${language === "cn" ? "景点导游" : "Attraction Guide"}</h3>
            <select id="priority-filter" aria-label="Filter attractions by priority">
              ${priorities
                .map((p) => `<option value="${html(p)}" ${p === selectedPriority ? "selected" : ""}>${html(p)}</option>`)
                .join("")}
            </select>
          </div>

          <div class="attractions">
            ${
              localAttractions.length
                ? localAttractions
                    .map(
                      (a) => {
                        const mapsUrl = safeUrl(a.Google_Maps_Search_URL, googleMapsSearch(a.Location));
                        const sourceUrl = a.Source_URL ? safeUrl(a.Source_URL, "") : "";
                        return `
                        <article class="attraction-card">
                          <div>
                            <span class="priority">${html(a.Priority)}</span>
                            <h4>${html(a.Map_Name)}</h4>
                            <p>${html(language === "cn" ? a.Story_Theme_CN : a.Location)}</p>
                          </div>
                          <dl>
                            <dt>${language === "cn" ? "怎么玩" : "How"}</dt>
                            <dd>${html(language === "cn" ? a.How_To_Experience_CN : a.Recommended_Time)}</dd>
                            <dt>${language === "cn" ? "看什么" : "Look For"}</dt>
                            <dd>${html(language === "cn" ? a.What_To_Look_For_CN : a.Best_Time)}</dd>
                            <dt>${language === "cn" ? "秋季重点" : "Autumn"}</dt>
                            <dd>${html(language === "cn" ? a.Autumn_Focus_CN : a.Practical_Tip_CN)}</dd>
                          </dl>
                          <div class="card-links">
                            <a href="${mapsUrl}" target="_blank" rel="noreferrer">Maps</a>
                            <a href="${googleEarthSearch(a.Location)}" target="_blank" rel="noreferrer">Earth</a>
                            <a href="${googleStreetView(a.Location)}" target="_blank" rel="noreferrer">Street View</a>
                            ${sourceUrl ? `<a href="${sourceUrl}" target="_blank" rel="noreferrer">Source</a>` : ""}
                          </div>
                        </article>
                      `;
                      },
                    )
                    .join("")
                : `<p class="empty">No attractions are listed for this stop yet.</p>`
            }
          </div>
        </section>
      </section>
    </main>
  `;
  bind();
  renderCanvas();
}

function bind() {
  document.querySelectorAll<HTMLButtonElement>("[data-stop]").forEach((button) => {
    button.addEventListener("click", () => {
      setStop(Number(button.dataset.stop));
      playing = false;
      render();
    });
  });
  document.querySelectorAll<HTMLButtonElement>("[data-drive]").forEach((button) => {
    button.addEventListener("click", () => {
      setStop(Number(button.dataset.drive));
      playing = false;
      render();
    });
  });
  document.querySelector("#prev-stop")?.addEventListener("click", () => {
    setStop(selectedStop - 1);
    render();
  });
  document.querySelector("#next-stop")?.addEventListener("click", () => {
    setStop(selectedStop + 1);
    render();
  });
  document.querySelector("#play")?.addEventListener("click", () => {
    playing = !playing;
    render();
  });
  document.querySelector("#mode")?.addEventListener("click", () => {
    visualMode = visualMode === "daylight" ? "night" : "daylight";
    render();
  });
  document.querySelector("#lang")?.addEventListener("click", () => {
    language = language === "cn" ? "en" : "cn";
    render();
  });
  document.querySelector("#narrate")?.addEventListener("click", speak);
  document.querySelector<HTMLSelectElement>("#priority-filter")?.addEventListener("change", (event) => {
    selectedPriority = (event.target as HTMLSelectElement).value;
    render();
  });
  document.querySelector<HTMLInputElement>("#route-progress")?.addEventListener("input", (event) => {
    setStop(Number((event.target as HTMLInputElement).value));
    playing = false;
    render();
  });
  document.querySelector<HTMLSelectElement>("#duration")?.addEventListener("change", (event) => {
    planner = { ...planner, duration: (event.target as HTMLSelectElement).value as CompilerInput["duration"] };
    render();
  });
  document.querySelector<HTMLSelectElement>("#visitor-profile")?.addEventListener("change", (event) => {
    planner = { ...planner, visitorProfile: (event.target as HTMLSelectElement).value as CompilerInput["visitorProfile"] };
    render();
  });
  document.querySelector<HTMLSelectElement>("#pace")?.addEventListener("change", (event) => {
    planner = { ...planner, pace: (event.target as HTMLSelectElement).value as CompilerInput["pace"] };
    render();
  });
  document.querySelector<HTMLSelectElement>("#drive-profile")?.addEventListener("change", (event) => {
    planner = { ...planner, drivingPreference: (event.target as HTMLSelectElement).value as CompilerInput["drivingPreference"] };
    render();
  });
  document.querySelector<HTMLSelectElement>("#theme")?.addEventListener("change", (event) => {
    planner = { ...planner, theme: (event.target as HTMLSelectElement).value };
    render();
  });
}

async function load() {
  const [routeCsv, attractionCsv, geojson] = await Promise.all([
    fetch(`${assetBase}data/route-stops.csv`).then((r) => r.text()),
    fetch(`${assetBase}data/attractions.csv`).then((r) => r.text()),
    fetch(`${assetBase}data/route-points.geojson`).then((r) => r.json()),
  ]);
  routeStops = withCoordinates(parseCsv(routeCsv) as RouteStop[], geojson.features as GeoPoint[]);
  attractions = parseCsv(attractionCsv) as Attraction[];
  render();
  requestAnimationFrame(tick);
}

function tick() {
  if (playing && !reduceMotion && routeStops.length) {
    routeProgress = (routeProgress + 0.0008) % 1;
    selectedStop = Math.round(routeProgress * (routeStops.length - 1));
    renderCanvas();
  }
  requestAnimationFrame(tick);
}

window.addEventListener("resize", renderCanvas);
load().catch((error) => {
  app.innerHTML = `<main class="error"><h1>Travel guide failed to load</h1><pre>${html(String(error))}</pre></main>`;
});
