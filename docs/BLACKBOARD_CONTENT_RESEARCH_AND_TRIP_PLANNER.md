# BLACKBOARD — CONTENT RESEARCH, CITY GUIDE & TRIP COMPILER

**Project:** `mailtoray-lgtm/travel-guide`  
**Owner:** Ray  
**Content planner / research organizer:** ChatGPT  
**Implementation agent:** Codex  
**Status:** ACTIVE / CANONICAL  
**Date:** 2026-08-11

---

## 1. PURPOSE

This document establishes a strict division of responsibility so implementation does not waste owner tokens on duplicated travel research.

### ChatGPT owns

- destination research;
- source selection and source-quality review;
- first-time visitor attraction selection;
- 5-star / 4-star editorial ranking;
- city sub-attractions;
- story themes and narrative structure;
- `how to experience` guidance;
- `what to look for` guidance;
- autumn value and seasonal interpretation;
- time-budget recommendations;
- city mini-tour design;
- trip-duration product planning for 3 / 5 / 7 / 10 / 15 / 21 / 30 / 45 / 60 / 90+ days;
- theme packs such as Autumn, Scenic Driving, History, Art, Architecture, Coast, Mountains, Photography;
- First-Time versus Return-Visitor editorial logic;
- source provenance and research notes;
- content QA.

### Codex owns

- code;
- schemas and validators;
- UI/UX implementation;
- search/filter implementation;
- trip compiler engine;
- map/3D/Street View integration;
- data loaders;
- build/test/deployment;
- GitHub Pages;
- accessibility/performance;
- consuming the approved research packs exactly as published.

### Codex must NOT

- spend large model context researching attractions independently;
- scrape travel sites;
- invent new 4★/5★ rankings;
- rewrite approved story content without a concrete implementation need;
- silently add/remove attractions because an LLM thinks another attraction is better;
- generate hundreds of generic descriptions to fill empty fields;
- turn public review ratings directly into our editorial stars;
- duplicate research already supplied by ChatGPT.

If content is missing, Codex should implement the field/schema and mark it `CONTENT_PENDING` rather than research it independently.

---

## 2. PRODUCT DIRECTION

The project is no longer only one 119-night Europe route.

It is a reusable **Travel Guide Engine** built from a shared destination knowledge base.

The first production data set remains:

- 71 route / overnight stops;
- 155 existing attraction points;
- 8 verified driving legs;
- Barcelona → Civitavecchia intentional car-ferry gap;
- autumn-first scenic philosophy;
- comfortable road-trip pacing.

The next content layer is:

`Trip → Region → City/Base → City Tour → Attraction → Sub-attraction → Story`

A visitor should understand not only *where* to go but:

1. Why this place matters.
2. What specifically to look at.
3. How to experience it efficiently.
4. What story connects it to the city/region.
5. Why autumn changes its value.
6. How much real time it requires.
7. Whether it is essential for a first visit.

---

## 3. SITE VISUAL DIRECTION

Current production UI is too dark for the default Europe Autumn experience.

### Required default visual mode

**DAYLIGHT / AUTUMN SCENIC**

Use:

- bright or light-neutral content surfaces;
- warm autumn accent tones;
- legible daylight map/story presentation;
- landscape photography / Google 3D as the visual hero;
- less black-dashboard appearance.

### Night mode

Dark/night appearance may remain as an optional mode or be used dynamically for:

- night cruises;
- evening city arrivals;
- illuminated monuments;
- blue-hour experiences.

The whole site should not look like permanent nighttime.

### Future cinematic scene timing

Destination metadata may specify:

- sunrise;
- daylight;
- golden_hour;
- blue_hour;
- night.

The 3D tour may use this later for camera mood/timing where supported.

---

## 4. EDITORIAL STAR SYSTEM — OUR STARS ARE NOT GOOGLE STARS

Our editorial ranking means **first-time visitor importance**, not consumer-review average.

### ★★★★★ — FIRST-VISIT ESSENTIAL

Include when most of the following are true:

- central to understanding the city/region;
- internationally or nationally significant;
- highly distinctive / difficult to substitute;
- strong narrative value;
- consistently recommended by authoritative or expert travel sources;
- realistic for a first-time itinerary;
- worth protecting time for even on a shorter trip.

### ★★★★ — HIGHLY RECOMMENDED

Include when:

- strong experience and story value;
- recommended for most first-time visitors if time permits;
- may overlap another essential site;
- may require extra time/logistics;
- may be especially strong for a specific theme or season.

### Below ★★★★

