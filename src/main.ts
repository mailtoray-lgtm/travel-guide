import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@phosphor-icons/web/regular";
import "@phosphor-icons/web/fill";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import "./styles.css";
import {
  amsterdamGuide,
  attractionName,
  compilerData,
  findDurationCity,
  findV2Stop,
  normalizePlace,
  type AmsterdamAttraction,
  type CompilerProduct,
  type V2Stop,
} from "./data";

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

type GeoPoint = {
  type: "Feature";
  properties: { name: string };
  geometry: { type: "Point"; coordinates: [number, number] };
};

type Planner = {
  duration: number;
  theme: string;
  pace: "relaxed" | "balanced" | "see_more";
  style: "classic_cultural" | "scenic_slow" | "grand_tour";
  language: "en" | "cn";
};

type JourneyBase = {
  name: string;
  country: string;
  allocation: number;
  route?: RouteStop;
  v2?: V2Stop;
  lat: number;
  lng: number;
};

type JournalDay = {
  index: number;
  dayNumber: number;
  baseDay: number;
  base: JourneyBase;
};

type TimelineItem = {
  period: string;
  time: string;
  title: string;
  detail: string;
  icon: string;
};

type NearbyItem = {
  id: string;
  name: string;
  minutes: number;
  note: string;
  image?: string;
  rating: number;
};

const app = document.querySelector<HTMLDivElement>("#app")!;
const assetBase = import.meta.env.BASE_URL;
const tripStart = new Date(2026, 9, 5);

const copy = {
  en: {
    eyebrow: "Europe Autumn Grand Tour",
    compile: "Compile trip",
    compileHint: "Build your finalized itinerary",
    route: "Your route across Europe",
    expand: "Expand map",
    collapse: "Close map",
    settings: "Trip settings",
    reset: "Reset",
    duration: "Duration",
    pace: "Pace",
    style: "Travel style",
    theme: "Theme",
    language: "Language",
    note: "Changes are staged until you compile the trip.",
    nearby: "Nearby worth exploring",
    driveNext: "Drive to next destination",
    stay: "Where you'll stay",
    lodgingStyle: "Canal-house boutique stay",
    lodgingNote: "Quiet central base; final property is selected during booking.",
    journal: "Journal view",
    overview: "Overview",
    totalDrive: "Est. total drive",
    save: "Save draft",
    download: "Download",
    viewAll: "View all",
    previous: "Previous day",
    next: "Next day",
    day: "Day",
    days: "days",
    bases: "bases",
    compiled: "Trip compiled from approved regional content.",
    saved: "Draft saved on this device.",
    downloaded: "Itinerary downloaded.",
    noDrive: "Stay local today",
    arrival: "Arrival and orientation",
    bookingNote: "Booking not included",
    curatedMoments: "curated moments",
    placesNearby: "places nearby",
    savedPlaces: "saved places",
    savedPlaceCount: "saved place",
    markDone: "Mark complete",
    completed: "Completed",
    whyVisit: "Why it belongs in your journey",
    savePlace: "Save place",
    savedPlace: "Saved",
    openMaps: "Open in Maps",
    closeDetails: "Close attraction details",
  },
  cn: {
    eyebrow: "欧洲秋季自驾大环线",
    compile: "生成行程",
    compileHint: "按天数、主题和节奏重新编排行程",
    route: "欧洲路线",
    expand: "展开地图",
    collapse: "关闭地图",
    settings: "行程设置",
    reset: "重置",
    duration: "天数",
    pace: "节奏",
    style: "旅行方式",
    theme: "主题",
    language: "语言",
    note: "更改设置后，点击生成行程才会更新路线。",
    nearby: "附近值得探索",
    driveNext: "前往下一站",
    stay: "住宿方向",
    lodgingStyle: "运河屋精品住宿",
    lodgingNote: "安静、方便步行；具体酒店在预订阶段决定。",
    journal: "旅行日志",
    overview: "总览",
    totalDrive: "预计驾驶总量",
    save: "保存草稿",
    download: "下载",
    viewAll: "查看全部",
    previous: "前一天",
    next: "后一天",
    day: "第",
    days: "天",
    bases: "个基地",
    compiled: "已使用审核通过的区域内容生成行程。",
    saved: "草稿已保存在本设备。",
    downloaded: "行程已下载。",
    noDrive: "今天不换城市",
    arrival: "抵达与方向感",
    bookingNote: "不含预订",
    curatedMoments: "个精选时刻",
    placesNearby: "个附近地点",
    savedPlaces: "个已保存地点",
    savedPlaceCount: "个已保存地点",
    markDone: "标记完成",
    completed: "已完成",
    whyVisit: "为什么值得放进行程",
    savePlace: "保存地点",
    savedPlace: "已保存",
    openMaps: "在地图中打开",
    closeDetails: "关闭景点详情",
  },
} as const;

const englishAmsterdam = {
  summary:
    "Amsterdam is best understood through three threads: water shaping the city, 17th-century trade becoming art and architecture, and 20th-century history becoming personal memory.",
  subtitle: "A city shaped by water, art and personal history",
  days: [
    [
      ["Morning", "09:30 – 12:00", "Arrive gently", "Leave the car at the hotel or a P+R, then orient around Dam Square."],
      ["Afternoon", "13:30 – 16:30", "Canal Belt and Jordaan", "Walk slowly through the canal ring; keep the first day intentionally light."],
      ["Evening", "17:00 – 18:15", "Canal cruise", "See the UNESCO canal ring from the water before an unhurried dinner."],
    ],
    [
      ["Morning", "09:00 – 11:30", "Rijksmuseum", "Use the Gallery of Honour to connect Dutch art, trade and civic identity."],
      ["Afternoon", "13:00 – 15:00", "Van Gogh Museum", "Follow the collection chronologically and notice how color and brushwork change."],
      ["Evening", "16:00 onward", "Museumplein reset", "Protect a long café break; do not add a third major museum."],
    ],
    [
      ["Morning", "09:00 – 10:30", "Anne Frank House", "Use a timed entry and leave breathing room after the visit."],
      ["Afternoon", "12:00 – 16:00", "Jordaan and Noordermarkt", "Walk Prinsengracht and Brouwersgracht without turning the neighborhood into a checklist."],
      ["Evening", "17:30 onward", "Magere Brug", "Close with the Amstel at blue hour, or stop early if the day already feels complete."],
    ],
  ],
};

