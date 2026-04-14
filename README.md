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
- `hooks/` – reusable logic
- `styles/` – global and SCSS modules
- `layouts/` – Shared layout components (e.g., dashboard shell, page wrappers)
- `assets/` – Static files such as images, fonts, and SVGs
- `routes/` – Route configuration and wrappers (e.g., protected/public routes)
- `tests/` – unit and integration tests for key user flows

---

## ✅ Testing

Unit and interaction tests are configured with **Vitest + React Testing Library + JSDOM**.

Run tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test -- --watch
```

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

### 2026-04-12

- Built reusable `DashboardLayout` shell (header, side nav, content area)
- Implemented responsive behavior for top nav and side nav
- Added hamburger-triggered off-canvas side nav + backdrop for tablet/mobile
- Added desktop/mobile logo swap by breakpoint
- Tuned top-nav spacing across breakpoints to preserve visual fidelity
- Added priority-collapse behavior around 900px (hide Docs link first, preserve core controls)
- Added outside-click and keyboard-close behavior for user menu
- Added `Ctrl/Cmd + K` shortcut to focus the search input

**Decisions & Rationale:**

- Kept desktop spacing faithful to Figma and adapted values per breakpoint instead of one fixed margin, to maintain layout integrity across widths.
- Converted side nav to a drawer below desktop to prevent content squeeze and preserve readability.
- Used progressive disclosure for top-nav items (non-critical actions collapse earlier) to avoid overlap at medium widths.
- ReactNode for layout children: layout accepts any renderable child content (elements, strings, fragments, etc.).
- Link vs a: internal navigation uses Link to avoid full page reload and preserve SPA state; use a only for external URLs.

**🧠 UX & Interaction Considerations:**

While implementing the dashboard, I considered expected interaction behavior in addition to static design fidelity.

Some considerations include:

- User menu close behavior: outside click, `Escape`, and `Tab`
- `Ctrl/Cmd + K` quick-focus for search
- Backdrop click to dismiss mobile side nav
- Auto-close side nav when a nav link is selected (mobile/tablet usability)

These decisions ensure the dashboard remains visually accurate, responsive, and usable across desktop, tablet, and mobile viewports.

**✅ Testing**

Current covered tests in `tests/dashboardlayout.test.tsx` include:

- Dashboard layout renders child content
- `Ctrl/Cmd + K` focuses dashboard search input
- Hamburger toggles side nav open/closed
- Backdrop click closes mobile side nav
- User menu opens and closes via outside click and `Escape`

### 2026-04-13

- Built the **Users page** layout with dashboard metric cards.
- Integrated the **UsersTable** component into the Users page.
- Implemented data loading from `public/mock/users.json` via `fetch("/mock/users.json")`.
- Added table state handling:
  - loading state (`Loading users...`)
  - error state (`Could not load users`)
- Implemented table features:
  - client-side pagination
  - page size selector (`10 / 20 / 50 / 100`)
  - page number truncation with ellipsis controls
  - previous/next navigation
- Added row action menu (via portal for performance) with:
  - View Details
  - Blacklist User
  - Activate User
- Added/verified accessibility hooks:
  - `aria-label`, `aria-expanded`, `aria-haspopup`
  - useful `data-testid` values for testing

**Decisions & Rationale:**

- React portal for performance optimization as table data scales
- Conditional injecting of ephemeral menus in DOM vs display toggle

**🧠 UX & Interaction Considerations:**

Some considerations include:

- Menu close behavior: outside click, `Escape`, and `Tab`
- Ellipsis in pagination for multi-step navigation
- 'Users not found' error state and retry for faster recovery time

**✅ Testing**

Current covered tests in `tests/userstable.test.tsx` include:

- renders rows from API and shows total count
- displays error state when fetch fails
- pagination works on “Next page”
- page-size dropdown closes on Escape and outside click
- row menu closes on Escape and outside click

### 2026-04-14

- Built the **User Details** data flow to resolve user record by route param (`/dashboard/users/:id`) instead of only relying on transient storage.
- Added robust user detail states:
  - loading state (`Loading user details...`)
  - not-found state (`User not found`)
  - fallback to cached selected user (only when id matches)
- Kept localStorage as cache (`selectedUserData`) while making route id the source of truth for deep links and refreshes.
- Wired login to set auth state and navigate into the protected app.
- Wired logout from dashboard controls to clear auth state and redirect to login.

**Decisions & Rationale:**

- User details now prefer URL-driven lookup so reviewers can open `/dashboard/users/:id` directly and still get consistent data.
- Local storage remains useful for faster transitions and resilience, but no longer controls identity resolution.
- Auth flow now reflects realistic route-guard behavior expected in the assessment.

**✅ Testing**

Added app-level flow coverage in `tests/app-flow.test.tsx`:

- logs in and navigates into the protected dashboard
- redirects unauthenticated users away from protected routes
- loads the correct user details from the route id
- logs out and redirects to login

---

## 🔧 Setup & Installation

```bash
git clone https://github.com/Scriptkidd98/lendsqr-fe-test
cd lendsqr-fe-test
npm install
npm run dev
```

## ▲ Vercel Setup

This project includes `vercel.json` for Vercel deployment with:

- Vite build/output configuration (`npm run build` -> `dist`)
- SPA rewrite to `index.html` for client-side routes (e.g. `/dashboard/users/:id`)

## 📎 Submission Links

- Live App: `https://isaac-akinduyile-lendsqr-fe-test.vercel.app/`
- Source Code Repo: `https://github.com/Scriptkidd98/lendsqr-fe-test`
- Google Docs: `https://docs.google.com/document/d/1WD2r1u3a4W2dZv-f_ZBrnOU-SEPsiKaG_TJw9v6hRYI/edit?usp=sharing`
- Loom Video: `https://www.loom.com/share/8f887293a7e3462fb363f69124ec9711`

## ✅ Final Submission Checklist

- App is deployed publicly and accessible without login restrictions
- Route behavior verified manually (`/login`, `/dashboard/users`, `/dashboard/users/:id`)
- Tests pass locally (`npm run test -- --run`)
- README includes setup, testing, architecture notes, and submission links
- Repo is public and commit history/messages are clear
- Public review document is complete and includes reasoning/tradeoffs
- Loom video is recorded and link is publicly accessible
- All links submitted via the assessment Google Form
- Submission notification email sent to `careers@lendsqr.com`
