import React, { useState } from 'react';
import { Board } from '../../types';
import { exportBoardToCSV, exportBoardToPDF } from '../../utils/exportBoard';
import './ExportMenu.css';

interface ExportMenuProps {
  board: Board;
}

function ExportMenu({ board }: ExportMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="export-menu">
      <button
        className="export-trigger"
        onClick={() => setOpen(prev => !prev)}
      >
        Export
      </button>
      {open && (
        <>
          <div className="export-backdrop" onClick={() => setOpen(false)} />
          <div className="export-dropdown">
            <button
              className="export-option"
              onClick={() => {
                exportBoardToCSV(board);
                setOpen(false);
              }}
            >
              Export as CSV
            </button>
            <button
              className="export-option"
              onClick={() => {
                exportBoardToPDF(board);
                setOpen(false);
              }}
            >
              Export as PDF (Print)
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ExportMenu;
