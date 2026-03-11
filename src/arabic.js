/**
 * Shared Arabic utilities for all sections.
 */

const RIYADH_TZ = 'Asia/Riyadh';

// Arabic topic map
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
  'wind': 'طاقة الرياح',
  'battery': 'البطاريات',
  'energy storage': 'تخزين الطاقة',
  'machine learning': 'تعلم الآلة',
  'deep learning': 'التعلم العميق',
  'classification': 'التصنيف',
  'clustering': 'التجميع',
  'neural network': 'شبكة عصبية',
};

export function detectTopic(text) {
  const lower = (text || '').toLowerCase();
  for (const [key, val] of Object.entries(TOPIC_MAP)) {
    if (lower.includes(key)) return val;
  }
  return null;
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
