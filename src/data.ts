import amsterdamGuideJson from "../content-research/europe/amsterdam-first-visit-v1.json";
import durationMatrixJson from "../content-research/europe/europe-major-city-duration-matrix-v2.json";
import compilerJson from "../content-research/europe/europe-trip-compiler-products-v1.json";
import northJson from "../content-research/europe/europe-region-01-north-v2.json";
import centralJson from "../content-research/europe/europe-region-02-central-v2.json";
import alpsFranceJson from "../content-research/europe/europe-region-03-alps-france-v2.json";
import iberiaJson from "../content-research/europe/europe-region-04-iberia-v2.json";
import italyAdriaticJson from "../content-research/europe/europe-region-05-italy-adriatic-v2.json";
import greeceReturnJson from "../content-research/europe/europe-region-06-greece-balkans-return-v2.json";

export type V2Attraction = string | {
  name: string;
  gps?: [number, number];
  focus_cn?: string;
};

export type V2Stop = {
  order: number;
  id: string;
  name: string;
  country: string;
  role: string;
  anchor: {
    latitude: number;
    longitude: number;
    coordinate_precision: string;
    locator_name: string;
  };
  detailed_pack?: string;
  five_star: V2Attraction[];
  four_star: Array<string | { name: string }>;
  first_visit_story_cn: string;
  plans: Record<string, string[]>;
  self_drive_cn: string;
  season_logic_cn?: string;
};

export type RegionPack = {
  region_id: string;
  title: string;
  stops: V2Stop[];
};

export type CompilerProduct = {
  id: string;
  days: number;
  themes: string[];
  bases: string[];
  allocation_days?: number[];
  summary_cn: string;
};

export type CompilerTheme = {
  id: string;
  label: string;
};

export type DurationCity = {
  id: string;
  name: string;
  day_1: string[];
  day_2_add: string[];
  day_3_add: string[];
  day_4_plus: string[];
};

export type AmsterdamAttraction = {
  id: string;
  name: string;
  editorial_rating: number;
  first_time_required: boolean;
  latitude: number;
  longitude: number;
  why_it_matters_cn: string;
  how_to_experience_cn: string;
  time_required_minutes: number;
  best_time: string;
};

export type AmsterdamGuide = {
  city_id: string;
  city_name: string;
  country: string;
  first_time_summary_cn: string;
  signature_story_cn: string;
  recommended_nights_relaxed_self_drive: number;
  self_drive_strategy_cn: string;
  attractions: AmsterdamAttraction[];
  duration_plans: Record<string, unknown>;
};

type CompilerData = {
  duration_options_days: number[];
  themes: CompilerTheme[];
  approved_short_products: CompilerProduct[];
  duration_scope_rules: Record<string, string>;
};

type DurationMatrix = {
  cities: DurationCity[];
};

export const regions = [
  northJson,
  centralJson,
  alpsFranceJson,
  iberiaJson,
  italyAdriaticJson,
  greeceReturnJson,
] as unknown as RegionPack[];

export const compilerData = compilerJson as unknown as CompilerData;
export const durationMatrix = durationMatrixJson as unknown as DurationMatrix;
export const amsterdamGuide = amsterdamGuideJson as unknown as AmsterdamGuide;
export const allV2Stops = regions.flatMap((region) => region.stops);

export function normalizePlace(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\b(port of|airport|return|city|vatican)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function attractionName(attraction: V2Attraction) {
  return typeof attraction === "string" ? attraction : attraction.name;
}

export function findV2Stop(value: string) {
  const needle = normalizePlace(value);
  return allV2Stops.find((stop) => {
    const candidate = normalizePlace(stop.name);
    return candidate === needle || candidate.includes(needle) || needle.includes(candidate);
  });
}

export function findDurationCity(value: string) {
  const needle = normalizePlace(value);
  return durationMatrix.cities.find((city) => {
    const candidate = normalizePlace(city.name);
    return candidate === needle || candidate.includes(needle) || needle.includes(candidate);
  });
}
