import { AppError } from './AppError.js';

export class ConflictError extends AppError {
  constructor(message = 'Conflict error', details = null) {
    super(message, { statusCode: 409, code: 'CONFLICT_ERROR', details });
  }
}
