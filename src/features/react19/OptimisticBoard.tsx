import React, { useOptimistic, useActionState, useTransition } from 'react';

// React 19 in taskflow-app:
// - Form actions replace onSubmit handlers for card creation
// - useOptimistic for instant drag-drop feedback
// - useActionState for server-synced board mutations

interface Card {
  id: string;
  title: string;
  columnId: string;
  optimistic?: boolean;
}

interface Column {
  id: string;
  title: string;
}

const COLUMNS: Column[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

const INITIAL_CARDS: Card[] = [
  { id: '1', title: 'Set up project', columnId: 'done' },
  { id: '2', title: 'React 19 upgrade', columnId: 'inprogress' },
  { id: '3', title: 'Add Tanstack Query', columnId: 'todo' },
];

// Server action: add a card
async function addCardAction(
  prevCards: Card[],
  formData: FormData
): Promise<Card[]> {
  await new Promise(r => setTimeout(r, 800)); // simulate server

  const title = formData.get('title') as string;
  const columnId = formData.get('columnId') as string;

  if (!title?.trim()) return prevCards;

  const newCard: Card = {
    id: Date.now().toString(),
    title: title.trim(),
    columnId,
  };

  return [...prevCards, newCard];
}

// Server action: move a card
async function moveCardAction(
  prevCards: Card[],
  { cardId, targetColumnId }: { cardId: string; targetColumnId: string }
): Promise<Card[]> {
  await new Promise(r => setTimeout(r, 400));
  return prevCards.map(c =>
    c.id === cardId ? { ...c, columnId: targetColumnId } : c
  );
}

export default function OptimisticBoard(): JSX.Element {
  const [cards, addCardDispatch, isAddPending] = useActionState(addCardAction, INITIAL_CARDS);
  const [isPending, startTransition] = useTransition();

  // useOptimistic for instant card moves
  const [optimisticCards, moveOptimistic] = useOptimistic(
    cards,
    (state: Card[], { cardId, targetColumnId }: { cardId: string; targetColumnId: string }) =>
      state.map(c => c.id === cardId ? { ...c, columnId: targetColumnId } : c)
  );

  function handleMoveCard(cardId: string, targetColumnId: string) {
    moveOptimistic({ cardId, targetColumnId });
    startTransition(async () => {
      await moveCardAction(cards, { cardId, targetColumnId });
    });
  }

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
        React 19: Form Actions + useOptimistic
        {(isAddPending || isPending) && (
          <span style={{ fontSize: 12, color: '#f59e0b', marginLeft: 8, fontWeight: 400 }}>
            Syncing...
          </span>
        )}
      </h2>
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
        Cards are added via form actions (no onSubmit). Moves are instant via useOptimistic.
      </p>

      <div style={{ display: 'flex', gap: 12 }}>
        {COLUMNS.map(col => (
          <div key={col.id} style={{ flex: 1, background: '#f3f4f6', borderRadius: 8, padding: 12 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#374151' }}>
              {col.title} ({optimisticCards.filter(c => c.columnId === col.id).length})
            </h3>

            {optimisticCards
              .filter(c => c.columnId === col.id)
              .map(card => (
                <div
                  key={card.id}
                  style={{
                    background: card.optimistic ? '#fef9c3' : 'white',
                    padding: '8px 10px',
                    borderRadius: 6,
                    marginBottom: 6,
                    fontSize: 13,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  }}
                >
                  {card.title}
                  <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                    {COLUMNS.filter(c => c.id !== col.id).map(targetCol => (
                      <button
                        key={targetCol.id}
                        onClick={() => handleMoveCard(card.id, targetCol.id)}
                        disabled={isPending}
                        style={{ fontSize: 10, padding: '2px 6px', background: '#e5e7eb', border: 'none', borderRadius: 3, cursor: 'pointer' }}
                      >
                        → {targetCol.title}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

            {/* React 19: form action directly on the form element */}
            <form action={addCardDispatch} style={{ marginTop: 8 }}>
              <input type="hidden" name="columnId" value={col.id} />
              <input
                name="title"
                placeholder="+ Add card"
                style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 12, boxSizing: 'border-box' }}
              />
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
