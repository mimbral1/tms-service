import { ValidationError } from '../../../shared/errors/ValidationError.js';

export class InvalidRouteCapacityError extends ValidationError {
  constructor(message, details = null) {
    super(message, details);
  }
}
