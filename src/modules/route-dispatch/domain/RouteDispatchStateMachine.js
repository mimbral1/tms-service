import { ForbiddenTransitionError } from '../../../shared/errors/ForbiddenTransitionError.js';

const allowedTransitions = {
  pending: ['readyForDispatch', 'notDispatched'],
  readyForDispatch: ['preparingForDispatch', 'notDispatched'],
  preparingForDispatch: ['dispatched', 'notDispatched'],
  dispatched: [],
  notDispatched: [],
};

export function assertRouteDispatchTransition(fromStatus, toStatus) {
  const allowed = allowedTransitions[fromStatus] || [];

  if (!allowed.includes(toStatus)) {
    throw new ForbiddenTransitionError(fromStatus, toStatus);
  }
}
