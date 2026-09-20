export type Platform = 'redbubble' | 'etsy';
export type CompetitionLevel = 'low' | 'medium' | 'high';

export interface TagResult {
  tag: string;
  competition: CompetitionLevel;
  searchVolume: number;
  charCount: number;
}

export interface MetadataResult {
  platform: Platform;
  mainTag: string;
  secondaryTags: TagResult[];
  productTitle: string;
  productDescription: string;
  productType: string;
  opportunityScore: number;
  nicheCompetition: CompetitionLevel;
}

export interface PlatformConfig {
  totalTags: number;
  secondaryTagCount: number;
  tagCharLimit: number;
  titleCharLimit: number;
  descCharLimit: number;
}

export const PLATFORM_LIMITS: Record<Platform, PlatformConfig> = {
  redbubble: { totalTags: 15, secondaryTagCount: 14, tagCharLimit: 50, titleCharLimit: 100, descCharLimit: 500 },
  etsy: { totalTags: 13, secondaryTagCount: 13, tagCharLimit: 20, titleCharLimit: 140, descCharLimit: 500 },
};

const PROTECTED_WORDS = [
  'nike', 'adidas', 'pokemon', 'disney', 'marvel', 'star wars', 'harry potter',
  'nintendo', 'sony', 'apple', 'google', 'microsoft', 'coca cola', 'pepsi',
  'batman', 'superman', 'spider-man', 'minecraft', 'fortnite', 'pokemon go',
  'hello kitty', 'naruto', 'one piece', 'dragon ball', 'starbucks', 'mcdonalds',
];

const REDBUBBLE_BROAD = [
  'shirt', 'sticker', 'design', 'art', 'gift', 'lover', 'apparel',
  'trendy', 'cool', 'funny', 'cute', 'aesthetic', 'vintage', 'retro',
  'graphic', 'illustration', 'poster', 'print', 'merch',
];

const REDBUBBLE_LONG_TAIL = [
  'gift idea', 'for men', 'for women', 'for kids', 'for teens',
  't-shirt design', 'sticker pack', 'phone case', 'laptop sticker',
  'water bottle', 'tote bag', 'hoodie design', 'mug design',
  'wall art decor', 'birthday gift', 'christmas present',
  'funny saying', 'quote shirt', 'hobby shirt', 'passion design',
  'minimalist art', 'kawaii style', 'indie aesthetic', 'retro vibes',
  'mom gift', 'dad gift', 'teacher gift', 'nurse gift',
  'gamer tee', 'coffee lover', 'plant parent', 'book lover',
  'cat mom', 'dog dad', 'music lover', 'art enthusiast',
];

const ETSY_SHORT_MODIFIERS = [
  'shirt', 'tee', 'gift', 'art', 'mug', 'sticker', 'decal',
  'poster', 'print', 'hoodie', 'pin', 'tote', 'card',
  'love', 'fan', 'mom', 'dad', 'club', 'team', 'squad',
  'vibe', 'mood', 'punk', 'core', 'life', 'soul',
  'vintage', 'retro', 'aesthetic', 'kawaii', 'indie',
  'funny', 'sarcastic', 'sassy', 'proud', 'cool',
];

const ETSY_PRODUCT_MODIFIERS = [
  't-shirt', 'shirt', 'tee', 'gift', 'mug', 'sticker',
  'hoodie', 'poster', 'print', 'art', 'decal',
];

const TITLE_ADJECTIVES = [
  'Premium', 'Unique', 'Retro', 'Vintage', 'Minimalist', 'Trendy',
  'Cool', 'Aesthetic', 'Classic', 'Modern', 'Original', 'Stylish',
];

const TITLE_NOUNS = [
  'Design', 'Art', 'Graphic', 'Illustration', 'Pattern', 'Artwork',
  'Print', 'Style', 'Vibe', 'Concept',
];

const REDBUBBLE_TITLE_MODIFIERS = [
  'T-Shirt', 'Sticker', 'Phone Case', 'Hoodie', 'Poster',
  'Laptop Skin', 'Mug', 'Tote Bag', 'Pillow',
];

const REDBUBBLE_TITLE_TEMPLATES = [
  '{kw} - {adj} {noun} | {modifier}',
  '{adj} {kw} {noun} - {modifier}',
  '{kw} {noun} | {modifier} {adj}',
  '{modifier} {kw} - {adj} {noun}',
  '{kw} - {adj} {noun} {modifier}',
];