const nearbyImageById: Record<string, string> = {
  rijksmuseum: "rijksmuseum.png",
  "van-gogh-museum": "van-gogh-museum.png",
  "anne-frank-house": "anne-frank-house.png",
  "amsterdam-canal-cruise-damrak": "canal-belt.png",
};

let routeStops: RouteStop[] = [];
let planner: Planner = { duration: 3, theme: "first_time_classic", pace: "relaxed", style: "classic_cultural", language: "en" };
let compiledPlanner: Planner = { ...planner };
let product: CompilerProduct | undefined;
let journeyBases: JourneyBase[] = [];
let journalDays: JournalDay[] = [];
let selectedDayIndex = 2;
let viewMode: "journal" | "overview" = "journal";
let mapExpanded = false;
let planDirty = false;
let statusMessage = "";
let mapInstance: L.Map | undefined;
let selectedAttractionId: string | undefined;
let attractionTriggerId: string | undefined;
const savedAttractions = new Set<string>();
const completedMoments = new Set<string>();

function html(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const next = text[index + 1];
    if (character === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
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

function safeMiles(value: string | number | undefined) {
  const match = String(value ?? "").replaceAll(",", "").match(/\d+(?:\.\d+)?/);
  const parsed = match ? Number(match[0]) : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

function withCoordinates(stops: RouteStop[], features: GeoPoint[]) {
  const geo = new Map<string, [number, number]>();
  features.forEach((feature) => {
    const key = normalizePlace(feature.properties.name.replace(/^Leg \d+:\s*/, "").split(",")[0]);
    geo.set(key, feature.geometry.coordinates);
  });
  return stops.map((stop, index) => {
    const v2 = findV2Stop(stop.Map_Name) ?? findV2Stop(stop.Location);
    const point = geo.get(normalizePlace(stop.Map_Name));
    return {
      ...stop,
      lng: v2?.anchor.longitude ?? point?.[0] ?? 4 + index * 0.2,
      lat: v2?.anchor.latitude ?? point?.[1] ?? 52 - index * 0.04,
    };
  });
}

function findRouteStop(value: string) {
  const needle = normalizePlace(value);
  return routeStops.find((stop) => {
    const name = normalizePlace(stop.Map_Name);
    const location = normalizePlace(stop.Location);
    return name === needle || name.includes(needle) || needle.includes(name) || location.includes(needle);
  });
}

function buildLongDurationProduct(nextPlanner: Planner) {
  const routeNames = routeStops
    .filter((stop) => typeof stop.lat === "number" && typeof stop.lng === "number")
    .map((stop) => stop.Map_Name)
    .filter((name, index, names) => names.findIndex((candidate) => normalizePlace(candidate) === normalizePlace(name)) === index);
  if (!routeNames.length) return undefined;

  const baseCount = Math.min(routeNames.length, Math.max(1, Math.ceil(nextPlanner.duration / 3)));
  const bases = Array.from({ length: baseCount }, (_, index) => {
    if (baseCount === 1) return routeNames[0];
    return routeNames[Math.round(index * (routeNames.length - 1) / (baseCount - 1))];
  });
  const even = Math.floor(nextPlanner.duration / baseCount);
  const extra = nextPlanner.duration % baseCount;

  return {
    id: `europe-grand-tour-${nextPlanner.duration}`,
    days: nextPlanner.duration,
    themes: [nextPlanner.theme],
    bases,
    allocation_days: bases.map((_, index) => even + (index < extra ? 1 : 0)),
    summary_cn: compilerData.duration_scope_rules[String(nextPlanner.duration)] ?? "A relaxed multi-region Europe journey.",
  } satisfies CompilerProduct;
}

function chooseProduct(nextPlanner: Planner) {
  const exact = compilerData.approved_short_products.filter((entry) => entry.days === nextPlanner.duration);
  const longestApprovedDuration = Math.max(...compilerData.approved_short_products.map((entry) => entry.days));
  return (
    exact.find((entry) => entry.themes.includes(nextPlanner.theme)) ??
    exact[0] ??
    (nextPlanner.duration > longestApprovedDuration ? buildLongDurationProduct(nextPlanner) : undefined) ??
    compilerData.approved_short_products
      .slice()
      .sort((a, b) => Math.abs(a.days - nextPlanner.duration) - Math.abs(b.days - nextPlanner.duration))[0]
  );
}

function makeJourneyBase(name: string, allocation: number): JourneyBase | undefined {
  const route = findRouteStop(name);
  const v2 = findV2Stop(name) ?? (route ? findV2Stop(route.Map_Name) : undefined);
  const lat = v2?.anchor.latitude ?? route?.lat;
  const lng = v2?.anchor.longitude ?? route?.lng;
  if (typeof lat !== "number" || typeof lng !== "number") return undefined;
  return {
    name: v2?.name ?? route?.Map_Name ?? name,
    country: v2?.country ?? route?.Country ?? "Europe",
    allocation,
    route,
    v2,
    lat,
    lng,
  };
}

function compileJourney(nextPlanner: Planner) {
  const selectedProduct = chooseProduct(nextPlanner);
  product = selectedProduct;
  const baseCount = Math.max(1, selectedProduct.bases.length);
  const even = Math.floor(selectedProduct.days / baseCount);
  let remaining = selectedProduct.days;
  journeyBases = selectedProduct.bases
    .map((name, index) => {
      const proposed = selectedProduct.allocation_days?.[index] ?? Math.max(1, even + (index < selectedProduct.days % baseCount ? 1 : 0));
      const allocation = index === baseCount - 1 ? Math.max(1, remaining) : Math.min(proposed, remaining);
      remaining -= allocation;
      return makeJourneyBase(name, allocation);
    })
    .filter((base): base is JourneyBase => Boolean(base));

  if (!journeyBases.length) {
    const amsterdam = makeJourneyBase("Amsterdam", nextPlanner.duration);
    if (amsterdam) journeyBases = [amsterdam];
  }

  journalDays = [];
  journeyBases.forEach((base) => {
    for (let baseDay = 1; baseDay <= base.allocation; baseDay += 1) {
      journalDays.push({
        index: journalDays.length,
        dayNumber: journalDays.length + 1,
        baseDay,
        base,
      });
    }
  });
  selectedDayIndex = Math.min(journalDays.length - 1, nextPlanner.duration === 3 ? 2 : 0);
  compiledPlanner = { ...nextPlanner };
  planDirty = false;
}

function dayDate(index: number) {
  const value = new Date(tripStart);
  value.setDate(value.getDate() + index);
  return value;
}

function dateParts(index: number, language = planner.language) {
  const date = dayDate(index);
  const locale = language === "cn" ? "zh-CN" : "en-US";
  return {
    weekday: new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date),
    monthDay: new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(date),
  };
}

function uniqueJourneyBases() {
  return journeyBases.filter((base, index, list) => index === list.findIndex((item) => item.name === base.name));
}

function haversineMiles(a: JourneyBase, b: JourneyBase) {
  const radius = 3958.8;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return Math.round(radius * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)) * 1.22);
}

