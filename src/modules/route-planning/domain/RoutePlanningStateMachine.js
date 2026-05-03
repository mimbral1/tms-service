import { ForbiddenTransitionError } from '../../../shared/errors/ForbiddenTransitionError.js';

const allowedTransitions = {
  processing: ['pendingConfirmation', 'planningError', 'cancelled'],
  pendingConfirmation: ['creatingRoutes', 'cancelled', 'planningError'],
  creatingRoutes: ['routesCreated', 'routesPartiallyCreated', 'routeCreationFailed'],
  routesCreated: [],
  routesPartiallyCreated: [],
  routeCreationFailed: [],
  planningError: ['processing', 'cancelled'],
  cancelled: [],
};

export function assertRoutePlanningTransition(fromStatus, toStatus) {
  const allowed = allowedTransitions[fromStatus] || [];

  if (!allowed.includes(toStatus)) {
    throw new ForbiddenTransitionError(fromStatus, toStatus);
  }
}
