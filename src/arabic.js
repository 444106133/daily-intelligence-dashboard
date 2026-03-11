/**
 * Shared Arabic utilities for all sections.
 * Includes smart English→Arabic translation engine for headlines.
 */

const RIYADH_TZ = 'Asia/Riyadh';

// ===== Comprehensive Translation Dictionary =====

// Topic detection (broader)
const TOPIC_MAP = {
  'diffusion': 'نماذج الانتشار',
  'reinforcement learning': 'التعلم المعزز',
  'language model': 'نموذج لغوي',
  'llm': 'نموذج لغوي كبير',
  'vision': 'رؤية حاسوبية',
  'multimodal': 'متعدد الوسائط',
  'video': 'توليد الفيديو',
  'generation': 'التوليد',
  'generative ai': 'الذكاء الاصطناعي التوليدي',
  'reasoning': 'الاستدلال',
  'code': 'البرمجة',
  'benchmark': 'معيار قياسي',
  'alignment': 'المواءمة',
  'safety': 'السلامة',
  '3d': 'ثلاثي الأبعاد',
  'speech': 'الكلام',
  'audio': 'الصوت',
  'medical': 'طبي',
  'image': 'الصور',
  'text-to': 'تحويل النص',
  'agent': 'عميل ذكي',
  'retrieval': 'استرجاع',
  'training': 'التدريب',
  'transformer': 'المحول',
  'fine-tuning': 'الضبط الدقيق',
  'smart grid': 'الشبكة الذكية',
  'renewable energy': 'الطاقة المتجددة',
  'solar': 'الطاقة الشمسية',
  'wind energy': 'طاقة الرياح',
  'wind power': 'طاقة الرياح',
  'wind farm': 'مزرعة رياح',
  'wind turbine': 'توربينات الرياح',
  'battery': 'البطاريات',
  'energy storage': 'تخزين الطاقة',
  'machine learning': 'تعلم الآلة',
  'deep learning': 'التعلم العميق',
  'classification': 'التصنيف',
  'clustering': 'التجميع',
  'neural network': 'شبكة عصبية',
  'hydrogen': 'الهيدروجين',
  'green hydrogen': 'الهيدروجين الأخضر',
  'nuclear': 'الطاقة النووية',
  'heat pump': 'المضخات الحرارية',
  'electric vehicle': 'السيارات الكهربائية',
  'ev charging': 'شحن السيارات الكهربائية',
  'carbon capture': 'احتجاز الكربون',
  'carbon neutral': 'الحياد الكربوني',
  'net zero': 'صفر انبعاثات',
  'data center': 'مراكز البيانات',
  'power grid': 'شبكة الكهرباء',
  'microgrid': 'الشبكات الصغرية',
  'demand response': 'استجابة الطلب',
  'grid modernization': 'تحديث الشبكة',
  'smart meter': 'العدادات الذكية',
  'outage': 'انقطاع التيار',
  'blackout': 'انقطاع الكهرباء',
  'electricity': 'الكهرباء',
  'natural gas': 'الغاز الطبيعي',
  'oil': 'النفط',
  'coal': 'الفحم',
  'geothermal': 'الطاقة الحرارية الأرضية',
  'hydropower': 'الطاقة الكهرومائية',
  'biomass': 'الكتلة الحيوية',
  'wave energy': 'طاقة الأمواج',
  'offshore wind': 'الرياح البحرية',
  'onshore wind': 'الرياح البرية',
  'photovoltaic': 'الخلايا الكهروضوئية',
  'inverter': 'محولات التيار',
  'grid-scale': 'واسعة النطاق',
  'utility': 'المرافق',
  'tariff': 'التعرفة',
  'subsidy': 'الدعم',
  'tax credit': 'الإعفاء الضريبي',
  'ipo': 'الطرح العام',
  'acquisition': 'الاستحواذ',
  'merger': 'الاندماج',
  'investment': 'الاستثمار',
  'funding': 'التمويل',
  'startup': 'شركة ناشئة',
  'regulation': 'التنظيم',
  'policy': 'السياسات',
  'climate change': 'تغير المناخ',
  'emissions': 'الانبعاثات',
  'decarbonization': 'إزالة الكربون',
  'sustainability': 'الاستدامة',
  'chatbot': 'روبوت المحادثة',
  'open source': 'مفتوح المصدر',
  'api': 'واجهة برمجة التطبيقات',
  'gpu': 'معالجات الرسوميات',
  'chip': 'الرقائق',
  'semiconductor': 'أشباه الموصلات',
  'quantum': 'الحوسبة الكمومية',
  'robotics': 'الروبوتات',
  'autonomous': 'ذاتي القيادة',
  'cybersecurity': 'الأمن السيبراني',
  'privacy': 'الخصوصية',
  'blockchain': 'البلوكتشين',
  'cloud': 'الحوسبة السحابية',
};

