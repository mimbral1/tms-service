import { ValidationError } from '../../../shared/errors/ValidationError.js';

export class InvalidDriverError extends ValidationError {
  constructor(message, details = null) {
    super(message, details);
  }
}
