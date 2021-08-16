import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import ColumnComponent from '../components/Column/ColumnComponent';
import { Column, Card } from '../types';

const mockColumn: Column = {
  id: 'col-1',
  title: 'To Do',
  cardIds: ['card-1'],
  order: 0,
};

const mockCards: Card[] = [
  {
    id: 'card-1',
    title: 'Sample card',
    description: '',
    priority: 'medium',
    labels: [],
    assigneeId: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    order: 0,
  },
];

// Wrap with DragDropContext since ColumnComponent uses Draggable
function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <DragDropContext onDragEnd={jest.fn()}>
      <Droppable droppableId="board" type="column" direction="horizontal">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

describe('ColumnComponent', () => {
  it('renders column title', () => {
    render(
      <Wrapper>
        <ColumnComponent
          column={mockColumn}
          cards={mockCards}
          index={0}
          onCardClick={jest.fn()}
          onAddCard={jest.fn()}
        />
      </Wrapper>
    );
    expect(screen.getByText('To Do')).toBeInTheDocument();
  });

  it('shows card count', () => {
    render(
      <Wrapper>
        <ColumnComponent
          column={mockColumn}
          cards={mockCards}
          index={0}
          onCardClick={jest.fn()}
          onAddCard={jest.fn()}
        />
      </Wrapper>
    );
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows add card form when button clicked', () => {
    render(
      <Wrapper>
        <ColumnComponent
          column={mockColumn}
          cards={mockCards}
          index={0}
          onCardClick={jest.fn()}
          onAddCard={jest.fn()}
        />
      </Wrapper>
    );
    fireEvent.click(screen.getByText('+ Add a card'));
    expect(screen.getByPlaceholderText('Enter card title...')).toBeInTheDocument();
  });

  it('calls onAddCard when form submitted', () => {
    const onAddCard = jest.fn();
    render(
      <Wrapper>
        <ColumnComponent
          column={mockColumn}
          cards={mockCards}
          index={0}
          onCardClick={jest.fn()}
          onAddCard={onAddCard}
        />
      </Wrapper>
    );
    fireEvent.click(screen.getByText('+ Add a card'));
    const input = screen.getByPlaceholderText('Enter card title...');
    fireEvent.change(input, { target: { value: 'New task' } });
    fireEvent.click(screen.getByText('Add Card'));
    expect(onAddCard).toHaveBeenCalledWith('col-1', 'New task');
  });
});
