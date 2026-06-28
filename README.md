# Expense Tracker AI

I'm building this project as part of my **Claude Code course on Coursera**.

## About

A production-ready expense tracking application powered by AI. Built with React, TypeScript, and the Anthropic Claude API for smart expense categorization and spending insights.

## Features

- Add, edit, and delete expenses with full validation
- Search and filter by category, date range, and keywords
- Summary cards: total spending, monthly spending, top category, 30-day trend
- Charts: spending by category (pie), top categories (bar), monthly trend (line)
- AI auto-categorization — describe an expense and Claude picks the right category
- AI spending insights — personalized summary, saving tips, and trend analysis
- Export and import expenses as CSV
- All data persisted locally in the browser

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Zustand** for state management
- **Anthropic Claude API** (`claude-haiku-4-5`) for AI features

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

To enable AI features, click **Setup AI** in the header and enter your [Anthropic API key](https://console.anthropic.com).
