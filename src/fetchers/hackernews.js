/**
 * Hacker News Fetcher — Uses Algolia Search API (CORS-friendly).
 * Focused on AI, LLM, GenAI, Deep Learning topics.
 */
import { detectTopic, formatTimeAgo } from '../arabic.js';

const HN_SEARCH = 'https://hn.algolia.com/api/v1/search';
const AI_QUERIES = [
  'LLM', 'GPT', 'AI', 'deep learning', 'machine learning',
  'generative AI', 'transformer', 'diffusion', 'neural network',
  'OpenAI', 'Claude', 'Gemini', 'Llama', 'Mistral',
];

export async function fetchItems(/* args */) {
  // Fetch multiple AI queries in parallel for broader coverage
  const queries = ['LLM OR GPT OR "language model"', 'AI OR "artificial intelligence" OR "deep learning"', '"generative AI" OR transformer OR diffusion'];
  const results = await Promise.allSettled(
    queries.map(q =>
      fetch(`${HN_SEARCH}?query=${encodeURIComponent(q)}&tags=story&hitsPerPage=20&numericFilters=created_at_i>${Math.floor(Date.now() / 1000) - 72 * 3600}`)
        .then(r => r.json())
    )
  );

  // Merge and deduplicate
  const seen = new Set();
  const allHits = [];
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value.hits) {
      for (const hit of r.value.hits) {
        if (!seen.has(hit.objectID)) {
          seen.add(hit.objectID);
          allHits.push(hit);
        }
      }
    }
  }

  const now = new Date();
  const _24h = new Date(now - 24 * 3600000);

  const items = allHits.map(hit => {
    const publishedAt = new Date(hit.created_at_i * 1000).toISOString();
    const isWithin24h = new Date(publishedAt) >= _24h;
    const topic = detectTopic(hit.title + ' ' + (hit.story_text || ''));
    const topicAr = topic || 'ذكاء اصطناعي';
    const points = hit.points || 0;
    const comments = hit.num_comments || 0;

    // Score
    let score = points * 3 + comments * 2;
    if (isWithin24h) score += 10;
    if (points >= 100) score += 20;

    // Arabic headline
    let arabicHeadline;
    if (points >= 200) arabicHeadline = `🔥 مقال رائج عن ${topicAr} يحظى باهتمام كبير على Hacker News`;
    else if (points >= 50) arabicHeadline = `⭐ نقاش مهم حول ${topicAr} على Hacker News`;
    else arabicHeadline = `📰 مقال جديد عن ${topicAr} على Hacker News`;

    return {
      id: hit.objectID,
      title: hit.title,
      link: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
      source: 'Hacker News',
      publishedAt,
      isWithin24h,
      arabicHeadline,
      arabicSummary: hit.story_text
        ? hit.story_text.replace(/<[^>]*>/g, '').slice(0, 300)
        : `مقال على Hacker News حول ${topicAr} — ${points} نقطة و ${comments} تعليق`,
      metadata: {
        upvotes: points,
        comments,
        hnLink: `https://news.ycombinator.com/item?id=${hit.objectID}`,
        author: hit.author || '',
        keywords: hit._tags?.filter(t => t !== 'story') || [],
      },
      badges: [
        ...(points >= 100 ? [{ text: 'رائج', type: 'hot' }] : []),
        ...(comments >= 50 ? [{ text: `${comments} تعليق`, type: 'comments' }] : []),
        ...(!isWithin24h ? [{ text: 'أقدم من ٢٤ ساعة', type: 'old' }] : []),
      ],
      score,
    };
  });

  items.sort((a, b) => b.score - a.score);
  return items;
}
