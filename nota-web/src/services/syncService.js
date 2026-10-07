// =====================================================
// Sync Service — maps YouTube timestamps → measures
// =====================================================

/**
 * Find the nearest sync point at or before a given timestamp.
 * @param {number} timestamp — current playback time in seconds
 * @param {Array}  syncPoints — array of { timestamp, measure, measureId }
 * @returns {object|null} the active sync point
 */
export function findActiveSyncPoint(timestamp, syncPoints) {
  if (!syncPoints || syncPoints.length === 0) return null;
  const sorted = [...syncPoints].sort((a, b) => a.timestamp - b.timestamp);
  let active = null;
  for (const sp of sorted) {
    if (sp.timestamp <= timestamp) {
      active = sp;
    } else {
      break;
    }
  }
  return active;
}

/**
 * Format seconds as mm:ss
 */
export function formatTime(seconds) {
  if (!seconds && seconds !== 0) return '--:--';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Check if two sync states are meaningfully different
 * (avoids unnecessary re-renders on every animation frame)
 */
export function hasSyncChanged(prev, next) {
  if (!prev && !next) return false;
  if (!prev || !next) return true;
  return prev.measure !== next.measure || prev.id !== next.id;
}
