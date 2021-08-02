import { exportBoardToCSV } from '../utils/exportBoard';
import { Board } from '../types';

const mockBoard: Board = {
  id: 'board-1',
  title: 'Test Board',
  description: '',
  ownerId: 'user-1',
  memberIds: ['user-1'],
  columnIds: ['col-1', 'col-2'],
  columns: {
    'col-1': { id: 'col-1', title: 'To Do', cardIds: ['card-1', 'card-2'], order: 0 },
    'col-2': { id: 'col-2', title: 'Done', cardIds: ['card-3'], order: 1 },
  },
  cards: {
    'card-1': {
      id: 'card-1',
      title: 'First card',
      description: 'description',
      priority: 'high',
      labels: ['bug'],
      assigneeId: null,
      createdAt: 1000,
      updatedAt: 1000,
      order: 0,
    },
    'card-2': {
      id: 'card-2',
      title: 'Second card',
      description: '',
      priority: 'low',
      labels: [],
      assigneeId: null,
      createdAt: 2000,
      updatedAt: 2000,
      order: 1,
    },
    'card-3': {
      id: 'card-3',
      title: 'Done card',
      description: 'Completed',
      priority: 'medium',
      labels: ['feature'],
      assigneeId: null,
      createdAt: 3000,
      updatedAt: 3000,
      order: 0,
    },
  },
  createdAt: 0,
  updatedAt: 0,
};

describe('exportBoardToCSV', () => {
  let createObjectURL: jest.Mock;
  let revokeObjectURL: jest.Mock;
  let createElement: jest.SpyInstance;
  let appendChildSpy: jest.SpyInstance;
  let removeChildSpy: jest.SpyInstance;
  let mockLink: HTMLAnchorElement;

  beforeEach(() => {
    createObjectURL = jest.fn().mockReturnValue('blob:mock');
    revokeObjectURL = jest.fn();
    global.URL.createObjectURL = createObjectURL;
    global.URL.revokeObjectURL = revokeObjectURL;

    mockLink = document.createElement('a');
    jest.spyOn(mockLink, 'click').mockImplementation(() => {});

    createElement = jest.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') return mockLink;
      return document.createElement(tag);
    });

    appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink);
    removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('triggers a file download', () => {
    exportBoardToCSV(mockBoard);
    expect(createObjectURL).toHaveBeenCalled();
    expect(mockLink.download).toBe('Test Board-export.csv');
  });

  it('revokes the object URL after download', () => {
    exportBoardToCSV(mockBoard);
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock');
  });
});
