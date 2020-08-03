import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { Column, Card } from '../../types';
import CardItem from '../Card/CardItem';
import './ColumnComponent.css';

interface ColumnProps {
  column: Column;
  cards: Card[];
  index: number;
  onCardClick: (card: Card) => void;
  onAddCard: (columnId: string, title: string) => void;
}

function ColumnComponent({ column, cards, index, onCardClick, onAddCard }: ColumnProps) {
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
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          className="column"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className="column-header" {...provided.dragHandleProps}>
            <h3 className="column-title">{column.title}</h3>
            <span className="column-count">{cards.length}</span>
          </div>
          <Droppable droppableId={column.id} type="card">
            {(droppableProvided, snapshot) => (
              <div
                className={`column-cards ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                ref={droppableProvided.innerRef}
                {...droppableProvided.droppableProps}
              >
                {cards.map((card, cardIndex) => (
                  <Draggable key={card.id} draggableId={card.id} index={cardIndex}>
                    {(cardProvided, cardSnapshot) => (
                      <div
                        ref={cardProvided.innerRef}
                        {...cardProvided.draggableProps}
                        {...cardProvided.dragHandleProps}
                        style={{
                          ...cardProvided.draggableProps.style,
                          opacity: cardSnapshot.isDragging ? 0.9 : 1,
                        }}
                      >
                        <CardItem card={card} onClick={onCardClick} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {droppableProvided.placeholder}
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
            )}
          </Droppable>
          {!addingCard && (
            <button className="add-card-btn" onClick={() => setAddingCard(true)}>
              + Add a card
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
}

export default ColumnComponent;
