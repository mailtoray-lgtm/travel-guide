# BLACKBOARD — EUROPE V2 CONTENT INTEGRATION

**Project:** `mailtoray-lgtm/travel-guide`  
**Editorial / research owner:** ChatGPT  
**Implementation owner:** Codex  
**Status:** ACTIVE — EUROPE EDITORIAL V2 COMPLETE  
**Date:** 2026-08-11

This file supersedes any assumption that Codex should invent or research Europe tour content. **Codex builds the engine; ChatGPT owns editorial research and trip planning.**

## 1. CANONICAL CONTENT INPUTS

Read `content-research/source-registry.json` first.

Europe V2 is split into six canonical regional packs covering the approved 71-stop route:

1. `content-research/europe/europe-region-01-north-v2.json` — stops 01–16
2. `content-research/europe/europe-region-02-central-v2.json` — stops 17–25
3. `content-research/europe/europe-region-03-alps-france-v2.json` — stops 26–32
4. `content-research/europe/europe-region-04-iberia-v2.json` — stops 33–44
5. `content-research/europe/europe-region-05-italy-adriatic-v2.json` — stops 45–55
6. `content-research/europe/europe-region-06-greece-balkans-return-v2.json` — stops 56–71

Supporting canonical inputs:

- `content-research/europe/europe-poi-locator-registry-v2.json`
- `content-research/europe/europe-source-policy-and-catalog-v2.json`
- `content-research/europe/europe-trip-compiler-products-v1.json`
- existing detailed V1 packs for Amsterdam, Copenhagen, Gothenburg and Oslo

The old `public/data/attractions.csv` remains useful as legacy/source material, but when V2 conflicts with the old flat CSV, **approved V2 editorial selection and pacing wins**.

## 2. DO NOT RESEARCH OR INVENT CONTENT

Codex MUST NOT:

- create its own 4★/5★ editorial rankings;
- promote a 3★/optional legacy attraction because it is easy to render;
- infer historical stories not supplied by approved content;
- turn public Google/Tripadvisor ratings into our editorial stars;
- scrape/copy review text;
- fabricate missing GPS coordinates;
- silently geocode vague labels and call the result exact;
- optimize away functional overnight stops;
- convert Barcelona → Civitavecchia into a land route.

If content is missing, record the missing field for ChatGPT editorial follow-up. Do not fill it with generic AI prose.

## 3. PRECISE GPS RESOLUTION — BLOCKING

For every visible physical 4★/5★ entity, resolve location in this order:

1. inline coordinates in approved V1/V2 record;
2. `europe-poi-locator-registry-v2.json` matching locator;
3. approved `parent_locator_id` inheritance for an indoor/subfeature at the same visitor site;
4. approved `dynamic_nonpin` classification.

Hard failure if none exists.

`dynamic_nonpin` means the content intentionally changes near travel time (for example, a current-condition golden-larch walk). It must not become a fake fixed marker.

Do not render an `area_anchor` or `route_anchor` as if it were a building entrance. UI should communicate the locator type where useful.

## 4. FIRST-TIME STAR MEANING

Our stars are editorial, not consumer-review stars:

- **★★★★★ First-Time Essential** — deleting it materially weakens understanding/signature experience of that location.
- **★★★★ Strong Recommendation** — add when time, energy, interest, weather and driving context support it.

Default first-time UI hides lower-priority legacy content unless the selected theme explicitly asks for it.

Public-review evidence, if later added through approved/licensed data, displays separately from our editorial stars.

## 5. CITY / BASE DURATION UI

The site must expose the approved duration plans rather than one static list.

At a major city/base, user should be able to select available plans such as:

- 1 Day
- 2 Days
- 3 Days
- 4+ Days where supplied

Transit/recovery stops may intentionally have only a compact 1-day/arrival plan. Do not invent a 3-day sightseeing itinerary for a place whose role is to protect driving comfort.

The UI must clearly differentiate:

- major city/base;
- 5★ scenic/weather base;
- historic transit stop;
- recovery/rest stop;
- ferry/logistics point.

## 6. RELAXED SELF-DRIVE IS A PRODUCT FEATURE

Implement the pacing rules from `europe-trip-compiler-products-v1.json`.

Default relaxed behavior:

