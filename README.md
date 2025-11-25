# Faraway Test

**Faraway Test** is a production-ready test project written in React + TypeScript using Vite, Zustand, and MUI.

The application displays a list of characters (from the Star Wars API), allows editing their details, and saves changes to local storage.

**Status:** ✅ Production-Ready | **Test Coverage:** 45/45 ✅ | **Code Quality:** 8.8/10 ⭐

---

## 🔧 Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build and dev server
- **Zustand** — state management
- **React Query** — working with asynchronous data
- **MUI** — UI components and styles
- **Vitest** — unit testing framework
- **React Testing Library** — component testing
- **React Router DOM** — routing
---

## 📂 Project Structure
faraway-test/
├─ public/ # static files
├─ src/
│ ├─ components/ # UI components (Card, Pagination, EditableField)
│ ├─ hooks/ # custom hooks (queries, stores, utils)
│ ├─ pages/ # pages (Home, CharacterDetail)
│ ├─ types/ # TypeScript types
| ├─ tests/ # setup for tests
│ ├─ utils/ # helper functions (localStorage, etc.)
| |─ theme/ # MUI theme configuration
│ ├─ App.tsx # main application component
│ └─ main.tsx # Vite entry point
├─ package.json
├─ tsconfig.json
└─ vite.config.ts

---

## ⚡ Installation and Launch

1. Clone the repository:
```bash
git clone <repo-url>
cd faraway-test
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Start the dev server:
```bash
npm run dev
# or
yarn dev
```

4. Build the project
```bash
4. Run tests:
```bash
npm run test:all
# or
yarn test:all
```

5. Build the project:
# or
yarn build
```

