export type ContentStatus = "READY" | "CONTENT_PENDING" | "CONTENT_REFRESH_REQUIRED";

export type CoordinatePrecision =
  | "exact"
  | "entrance"
  | "site_center"
  | "viewpoint"
  | "city_center"
  | "approximate";

export type Coordinate = {
  latitude: number;
  longitude: number;
  coordinate_precision: CoordinatePrecision;
  coordinate_source: string;
  coordinate_verified_date: string;
};

export type SourceProvenance = {
  source_type: "official" | "editorial" | "licensed_review_provider" | "geospatial" | "owner";
  publisher: string;
  url: string;
  retrieved: string;
  supports: string[];
};

export type ReviewEvidence = {
  provider: "google_places" | "licensed_provider";
  place_id: string;
  rating?: number;
  user_rating_count?: number;
  google_maps_uri?: string;
  retrieved: string;
  status: ContentStatus;
};

export type TimeBudget =
  | "quick_look"
  | "short"
  | "standard"
  | "deep_visit"
  | "half_day"
  | "full_day";

export type ScheduleBlock = {
  label: string;
  time_range: string;
  attraction_id?: string;
  transfer_mode?: "walk" | "drive" | "transit" | "ferry" | "cable_car" | "none";
  expected_transfer_minutes?: number;
  visit_duration: TimeBudget | "meal_rest" | "recovery";
  reservation_sensitivity?: "none" | "low" | "medium" | "high";
  best_light?: "sunrise" | "daylight" | "golden_hour" | "blue_hour" | "night";
  weather_dependency?: "low" | "medium" | "high";
  skip_if_tired?: string;
  status?: ContentStatus;
};

export type DurationGuide = {
  pace: "relaxed" | "balanced" | "relaxed_balanced" | "slow";
  must_see: string[];
  schedule: ScheduleBlock[];
  walking_load?: "low" | "medium" | "high";
  notes?: string;
  status: ContentStatus;
};

export type DailyBurden = {
  drive_miles: number;
  drive_hours: number;
  mountain_road_hours: number;
  border_crossing: boolean;
  ferry: boolean;
  hotel_change: boolean;
  major_attractions: number;
  walking_hours: number;
  reservation_pressure: "low" | "medium" | "high";
  burden_score: number;
};

export type CityGuide = {
  city_id: string;
  name: string;
  coordinate: Coordinate;
  first_time_summary: string;
  signature_story: string;
  recommended_nights: number;
  first_time_duration_guides: {
    "1_day": DurationGuide;
    "2_days": DurationGuide;
    "3_days": DurationGuide;
    "4_plus_days": DurationGuide;
  };
  sources: SourceProvenance[];
  status: ContentStatus;
};

export type CompilerInput = {
  duration: "3" | "5" | "7" | "10" | "15" | "21" | "30" | "45" | "60" | "90_plus" | "full";
  visitorProfile: "first_time" | "return_visitor";
  pace: "relaxed" | "balanced" | "see_more";
  drivingPreference: "relaxed_self_drive" | "comfortable_road_trip" | "fast_mover";
  theme: string;
};

export const durationOptions = [
  ["3", "3 days"],
  ["5", "5 days"],
  ["7", "7 days"],
  ["10", "10 days"],
  ["15", "15 days"],
  ["21", "21 days"],
  ["30", "30 days"],
  ["45", "45 days"],
  ["60", "60 days"],
  ["90_plus", "90+ days"],
  ["full", "Full Grand Tour"],
] as const;

export const themeOptions = [
  "Autumn Colors",
  "Mountains & Alps",
  "Nature",
  "Scenic Driving",
  "Ancient History",
  "Castles & Royal Europe",
  "Art & Museums",
  "Architecture & Churches",
  "Coast & Fjords",
  "Photography",
  "Wine & Countryside",
  "First-Time Europe Essentials",
];

export const futureRegionBuilds = [
  "North America",
  "South America",
  "Africa",
  "East Asia",
  "South East Asia",
  "China",
  "India",
  "Russia",
  "East / Middle East",
  "Arabic World",
];

export const relaxedSelfDriveRules = [
  "Target 120-180 mi/day on scenic travel days.",
  "Comfortable upper target is about 220 mi/day on ordinary transfer days.",
  "Avoid consecutive upper-limit drive days where possible.",
  "Protect 2+ nights at high-value autumn or weather-sensitive bases.",
  "Count parking, check-in, ferry, border, walking and reservation pressure as travel burden.",
  "Do not schedule major scenic roads after dark.",
];

export function contentPendingCityGuide(cityName: string): CityGuide {
  return {
    city_id: cityName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    name: cityName,
    coordinate: {
      latitude: 0,
      longitude: 0,
      coordinate_precision: "approximate",
      coordinate_source: "CONTENT_PENDING",
      coordinate_verified_date: "CONTENT_PENDING",
    },
    first_time_summary: "CONTENT_PENDING",
    signature_story: "CONTENT_PENDING",
    recommended_nights: 0,
    first_time_duration_guides: {
      "1_day": pendingDurationGuide("1-day must-see guide is awaiting approved research."),
      "2_days": pendingDurationGuide("2-day city-understanding guide is awaiting approved research."),
      "3_days": pendingDurationGuide("3-day complete first-visit guide is awaiting approved research."),
      "4_plus_days": pendingDurationGuide("4+ day relaxed/deeper guide is awaiting approved research."),
    },
    sources: [],
    status: "CONTENT_PENDING",
  };
}

function pendingDurationGuide(notes: string): DurationGuide {
  return {
    pace: "relaxed_balanced",
    must_see: [],
    schedule: [
      {
        label: "Approved research pack required",
        time_range: "CONTENT_PENDING",
        visit_duration: "recovery",
        status: "CONTENT_PENDING",
      },
    ],
    notes,
    status: "CONTENT_PENDING",
  };
}

export function estimateDailyBurden(input: {
  driveMiles: number;
  hotelChange: boolean;
  ferry?: boolean;
  mountainRoadHours?: number;
  majorAttractions?: number;
  walkingHours?: number;
}): DailyBurden {
  const driveHours = input.driveMiles ? Math.max(0.5, input.driveMiles / 48) : 0;
  const mountainRoadHours = input.mountainRoadHours ?? 0;
  const majorAttractions = input.majorAttractions ?? 0;
  const walkingHours = input.walkingHours ?? 1.5;
  const burdenScore = Math.min(
    100,
    Math.round(
      driveHours * 8 +
        mountainRoadHours * 9 +
        walkingHours * 4 +
        majorAttractions * 10 +
        (input.hotelChange ? 12 : 0) +
        (input.ferry ? 10 : 0),
    ),
  );
  return {
    drive_miles: input.driveMiles,
    drive_hours: Number(driveHours.toFixed(1)),
    mountain_road_hours: mountainRoadHours,
    border_crossing: false,
    ferry: Boolean(input.ferry),
    hotel_change: input.hotelChange,
    major_attractions: majorAttractions,
    walking_hours: walkingHours,
    reservation_pressure: majorAttractions > 1 ? "medium" : "low",
    burden_score: burdenScore,
  };
}
