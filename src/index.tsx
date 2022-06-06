import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './theme.css';
import App from './App';

// React 18: createRoot replaces ReactDOM.render
// Enables concurrent features: useTransition, useDeferredValue, auto batching
const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
