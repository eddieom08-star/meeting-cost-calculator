import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { APP_CONFIG } from '@/constants/app';
import type { MeetingSummary } from '@/types';

interface HistoryState {
  meetings: MeetingSummary[];
  addMeeting: (meeting: MeetingSummary) => void;
  clearHistory: () => void;
  totalCost: () => number;
  averageCost: () => number;
  thisWeekCost: () => number;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      meetings: [],

      addMeeting: (meeting: MeetingSummary) =>
        set((state) => {
          // Ensure endedAt is set (fallback to completedAt for consistency)
          const meetingWithEndedAt = {
            ...meeting,
            endedAt: meeting.endedAt || meeting.completedAt,
            id: meeting.id || meeting.meetingId,
          };
          const newMeetings = [meetingWithEndedAt, ...state.meetings].slice(
            0,
            APP_CONFIG.maxHistoryItems
          );
          return { meetings: newMeetings };
        }),

      clearHistory: () => set({ meetings: [] }),

      totalCost: () => {
        const { meetings } = get();
        return meetings.reduce((sum, m) => sum + m.totalCost, 0);
      },

      averageCost: () => {
        const { meetings } = get();
        if (meetings.length === 0) return 0;
        return get().totalCost() / meetings.length;
      },

      thisWeekCost: () => {
        const { meetings } = get();
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        return meetings
          .filter((m) => m.endedAt > oneWeekAgo)
          .reduce((sum, m) => sum + m.totalCost, 0);
      },
    }),
    {
      name: 'meeting-history',
    }
  )
);