Do not include by default in the **First-Time Essential Guide**.

They may remain available for:

- return visitors;
- niche themes;
- longer trips;
- neighborhood exploration;
- rainy-day alternatives;
- special-interest tours.

### Public review evidence is separate

Where legally and technically available, store separately:

- source name;
- source place ID / URL;
- public rating;
- rating/review count;
- retrieval date.

Never convert `Google 4.8` directly into our `★★★★★`.

---

## 5. FIRST-VISIT EDITORIAL SCORE

For research consistency, ChatGPT may use this internal scoring framework.

| Dimension | Weight |
|---|---:|
| Cultural / historical / natural significance | 30% |
| First-time visitor consensus | 20% |
| Uniqueness / irreplaceability | 15% |
| Story / interpretive value | 15% |
| Seasonal / autumn value | 10% |
| Logistics / time efficiency | 10% |

Suggested editorial mapping:

- 90–100 → ★★★★★ Essential
- 78–89 → ★★★★ Highly Recommended
- <78 → specialist / return-visitor / optional pool

This score is an editorial planning aid, not a scientific claim and not a substitute for human review.

---

## 6. SOURCE HIERARCHY

ChatGPT research should prefer multiple independent sources and record provenance.

### Tier A — Primary / authoritative sources

Use first for factual claims:

- UNESCO World Heritage Centre;
- official national tourism organizations;
- official city/regional tourism organizations;
- official attraction/museum/palace/castle/church/national-park sites;
- government heritage agencies;
- official scenic-road / transport / cable-car / ferry operators;
- official park authorities.

Use these to establish:

- significance;
- history;
- opening/season limitations;
- access methods;
- official names;
- landmark features;
- safety/access facts.

### Tier B — Established travel/editorial expertise

Use to improve *how to visit* and first-time prioritization:

- established destination guide publishers;
- established travel journalism;
- reputable specialist road-trip/hiking/cultural guides;
- experienced local tour-guide organizations;
- destination-specific expert editorial sources.

Use these to compare:

- first-time priorities;
- realistic visit times;
- viewing sequence;
- common mistakes;
- best viewpoints;
- time-of-day advice;
- whether a famous site is actually worth the time.

Do not copy their prose. Summarize independently and cite the source in research metadata.

### Tier C — Crowd/review evidence

Only use through lawful, authorized methods.

#### Google Places

Google Places currently exposes fields including rating, user rating count, reviews, place IDs and Google Maps links through supported APIs. These data fields can have billable SKUs. Do not enable a paid Places workflow without owner approval.

For a public product, obey Google's display, attribution and storage rules.

#### Tripadvisor

Do **not** scrape Tripadvisor webpages.

Do **not** have Codex bulk-collect Tripadvisor reviews.

Current Tripadvisor Content API terms materially restrict storage/caching of content and restrict AI-related use; their public API also requires licensing/attribution and billing setup. Therefore Tripadvisor must **not** be treated as our static GitHub research database unless the owner separately approves a compliant licensed integration.

For V1, Tripadvisor may be used only as a manually consulted editorial signal where legally appropriate; do not copy review text or persist Tripadvisor licensed content into the repository.

### Tier D — User-generated forums/social media

Use sparingly for questions such as:

- recurring practical pain points;
- crowd timing;
- parking confusion;
- common first-time mistakes.

Never make UGC the sole source for historical, safety, legal, transport, pricing or access facts.

---

## 7. SOURCE POLICY FOR PUBLIC GITHUB CONTENT

Every published research item should keep lightweight provenance.

Recommended schema:

```json
{
  "sources": [
    {
      "source_type": "official",
      "publisher": "...",
      "url": "...",
      "retrieved": "YYYY-MM-DD",
      "supports": ["significance", "access", "history"]
    }
  ]
}
```

Rules:

- summarize; do not reproduce copyrighted guide text;
- do not store scraped review corpora;
- do not copy long paragraphs;
- do not store Google/Tripadvisor imagery unless explicitly permitted;
- do not publish API credentials;
- facts likely to change must include retrieval date;
- access/opening/season data should be treated as refreshable, not permanent truth.

---

## 8. CITY GUIDE MODEL

Every major city/base should eventually have one City Guide package.

Suggested structure:

```json
{
  "city_id": "rome",
  "name": "Rome",
  "first_time_summary": "...",
  "signature_story": "...",
  "recommended_nights": 4,
  "tour_groups": [],
  "attractions": [],
  "mini_tours": [],
  "season_notes": {},
  "sources": []
}
```

### Tour groups

