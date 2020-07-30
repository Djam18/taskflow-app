import React, { useState } from 'react';
import { Board, Card } from '../../types';
import ColumnComponent from '../Column/ColumnComponent';
import './BoardComponent.css';

interface BoardProps {
  board: Board;
  onCardClick: (card: Card) => void;
  onAddCard: (columnId: string, title: string) => void;
  onAddColumn: (title: string) => void;
}

function BoardComponent({ board, onCardClick, onAddCard, onAddColumn }: BoardProps) {
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      onAddColumn(newColumnTitle.trim());
      setNewColumnTitle('');
      setAddingColumn(false);
    }
  };

  const sortedColumns = board.columnIds
    .map(id => board.columns[id])
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="board">
      <div className="board-header">
        <h2 className="board-title">{board.title}</h2>
      </div>
      <div className="board-columns">
        {sortedColumns.map(column => {
          const cards = column.cardIds
            .map(id => board.cards[id])
            .filter(Boolean)
            .sort((a, b) => a.order - b.order);
          return (
            <ColumnComponent
              key={column.id}
              column={column}
              cards={cards}
              onCardClick={onCardClick}
              onAddCard={onAddCard}
            />
          );
        })}
        {addingColumn ? (
          <div className="add-column-form">
            <input
              type="text"
              className="add-column-input"
              value={newColumnTitle}
              onChange={e => setNewColumnTitle(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleAddColumn();
                if (e.key === 'Escape') {
                  setAddingColumn(false);
                  setNewColumnTitle('');
                }
              }}
              placeholder="Enter list title..."
              autoFocus
            />
            <div className="add-column-actions">
              <button className="btn-primary btn-sm" onClick={handleAddColumn}>
                Add List
              </button>
              <button
                className="btn-text"
                onClick={() => {
                  setAddingColumn(false);
                  setNewColumnTitle('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button className="add-column-btn" onClick={() => setAddingColumn(true)}>
            + Add another list
          </button>
        )}
      </div>
    </div>
  );
}

export default BoardComponent;
