import { ValidationError } from '../../../shared/errors/ValidationError.js';

export class InvalidRouteError extends ValidationError {
  constructor(message, details = null) {
    super(message, details);
  }
}
