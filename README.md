# 💰 Expense & Budget Visualizer

A mobile-friendly web app to track daily spending, visualize expenses by category, and manage your budget — all stored locally in your browser.

🌐 **Live Demo:** [https://whyzenn07.github.io/CodingCamp-30Mar26-WahyuArgoMulyo](https://whyzenn07.github.io/CodingCamp-30Mar26-WahyuArgoMulyo)

---

## ✨ Features

### Core (MVP)
- **Input Form** — Add transactions with item name, amount, and category
- **Form Validation** — All fields are required before submitting
- **Transaction List** — Scrollable list showing name, amount, and category
- **Delete Transactions** — Remove any item from the list
- **Total Balance** — Auto-updates whenever items are added or deleted
- **Pie Chart** — Visual spending breakdown by category using Chart.js

### Optional Challenges (4/5)
- ✅ **Custom Categories** — Add your own spending categories
- ✅ **Sort Transactions** — Sort by date, amount (asc/desc), or category
- ✅ **Spending Limit Highlight** — Set a limit per transaction; items over limit are flagged with a warning badge
- ✅ **Dark / Light Mode** — Toggle between themes, preference saved to localStorage

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 (custom properties, flexbox) |
| Logic | Vanilla JavaScript (ES6+) |
| Chart | [Chart.js](https://www.chartjs.org/) via CDN |
| Storage | Browser LocalStorage API |
| Deploy | GitHub Pages via GitHub Actions |

---

## 📁 Project Structure

```
CodingCamp-30Mar26-WahyuArgoMulyo/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styles (single file)
├── js/
│   └── app.js          # All logic (single file)
├── .github/
│   └── workflows/
│       └── deploy.yml  # Auto-deploy to GitHub Pages
└── README.md
```

---

## 🚀 Running Locally

No build tools needed. Just open the file directly:

```bash
# Clone the repo
git clone https://github.com/Whyzenn07/CodingCamp-30Mar26-WahyuArgoMulyo.git

# Open in browser
open index.html
```

Or use the [Live Demo](https://whyzenn07.github.io/CodingCamp-30Mar26-WahyuArgoMulyo) directly.

---

## 📦 Deployment

This project auto-deploys to **GitHub Pages** on every push to the `main` branch via GitHub Actions.

To set it up on your own fork:
1. Go to **Settings → Pages**
2. Set Source to **GitHub Actions**
3. Push to `main` — the workflow handles the rest

---

## 👤 Author

**Wahyu Argo Mulyo**
- GitHub: [@Whyzenn07](https://github.com/Whyzenn07)
- Batch: CodingCamp 30 March 2026

---

*Built as part of the SEFC Coding Camp 5-day course.*
