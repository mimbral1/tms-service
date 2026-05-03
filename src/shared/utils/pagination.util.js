export function normalizePagination(query = {}) { return { page: Number(query.page ?? 1), pageSize: Number(query.pageSize ?? 25) }; }
