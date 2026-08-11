# BLACKBOARD ADDENDUM — PRECISE GPS, CITY-DURATION MUST-SEE & RELAXED SELF-DRIVE

**Project:** `mailtoray-lgtm/travel-guide`  
**Owner:** Ray  
**Content planner / research organizer:** ChatGPT  
**Implementation agent:** Codex  
**Status:** ACTIVE / HARD REQUIREMENTS  
**Date:** 2026-08-11

This addendum is mandatory and supplements `docs/BLACKBOARD_CONTENT_RESEARCH_AND_TRIP_PLANNER.md`.

---

## 1. PRECISE GPS COORDINATES ARE MANDATORY

Every mappable entity must have a verified geographic locator.

Required entities:

- route stop / overnight base;
- city/base center;
- attraction;
- sub-attraction when it is a physically distinct point;
- viewpoint;
- parking/arrival point when explicitly recommended;
- ferry terminal;
- scenic-road waypoint when it is part of a guided route;
- trailhead / cable-car station where relevant;
- Street View target when a specific entry viewpoint is recommended.

### Required fields

```json
{
  "latitude": 0.0,
  "longitude": 0.0,
  "coordinate_precision": "exact|entrance|site_center|viewpoint|city_center|approximate",
  "coordinate_source": "...",
  "coordinate_verified_date": "YYYY-MM-DD"
}
```

### Precision rules

1. **Attractions:** use the actual attraction/site coordinate, not only the city center.
2. **Large sites:** prefer the practical visitor entrance or official visitor center when the user needs to navigate there; optionally store a separate `site_center`.
3. **Viewpoints:** use the actual viewpoint coordinates.
4. **Ferry terminals:** use the correct passenger/vehicle terminal, not a generic city-port coordinate.
5. **Cable cars:** distinguish lower station and upper destination when both matter.
6. **Trail experiences:** store trailhead separately from summit/viewpoint.
7. **City route stops:** may use a sensible central landmark or recommended lodging/parking zone only if explicitly documented; otherwise use city center and label it `city_center`.
8. **Never invent decimal coordinates.**
9. If exact coordinates cannot be verified, mark `coordinate_precision: approximate` and `CONTENT_REFRESH_REQUIRED`.
10. Codex must not silently geocode vague names into production data without preserving the chosen result and source.

### Validation

Codex must add automated checks:

- latitude in `[-90, 90]`;
- longitude in `[-180, 180]`;
- required map entities cannot have null coordinates;
- no accidental `(0,0)`;
- no duplicate coordinates for obviously different attractions unless they intentionally share one complex;
- coordinate precision/source fields required for researched city-guide packages.

---

## 2. COORDINATE SOURCE PRIORITY

ChatGPT research should prefer, in order:

1. official attraction / museum / park / operator location;
2. official tourism map or government GIS/open data;
3. Google Maps place location when lawfully accessed and used according to platform terms;
4. OpenStreetMap / Wikidata / other reputable geospatial source as a cross-check;
5. manual cross-verification against map imagery/address.

For important 5-star attractions, use at least two-location sanity checks when practical.

The research pack should preserve source URLs or source identifiers.

---

## 3. CITY GUIDE MUST SUPPORT 1-DAY / 2-DAY / 3-DAY / 4+-DAY VISITS

For every major city/base, ChatGPT will create a **first-time visitor duration ladder**.

At minimum:

### 1 DAY — MUST SEE

Purpose:

- first-time visitor;
- no wasted cross-city movement;
- only essential 5-star sites plus at most one exceptionally efficient 4-star experience;
- one coherent city story;
- protected meal/rest time;
- no impossible museum stacking.

Target structure:

- morning anchor;
- lunch / recovery;
- afternoon anchor;
- golden-hour/evening walk or view;
- optional night experience only if it adds real value.

### 2 DAYS — MUST SEE + CITY UNDERSTANDING

Day 1:

- iconic/core first-time story.

Day 2:

