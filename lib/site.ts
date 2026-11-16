/**
 * Site-wide content that should NOT drift between pages.
 * Edit this file to change headline numbers, services, testimonials, etc.
 * (Stats here override the Supabase profile values so every page agrees.)
 */

export const SITE = {
  name: 'Kishan Patel',
  role: 'Senior Mobile App Developer',
  years: '9+',
  apps: '30+',
  headline: 'I build mobile apps founders can ship and scale.',
  stackLine: ['Flutter', 'React Native', 'Kotlin Multiplatform', 'AI'],
  email: 'kishanpatel.freelance@gmail.com',
  phone: '+91 88494 49311',
  whatsapp: '918849449311', // digits only, used for wa.me links
  location: 'Gujarat, India · Working worldwide',
  linkedin: 'https://www.linkedin.com/in/patel-kishan-6b3324148/',
  // Paste your Calendly link here. While empty, "Book a call" opens WhatsApp instead.
  calendly: '',
};

export const bookCallHref = () =>
  SITE.calendly ||
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    "Hi Kishan, I'd like to book a free call about a mobile app project."
  )}`;

export const whatsappHref = () =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hi Kishan, I found your portfolio and have a project in mind.')}`;

/* ── Case studies ─────────────────────────────────────────────────────────────
 * Keyed by a lowercase substring of the project title stored in Supabase.
 * Replaces the long App Store copy with: one-line problem + 3 bullets + tags.
 * Review the bullets and tags so they describe exactly what YOU built.
 */
export interface CaseStudy {
  headline: string;
  bullets: string[];
  tags: string[];
  featured?: boolean;
}

export const CASE_STUDIES: Record<string, CaseStudy> = {
  idplus: {
    headline: 'Official eKYC app approved by the Palestine Monetary Authority',
    bullets: [
      'Remote identity onboarding — no branch visit, no paperwork',
      'Encrypted document capture & identity verification flow',
      'Financial Digital Identity (FDID) creation and management',
    ],
    tags: ['Flutter', 'REST', 'Secure auth', 'eKYC'],
    featured: true,
  },
  deepvid: {
    headline: 'AI content studio: generate videos, music and images from a prompt',
    bullets: [
      'Prompt-to-video, AI music and image generation in one app',
      'Async generation queue with progress + push notifications',
      'Subscription paywall and credits system on iOS & Android',
    ],
    tags: ['AI APIs', 'Subscriptions', 'iOS', 'Android'],
    featured: true,
  },
  pronose: {
    headline: 'Rhinoplasty simulator that previews nose-surgery results with AI',
    bullets: [
      'Photo capture → AI-generated before/after previews',
      'Fully automated pipeline, no manual editing for the user',
      'Monetised with in-app subscriptions',
    ],
    tags: ['AI imaging', 'Camera', 'Subscriptions'],
    featured: true,
  },
  teethsi: {
    headline: 'AI veneer try-on: see a smile makeover before the dentist',
    bullets: [
      'Selfie-based veneer and whitening simulation',
      'Multiple shade & style variations generated per photo',
      'Shareable before/after results',
    ],
    tags: ['AI imaging', 'Camera', 'Subscriptions'],
  },
  upchar: {
    headline: "Digital hospital: online doctor consults and medicine delivery",
    bullets: [
      'Chat and tele-consultation flows with doctors',
      'Medicine ordering for 30+ health conditions',
      'Health content in 6 Indian languages',
    ],
    tags: ['Healthcare', 'Telemedicine', 'Multilingual'],
  },
  winewise: {
    headline: 'Scan any wine label and get instant expert info',
    bullets: [
      'Camera label scanning with AI wine identification',
      'Ratings, tasting notes and food pairings',
      'Personal cellar / history of scanned wines',
    ],
    tags: ['AI vision', 'Camera', 'Android'],
  },
  pixhair: {
    headline: 'Virtual salon: try new hairstyles and colours with AI',
    bullets: [
      'AI hairstyle and hair-colour generation from a selfie',
      'Large style catalogue with quick previews',
      'Save and compare looks before visiting a salon',
    ],
    tags: ['AI imaging', 'Android', 'Subscriptions'],
  },
  soaraat: {
    headline: 'Soaraat — iOS app shipped to the App Store',
    bullets: [
      'End-to-end build from design to App Store release',
      'Clean architecture, scalable state management',
      'Production release and store compliance',
    ],
    tags: ['iOS', 'App Store'],
  },
};

export function findCaseStudy(title: string): CaseStudy | undefined {
  const t = title.toLowerCase().replace(/\s+/g, '');
  const key = Object.keys(CASE_STUDIES).find((k) => t.includes(k));
  return key ? CASE_STUDIES[key] : undefined;
}

/** Order of keys in CASE_STUDIES = display order (iDplus first). */
export function caseStudyRank(title: string) {
  const t = title.toLowerCase().replace(/\s+/g, '');
  const i = Object.keys(CASE_STUDIES).findIndex((k) => t.includes(k));
  return i === -1 ? 999 : i;
}

/** Strip " | Subtitle" / " - Subtitle" / " : Subtitle" so cards show a clean app name. */
export function shortTitle(title: string) {
  return title.split(/\s[|:–-]\s/)[0].trim();
}

/* ── Services / Process / Testimonials ───────────────────────────────────── */

export const SERVICES = [
  {
    icon: 'rocket',
    title: 'MVP build',
    text: 'From idea to App Store & Play Store in weeks — one codebase, production-ready.',
  },
  {
    icon: 'tool',
    title: 'App rescue',
    text: 'Inherited a buggy or half-finished app? I stabilise, refactor and ship it.',
  },
  {
    icon: 'cpu',
    title: 'AI features',
    text: 'Image & video generation, chat, vision and recommendations wired into your app.',
  },
  {
    icon: 'globe',
    title: 'Arabic & RTL apps',
    text: 'Fully localised RTL experiences for Gulf & MENA markets, incl. eKYC/fintech.',
  },
];

export const PROCESS = [
  { title: 'Call', text: 'Free 20-min call to understand the product, users and deadline.' },
  { title: 'Plan', text: 'Scope, milestones and a fixed quote — no surprises.' },
  { title: 'Build', text: 'Weekly builds you can install and test on your own phone.' },
  { title: 'Launch', text: 'Store submission, analytics, crash reporting and handover.' },
];

/**
 * Add REAL client quotes here (with their permission). The section stays
 * hidden until at least one testimonial exists — never invent these.
 */
export const TESTIMONIALS: { quote: string; name: string; role: string }[] = [];

/* ── Tech logo grid ─────────────────────────────────────────────────────── */
export const TECH_GROUPS: { label: string; items: string[] }[] = [
  { label: 'Cross-platform', items: ['Flutter', 'Dart', 'React Native', 'Kotlin Multiplatform'] },
  { label: 'Native', items: ['Kotlin', 'Java', 'Swift', 'Jetpack Compose'] },
  { label: 'Backend & cloud', items: ['Firebase', 'Supabase', 'REST APIs', 'Node.js', 'Google Cloud'] },
  { label: 'AI', items: ['OpenAI', 'Gemini', 'Claude', 'TensorFlow Lite'] },
  { label: 'Ship & tooling', items: ['Fastlane', 'GitHub Actions', 'App Store', 'Google Play', 'Figma', 'Git'] },
];
