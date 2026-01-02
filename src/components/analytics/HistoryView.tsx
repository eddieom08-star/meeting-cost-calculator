import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useHistoryStore } from '@/stores/historyStore';
import { MeetingSummaryCard } from './MeetingSummaryCard';
import { Card, Button } from '@/components/ui';
import { formatCurrency } from '@/utils/formatters';

interface HistoryViewProps {
  onExport?: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onExport }) => {
  const { meetings, clearHistory, totalCost, averageCost, thisWeekCost } =
    useHistoryStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClear = () => {
    clearHistory();
    setShowConfirm(false);
  };

  if (meetings.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-slate-400 mb-2">No meeting history yet</p>
          <p className="text-sm text-slate-500">
            Completed meetings will appear here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Summary */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">
          Meeting Statistics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-slate-400">Total Meetings</p>
            <p className="text-2xl font-bold text-white">{meetings.length}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Total Cost</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(totalCost())}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Average Cost</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(averageCost())}
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-sm text-slate-400">This Week</p>
          <p className="text-xl font-bold text-white">
            {formatCurrency(thisWeekCost())}
          </p>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">
          Recent Meetings ({meetings.length})
        </h3>
        <div className="flex gap-2">
          {onExport && (
            <Button variant="secondary" size="sm" onClick={onExport}>
              Export
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConfirm(true)}
          >
            Clear History
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <Card variant="bordered" className="border-red-500/50 bg-red-950/20">
          <p className="text-white mb-4">
            Clear all meeting history? This cannot be undone.
          </p>
          <div className="flex gap-2">
            <Button variant="danger" size="sm" onClick={handleClear}>
              Clear All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Meeting List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {meetings.map((meeting) => (
            <MeetingSummaryCard key={meeting.id} meeting={meeting} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
