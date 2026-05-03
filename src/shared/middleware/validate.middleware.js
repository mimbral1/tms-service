import { ValidationError } from '../errors/ValidationError.js';

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
    headers: req.headers,
  });

  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      message: issue.message,
      path: issue.path,
    }));

    return next(new ValidationError('Invalid request data', details));
  }

  req.validated = result.data;
  return next();
};
