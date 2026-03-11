/**
 * Card Renderer — Generates HTML for unified card format.
 */
import { formatTimeAgo } from './arabic.js';

const BADGE_CLASSES = {
  org: 'badge-org',
  old: 'badge-old',
  code: 'badge-code',
  hot: 'badge-hot',
  lang: 'badge-lang',
  comments: 'badge-comments',
};

export function renderCard(item, rank) {
  const isTop3 = rank <= 3;

  const badgesHtml = (item.badges || []).map(b =>
    `<span class="badge ${BADGE_CLASSES[b.type] || 'badge-org'}">${b.text}</span>`
  ).join('');

  const keywordsHtml = (item.metadata?.keywords || []).slice(0, 5).map(kw =>
    `<span class="keyword-tag">${kw}</span>`
  ).join('');

  const stats = [];
  if (item.metadata?.upvotes) stats.push(`<span class="stat-item upvotes">▲ ${item.metadata.upvotes}</span>`);
  if (item.metadata?.stars) stats.push(`<span class="stat-item stars">★ ${item.metadata.stars.toLocaleString()}</span>`);
  if (item.metadata?.comments) stats.push(`<span class="stat-item comments">💬 ${item.metadata.comments}</span>`);
  if (item.metadata?.forks) stats.push(`<span class="stat-item">🔀 ${item.metadata.forks}</span>`);
  if (item.metadata?.language) stats.push(`<span class="stat-item lang">${item.metadata.language}</span>`);
  stats.push(`<span class="stat-item">${formatTimeAgo(item.publishedAt)}</span>`);

  return `
    <article class="paper-card" data-score="${item.score}">
      <div class="paper-meta">
        <span class="paper-rank ${isTop3 ? 'top-3' : ''}">${rank}</span>
        <div class="paper-badges">${badgesHtml}</div>
      </div>
      <h3 class="paper-headline-ar">${item.arabicHeadline}</h3>
      <h4 class="paper-title">
        <a href="${item.link}" target="_blank" rel="noopener" dir="ltr">${item.title}</a>
      </h4>
      <p class="paper-summary" id="summary-${item.id}">${item.arabicSummary}</p>
      <button class="expand-btn" data-target="summary-${item.id}">عرض المزيد ↓</button>
      ${keywordsHtml ? `<div class="paper-keywords">${keywordsHtml}</div>` : ''}
      <div class="paper-stats">
        ${stats.join('')}
        <a href="${item.link}" target="_blank" rel="noopener" class="paper-link">
          ${item.source} ↗
        </a>
      </div>
    </article>
  `;
}

export function renderEmpty() {
  return `
    <div class="empty-state">
      <p class="empty-icon">📭</p>
      <p>لا توجد نتائج مطابقة</p>
    </div>
  `;
}

export function renderLoading() {
  return `
    <div class="loading" id="loading">
      <div class="loading-spinner"></div>
      <p>جاري تحميل البيانات...</p>
    </div>
  `;
}

export function renderError(message) {
  return `
    <div class="error-state" id="error-state">
      <div class="error-icon">⚠️</div>
      <h3>حدث خطأ في تحميل البيانات</h3>
      <p>${message}</p>
      <button class="retry-btn" id="retry-btn">إعادة المحاولة</button>
    </div>
  `;
}