// Common English→Arabic action/verb phrases for headline translation
const VERB_PHRASES = [
  [/\blaunches?\b/i, 'تطلق'],
  [/\bannounces?\b/i, 'تعلن عن'],
  [/\breveals?\b/i, 'تكشف عن'],
  [/\bunveils?\b/i, 'تكشف النقاب عن'],
  [/\breleases?\b/i, 'تصدر'],
  [/\bacquires?\b/i, 'تستحوذ على'],
  [/\braises?\b/i, 'تجمع'],
  [/\bsecures?\b/i, 'تحصل على'],
  [/\bbans?\b/i, 'تحظر'],
  [/\bapproves?\b/i, 'توافق على'],
  [/\brejects?\b/i, 'ترفض'],
  [/\bwarns?\b/i, 'تحذر من'],
  [/\bcuts?\b/i, 'تخفض'],
  [/\bboosts?\b/i, 'تعزز'],
  [/\bexpands?\b/i, 'توسع'],
  [/\bpartners? with\b/i, 'تتعاون مع'],
  [/\binvests?\b/i, 'تستثمر في'],
  [/\bplans? to\b/i, 'تخطط لـ'],
  [/\btests?\b/i, 'تختبر'],
  [/\bdevelops?\b/i, 'تطور'],
  [/\bbuilds?\b/i, 'تبني'],
  [/\bopens?\b/i, 'تفتتح'],
  [/\bcloses?\b/i, 'تغلق'],
  [/\bsigns?\b/i, 'توقع'],
  [/\btargets?\b/i, 'تستهدف'],
  [/\bbacks?\b/i, 'تدعم'],
  [/\bstrikes?\b/i, 'تبرم صفقة'],
  [/\bhits? (?:record|high|low|milestone)\b/i, 'تسجل رقماً'],
  [/\bsets? (?:record|new)\b/i, 'تضع رقماً قياسياً'],
  [/\bbreaks? record\b/i, 'تحطم رقماً قياسياً'],
  [/\bhits?\b/i, 'تسجل'],
  [/\bsets?\b/i, 'تضع'],
  [/\bbreaks?\b/i, 'تحطم'],
  [/\bfaces?\b/i, 'تواجه'],
  [/\bsues?\b/i, 'ترفع دعوى ضد'],
  [/\bchallenges?\b/i, 'تتحدى'],
  [/\bshifts? to\b/i, 'تتحول إلى'],
  [/\bdelays?\b/i, 'تؤجل'],
  [/\bcancels?\b/i, 'تلغي'],
  [/\bsurpasses?\b/i, 'تتجاوز'],
  [/\bbeats?\b/i, 'تتفوق على'],
  [/\boutperforms?\b/i, 'تتفوق على'],
  [/\bstruggles?\b/i, 'تعاني من'],
  // Additional verbs
  [/\bfell\b|\bfalls?\b|\bdropped?\b|\bdeclined?\b/i, 'تتراجع في'],
  [/\bgrew\b|\bgrows?\b|\bincreased?\b|\brises?\b|\brose\b/i, 'تنمو في'],
  [/\brecords?\b/i, 'تسجل'],
  [/\breports?\b/i, 'تصدر تقريراً عن'],
  [/\bconsiders?\b|\bmay \b|\bcould \b/i, 'تدرس'],
  [/\bbrings?\b/i, 'تجلب'],
  [/\bpredicts?\b|\bforecasts?\b/i, 'تتوقع'],
  [/\bintroduces?\b/i, 'تقدم'],
  [/\bdeploys?\b/i, 'تنشر'],
  [/\bpushes?\b/i, 'تدفع باتجاه'],
  [/\bpowers?\b/i, 'تغذي'],
  [/\bshuts? down\b/i, 'توقف'],
  [/\benables?\b/i, 'تمكّن من'],
  [/\bwins?\b|\bwon\b/i, 'تفوز بـ'],
  [/\bloses?\b|\blost\b/i, 'تخسر'],
  [/\breplaces?\b/i, 'تستبدل'],
  [/\bupdates?\b/i, 'تحدّث'],
  [/\battacks?\b|\battacked\b/i, 'تهاجم'],
  [/\bblocks?\b|\bblocked\b/i, 'تعرقل'],
  [/\bsays?\b|\bsaid\b/i, 'تصرح'],
];

