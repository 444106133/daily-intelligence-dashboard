/**
 * Section Registry — Plugin pattern for easy extensibility.
 * To add a new section: just add an object to this array.
 */

export const SECTIONS = [
  {
    id: 'ai-papers',
    name: 'أوراق الذكاء الاصطناعي',
    nameEn: 'AI Papers',
    icon: '📄',
    accent: '#6366f1',
    accentRgb: '99, 102, 241',
    description: 'أبرز الأبحاث اليومية من HuggingFace',
    source: 'HuggingFace',
    fetcherModule: () => import('./fetchers/huggingface.js'),
  },
  {
    id: 'hacker-news',
    name: 'أخبار هاكر نيوز',
    nameEn: 'Hacker News',
    icon: '🔥',
    accent: '#ff6600',
    accentRgb: '255, 102, 0',
    description: 'أبرز مقالات الذكاء الاصطناعي و LLM من Hacker News',
    source: 'Hacker News',
    fetcherModule: () => import('./fetchers/hackernews.js'),
  },
  {
    id: 'smart-grid',
    name: 'أخبار الشبكات الذكية',
    nameEn: 'Smart Grid',
    icon: '🔌',
    accent: '#06b6d4',
    accentRgb: '6, 182, 212',
    description: 'أحدث أخبار وتطورات الشبكات الذكية',
    source: 'Google News',
    fetcherModule: () => import('./fetchers/news.js'),
    fetcherArgs: {
      query: '"smart grid" OR "الشبكة الذكية" OR "grid modernization" OR "smart meter"',
    },
  },
  {
    id: 'ai-news',
    name: 'أخبار الذكاء الاصطناعي',
    nameEn: 'AI News',
    icon: '🤖',
    accent: '#a855f7',
    accentRgb: '168, 85, 247',
    description: 'آخر أخبار الذكاء الاصطناعي والنماذج اللغوية',
    source: 'Google News',
    fetcherModule: () => import('./fetchers/news.js'),
    fetcherArgs: {
      query: '"artificial intelligence" OR "generative AI" OR "LLM" OR "large language model"',
    },
  },
  {
    id: 'github-ml',
    name: 'مشاريع GitHub ML',
    nameEn: 'GitHub ML',
    icon: '🧠',
    accent: '#10b981',
    accentRgb: '16, 185, 129',
    description: 'أحدث مشاريع تعلم الآلة على GitHub',
    source: 'GitHub',
    fetcherModule: () => import('./fetchers/github.js'),
    fetcherArgs: {
      query: 'machine-learning OR supervised-learning OR unsupervised-learning OR classification OR clustering',
      topics: ['machine-learning', 'deep-learning', 'classification', 'clustering'],
    },
  },
  {
    id: 'github-ai',
    name: 'مشاريع GitHub AI',
    nameEn: 'GitHub AI',
    icon: '⚡',
    accent: '#f59e0b',
    accentRgb: '245, 158, 11',
    description: 'أحدث مشاريع الذكاء الاصطناعي الرائجة على GitHub',
    source: 'GitHub',
    fetcherModule: () => import('./fetchers/github.js'),
    fetcherArgs: {
      query: 'LLM OR "large language model" OR "generative AI" OR "text-generation" OR "diffusion"',
      topics: ['llm', 'generative-ai', 'text-generation', 'diffusion-models'],
    },
  },
  {
    id: 'renewable-energy',
    name: 'أخبار الطاقة المتجددة',
    nameEn: 'Renewable Energy',
    icon: '☀️',
    accent: '#22c55e',
    accentRgb: '34, 197, 94',
    description: 'آخر تطورات الطاقة المتجددة والنظيفة',
    source: 'Google News',
    fetcherModule: () => import('./fetchers/news.js'),
    fetcherArgs: {
      query: '"renewable energy" OR "solar power" OR "wind energy" OR "energy storage" OR "clean energy"',
    },
  },
  {
    id: 'kaggle',
    name: 'مشاريع Kaggle',
    nameEn: 'Kaggle',
    icon: '📊',
    accent: '#20beff',
    accentRgb: '32, 190, 255',
    description: 'أحدث مسابقات ومجموعات بيانات Kaggle',
    source: 'Google News',
    fetcherModule: () => import('./fetchers/news.js'),
    fetcherArgs: {
      query: 'kaggle competition OR "kaggle dataset" OR "kaggle notebook" machine learning',
    },
  },
];

/**
 * Get a section by its ID.
 */
export function getSection(id) {
  return SECTIONS.find(s => s.id === id);
}
