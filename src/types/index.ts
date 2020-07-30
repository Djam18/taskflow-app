export type Priority = 'low' | 'medium' | 'high';
export type Label = 'bug' | 'feature' | 'design' | 'docs' | 'chore';

export interface Card {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  labels: Label[];
  assigneeId: string | null;
  createdAt: number;
  updatedAt: number;
  order: number;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
  order: number;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  memberIds: string[];
  columnIds: string[];
  columns: Record<string, Column>;
  cards: Record<string, Card>;
  createdAt: number;
  updatedAt: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
}

export type BoardSummary = Pick<Board, 'id' | 'title' | 'description' | 'ownerId' | 'createdAt'>;