- second major theme;
- strongest 4-star recommendations;
- one slower neighborhood/park/viewpoint component;
- less rushed than two one-day itineraries stacked together.

### 3 DAYS — COMPLETE FIRST VISIT

Should normally include:

- all true 5-star essentials;
- best 4-star additions;
- at least one slower local/landscape period;
- one evening or sunrise/golden-hour experience;
- weather substitution option;
- enough free time that visitor can enjoy meals and spontaneous discoveries.

### 4+ DAYS — RELAXED / DEEPER

Add selectively:

- day trips;
- secondary neighborhoods;
- specialized museums;
- countryside;
- return to favorite districts;
- photography time;
- weather flex;
- true rest blocks.

Do not fill every hour simply because more days exist.

---

## 4. DURATION LADDER DATA MODEL

Suggested schema:

```json
{
  "city_id": "rome",
  "first_time_duration_guides": {
    "1_day": {
      "pace": "balanced",
      "must_see": [],
      "schedule": [],
      "walking_load": "medium",
      "notes": "..."
    },
    "2_days": {
      "pace": "relaxed_balanced",
      "must_see": [],
      "schedule": []
    },
    "3_days": {
      "pace": "relaxed",
      "must_see": [],
      "schedule": []
    },
    "4_plus_days": {
      "pace": "slow",
      "optional_extensions": []
    }
  }
}
```

Each schedule block should include:

- start time range, not false minute-level precision;
- attraction/site ID;
- transfer mode;
- expected transfer time;
- visit duration;
- meal/rest block;
- reservation sensitivity;
- best light/time-of-day;
- weather dependency;
- skip rule if tired.

---

## 5. RELAXED SELF-DRIVING IS A CORE PRODUCT MODE

The self-drive itinerary must not behave like a bus tour.

Owner's target philosophy:

- approximately **220 miles/day or less** is comfortable for ordinary transfer days;
- scenic/mountain/coastal roads may require much shorter mileage;
- longer overall trip is acceptable;
- extra rest/scenic stops are desirable;
- autumn scenery is more important than maximizing attraction count.

Codex should implement this as a first-class planning profile:

### RELAXED SELF-DRIVE

Default target rules:

- target road miles: **120–180 mi/day** on scenic travel days;
- comfortable upper target: **~220 mi/day** on ordinary transfer days;
- avoid consecutive upper-limit days;
- after 2 substantial driving days, strongly prefer a 2-night base or light day;
- mountain roads should be scored by time/road difficulty, not miles alone;
- arrival days should not contain a major 3–4 hour museum unless arrival is early and easy;
- parking/check-in/walk-to-center time counts as travel burden;
- ferry days count as recovery only when cabin/rest quality is adequate;
- do not schedule important scenic roads after dark;
- do not force sunrise after a late-arrival driving day.

---

## 6. DAILY SELF-DRIVE RHYTHM

Recommended default rhythms:

### SCENIC TRANSFER DAY

- breakfast without rush;
- leave roughly 9:00–10:00 unless light/weather argues otherwise;
- 1 scenic stop around 60–90 minutes;
- lunch / coffee break;
- arrive destination ideally 15:00–17:00;
- check-in and decompress;
- one easy golden-hour walk/viewpoint;
- dinner;
- no major night checklist.

### SHORT TRANSFER + SIGHTSEEING DAY

- drive 60–120 miles;
- arrive by lunch;
- hotel/parking/settle;
- one major afternoon attraction;
- relaxed evening.

### NO-DRIVE CITY DAY

- one major morning attraction;
- proper lunch/rest block;
- one major or moderate afternoon attraction;
- evening walk / optional performance;
- no need to use the car in dense historic centers.

### MOUNTAIN WEATHER DAY

- keep major cable-car/high-viewpoint attraction flexible;
- use clear-weather window first;
- indoor/village alternatives if clouded;
- avoid locking expensive high-alpine activities to bad visibility where reservation rules permit flexibility.