// Country name translations
const COUNTRY_MAP = {
  'us': 'الولايات المتحدة', 'u.s.': 'الولايات المتحدة', 'u.s': 'الولايات المتحدة',
  'united states': 'الولايات المتحدة', 'america': 'أمريكا',
  'uk': 'المملكة المتحدة', 'u.k.': 'المملكة المتحدة', 'britain': 'بريطانيا',
  'china': 'الصين', 'chinese': 'الصين',
  'japan': 'اليابان', 'japanese': 'اليابان',
  'india': 'الهند', 'indian': 'الهند',
  'germany': 'ألمانيا', 'german': 'ألمانيا',
  'france': 'فرنسا', 'french': 'فرنسا',
  'canada': 'كندا', 'canadian': 'كندا',
  'australia': 'أستراليا', 'australian': 'أستراليا',
  'saudi arabia': 'المملكة العربية السعودية', 'saudi': 'السعودية',
  'uae': 'الإمارات', 'dubai': 'دبي', 'abu dhabi': 'أبوظبي',
  'europe': 'أوروبا', 'european': 'أوروبا', 'eu': 'الاتحاد الأوروبي',
  'russia': 'روسيا', 'russian': 'روسيا',
  'brazil': 'البرازيل', 'south korea': 'كوريا الجنوبية', 'korea': 'كوريا',
  'spain': 'إسبانيا', 'spanish': 'إسبانيا',
  'italy': 'إيطاليا', 'italian': 'إيطاليا',
  'netherlands': 'هولندا', 'dutch': 'هولندا',
  'sweden': 'السويد', 'norway': 'النرويج', 'denmark': 'الدنمارك',
  'finland': 'فنلندا', 'austria': 'النمسا', 'switzerland': 'سويسرا',
  'iran': 'إيران', 'iraq': 'العراق', 'egypt': 'مصر',
  'israel': 'إسرائيل', 'turkey': 'تركيا', 'africa': 'أفريقيا',
  'asia': 'آسيا', 'global': 'عالمي',
  'texas': 'تكساس', 'california': 'كاليفورنيا', 'new york': 'نيويورك',
};

// Unit translations
const UNIT_MAP = {
  'gw': 'غيغاواط', 'mw': 'ميغاواط', 'kw': 'كيلوواط', 'tw': 'تيراواط',
  'gwh': 'غيغاواط ساعي', 'mwh': 'ميغاواط ساعي', 'kwh': 'كيلوواط ساعي',
  'billion': 'مليار', 'million': 'مليون', 'trillion': 'تريليون',
  'percent': 'بالمئة', '%': '٪',
};

// ===== Smart Translation Functions =====

/**
 * Translate an English headline into a contextual Arabic headline.
 * Preserves company names, numbers; translates key terms and countries.
 */
export function translateHeadline(englishTitle, options = {}) {
  if (!englishTitle) return 'خبر جديد';

  const title = englishTitle.trim();
  const lower = title.toLowerCase();

  // 1. Extract entities that should stay in English (company names, proper nouns)
  const entities = extractEntities(title);

  // 2. Detect ALL topics (not just first)
  const topics = detectAllTopics(title);
  const topic = topics[0] || null;
  const secondaryTopic = topics[1] || null;

  // 3. Detect country/region references
  const country = detectCountry(lower);

  // 4. Detect action verbs
  const action = detectAction(title);

  // 5. Extract numbers and stats
  const stats = extractNumbers(title);

  // 6. Build the Arabic headline — always aim for specificity

  const parts = [];

  // Entity prefix (e.g. "RWE", "Tesla", "OpenAI")
  if (entities.length > 0) {
    parts.push(entities[0]);
  }

  // Action verb (e.g. "تطلق", "تعلن عن")
  if (action) {
    parts.push(action);
  }

  // Topic(s)
  if (topic) {
    parts.push(topic);
    if (secondaryTopic && secondaryTopic !== topic) {
      parts.push(`و${secondaryTopic}`);
    }
  }

  // Country/region
  if (country) {
    parts.push(`في ${country}`);
  }

  // Stats suffix
  if (stats) {
    parts.push(`— ${stats}`);
  }

  // Build the joined headline
  if (parts.length >= 2) {
    const headline = parts.join(' ');

    // If the headline is too short (under 40 chars), add the original title as context
    // This helps cases like "Google تعلن عن الاستدلال" → add ": Reasoning AI Model Breakthrough"
    if (headline.length < 40 && title.length > 20) {
      return `${headline} | ${title}`;
    }
    return headline;
  }

  // Fallback: combine what we have with the original title
  if (parts.length === 1 && parts[0]) {
    return `${parts[0]}: ${title}`;
  }

  // Last resort — use original title (always meaningful)
  if (entities.length > 0) {
    return `${entities[0]}: ${title}`;
  }

  return title;
}

