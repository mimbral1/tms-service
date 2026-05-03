import { ValidationError } from '../../../shared/errors/ValidationError.js';

export class InvalidRouteDispatchError extends ValidationError {
  constructor(message, details = null) {
    super(message, details);
  }
}
