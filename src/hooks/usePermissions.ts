import { Board } from '../types';

export type BoardRole = 'owner' | 'member' | 'viewer' | 'none';

export function getBoardRole(board: Board | null, userId: string | undefined): BoardRole {
  if (!board || !userId) return 'none';
  if (board.ownerId === userId) return 'owner';
  if (board.memberIds.includes(userId)) return 'member';
  return 'none';
}

export function canEditBoard(role: BoardRole): boolean {
  return role === 'owner' || role === 'member';
}

export function canDeleteBoard(role: BoardRole): boolean {
  return role === 'owner';
}

export function canInviteMembers(role: BoardRole): boolean {
  return role === 'owner';
}
