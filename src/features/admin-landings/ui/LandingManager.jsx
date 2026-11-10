'use client';

import { useState } from 'react';
import LandingList from './LandingList';
import LandingEditor from './LandingEditor';

/**
 * @param {{
 *   onNotify: (message: string, severity: 'success' | 'error' | 'warning') => void,
 *   reloadToken?: number,
 * }} props
 */
export default function LandingManager({ onNotify, reloadToken = 0 }) {
  const [editor, setEditor] = useState({
    open: false,
    mode: /** @type {import('../model/types').LandingEditorMode} */ ('create'),
    landing: /** @type {import('../model/types').LandingRecord | null} */ (null),
  });
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <LandingList
        refreshKey={refreshKey}
        reloadToken={reloadToken}
        onNotify={onNotify}
        onCreate={() => setEditor({ open: true, mode: 'create', landing: null })}
        onEdit={(landing) => setEditor({ open: true, mode: 'edit', landing })}
        onDuplicate={(landing) => setEditor({ open: true, mode: 'duplicate', landing })}
      />
      <LandingEditor
        open={editor.open}
        mode={editor.mode}
        landing={editor.landing}
        onClose={() => setEditor((current) => ({ ...current, open: false }))}
        onSaved={(message) => {
          setRefreshKey((key) => key + 1);
          onNotify(message, 'success');
        }}
      />
    </>
  );
}