- scenic driving target generally 120–180 miles;
- normal comfortable ceiling around 220 miles when practical;
- one major AM + one PM anchor + optional evening;
- late arrival is not a full sightseeing day;
- after a heavy drive, optional sightseeing is deleted before safe rest;
- after two high-load days, prefer a light half-day / two-night base;
- city core = park once + walk/transit;
- mountain day = one high-alpine main task, not two systems;
- border/ferry delay is real itinerary overhead;
- winter/late-autumn daylight is part of the routing budget.

A day with **zero attractions** can be a correct relaxed itinerary day.

## 7. WEATHER / SEASON LOGIC MUST SURVIVE INTO UI

Examples that must not be flattened into generic pins:

- Flåm/Aurland and Geiranger use weather-flex logic.
- Trollstigen / high mountain roads are conditional on official opening and same-day conditions.
- Dolomites / Engadin / Grindelwald / Chamonix choose high-alpine activities based on visibility, lift season and snow/ice.
- Plitvice late-November does not assume full summer routes; render official-current-route dependency.
- Lokrum and other seasonal boat experiences disappear/disable when not operating.
- ferry ticket / current terminal instructions override static planning data.

## 8. TRIP COMPILER

Implement the approved searchable duration products:

`3 / 5 / 7 / 10 / 15 / 21 / 30 / 45 / 60 / 90 / 120 days`

Themes are in the compiler pack, including:

- Autumn Colors
- First-Time Europe Essentials
- Mountains & Alps
- Scenic Driving
- Ancient History
- Castles & Royal Europe
- Art & Museums
- Coast & Fjords
- Photography
- Wine & Countryside
- Architecture

**A shorter trip is not the first N days of the Grand Tour.** It must be geographically coherent and must give 5★ bases enough time.

Use the approved short products as initial acceptance fixtures, including:

- Amsterdam 3
- Prague 3
- Rome 3
- Vienna 3
- Barcelona 3
- Athens 3
- Dolomites 5
- Lisbon/Sintra 5
- Norway Fjords 7
- Dolomites + Engadin 7
- Central Autumn 10
- Alpine Autumn 15
- Scandinavia/Fjords 15

## 9. CONTENT DISPLAY STANDARD

For a selected attraction/site, surface approved fields when available:

- WHY THIS PLACE MATTERS
- HOW TO EXPERIENCE IT
- WHAT TO LOOK FOR
- THE STORY
- AUTUMN / SEASON FOCUS
- BEST TIME
- RECOMMENDED DURATION
- PRACTICAL / SELF-DRIVE NOTE
- PRECISE GPS / locator type
- source / official link

Do not turn this into a flat pin directory.

## 10. DEFAULT VISUAL MOOD

Owner feedback: current website feels too dark / nighttime.

Default site mode should become **Daylight / Autumn Scenic**, not night-tech-dashboard.

Night mode may remain optional, and the cinematic tour can deliberately use sunrise / daylight / golden hour / night at appropriate places. Do not globally darken the entire travel product.

This is an implementation instruction; do not alter editorial data to achieve the visual change.

## 11. ACCEPTANCE GATES

Codex must add or update automated validation so the Europe content build fails if:

- approved route stop orders do not cover exactly 1–71;
- a stop order is duplicated;
- 8 drive legs are not preserved;
- Barcelona→Civitavecchia ferry discontinuity disappears;
- a visible 4★/5★ physical entity has no approved locator resolution;
- `dynamic_nonpin` is emitted as a map marker;
- a ferry terminal uses a vague city-center locator;
- a first-time page displays consumer rating as our editorial star;
- a compiled relaxed itinerary exceeds hard pacing rules without an explicit warning/override;
- an unavailable seasonal item is treated as guaranteed.

## 12. IMPLEMENTATION PRIORITY

Do not spend owner tokens re-researching Europe.

Priority:

1. ingest/validate approved V2 content;
2. make City/Base duration selector work;
3. make 4★/5★ filter and locator behavior work;
4. implement relaxed Trip Compiler fixtures;
5. expose story fields and precise GPS;
6. implement Daylight/Autumn Scenic default UI;
7. then improve cinematic/3D presentation.

If an editorial ambiguity remains, leave a precise content TODO for ChatGPT rather than filling it yourself.
