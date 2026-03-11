/**
 * Theme Toggle — Light/Dark mode with localStorage persistence.
 */

const STORAGE_KEY = 'dashboard-theme';

export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'dark'); // default dark
  applyTheme(theme);

  const btn = document.getElementById('theme-toggle');
  if (btn) {
    btn.addEventListener('click', toggleTheme);
  }
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem(STORAGE_KEY, next);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);

  const sunIcon = document.getElementById('theme-sun');
  const moonIcon = document.getElementById('theme-moon');
  const toggleTrack = document.getElementById('theme-toggle');

  if (sunIcon && moonIcon && toggleTrack) {
    if (theme === 'light') {
      sunIcon.classList.add('active');
      moonIcon.classList.remove('active');
      toggleTrack.classList.add('light');
      toggleTrack.classList.remove('dark');
    } else {
      moonIcon.classList.add('active');
      sunIcon.classList.remove('active');
      toggleTrack.classList.remove('light');
      toggleTrack.classList.add('dark');
    }
  }
}
