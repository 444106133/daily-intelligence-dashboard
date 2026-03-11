/**
 * Main Orchestrator — Thin controller that wires sections, tabs, theme, and rendering.
 */
import { SECTIONS } from './src/sections.js';
import { initTheme } from './src/theme.js';
import { updateClock } from './src/arabic.js';
import { renderCard, renderEmpty, renderError } from './src/renderer.js';

// ===== State =====
let activeSection = SECTIONS[0];
let allItems = [];
let searchQuery = '';
let currentFilter = 'all';

// ===== Tab Navigation =====
function renderTabs() {
  const nav = document.getElementById('section-tabs');
  if (!nav) return;

  nav.innerHTML = SECTIONS.map(s => `
    <button class="tab-btn ${s.id === activeSection.id ? 'active' : ''}"
            data-section="${s.id}"
            style="--tab-accent: ${s.accent}; --tab-accent-rgb: ${s.accentRgb}">
      <span class="tab-icon">${s.icon}</span>
      <span class="tab-label">${s.name}</span>
    </button>
  `).join('');

  nav.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = SECTIONS.find(s => s.id === btn.dataset.section);
      if (section) switchSection(section);
    });
  });
}

function switchSection(section) {
  activeSection = section;

  // Update accent color
  document.documentElement.style.setProperty('--section-accent', section.accent);
  document.documentElement.style.setProperty('--section-accent-rgb', section.accentRgb);

  // Update header
  const title = document.getElementById('section-title');
  const desc = document.getElementById('section-desc');
  if (title) title.textContent = section.name;
  if (desc) desc.textContent = section.description;

  // Update active tab
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === section.id);
  });

  // Reset filters and search
  currentFilter = 'all';
  searchQuery = '';
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === 'all');
  });

  // Update URL hash
  window.location.hash = section.id;

  // Fetch data
  fetchSectionData(section);
}

// ===== Data Fetching =====
async function fetchSectionData(section) {
  const grid = document.getElementById('papers-grid');
  const statsBar = document.getElementById('stats-bar');

  // Show loading
  grid.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
      <p>جاري تحميل ${section.name}...</p>
    </div>
  `;

  try {
    const module = await section.fetcherModule();
    allItems = await module.fetchItems(section.fetcherArgs || {});

    updateStats(allItems);
    filterAndRender();
  } catch (err) {
    console.error(`Error fetching ${section.id}:`, err);
    grid.innerHTML = renderError(err.message);
    const retryBtn = document.getElementById('retry-btn');
    if (retryBtn) retryBtn.addEventListener('click', () => fetchSectionData(section));
  }
}

// ===== Stats =====
function updateStats(items) {
  const total = items.length;
  const within24h = items.filter(i => i.isWithin24h).length;
  const topScore = items.reduce((max, i) => Math.max(max, i.metadata?.upvotes || i.metadata?.stars || 0), 0);
  const sources = new Set(items.map(i => i.metadata?.organization || i.metadata?.sourceName || i.source).filter(Boolean));

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-24h').textContent = within24h;
  document.getElementById('stat-top').textContent = topScore;
  document.getElementById('stat-sources').textContent = sources.size;
}

// ===== Filter & Render =====
function filterAndRender() {
  let filtered = [...allItems];

  // Apply filter
  switch (currentFilter) {
    case '24h':
      filtered = filtered.filter(i => i.isWithin24h);
      break;
    case 'trending':
      filtered = filtered.filter(i => (i.metadata?.upvotes || 0) >= 5 || (i.metadata?.stars || 0) >= 5 || i.score >= 50);
      break;
    case 'code':
      filtered = filtered.filter(i => i.metadata?.hasCode);
      break;
  }

  // Apply search
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(i =>
      (i.title || '').toLowerCase().includes(q) ||
      (i.arabicHeadline || '').includes(q) ||
      (i.arabicSummary || '').toLowerCase().includes(q) ||
      (i.metadata?.keywords || []).some(k => k.toLowerCase().includes(q)) ||
      (i.metadata?.organization || '').toLowerCase().includes(q) ||
      (i.source || '').toLowerCase().includes(q)
    );
  }

  const grid = document.getElementById('papers-grid');
  if (filtered.length === 0) {
    grid.innerHTML = renderEmpty();
  } else {
    grid.innerHTML = filtered.map((item, i) => renderCard(item, i + 1)).join('');
  }
}

// ===== Event Listeners =====
function setupEventListeners() {
  // Refresh
  document.getElementById('refresh-btn')?.addEventListener('click', () => fetchSectionData(activeSection));

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
  searchInput?.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = searchInput.value;
      filterAndRender();
    }, 300);
  });

  // Expand/collapse summaries (delegated)
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('expand-btn')) {
      const targetId = e.target.dataset.target;
      const summaryEl = document.getElementById(targetId);
      if (summaryEl) {
        summaryEl.classList.toggle('expanded');
        e.target.textContent = summaryEl.classList.contains('expanded') ? 'عرض أقل ↑' : 'عرض المزيد ↓';
      }
    }
  });

  // Handle hash-based routing
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.slice(1);
    const section = SECTIONS.find(s => s.id === hash);
    if (section && section.id !== activeSection.id) switchSection(section);
  });
}

// ===== Initialize =====
function init() {
  // Check URL hash for initial section
  const hash = window.location.hash.slice(1);
  const initialSection = SECTIONS.find(s => s.id === hash) || SECTIONS[0];
  activeSection = initialSection;

  initTheme();
  renderTabs();
  setupEventListeners();

  // Set initial accent
  document.documentElement.style.setProperty('--section-accent', activeSection.accent);
  document.documentElement.style.setProperty('--section-accent-rgb', activeSection.accentRgb);

  // Clock
  updateClock();
  setInterval(updateClock, 1000);

  // Fetch initial data
  fetchSectionData(activeSection);
}

document.addEventListener('DOMContentLoaded', init);
