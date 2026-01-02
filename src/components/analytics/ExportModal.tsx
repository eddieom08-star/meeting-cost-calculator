import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHistoryStore } from '@/stores/historyStore';
import { downloadFile, copyToClipboard } from '@/utils/export';
import { Card, Button } from '@/components/ui';
import { cn } from '@/utils/cn';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = 'csv' | 'json';

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { meetings } = useHistoryStore();
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [copied, setCopied] = useState(false);

  const exportToCSV = (data: typeof meetings): string => {
    const headers = ['Date', 'Duration (min)', 'Attendees', 'Total Cost', 'Cost/Min'];
    const rows = data.map(m => [
      new Date(m.endedAt).toLocaleDateString(),
      Math.round(m.duration / 60000).toString(),
      m.attendeeCount.toString(),
      (m.totalCost / 100).toFixed(2),
      (m.averageCostPerMinute / 100).toFixed(2),
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  };

  const exportToJSON = (data: typeof meetings): string => {
    return JSON.stringify(data, null, 2);
  };

  const generateFilename = (prefix: string, extension: string): string => {
    const timestamp = new Date().toISOString().split('T')[0];
    return `${prefix}-${timestamp}.${extension}`;
  };

  const handleDownload = () => {
    let content: string;
    let mimeType: string;
    let extension: string;

    if (format === 'csv') {
      content = exportToCSV(meetings);
      mimeType = 'text/csv';
      extension = 'csv';
    } else {
      content = exportToJSON(meetings);
      mimeType = 'application/json';
      extension = 'json';
    }

    const filename = generateFilename('meeting-history', extension);
    downloadFile(content, filename, mimeType);
    onClose();
  };

  const handleCopy = async () => {
    const content = format === 'csv' ? exportToCSV(meetings) : exportToJSON(meetings);
    const text = content;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback silently fails
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md"
          >
            <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Export History</h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-slate-400 mb-2">Format</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFormat('csv')}
                    className={cn(
                      'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
                      format === 'csv'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    )}
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => setFormat('json')}
                    className={cn(
                      'flex-1 px-4 py-2 rounded-lg font-medium transition-colors',
                      format === 'json'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    )}
                  >
                    JSON
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400">
                  {meetings.length} {meetings.length === 1 ? 'meeting' : 'meetings'} will be exported
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleDownload} className="flex-1">
                Download
              </Button>
              <Button
                variant="secondary"
                onClick={handleCopy}
                className="flex-1"
              >
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