function totalDriveMiles() {
  const bases = uniqueJourneyBases();
  if (bases.length === routeStops.length && bases.every((base) => base.route)) {
    return bases.reduce((sum, base) => sum + safeMiles(base.route?.Approx_Miles_From_Previous), 0);
  }
  return bases.slice(1).reduce((sum, base, index) => sum + haversineMiles(bases[index], base), 0);
}

function driveLabel() {
  const miles = totalDriveMiles();
  const hours = miles ? miles / 48 : 0;
  return `${miles.toLocaleString()} mi · ${hours.toFixed(1)} hr`;
}

function roleLabel(role: string | undefined) {
  if (!role) return "first-visit base";
  return role.replaceAll("_", " ").replace(/\bfive star\b/i, "signature");
}

function citySummary(day: JournalDay) {
  if (normalizePlace(day.base.name) === "amsterdam") {
    return planner.language === "cn" ? amsterdamGuide.first_time_summary_cn : englishAmsterdam.summary;
  }
  if (planner.language === "cn" && day.base.v2?.first_visit_story_cn) return day.base.v2.first_visit_story_cn;
  const highlights = (day.base.v2?.five_star ?? []).slice(0, 3).map(attractionName).join(", ");
  return `${day.base.name} is a ${roleLabel(day.base.v2?.role)} in this journey. Keep the visit focused on ${highlights || "the strongest first-visit anchors"}, with enough unplanned time for weather, rest and the character of the place.`;
}

function citySubtitle(day: JournalDay) {
  if (normalizePlace(day.base.name) === "amsterdam") {
    return planner.language === "cn" ? "从水理解城市，再进入艺术与个人历史" : englishAmsterdam.subtitle;
  }
  const first = day.base.v2?.five_star?.[0];
  return first
    ? `${attractionName(first)} · ${roleLabel(day.base.v2?.role)}`
    : roleLabel(day.base.v2?.role);
}

function genericSchedule(day: JournalDay): TimelineItem[] {
  const highlights = (day.base.v2?.five_star ?? []).map(attractionName);
  const duration = findDurationCity(day.base.name);
  const source = [
    ...(duration?.day_1 ?? []),
    ...(day.baseDay > 1 ? duration?.day_2_add ?? [] : []),
    ...(day.baseDay > 2 ? duration?.day_3_add ?? [] : []),
  ];
  const items = source.length ? source : highlights;
  if (planner.language === "cn") {
    const plans = day.base.v2?.plans ?? {};
    const key = day.baseDay >= 4 ? "4_plus" : `${day.baseDay}_day`;
    const cnItems = plans[key] ?? plans["3_days"] ?? plans["2_days"] ?? plans["1_day"] ?? [];
    return [
      { period: "上午", time: "09:00 – 12:00", title: cnItems[0] ?? items[0] ?? copy.cn.arrival, detail: "保留步行与进入状态的时间。", icon: "ph-sun" },
      { period: "下午", time: "13:30 – 17:00", title: cnItems[1] ?? items[1] ?? "城市主线", detail: "只保留一个主要锚点，并安排坐下休息。", icon: "ph-sun-horizon" },
      { period: "晚上", time: "17:30以后", title: cnItems[2] ?? items[2] ?? "自由探索", detail: "天气或体力不足时可以直接删除。", icon: "ph-moon" },
    ];
  }
  return [
    { period: "Morning", time: "09:00 – 12:00", title: items[0] ?? "Arrival and orientation", detail: `Begin with one defining ${day.base.name} experience, without rushing the first hour.`, icon: "ph-sun" },
    { period: "Afternoon", time: "13:30 – 17:00", title: items[1] ?? "Slow city exploration", detail: "Protect lunch and recovery time before the second anchor.", icon: "ph-sun-horizon" },
    { period: "Evening", time: "17:30 onward", title: items[2] ?? "Open evening", detail: "Keep this optional; a relaxed itinerary can end early.", icon: "ph-moon" },
  ];
}

function scheduleFor(day: JournalDay): TimelineItem[] {
  if (normalizePlace(day.base.name) !== "amsterdam") return genericSchedule(day);
  if (planner.language === "cn") return genericSchedule(day);
  const selected = englishAmsterdam.days[Math.min(englishAmsterdam.days.length - 1, day.baseDay - 1)];
  return selected.map(([period, time, title, detail], index) => ({
    period,
    time,
    title,
    detail,
    icon: ["ph-sun", "ph-sun-horizon", "ph-moon"][index],
  }));
}

function nearbyItems(day: JournalDay): NearbyItem[] {
  if (normalizePlace(day.base.name) === "amsterdam") {
    return amsterdamGuide.attractions.slice(0, 5).map((attraction: AmsterdamAttraction) => ({
      id: attraction.id,
      name: attraction.name,
      minutes: attraction.time_required_minutes,
      note: planner.language === "cn" ? attraction.why_it_matters_cn : englishAttractionNote(attraction.id),
      image: nearbyImageById[attraction.id],
      rating: attraction.editorial_rating,
    }));
  }
  return (day.base.v2?.five_star ?? []).slice(0, 5).map((attraction, index) => ({
    id: `${day.base.v2?.id ?? "place"}-${index}`,
    name: attractionName(attraction),
    minutes: index === 0 ? 150 : 90,
    note:
      planner.language === "cn" && typeof attraction !== "string" && attraction.focus_cn
        ? attraction.focus_cn
        : "A signature first-visit anchor from the approved regional guide.",
    rating: 5,
  }));
}

