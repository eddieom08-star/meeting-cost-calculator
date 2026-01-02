import type { RolePreset, RoleType } from '@/types/meeting'

export const ROLE_PRESETS: RolePreset[] = [
  { type: 'junior_engineer', label: 'Junior Engineer', hourlyRateCents: 7500, icon: '👨‍💻' },
  { type: 'senior_engineer', label: 'Senior Engineer', hourlyRateCents: 9500, icon: '👩‍💻' },
  { type: 'engineering_manager', label: 'Engineering Manager', hourlyRateCents: 12000, icon: '👔' },
  { type: 'product_manager', label: 'Product Manager', hourlyRateCents: 11000, icon: '📊' },
  { type: 'designer', label: 'Designer', hourlyRateCents: 8500, icon: '🎨' },
  { type: 'director', label: 'Director', hourlyRateCents: 15000, icon: '📈' },
  { type: 'vp', label: 'VP', hourlyRateCents: 20000, icon: '🏢' },
  { type: 'c_suite', label: 'C-Suite', hourlyRateCents: 35000, icon: '👑' },
  { type: 'custom', label: 'Custom', hourlyRateCents: 0, icon: '✏️' },
]

export const DEFAULT_ROLE: RoleType = 'senior_engineer'
