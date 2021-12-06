# TaskFlow

A full-featured Kanban board application built with React, TypeScript, and Firebase. Real-time collaborative boards, drag-and-drop, dark mode, PWA support, and analytics.

## Features

- **Kanban boards** — Create boards, columns, and cards with drag-and-drop reordering
- **Real-time sync** — Live collaboration via Firestore `onSnapshot`
- **Firebase Auth** — Email/password + Google sign-in
- **Multi-user** — Invite team members to boards
- **Card details** — Rich card modal with description, comments, labels, priority
- **Dark mode** — Persisted theme preference via `ThemeContext`
- **PWA** — Offline support with service worker, install-to-homescreen prompt
- **Analytics** — Charts dashboard (Recharts): cards per column, priority distribution, activity
- **Export** — CSV and PDF export for any board
- **Performance** — `react-window` virtualization for 500+ cards, `React.lazy` code splitting

## Tech Stack

| Layer | Library |
|-------|---------|
| UI framework | React 17 + TypeScript |
| Drag and drop | react-beautiful-dnd 13 |
| Backend | Firebase 8 (Auth + Firestore) |
| Charting | Recharts 2 |
| Virtualization | react-window |
| Testing | React Testing Library 12, Jest |
| Bundler | Create React App 5 |

## Getting Started

### Prerequisites

- Node.js 14+
- A Firebase project (free tier works)

### Setup

```bash
# Install dependencies
npm install

# Configure Firebase
cp .env.example .env
# Edit .env with your Firebase project values
```

### Environment Variables

```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

### Running

```bash
# Development server
npm start

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Production build
npm run build
```

## Project Structure

```
src/
  __tests__/          Unit and integration tests
  components/
    Analytics/        Recharts dashboard
    Auth/             Login / Register pages
    Board/            Board component, InviteModal, ExportMenu
    Card/             CardItem component
    CardDetail/       Card detail modal (description, comments, labels)
    Column/           Column component, VirtualizedCardList
  context/
    AuthContext.tsx   Firebase auth state
    ThemeContext.tsx  Dark/light theme
  firebase/
    config.ts         Firebase v8 initialization
  hooks/
    useBoards.ts      Firestore CRUD hooks
    usePermissions.ts Role-based permission helpers
    useRealtimeBoard.ts Real-time board hook with onSnapshot
  pages/
    BoardListPage.tsx Board list and creation
  types/
    index.ts          TypeScript interfaces (Board, Column, Card, User)
  utils/
    exportBoard.ts    CSV and PDF export logic
```

## Architecture Notes

- **Firebase v8 compat API** — uses `firebase/app`, `firebase/auth`, `firebase/firestore` imports
- **Immutable state updates** — all state changes use spread operators, never mutation
- **ThemeContext** — dark mode state stored in `localStorage`, applied via CSS custom properties
- **Permissions** — `getBoardRole()` determines owner/member/none, gates all write operations
- **Drag-and-drop** — `DragDropContext` wraps the entire board; both column and card reordering supported

## Testing

```bash
npm test
```

Tests use React Testing Library. Coverage target: 75%+.

Key test files:
- `CardItem.test.tsx` — card rendering and interaction
- `ColumnComponent.test.tsx` — column with DnD context
- `ThemeContext.test.tsx` — theme toggle and persistence
- `usePermissions.test.ts` — role-based access logic
- `exportBoard.test.ts` — CSV download behavior

## Roadmap

- [ ] Zustand for client state (planned for v2)
- [ ] React 18 concurrent features
- [ ] Migrate to Firebase v9 modular API
- [ ] Card due dates and assignments
- [ ] Activity feed per board

## License

MIT
