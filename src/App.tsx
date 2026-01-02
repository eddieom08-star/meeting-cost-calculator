import React, { useState, useCallback } from 'react';
import { useMeetingStore } from '@/stores/meetingStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAccessibilityAnnouncer } from '@/hooks/useAccessibilityAnnouncer';
import { useMeetingTimer } from '@/hooks/useMeetingTimer';
import { formatCurrency, formatDurationHuman } from '@/utils/formatters';
import { CostDisplay } from '@/components/display';
import {
  MeetingControls,
  MeetingStatusBadge,
  AttendeeList,
  AddAttendeeForm,
  QuickAddBar,
  KeyboardShortcutsHelp,
} from '@/components/meeting';
import { Card, Button } from '@/components/ui';
import { PresentationView } from './views/PresentationView';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

function App() {
  const { meeting, resetMeeting } = useMeetingStore();
  const { elapsedTime, currentCost, isActive } = useMeetingTimer();
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Accessibility announcements
  useAccessibilityAnnouncer(isActive, currentCost, elapsedTime);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onToggleFullscreen: () => setIsPresentationMode(prev => !prev),
  });

  const handleExitPresentation = useCallback(() => {
    setIsPresentationMode(false);
  }, []);

  // Presentation mode (full screen cost display)
  if (isPresentationMode) {
    return <PresentationView onExit={handleExitPresentation} />;
  }

  const isSetup = meeting.status === 'setup';
  const isCompleted = meeting.status === 'completed';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Status indicator */}
        <div className="flex justify-between items-center mb-6">
          <MeetingStatusBadge status={meeting.status} />
          {meeting.attendees.length > 0 && (
            <span className="text-sm text-slate-400">
              {meeting.attendees.length} {meeting.attendees.length === 1 ? 'attendee' : 'attendees'}
            </span>
          )}
        </div>

        {/* Main cost display (show when meeting started) */}
        {!isSetup && (
          <section className="mb-8" aria-label="Meeting cost">
            <CostDisplay showComparison={!isCompleted} />
          </section>
        )}

        {/* Controls */}
        <section className="mb-8" aria-label="Meeting controls">
          <MeetingControls
            onPresentationMode={() => setIsPresentationMode(true)}
          />
        </section>

        {/* Attendee management */}
        <section aria-label="Attendee management">
          <Card className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Attendees</h2>
              {isSetup && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  {showAddForm ? 'Hide form' : '+ Add attendee'}
                </Button>
              )}
            </div>

            {/* Quick add (only in setup) */}
            {isSetup && (
              <div className="mb-4">
                <QuickAddBar />
              </div>
            )}

            {/* Add form (collapsible) */}
            {isSetup && showAddForm && (
              <div className="mb-6 p-4 bg-slate-800/50 rounded-lg">
                <AddAttendeeForm onAdd={() => setShowAddForm(false)} />
              </div>
            )}

            {/* Attendee list */}
            <AttendeeList isEditable={isSetup} />
          </Card>
        </section>

        {/* Completed meeting summary */}
        {isCompleted && (
          <section aria-label="Meeting summary">
            <Card variant="elevated">
              <h2 className="text-xl font-bold text-white mb-4">Meeting Complete</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-slate-400 text-sm">Total Cost</p>
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(currentCost)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Duration</p>
                  <p className="text-2xl font-mono text-white">
                    {formatDurationHuman(elapsedTime)}
                  </p>
                </div>
              </div>
              <Button onClick={resetMeeting}>Start New Meeting</Button>
            </Card>
          </section>
        )}

        {/* Help section */}
        <aside className="mt-12">
          <KeyboardShortcutsHelp />
        </aside>
      </main>

      <Footer />
    </div>
  );
}

export default App;