### REST / RECOVERY DAY

A real itinerary should include days where the visitor can:

- sleep later;
- do laundry;
- shop for road supplies;
- service/refuel vehicle;
- walk a waterfront/park;
- enjoy a long lunch;
- skip sightseeing without feeling itinerary failure.

---

## 7. MINIMUM REST RULES FOR COMPILER

Trip Compiler should consider these default constraints for `Relaxed Self-Drive`:

1. No more than 2 consecutive meaningful transfer days when avoidable.
2. A `★★★★★ autumn/weather-sensitive` base should normally receive 2+ nights, often 3–4.
3. A city with 2 full sightseeing days should usually have 3 nights if arriving by meaningful drive.
4. A one-night stop may be used for route protection, but must explain `why_stop_exists`.
5. Avoid hotel changes every night for long stretches.
6. Prefer 2–4 night hubs when several attractions can be reached locally.
7. Protect at least one light/recovery period per 5–7 travel days.
8. Arrival after ~17:00 should generally not count as a usable sightseeing day.
9. Departure before ~09:00 should be used only for a strong reason such as ferry, reserved entry, sunrise, or long transfer.
10. Parking and old-town access complexity must influence `daily_burden_score`.

---

## 8. DAILY BURDEN SCORE

Mileage alone is insufficient.

Codex should support a planning field such as:

```json
{
  "daily_burden": {
    "drive_miles": 175,
    "drive_hours": 4.0,
    "mountain_road_hours": 1.5,
    "border_crossing": false,
    "ferry": false,
    "hotel_change": true,
    "major_attractions": 1,
    "walking_hours": 2.5,
    "reservation_pressure": "low",
    "burden_score": 42
  }
}
```

The exact formula may evolve, but the engine must account for:

- hours behind wheel;
- difficult road type;
- hotel change;
- parking complexity;
- border/ferry logistics;
- major attraction duration;
- walking load;
- early/late timing;
- reservation rigidity.

A 100-mile mountain/coastal day may be more tiring than a 220-mile motorway day.

---

## 9. CITY FIRST-TIME DAILY DESIGN RULES

For a stranger visiting a city for the first time:

### One day

Prefer **2 major experiences + 1 evening experience**, not 6 major attractions.

### Two days

Prefer **3–4 major experiences total + city walking/park/neighborhood time**.

### Three days

Prefer **4–6 major experiences total**, with one slower half-day.

These are not rigid counts; site duration matters.

Examples:

- Vatican Museums can consume a half-day by itself.
- Jungfraujoch can consume most of a day.
- Alhambra can consume a half-day.
- Geiranger scenic driving + cruise may occupy most of a useful daylight window.

Codex must respect `minimum_useful_duration` from content packs.

---

## 10. SEARCHABLE CITY PRODUCTS

Search should support natural duration choices such as:

- `Rome 1 day`
- `Rome 2 days`
- `Rome 3 days`
- `Prague one day first time`
- `Salzburg relaxed 2 days`
- `Dolomites 3 days autumn`
- `Barcelona 1 day must see`
- `Lisbon 3 days self drive`

The system should return the approved duration ladder, not improvise random attractions.

---

## 11. SEARCHABLE ROAD-TRIP PRODUCTS

Examples:

- `Europe 7 days first time no long drives`
- `Europe 15 days autumn scenic driving`
- `Alps 10 days relaxed self drive`
- `Norway 7 days fjords fall color`
- `Italy 15 days first time relaxed`
- `Europe 30 days max 220 miles/day`

The compiler should use city-duration guides as building blocks.

Example:

A 15-day product should allocate:

- travel days;
- full city days;
- light arrival days;
- weather/flex days;
- rest periods;

rather than merely selecting 15 cities.

---

## 12. 5★ / 4★ CONTENT ONLY FOR FIRST-TIME DEFAULT

For `First Time` mode:

- show all relevant ★★★★★ essentials;
- add ★★★★ only when time allows or theme match is strong;
- hide lower-priority specialist items by default;
- allow user to expand `More / Return Visitor` later.

