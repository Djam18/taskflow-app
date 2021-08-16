import React from 'react';
import { render, screen } from '@testing-library/react';
import SyncIndicator from '../components/SyncIndicator';

describe('SyncIndicator', () => {
  it('shows Saving... when syncing', () => {
    render(<SyncIndicator syncing={true} />);
    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });

  it('shows Saved when not syncing', () => {
    render(<SyncIndicator syncing={false} />);
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('applies syncing class when syncing', () => {
    const { container } = render(<SyncIndicator syncing={true} />);
    expect(container.firstChild).toHaveClass('syncing');
  });

  it('applies synced class when not syncing', () => {
    const { container } = render(<SyncIndicator syncing={false} />);
    expect(container.firstChild).toHaveClass('synced');
  });
});
