# 🧠 Daily Intelligence Dashboard

لوحة الاستخبارات اليومية — An Arabic RTL web dashboard that tracks the most impactful AI research papers from HuggingFace Daily Papers.

## Features

- 📊 **Real-time data** from HuggingFace Daily Papers API
- 🏆 **Smart ranking** — composite score from upvotes, GitHub stars, comments, org prestige
- 🇸🇦 **Arabic summaries** with auto-generated headlines
- 🎨 **Premium dark theme** with glassmorphism, micro-animations, gradient text
- 🔍 **Search & filter** — by recency, trending, open-source code
- ⏰ **Riyadh timezone** (Asia/Riyadh, UTC+03:00)
- 📱 **Responsive** — works on desktop, tablet, and mobile

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Tech Stack

- **Vite** — Fast dev server with API proxy
- **Vanilla JS** — No framework dependencies
- **CSS** — Custom properties, glassmorphism, animations
- **HuggingFace API** — Daily Papers endpoint
