import { isDownState } from './statusService.js';

// Compares previous/current monitor statuses (previousStatus, currentStatus) and returns 'start', 'end', or 'none'.
export function evaluateOutageTransition(previousStatus, currentStatus) {
  const previousDown = isDownState(previousStatus);
  const currentDown = isDownState(currentStatus);

  if (!previousDown && currentDown) {
    return 'start';
  }

  if (previousDown && !currentDown) {
    return 'end';
  }

  return 'none';
}

