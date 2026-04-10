# Lendsqr Frontend Engineering Assessment

## 📌 Overview

This project is an implementation of the Lendsqr frontend engineering assessment using React, TypeScript, and SCSS.

The application replicates the provided Figma design while ensuring responsiveness, clean architecture, and reliable interaction behavior across core user flows.

---

## ⚙️ Tech Stack

- React
- TypeScript
- SCSS
- React Router
- React Testing Library + Vitest

---

## 🎨 Design Notes

- The implementation aims for high visual fidelity with the provided Figma design
- Minor adjustments were made where necessary to ensure responsiveness across screen sizes

---

## 📂 Project Structure

The project is organized for clarity and scalability:

- `components/` – reusable UI components
- `pages/` – route-level pages
- `services/` – API and data handling
- `hooks/` – reusable logic
- `styles/` – global and SCSS modules
- `types/` – TypeScript type definitions and interfaces for shared data structures
- `context/` – React context providers for global state management (e.g., auth, theme)
- `layouts/` – Shared layout components (e.g., dashboard shell, page wrappers)
- `assets/` – Static files such as images, fonts, and SVGs
- `routes/` – Route configuration and wrappers (e.g., protected/public routes)

---

## Progress Log

### 2026-04-10

- Initialized project with Vite (React + TypeScript) as `lendsqr-fe-test`
- Installed dependencies: React Router, Vitest, Testing Library, JSDOM, Sass
- Set up routing structure using React Router
- Configured SCSS with Vite to inject variables globally for DRY styles
- Created responsive Login page with floating labels and error handling
- Ensured error messages are clear and do not shift layout
- All code and styles follow the Figma design and assessment requirements

---

**Decisions & Rationale:**

- Used Vite for fast development and TypeScript for type safety.
- Global SCSS variables via Vite config to avoid repetitive imports.
- Error handling and layout stability for best UX and pixel-perfect fidelity.

**🧠 UX & Interaction Considerations:**

While implementing the design, I paid attention to how users interact with the system beyond static visuals.

Some considerations include:

- Clear loading and error states to prevent users from being stuck
- Disabled states for actions during async operations
- Predictable navigation and feedback during user flows

These decisions ensure the interface behaves reliably under real-world usage, not just ideal conditions.

---

## 🔧 Setup & Installation

```bash
git clone https://github.com/<your-username>/lendsqr-fe-test
cd lendsqr-fe-test
npm install
npm run dev
```
