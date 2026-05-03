import { AppError } from './AppError.js';

export class ValidationError extends AppError {
  constructor(message = 'Validation error', details = null) {
    super(message, { statusCode: 400, code: 'VALIDATION_ERROR', details });
  }
}
