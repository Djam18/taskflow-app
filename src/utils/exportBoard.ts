import { Board } from '../types';

// CSV export — no external lib needed
export function exportBoardToCSV(board: Board): void {
  const cards = Object.values(board.cards);
  const columnMap: Record<string, string> = {};
  Object.values(board.columns).forEach(col => {
    col.cardIds.forEach(cardId => {
      columnMap[cardId] = col.title;
    });
  });

  const headers = ['Title', 'Column', 'Priority', 'Labels', 'Description', 'Created'];
  const rows = cards.map(card => [
    `"${card.title.replace(/"/g, '""')}"`,
    `"${columnMap[card.id] || ''}"`,
    card.priority,
    `"${card.labels.join(', ')}"`,
    `"${card.description.replace(/"/g, '""')}"`,
    new Date(card.createdAt).toLocaleDateString(),
  ]);

  const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  downloadFile(csv, `${board.title}-export.csv`, 'text/csv;charset=utf-8;');
}

// Simple PDF export using browser print API
// (jsPDF would be imported here in a real project)
export function exportBoardToPDF(board: Board): void {
  const cards = Object.values(board.cards);
  const columnMap: Record<string, string> = {};
  Object.values(board.columns).forEach(col => {
    col.cardIds.forEach(cardId => {
      columnMap[cardId] = col.title;
    });
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${board.title}</title>
  <style>
    body { font-family: sans-serif; margin: 20px; color: #172b4d; }
    h1 { color: #0052cc; border-bottom: 2px solid #0052cc; padding-bottom: 8px; }
    .card { border: 1px solid #dfe1e6; border-radius: 4px; padding: 12px; margin: 8px 0; }
    .card-title { font-weight: 700; font-size: 14px; }
    .card-meta { color: #6b778c; font-size: 12px; margin-top: 4px; }
    .priority-high { color: #de350b; }
    .priority-medium { color: #ff8b00; }
    .priority-low { color: #36b37e; }
  </style>
</head>
<body>
  <h1>${board.title}</h1>
  <p>Exported on ${new Date().toLocaleDateString()} — ${cards.length} cards</p>
  ${board.columnIds.map(colId => {
    const col = board.columns[colId];
    if (!col) return '';
    return `
      <h2>${col.title} (${col.cardIds.length})</h2>
      ${col.cardIds.map(cardId => {
        const card = board.cards[cardId];
        if (!card) return '';
        return `
          <div class="card">
            <div class="card-title">${card.title}</div>
            <div class="card-meta">
              Priority: <span class="priority-${card.priority}">${card.priority}</span>
              ${card.labels.length ? ` | Labels: ${card.labels.join(', ')}` : ''}
            </div>
            ${card.description ? `<p style="font-size:13px;margin-top:6px">${card.description}</p>` : ''}
          </div>
        `;
      }).join('')}
    `;
  }).join('')}
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
