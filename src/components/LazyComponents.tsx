import { lazy } from 'react';

// Code splitting with React.lazy
// Each of these is a separate chunk in the build
// They only load when the user actually navigates to them

export const LazyBoardListPage = lazy(() => import('../pages/BoardListPage'));

export const LazyCardDetailModal = lazy(
  () => import('./CardDetail/CardDetailModal')
);

export const LazyInviteModal = lazy(
  () => import('./Board/InviteModal')
);

export const LazyAnalyticsDashboard = lazy(
  () => import('./Analytics/AnalyticsDashboard')
);
