export function buildUpdateSettingsInput(data, user) {
  return {
    settings: data,
    userModified: user.id === 'system' ? null : user.id,
  };
}
