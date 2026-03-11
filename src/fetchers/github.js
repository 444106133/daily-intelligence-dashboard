/**
 * GitHub Repositories Fetcher — Uses GitHub Search API (CORS-friendly).
 */
import { detectTopic } from '../arabic.js';

const GH_API = 'https://api.github.com/search/repositories';

export async function fetchItems(args = {}) {
  const query = args.query || 'machine-learning';
  const now = new Date();
  const daysAgo = new Date(now - 3 * 24 * 3600000); // last 3 days
  const dateStr = daysAgo.toISOString().split('T')[0];
  const _24h = new Date(now - 24 * 3600000);

  const url = `${GH_API}?q=${encodeURIComponent(query)}+pushed:>${dateStr}&sort=stars&order=desc&per_page=30`;
  const res = await fetch(url, {
    headers: { 'Accept': 'application/vnd.github.v3+json' },
  });

  if (!res.ok) {
    if (res.status === 403) throw new Error('GitHub API rate limit exceeded. Try again later.');
    throw new Error(`GitHub API: HTTP ${res.status}`);
  }

  const data = await res.json();
  const repos = data.items || [];

  const items = repos
    .filter(r => !r.fork && r.description && r.description.length > 10)
    .map(repo => {
      const pushDate = new Date(repo.pushed_at);
      const isWithin24h = pushDate >= _24h;
      const topic = detectTopic(repo.full_name + ' ' + (repo.description || '') + ' ' + (repo.topics || []).join(' '));
      const topicAr = topic || 'تعلم الآلة';
      const stars = repo.stargazers_count || 0;

      // Score
      let score = stars * 2 + (repo.forks_count || 0);
      if (isWithin24h) score += 15;
      if (stars >= 100) score += 20;
      if (repo.topics?.length >= 3) score += 5;

      // Arabic headline
      let arabicHeadline;
      if (stars >= 500) arabicHeadline = `🌟 مشروع بارز في ${topicAr} على GitHub — ${stars.toLocaleString()} نجمة`;
      else if (stars >= 50) arabicHeadline = `⭐ مشروع ${topicAr} رائج على GitHub`;
      else arabicHeadline = `🔧 مشروع جديد في ${topicAr} على GitHub`;

      // Determine ML type
      const desc = (repo.description || '').toLowerCase();
      const topicsStr = (repo.topics || []).join(' ').toLowerCase();
      let mlType = '';
      if (desc.includes('classificat') || topicsStr.includes('classification')) mlType = 'تصنيف';
      else if (desc.includes('cluster') || topicsStr.includes('clustering')) mlType = 'تجميع';
      else if (desc.includes('regression') || topicsStr.includes('regression')) mlType = 'انحدار';
      else if (desc.includes('generative') || topicsStr.includes('generative')) mlType = 'توليدي';
      else if (desc.includes('reinforcement') || topicsStr.includes('reinforcement')) mlType = 'تعلم معزز';
      else if (desc.includes('nlp') || topicsStr.includes('nlp')) mlType = 'معالجة لغة طبيعية';

      return {
        id: repo.full_name,
        title: repo.full_name,
        link: repo.html_url,
        source: 'GitHub',
        publishedAt: repo.pushed_at,
        isWithin24h,
        arabicHeadline,
        arabicSummary: repo.description + (mlType ? ` — نوع التعلم: ${mlType}` : ''),
        metadata: {
          stars,
          forks: repo.forks_count || 0,
          language: repo.language || '',
          topics: repo.topics || [],
          hasCode: true,
          mlType,
        },
        badges: [
          ...(repo.language ? [{ text: repo.language, type: 'lang' }] : []),
          ...(stars >= 100 ? [{ text: `${stars.toLocaleString()} ⭐`, type: 'hot' }] : []),
          ...(mlType ? [{ text: mlType, type: 'org' }] : []),
          ...(!isWithin24h ? [{ text: 'أقدم من ٢٤ ساعة', type: 'old' }] : []),
          { text: 'كود مفتوح', type: 'code' },
        ],
        score,
      };
    });

  items.sort((a, b) => b.score - a.score);
  return items;
}
