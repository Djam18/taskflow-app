import React from 'react';
import { Card, Priority } from '../../types';
import './CardItem.css';

interface CardItemProps {
  card: Card;
  onClick: (card: Card) => void;
}

const PRIORITY_COLORS: Record<Priority, string> = {
  low: '#36b37e',
  medium: '#ff8b00',
  high: '#de350b',
};

const LABEL_COLORS: Record<string, string> = {
  bug: '#de350b',
  feature: '#0052cc',
  design: '#6554c0',
  docs: '#00b8d9',
  chore: '#8993a4',
};

function CardItem({ card, onClick }: CardItemProps) {
  return (
    <div className="card-item" onClick={() => onClick(card)}>
      {card.labels.length > 0 && (
        <div className="card-labels">
          {card.labels.map(label => (
            <span
              key={label}
              className="card-label"
              style={{ backgroundColor: LABEL_COLORS[label] }}
            >
              {label}
            </span>
          ))}
        </div>
      )}
      <p className="card-title">{card.title}</p>
      <div className="card-meta">
        <span
          className="card-priority"
          style={{ color: PRIORITY_COLORS[card.priority] }}
        >
          {card.priority}
        </span>
      </div>
    </div>
  );
}

export default CardItem;
