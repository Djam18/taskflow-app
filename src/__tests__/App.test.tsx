import React from 'react';
import { render, screen } from '@testing-library/react';

// Mock Firebase to avoid real network calls in tests
jest.mock('../firebase/config', () => ({
  auth: {
    onAuthStateChanged: jest.fn(cb => {
      cb(null);
      return jest.fn();
    }),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
  },
  db: {
    collection: jest.fn(() => ({
      where: jest.fn(() => ({
        orderBy: jest.fn(() => ({
          onSnapshot: jest.fn(() => jest.fn()),
        })),
      })),
    })),
  },
  googleProvider: {},
  default: {
    auth: {
      GoogleAuthProvider: jest.fn(),
    },
  },
}));

import App from '../App';

describe('App', () => {
  it('renders login page when not authenticated', async () => {
    render(<App />);
    // When not authenticated, LoginPage should be shown
    expect(await screen.findByText('TaskFlow')).toBeInTheDocument();
    expect(await screen.findByText(/Sign in/i)).toBeInTheDocument();
  });
});
