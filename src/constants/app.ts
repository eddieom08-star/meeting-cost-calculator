export const APP_CONFIG = {
  name: 'Meeting Cost Calculator',
  version: '1.0.0',
  storageKeys: {
    meeting: 'mcc_current_meeting',
    history: 'mcc_meeting_history',
    settings: 'mcc_settings',
  },
  maxAttendees: 50,
  maxHistoryItems: 100,
  timerUpdateInterval: 100, // ms - for smooth counter
  announcementInterval: 300000, // 5 min - for a11y
} as const

export const CURRENCY_CONFIG = {
  locale: 'en-US',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
} as const
