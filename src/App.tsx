import React, { useState, useTransition } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { Board, Card } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import BoardComponent from './components/Board/BoardComponent';
import LoginPage from './components/Auth/LoginPage';
import './App.css';

const INITIAL_BOARD: Board = {
  id: 'board-1',
  title: 'My Project',
  description: 'Sample kanban board',
  ownerId: 'user-1',
  memberIds: ['user-1'],
  columnIds: ['col-1', 'col-2', 'col-3'],
  columns: {
    'col-1': { id: 'col-1', title: 'To Do', cardIds: ['card-1', 'card-2'], order: 0 },
    'col-2': { id: 'col-2', title: 'In Progress', cardIds: ['card-3'], order: 1 },
    'col-3': { id: 'col-3', title: 'Done', cardIds: [], order: 2 },
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

function AppContent() {
  const { currentUser, logout } = useAuth();
  const [board, setBoard] = useState<Board>(INITIAL_BOARD);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [, startTransition] = useTransition();
  // React 18: wrap heavy drag updates in startTransition so UI stays responsive

  if (!currentUser) {
    return <LoginPage />;
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    if (type === 'column') {
      const newColumnIds = [...board.columnIds];
      newColumnIds.splice(source.index, 1);
      newColumnIds.splice(destination.index, 0, draggableId);
      // React 18: column reorder is non-urgent — wrap in transition
      startTransition(() => {
        setBoard(prev => ({ ...prev, columnIds: newColumnIds }));
      });
      return;
    }

    const sourceColumn = board.columns[source.droppableId];
    const destColumn = board.columns[destination.droppableId];

    if (sourceColumn.id === destColumn.id) {
      const newCardIds = [...sourceColumn.cardIds];
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);
      startTransition(() => {
        setBoard(prev => ({
          ...prev,
          columns: { ...prev.columns, [sourceColumn.id]: { ...sourceColumn, cardIds: newCardIds } },
        }));
      });
    } else {
      const sourceCardIds = [...sourceColumn.cardIds];
      sourceCardIds.splice(source.index, 1);
      const destCardIds = [...destColumn.cardIds];
      destCardIds.splice(destination.index, 0, draggableId);
      startTransition(() => {
        setBoard(prev => ({
          ...prev,
          columns: {
            ...prev.columns,
            [sourceColumn.id]: { ...sourceColumn, cardIds: sourceCardIds },
            [destColumn.id]: { ...destColumn, cardIds: destCardIds },
          },
        }));
      });
    }
  };

  const handleAddCard = (columnId: string, title: string) => {
    const cardId = `card-${Date.now()}`;
    const newCard: Card = {
      id: cardId,
      title,
      description: '',
      priority: 'medium',
      labels: [],
      assigneeId: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      order: board.columns[columnId].cardIds.length,
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
      cards: { ...prev.cards, [cardId]: newCard },
    }));
  };

  const handleAddColumn = (title: string) => {
    const columnId = `col-${Date.now()}`;
    setBoard(prev => ({
      ...prev,
      columnIds: [...prev.columnIds, columnId],
      columns: {
        ...prev.columns,
        [columnId]: { id: columnId, title, cardIds: [], order: prev.columnIds.length },
      },
    }));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>TaskFlow</h1>
        <div className="app-header-right">
          <span className="user-name">{currentUser.displayName}</span>
          <button className="btn-logout" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>
      <main className="app-main">
        <BoardComponent
          board={board}
          onCardClick={setSelectedCard}
          onAddCard={handleAddCard}
          onAddColumn={handleAddColumn}
          onDragEnd={handleDragEnd}
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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
