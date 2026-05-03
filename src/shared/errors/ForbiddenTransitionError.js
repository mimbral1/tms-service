import { AppError } from './AppError.js';

export class ForbiddenTransitionError extends AppError {
  constructor(fromStatus, toStatus) {
    super(`Transition from ${fromStatus} to ${toStatus} is not allowed`, {
      statusCode: 409,
      code: 'FORBIDDEN_TRANSITION',
      details: { fromStatus, toStatus },
    });
  }
}
