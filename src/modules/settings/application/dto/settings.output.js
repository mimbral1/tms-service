export function settingsOutput(setting) {
  if (!setting) return null;

  return {
    id: setting.id,
    entity: setting.entity,
    settings: setting.settings,
    dateCreated: setting.dateCreated,
    dateModified: setting.dateModified,
  };
}