const REDBUBBLE_DESC_TEMPLATES = [
  'Show off your love for {kw} with this {adj.lower()} {noun.lower()} perfect for {product}. Whether you\'re looking for a gift for a {kw} enthusiast or treating yourself, this {adj.lower()} design features a unique {kw}-inspired aesthetic that stands out. Available on stickers, t-shirts, phone cases, and more.',
  'This {adj.lower()} {kw} {noun.lower()} is the perfect way to express your passion. Featuring a {kw}-themed {adj.lower()} aesthetic, this design makes an ideal gift for {kw} lovers and enthusiasts alike. Printed on high-quality {product}, hoodies, stickers, and wall art — there\'s a style for everyone.',
  'Express your style with this {adj.lower()} {kw} {noun.lower()}. A must-have for any {kw} fan, this {adj.lower()} artwork combines {kw} aesthetics with {adj.lower()} flair. Perfect as a gift for {kw} lovers or as a treat for yourself — available across t-shirts, stickers, phone cases, and home decor.',
];

const ETSY_TITLE_SEGMENTS = [
  '{Kw} {product}', '{adj} {kw} {product}', '{kw} gift', 'gift for {kw} lovers',
  '{kw} {noun}', '{adj} {kw} {noun}', '{kw} shirt', '{kw} t-shirt',
  '{kw} sticker', '{kw} mug', '{kw} poster', '{kw} hoodie',
  'retro {kw}', 'vintage {kw}', 'funny {kw}', '{kw} decor',
  '{kw} apparel', '{kw} merchandise', '{kw} accessory', '{kw} wall art',
  '{kw} phone case', '{kw} tote bag', '{kw} laptop', '{kw} pillow',
];

