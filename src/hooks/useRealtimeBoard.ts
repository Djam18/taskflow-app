import { useState, useEffect, useCallback } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { db } from '../firebase/config';
import { Board } from '../types';

export function useRealtimeBoard(boardId: string | null) {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!boardId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = db
      .collection('boards')
      .doc(boardId)
      .onSnapshot(
        doc => {
          if (doc.exists) {
            setBoard({ id: doc.id, ...doc.data() } as Board);
          } else {
            setBoard(null);
          }
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );

    return unsubscribe;
  }, [boardId]);

  const handleDragEnd = useCallback(
    async (result: DropResult) => {
      if (!boardId || !board) return;

      const { destination, source, draggableId, type } = result;
      if (!destination) return;
      if (destination.droppableId === source.droppableId && destination.index === source.index) return;

      setSyncing(true);

      try {
        if (type === 'column') {
          const newColumnIds = [...board.columnIds];
          newColumnIds.splice(source.index, 1);
          newColumnIds.splice(destination.index, 0, draggableId);
          await db.collection('boards').doc(boardId).update({
            columnIds: newColumnIds,
            updatedAt: Date.now(),
          });
          return;
        }

        const sourceColumn = board.columns[source.droppableId];
        const destColumn = board.columns[destination.droppableId];

        if (sourceColumn.id === destColumn.id) {
          const newCardIds = [...sourceColumn.cardIds];
          newCardIds.splice(source.index, 1);
          newCardIds.splice(destination.index, 0, draggableId);
          await db.collection('boards').doc(boardId).update({
            [`columns.${sourceColumn.id}.cardIds`]: newCardIds,
            updatedAt: Date.now(),
          });
        } else {
          const sourceCardIds = [...sourceColumn.cardIds];
          sourceCardIds.splice(source.index, 1);
          const destCardIds = [...destColumn.cardIds];
          destCardIds.splice(destination.index, 0, draggableId);
          await db.collection('boards').doc(boardId).update({
            [`columns.${sourceColumn.id}.cardIds`]: sourceCardIds,
            [`columns.${destColumn.id}.cardIds`]: destCardIds,
            updatedAt: Date.now(),
          });
        }
      } finally {
        setSyncing(false);
      }
    },
    [boardId, board]
  );

  const addCard = useCallback(
    async (columnId: string, title: string) => {
      if (!boardId || !board) return;

      const cardId = `card-${Date.now()}`;
      const now = Date.now();
      const newCard = {
        id: cardId,
        title,
        description: '',
        priority: 'medium',
        labels: [],
        assigneeId: null,
        createdAt: now,
        updatedAt: now,
        order: board.columns[columnId].cardIds.length,
      };

      await db.collection('boards').doc(boardId).update({
        [`cards.${cardId}`]: newCard,
        [`columns.${columnId}.cardIds`]: [...board.columns[columnId].cardIds, cardId],
        updatedAt: now,
      });
    },
    [boardId, board]
  );

  const addColumn = useCallback(
    async (title: string) => {
      if (!boardId || !board) return;

      const columnId = `col-${Date.now()}`;
      await db.collection('boards').doc(boardId).update({
        columnIds: [...board.columnIds, columnId],
        [`columns.${columnId}`]: {
          id: columnId,
          title,
          cardIds: [],
          order: board.columnIds.length,
        },
        updatedAt: Date.now(),
      });
    },
    [boardId, board]
  );

  return { board, loading, syncing, handleDragEnd, addCard, addColumn };
}
