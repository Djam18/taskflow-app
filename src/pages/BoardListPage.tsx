import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBoards, createBoard } from '../hooks/useBoards';
import './BoardListPage.css';

interface BoardListPageProps {
  onSelectBoard: (boardId: string) => void;
}

function BoardListPage({ onSelectBoard }: BoardListPageProps) {
  const { currentUser } = useAuth();
  const { boards, loading } = useBoards(currentUser?.uid ?? '');
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !currentUser) return;
    setCreating(true);
    try {
      const boardId = await createBoard(newTitle.trim(), newDesc.trim(), currentUser.uid);
      setShowCreate(false);
      setNewTitle('');
      setNewDesc('');
      onSelectBoard(boardId);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="boards-loading">Loading boards...</div>;
  }

  return (
    <div className="boards-page">
      <div className="boards-header">
        <h2>My Boards</h2>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>
          Create Board
        </button>
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Create a new board</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label>Board Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="My Project"
                  required
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="What is this board for?"
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary" disabled={creating}>
                  {creating ? 'Creating...' : 'Create Board'}
                </button>
                <button type="button" className="btn-text" onClick={() => setShowCreate(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="boards-grid">
        {boards.map(board => (
          <button
            key={board.id}
            className="board-card"
            onClick={() => onSelectBoard(board.id)}
          >
            <h3>{board.title}</h3>
            {board.description && <p>{board.description}</p>}
          </button>
        ))}
        {boards.length === 0 && (
          <div className="boards-empty">
            <p>No boards yet. Create your first board!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BoardListPage;
