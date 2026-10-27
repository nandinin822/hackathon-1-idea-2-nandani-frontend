# 🛫 BookMyFlight — Frontend

> **"Same trip. Much less money."**  
> *“El mismo viaje. Mucho menos dinero.”*

A premium travel-hacking web application designed to help travelers compare cash flight costs directly against airline award miles and credit card transfer options, making luxury travel accessible for far less money.

---

## 🌟 Architecture & Foundation (Milestone 1)

This repository hosts the frontend application configured for deployment on **Vercel**, communicating with a **Python + FastAPI** backend hosted on **Render**.

- **Framework:** React 19 + Vite 6
- **Styling:** Vanilla CSS design tokens (custom properties) with no heavy UI framework dependencies
- **Design Palette:**
  - **Warm Ivory** (`#FAF7F2`) — Base canvas and soothing elevated surfaces
  - **Deep Espresso** (`#1D1714`) — Luxury editorial typography and high-contrast accents
  - **Terracotta** (`#C85A32`) — Primary CTAs, actionable energy, and flight accents
  - **Sage** (`#628C6F`) — Award miles badges, verified partner tags, and savings highlights
- **Typography:** Google Fonts — *Playfair Display* (luxury editorial headings) & *Plus Jakarta Sans* (clean modern UI)
- **Localization:** Real-time bilingual support (**English & Spanish**) with built-in dictionary and switcher
- **Data Integrity:** Strict policy for award flight availability—sourced exclusively from approved providers or visibly badged as **DEMO DATA**

---

## 📂 Project Structure

```text
HP-frontend/
├── public/                 # Static assets (favicons, manifest)
├── src/
│   ├── assets/             # Brand logos & icons
│   ├── components/
│   │   ├── common/         # Shared reusable UI primitives
│   │   │   ├── Badge.jsx            # Status & DEMO DATA badges
│   │   │   ├── Button.jsx           # Button variants (primary, secondary, sage, outline, ghost)
│   │   │   └── LanguageSwitcher.jsx # Bilingual ES/EN switcher control
│   │   └── layout/         # Base layout components
│   │       ├── BaseLayout.jsx       # Layout wrapper
│   │       ├── Navbar.jsx           # Sticky responsive header with language switcher
│   │       └── Footer.jsx           # Editorial footer with architecture notes
│   ├── localization/       # Bilingual dictionary & context
│   │   ├── LanguageContext.jsx      # React Context & useLanguage hook
│   │   └── translations.js          # Full English and Spanish strings
│   ├── pages/              # Views and routes
│   │   └── FoundationShowcase.jsx   # Interactive design system & architecture showcase
│   ├── services/           # Backend API integration
│   │   └── api.js                   # API client reading VITE_API_URL
│   ├── styles/             # Global CSS design tokens
│   │   ├── index.css                # Global utility classes & containers
│   │   ├── reset.css                # Accessible CSS reset
│   │   └── variables.css            # Design system tokens (colors, fonts, shadows)
│   ├── App.jsx             # Main application component
│   └── main.jsx            # React root entry point
├── .env.example            # Environment variables template
├── .gitignore              # Excludes secrets, node_modules, and dist
├── vercel.json             # Vercel SPA routing rewrites
├── vite.config.js          # Vite build configuration
└── package.json            # Project dependencies & scripts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v20.x or higher
- **npm** v10.x or higher

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/nandinigayakwad02/HP-frontend.git
cd HP-frontend
npm install
```

### 3. Environment Configuration
Copy `.env.example` to create your local `.env`:
```bash
cp .env.example .env
```

Ensure `VITE_API_URL` points to your backend instance:
```env
# Local FastAPI backend:
VITE_API_URL=http://localhost:8000

# Production Render backend (configured in Vercel):
# VITE_API_URL=https://hp-backend.onrender.com
```
> **Security Reminder:** Never commit actual API keys or secrets in the frontend repository. All third-party secrets (Amadeus, award search engines) reside securely on the FastAPI backend.

### 4. Running the Development Server
Start Vite with hot module replacement (HMR):
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Production Build
Validate and compile the production bundle:
```bash
npm run build
```
To preview the built production bundle locally:
```bash
npm run preview
```

---

## 🌐 Deployment to Vercel

1. Connect your GitHub repository (`nandinigayakwad02/HP-frontend`) to [Vercel](https://vercel.com).
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Environment Variables:
   - Add `VITE_API_URL` with your Render backend URL.
6. The included `vercel.json` ensures all route paths redirect seamlessly to `index.html` for single-page routing.

---

## 🛡️ License
Private project — © A Una Milla de Tu Destino. All rights reserved.
