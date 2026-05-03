import { ValidationError } from '../../../shared/errors/ValidationError.js';

export class InvalidRoutePlanningError extends ValidationError {
  constructor(message, details = null) {
    super(message, details);
  }
}
