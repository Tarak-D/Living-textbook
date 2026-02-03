# 📘 Living Textbook

A self-improving textbook that evolves based on student misunderstandings.

Students read → submit confusion → AI clusters feedback → generates clarifications → updates the book.

This repository is an experimental prototype of a **Darwinian textbook**.

---

## ✨ Features

- Interactive web textbook (React + Markdown)
- Concept-aware feedback (Derivative / Limit / General)
- Local AI explanation generation (FLAN-T5)
- Automatic insertion of clarifications into textbook
- Learning dashboard
- Colorful modern UI
- Fully local (no API keys required)

---

## 🧠 How It Works

1. Students read the textbook
2. They submit feedback per concept
3. Feedback is saved to `feedback.json`
4. `analysis/cluster.py`:
   - embeds responses
   - clusters misunderstandings
   - generates explanations
   - writes back into `book/intro.md`
5. Website reloads updated content

The textbook literally learns from its readers.

---

## 🚀 Quick Start

### Requirements

- Node.js
- Python 3.9+
- Git

---

### 1. Clone

```bash
git clone https://github.com/Tarak-D/living-textbook.git
cd living-textbook
```

### 2. Frontend + Backend

```bash
cd app
npm install
node server.js
```

### Open new terminal:
```bash
npm run dev
```

Visit:
```bash
http://localhost:5173
```

### 3. Generate Improvements

After collecting feedback:
```bash
cd analysis
pip install sentence-transformers scikit-learn transformers torch
python cluster.py
```

This updates:
`book/intro.md`

Refresh browser to see changes.

---

## 📊 Dashboard

Click Dashboard in the UI to see:

- Feedback counts per concept
- Recent submissions

---

## 🧪 Recommended Workflow

- Collect feedback
- Run python cluster.py
- Review generated text
- Commit changes
- Repeat

---

## ⚠️ Experimental

- This is a research prototype.
- Always review AI-generated content before publishing.

---

## 🌱 Roadmap

- Per-paragraph feedback
- Explanation quality scoring
- GitHub auto PRs
- Charts
- Deployment
- Multi-chapter support
