import React from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { Draggable } from 'react-beautiful-dnd';
import { Card } from '../../types';
import CardItem from '../Card/CardItem';

interface VirtualizedCardListProps {
  cards: Card[];
  onCardClick: (card: Card) => void;
}

const CARD_HEIGHT = 90;
const MAX_VISIBLE = 6;
const LIST_HEIGHT = MAX_VISIBLE * CARD_HEIGHT;

function VirtualizedCardList({ cards, onCardClick }: VirtualizedCardListProps) {
  // Only use virtualization for large lists (500+ cards)
  // For typical boards, regular rendering is fine
  if (cards.length < 50) {
    return (
      <>
        {cards.map((card, index) => (
          <Draggable key={card.id} draggableId={card.id} index={index}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={{
                  ...provided.draggableProps.style,
                  opacity: snapshot.isDragging ? 0.9 : 1,
                }}
              >
                <CardItem card={card} onClick={onCardClick} />
              </div>
            )}
          </Draggable>
        ))}
      </>
    );
  }

  // Virtualized list for 50+ cards
  const Row = ({ index, style }: ListChildComponentProps) => {
    const card = cards[index];
    return (
      <Draggable key={card.id} draggableId={card.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              ...provided.draggableProps.style,
              ...style,
              opacity: snapshot.isDragging ? 0.9 : 1,
            }}
          >
            <CardItem card={card} onClick={onCardClick} />
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <FixedSizeList
      height={Math.min(LIST_HEIGHT, cards.length * CARD_HEIGHT)}
      itemCount={cards.length}
      itemSize={CARD_HEIGHT}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}

export default VirtualizedCardList;