function englishAttractionNote(id: string) {
  const notes: Record<string, string> = {
    rijksmuseum: "Dutch art and history in one coherent first-visit story.",
    "van-gogh-museum": "Follow the artist's visual development chronologically.",
    "anne-frank-house": "A quiet, essential encounter with personal history.",
    "amsterdam-canal-cruise-damrak": "Read the city's structure from the water.",
    "royal-palace-amsterdam": "Civic wealth transformed into monumental architecture.",
  };
  return notes[id] ?? "A strong addition when time and energy allow.";
}

function nextDifferentBase(day: JournalDay) {
  return journalDays.slice(day.index + 1).find((candidate) => candidate.base.name !== day.base.name)?.base;
}

function dayRibbon() {
  const total = journalDays.length;
  const maxVisible = 7;
  let start = Math.max(0, selectedDayIndex - 3);
  if (start + maxVisible > total) start = Math.max(0, total - maxVisible);
  return journalDays.slice(start, start + maxVisible).map((day) => {
    const date = dateParts(day.index);
    return `
      <button class="day-tab ${day.index === selectedDayIndex ? "active" : ""}" data-day-index="${day.index}" aria-current="${day.index === selectedDayIndex ? "step" : "false"}">
        <span>${day.dayNumber}</span>
        <strong>${html(day.base.name)}</strong>
        <small>${html(date.monthDay)}</small>
      </button>`;
  }).join("");
}

function stars(count: number) {
  return `<span class="rating" aria-label="${count} star editorial priority">${Array.from({ length: count }, () => '<i class="ph-fill ph-star" aria-hidden="true"></i>').join("")}</span>`;
}

function mapSearchUrl(place: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;
}

function momentKey(day: JournalDay, index: number) {
  return `${product?.id ?? "journey"}:${day.index}:${index}`;
}

function persistReadingState() {
  localStorage.setItem("journey-journal-saved-places", JSON.stringify([...savedAttractions]));
  localStorage.setItem("journey-journal-completed-moments", JSON.stringify([...completedMoments]));
}

function restoreReadingSet(storageKey: string, target: Set<string>) {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    if (!Array.isArray(stored)) return;
    stored.forEach((value) => {
      if (typeof value === "string") target.add(value);
    });
  } catch {
    // Ignore malformed local-only UI state and keep the guide usable.
  }
}

function restorePlannerDraft() {
  try {
    const stored = JSON.parse(localStorage.getItem("journey-journal-draft") ?? "null") as {
      planner?: Partial<Planner>;
      selectedDayIndex?: unknown;
    } | null;
    const draft = stored?.planner;
    const duration = Number(draft?.duration);
    if (!draft || !compilerData.duration_options_days.includes(duration)) return undefined;

    const pace = ["relaxed", "balanced", "see_more"].includes(String(draft.pace))
      ? draft.pace as Planner["pace"]
      : planner.pace;
    const style = ["classic_cultural", "scenic_slow", "grand_tour"].includes(String(draft.style))
      ? draft.style as Planner["style"]
      : planner.style;
    const language = ["en", "cn"].includes(String(draft.language))
      ? draft.language as Planner["language"]
      : planner.language;
    const theme = compilerData.themes.some((entry) => entry.id === draft.theme)
      ? String(draft.theme)
      : planner.theme;

    planner = { duration, theme, pace, style, language };
    const dayIndex = Number(stored.selectedDayIndex);
    return Number.isFinite(dayIndex) ? Math.max(0, Math.floor(dayIndex)) : undefined;
  } catch {
    // Ignore malformed local-only draft data and keep the guide usable.
    return undefined;
  }
}

function attractionImage(item: NearbyItem, day: JournalDay) {
  const isAmsterdam = normalizePlace(day.base.name) === "amsterdam";
  return `${assetBase}assets/journey-journal/${item.image ?? (isAmsterdam ? "amsterdam-canal-autumn.png" : "europe-autumn-road.png")}`;
}

function attractionSheet(day: JournalDay) {
  if (!selectedAttractionId) return "";
  const text = copy[planner.language];
  const item = nearbyItems(day).find((candidate) => candidate.id === selectedAttractionId);
  if (!item) return "";
  const saved = savedAttractions.has(item.id);
  return `
    <div class="attraction-overlay">
      <button class="dialog-backdrop" id="close-attraction-backdrop" aria-label="${html(text.closeDetails)}"></button>
      <section class="attraction-sheet" role="dialog" aria-modal="true" aria-labelledby="attraction-title">
        <button class="sheet-close" id="close-attraction" aria-label="${html(text.closeDetails)}"><i class="ph ph-x" aria-hidden="true"></i></button>
        <figure>
          <img src="${attractionImage(item, day)}" alt="${html(item.name)}" />
          <figcaption>${html(day.base.name)} · ${item.minutes} min</figcaption>
        </figure>
        <div class="sheet-copy">
          <p class="sheet-kicker"><i class="ph ph-sparkle" aria-hidden="true"></i>${html(text.whyVisit)}</p>
          <h2 id="attraction-title">${html(item.name)}</h2>
          <div class="sheet-meta">
            <span><i class="ph ph-clock" aria-hidden="true"></i>${item.minutes} min</span>
            <span>${stars(item.rating)}</span>
            <span><i class="ph ph-map-pin" aria-hidden="true"></i>${html(day.base.name)}</span>
          </div>
          <p class="sheet-description">${html(item.note)}</p>
          <blockquote>${planner.language === "cn" ? "把景点当作故事的一部分，而不是待办清单。" : "Treat the place as part of the city's story—not another box to check."}</blockquote>
          <div class="sheet-actions">
            <button id="save-attraction" class="secondary-button ${saved ? "saved" : ""}" data-attraction-id="${html(item.id)}">
              <i class="${saved ? "ph-fill" : "ph"} ph-bookmark-simple" aria-hidden="true"></i>${html(saved ? text.savedPlace : text.savePlace)}
            </button>
            <a class="primary-link" href="${mapSearchUrl(`${item.name}, ${day.base.name}`)}" target="_blank" rel="noreferrer">
              ${html(text.openMaps)}<i class="ph ph-arrow-up-right" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </section>
    </div>`;
}

