import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { Board, BoardSummary } from '../types';

export function useBoards(userId: string) {
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = db
      .collection('boards')
      .where('memberIds', 'array-contains', userId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => {
          const boardList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          })) as BoardSummary[];
          setBoards(boardList);
          setLoading(false);
        },
        err => {
          setError(err.message);
          setLoading(false);
        }
      );

    return unsubscribe;
  }, [userId]);

  return { boards, loading, error };
}

export function useBoard(boardId: string) {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!boardId) return;

    const unsubscribe = db
      .collection('boards')
      .doc(boardId)
      .onSnapshot(doc => {
        if (doc.exists) {
          setBoard({ id: doc.id, ...doc.data() } as Board);
        }
        setLoading(false);
      });

    return unsubscribe;
  }, [boardId]);

  return { board, loading };
}

export async function createBoard(
  title: string,
  description: string,
  ownerId: string
): Promise<string> {
  const now = Date.now();
  const boardRef = db.collection('boards').doc();

  const defaultColumns = {
    'col-todo': { id: 'col-todo', title: 'To Do', cardIds: [], order: 0 },
    'col-inprogress': { id: 'col-inprogress', title: 'In Progress', cardIds: [], order: 1 },
    'col-done': { id: 'col-done', title: 'Done', cardIds: [], order: 2 },
  };

  await boardRef.set({
    title,
    description,
    ownerId,
    memberIds: [ownerId],
    columnIds: ['col-todo', 'col-inprogress', 'col-done'],
    columns: defaultColumns,
    cards: {},
    createdAt: now,
    updatedAt: now,
  });

  return boardRef.id;
}

export async function updateBoard(boardId: string, updates: Partial<Board>): Promise<void> {
  await db.collection('boards').doc(boardId).update({
    ...updates,
    updatedAt: Date.now(),
  });
}

export async function deleteBoard(boardId: string): Promise<void> {
  await db.collection('boards').doc(boardId).delete();
}

export async function addCard(
  boardId: string,
  columnId: string,
  title: string,
  board: Board
): Promise<void> {
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
}

export async function deleteCard(
  boardId: string,
  columnId: string,
  cardId: string,
  board: Board
): Promise<void> {
  const newCardIds = board.columns[columnId].cardIds.filter(id => id !== cardId);

  await db.collection('boards').doc(boardId).update({
    [`columns.${columnId}.cardIds`]: newCardIds,
    [`cards.${cardId}`]: db.firestore.FieldValue.delete(),
    updatedAt: Date.now(),
  });
}
