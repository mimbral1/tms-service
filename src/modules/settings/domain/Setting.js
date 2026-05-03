import { Entity } from '../../../shared/domain/Entity.js';

export class Setting extends Entity {
  constructor({
    id,
    entity,
    settings,
    dateCreated,
    dateModified,
    userCreated,
    userModified,
  }) {
    super(id);

    if (!entity) throw new Error('entity is required');
    if (!settings) throw new Error('settings is required');

    this.entity = entity;
    this.settings = settings;
    this.dateCreated = dateCreated || null;
    this.dateModified = dateModified || null;
    this.userCreated = userCreated || null;
    this.userModified = userModified || null;
  }
}