function journalContent(day: JournalDay) {
  const text = copy[planner.language];
  const date = dateParts(day.index);
  const schedule = scheduleFor(day);
  const nearby = nearbyItems(day);
  const nextBase = nextDifferentBase(day);
  const miles = nextBase ? haversineMiles(day.base, nextBase) : 0;
  const hours = miles ? Math.max(0.5, miles / 48) : 0;
  const isAmsterdam = normalizePlace(day.base.name) === "amsterdam";
  const completedCount = schedule.filter((_, index) => completedMoments.has(momentKey(day, index))).length;
  const hero = `${assetBase}assets/journey-journal/${isAmsterdam ? "amsterdam-canal-autumn.png" : "europe-autumn-road.png"}`;
  const hotel = `${assetBase}assets/journey-journal/${isAmsterdam ? "amsterdam-canal-hotel.png" : "paris-boutique-hotel.png"}`;
  return `
    <section class="journal-entry" aria-labelledby="city-title">
      <aside class="date-rail" aria-label="${html(`${text.day} ${day.dayNumber}, ${date.weekday} ${date.monthDay}`)}">
        <span>${html(text.day)}</span>
        <strong>${day.dayNumber}</strong>
        <small>${html(date.weekday)}</small>
        <small>${html(date.monthDay)}</small>
      </aside>

      <figure class="city-portrait">
        <img src="${hero}" alt="${html(isAmsterdam ? "Amsterdam canal houses in autumn light" : "An autumn road through a European valley")}" />
        <figcaption>${html(day.base.name)} · ${html(day.base.country)}</figcaption>
      </figure>

      <article class="city-story">
        <p class="kicker">${html(citySubtitle(day))}</p>
        <h1 id="city-title">${html(day.base.name)}, <span>${html(day.base.country)}</span></h1>
        <p class="story-lead">${html(citySummary(day))}</p>

        <div class="day-summary" aria-label="Day reading progress">
          <div class="reading-progress">
            <span><i class="ph ph-check-circle" aria-hidden="true"></i>${completedCount}/${schedule.length} ${html(text.curatedMoments)}</span>
            <progress max="${schedule.length}" value="${completedCount}">${completedCount} of ${schedule.length}</progress>
          </div>
          <span><i class="ph ph-map-pin" aria-hidden="true"></i>${nearby.length} ${html(text.placesNearby)}</span>
          <span><i class="ph ph-bookmark-simple" aria-hidden="true"></i>${savedAttractions.size} ${html(savedAttractions.size === 1 ? text.savedPlaceCount : text.savedPlaces)}</span>
        </div>

        <div class="story-columns">
          <div class="timeline" aria-label="Day plan">
            ${schedule.map((item, index) => {
              const key = momentKey(day, index);
              const complete = completedMoments.has(key);
              return `
              <section class="timeline-item moment-${index + 1} ${complete ? "completed" : ""}">
                <span class="timeline-icon"><i class="ph ${item.icon}" aria-hidden="true"></i></span>
                <div class="timeline-card">
                  <header><span><strong>${html(item.period)}</strong><time>${html(item.time)}</time></span><button class="complete-stop" data-complete-key="${html(key)}" aria-pressed="${complete}" title="${html(complete ? text.completed : text.markDone)}"><i class="${complete ? "ph-fill ph-check-circle" : "ph ph-circle"}" aria-hidden="true"></i><span class="sr-only">${html(complete ? text.completed : text.markDone)}</span></button></header>
                  <h2>${html(item.title)}</h2>
                  <p>${html(item.detail)}</p>
                </div>
              </section>`;
            }).join("")}
          </div>

          <aside class="nearby" id="nearby-list">
            <h2>${html(text.nearby)}</h2>
            <div class="nearby-list">
              ${nearby.map((item) => `
                <button class="nearby-item ${savedAttractions.has(item.id) ? "saved" : ""}" data-attraction-id="${html(item.id)}">
                  ${item.image ? `<img src="${assetBase}assets/journey-journal/${item.image}" alt="${html(item.name)}" />` : `<span class="nearby-icon"><i class="ph ph-map-pin" aria-hidden="true"></i></span>`}
                  <span class="nearby-copy">
                    <strong>${html(item.name)}</strong>
                    <small>${item.minutes} min · ${stars(item.rating)}</small>
                    <em>${html(item.note)}</em>
                  </span>
                  <i class="${savedAttractions.has(item.id) ? "ph-fill ph-bookmark-simple" : "ph ph-caret-right"}" aria-hidden="true"></i>
                </button>`).join("")}
            </div>
            <a class="text-link" href="${mapSearchUrl(`${day.base.name} attractions`)}" target="_blank" rel="noreferrer">
              ${html(text.viewAll)} ${html(day.base.name)} <i class="ph ph-arrow-up-right" aria-hidden="true"></i>
            </a>
          </aside>
        </div>
      </article>

      <section class="drive-card">
        <span class="feature-icon rust"><i class="ph ph-car-profile" aria-hidden="true"></i></span>
        <div>
          <p>${html(text.driveNext)}</p>
          <strong>${nextBase ? `${html(day.base.name)} <i class="ph ph-arrow-right" aria-hidden="true"></i> ${html(nextBase.name)}` : html(text.noDrive)}</strong>
          <small>${nextBase ? (planner.language === "cn" ? "下午三点后不为增加景点赶路。" : "Keep the transfer light; no major timed attraction after a late arrival.") : (planner.language === "cn" ? "慢走、坐下吃饭，并保留恢复时间。" : "Walk, eat slowly and protect recovery time.")}</small>
        </div>
        <dl>
          <div><dt>${planner.language === "cn" ? "距离" : "Distance"}</dt><dd>${miles ? `~${miles} mi` : "—"}</dd></div>
          <div><dt>${planner.language === "cn" ? "时间" : "Duration"}</dt><dd>${hours ? `~${hours.toFixed(1)} hr` : "—"}</dd></div>
        </dl>
      </section>

      <section class="stay-card">
        <span class="feature-icon olive"><i class="ph ph-bed" aria-hidden="true"></i></span>
        <div>
          <p>${html(text.stay)}</p>
          <strong>${html(text.lodgingStyle)}</strong>
          <small>${html(text.lodgingNote)} · ${html(text.bookingNote)}</small>
        </div>
        <img src="${hotel}" alt="${html(isAmsterdam ? "Warm canal-house boutique hotel room" : "Warm European boutique hotel room")}" />
      </section>

      <nav class="day-controls" aria-label="Day navigation">
        <button id="previous-day" ${selectedDayIndex === 0 ? "disabled" : ""}><i class="ph ph-arrow-left" aria-hidden="true"></i>${html(text.previous)}</button>
        <label for="day-progress"><span class="sr-only">Journey day</span><input id="day-progress" type="range" min="1" max="${journalDays.length}" value="${selectedDayIndex + 1}" /></label>
        <button id="next-day" ${selectedDayIndex === journalDays.length - 1 ? "disabled" : ""}>${html(text.next)}<i class="ph ph-arrow-right" aria-hidden="true"></i></button>
      </nav>
    </section>`;
}