A city may have coherent first-time themes rather than one flat list.

Example Rome:

- Ancient Rome ★★★★★
- Vatican & Renaissance ★★★★★
- Baroque Rome ★★★★
- Evening Rome ★★★★

Example Prague:

- Royal Prague ★★★★★
- Old Town & River ★★★★★
- Jewish Prague ★★★★
- Autumn Parks & Viewpoints ★★★★

Example Val Gardena:

- Dolomite Geology ★★★★★
- Golden Larch Autumn ★★★★★
- Scenic Pass Driving ★★★★★
- WWI High-Mountain Landscape ★★★★

---

## 9. SUB-ATTRACTION MODEL

Major attractions should not remain one shallow pin.

Example:

`Colosseum`

may have sub-attractions / observation targets:

- exterior structural rings;
- arena geometry;
- seating hierarchy;
- underground/hypogeum context;
- crowd circulation engineering;
- relationship to Roman Forum / Palatine.

Example:

`Sagrada Família`

may include:

- Nativity Façade;
- Passion Façade;
- nave / branching columns;
- stained-glass light;
- tower/skyline option;
- Gaudí's nature/structure idea.

Suggested fields:

```json
{
  "id": "...",
  "name": "...",
  "parent_attraction_id": "...",
  "editorial_rating": 5,
  "why_it_matters": "...",
  "what_to_look_for": "...",
  "how_to_experience": "...",
  "story": "...",
  "best_time": "...",
  "time_required_minutes": 30,
  "season_notes": "...",
  "first_time_required": true,
  "sources": []
}
```

Codex should support this schema but must not mass-generate sub-attractions without approved content packs.

---

## 10. TIME BUDGET IS REQUIRED CONTENT

Every attraction / sub-attraction should eventually include a realistic time budget:

- quick_look: 15–30 min
- short: 30–60 min
- standard: 1–2 hr
- deep_visit: 2–4 hr
- half_day
- full_day

A trip compiler cannot be credible if every attraction is treated as free/no-time.

Also support:

- reservation/timed-entry overhead;
- parking/walking/transit overhead;
- weather dependency;
- seasonal closure risk;
- minimum useful visit duration.

---

## 11. MINI-TOURS PER CITY

Each major city should eventually expose reusable itinerary blocks.

Examples:

### 3 HOURS

A compact orientation / single-theme route.

### 5 HOURS

A half-day first-visit route.

### 1 DAY

Core first-time essentials.

### 2 DAYS

Core + one secondary theme.

### 3 DAYS

Full first-time city guide.

### AUTUMN EDITION

Season-specific parks, viewpoints and golden-hour changes.

### RAIN PLAN

Museums / indoor architecture / markets where relevant.

The Trip Compiler should use these reusable blocks rather than inventing every day from scratch.

---

## 12. GLOBAL TRIP COMPILER PRODUCTS

The site should become searchable/plannable by duration.

Initial duration presets:

- 3 days
- 5 days
- 7 days
- 10 days
- 15 days
- 21 days
- 30 days
- 45 days
- 60 days
- 90+ days
- Full Grand Tour

A shorter trip is **not** the first N days of the 119-night route.

The compiler must choose the best coherent subset for the user's constraints.

---

## 13. TRIP COMPILER INPUTS

### Duration

`3 / 5 / 7 / 10 / 15 / 21 / 30 / 45 / 60 / 90+`

### Visitor profile

- First Time
- Return Visitor

### Pace

- Relaxed
- Balanced
- See More

### Driving preference

Suggested presets:

- Relaxed Road Trip → ~150 mi/day target
- Comfortable Road Trip → ~220 mi/day target
- Fast Mover → up to ~350 mi/day where sensible

Do not treat these as absolute safety guarantees; mountain/coastal roads may require much lower effective mileage.

### Themes

- Autumn Colors
- Mountains & Alps
- Nature
- Scenic Driving
- Ancient History
- Castles & Royal Europe
- Art & Museums
- Architecture & Churches
- Coast & Fjords
- Photography
- Wine & Countryside
- First-Time Europe Essentials

### Optional constraints later

- start/end airports;
- no-ferry;
- low walking;
- family;
- museums-light;
- nature-heavy;
- weather flexibility.

---

## 14. COMPILER PLANNING LOGIC

Compiler should eventually optimize for:

1. editorial importance;
2. theme match;
3. geographic coherence;
4. realistic travel time;
5. attraction time budget;
6. minimum useful nights;
7. rest/recovery;
8. season/autumn window;
9. weather-flex value;
10. duplication avoidance.

