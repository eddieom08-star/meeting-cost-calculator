/**
 * Generate a unique ID (good enough for client-side use)
 */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}