function overviewContent() {
  const text = copy[planner.language];
  return `
    <section class="overview-panel" aria-labelledby="overview-title">
      <p class="kicker">${html(product?.id.replaceAll("-", " ") ?? "compiled journey")}</p>
      <h1 id="overview-title">${journalDays.length} ${html(text.days)} · ${uniqueJourneyBases().length} ${html(text.bases)}</h1>
      <p class="story-lead">${html(product?.summary_cn ?? compilerData.duration_scope_rules[String(compiledPlanner.duration)] ?? "")}</p>
      <div class="overview-days">
        ${journalDays.map((day) => {
          const date = dateParts(day.index);
          const first = day.base.v2?.five_star?.[0];
          return `<button data-day-index="${day.index}" class="overview-day">
            <span>${day.dayNumber}</span>
            <div><strong>${html(day.base.name)}</strong><small>${html(date.monthDay)} · ${html(first ? attractionName(first) : copy[planner.language].arrival)}</small></div>
            <i class="ph ph-arrow-right" aria-hidden="true"></i>
          </button>`;
        }).join("")}
      </div>
    </section>`;
}

function themeOptions() {
  return compilerData.themes.map((theme) =>
    `<option value="${html(theme.id)}" ${planner.theme === theme.id ? "selected" : ""}>${html(theme.label)}</option>`,
  ).join("");
}

function durationOptions() {
  return compilerData.duration_options_days.map((days) =>
    `<option value="${days}" ${planner.duration === days ? "selected" : ""}>${days} ${copy[planner.language].days}</option>`,
  ).join("");
}

function render() {
  mapInstance?.remove();
  mapInstance = undefined;
  const text = copy[planner.language];
  const day = journalDays[selectedDayIndex] ?? journalDays[0];
  if (!day) return;
  app.innerHTML = `
    <div class="journal-shell ${mapExpanded ? "map-expanded" : ""}">
      <header class="journal-header">
        <a class="brand" href="#" aria-label="Journey Journal home">
          <i class="ph ph-compass-rose" aria-hidden="true"></i>
          <span><strong>Journey Journal</strong><small>${html(text.eyebrow)}</small></span>
        </a>
        <nav class="day-ribbon" aria-label="Journey days">${dayRibbon()}</nav>
        <button class="compile-button" id="compile-top">
          <i class="ph ph-map-trifold" aria-hidden="true"></i>
          <span><strong>${html(text.compile)}</strong><small>${html(text.compileHint)}</small></span>
        </button>
      </header>

      <div class="workspace">
        <main class="journal-main">${viewMode === "journal" ? journalContent(day) : overviewContent()}</main>
        <aside class="planner-side">
          <section class="map-card ${mapExpanded ? "expanded" : ""}">
            <header>
              <h2>${html(text.route)}</h2>
              <button id="expand-map" class="quiet-button" aria-expanded="${mapExpanded}">
                ${html(mapExpanded ? text.collapse : text.expand)}
                <i class="ph ${mapExpanded ? "ph-arrows-in" : "ph-arrows-out"}" aria-hidden="true"></i>
              </button>
            </header>
            <div id="route-map" role="img" aria-label="Interactive map of the compiled Europe route"></div>
          </section>

          <section class="settings-card">
            <header><h2>${html(text.settings)}</h2><button id="reset-plan" class="reset-button"><i class="ph ph-arrow-counter-clockwise" aria-hidden="true"></i>${html(text.reset)}</button></header>
            <div class="setting-row">
              <label for="duration"><i class="ph ph-calendar-dots" aria-hidden="true"></i>${html(text.duration)}</label>
              <select id="duration">${durationOptions()}</select>
            </div>
            <div class="setting-row">
              <label for="pace"><i class="ph ph-gauge" aria-hidden="true"></i>${html(text.pace)}</label>
              <select id="pace">
                <option value="relaxed" ${planner.pace === "relaxed" ? "selected" : ""}>${planner.language === "cn" ? "轻松" : "Relaxed"}</option>
                <option value="balanced" ${planner.pace === "balanced" ? "selected" : ""}>${planner.language === "cn" ? "平衡" : "Balanced"}</option>
                <option value="see_more" ${planner.pace === "see_more" ? "selected" : ""}>${planner.language === "cn" ? "多看一些" : "See more"}</option>
              </select>
            </div>
            <div class="setting-row">
              <label for="style"><i class="ph ph-binoculars" aria-hidden="true"></i>${html(text.style)}</label>
              <select id="style">
                <option value="classic_cultural" ${planner.style === "classic_cultural" ? "selected" : ""}>${planner.language === "cn" ? "经典文化" : "Classic & Cultural"}</option>
                <option value="scenic_slow" ${planner.style === "scenic_slow" ? "selected" : ""}>${planner.language === "cn" ? "风景慢游" : "Scenic & Slow"}</option>
                <option value="grand_tour" ${planner.style === "grand_tour" ? "selected" : ""}>${planner.language === "cn" ? "欧洲大环线" : "Grand Tour"}</option>
              </select>
            </div>
            <div class="setting-row">
              <label for="theme"><i class="ph ph-palette" aria-hidden="true"></i>${html(text.theme)}</label>
              <select id="theme">${themeOptions()}</select>
            </div>
            <div class="setting-row">
              <label for="language"><i class="ph ph-translate" aria-hidden="true"></i>${html(text.language)}</label>
              <select id="language">
                <option value="en" ${planner.language === "en" ? "selected" : ""}>English</option>
                <option value="cn" ${planner.language === "cn" ? "selected" : ""}>中文</option>
              </select>
            </div>
            <p class="settings-note ${planDirty ? "dirty" : ""}"><i class="ph ${planDirty ? "ph-warning-circle" : "ph-info"}" aria-hidden="true"></i>${html(text.note)}</p>
          </section>
        </aside>
      </div>

      <footer class="journal-footer">
        <div class="view-switch" role="tablist" aria-label="Journey views">
          <button id="journal-view" role="tab" aria-selected="${viewMode === "journal"}" class="${viewMode === "journal" ? "active" : ""}"><i class="ph ph-book-open-text" aria-hidden="true"></i>${html(text.journal)}</button>
          <button id="overview-view" role="tab" aria-selected="${viewMode === "overview"}" class="${viewMode === "overview" ? "active" : ""}"><i class="ph ph-list-bullets" aria-hidden="true"></i>${html(text.overview)}</button>
        </div>
        <div class="drive-total"><span>${html(text.totalDrive)}</span><strong>${html(driveLabel())}</strong></div>
        <div class="footer-actions">
          <button id="download-plan" class="icon-action" title="${html(text.download)}"><i class="ph ph-download-simple" aria-hidden="true"></i><span class="sr-only">${html(text.download)}</span></button>
          <button id="save-plan" class="secondary-button"><i class="ph ph-bookmark-simple" aria-hidden="true"></i>${html(text.save)}</button>
          <button id="compile-bottom" class="compile-button compact"><span><strong>${html(text.compile)}</strong></span><i class="ph ph-arrow-right" aria-hidden="true"></i></button>
        </div>
      </footer>
      ${attractionSheet(day)}
      <div class="toast ${statusMessage ? "show" : ""}" role="status" aria-live="polite">${html(statusMessage)}</div>
    </div>`;
  bindInteractions();
  renderMap(day);
}

