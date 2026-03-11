// ===== Arabic Translation Map for Paper Categories =====
const ARABIC_HEADLINES = {
  'diffusion': 'نماذج الانتشار',
  'reinforcement learning': 'التعلم المعزز',
  'language model': 'نموذج لغوي',
  'vision': 'رؤية حاسوبية',
  'multimodal': 'متعدد الوسائط',
  'video': 'توليد الفيديو',
  'generation': 'التوليد',
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
  'self-evolving': 'التطور الذاتي',
  'tokenizer': 'المُرمِّز',
  'quantization': 'التكميم',
  'sparsity': 'التناثر',
  'editing': 'التحرير',
  'training': 'التدريب',
  'debug': 'التصحيح',
  'world model': 'نموذج العالم',
};

// ===== Major Orgs for ranking boost =====
const MAJOR_ORGS = new Set([
  'nvidia', 'google', 'metaresearch', 'meta', 'microsoft', 'microsoftresearch',
  'openai', 'deepmind', 'amazon', 'apple', 'adobe', 'anthropic',
  'tsinghua', 'stanford', 'mit', 'berkeley', 'cmu',
]);

// ===== Riyadh Timezone =====
const RIYADH_TZ = 'Asia/Riyadh';

// ===== State =====
let allPapers = [];
let currentFilter = 'all';
let searchQuery = '';

// ===== Time Utilities =====
function getNowRiyadh() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: RIYADH_TZ }));
}

function getHoursAgo(dateStr) {
  const paperDate = new Date(dateStr);
  const now = new Date();
  return (now - paperDate) / (1000 * 60 * 60);
}

function formatTimeAgo(dateStr) {
  const hours = getHoursAgo(dateStr);
  if (hours < 1) return 'منذ أقل من ساعة';
  if (hours < 24) return `منذ ${Math.floor(hours)} ساعة`;
  if (hours < 48) return 'منذ يوم';
  return `منذ ${Math.floor(hours / 24)} أيام`;
}

