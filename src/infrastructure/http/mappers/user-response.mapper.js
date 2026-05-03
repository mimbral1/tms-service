export function mapUserResponse(response) {
  const data = response?.data || response;

  if (!data) return null;

  return {
    id: data.id,
    firstname: data.firstname,
    lastname: data.lastname,
    email: data.email,
    status: data.status,
  };
}

export function mapDriverUserResponse(response) {
  const data = response?.data || response;

  if (!data) return null;

  return {
    userId: data.userId || data.id,
    firstname: data.firstname,
    lastname: data.lastname,
    email: data.email,
    documentNumber: data.documentNumber || null,
    employeeId: data.employeeId || null,
    status: data.status || 'active',
  };
}
