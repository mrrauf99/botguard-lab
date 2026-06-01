/**
 * Canonical attack-type slugs stored on Session.attackType
 * and used for dashboard / notification analytics.
 */
export const ATTACK_TYPE_LABELS = {
  'login-attack': 'Login Attack',
  'spam-bot': 'Spam Bot',
  'scraper-bot': 'Scraper Bot',
  'form-spam': 'Form Spam',
  'click-spam': 'Click Spam',
  'fast-navigation': 'Fast Navigation',
  'no-interaction': 'No Interaction',
  suspicious: 'Suspicious',
};

const KNOWN_SLUGS = new Set(Object.keys(ATTACK_TYPE_LABELS));

export function normalizeAttackSlug(value) {
  if (!value) return null;
  const slug = String(value).trim().toLowerCase().replace(/\s+/g, '-');
  if (KNOWN_SLUGS.has(slug)) return slug;
  if (slug.includes('login')) return 'login-attack';
  if (slug.includes('scraper')) return 'scraper-bot';
  if (slug.includes('spam') && slug.includes('form')) return 'form-spam';
  if (slug.includes('spam')) return 'spam-bot';
  if (slug.includes('click')) return 'click-spam';
  if (slug.includes('navigation')) return 'fast-navigation';
  if (slug.includes('interaction')) return 'no-interaction';
  return slug;
}

export function formatAttackLabel(slug) {
  const normalized = normalizeAttackSlug(slug);
  if (!normalized) return null;
  if (ATTACK_TYPE_LABELS[normalized]) return ATTACK_TYPE_LABELS[normalized];
  return normalized
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Resolve attack type from explicit slug, session flags, and detection reasons.
 * Returns null when the session is not security-relevant (plain human traffic).
 */
export function inferAttackTypeSlug({
  attackType = null,
  classification = 'HUMAN',
  detectionReasons = [],
  flags = {},
}) {
  const explicit = normalizeAttackSlug(attackType);
  if (explicit && KNOWN_SLUGS.has(explicit)) {
    return explicit;
  }

  const text = (detectionReasons || []).join(' ').toLowerCase();

  if (text.includes('login') || text.includes('failed login')) {
    return 'login-attack';
  }
  if (text.includes('form submission') || (text.includes('form') && text.includes('spam'))) {
    return 'spam-bot';
  }
  if (text.includes('repetitive clicking') || text.includes('click rate') || text.includes('consecutive click')) {
    return 'click-spam';
  }
  if (text.includes('fast navigation') || (text.includes('navigation') && text.includes('page changes'))) {
    return flags.hasFastNavigation ? 'scraper-bot' : 'fast-navigation';
  }
  if (
    (flags.hasNoMouseMovement && flags.hasNoScroll) ||
    (text.includes('no mouse movement') && text.includes('no scroll'))
  ) {
    return 'no-interaction';
  }
  if (flags.hasFastNavigation || text.includes('navigation')) {
    return 'scraper-bot';
  }
  if (flags.hasUnusualClickPattern || text.includes('click')) {
    return 'click-spam';
  }
  if (flags.hasNoMouseMovement || flags.hasNoScroll) {
    return 'no-interaction';
  }
  if (text.includes('request rate') || text.includes('events/sec')) {
    return 'scraper-bot';
  }

  if (classification === 'SUSPICIOUS') {
    return 'suspicious';
  }
  if (classification === 'BOT') {
    return 'suspicious';
  }

  return null;
}
