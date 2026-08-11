import fs from "node:fs";
import path from "node:path";

const root = path.resolve("content-research");
const errors = [];

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`${file}: invalid JSON: ${error.message}`);
    return null;
  }
}

function requireField(obj, field, file) {
  if (obj[field] === undefined || obj[field] === null || obj[field] === "") {
    errors.push(`${file}: missing required field ${field}`);
  }
}

function validateCoordinate(entity, file) {
  const c = entity.coordinate ?? entity;
  for (const field of ["latitude", "longitude", "coordinate_precision", "coordinate_source", "coordinate_verified_date"]) {
    requireField(c, field, file);
  }
  if (typeof c.latitude !== "number" || c.latitude < -90 || c.latitude > 90) {
    errors.push(`${file}: latitude must be a number in [-90, 90]`);
  }
  if (typeof c.longitude !== "number" || c.longitude < -180 || c.longitude > 180) {
    errors.push(`${file}: longitude must be a number in [-180, 180]`);
  }
  if (c.latitude === 0 && c.longitude === 0) {
    errors.push(`${file}: coordinate cannot be accidental (0,0)`);
  }
}

function validateDurationGuide(guide, file, field) {
  if (!guide) {
    errors.push(`${file}: missing ${field}`);
    return;
  }
  requireField(guide, "pace", file);
  if (!Array.isArray(guide.must_see)) errors.push(`${file}: ${field}.must_see must be an array`);
  if (!Array.isArray(guide.schedule)) errors.push(`${file}: ${field}.schedule must be an array`);
}

function validateCityGuide(file) {
  const guide = readJson(file);
  if (!guide) return;
  for (const field of ["city_id", "name", "first_time_summary", "signature_story", "recommended_nights", "status"]) {
    requireField(guide, field, file);
  }
  validateCoordinate(guide, file);
  for (const key of ["1_day", "2_days", "3_days", "4_plus_days"]) {
    validateDurationGuide(guide.first_time_duration_guides?.[key], file, key);
  }
  if (!Array.isArray(guide.sources)) errors.push(`${file}: sources must be an array`);
}

if (fs.existsSync(root)) {
  const cityDir = path.join(root, "city-guides");
  if (fs.existsSync(cityDir)) {
    for (const entry of fs.readdirSync(cityDir)) {
      if (entry.endsWith(".json")) validateCityGuide(path.join(cityDir, entry));
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Research validation passed");