function renderMap(day: JournalDay) {
  const container = document.querySelector<HTMLElement>("#route-map");
  if (!container) return;
  mapInstance = L.map(container, { zoomControl: true, scrollWheelZoom: false });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(mapInstance);

  const fullRoute = routeStops
    .filter((stop) => typeof stop.lat === "number" && typeof stop.lng === "number")
    .map((stop) => [stop.lat!, stop.lng!] as L.LatLngTuple);
  if (fullRoute.length > 1) {
    L.polyline(fullRoute, { color: "#3f5e30", weight: 2.5, opacity: 0.5, dashArray: "4 7" }).addTo(mapInstance);
    routeStops.forEach((stop, index) => {
      if (index % 6 !== 0 && index !== routeStops.length - 1) return;
      const contextMarker = L.circleMarker([stop.lat!, stop.lng!], {
        radius: 3.5,
        color: "#fffdf6",
        weight: 1.5,
        fillColor: "#c57620",
        fillOpacity: 0.78,
      }).addTo(mapInstance!);
      contextMarker.bindTooltip(stop.Map_Name, { direction: "right", className: "map-tooltip" });
    });
  }

  const bases = uniqueJourneyBases();
  const activeRoute = bases.map((base) => [base.lat, base.lng] as L.LatLngTuple);
  if (activeRoute.length > 1) {
    L.polyline(activeRoute, { color: "#3f5e30", weight: 4, opacity: 0.92 }).addTo(mapInstance);
  }
  bases.forEach((base) => {
    const selected = base.name === day.base.name;
    const marker = L.circleMarker([base.lat, base.lng], {
      radius: selected ? 8 : 6,
      color: "#fffdf6",
      weight: 3,
      fillColor: selected ? "#c64a24" : "#3f5e30",
      fillOpacity: 1,
    }).addTo(mapInstance!);
    marker.bindTooltip(base.name, { direction: "right", className: "map-tooltip" });
    marker.on("click", () => {
      const nextIndex = journalDays.findIndex((entry) => entry.base.name === base.name);
      if (nextIndex >= 0) {
        selectedDayIndex = nextIndex;
        render();
      }
    });
  });

  if (activeRoute.length > 1) {
    mapInstance.fitBounds(L.latLngBounds(activeRoute), { padding: [28, 28], maxZoom: 5 });
  } else if (fullRoute.length > 1) {
    mapInstance.fitBounds(L.latLngBounds(fullRoute), { padding: [24, 24], maxZoom: 4 });
  } else {
    mapInstance.setView(activeRoute[0] ?? [50.4, 8.7], activeRoute.length ? 11 : 4);
  }
  window.setTimeout(() => mapInstance?.invalidateSize(), 50);
}

function setStatus(message: string) {
  statusMessage = message;
  render();
  window.setTimeout(() => {
    statusMessage = "";
    document.querySelector(".toast")?.classList.remove("show");
  }, 2600);
}

function updatePlannerFromControls() {
  const duration = Number((document.querySelector<HTMLSelectElement>("#duration")?.value ?? planner.duration));
  const theme = document.querySelector<HTMLSelectElement>("#theme")?.value ?? planner.theme;
  const pace = (document.querySelector<HTMLSelectElement>("#pace")?.value ?? planner.pace) as Planner["pace"];
  const style = (document.querySelector<HTMLSelectElement>("#style")?.value ?? planner.style) as Planner["style"];
  planner = { ...planner, duration, theme, pace, style };
  planDirty =
    planner.duration !== compiledPlanner.duration ||
    planner.theme !== compiledPlanner.theme ||
    planner.pace !== compiledPlanner.pace ||
    planner.style !== compiledPlanner.style;
  render();
}