Do not optimize only for minimum driving time.

The product philosophy is:

**The drive is part of the trip.**

Intermediate scenic overnight stops may be intentionally preserved even if a navigation engine offers a faster highway path.

---

## 15. FIRST-TIME VS RETURN-VISITOR RULE

### First Time

Default to:

- ★★★★★ essentials;
- strongest ★★★★ sites;
- signature city story;
- famous landmark *when it is genuinely important*;
- coherent route with minimal redundant museums/monuments.

### Return Visitor

May unlock:

- specialist museums;
- neighborhoods;
- niche architecture;
- local markets;
- secondary viewpoints;
- regional day trips;
- slower food/culture experiences;
- hidden historical layers.

Do not make First-Time mode a list of every famous thing.

---

## 16. "WHY THIS STOP EXISTS" FOR ROAD-TRIP BASES

Intermediate overnight stops need explicit explanation.

Required fields may include:

- `route_function`
- `why_stop_exists`
- `worth_sightseeing`
- `best_60_minute_experience`
- `skip_if_tired`

Example pattern:

**Jönköping**

- Why stop: breaks a long Scandinavia transfer into a comfortable day.
- Scenic value: Lake Vättern.
- If you have 60 min: waterfront walk / sunset.
- If tired: dinner + sleep; no guilt.

This prevents a road-trip itinerary from pretending every overnight is an equal tourist destination.

---

## 17. SOURCE-REFRESH CLASSES

Classify research fields by volatility.

### Stable

- broad history;
- architecture;
- geology;
- cultural significance.

Refresh rarely.

### Seasonal

- lift operating seasons;
- scenic-road opening periods;
- ferry schedules;
- foliage timing;
- park access.

Refresh before trip season.

### Live / volatile

- opening hours;
- ticket prices;
- closures;
- construction;
- reservation availability;
- review ratings/counts.

Never freeze these forever into the editorial narrative.

The website should be able to show:

`Last verified: YYYY-MM-DD`

where helpful.

---

## 18. REVIEW DATA POLICY — IMPORTANT IMPLEMENTATION LIMIT

Codex must implement review evidence as an **optional provider interface**, not as hard-coded scraped data.

Suggested model:

```ts
interface ReviewEvidenceProvider {
  getPlaceEvidence(placeId: string): Promise<ReviewEvidence | null>
}
```

Possible future providers:

- Google Places (owner-approved billing/configuration only);
- other licensed providers approved later.

### Do not implement Tripadvisor scraping

Current Tripadvisor Content API documentation states that it uses partner API keys, requires attribution, has licensing/billing terms, and its caching policy generally prohibits storing/indexing content other than location IDs. Its current master terms also restrict AI-related uses. Therefore it is not appropriate for Codex to harvest Tripadvisor content into our public static GitHub data set.

If owner later purchases/approves a compliant integration, handle it separately and according to then-current terms.

---

## 19. RESEARCH OUTPUTS CHATGPT WILL PUBLISH

ChatGPT will progressively add approved content packs under:

```text
content-research/
  source-registry.json
  city-guides/
    <city-id>.json
  regional-guides/
  theme-guides/
  trip-products/
  research-notes/
```

Codex should build readers/validators for this structure.

Suggested first research waves:

### Wave 1 — Highest-value autumn / first-time anchors

- Amsterdam
- Copenhagen
- Oslo
- Flåm / Aurland
- Geiranger
- Stockholm
- Berlin
- Kraków
- Prague
- Český Krumlov
- Hallstatt
- Salzburg
- Val Gardena / Dolomites
- Engadin / St. Moritz
- Grindelwald / Jungfrau
- Chamonix
- Barcelona
- Madrid
- Porto
- Lisbon / Sintra
- Seville
- Granada
- Rome / Vatican
- Florence / Tuscany
- Venice
- Dubrovnik
- Athens
- Delphi
- Meteora
- Budapest
- Vienna

### Wave 2 — Road-trip bridge destinations

- Giethoorn
- Hamburg
- Lübeck
- Gothenburg
- Lillehammer
- Karlstad
- Jönköping
- Helsingborg
- Odense
- Schwerin
- Poznań
- Warsaw
- Olomouc
- Annecy
- Avignon
- Collioure
- Zaragoza
- Salamanca
- Évora
- Alicante
- Valencia
- Ljubljana
- Plitvice
- Split
- Kotor
- Shkodër
- Gjirokastër
- Ioannina
- Patras
- Skopje
- Niš
- Belgrade
- Novi Sad
- Linz
- Regensburg
- Würzburg
- Bacharach / Middle Rhine
- Cologne

