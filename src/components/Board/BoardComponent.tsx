import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Board, Card } from '../../types';
import ColumnComponent from '../Column/ColumnComponent';
import './BoardComponent.css';

interface BoardProps {
  board: Board;
  onCardClick: (card: Card) => void;
  onAddCard: (columnId: string, title: string) => void;
  onAddColumn: (title: string) => void;
  onDragEnd: (result: DropResult) => void;
}

function BoardComponent({ board, onCardClick, onAddCard, onAddColumn, onDragEnd }: BoardProps) {
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
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board">
        <div className="board-header">
          <h2 className="board-title">{board.title}</h2>
        </div>
        <Droppable droppableId="board" type="column" direction="horizontal">
          {(provided) => (
            <div
              className="board-columns"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {sortedColumns.map((column, index) => {
                const cards = column.cardIds
                  .map(id => board.cards[id])
                  .filter(Boolean);
                return (
                  <ColumnComponent
                    key={column.id}
                    column={column}
                    cards={cards}
                    index={index}
                    onCardClick={onCardClick}
                    onAddCard={onAddCard}
                  />
                );
              })}
              {provided.placeholder}
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
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
}

export default BoardComponent;
