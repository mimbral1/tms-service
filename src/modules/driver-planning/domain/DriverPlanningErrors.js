import { ValidationError } from '../../../shared/errors/ValidationError.js';

export class InvalidDriverPlanningError extends ValidationError {
  constructor(message, details = null) {
    super(message, details);
  }
}
