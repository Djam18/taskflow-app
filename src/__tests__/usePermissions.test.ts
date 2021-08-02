import { getBoardRole, canEditBoard, canDeleteBoard, canInviteMembers } from '../hooks/usePermissions';
import { Board } from '../types';

const mockBoard: Board = {
  id: 'board-1',
  title: 'Test',
  description: '',
  ownerId: 'owner-1',
  memberIds: ['owner-1', 'member-1'],
  columnIds: [],
  columns: {},
  cards: {},
  createdAt: 0,
  updatedAt: 0,
};

describe('getBoardRole', () => {
  it('returns owner for board owner', () => {
    expect(getBoardRole(mockBoard, 'owner-1')).toBe('owner');
  });

  it('returns member for board member', () => {
    expect(getBoardRole(mockBoard, 'member-1')).toBe('member');
  });

  it('returns none for non-member', () => {
    expect(getBoardRole(mockBoard, 'stranger')).toBe('none');
  });

  it('returns none for undefined user', () => {
    expect(getBoardRole(mockBoard, undefined)).toBe('none');
  });

  it('returns none for null board', () => {
    expect(getBoardRole(null, 'owner-1')).toBe('none');
  });
});

describe('canEditBoard', () => {
  it('allows owner to edit', () => {
    expect(canEditBoard('owner')).toBe(true);
  });

  it('allows member to edit', () => {
    expect(canEditBoard('member')).toBe(true);
  });

  it('denies none role', () => {
    expect(canEditBoard('none')).toBe(false);
  });
});

describe('canDeleteBoard', () => {
  it('allows only owner to delete', () => {
    expect(canDeleteBoard('owner')).toBe(true);
    expect(canDeleteBoard('member')).toBe(false);
    expect(canDeleteBoard('none')).toBe(false);
  });
});

describe('canInviteMembers', () => {
  it('allows only owner to invite', () => {
    expect(canInviteMembers('owner')).toBe(true);
    expect(canInviteMembers('member')).toBe(false);
  });
});