function updateClock() {
  const el = document.getElementById('current-time');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString('en-US', {
    timeZone: RIYADH_TZ,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

// ===== Generate Arabic Headline =====
function generateArabicHeadline(paper) {
  const title = (paper.title || '').toLowerCase();
  const summary = (paper.ai_summary || paper.summary || '').toLowerCase();
  const combined = title + ' ' + summary;

  // Detect main topic
  let mainTopic = 'بحث ذكاء اصطناعي';
  for (const [key, val] of Object.entries(ARABIC_HEADLINES)) {
    if (combined.includes(key)) {
      mainTopic = val;
      break;
    }
  }

  // Generate a contextual Arabic headline
  const org = paper.organization?.fullname || '';
  const upvotes = paper.upvotes || 0;

  if (upvotes >= 20) {
    return `🔥 إنجاز بارز في ${mainTopic}${org ? ` من ${org}` : ''} يجذب اهتماماً واسعاً`;
  } else if (upvotes >= 10) {
    return `⭐ تقدم ملحوظ في ${mainTopic}${org ? ` — بحث من ${org}` : ''}`;
  } else if (paper.githubRepo) {
    return `🔬 بحث جديد في ${mainTopic} مع إصدار الكود المصدري${org ? ` — ${org}` : ''}`;
  } else {
    return `📄 بحث جديد في ${mainTopic}${org ? ` من ${org}` : ''}`;
  }
}

// ===== Generate Arabic Summary =====
function generateArabicSummary(paper) {
  const aiSummary = paper.ai_summary || '';
  const summary = paper.summary || '';
  const source = aiSummary || summary;

  if (!source) return 'لا يتوفر ملخص.';

  // Build a focused Arabic summary
  const sentences = source.split(/[.!?]+/).filter(s => s.trim().length > 20).slice(0, 3);
  const englishSummary = sentences.join('. ').trim();

  // Add context about why it matters
  let importance = '';
  const upvotes = paper.upvotes || 0;
  const stars = paper.githubStars || 0;

  if (upvotes >= 15) {
    importance = ' — يحظى باهتمام مجتمعي كبير';
  } else if (stars >= 10) {
    importance = ' — الكود المصدري متاح ويحظى بتفاعل المطورين';
  } else if (paper.githubRepo) {
    importance = ' — الكود المصدري متاح للعموم';
  }

  return `${englishSummary}${importance}`;
}

// ===== Score & Rank Papers =====
function scorePaper(paper) {
  let score = 0;
  score += (paper.upvotes || 0) * 5;
  score += (paper.githubStars || 0) * 2;
  score += (paper.numComments || 0) * 3;

  // Org prestige
  const orgName = (paper.organization?.name || '').toLowerCase();
  if (MAJOR_ORGS.has(orgName)) score += 15;

  // Has code
  if (paper.githubRepo) score += 8;

  // Has project page
  if (paper.projectPage) score += 3;

  // Recency bonus (last 12h get extra)
  const hoursAgo = getHoursAgo(paper.submittedOnDailyAt || paper.publishedAt);
  if (hoursAgo < 12) score += 10;
  else if (hoursAgo < 24) score += 5;

  return score;
}

function processPapers(rawData) {
  const now = new Date();
  const _24hAgo = new Date(now - 24 * 60 * 60 * 1000);
  const _72hAgo = new Date(now - 72 * 60 * 60 * 1000);

  const papers = rawData.map((item) => {
    const p = item.paper || item;
    const submittedAt = p.submittedOnDailyAt || p.publishedAt || '';
    const submittedDate = new Date(submittedAt);
    const isWithin24h = submittedDate >= _24hAgo;
    const isWithin72h = submittedDate >= _72hAgo;

    return {
      id: p.id,
      title: p.title,
      summary: p.summary,
      ai_summary: p.ai_summary,
      ai_keywords: p.ai_keywords || [],
      upvotes: p.upvotes || 0,
      githubStars: p.githubStars || 0,
      githubRepo: p.githubRepo || null,
      projectPage: p.projectPage || null,
      numComments: item.numComments || 0,
      organization: p.organization || item.organization || null,
      submittedAt,
      publishedAt: p.publishedAt || item.publishedAt,
      isWithin24h,
      isOlderThan24h: !isWithin24h,
      link: `https://huggingface.co/papers/${p.id}`,
      score: 0,
      arabicHeadline: '',
      arabicSummary: '',
    };
  }).filter(p => {
    // Keep papers within 72h
    const submittedDate = new Date(p.submittedAt);
    return submittedDate >= _72hAgo;
  });

  // Score
  papers.forEach(p => {
    p.score = scorePaper(p);
    p.arabicHeadline = generateArabicHeadline(p);
    p.arabicSummary = generateArabicSummary(p);
  });

  // Sort by score descending
  papers.sort((a, b) => b.score - a.score);

  return papers;
}

// ===== SVG Icons =====
const ICONS = {
  upvote: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>`,
  star: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
  comment: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
  link: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`,
  code: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  fire: `🔥`,
  clock: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
};

// ===== Render Paper Card =====
function renderPaperCard(paper, rank) {
  const isTop3 = rank <= 3;
  const badges = [];

  if (paper.organization) {
    badges.push(`<span class="badge badge-org">${paper.organization.fullname || paper.organization.name}</span>`);
  }
  if (paper.isOlderThan24h) {
    badges.push(`<span class="badge badge-old">${ICONS.clock} أقدم من ٢٤ ساعة</span>`);
  }
  if (paper.githubRepo) {
    badges.push(`<span class="badge badge-code">${ICONS.code} كود مفتوح</span>`);
  }
  if (paper.upvotes >= 10) {
    badges.push(`<span class="badge badge-hot">${ICONS.fire} رائج</span>`);
  }

  const keywords = (paper.ai_keywords || []).slice(0, 5).map(kw =>
    `<span class="keyword-tag">${kw}</span>`
  ).join('');

  return `
    <article class="paper-card" data-within24h="${paper.isWithin24h}" data-has-code="${!!paper.githubRepo}" data-score="${paper.score}">
      <div class="paper-meta">
        <span class="paper-rank ${isTop3 ? 'top-3' : ''}">${rank}</span>
        <div class="paper-badges">${badges.join('')}</div>
      </div>

      <h3 class="paper-headline-ar">${paper.arabicHeadline}</h3>

      <h4 class="paper-title">
        <a href="${paper.link}" target="_blank" rel="noopener" dir="ltr">${paper.title}</a>
      </h4>

      <p class="paper-summary" id="summary-${paper.id}">${paper.arabicSummary}</p>
      <button class="expand-btn" onclick="toggleSummary('${paper.id}')">عرض المزيد ↓</button>

      ${keywords ? `<div class="paper-keywords">${keywords}</div>` : ''}

      <div class="paper-stats">
        <span class="stat-item upvotes">${ICONS.upvote} ${paper.upvotes}</span>
        ${paper.githubStars ? `<span class="stat-item stars">${ICONS.star} ${paper.githubStars}</span>` : ''}
        ${paper.numComments ? `<span class="stat-item comments">${ICONS.comment} ${paper.numComments}</span>` : ''}
        <span class="stat-item">${ICONS.clock} ${formatTimeAgo(paper.submittedAt)}</span>
        <a href="${paper.link}" target="_blank" rel="noopener" class="paper-link">
          عرض في HuggingFace ${ICONS.link}
        </a>
      </div>
    </article>
  `;
}

// ===== Toggle Summary =====
window.toggleSummary = function(id) {
  const el = document.getElementById(`summary-${id}`);
  if (!el) return;
  el.classList.toggle('expanded');
  const btn = el.nextElementSibling;
  if (btn) {
    btn.textContent = el.classList.contains('expanded') ? 'عرض أقل ↑' : 'عرض المزيد ↓';
  }
};

// ===== Update Stats =====
function updateStats(papers) {
  const total = papers.length;
  const within24h = papers.filter(p => p.isWithin24h).length;
  const maxUpvotes = papers.reduce((max, p) => Math.max(max, p.upvotes), 0);
  const orgs = new Set(papers.filter(p => p.organization).map(p => p.organization.name));

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-24h').textContent = within24h;
  document.getElementById('stat-upvotes').textContent = maxUpvotes;
  document.getElementById('stat-orgs').textContent = orgs.size;
}

// ===== Filter & Render =====
function filterAndRender() {
  let filtered = [...allPapers];

  // Apply filter
  switch (currentFilter) {
    case '24h':
      filtered = filtered.filter(p => p.isWithin24h);
      break;
    case 'trending':
      filtered = filtered.filter(p => p.upvotes >= 5 || p.githubStars >= 5);
      break;
    case 'code':
      filtered = filtered.filter(p => p.githubRepo);
      break;
  }

  // Apply search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.arabicHeadline || '').includes(q) ||
      (p.ai_keywords || []).some(k => k.toLowerCase().includes(q)) ||
      (p.organization?.name || '').toLowerCase().includes(q) ||
      (p.organization?.fullname || '').toLowerCase().includes(q)
    );
  }

  const grid = document.getElementById('papers-grid');
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
        <p style="font-size: 2rem; margin-bottom: 12px;">📭</p>
        <p>لا توجد نتائج مطابقة</p>
      </div>
    `;
  } else {
    grid.innerHTML = filtered.map((p, i) => renderPaperCard(p, i + 1)).join('');
  }
}

// ===== Fetch Papers =====
async function fetchPapers() {
  const loading = document.getElementById('loading');
  const error = document.getElementById('error-state');
  const grid = document.getElementById('papers-grid');
  const refreshBtn = document.getElementById('refresh-btn');

  loading.classList.remove('hidden');
  error.classList.add('hidden');
  grid.innerHTML = '';
  refreshBtn.classList.add('spinning');

  try {
    const res = await fetch('/api/daily_papers');
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const data = await res.json();

    allPapers = processPapers(data);
    updateStats(allPapers);
    filterAndRender();

    loading.classList.add('hidden');
  } catch (err) {
    console.error('Fetch error:', err);
    loading.classList.add('hidden');
    error.classList.remove('hidden');
    document.getElementById('error-message').textContent = err.message;
  } finally {
    refreshBtn.classList.remove('spinning');
  }
}

// ===== Event Listeners =====
function setupEventListeners() {
  // Refresh
  document.getElementById('refresh-btn').addEventListener('click', fetchPapers);
  document.getElementById('retry-btn').addEventListener('click', fetchPapers);

  // Filters
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      filterAndRender();
    });
  });

  // Search
  const searchInput = document.getElementById('search-input');
  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = searchInput.value;
      filterAndRender();
    }, 300);
  });
}

// ===== Initialize =====
function init() {
  setupEventListeners();
  updateClock();
  setInterval(updateClock, 1000);
  fetchPapers();
}

document.addEventListener('DOMContentLoaded', init);
