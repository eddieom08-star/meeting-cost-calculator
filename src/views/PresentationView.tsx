import React, { useEffect } from 'react';
import { CostDisplay } from '@/components/display';
import { Button } from '@/components/ui';

interface PresentationViewProps {
  onExit: () => void;
}

export const PresentationView: React.FC<PresentationViewProps> = ({ onExit }) => {
  // Enter fullscreen on mount
  useEffect(() => {
    document.documentElement.requestFullscreen?.().catch(() => {
      // Fullscreen not supported or denied
    });

    return () => {
      document.exitFullscreen?.().catch(() => {});
    };
  }, []);

  // Exit on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  return (
    <div className="fixed inset-0 bg-slate-950 z-50">
      <CostDisplay variant="presentation" />

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <Button variant="ghost" onClick={onExit}>
          Exit Presentation (Esc)
        </Button>
      </div>
    </div>
  );
};