function bindInteractions() {
  document.querySelectorAll<HTMLElement>("[data-day-index]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedDayIndex = Number(button.dataset.dayIndex ?? 0);
      viewMode = "journal";
      render();
    });
  });
  document.querySelector(".brand")?.addEventListener("click", (event) => {
    event.preventDefault();
    selectedDayIndex = 0;
    viewMode = "journal";
    render();
  });
  document.querySelector("#previous-day")?.addEventListener("click", () => {
    selectedDayIndex = Math.max(0, selectedDayIndex - 1);
    render();
  });
  document.querySelector("#next-day")?.addEventListener("click", () => {
    selectedDayIndex = Math.min(journalDays.length - 1, selectedDayIndex + 1);
    render();
  });
  document.querySelector<HTMLInputElement>("#day-progress")?.addEventListener("input", (event) => {
    selectedDayIndex = Number((event.currentTarget as HTMLInputElement).value) - 1;
    render();
  });
  document.querySelectorAll<HTMLButtonElement>(".complete-stop").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.completeKey;
      if (!key) return;
      if (completedMoments.has(key)) completedMoments.delete(key);
      else completedMoments.add(key);
      persistReadingState();
      render();
    });
  });
  document.querySelectorAll<HTMLButtonElement>(".nearby-item[data-attraction-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedAttractionId = button.dataset.attractionId;
      attractionTriggerId = button.dataset.attractionId;
      render();
      window.setTimeout(() => document.querySelector<HTMLButtonElement>("#close-attraction")?.focus(), 0);
    });
  });
  const closeAttraction = () => {
    const triggerId = attractionTriggerId ?? selectedAttractionId;
    selectedAttractionId = undefined;
    render();
    window.setTimeout(() => {
      const trigger = [...document.querySelectorAll<HTMLButtonElement>(".nearby-item[data-attraction-id]")]
        .find((button) => button.dataset.attractionId === triggerId);
      trigger?.focus();
      attractionTriggerId = undefined;
    }, 0);
  };
  document.querySelector("#close-attraction")?.addEventListener("click", closeAttraction);
  document.querySelector("#close-attraction-backdrop")?.addEventListener("click", closeAttraction);
  document.querySelector<HTMLButtonElement>("#save-attraction")?.addEventListener("click", (event) => {
    const id = (event.currentTarget as HTMLButtonElement).dataset.attractionId;
    if (!id) return;
    if (savedAttractions.has(id)) savedAttractions.delete(id);
    else savedAttractions.add(id);
    persistReadingState();
    render();
  });
  document.onkeydown = (event) => {
    if (event.key === "Escape" && selectedAttractionId) closeAttraction();
  };
  ["duration", "theme", "pace", "style"].forEach((id) => {
    document.querySelector(`#${id}`)?.addEventListener("change", updatePlannerFromControls);
  });
  document.querySelector<HTMLSelectElement>("#language")?.addEventListener("change", (event) => {
    planner.language = (event.currentTarget as HTMLSelectElement).value as Planner["language"];
    compiledPlanner.language = planner.language;
    render();
  });
  const compile = () => {
    compileJourney(planner);
    viewMode = "journal";
    setStatus(copy[planner.language].compiled);
  };
  document.querySelector("#compile-top")?.addEventListener("click", compile);
  document.querySelector("#compile-bottom")?.addEventListener("click", compile);
  document.querySelector("#reset-plan")?.addEventListener("click", () => {
    planner = { duration: 3, theme: "first_time_classic", pace: "relaxed", style: "classic_cultural", language: planner.language };
    compileJourney(planner);
    render();
  });
  document.querySelector("#expand-map")?.addEventListener("click", () => {
    mapExpanded = !mapExpanded;
    render();
  });
  document.querySelector("#journal-view")?.addEventListener("click", () => {
    viewMode = "journal";
    render();
  });
  document.querySelector("#overview-view")?.addEventListener("click", () => {
    viewMode = "overview";
    render();
  });
  document.querySelector("#save-plan")?.addEventListener("click", () => {
    localStorage.setItem("journey-journal-draft", JSON.stringify({
      planner: compiledPlanner,
      selectedDayIndex,
      savedAttractions: [...savedAttractions],
      completedMoments: [...completedMoments],
    }));
    persistReadingState();
    setStatus(copy[planner.language].saved);
  });
  document.querySelector("#download-plan")?.addEventListener("click", () => {
    const payload = journalDays.map((day) => ({
      day: day.dayNumber,
      date: dayDate(day.index).toISOString().slice(0, 10),
      base: day.base.name,
      country: day.base.country,
      schedule: scheduleFor(day).map(({ period, time, title, detail }) => ({ period, time, title, detail })),
    }));
    const blob = new Blob([JSON.stringify({ product: product?.id, planner: compiledPlanner, itinerary: payload }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `journey-journal-${product?.id ?? "trip"}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus(copy[planner.language].downloaded);
  });
}

async function load() {
  try {
    restoreReadingSet("journey-journal-saved-places", savedAttractions);
    restoreReadingSet("journey-journal-completed-moments", completedMoments);
    const restoredDayIndex = restorePlannerDraft();
    const [routeText, geoResponse] = await Promise.all([
      fetch(`${assetBase}data/route-stops.csv`).then((response) => {
        if (!response.ok) throw new Error(`Route data ${response.status}`);
        return response.text();
      }),
      fetch(`${assetBase}data/route-points.geojson`).then((response) => {
        if (!response.ok) throw new Error(`Route geometry ${response.status}`);
        return response.json();
      }),
    ]);
    const features = ((geoResponse as { features?: GeoPoint[] }).features ?? []);
    routeStops = withCoordinates(parseCsv(routeText) as unknown as RouteStop[], features);
    compileJourney(planner);
    if (restoredDayIndex !== undefined) {
      selectedDayIndex = Math.min(restoredDayIndex, journalDays.length - 1);
    }
    render();
  } catch (error) {
    app.innerHTML = `<main class="load-error"><i class="ph ph-warning-circle" aria-hidden="true"></i><h1>Journey data could not be loaded</h1><p>${html(error instanceof Error ? error.message : "Unknown error")}</p></main>`;
  }
}

void load();
