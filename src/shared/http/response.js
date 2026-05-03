export function success(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

export function created(res, data) {
  return success(res, data, 201);
}

export function ok(res, data, meta = undefined) {
  return res.status(200).json({
    success: true,
    data,
    meta,
  });
}

export function noContent(res) {
  return res.status(204).send();
}
