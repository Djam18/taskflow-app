import React from 'react';
import './SyncIndicator.css';

interface SyncIndicatorProps {
  syncing: boolean;
}

function SyncIndicator({ syncing }: SyncIndicatorProps) {
  return (
    <div className={`sync-indicator ${syncing ? 'syncing' : 'synced'}`}>
      {syncing ? 'Saving...' : 'Saved'}
    </div>
  );
}

export default SyncIndicator;
