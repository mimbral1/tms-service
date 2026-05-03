import { ValidationError } from '../../../shared/errors/ValidationError.js';

export class InvalidVehicleError extends ValidationError {
  constructor(message, details = null) {
    super(message, details);
  }
}