Research order may change when trip compiler needs a specific package.

---

## 20. CODEX IMMEDIATE IMPLEMENTATION TASK

Codex may continue coding now without waiting for all research.

Implement the **content platform**, not the content itself.

### Build now

1. Daylight / Autumn Scenic default theme.
2. Optional dark/night mode.
3. City Guide schema.
4. Sub-attraction schema.
5. Source provenance schema.
6. Editorial rating (our ★★★★★ / ★★★★) separate from public review evidence.
7. Time-budget fields.
8. First-Time / Return-Visitor selector.
9. Duration selector:
   - 3 / 5 / 7 / 10 / 15 / 21 / 30 / 45 / 60 / 90+
10. Theme selector.
11. Pace selector.
12. Driving-preference selector.
13. Mini-tour data model.
14. Trip Compiler interface/engine skeleton.
15. `CONTENT_PENDING` handling.
16. Search across city / attraction / sub-attraction.
17. UI for City Tour themes.
18. "Why this stop exists" component for road-trip bridge stops.
19. Content-source provenance display when appropriate.
20. Automated validation for research-pack schema.

### Do NOT build yet without approved research/content

- hundreds of generated sub-attractions;
- arbitrary city rankings;
- scraped review databases;
- fake review scores;
- AI-generated historical content with no source pack;
- paid review/Places integration without owner approval.

---

## 21. CODEX CONTENT CONSUMPTION CONTRACT

When a ChatGPT research pack appears:

1. Validate schema.
2. Do not editorially rewrite it.
3. Map it to UI.
4. Preserve source metadata.
5. Surface missing fields as `CONTENT_PENDING` rather than hallucinating.
6. Report schema/content conflicts back to the Blackboard/report; do not silently fix meaning.

If a source has become stale, flag:

`CONTENT_REFRESH_REQUIRED`

Do not independently replace it unless specifically instructed.

---

## 22. PUBLIC CONTENT QUALITY BAR

A city guide should not be published as "complete" merely because it has many attractions.

Complete means:

- clear signature story;
- ★★★★★ essentials selected;
- ★★★★ strong recommendations selected;
- major attraction sub-attractions identified;
- realistic time budget;
- first-time mini-tour exists;
- autumn notes where relevant;
- primary sources recorded;
- implementation validation passes.

**Quality > count.**

---

## 23. RESEARCH PRINCIPLE

The visitor should never feel:

> “I am standing here. What am I supposed to look at?”

Every major place should explain:

> “Look there. Notice this. Here is why it matters. Here is the story. Here is the best way to experience it.”

That is the editorial identity of this project.

---

## 24. CURRENT OWNER INTENT

- Public website.
- Strong first-time visitor usefulness.
- 5★ and 4★ only by default for strangers visiting a place for the first time.
- City-specific guide depth, including sub-attractions.
- Research informed by authoritative travel information and lawful review evidence.
- Searchable/compilable trips for many durations and themes.
- Autumn scenery remains a major product strength.
- Codex should spend tokens building code, not duplicating research that ChatGPT will provide.

---

## 25. CODEX ACTION

**Continue implementation now.**

Read this Blackboard first.

Treat ChatGPT-published content packs as the editorial source of truth.

Do not wait for all 71 city research packs before building the compiler/data interfaces.

Do not spend owner tokens mass-researching destinations.

Build the engine so new research packs can be dropped in and immediately become searchable city guides, sub-attractions, mini-tours and duration/theme trip products.

---

## 26. VERIFIED POLICY NOTES FOR IMPLEMENTATION

As of 2026-08-11:

- Google Places API (New) provides supported place data such as rating, `userRatingCount`, reviews and Google Maps links; some fields are in billable SKUs, so production use needs deliberate owner-approved configuration.
- Google documentation explicitly treats scraping/export of Google Maps Platform content as restricted; use supported APIs and required attribution instead of scraping.
- Tripadvisor Content API requires a partner API key and attribution; current public documentation describes paid/budgeted access after a free-call allowance.
- Tripadvisor's current caching policy says only `location_id` has unlimited caching; other attributes generally may not be cached/stored/indexed.
- Tripadvisor's current API Master Terms prohibit scraping Tripadvisor sites and contain material restrictions on AI/ML use of licensed content.

Therefore the V1 research repository should contain **our independently written editorial content + provenance URLs**, not copied Google/Tripadvisor reviews.

---

**END BLACKBOARD**
