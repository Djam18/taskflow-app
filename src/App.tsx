import React, { useState } from 'react';
import { Board, Card } from './types';
import BoardComponent from './components/Board/BoardComponent';
import './App.css';

const INITIAL_BOARD: Board = {
  id: 'board-1',
  title: 'My Project',
  description: 'Sample kanban board',
  ownerId: 'user-1',
  memberIds: ['user-1'],
  columnIds: ['col-1', 'col-2', 'col-3'],
  columns: {
    'col-1': {
      id: 'col-1',
      title: 'To Do',
      cardIds: ['card-1', 'card-2'],
      order: 0,
    },
    'col-2': {
      id: 'col-2',
      title: 'In Progress',
      cardIds: ['card-3'],
      order: 1,
    },
    'col-3': {
      id: 'col-3',
      title: 'Done',
      cardIds: [],
      order: 2,
    },
  },
  cards: {
    'card-1': {
      id: 'card-1',
      title: 'Set up React + TypeScript project',
      description: 'Initialize the project with CRA and TypeScript template',
      priority: 'high',
      labels: ['chore'],
      assigneeId: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      order: 0,
    },
    'card-2': {
      id: 'card-2',
      title: 'Design board component',
      description: 'Create column and card UI components',
      priority: 'medium',
      labels: ['feature', 'design'],
      assigneeId: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      order: 1,
    },
    'card-3': {
      id: 'card-3',
      title: 'Implement drag and drop',
      description: 'Add react-beautiful-dnd for card reordering',
      priority: 'high',
      labels: ['feature'],
      assigneeId: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      order: 0,
    },
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

function App() {
  const [board, setBoard] = useState<Board>(INITIAL_BOARD);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const handleAddCard = (columnId: string, title: string) => {
    const cardId = `card-${Date.now()}`;
    const column = board.columns[columnId];
    const newCard: Card = {
      id: cardId,
      title,
      description: '',
      priority: 'medium',
      labels: [],
      assigneeId: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      order: column.cardIds.length,
    };
    setBoard(prev => ({
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          cardIds: [...prev.columns[columnId].cardIds, cardId],
        },
      },
      cards: {
        ...prev.cards,
        [cardId]: newCard,
      },
    }));
  };

  const handleAddColumn = (title: string) => {
    const columnId = `col-${Date.now()}`;
    setBoard(prev => ({
      ...prev,
      columnIds: [...prev.columnIds, columnId],
      columns: {
        ...prev.columns,
        [columnId]: {
          id: columnId,
          title,
          cardIds: [],
          order: prev.columnIds.length,
        },
      },
    }));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>TaskFlow</h1>
      </header>
      <main className="app-main">
        <BoardComponent
          board={board}
          onCardClick={setSelectedCard}
          onAddCard={handleAddCard}
          onAddColumn={handleAddColumn}
        />
        {selectedCard && (
          <div className="modal-overlay" onClick={() => setSelectedCard(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <h3>{selectedCard.title}</h3>
              <p>{selectedCard.description || 'No description yet.'}</p>
              <button className="btn-primary" onClick={() => setSelectedCard(null)}>
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
