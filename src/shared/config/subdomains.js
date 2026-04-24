export const LANDING_SITEMAP_PRIORITIES = {
  phone: 0.85,
  phone2: 0.75,
  phone3: 0.75,
  phone4: 0.75,
  phone5: 0.75,
  phone6: 0.75,
  'shockproof-phone': 0.7,
  laptop: 0.85,
  laptop2: 0.75,
  pc: 0.75,
  tv1: 0.85,
  tv2: 0.75,
  tv3: 0.75,
  scooter: 0.75,
  bicycles: 0.75,
  motoblok: 0.7,
  motoblok1: 0.65,
  motoblok2: 0.65,
  phone7: 0.75,
  '50discount': 0.65,
  '1phonefree': 0.65,
};

export const LEGIT_SUBDOMAINS = Object.keys(LANDING_SITEMAP_PRIORITIES);
export const LEGIT_SUBDOMAINS_SET = new Set(LEGIT_SUBDOMAINS);
