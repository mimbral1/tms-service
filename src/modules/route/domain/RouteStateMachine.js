import { ForbiddenTransitionError } from '../../../shared/errors/ForbiddenTransitionError.js';

const allowedTransitions = {
  created: ['scheduled', 'started', 'cancelled', 'error'],
  scheduled: ['started', 'cancelled', 'error'],
  started: ['finished', 'cancelled', 'error'],
  finished: [],
  cancelled: [],
  error: [],
};

export function assertRouteTransition(fromStatus, toStatus) {
  const allowed = allowedTransitions[fromStatus] || [];

  if (!allowed.includes(toStatus)) {
    throw new ForbiddenTransitionError(fromStatus, toStatus);
  }
}