/**
 * Generate a rich Arabic summary from the title + description.
 */
export function generateArabicSummary(title, description, sourceName) {
  const parts = [];

  // Use description if available
  if (description && description.length > 20) {
    parts.push(description);
  }

  // Add context from the title
  const topic = detectTopic(title);
  const country = detectCountry((title || '').toLowerCase());
  const entities = extractEntities(title);
  const stats = extractNumbers(title);

  // Build contextual suffix
  const contextParts = [];
  if (topic) contextParts.push(`في مجال ${topic}`);
  if (country) contextParts.push(`في ${country}`);
  if (entities.length > 0) contextParts.push(`من ${entities.slice(0, 2).join(' و')}`);

  if (parts.length === 0) {
    // No description available — build from metadata
    let summary = 'خبر ';
    if (sourceName) summary += `من ${sourceName} `;
    if (contextParts.length > 0) summary += contextParts.join(' ');
    if (stats) summary += ` — ${stats}`;
    parts.push(summary);
  }

  return parts.join(' | ');
}

/**
 * Extract likely entity names (companies, organizations, proper nouns).
 */
function extractEntities(title) {
  if (!title) return [];

  const entities = [];

  // Known major entities to keep in their original form
  const KNOWN_ENTITIES = [
    'Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'OpenAI', 'Anthropic',
    'NVIDIA', 'Nvidia', 'Tesla', 'SpaceX', 'DeepMind', 'Hugging Face',
    'Samsung', 'Intel', 'AMD', 'IBM', 'Oracle', 'Salesforce', 'Adobe',
    'Netflix', 'Uber', 'Lyft', 'Twitter', 'X Corp', 'LinkedIn',
    'ByteDance', 'TikTok', 'Alibaba', 'Tencent', 'Baidu', 'Huawei',
    'Siemens', 'Shell', 'BP', 'ExxonMobil', 'Chevron', 'TotalEnergies',
    'Repsol', 'Nordex', 'Vestas', 'Ørsted', 'Enel', 'Iberdrola', 'RWE',
    'EDF', 'Engie', 'NextEra', 'Duke Energy', 'Southern Company',
    'First Solar', 'SunPower', 'Enphase', 'SolarEdge', 'LONGi',
    'BYD', 'CATL', 'Panasonic', 'LG Energy', 'Rivian', 'Lucid',
    'Mistral', 'Cohere', 'Stability AI', 'Midjourney', 'Perplexity',
    'Gemini', 'Claude', 'ChatGPT', 'GPT', 'Llama', 'LLaMA',
    'SEIA', 'IEA', 'EIA', 'IRENA', 'OPEC', 'DOE', 'EPA', 'FERC',
    'Eco Wave Power', 'EverWind', 'Nuvve', 'Wood Mackenzie',
    'UN', 'NATO', 'WHO', 'IMF', 'World Bank',
    'Trump', 'Biden', 'Musk',
  ];

  for (const entity of KNOWN_ENTITIES) {
    if (title.includes(entity)) {
      entities.push(entity);
    }
  }

  // Also capture capitalized words that look like company names (2+ capital words)
  const capPattern = /(?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/g;
  const capMatches = title.match(capPattern) || [];
  for (const m of capMatches) {
    if (!entities.includes(m) && !isCommonPhrase(m) && m.length > 3) {
      entities.push(m);
    }
  }

  return entities.slice(0, 3); // max 3 entities
}

function isCommonPhrase(phrase) {
  const common = new Set([
    'The New', 'How To', 'What Is', 'Why Does', 'Will Be', 'Has Been',
    'New York', 'San Francisco', 'Los Angeles', 'United States', 'United Kingdom',
    'South Korea', 'North America', 'South America', 'Middle East',
    'Wall Street', 'White House', 'Deep Learning', 'Machine Learning',
    'Artificial Intelligence', 'Natural Language', 'Computer Vision',
    'Energy Storage', 'Smart Grid', 'Renewable Energy', 'Climate Change',
    'Data Center', 'Open Source', 'Large Language',
  ]);
  return common.has(phrase);
}

/**
 * Detect an action verb and return its Arabic equivalent.
 */
function detectAction(title) {
  for (const [pattern, arabic] of VERB_PHRASES) {
    if (pattern.test(title)) {
      return arabic;
    }
  }
  return null;
}

/**
 * Detect country/region references.
 */
function detectCountry(lower) {
  // Longer matches first
  const sortedEntries = Object.entries(COUNTRY_MAP)
    .sort((a, b) => b[0].length - a[0].length);

  for (const [key, val] of sortedEntries) {
    if (lower.includes(key)) return val;
  }
  return null;
}

/**
 * Extract numbers, percentages, and monetary values.
 */
function extractNumbers(title) {
  if (!title) return '';

  const parts = [];

  // Monetary values: $X billion/million
  const moneyMatch = title.match(/\$\s*([\d,.]+)\s*(billion|million|trillion)?/i);
  if (moneyMatch) {
    const num = moneyMatch[1];
    const unit = moneyMatch[2] ? UNIT_MAP[moneyMatch[2].toLowerCase()] || moneyMatch[2] : '';
    parts.push(`${num} ${unit} دولار`.trim());
  }

  // Percentages
  const pctMatch = title.match(/([\d,.]+)\s*(%|percent)/i);
  if (pctMatch) {
    parts.push(`${pctMatch[1]}٪`);
  }

  // Energy units: GW, MW, GWh
  const energyMatch = title.match(/([\d,.]+)\s*(GW|MW|kW|TWh|GWh|MWh|kWh)(?:\b|h)/i);
  if (energyMatch) {
    const unit = UNIT_MAP[energyMatch[2].toLowerCase()] || energyMatch[2];
    parts.push(`${energyMatch[1]} ${unit}`);
  }

  return parts.join(' — ');
}

// ===== Original utility functions =====

export function detectTopic(text) {
  const lower = (text || '').toLowerCase();
  // Longer matches first for accuracy
  const sorted = Object.entries(TOPIC_MAP)
    .sort((a, b) => b[0].length - a[0].length);

  for (const [key, val] of sorted) {
    if (lower.includes(key)) return val;
  }
  return null;
}

/**
 * Detect ALL matching topics in the text (returns up to 3).
 * Used by translateHeadline for richer multi-topic headlines.
 */
function detectAllTopics(text) {
  const lower = (text || '').toLowerCase();
  const sorted = Object.entries(TOPIC_MAP)
    .sort((a, b) => b[0].length - a[0].length);

  const found = [];
  const seenValues = new Set();

  for (const [key, val] of sorted) {
    if (lower.includes(key) && !seenValues.has(val)) {
      found.push(val);
      seenValues.add(val);
      if (found.length >= 3) break;
    }
  }
  return found;
}

export function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  const hours = (new Date() - new Date(dateStr)) / (1000 * 60 * 60);
  if (hours < 1) return 'منذ أقل من ساعة';
  if (hours < 24) return `منذ ${Math.floor(hours)} ساعة`;
  if (hours < 48) return 'منذ يوم';
  return `منذ ${Math.floor(hours / 24)} أيام`;
}

export function getHoursAgo(dateStr) {
  if (!dateStr) return 999;
  return (new Date() - new Date(dateStr)) / (1000 * 60 * 60);
}

export function updateClock() {
  const el = document.getElementById('current-time');
  if (!el) return;
  el.textContent = new Date().toLocaleTimeString('en-US', {
    timeZone: RIYADH_TZ,
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
}

export function truncateSummary(text, maxSentences = 3) {
  if (!text) return 'لا يتوفر ملخص.';
  return text.split(/[.!?]+/).filter(s => s.trim().length > 15).slice(0, maxSentences).join('. ').trim();
}
