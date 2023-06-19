import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Board, Card, Column } from '../types';

// Zustand > Context pour l'app state
// Avant: Context + useReducer — tout le tree re-render à chaque action
// Maintenant: Zustand — seuls les composants qui lisent le slice impacté re-render
// Code: 3x moins verbeux que Context + useReducer

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

interface BoardState {
  board: Board;
  selectedCard: Card | null;
  // Actions
  setSelectedCard: (card: Card | null) => void;
  moveCard: (
    draggableId: string,
    sourceDroppableId: string,
    sourceIndex: number,
    destDroppableId: string,
    destIndex: number
  ) => void;
  moveColumn: (draggableId: string, sourceIndex: number, destIndex: number) => void;
  addCard: (columnId: string, title: string) => void;
  addColumn: (title: string) => void;
}

export const useBoardStore = create<BoardState>()(
  devtools(
    (set) => ({
      board: INITIAL_BOARD,
      selectedCard: null,

      setSelectedCard: (card) => set({ selectedCard: card }),

      moveCard: (draggableId, sourceDroppableId, sourceIndex, destDroppableId, destIndex) =>
        set((state) => {
          const board = state.board;
          const sourceColumn = board.columns[sourceDroppableId];
          const destColumn = board.columns[destDroppableId];

          if (sourceColumn.id === destColumn.id) {
            const newCardIds = [...sourceColumn.cardIds];
            newCardIds.splice(sourceIndex, 1);
            newCardIds.splice(destIndex, 0, draggableId);
            return {
              board: {
                ...board,
                columns: {
                  ...board.columns,
                  [sourceColumn.id]: { ...sourceColumn, cardIds: newCardIds },
                },
              },
            };
          }

          const sourceCardIds = [...sourceColumn.cardIds];
          sourceCardIds.splice(sourceIndex, 1);
          const destCardIds = [...destColumn.cardIds];
          destCardIds.splice(destIndex, 0, draggableId);
          return {
            board: {
              ...board,
              columns: {
                ...board.columns,
                [sourceColumn.id]: { ...sourceColumn, cardIds: sourceCardIds },
                [destColumn.id]: { ...destColumn, cardIds: destCardIds },
              },
            },
          };
        }),

      moveColumn: (draggableId, sourceIndex, destIndex) =>
        set((state) => {
          const newColumnIds = [...state.board.columnIds];
          newColumnIds.splice(sourceIndex, 1);
          newColumnIds.splice(destIndex, 0, draggableId);
          return { board: { ...state.board, columnIds: newColumnIds } };
        }),

      addCard: (columnId, title) =>
        set((state) => {
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
            order: state.board.columns[columnId].cardIds.length,
          };
          return {
            board: {
              ...state.board,
              columns: {
                ...state.board.columns,
                [columnId]: {
                  ...state.board.columns[columnId],
                  cardIds: [...state.board.columns[columnId].cardIds, cardId],
                },
              },
              cards: { ...state.board.cards, [cardId]: newCard },
            },
          };
        }),

      addColumn: (title) =>
        set((state) => {
          const columnId = `col-${Date.now()}`;
          const newColumn: Column = {
            id: columnId,
            title,
            cardIds: [],
            order: state.board.columnIds.length,
          };
          return {
            board: {
              ...state.board,
              columnIds: [...state.board.columnIds, columnId],
              columns: { ...state.board.columns, [columnId]: newColumn },
            },
          };
        }),
    }),
    { name: 'BoardStore' }
  )
);

// Usage in components:
// const board = useBoardStore(state => state.board);       // no re-render on selectedCard change
// const selectedCard = useBoardStore(state => state.selectedCard); // only re-renders this
// const moveCard = useBoardStore(state => state.moveCard);  // stable reference — no useCallback needed
