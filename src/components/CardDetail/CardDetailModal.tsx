import React, { useState, useEffect } from 'react';
import { Card, Label } from '../../types';
import './CardDetailModal.css';

const ALL_LABELS: Label[] = ['bug', 'feature', 'design', 'docs', 'chore'];

interface Comment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: number;
}

interface CardDetailModalProps {
  card: Card;
  onClose: () => void;
  onUpdate: (cardId: string, updates: Partial<Card>) => void;
}

function CardDetailModal({ card, onClose, onUpdate }: CardDetailModalProps) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);
  const [editingDesc, setEditingDesc] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    setTitle(card.title);
    setDescription(card.description);
  }, [card]);

  const handleTitleBlur = () => {
    if (title.trim() && title !== card.title) {
      onUpdate(card.id, { title: title.trim() });
    }
  };

  const handleSaveDesc = () => {
    onUpdate(card.id, { description });
    setEditingDesc(false);
  };

  const handleLabelToggle = (label: Label) => {
    const newLabels = card.labels.includes(label)
      ? card.labels.filter(l => l !== label)
      : [...card.labels, label];
    onUpdate(card.id, { labels: newLabels });
  };

  const handlePriorityChange = (priority: Card['priority']) => {
    onUpdate(card.id, { priority });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      text: newComment.trim(),
      authorId: 'current-user',
      authorName: 'Me',
      createdAt: Date.now(),
    };
    setComments(prev => [...prev, comment]);
    setNewComment('');
  };

  return (
    <div className="modal-overlay card-detail-overlay" onClick={onClose}>
      <div className="card-detail-modal" onClick={e => e.stopPropagation()}>
        <button className="card-detail-close" onClick={onClose}>
          ×
        </button>
        <div className="card-detail-body">
          <div className="card-detail-main">
            {/* Title */}
            <input
              className="card-detail-title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={e => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
            />

            {/* Labels */}
            <div className="card-detail-section">
              <h4>Labels</h4>
              <div className="label-list">
                {ALL_LABELS.map(label => (
                  <button
                    key={label}
                    className={`label-toggle ${card.labels.includes(label) ? 'active' : ''}`}
                    onClick={() => handleLabelToggle(label)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="card-detail-section">
              <h4>Description</h4>
              {editingDesc ? (
                <div className="desc-editor">
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Add a more detailed description..."
                    autoFocus
                    rows={4}
                  />
                  <div className="desc-actions">
                    <button className="btn-primary btn-sm" onClick={handleSaveDesc}>
                      Save
                    </button>
                    <button
                      className="btn-text"
                      onClick={() => {
                        setDescription(card.description);
                        setEditingDesc(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="desc-display"
                  onClick={() => setEditingDesc(true)}
                >
                  {description || 'Add a description...'}
                </div>
              )}
            </div>

            {/* Comments */}
            <div className="card-detail-section">
              <h4>Comments</h4>
              <div className="comment-input-row">
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  rows={2}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
                <button
                  className="btn-primary btn-sm"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  Save
                </button>
              </div>
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment">
                    <span className="comment-author">{comment.authorName}</span>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="card-detail-sidebar">
            <div className="sidebar-section">
              <h4>Priority</h4>
              {(['low', 'medium', 'high'] as Card['priority'][]).map(p => (
                <button
                  key={p}
                  className={`priority-btn priority-${p} ${card.priority === p ? 'active' : ''}`}
                  onClick={() => handlePriorityChange(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardDetailModal;
