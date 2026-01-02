import React from 'react';
import { Card } from '@/components/ui';

const shortcuts = [
  { key: 'Space', action: 'Start / Pause / Resume' },
  { key: 'F', action: 'Toggle fullscreen' },
  { key: 'Esc', action: 'Exit fullscreen / Close modal' },
];

export const KeyboardShortcutsHelp: React.FC = () => {
  return (
    <Card variant="bordered" padding="sm">
      <p className="text-xs text-slate-400 mb-2">Keyboard shortcuts</p>
      <div className="space-y-1">
        {shortcuts.map(({ key, action }) => (
          <div key={key} className="flex items-center justify-between text-sm">
            <kbd className="px-2 py-0.5 bg-slate-800 rounded text-slate-300 font-mono text-xs">
              {key}
            </kbd>
            <span className="text-slate-400">{action}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