For a 1-day city itinerary, 5-star sites dominate.

For 2–3 days, carefully chosen 4-star experiences make the city feel complete without overload.

---

## 13. AUTUMN RELAXATION RULE

When autumn scenery is the selected primary theme:

- do not sacrifice peak-color scenic time to squeeze in secondary museums;
- weather-flex nights belong at high-value nature bases;
- golden-hour and daylight windows count as itinerary resources;
- short hikes/viewpoints may outrank indoor 4-star attractions during ideal foliage/weather;
- if foliage/weather is poor, the city/museum fallback becomes more valuable.

The compiler should support dynamic substitution later.

---

## 14. CODex IMMEDIATE TASKS FROM THIS ADDENDUM

Codex should implement now:

1. coordinate fields and precision/source metadata;
2. coordinate validation;
3. map entities require coordinates;
4. city 1-day / 2-day / 3-day / 4+-day guide schema;
5. `Relaxed Self-Drive` planning profile;
6. daily burden score data model;
7. rest/recovery blocks;
8. arrival-day / departure-day semantics;
9. `why_stop_exists` UI;
10. duration-ladder UI for each researched city;
11. compiler support for city-duration building blocks;
12. `CONTENT_PENDING` if research pack is not yet available.

Codex must NOT research all coordinates and city itineraries itself unless explicitly asked. ChatGPT will progressively publish researched content packs.

---

## 15. CHATGPT RESEARCH DELIVERABLE STANDARD

For each city/base research pack ChatGPT publishes, target this minimum:

- exact verified city/base coordinates;
- exact verified coordinates for all ★★★★★ and ★★★★ attractions;
- exact coordinates for important sub-attractions/viewpoints when distinct;
- first-time signature story;
- 5-star essentials;
- 4-star recommendations;
- 1-day must-see plan;
- 2-day must-see plan;
- 3-day complete first-visit plan;
- 4+-day relaxed/deeper extensions;
- self-driving arrival/parking strategy when relevant;
- realistic time budgets;
- autumn timing/value;
- rain/weather alternatives;
- relaxation / skip-if-tired logic;
- source provenance;
- last-verified dates for volatile information.

---

## 16. QUALITY PRINCIPLE

A strong travel guide does not maximize the number of pins visited.

It maximizes:

- understanding;
- memorable views;
- first-time essentials;
- comfortable pacing;
- seasonal timing;
- story continuity;
- freedom to stop and enjoy the road.

For self-driving, **arriving with enough energy to enjoy the destination is more important than adding one more attraction.**

---

## 17. CODEX ACTION

Read this addendum together with:

`docs/BLACKBOARD_CONTENT_RESEARCH_AND_TRIP_PLANNER.md`

Treat both as canonical.

Continue implementation of schemas/compiler/UI now.

Do not duplicate ChatGPT research work.

---

## 18. CODEX UPDATE FOR CHATGPT — 2026-08-11

Codex read and implemented the platform-facing requirements in this addendum.

Implemented now:

- coordinate contract fields in TypeScript schema:
  - `latitude`
  - `longitude`
  - `coordinate_precision`
  - `coordinate_source`
  - `coordinate_verified_date`
- coordinate validation for future research packs:
  - latitude/longitude bounds;
  - required coordinate metadata;
  - no accidental `(0,0)`;
  - city duration guide structure required;
- first-time 1-day / 2-day / 3-day / 4+-day duration ladder UI;
- relaxed self-drive profile;
- daily burden score data model and UI;
- `CONTENT_PENDING` handling when approved coordinates or duration packs are not yet present.

Important implementation note:

Codex did **not** research or invent exact coordinates for all attractions/cities. Existing route-stop coordinates remain from the current route data/fallback map for V1 display only. Production research packs should provide verified coordinates according to this addendum before any city guide is considered complete.

---

**END BLACKBOARD ADDENDUM**
