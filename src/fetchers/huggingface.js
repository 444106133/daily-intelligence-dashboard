/**
 * HuggingFace Daily Papers Fetcher
 * Now uses smart Arabic translation for paper titles.
 */
import { detectTopic, getHoursAgo, formatTimeAgo, truncateSummary, translateHeadline, generateArabicSummary } from '../arabic.js';

const MAJOR_ORGS = new Set([
  'nvidia', 'google', 'metaresearch', 'meta', 'microsoft', 'microsoftresearch',
  'openai', 'deepmind', 'amazon', 'apple', 'adobe', 'anthropic',
  'tsinghua', 'stanford', 'mit', 'berkeley', 'cmu',
]);

function scorePaper(p) {
  let score = (p.upvotes || 0) * 5 + (p.githubStars || 0) * 2 + (p.numComments || 0) * 3;
  const orgName = (p.organization?.name || '').toLowerCase();
  if (MAJOR_ORGS.has(orgName)) score += 15;
  if (p.githubRepo) score += 8;
  if (p.projectPage) score += 3;
  const h = getHoursAgo(p.submittedAt);
  if (h < 12) score += 10; else if (h < 24) score += 5;
  return score;
}

export async function fetchItems(/* args */) {
  const res = await fetch('/api/daily_papers');
  if (!res.ok) throw new Error(`HuggingFace API: HTTP ${res.status}`);
  const raw = await res.json();

  const now = new Date();
  const _24h = new Date(now - 24 * 3600000);
  const _72h = new Date(now - 72 * 3600000);

  const items = raw.map(item => {
    const p = item.paper || item;
    const submittedAt = p.submittedOnDailyAt || p.publishedAt || '';
    const date = new Date(submittedAt);
    const isWithin24h = date >= _24h;
    const org = p.organization || item.organization || null;
    const topic = detectTopic(p.title + ' ' + (p.ai_summary || p.summary || ''));

    const card = {
      id: p.id,
      title: p.title,
      link: `https://huggingface.co/papers/${p.id}`,
      source: 'HuggingFace',
      publishedAt: submittedAt,
      isWithin24h,
      arabicHeadline: '',
      arabicSummary: generateArabicSummary(p.title, p.ai_summary || p.summary, org?.fullname || org?.name || 'HuggingFace'),
      metadata: {
        upvotes: p.upvotes || 0,
        stars: p.githubStars || 0,
        comments: item.numComments || 0,
        organization: org?.fullname || org?.name || '',
        keywords: p.ai_keywords || [],
        hasCode: !!p.githubRepo,
      },
      badges: [],
      score: 0,
    };

    // --- Smart Arabic Headline ---
    const orgLabel = card.metadata.organization;
    const upvotes = card.metadata.upvotes;

    // Pick icon based on engagement
    let icon;
    if (upvotes >= 20) icon = '🔥';
    else if (upvotes >= 10) icon = '⭐';
    else if (card.metadata.hasCode) icon = '🔬';
    else icon = '📄';

    // Translate the actual paper title
    const translatedTitle = translateHeadline(p.title);

    // Build rich headline with org + engagement context
    let headlineParts = [icon, translatedTitle];
    if (orgLabel) headlineParts.push(`— ${orgLabel}`);
    if (upvotes >= 10) headlineParts.push(`(${upvotes} تصويت)`);

    card.arabicHeadline = headlineParts.join(' ');

    // Badges
    if (org) card.badges.push({ text: orgLabel, type: 'org' });
    if (!isWithin24h) card.badges.push({ text: 'أقدم من ٢٤ ساعة', type: 'old' });
    if (card.metadata.hasCode) card.badges.push({ text: 'كود مفتوح', type: 'code' });
    if (card.metadata.upvotes >= 10) card.badges.push({ text: 'رائج', type: 'hot' });

    card.score = scorePaper({ ...p, ...card.metadata, submittedAt, numComments: card.metadata.comments });
    return card;
  }).filter(c => new Date(c.publishedAt) >= _72h);

  items.sort((a, b) => b.score - a.score);
  return items;
}
