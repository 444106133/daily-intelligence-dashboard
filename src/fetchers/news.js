/**
 * Google News RSS Fetcher — Used for Smart Grid, AI News, Renewable Energy, Kaggle.
 * Fetches through Vite proxy in dev, Vercel serverless in production.
 * Now uses smart Arabic translation for headlines.
 */
import { detectTopic, translateHeadline, generateArabicSummary } from '../arabic.js';

export async function fetchItems(args = {}) {
  const query = args.query || 'artificial intelligence';
  const url = `/api/news?q=${encodeURIComponent(query)}&hl=en&gl=US&ceid=US:en`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`News RSS: HTTP ${res.status}`);

  const text = await res.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/xml');
  const xmlItems = doc.querySelectorAll('item');

  const now = new Date();
  const _24h = new Date(now - 24 * 3600000);
  const _72h = new Date(now - 72 * 3600000);

  const items = Array.from(xmlItems).map((el, idx) => {
    const rawTitle = el.querySelector('title')?.textContent || '';
    // Google News titles often end with " - Source Name"
    const parts = rawTitle.split(' - ');
    const sourceName = parts.length > 1 ? parts.pop().trim() : 'News';
    const title = parts.join(' - ').trim();

    const link = el.querySelector('link')?.textContent || '';
    const pubDate = el.querySelector('pubDate')?.textContent || '';
    const description = el.querySelector('description')?.textContent?.replace(/<[^>]*>/g, '') || '';
    const xmlSource = el.querySelector('source')?.textContent || sourceName;

    const publishedAt = new Date(pubDate).toISOString();
    const isWithin24h = new Date(publishedAt) >= _24h;

    // Score — simple recency + position-based
    let score = 100 - idx; // higher rank = higher score
    if (isWithin24h) score += 20;

    // --- Smart Arabic Translation ---
    // Icon based on rank
    const icon = idx < 3 ? '🔥' : idx < 8 ? '📰' : '📄';

    // Translate headline using actual title content
    const translatedHeadline = translateHeadline(title);
    const arabicHeadline = `${icon} ${translatedHeadline}`;

    // Generate rich Arabic summary
    const arabicSummary = generateArabicSummary(title, description, xmlSource);

    return {
      id: `news-${Date.now()}-${idx}`,
      title,
      link,
      source: xmlSource,
      publishedAt,
      isWithin24h,
      arabicHeadline,
      arabicSummary,
      metadata: {
        sourceName: xmlSource,
        keywords: [],
      },
      badges: [
        { text: xmlSource, type: 'org' },
        ...(!isWithin24h ? [{ text: 'أقدم من ٢٤ ساعة', type: 'old' }] : []),
      ],
      score,
    };
  }).filter(item => new Date(item.publishedAt) >= _72h);

  items.sort((a, b) => b.score - a.score);
  return items;
}
