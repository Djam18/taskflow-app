import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CardItem from '../components/Card/CardItem';
import { Card } from '../types';

const mockCard: Card = {
  id: 'card-1',
  title: 'Test card title',
  description: 'A test description',
  priority: 'high',
  labels: ['bug', 'feature'],
  assigneeId: null,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  order: 0,
};

describe('CardItem', () => {
  it('renders card title', () => {
    render(<CardItem card={mockCard} onClick={jest.fn()} />);
    expect(screen.getByText('Test card title')).toBeInTheDocument();
  });

  it('renders priority', () => {
    render(<CardItem card={mockCard} onClick={jest.fn()} />);
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('renders labels', () => {
    render(<CardItem card={mockCard} onClick={jest.fn()} />);
    expect(screen.getByText('bug')).toBeInTheDocument();
    expect(screen.getByText('feature')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<CardItem card={mockCard} onClick={handleClick} />);
    fireEvent.click(screen.getByText('Test card title'));
    expect(handleClick).toHaveBeenCalledWith(mockCard);
  });

  it('does not render labels section when no labels', () => {
    const cardNoLabels = { ...mockCard, labels: [] as Card['labels'] };
    render(<CardItem card={cardNoLabels} onClick={jest.fn()} />);
    expect(screen.queryByText('bug')).not.toBeInTheDocument();
  });
});
