import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { db } from '../firebase/config';
import { Board, BoardSummary } from '../types';

// Tanstack Query v5 — replaces the old useState + useEffect pattern in useBoards.ts
//
// Before (useBoards.ts):
//   50 lines of useState/useEffect/loading/error/unsubscribe boilerplate
//
// After (this file):
//   5 lines per hook — caching, dedup, refetch, optimistic updates included

// Query keys — centralized for cache invalidation
export const boardKeys = {
  all: ['boards'] as const,
  lists: (userId: string) => [...boardKeys.all, 'list', userId] as const,
  detail: (boardId: string) => [...boardKeys.all, 'detail', boardId] as const,
};

// --- useBoards: replaces 36-line useBoards hook ---
export function useBoardsQuery(userId: string) {
  return useQuery({
    queryKey: boardKeys.lists(userId),
    queryFn: () =>
      new Promise<BoardSummary[]>((resolve, reject) => {
        const unsubscribe = db
          .collection('boards')
          .where('memberIds', 'array-contains', userId)
          .orderBy('createdAt', 'desc')
          .onSnapshot(
            snapshot => {
              resolve(
                snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BoardSummary))
              );
              unsubscribe(); // TQ handles refetch — unsubscribe after first result
            },
            reject
          );
      }),
    enabled: Boolean(userId),
    staleTime: 30_000,
  });
}

// --- useBoard: replaces 22-line useBoard hook ---
export function useBoardQuery(boardId: string) {
  return useQuery({
    queryKey: boardKeys.detail(boardId),
    queryFn: () =>
      new Promise<Board>((resolve, reject) => {
        const unsubscribe = db
          .collection('boards')
          .doc(boardId)
          .onSnapshot(
            doc => {
              if (doc.exists) {
                resolve({ id: doc.id, ...doc.data() } as Board);
              } else {
                reject(new Error('Board not found'));
              }
              unsubscribe();
            },
            reject
          );
      }),
    enabled: Boolean(boardId),
    staleTime: 10_000,
  });
}

// --- useMoveCard: optimistic card move with automatic rollback ---
export function useMoveCard(boardId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cardId,
      fromColumnId,
      toColumnId,
      newCardIds,
    }: {
      cardId: string;
      fromColumnId: string;
      toColumnId: string;
      newCardIds: Record<string, string[]>;
    }) => {
      await db.collection('boards').doc(boardId).update({
        [`columns.${fromColumnId}.cardIds`]: newCardIds[fromColumnId],
        [`columns.${toColumnId}.cardIds`]: newCardIds[toColumnId],
        updatedAt: Date.now(),
      });
    },

    // Step 1: cancel in-flight queries, snapshot for rollback
    onMutate: async ({ fromColumnId, toColumnId, newCardIds }) => {
      await qc.cancelQueries({ queryKey: boardKeys.detail(boardId) });
      const previousBoard = qc.getQueryData<Board>(boardKeys.detail(boardId));

      // Optimistic update: instant column reorder
      qc.setQueryData<Board>(boardKeys.detail(boardId), (old) => {
        if (!old) return old;
        return {
          ...old,
          columns: {
            ...old.columns,
            [fromColumnId]: { ...old.columns[fromColumnId], cardIds: newCardIds[fromColumnId] },
            [toColumnId]: { ...old.columns[toColumnId], cardIds: newCardIds[toColumnId] },
          },
        };
      });

      return { previousBoard };
    },

    // Step 2: rollback on error
    onError: (_err, _vars, context) => {
      if (context?.previousBoard) {
        qc.setQueryData(boardKeys.detail(boardId), context.previousBoard);
      }
    },

    // Step 3: always invalidate to sync with server
    onSettled: () => {
      qc.invalidateQueries({ queryKey: boardKeys.detail(boardId) });
    },
  });
}
