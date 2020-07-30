import React, { useState } from 'react';
import { Column, Card } from '../../types';
import CardItem from '../Card/CardItem';
import './ColumnComponent.css';

interface ColumnProps {
  column: Column;
  cards: Card[];
  onCardClick: (card: Card) => void;
  onAddCard: (columnId: string, title: string) => void;
}

function ColumnComponent({ column, cards, onCardClick, onAddCard }: ColumnProps) {
  const [addingCard, setAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(column.id, newCardTitle.trim());
      setNewCardTitle('');
      setAddingCard(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCard();
    } else if (e.key === 'Escape') {
      setAddingCard(false);
      setNewCardTitle('');
    }
  };

  return (
    <div className="column">
      <div className="column-header">
        <h3 className="column-title">{column.title}</h3>
        <span className="column-count">{cards.length}</span>
      </div>
      <div className="column-cards">
        {cards.map(card => (
          <CardItem key={card.id} card={card} onClick={onCardClick} />
        ))}
        {addingCard && (
          <div className="add-card-form">
            <textarea
              className="add-card-input"
              value={newCardTitle}
              onChange={e => setNewCardTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter card title..."
              autoFocus
            />
            <div className="add-card-actions">
              <button className="btn-primary btn-sm" onClick={handleAddCard}>
                Add Card
              </button>
              <button
                className="btn-text"
                onClick={() => {
                  setAddingCard(false);
                  setNewCardTitle('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      {!addingCard && (
        <button className="add-card-btn" onClick={() => setAddingCard(true)}>
          + Add a card
        </button>
      )}
    </div>
  );
}

export default ColumnComponent;