const ETSY_DESC_BULLET_TEMPLATES = [
  '✦ {adj} {kw} {noun.lower()} perfect for {product} lovers',
  '✦ Great gift for {kw} enthusiasts, friends, and family',
  '✦ High-quality {product} with a unique {kw}-inspired aesthetic',
  '✦ Available in multiple sizes and colors to suit your style',
  '✦ Perfect for birthdays, holidays, or everyday {kw} appreciation',
  '✦ {adj} artwork that stands out and sparks conversation',
  '✦ Show your love for {kw} with this eye-catching {noun.lower()}',
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function isProtected(tag: string): boolean {
  const lower = tag.toLowerCase();
  return PROTECTED_WORDS.some((w) => lower.includes(w));
}

function titleCase(str: string): string {
  return str
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function truncateTag(tag: string, maxLen: number): string {
  if (tag.length <= maxLen) return tag;
  const words = tag.split(' ');
  let result = '';
  for (const w of words) {
    if ((result + ' ' + w).trim().length > maxLen) break;
    result = result ? result + ' ' + w : w;
  }
  return result || tag.slice(0, maxLen).trim();
}

function pickCompetition(tag: string, rand: () => number): CompetitionLevel {
  const lower = tag.toLowerCase();
  if (['retro', 'vintage', 'aesthetic', 'minimalist', 'indie', 'obscure', 'kawaii'].some((h) => lower.includes(h))) {
    return rand() < 0.65 ? 'low' : 'medium';
  }
  if (['love', 'cat', 'dog', 'funny', 'cool', 'awesome', 'best', 'gift'].some((h) => lower.includes(h))) {
    return rand() < 0.55 ? 'high' : 'medium';
  }
  const r = rand();
  if (r < 0.35) return 'low';
  if (r < 0.75) return 'medium';
  return 'high';
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function pickUnique<T>(arr: T[], rand: () => number, used: Set<T>): T {
  let attempts = 0;
  let item: T;
  do {
    item = pick(arr, rand);
    attempts++;
  } while (used.has(item) && attempts < 30);
  used.add(item);
  return item;
}

function searchVolumeFor(competition: CompetitionLevel, rand: () => number): number {
  return competition === 'low'
    ? Math.floor(rand() * 800) + 100
    : competition === 'medium'
    ? Math.floor(rand() * 3000) + 800
    : Math.floor(rand() * 8000) + 3000;
}

function generateRedbubbleTags(keyword: string, rand: () => number): TagResult[] {
  const used = new Set<string>([keyword]);
  const tags: TagResult[] = [];
  const broadCount = 5;
  const longTailCount = 9;

  for (let i = 0; i < broadCount; i++) {
    let tag: string;
    let attempts = 0;
    do {
      const mod = pick(REDBUBBLE_BROAD, rand);
      tag = rand() < 0.5 ? `${keyword} ${mod}` : `${mod} ${keyword}`;
      attempts++;
    } while (used.has(tag) && attempts < 20);
    if (used.has(tag)) continue;
    used.add(tag);
    const competition = pickCompetition(tag, rand);
    tags.push({ tag, competition, searchVolume: searchVolumeFor(competition, rand), charCount: tag.length });
  }

  for (let i = 0; i < longTailCount; i++) {
    let tag: string;
    let attempts = 0;
    do {
      const mod = pick(REDBUBBLE_LONG_TAIL, rand);
      tag = rand() < 0.6 ? `${keyword} ${mod}` : `${mod} ${keyword}`;
      attempts++;
    } while (used.has(tag) && attempts < 20);
    if (used.has(tag)) continue;
    used.add(tag);
    const competition = pickCompetition(tag, rand);
    tags.push({ tag, competition, searchVolume: searchVolumeFor(competition, rand), charCount: tag.length });
  }

  return tags.slice(0, 14);
}

function generateEtsyTags(keyword: string, rand: () => number): TagResult[] {
  const used = new Set<string>();
  const tags: TagResult[] = [];
  const charLimit = 20;

  for (let i = 0; i < 13; i++) {
    let tag: string;
    let attempts = 0;
    do {
      const mod = pick(ETSY_SHORT_MODIFIERS, rand);
      tag = rand() < 0.5 ? `${keyword} ${mod}` : `${mod} ${keyword}`;
      tag = truncateTag(tag, charLimit);
      attempts++;
    } while ((used.has(tag) || tag.length < 3) && attempts < 30);
    if (used.has(tag) || tag.length < 3) continue;
    used.add(tag);
    const competition = pickCompetition(tag, rand);
    tags.push({ tag, competition, searchVolume: searchVolumeFor(competition, rand), charCount: tag.length });
  }

  return tags.slice(0, 13);
}

function generateRedbubbleTitle(keyword: string, productType: string, rand: () => number): string {
  const template = pick(REDBUBBLE_TITLE_TEMPLATES, rand);
  const adj = pick(TITLE_ADJECTIVES, rand);
  const noun = pick(TITLE_NOUNS, rand);
  const modifier = productType || pick(REDBUBBLE_TITLE_MODIFIERS, rand);
  return template
    .replace('{kw}', titleCase(keyword))
    .replace('{adj}', adj)
    .replace('{noun}', noun)
    .replace('{modifier}', modifier);
}

function generateEtsyTitle(keyword: string, productType: string, rand: () => number): string {
  const usedSegs = new Set<string>();
  const segments: string[] = [];
  const segCount = 4 + Math.floor(rand() * 2);

  const product = productType || pick(ETSY_PRODUCT_MODIFIERS, rand);

  for (let i = 0; i < segCount; i++) {
    let seg: string;
    let attempts = 0;
    do {
      const tmpl = pick(ETSY_TITLE_SEGMENTS, rand);
      seg = tmpl
        .replace('{Kw}', titleCase(keyword))
        .replace('{kw}', keyword)
        .replace('{product}', product.toLowerCase())
        .replace('{adj}', pick(TITLE_ADJECTIVES, rand))
        .replace('{noun}', pick(TITLE_NOUNS, rand).toLowerCase());
      attempts++;
    } while (usedSegs.has(seg.toLowerCase()) && attempts < 20);
    usedSegs.add(seg.toLowerCase());
    segments.push(seg);
  }

  return segments.join(' | ');
}

function generateRedbubbleDescription(keyword: string, productType: string, rand: () => number): string {
  const template = pick(REDBUBBLE_DESC_TEMPLATES, rand);
  const adj = pick(TITLE_ADJECTIVES, rand);
  const noun = pick(TITLE_NOUNS, rand);
  const product = productType ? productType.toLowerCase() : pick(['t-shirts', 'stickers', 'phone cases', 'hoodies'], rand);
  return template
    .replace(/{kw}/g, keyword)
    .replace(/{adj\.lower}/g, adj.toLowerCase())
    .replace(/{noun\.lower}/g, noun.toLowerCase())
    .replace(/{product}/g, product);
}

function generateEtsyDescription(keyword: string, productType: string, rand: () => number): string {
  const product = productType || pick(ETSY_PRODUCT_MODIFIERS, rand);
  const usedBullets = new Set<string>();
  const bullets: string[] = [];
  const bulletCount = 5;

  for (let i = 0; i < bulletCount; i++) {
    let bullet: string;
    let attempts = 0;
    do {
      const tmpl = pick(ETSY_DESC_BULLET_TEMPLATES, rand);
      bullet = tmpl
        .replace(/{kw}/g, keyword)
        .replace(/{adj}/g, pick(TITLE_ADJECTIVES, rand))
        .replace(/{noun\.lower}/g, pick(TITLE_NOUNS, rand).toLowerCase())
        .replace(/{product}/g, product.toLowerCase());
      attempts++;
    } while (usedBullets.has(bullet) && attempts < 20);
    usedBullets.add(bullet);
    bullets.push(bullet);
  }

  const intro = `Looking for the perfect ${keyword} ${product.toLowerCase()}? This unique design is made for ${keyword} lovers who want to stand out.`;
  return intro + '\n\n' + bullets.join('\n');
}

const TAG_SANITIZE_RE = /[<>"'&\u0000-\u001f\u007f]/g;

function sanitizeText(input: string): string {
  return input.replace(TAG_SANITIZE_RE, '').trim();
}

export function generateMetadata(
  keyword: string,
  platform: Platform,
  productType?: string
): MetadataResult {
  const cleanKw = sanitizeText(keyword).toLowerCase().replace(/\s+/g, ' ');
  const cleanProduct = sanitizeText(productType || '');
  const seed = hashString(cleanKw + platform + cleanProduct);
  const rand = seededRandom(seed);

  const mainTag = platform === 'etsy' ? truncateTag(cleanKw, 20) : cleanKw;

  const secondaryTags =
    platform === 'etsy'
      ? generateEtsyTags(cleanKw, rand)
      : generateRedbubbleTags(cleanKw, rand);

  const productTitle =
    platform === 'etsy'
      ? generateEtsyTitle(cleanKw, cleanProduct, rand)
      : generateRedbubbleTitle(cleanKw, cleanProduct, rand);

  const productDescription =
    platform === 'etsy'
      ? generateEtsyDescription(cleanKw, cleanProduct, rand)
      : generateRedbubbleDescription(cleanKw, cleanProduct, rand);

  const { score: opportunityScore, competition: nicheCompetition } = computeOpportunityScore(cleanKw, rand);

  return {
    platform,
    mainTag,
    secondaryTags,
    productTitle,
    productDescription,
    productType: cleanProduct,
    opportunityScore,
    nicheCompetition,
  };
}

function computeOpportunityScore(keyword: string, rand: () => number): { score: number; competition: CompetitionLevel } {
  const lower = keyword.toLowerCase();
  const highCompWords = ['love', 'cat', 'dog', 'funny', 'cool', 'awesome', 'best', 'gift', 'shirt', 'sticker'];
  const lowCompWords = ['retro', 'vintage', 'aesthetic', 'minimalist', 'indie', 'obscure', 'kawaii', 'niche', 'obscure'];

  let base = 50 + Math.floor(rand() * 30);
  if (highCompWords.some((w) => lower.includes(w))) base -= 15;
  if (lowCompWords.some((w) => lower.includes(w))) base += 20;
  if (lower.split(' ').length >= 3) base += 10;

  const score = Math.max(15, Math.min(99, base));
  let competition: CompetitionLevel;
  if (score >= 70) competition = 'low';
  else if (score >= 40) competition = 'medium';
  else competition = 'high';

  return { score, competition };
}

export function checkTrademark(keyword: string): boolean {
  return isProtected(keyword);
}

export function getTagsAsCommaString(result: MetadataResult): string {
  return result.secondaryTags.map((t) => t.tag).join(', ');
}

export function getAllTagsAsString(result: MetadataResult): string {
  return [result.mainTag, ...result.secondaryTags.map((t) => t.tag)].join(', ');
}
