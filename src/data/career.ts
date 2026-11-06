/**
 * Where each role in `journey.timeline` (src/i18n) happened, in the same order, for the experience globe.
 * lat / lon are the city's coordinates (e.g. Paris = 48.86, 2.35). Add a line here when you add a role there.
 */
export type Place = { city: string; country: { fr: string; en: string }; lat: number; lon: number };

const DAKAR: Place = { city: 'Dakar', country: { fr: 'Sénégal', en: 'Senegal' }, lat: 14.69, lon: -17.45 };
const LIBREVILLE: Place = { city: 'Libreville', country: { fr: 'Gabon', en: 'Gabon' }, lat: 0.39, lon: 9.45 };
const KIGALI: Place = { city: 'Kigali', country: { fr: 'Rwanda', en: 'Rwanda' }, lat: -1.95, lon: 30.06 };

export const CAREER_PLACES: Place[] = [DAKAR, DAKAR, DAKAR, LIBREVILLE, KIGALI];

/** How fast the globe turns on its own, in degrees per second (0 = still). */
export const GLOBE_SPIN_SPEED = 6;
