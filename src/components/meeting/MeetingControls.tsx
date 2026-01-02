import React from 'react';
import { motion } from 'framer-motion';
import { useMeetingStore } from '@/stores/meetingStore';
import { Button, IconButton } from '@/components/ui';
import { cn } from '@/utils/cn';

// Icons as simple SVG components
const PlayIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
  </svg>
);

const PauseIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
  </svg>
);

const StopIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M5.25 3A2.25 2.25 0 003 5.25v9.5A2.25 2.25 0 005.25 17h9.5A2.25 2.25 0 0017 14.75v-9.5A2.25 2.25 0 0014.75 3h-9.5z" />
  </svg>
);

const ResetIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

interface MeetingControlsProps {
  onPresentationMode?: () => void;
  className?: string;
}

export const MeetingControls: React.FC<MeetingControlsProps> = ({
  onPresentationMode,
  className,
}) => {
  const { meeting, startMeeting, pauseMeeting, resumeMeeting, endMeeting, resetMeeting } = useMeetingStore();
  const { status, attendees } = meeting;

  const canStart = status === 'setup' && attendees.length > 0;
  const isRunning = status === 'running';
  const isPaused = status === 'paused';
  const isCompleted = status === 'completed';
  const isActive = isRunning || isPaused;

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the meeting? All data will be lost.')) {
      resetMeeting();
    }
  };

  const handleEmailInstead = () => {
    endMeeting();
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {/* Primary action */}
      {canStart && (
        <Button
          onClick={startMeeting}
          leftIcon={<PlayIcon />}
          size="lg"
        >
          Start Meeting
        </Button>
      )}

      {isRunning && (
        <Button
          onClick={pauseMeeting}
          leftIcon={<PauseIcon />}
          variant="secondary"
          size="lg"
        >
          Pause
        </Button>
      )}

      {isPaused && (
        <Button
          onClick={resumeMeeting}
          leftIcon={<PlayIcon />}
          size="lg"
        >
          Resume
        </Button>
      )}

      {/* Secondary actions */}
      {isActive && (
        <>
          <Button
            onClick={endMeeting}
            leftIcon={<StopIcon />}
            variant="secondary"
          >
            End Meeting
          </Button>

          <Button
            onClick={handleEmailInstead}
            leftIcon={<EmailIcon />}
            variant="ghost"
            className="text-amber-400 hover:text-amber-300"
          >
            Should've Been an Email
          </Button>
        </>
      )}

      {/* Reset (always available unless in setup with no attendees) */}
      {(attendees.length > 0 || isCompleted) && (
        <IconButton
          variant="ghost"
          label="Reset meeting"
          onClick={handleReset}
        >
          <ResetIcon />
        </IconButton>
      )}

      {/* Presentation mode */}
      {onPresentationMode && isActive && (
        <IconButton
          variant="ghost"
          label="Presentation mode"
          onClick={onPresentationMode}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </IconButton>
      )}
    </div>
  );
};
